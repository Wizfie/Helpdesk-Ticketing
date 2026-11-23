import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';

export async function getAuditLogs(req, res) {
  try {
    const { action, search, limit = 100, page = 1 } = req.query;
    const where = {};

    if (action && action !== '') {
      where.action = action;
    }

    if (search) {
      where.OR = [
        { userName: { contains: search } },
        { description: { contains: search } },
        { entityId: { contains: search } },
        { action: { contains: search } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { timestampUtc: 'desc' },
        take: Number(limit),
        skip
      })
    ]);

    return res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      logs
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil rekaman jejak audit.', error: error.message });
  }
}

export async function createAuditLog(req, res) {
  try {
    const { action, entityType, entityId, description, userName, role } = req.body;
    const actor = req.user;
    const log = await logAuditEvent({
      userName: actor?.name || userName || 'System User',
      role: actor?.role || role || 'ADMIN',
      action: action || 'SYSTEM_CHANGE',
      entityType: entityType || null,
      entityId: entityId ? String(entityId) : null,
      description: description || '',
      ipAddress: req.ip || '127.0.0.1'
    });

    if (!log) {
      return res.status(500).json({ message: 'Gagal menyimpan rekaman jejak audit.' });
    }

    return res.status(201).json({ success: true, data: log });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat rekaman audit.', error: error.message });
  }
}
