import { Router } from 'express';
import { getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory } from '../controllers/subcategoryController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getSubcategories);

// Admin routes
router.use(adminMiddleware);
router.post('/', createSubcategory);
router.patch('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);

export default router;
