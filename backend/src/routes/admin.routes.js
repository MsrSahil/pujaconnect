import { Router } from 'express';
import {
  getPendingPandits,
  verifyPandit,
  getAllUsers,
} from '../controllers/admin.controller.js';
import {
  createPuja,
  updatePuja,
  deletePuja,
  getAllPujas,
} from '../controllers/puja.controller.js';
import { getAllBookings } from '../controllers/booking.controller.js';
import protect from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/role.middleware.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

// Pandit verification
router.get('/pandits/pending', getPendingPandits);
router.patch('/pandits/:id/verify', verifyPandit);

// Bookings (Monitoring)
router.get('/bookings', getAllBookings);

// Puja catalog CRUD
router.get('/pujas', getAllPujas);
router.post('/pujas', createPuja);
router.put('/pujas/:id', updatePuja);
router.delete('/pujas/:id', deletePuja);

// Users
router.get('/users', getAllUsers);

export default router;
