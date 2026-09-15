import Availability from '../models/Availability.model.js';
import ApiError from '../utils/apiError.js';

/**
 * Parse "HH:MM" into total minutes for comparison.
 */
const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Validate that endTime > startTime for every slot,
 * and that no slots overlap each other.
 */
const validateSlots = (slots) => {
  for (const slot of slots) {
    if (timeToMinutes(slot.endTime) <= timeToMinutes(slot.startTime)) {
      throw new ApiError(
        422,
        `Invalid slot: endTime (${slot.endTime}) must be after startTime (${slot.startTime})`
      );
    }
  }

  // Sort by start time and check for overlaps
  const sorted = [...slots].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  for (let i = 1; i < sorted.length; i++) {
    if (timeToMinutes(sorted[i].startTime) < timeToMinutes(sorted[i - 1].endTime)) {
      throw new ApiError(
        422,
        `Overlapping slots detected: ${sorted[i - 1].startTime}-${sorted[i - 1].endTime} and ${sorted[i].startTime}-${sorted[i].endTime}`
      );
    }
  }
};

/**
 * Set availability for a pandit on a specific date.
 * If availability for that date already exists, replaces the unbooked slots
 * and preserves any already-booked slots.
 */
export const setAvailability = async (panditId, date, slots) => {
  validateSlots(slots);

  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  // Check if availability already exists for this date
  const existing = await Availability.findOne({
    panditId,
    date: normalizedDate,
  });

  if (existing) {
    // Preserve already-booked slots, replace the rest
    const bookedSlots = existing.slots.filter((s) => s.isBooked);

    // Validate new slots don't overlap with booked slots
    for (const newSlot of slots) {
      for (const booked of bookedSlots) {
        const newStart = timeToMinutes(newSlot.startTime);
        const newEnd = timeToMinutes(newSlot.endTime);
        const bookedStart = timeToMinutes(booked.startTime);
        const bookedEnd = timeToMinutes(booked.endTime);

        if (newStart < bookedEnd && newEnd > bookedStart) {
          throw new ApiError(
            409,
            `Cannot modify slot ${booked.startTime}-${booked.endTime} — it is already booked`
          );
        }
      }
    }

    // Merge: booked slots + new unbooked slots
    const newSlots = slots.map((s) => ({
      startTime: s.startTime,
      endTime: s.endTime,
      isBooked: false,
    }));

    existing.slots = [...bookedSlots, ...newSlots];
    await existing.save();
    return existing;
  }

  // Create new availability document
  const availability = await Availability.create({
    panditId,
    date: normalizedDate,
    slots: slots.map((s) => ({
      startTime: s.startTime,
      endTime: s.endTime,
      isBooked: false,
    })),
  });

  return availability;
};

/**
 * Get availability for a pandit, optionally filtered by date range.
 */
export const getAvailability = async (panditId, { from, to } = {}) => {
  const filter = { panditId };

  if (from || to) {
    filter.date = {};
    if (from) {
      const fromDate = new Date(from);
      fromDate.setUTCHours(0, 0, 0, 0);
      filter.date.$gte = fromDate;
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setUTCHours(23, 59, 59, 999);
      filter.date.$lte = toDate;
    }
  } else {
    // Default: only show today and future
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    filter.date = { $gte: today };
  }

  const availability = await Availability.find(filter).sort({ date: 1 });
  return availability;
};

/**
 * Delete availability for a specific date (only unbooked dates).
 */
export const deleteAvailability = async (panditId, date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  const existing = await Availability.findOne({
    panditId,
    date: normalizedDate,
  });

  if (!existing) {
    throw new ApiError(404, 'No availability found for this date');
  }

  const hasBookedSlots = existing.slots.some((s) => s.isBooked);
  if (hasBookedSlots) {
    throw new ApiError(
      409,
      'Cannot delete availability — some slots are already booked. Please manage individual bookings first.'
    );
  }

  await existing.deleteOne();
  return true;
};
