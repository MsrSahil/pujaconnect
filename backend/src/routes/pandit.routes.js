import { Router } from 'express';
import {
  getPandits,
  getPanditById,
  getMyProfile,
  updateMyProfile,
  setMyAvailability,
  getMyAvailability,
  deleteMyAvailability,
  getPanditAvailability,
} from '../controllers/pandit.controller.js';
import { getPanditBookings } from '../controllers/booking.controller.js';
import protect from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';

const router = Router();

// Public — browse pandits
router.get('/', getPandits);

// Private — pandit self-management (must be before /:id routes)
router.get('/me', protect, authorize('pandit'), getMyProfile);
router.put('/me', protect, authorize('pandit'), updateMyProfile);
router.post('/me/availability', protect, authorize('pandit'), setMyAvailability);
router.get('/me/availability', protect, authorize('pandit'), getMyAvailability);
router.delete('/me/availability', protect, authorize('pandit'), deleteMyAvailability);
router.get('/me/bookings', protect, authorize('pandit'), getPanditBookings);

// Public — view pandit profile and availability
router.get('/:id', getPanditById);
router.get('/:id/availability', getPanditAvailability);

export default router;
