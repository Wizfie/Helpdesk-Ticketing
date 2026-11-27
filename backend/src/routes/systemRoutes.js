import express from 'express';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { resetClean, resetSeed, getStatus } from '../controllers/systemController.js';

const router = express.Router();

// System Status (Authenticated)
router.get('/status', authenticate, getStatus);

// Dev-only DB reset endpoints (blocked in NODE_ENV=production)
router.post('/reset-clean', authenticate, authorizeRoles(['ADMIN']), resetClean);
router.post('/reset-seed', authenticate, authorizeRoles(['ADMIN']), resetSeed);

export default router;
