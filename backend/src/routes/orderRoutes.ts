import { Router } from 'express';
import { 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus,
    createOrder,
    getMyOrders
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Customer Order Endpoints (require login)
router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getMyOrders);

// Admin Order Endpoints (require admin role)
router.get('/', adminMiddleware, getAllOrders);
router.get('/:id', adminMiddleware, getOrderById);
router.patch('/:id/status', adminMiddleware, updateOrderStatus);

export default router;
