import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { resetClean, resetSeed, getStatus } from '../controllers/systemController.js';

const router = express.Router();

// System Status (Public or Authenticated)
router.get('/status', getStatus);

// Reset database to Clean Mode (0 Tickets)
router.post('/reset-clean', authenticate, resetClean);

// Re-seed database with 156 realistic tickets and complete master data
router.post('/reset-seed', authenticate, resetSeed);

export default router;
