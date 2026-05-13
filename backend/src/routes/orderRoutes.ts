import { Router } from 'express';
import { getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// All order routes are admin only
router.use(adminMiddleware);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
