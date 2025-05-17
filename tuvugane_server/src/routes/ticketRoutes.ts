import express from 'express';
import multer from 'multer';
import { 
  createTicket,
  assignTicket,
  getTicketById
} from '../controllers/ticketController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const upload = multer();

// Allow anonymous ticket creation, with multer to parse multipart/form-data
router.post('/', upload.any(), createTicket);
// Protected routes
router.post('/:ticketId/assign', protect, assignTicket);
router.get('/:id', protect, getTicketById);

export default router; 