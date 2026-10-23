import express from 'express';
import { getArticles, getArticleById, createArticle, publishArticle, downloadPdf } from '../controllers/kbController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getArticles);
router.get('/:id', authenticate, getArticleById);
router.post('/', authenticate, upload.single('pdfFile'), createArticle);
router.patch('/:id/publish', authenticate, authorizeRoles(['ADMIN']), publishArticle);
router.get('/:id/download-pdf', authenticate, downloadPdf);

export default router;
