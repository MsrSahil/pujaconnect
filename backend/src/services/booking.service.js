import Availability from '../models/Availability.model.js';
import Booking from '../models/Booking.model.js';
import Pandit from '../models/Pandit.model.js';
import Puja from '../models/Puja.model.js';
import ApiError from '../utils/apiError.js';

/**
 * Create a booking with atomic double-booking prevention.
 *
 * Uses MongoDB's findOneAndUpdate with an array filter to atomically
 * claim a slot (set isBooked: true) only if it is currently unbooked.
 * If two requests race for the same slot, only one will succeed —
 * the other will get null back and receive a 409 Conflict.
 */
export const createBooking = async ({
  userId,
  panditId,
  pujaId,
  date,
  timeSlot,
  locationType,
  address,
}) => {
  // ── 1. Validate pandit exists and is verified ──
  const pandit = await Pandit.findById(panditId);
  if (!pandit) {
    throw new ApiError(404, 'Pandit not found');
  }
  if (pandit.verificationStatus !== 'verified') {
    throw new ApiError(400, 'This pandit is not yet verified for bookings');
  }

  // ── 2. Validate puja exists ──
  const puja = await Puja.findById(pujaId);
  if (!puja) {
    throw new ApiError(404, 'Puja not found');
  }

  // ── 3. Validate location type compatibility ──
  if (puja.locationType !== 'both' && puja.locationType !== locationType) {
    throw new ApiError(
      400,
      `This puja is only available for "${puja.locationType}" location`
    );
  }

  // ── 4. Validate address for home bookings ──
  if (locationType === 'home' && (!address || !address.trim())) {
    throw new ApiError(422, 'Address is required for home-based pujas');
  }

  // ── 5. Normalize date ──
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  // ── 6. ATOMIC slot claim ──
  // This is the critical double-booking prevention:
  // findOneAndUpdate atomically finds the availability doc for this pandit+date,
  // locates the specific slot matching the requested time with isBooked=false,
  // and sets isBooked=true — all in a single atomic operation.
  //
  // If the slot is already booked (isBooked=true), the filter won't match
  // and the update returns null, preventing the double booking.
  const claimedAvailability = await Availability.findOneAndUpdate(
    {
      panditId,
      date: normalizedDate,
      slots: {
        $elemMatch: {
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          isBooked: false,
        },
      },
    },
    {
      $set: { 'slots.$[slot].isBooked': true },
    },
    {
      arrayFilters: [
        {
          'slot.startTime': timeSlot.startTime,
          'slot.endTime': timeSlot.endTime,
          'slot.isBooked': false,
        },
      ],
      new: true,
    }
  );

  if (!claimedAvailability) {
    throw new ApiError(
      409,
      'This time slot is not available or has already been booked. Please select a different slot.'
    );
  }

  // ── 7. Create the booking record ──
  const booking = await Booking.create({
    userId,
    panditId,
    pujaId,
    date: normalizedDate,
    timeSlot: {
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
    },
    locationType,
    address: locationType === 'home' ? address.trim() : undefined,
    status: 'pending',
  });

  return booking;
};

/**
 * Release a slot back to available when a booking is rejected or cancelled.
 */
export const releaseSlot = async (panditId, date, timeSlot) => {
  const normalizedDate = new Date(date);
  normalizedDate.setUTCHours(0, 0, 0, 0);

  await Availability.findOneAndUpdate(
    {
      panditId,
      date: normalizedDate,
    },
    {
      $set: { 'slots.$[slot].isBooked': false },
    },
    {
      arrayFilters: [
        {
          'slot.startTime': timeSlot.startTime,
          'slot.endTime': timeSlot.endTime,
        },
      ],
    }
  );
};

/**
 * Update booking status with validation of allowed transitions.
 */
export const updateBookingStatus = async (bookingId, newStatus, panditUserId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Verify this pandit owns this booking
  const pandit = await Pandit.findOne({ userId: panditUserId });
  if (!pandit || booking.panditId.toString() !== pandit._id.toString()) {
    throw new ApiError(403, 'You are not authorized to manage this booking');
  }

  // Validate status transitions
  const allowedTransitions = {
    pending: ['accepted', 'rejected'],
    accepted: ['completed', 'cancelled'],
  };

  const allowed = allowedTransitions[booking.status];
  if (!allowed || !allowed.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot transition from "${booking.status}" to "${newStatus}"`
    );
  }

  // Release the slot if rejecting or cancelling
  if (newStatus === 'rejected' || newStatus === 'cancelled') {
    await releaseSlot(booking.panditId, booking.date, booking.timeSlot);
  }

  booking.status = newStatus;
  await booking.save();

  return booking;
};
