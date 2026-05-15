import { Router } from 'express';
import { getOfferSlides, createOfferSlide, deleteOfferSlide, updateOfferSlide } from '../controllers/offerSlideController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getOfferSlides);

// Admin only
router.use(adminMiddleware);
router.post('/', upload.single('image'), createOfferSlide);
router.patch('/:id', upload.single('image'), updateOfferSlide);
router.delete('/:id', deleteOfferSlide);

export default router;
