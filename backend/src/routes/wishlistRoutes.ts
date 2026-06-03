import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, syncWishlist } from '../controllers/wishlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all wishlist routes
router.use(authMiddleware);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/sync', syncWishlist);
router.delete('/items/:variantId', removeFromWishlist);

export default router;
