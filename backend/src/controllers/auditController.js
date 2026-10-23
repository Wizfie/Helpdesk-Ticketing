import prisma from '../lib/prisma.js';

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
