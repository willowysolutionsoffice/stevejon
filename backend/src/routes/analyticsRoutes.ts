import { Router } from 'express';
import { getSalesMetrics, getTopSellingProducts, getSalesByDateRange, getDashboardSummary, getRecentOrders } from '../controllers/analyticsController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Admin only
router.use(adminMiddleware);

router.get('/metrics', getSalesMetrics);
router.get('/top-products', getTopSellingProducts);
router.get('/sales-chart', getSalesByDateRange);
router.get('/summary', getDashboardSummary);
router.get('/recent-orders', getRecentOrders);

export default router;
