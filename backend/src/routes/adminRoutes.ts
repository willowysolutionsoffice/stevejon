import { Router } from 'express';
import { getAdminProfile, resetPassword } from '../controllers/adminController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Admin only
router.use(adminMiddleware);

router.get('/profile', getAdminProfile);
router.post('/reset-password', resetPassword);

export default router;
