import { Router } from 'express';
import multer from 'multer';
import {
    getAllDrawCampaigns,
    createDrawCampaign,
    updateDrawCampaign,
    deleteDrawCampaign,
    getDrawCampaignTickets
} from '../controllers/drawCampaignController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes under this router for admin access
router.use(adminMiddleware);

router.get('/', getAllDrawCampaigns);
router.post('/', upload.single('prizeImage'), createDrawCampaign);
router.get('/:id/tickets', getDrawCampaignTickets);
router.patch('/:id', upload.single('prizeImage'), updateDrawCampaign);
router.delete('/:id', deleteDrawCampaign);

export default router;

