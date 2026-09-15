import { validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';

/**
 * Middleware to check express-validator results.
 * If validation errors exist, throws an ApiError with the details.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    throw new ApiError(422, 'Validation failed', extractedErrors);
  }

  next();
};

export default validate;
