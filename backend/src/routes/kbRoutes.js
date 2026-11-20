import express from 'express';
import { getArticles, getArticleById, createArticle, publishArticle, deleteArticle, downloadPdf } from '../controllers/kbController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Flexible upload middleware accepting any single file field ('file', 'docFile', 'pdfFile')
const handleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};

router.get('/', authenticate, getArticles);
router.get('/:id', authenticate, getArticleById);
router.post('/', authenticate, handleUpload, createArticle);
router.patch('/:id/publish', authenticate, authorizeRoles(['ADMIN']), publishArticle);
router.delete('/:id', authenticate, authorizeRoles(['ADMIN']), deleteArticle);
router.get('/:id/download-pdf', authenticate, downloadPdf);
router.get('/:id/download', authenticate, downloadPdf);

export default router;
