import express from 'express';
import { createUser, getUser, registerClerkUser, updateUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/:clerkId', getUser);
router.post('/clerk-register', registerClerkUser);
router.put('/update-profile', updateUserProfile);

export default router;
