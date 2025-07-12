import express from 'express';
import { createUser, getUser, registerClerkUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:clerkId', getUser);
router.post('/clerk-register', registerClerkUser);

export default router;
