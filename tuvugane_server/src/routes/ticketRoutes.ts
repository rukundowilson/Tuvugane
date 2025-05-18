import express from 'express';
import multer from 'multer';
import { 
  createTicket,
  assignTicket,
  getTicketById,
  getUserTickets
} from '../controllers/ticketController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();
const upload = multer();

// Allow anonymous ticket creation, with multer to parse multipart/form-data
router.post('/', upload.any(), createTicket);
// Protected routes
router.post('/:ticketId/assign', protect, assignTicket);
router.get('/user', protect, getUserTickets);
router.get('/:id', protect, getTicketById);
// router.put('/:id/status', protect, updateTicketStatus);

export default router; 