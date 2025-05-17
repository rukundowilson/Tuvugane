import express from 'express';
import { 
  registerSuperAdmin, 
  loginSuperAdmin, 
  verifySuperAdmin, 
  getSuperAdminProfile 
} from '../controllers/superAdminController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerSuperAdmin);
router.post('/login', loginSuperAdmin);
router.get('/verify/:token', verifySuperAdmin);

// Protected routes
router.get('/profile', protect, getSuperAdminProfile);

export default router; 