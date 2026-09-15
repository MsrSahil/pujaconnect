import Booking from '../models/Booking.model.js';
import Pandit from '../models/Pandit.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as bookingService from '../services/booking.service.js';

/**
 * @desc    Create a new booking request
 * @route   POST /api/v1/bookings
 * @access  Private (user only)
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { panditId, pujaId, date, timeSlot, locationType, address } = req.body;

  const booking = await bookingService.createBooking({
    userId: req.user._id,
    panditId,
    pujaId,
    date,
    timeSlot,
    locationType,
    address,
  });

  const populated = await Booking.findById(booking._id)
    .populate({
      path: 'panditId',
      populate: { path: 'userId', select: 'name email phone' },
    })
    .populate('pujaId', 'name category durationMinutes priceRange');

  new ApiResponse(201, 'Booking request created successfully', {
    booking: populated,
  }).send(res);
});

/**
 * @desc    Get current user's booking history
 * @route   GET /api/v1/bookings/my
 * @access  Private (user)
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = { userId: req.user._id };
  if (status) {
    filter.status = status;
  }

  const bookings = await Booking.find(filter)
    .populate({
      path: 'panditId',
      populate: { path: 'userId', select: 'name email phone' },
    })
    .populate('pujaId', 'name category durationMinutes priceRange')
    .sort({ createdAt: -1 });

  new ApiResponse(200, 'Booking history retrieved', {
    count: bookings.length,
    bookings,
  }).send(res);
});

/**
 * @desc    Get bookings for the logged-in pandit
 * @route   GET /api/v1/pandits/me/bookings
 * @access  Private (pandit only)
 */
export const getPanditBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const pandit = await Pandit.findOne({ userId: req.user._id });
  if (!pandit) {
    throw new ApiError(404, 'Pandit profile not found');
  }

  const filter = { panditId: pandit._id };
  if (status) {
    filter.status = status;
  }

  const bookings = await Booking.find(filter)
    .populate('userId', 'name email phone')
    .populate('pujaId', 'name category durationMinutes priceRange')
    .sort({ date: 1, createdAt: -1 });

  new ApiResponse(200, 'Pandit bookings retrieved', {
    count: bookings.length,
    bookings,
  }).send(res);
});

/**
 * @desc    Accept a booking
 * @route   PATCH /api/v1/bookings/:id/accept
 * @access  Private (pandit only)
 */
export const acceptBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    'accepted',
    req.user._id
  );

  const populated = await Booking.findById(booking._id)
    .populate('userId', 'name email phone')
    .populate('pujaId', 'name category durationMinutes priceRange');

  new ApiResponse(200, 'Booking accepted', { booking: populated }).send(res);
});

/**
 * @desc    Reject a booking
 * @route   PATCH /api/v1/bookings/:id/reject
 * @access  Private (pandit only)
 */
export const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    'rejected',
    req.user._id
  );

  const populated = await Booking.findById(booking._id)
    .populate('userId', 'name email phone')
    .populate('pujaId', 'name category durationMinutes priceRange');

  new ApiResponse(200, 'Booking rejected', { booking: populated }).send(res);
});

/**
 * @desc    Get all bookings (admin monitoring / disputes)
 * @route   GET /api/v1/admin/bookings
 * @access  Private (admin only)
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, panditId, userId } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (panditId) filter.panditId = panditId;
  if (userId) filter.userId = userId;

  const bookings = await Booking.find(filter)
    .populate('userId', 'name email phone')
    .populate({
      path: 'panditId',
      populate: { path: 'userId', select: 'name email phone' },
    })
    .populate('pujaId', 'name category durationMinutes priceRange')
    .sort({ createdAt: -1 });

  new ApiResponse(200, 'All bookings retrieved', {
    count: bookings.length,
    bookings,
  }).send(res);
});
