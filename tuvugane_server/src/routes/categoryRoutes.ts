import express from 'express';
import { 
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getCategories);

// Protected routes (super admin only)
router.post('/', protect, createCategory);
router.get('/:id', protect, getCategoryById);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

export default router; 