import { Router } from 'express';
import { getSalesMetrics, getTopSellingProducts, getSalesByDateRange } from '../controllers/analyticsController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Admin only
router.use(adminMiddleware);

router.get('/metrics', getSalesMetrics);
router.get('/top-products', getTopSellingProducts);
// Correct name for chart data
router.get('/sales-chart', getSalesByDateRange);

export default router;
