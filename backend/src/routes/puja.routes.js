import { Router } from 'express';
import { getAllPujas, getPujaById } from '../controllers/puja.controller.js';

const router = Router();

// Public — browse puja catalog
router.get('/', getAllPujas);
router.get('/:id', getPujaById);

export default router;
