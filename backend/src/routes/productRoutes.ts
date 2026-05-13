import { Router } from 'express';
import multer from 'multer';
import { createProduct, updateProduct, deleteProduct, getProductById } from '../controllers/productController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:id', getProductById);

// Protected admin routes
router.use(adminMiddleware);
router.post('/', upload.single('image'), createProduct);
router.patch('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
