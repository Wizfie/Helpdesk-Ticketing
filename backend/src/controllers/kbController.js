import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';
import path from 'path';
import fs from 'fs';

export async function getArticles(req, res) {
  try {
    const { category, search, status } = req.query;
    const where = {};

    if (category && category !== 'ALL') {
      where.categoryGroup = category;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { kbCode: { contains: search } },
        { symptom: { contains: search } },
        { rootCause: { contains: search } },
        { technologyPrincipal: { contains: search } }
      ];
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
      category = 'Storage',
      categoryGroup = 'SAN & Enterprise Storage',
      technologyPrincipal,
      sourceTicket,
      symptom,
      rootCause,
      prerequisites,
      cliSnippet,
      verificationSteps,
      rollbackProcedure,
      recommendation
    } = req.body;

    const count = await prisma.knowledgeBase.count();
    const kbCode = `KB-${String(1000 + count + 1)}`;

    let pdfAttachmentUrl = null;
    if (req.file) {
      pdfAttachmentUrl = `/uploads/${req.file.filename}`;
    }

    const newArticle = await prisma.knowledgeBase.create({
      data: {
        kbCode,
        title,
        category,
        categoryGroup,
        technologyPrincipal: technologyPrincipal || 'Multi-Vendor Enterprise',
        author: actor?.name || 'Support Engineer',
        approver: actor?.role?.code === 'ADMIN' ? `${actor.name} (Verified)` : null,
        status: actor?.role?.code === 'ADMIN' ? 'PUBLISHED' : 'PENDING_REVIEW',
        sourceTicket: sourceTicket || null,
        symptom,
        rootCause,
        prerequisites: prerequisites || 'Standar izin teknisi L2/L3.',
        cliSnippet: cliSnippet || '# Command sequence\nshow status',
        verificationSteps: verificationSteps || 'Verifikasi fungsionalitas normal.',
        rollbackProcedure: rollbackProcedure || 'Rollback ke state sebelumnya jika terjadi anomali.',
        recommendation: recommendation || 'Dokumentasikan setiap deviasi konfigurasi.',
        pdfAttachmentUrl
      }
    });

    await logAuditEvent({
      userName: actor?.name || 'Support Engineer',
      role: actor?.role?.code || 'ENGINEER',
      action: 'KB_CREATED',
      entityType: 'KB',
      entityId: newArticle.kbCode,
      description: `Menerbitkan dokumen runbook Knowledge Base baru: ${newArticle.title}${pdfAttachmentUrl ? ' (Beserta lampiran PDF)' : ''}`,
      ipAddress: req.ip
    });

    return res.status(201).json(newArticle);
  } catch (error) {
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
        approver: `${actor.name} (${actor.role.name})`
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
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

export async function downloadPdf(req, res) {
  try {
    const { id } = req.params;
    const article = await prisma.knowledgeBase.findUnique({
      where: { id: Number(id) }
    });

    if (!article || !article.pdfAttachmentUrl) {
      return res.status(404).json({ message: 'Berkas PDF untuk artikel ini tidak ditemukan.' });
    }

    const uploadBase = process.env.UPLOAD_DIR || './uploads';
    const filename = path.basename(article.pdfAttachmentUrl);
    const fullPath = path.resolve(uploadBase, filename);

    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'Berkas fisik PDF tidak ditemukan pada server storage.' });
    }

    return res.download(fullPath, `${article.kbCode}_Runbook.pdf`);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengunduh berkas PDF.', error: error.message });
  }
}
