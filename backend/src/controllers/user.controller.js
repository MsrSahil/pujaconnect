import User from '../models/User.model.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get current user profile (alias for auth/me, but under /users)
 * @route   GET /api/v1/users/me
 * @access  Private
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  new ApiResponse(200, 'User profile retrieved', { user }).send(res);
});
