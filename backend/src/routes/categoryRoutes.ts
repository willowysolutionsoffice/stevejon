import { Router } from 'express';
import multer from 'multer';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { getSubcategoriesByCategory } from '../controllers/subcategoryController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getCategories);
router.get('/:categoryId/subcategories', getSubcategoriesByCategory);

// Admin routes
router.use(adminMiddleware);
router.post('/', upload.single('image'), createCategory);
router.patch('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
