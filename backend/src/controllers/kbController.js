import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';
import path from 'path';
import fs from 'fs';

export async function getArticles(req, res) {
  try {
    const { category, search, status, caseType } = req.query;
    const where = {};

    if (category && category !== 'ALL') {
      where.OR = [
        { category: category },
        { categoryGroup: category }
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (caseType && caseType !== 'ALL') {
      where.caseType = caseType;
    }

    if (search) {
      const searchTerms = [
        { title: { contains: search } },
        { kbCode: { contains: search } },
        { sourceTicket: { contains: search } },
        { product: { contains: search } },
        { technologyPrincipal: { contains: search } },
        { category: { contains: search } },
        { documentName: { contains: search } }
      ];
      if (where.OR) {
        where.AND = [
          { OR: where.OR },
          { OR: searchTerms }
        ];
        delete where.OR;
      } else {
        where.OR = searchTerms;
      }
    }

    const articles = await prisma.knowledgeBase.findMany({
      where,
      orderBy: { id: 'desc' }
    });
    return res.json(articles);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil artikel Knowledge Base.', error: error.message });
  }
}

export async function getArticleById(req, res) {
  try {
    const { id } = req.params;
    const article = await prisma.knowledgeBase.findUnique({
      where: { id: Number(id) }
    });
    if (!article) return res.status(404).json({ message: 'Artikel Knowledge Base tidak ditemukan.' });
    return res.json(article);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat artikel Knowledge Base.', error: error.message });
  }
}

export async function createArticle(req, res) {
  try {
    const actor = req.user;
    const {
      title,
      caseType = 'Incident',
      category = 'General',
      product = '',
      status,
      sourceTicket
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Judul dokumen Knowledge Base wajib diisi.' });
    }

    const count = await prisma.knowledgeBase.count();
    const kbCode = `KB-${String(1000 + count + 1)}`;

    let pdfAttachmentUrl = null;
    let documentName = null;
    let documentSize = null;

    if (req.file) {
      pdfAttachmentUrl = `/uploads/${req.file.filename}`;
      documentName = req.file.originalname;
      const sizeBytes = req.file.size;
      documentSize = sizeBytes > 1024 * 1024
        ? (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.max(1, Math.round(sizeBytes / 1024)) + ' KB';
    }

    const assignedStatus = status || (actor?.role?.code === 'ADMIN' ? 'PUBLISHED' : 'PENDING_REVIEW');

    const newArticle = await prisma.knowledgeBase.create({
      data: {
        kbCode,
        title: title.trim(),
        caseType: caseType || 'Incident',
        category: category || 'General',
        categoryGroup: category || 'General',
        product: product || '',
        technologyPrincipal: product || category,
        sourceTicket: sourceTicket || null,
        ticketsReferencedCount: sourceTicket ? 1 : 0,
        author: actor?.name || 'Support Engineer',
        approver: assignedStatus === 'PUBLISHED' ? `${actor?.name || 'Administrator'} (Verified)` : null,
        status: assignedStatus,
        pdfAttachmentUrl,
        documentName,
        documentSize,
        symptom: req.body.symptom || '',
        rootCause: req.body.rootCause || ''
      }
    });

    await logAuditEvent({
      userName: actor?.name || 'Support Engineer',
      role: actor?.role?.code || 'ENGINEER',
      action: 'KB_CREATED',
      entityType: 'KB',
      entityId: newArticle.kbCode,
      description: `Menerbitkan dokumen runbook Knowledge Base baru: ${newArticle.title}${documentName ? ` (File: ${documentName})` : ''}`,
      ipAddress: req.ip
    });

    return res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating KB article:', error);
    return res.status(500).json({ message: 'Gagal menerbitkan artikel Knowledge Base.', error: error.message });
  }
}

export async function publishArticle(req, res) {
  try {
    const { id } = req.params;
    const actor = req.user;

    const updated = await prisma.knowledgeBase.update({
      where: { id: Number(id) },
      data: {
        status: 'PUBLISHED',
        approver: `${actor.name} (${actor.role?.code || 'ADMIN'})`
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role?.code || 'ADMIN',
      action: 'KB_PUBLISHED',
      entityType: 'KB',
      entityId: updated.kbCode,
      description: `Menyetujui & mempublikasikan runbook Knowledge Base: ${updated.title}`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mempublikasikan artikel Knowledge Base.', error: error.message });
  }
}

export async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    const actor = req.user;

    const article = await prisma.knowledgeBase.findUnique({
      where: { id: Number(id) }
    });

    if (!article) {
      return res.status(404).json({ message: 'Artikel Knowledge Base tidak ditemukan.' });
    }

    // Optionally delete uploaded file
    if (article.pdfAttachmentUrl) {
      const uploadBase = process.env.UPLOAD_DIR || './uploads';
      const filename = path.basename(article.pdfAttachmentUrl);
      const fullPath = path.resolve(uploadBase, filename);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          console.warn('Gagal menghapus file fisik KB:', e.message);
        }
      }
    }

    await prisma.knowledgeBase.delete({
      where: { id: Number(id) }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role?.code || 'ADMIN',
      action: 'KB_DELETED',
      entityType: 'KB',
      entityId: article.kbCode,
      description: `Menghapus artikel Knowledge Base: ${article.title}`,
      ipAddress: req.ip
    });

    return res.json({ message: 'Artikel Knowledge Base berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus artikel Knowledge Base.', error: error.message });
  }
}

export async function downloadPdf(req, res) {
  try {
    const { id } = req.params;
    const article = await prisma.knowledgeBase.findUnique({
      where: { id: Number(id) }
    });

    if (!article || !article.pdfAttachmentUrl) {
      return res.status(404).json({ message: 'Berkas dokumen untuk artikel ini tidak ditemukan.' });
    }

    const uploadBase = process.env.UPLOAD_DIR || './uploads';
    const filename = path.basename(article.pdfAttachmentUrl);
    const fullPath = path.resolve(uploadBase, filename);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Berkas fisik dokumen tidak ditemukan pada server storage.' });
    }

    const ext = path.extname(filename);
    const downloadName = article.documentName || `${article.kbCode}_Runbook${ext}`;
    return res.download(fullPath, downloadName);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengunduh berkas dokumen.', error: error.message });
  }
}
