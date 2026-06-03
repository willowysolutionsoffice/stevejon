import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, syncCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all cart routes
router.use(authMiddleware);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCartItem);
router.post('/sync', syncCart);
router.delete('/', clearCart);
router.delete('/items/:variantId', removeFromCart);

export default router;
