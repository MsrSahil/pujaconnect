import Pandit from '../models/Pandit.model.js';
import User from '../models/User.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all pandits with pending verification
 * @route   GET /api/v1/admin/pandits/pending
 * @access  Private (admin only)
 */
export const getPendingPandits = asyncHandler(async (_req, res) => {
  const pandits = await Pandit.find({ verificationStatus: 'pending' })
    .populate('userId', 'name email phone createdAt')
    .sort({ createdAt: 1 }); // oldest first

  new ApiResponse(200, 'Pending pandits retrieved', {
    count: pandits.length,
    pandits,
  }).send(res);
});

/**
 * @desc    Verify or reject a pandit
 * @route   PATCH /api/v1/admin/pandits/:id/verify
 * @access  Private (admin only)
 */
export const verifyPandit = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['verified', 'rejected'].includes(status)) {
    throw new ApiError(
      422,
      'Status is required and must be either "verified" or "rejected"'
    );
  }

  const pandit = await Pandit.findById(req.params.id);

  if (!pandit) {
    throw new ApiError(404, 'Pandit not found');
  }

  pandit.verificationStatus = status;
  await pandit.save();

  const updatedPandit = await Pandit.findById(pandit._id).populate(
    'userId',
    'name email phone'
  );

  new ApiResponse(200, `Pandit ${status} successfully`, {
    pandit: updatedPandit,
  }).send(res);
});

/**
 * @desc    Get all users (admin overview)
 * @route   GET /api/v1/admin/users
 * @access  Private (admin only)
 */
export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 });

  new ApiResponse(200, 'All users retrieved', {
    count: users.length,
    users,
  }).send(res);
});
