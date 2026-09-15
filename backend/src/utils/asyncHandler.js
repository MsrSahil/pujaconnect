/**
 * Wraps an async route handler to catch errors and pass them to Express error middleware.
 * Eliminates repeated try/catch blocks in controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
