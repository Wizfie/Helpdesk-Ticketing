import express from 'express';
import {
  getTickets,
  getTicketById,
  getPublicTicketByToken,
  createTicket,
  assignEngineer,
  escalateTicket,
  pauseSla,
  resumeSla,
  addMilestone,
  resolveTicket,
  closeTicket,
  uploadAttachment
} from '../controllers/ticketController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public Customer Self-Service Tracking (No Login Required, Protected by Token)
router.get('/track/:ticketNumber', getPublicTicketByToken);

// Internal Authenticated Routes
router.get('/', authenticate, getTickets);
router.get('/:id', authenticate, getTicketById);
router.post('/', authenticate, authorizeRoles(['ADMIN']), createTicket);
router.patch('/:id/assign', authenticate, authorizeRoles(['ADMIN']), assignEngineer);
router.patch('/:id/escalate', authenticate, escalateTicket);
router.post('/:id/pause-sla', authenticate, pauseSla);
router.post('/:id/resume-sla', authenticate, resumeSla);
router.post('/:id/milestones', authenticate, addMilestone);
router.patch('/:id/resolve', authenticate, resolveTicket);
router.patch('/:id/close', authenticate, authorizeRoles(['ADMIN']), closeTicket);
router.post('/:id/attachments', authenticate, upload.single('file'), uploadAttachment);

export default router;
