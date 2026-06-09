import { Router } from 'express';
import multer from 'multer';
import {
    getAllDrawCampaigns,
    createDrawCampaign,
    updateDrawCampaign,
    deleteDrawCampaign,
    getDrawCampaignTickets,
    drawCampaignWinners,
    getWinnersShowcase,
    updateWinnerShowcase
} from '../controllers/drawCampaignController.js';
import { adminMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all routes under this router for admin access
router.use(adminMiddleware);

// Public showcase endpoint (for user homepage)
router.get('/showcase', getWinnersShowcase);

router.get('/', getAllDrawCampaigns);
router.post('/', upload.single('prizeImage'), createDrawCampaign);
router.get('/:id/tickets', getDrawCampaignTickets);
router.post('/:id/draw-winners', drawCampaignWinners);
router.patch('/:id', upload.single('prizeImage'), updateDrawCampaign);
router.delete('/:id', deleteDrawCampaign);

// Winner showcase upload (admin)
router.patch('/winners/:ticketId/showcase', upload.single('winnerImage'), updateWinnerShowcase);

export default router;


