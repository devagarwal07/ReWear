import express from 'express';
import { getDashboard, getAdminDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/:clerkId', getDashboard);
router.get('/admin', getAdminDashboard);

export default router;
