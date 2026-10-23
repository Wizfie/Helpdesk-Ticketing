import express from 'express';
import { getSlaPolicies, createSlaPolicy, updateSlaPolicy, deleteSlaPolicy } from '../controllers/slaController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/policies', authenticate, getSlaPolicies);
router.post('/policies', authenticate, authorizeRoles(['ADMIN']), createSlaPolicy);
router.put('/policies/:id', authenticate, authorizeRoles(['ADMIN']), updateSlaPolicy);
router.delete('/policies/:id', authenticate, authorizeRoles(['ADMIN']), deleteSlaPolicy);

export default router;
