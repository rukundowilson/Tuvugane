import express from 'express';
import { 
  createAgency,
  getAgencies,
  getAgencyById,
  updateAgency,
  deleteAgency
} from '../controllers/agencyController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected and require authentication
router.post('/', protect, createAgency);
router.get('/', protect, getAgencies);
router.get('/:id', protect, getAgencyById);
router.put('/:id', protect, updateAgency);
router.delete('/:id', protect, deleteAgency);

export default router; 