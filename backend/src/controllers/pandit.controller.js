import Pandit from '../models/Pandit.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as availabilityService from '../services/availability.service.js';

/**
 * @desc    Browse / filter pandits (only verified pandits are shown)
 * @route   GET /api/v1/pandits?location=&pujaType=&experience=&language=
 * @access  Public
 */
export const getPandits = asyncHandler(async (req, res) => {
  const { location, city, pujaType, experience, language } = req.query;

  const filter = { verificationStatus: 'verified' };

  // Filter by city/location (case-insensitive partial match)
  const searchLocation = location || city;
  if (searchLocation) {
    filter['location.city'] = { $regex: searchLocation, $options: 'i' };
  }

  // Filter by supported puja/ritual type (ObjectId)
  if (pujaType) {
    filter.supportedRituals = pujaType;
  }

  // Filter by minimum experience
  if (experience) {
    const minExp = parseInt(experience, 10);
    if (!isNaN(minExp)) {
      filter.experienceYears = { $gte: minExp };
    }
  }

  // Filter by language spoken (case-insensitive)
  if (language) {
    filter.languagesSpoken = { $regex: language, $options: 'i' };
  }

  const pandits = await Pandit.find(filter)
    .populate('userId', 'name email phone')
    .populate('supportedRituals', 'name category priceRange')
    .sort({ experienceYears: -1 });

  new ApiResponse(200, 'Pandits retrieved successfully', {
    count: pandits.length,
    pandits,
  }).send(res);
});

/**
 * @desc    Get single pandit profile by ID
 * @route   GET /api/v1/pandits/:id
 * @access  Public
 */
export const getPanditById = asyncHandler(async (req, res) => {
  const pandit = await Pandit.findById(req.params.id)
    .populate('userId', 'name email phone')
    .populate('supportedRituals', 'name description durationMinutes requiredMaterials priceRange locationType category');

  if (!pandit) {
    throw new ApiError(404, 'Pandit not found');
  }

  new ApiResponse(200, 'Pandit profile retrieved', { pandit }).send(res);
});

/**
 * @desc    Update own pandit profile (profile, rituals, pricing)
 * @route   PUT /api/v1/pandits/me
 * @access  Private (pandit only)
 */
export const updateMyProfile = asyncHandler(async (req, res) => {
  const {
    location,
    experienceYears,
    languagesSpoken,
    bio,
    photoUrl,
    supportedRituals,
  } = req.body;

  const pandit = await Pandit.findOne({ userId: req.user._id });

  if (!pandit) {
    throw new ApiError(404, 'Pandit profile not found. Please contact support.');
  }

  // Update only provided fields
  if (location) {
    if (location.city !== undefined) pandit.location.city = location.city;
    if (location.state !== undefined) pandit.location.state = location.state;
  }
  if (experienceYears !== undefined) pandit.experienceYears = experienceYears;
  if (languagesSpoken !== undefined) pandit.languagesSpoken = languagesSpoken;
  if (bio !== undefined) pandit.bio = bio;
  if (photoUrl !== undefined) pandit.photoUrl = photoUrl;
  if (supportedRituals !== undefined) pandit.supportedRituals = supportedRituals;

  await pandit.save();

  const updatedPandit = await Pandit.findById(pandit._id)
    .populate('userId', 'name email phone')
    .populate('supportedRituals', 'name category priceRange');

  new ApiResponse(200, 'Profile updated successfully', {
    pandit: updatedPandit,
  }).send(res);
});

/**
 * @desc    Get logged in pandit profile
 * @route   GET /api/v1/pandits/me
 * @access  Private (pandit only)
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const pandit = await Pandit.findOne({ userId: req.user._id })
    .populate('userId', 'name email phone')
    .populate('supportedRituals', 'name category priceRange description durationMinutes locationType');

  if (!pandit) {
    throw new ApiError(404, 'Pandit profile not found');
  }

  new ApiResponse(200, 'Pandit profile retrieved', { pandit }).send(res);
});

// ─── Availability Management ──────────────────────────────────

/**
 * Helper: get the Pandit document for the logged-in user.
 */
const getMyPanditDoc = async (userId) => {
  const pandit = await Pandit.findOne({ userId });
  if (!pandit) {
    throw new ApiError(404, 'Pandit profile not found');
  }
  return pandit;
};

/**
 * @desc    Set availability slots for a date
 * @route   POST /api/v1/pandits/me/availability
 * @access  Private (pandit only)
 */
export const setMyAvailability = asyncHandler(async (req, res) => {
  const { date, slots } = req.body;

  if (!date) {
    throw new ApiError(422, 'Date is required');
  }
  if (!slots || !Array.isArray(slots) || slots.length === 0) {
    throw new ApiError(422, 'At least one time slot is required');
  }

  const pandit = await getMyPanditDoc(req.user._id);
  const availability = await availabilityService.setAvailability(
    pandit._id,
    date,
    slots
  );

  new ApiResponse(201, 'Availability set successfully', { availability }).send(
    res
  );
});

/**
 * @desc    Get own availability (pandit dashboard)
 * @route   GET /api/v1/pandits/me/availability
 * @access  Private (pandit only)
 */
export const getMyAvailability = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const pandit = await getMyPanditDoc(req.user._id);
  const availability = await availabilityService.getAvailability(pandit._id, {
    from,
    to,
  });

  new ApiResponse(200, 'Availability retrieved', {
    count: availability.length,
    availability,
  }).send(res);
});

/**
 * @desc    Delete availability for a specific date
 * @route   DELETE /api/v1/pandits/me/availability
 * @access  Private (pandit only)
 */
export const deleteMyAvailability = asyncHandler(async (req, res) => {
  const { date } = req.body;

  if (!date) {
    throw new ApiError(422, 'Date is required');
  }

  const pandit = await getMyPanditDoc(req.user._id);
  await availabilityService.deleteAvailability(pandit._id, date);

  new ApiResponse(200, 'Availability deleted successfully', null).send(res);
});

/**
 * @desc    Get a pandit's availability (public — for booking flow)
 * @route   GET /api/v1/pandits/:id/availability
 * @access  Public
 */
export const getPanditAvailability = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const availability = await availabilityService.getAvailability(
    req.params.id,
    { from, to }
  );

  new ApiResponse(200, 'Pandit availability retrieved', {
    count: availability.length,
    availability,
  }).send(res);
});
