import { Router } from 'express';
import { getInventory, batchUpdateStock } from '../controllers/inventoryController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protected admin routes
router.use(adminMiddleware);

router.get('/', getInventory);
router.post('/batch-update', batchUpdateStock);

export default router;
