import { Router } from 'express';
import { 
    getProfile, 
    updateProfile, 
    getAddresses, 
    createAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
} from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all profile & address routes
router.use(authMiddleware);

// Profile detail endpoints
router.get('/', getProfile);
router.put('/', updateProfile);

// Address book endpoints
router.get('/addresses', getAddresses);
router.post('/addresses', createAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.put('/addresses/:id/default', setDefaultAddress);

export default router;
