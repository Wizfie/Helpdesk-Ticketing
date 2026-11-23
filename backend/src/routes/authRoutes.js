import express from 'express';
import { getUsers, getCurrentUser, login, createUser, updateUser } from '../controllers/authController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/users', authenticate, getUsers);
router.get('/me', authenticate, getCurrentUser);
router.post('/login', login);
router.post('/users', authenticate, authorizeRoles(['ADMIN']), createUser);
router.put('/users/:id', authenticate, (req, res, next) => {
  if (req.user?.role === 'ADMIN' || Number(req.user?.id) === Number(req.params.id)) {
    return next();
  }
  return res.status(403).json({ message: 'Akses ditolak: Anda hanya dapat memperbarui profil Anda sendiri.' });
}, updateUser);

export default router;
