import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Generate a signed JWT for the given user ID and role.
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRE,
  });
};

export default generateToken;
