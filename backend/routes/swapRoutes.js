import express from 'express';
import { createSwap, getSwapsForUser, completeSwap, rejectSwap } from '../controllers/swapController.js';

const router = express.Router();

router.post('/', createSwap);
router.get('/:userId', getSwapsForUser);
router.patch('/:id/complete', completeSwap);
router.patch('/:id/reject', rejectSwap);

export default router;
