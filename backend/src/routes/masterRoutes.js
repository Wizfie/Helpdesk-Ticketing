import express from 'express';
import {
  getCategories,
  createCategory,
  getPrincipals,
  createPrincipal,
  getQuickPresets,
  getHoldReasons
} from '../controllers/masterController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Categories
router.get('/categories', getCategories);
router.post('/categories', authenticate, authorizeRoles(['ADMIN']), createCategory);

// Principals
router.get('/principals', getPrincipals);
router.post('/principals', authenticate, createPrincipal);

// Presets & Hold Reasons
router.get('/presets', getQuickPresets);
router.get('/hold-reasons', getHoldReasons);

export default router;
