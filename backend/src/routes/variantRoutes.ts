import { Router } from 'express';
import multer from 'multer';
import { createVariant, updateVariant, deleteVariant } from '../controllers/variantController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Admin routes
router.use(adminMiddleware);
router.post('/', upload.array('images', 10), createVariant);
router.patch('/:id', upload.array('images', 10), updateVariant);
router.delete('/:id', deleteVariant);

export default router;
