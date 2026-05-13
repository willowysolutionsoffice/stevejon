import { Router } from 'express';
import { getOfferSlides, createOfferSlide, deleteOfferSlide } from '../controllers/offerSlideController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getOfferSlides);

// Admin only
router.use(adminMiddleware);
router.post('/', createOfferSlide);
router.delete('/:id', deleteOfferSlide);

export default router;
