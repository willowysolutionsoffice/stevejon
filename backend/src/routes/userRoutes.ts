import { Router } from 'express';
import { getAllUsers, banUser, unbanUser, getUserDetails } from '../controllers/userController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Admin only
router.use(adminMiddleware);

router.get('/', getAllUsers);
router.get('/:userId', getUserDetails);
router.post('/:userId/ban', banUser);
router.post('/:userId/unban', unbanUser);

export default router;
