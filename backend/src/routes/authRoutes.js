import express from 'express';
import { getUsers, getCurrentUser, login, createUser, updateUser } from '../controllers/authController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', authenticate, getUsers);
router.get('/me', authenticate, getCurrentUser);
router.post('/login', login);
router.post('/users', authenticate, authorizeRoles(['ADMIN']), createUser);
router.put('/users/:id', authenticate, authorizeRoles(['ADMIN']), updateUser);

export default router;
