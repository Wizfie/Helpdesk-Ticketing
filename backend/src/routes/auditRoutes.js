import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles(['ADMIN']), getAuditLogs);

export default router;
