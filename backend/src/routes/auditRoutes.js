import express from 'express';
import { getAuditLogs, createAuditLog } from '../controllers/auditController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, authorizeRoles(['ADMIN']), getAuditLogs);
router.post('/', authenticate, createAuditLog);

export default router;
