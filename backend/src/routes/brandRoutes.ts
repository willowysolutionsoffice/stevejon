import { Router } from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getBrands);

// Admin routes
router.use(adminMiddleware);
router.post('/', createBrand);
router.patch('/:id', updateBrand);
router.delete('/:id', deleteBrand);

export default router;
