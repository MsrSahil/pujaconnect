import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  acceptBooking,
  rejectBooking,
} from '../controllers/booking.controller.js';
import protect from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createBookingValidator } from '../validators/booking.validator.js';

const router = Router();

// All booking routes require authentication
router.use(protect);

// User — create a booking
router.post('/', authorize('user'), createBookingValidator, validate, createBooking);

// User — view booking history
router.get('/my', authorize('user'), getMyBookings);

// Pandit — accept / reject a booking
router.patch('/:id/accept', authorize('pandit'), acceptBooking);
router.patch('/:id/reject', authorize('pandit'), rejectBooking);

export default router;
