import express from 'express';
import { 
  createAdmin,
  getAdmins,
  getAdminsByAgency,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  getAdminProfile
} from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/login', loginAdmin);

// Protected routes
router.post('/', protect, createAdmin);
router.get('/', protect, getAdmins);
router.get('/profile', protect, getAdminProfile);
router.get('/agency/:agencyId', protect, getAdminsByAgency);
router.get('/:id', protect, getAdminById);
router.put('/:id', protect, updateAdmin);
router.delete('/:id', protect, deleteAdmin);

export default router; 