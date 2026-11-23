import express from 'express';
import { 
  getConfig, 
  updateConfig, 
  testConnection, 
  sendDispatch, 
  sendResolutionBap,
  sendCustomerTracking
} from '../controllers/mailController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/config', authenticate, getConfig);
router.put('/config', authenticate, authorizeRoles(['ADMIN']), updateConfig);
router.post('/test', authenticate, authorizeRoles(['ADMIN']), testConnection);
router.post('/tickets/:id/dispatch', authenticate, authorizeRoles(['ADMIN']), sendDispatch);
router.post('/tickets/:id/customer-tracking', authenticate, authorizeRoles(['ADMIN']), sendCustomerTracking);
router.post('/tickets/:id/resolved-bap', authenticate, authorizeRoles(['ADMIN']), sendResolutionBap);

export default router;
