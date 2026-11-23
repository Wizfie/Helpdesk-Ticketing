import express from 'express';
import {
  getCategories,
  createCategory,
  getQuickPresets,
  getHoldReasons
} from '../controllers/masterController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Categories
router.get('/categories', getCategories);
router.post('/categories', authenticate, authorizeRoles(['ADMIN']), createCategory);

// Presets & Hold Reasons
router.get('/presets', getQuickPresets);
router.get('/hold-reasons', getHoldReasons);

export default router;
