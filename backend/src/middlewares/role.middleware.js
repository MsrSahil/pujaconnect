import ApiError from '../utils/apiError.js';

/**
 * Role-based access control middleware.
 * Usage: authorize('admin', 'pandit')
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized — please log in first');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};

export default authorize;
