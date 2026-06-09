import { Router } from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getBanners);

// Admin only
router.use(adminMiddleware);
router.post('/', upload.fields([{ name: 'image', maxCount: 1 }]), createBanner);
router.patch('/:id', upload.fields([{ name: 'image', maxCount: 1 }]), updateBanner);
router.delete('/:id', deleteBanner);

export default router;
