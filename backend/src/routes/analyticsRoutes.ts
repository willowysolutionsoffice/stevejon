import { Router } from 'express';
import { 
    getSalesMetrics, 
    getTopSellingProducts, 
    getSalesByDateRange, 
    getDashboardSummary, 
    getRecentOrders,
    getLowStockProducts,
    getOrdersSummary,
    getFilterOptions,
    getDrawAnalytics,
    getCustomerAnalytics,
    getWinnerAnalytics
} from '../controllers/analyticsController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Admin only
router.use(adminMiddleware);

router.get('/metrics', getSalesMetrics);
router.get('/sales-metrics', getSalesMetrics); // Alias for metrics
router.get('/top-products', getTopSellingProducts);
router.get('/sales-chart', getSalesByDateRange);
router.get('/summary', getDashboardSummary);
router.get('/recent-orders', getRecentOrders);
router.get('/low-stock', getLowStockProducts);
router.get('/orders-summary', getOrdersSummary);
router.get('/filters', getFilterOptions);
router.get('/draw-analytics', getDrawAnalytics);
router.get('/customers-report', getCustomerAnalytics);
router.get('/winners-report', getWinnerAnalytics);

export default router;
