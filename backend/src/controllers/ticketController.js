import prisma from '../lib/prisma.js';
import { calculateSlaDeadlines, evaluateSlaBreach } from '../services/slaService.js';
import { logAuditEvent } from '../services/auditService.js';

export async function getTickets(req, res) {
  try {
    const { status, customerId, severity, search, myAssignedOnly } = req.query;
    const user = req.user;

    const where = {};

    // Support Engineer filter: if engineer or requested myAssignedOnly
    if (myAssignedOnly === 'true' || (user?.role?.code === 'ENGINEER' && req.query.viewAll !== 'true')) {
      where.assignedToId = user.id;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (customerId && customerId !== 'ALL') {
      where.customerId = Number(customerId);
    }

    if (severity && severity !== 'ALL') {
      where.severity = severity;
    }

    if (search) {
      where.OR = [
        { ticketNumber: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
        { serialNumber: { contains: search } },
        { customer: { name: { contains: search } } }
      ];
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        customer: true,
        customerPic: true,
        category: true,
        assignedTo: {
          select: { id: true, name: true, email: true, phone: true, role: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true, role: true }
        },
        milestones: {
          include: {
            actor: {
              select: { id: true, name: true, role: true }
            }
          },
          orderBy: { timestampUtc: 'asc' }
        }
      },
      orderBy: { id: 'desc' }
    });

    // Evaluate SLA breach statuses dynamically and attach progressPercent
    let rawPercentMap = new Map();
    try {
      const allRaw = await prisma.$queryRaw`SELECT id, progressPercent FROM ticket_milestones`;
      rawPercentMap = new Map((allRaw || []).map(m => [Number(m.id), Number(m.progressPercent)]));
    } catch {
      // fallback
    }

    const enrichedTickets = tickets.map(t => {
      const { isResponseBreached, isResolutionBreached } = evaluateSlaBreach(t);
      const enrichedMilestones = (t.milestones || []).map(m => ({
        ...m,
        actorName: m.actor?.name || 'Sistem',
        actorRole: m.actor?.role || 'SYSTEM',
        progressPercent: rawPercentMap.has(Number(m.id)) && rawPercentMap.get(Number(m.id)) !== null
          ? rawPercentMap.get(Number(m.id))
          : (m.progressPercent || 0)
      }));
      return {
        ...t,
        milestones: enrichedMilestones,
        isSlaResponseBreached: isResponseBreached,
        isSlaResolutionBreached: isResolutionBreached
      };
    });

    return res.json(enrichedTickets);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil antrean tiket.', error: error.message });
  }
}

export async function getTicketById(req, res) {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        customer: {
          include: { pics: true }
        },
        customerPic: true,
        category: true,
        assignedTo: true,
        createdBy: true,
        milestones: {
          include: {
            actor: {
              select: { id: true, name: true, role: true }
            }
          },
          orderBy: { timestampUtc: 'asc' }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Tiket tidak ditemukan.' });
    }

    // Anti-IDOR: Jika role adalah ENGINEER, tolak akses jika bukan tiket yang ditugaskan ke dirinya
    if (req.user?.role === 'ENGINEER' && ticket.assignedToId && ticket.assignedToId !== req.user.id) {
      return res.status(403).json({
        message: 'Akses ditolak: Tiket ini berada di bawah wewenang teknisi lain.',
        assignedToId: ticket.assignedToId
      });
    }

    // Attach real progressPercent from MySQL database for all milestones
    if (ticket.milestones && ticket.milestones.length > 0) {
      try {
        const rawMilestones = await prisma.$queryRaw`SELECT id, progressPercent FROM ticket_milestones WHERE ticketId = ${ticket.id}`;
        const percentMap = new Map((rawMilestones || []).map(m => [Number(m.id), Number(m.progressPercent)]));
        ticket.milestones = ticket.milestones.map(m => ({
          ...m,
          actorName: m.actor?.name || 'Sistem',
          actorRole: m.actor?.role || 'SYSTEM',
          progressPercent: percentMap.has(Number(m.id)) && percentMap.get(Number(m.id)) !== null
            ? percentMap.get(Number(m.id))
            : (m.progressPercent || 0)
        }));
      } catch (err) {
        console.warn('Could not query raw progressPercent:', err.message);
      }
    }

    const { isResponseBreached, isResolutionBreached } = evaluateSlaBreach(ticket);
    return res.json({
      ...ticket,
      isSlaResponseBreached: isResponseBreached,
      isSlaResolutionBreached: isResolutionBreached
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat detail tiket.', error: error.message });
  }
}

export async function getPublicTicketByToken(req, res) {
  try {
    const { ticketNumber } = req.params;
    const { token } = req.query;

    const ticket = await prisma.ticket.findUnique({
      where: { ticketNumber },
      include: {
        customer: true,
        customerPic: true,
        category: true,
        assignedTo: {
          select: { id: true, name: true, email: true, phone: true, role: true }
        },
        milestones: {
          include: {
            actor: {
              select: { id: true, name: true, role: true }
            }
          },
          orderBy: { timestampUtc: 'asc' }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Nomor tiket tidak terdaftar dalam database.' });
    }

    if (ticket.milestones && ticket.milestones.length > 0) {
      ticket.milestones = ticket.milestones.map(m => ({
        ...m,
        actorName: m.actor?.name || 'Teknisi Helpdesk',
        actorRole: m.actor?.role || 'ENGINEER'
      }));
    }

    // Anti-IDOR Security Check
    if (!token || ticket.trackingToken !== token) {
      return res.status(403).json({ 
        message: 'Akses ditolak: Token pelacakan tidak sah atau tidak disertakan.',
        isTokenValid: false
      });
    }

    const { isResponseBreached, isResolutionBreached } = evaluateSlaBreach(ticket);

    return res.json({
      ...ticket,
      isTokenValid: true,
      isSlaResponseBreached: isResponseBreached,
      isSlaResolutionBreached: isResolutionBreached
    });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat status pelacakan tiket publik.', error: error.message });
  }
}

export async function createTicket(req, res) {
  try {
    const actor = req.user;
    const {
      customerId,
      customerPicId,
      categoryId,
      ticketType = 'Incident',
      serialNumber,
      severity = 'MEDIUM',
      title,
      description,
      assignedToId,
      sendEmailNotification
    } = req.body;

    if (!customerId || !title || !description || !assignedToId) {
      return res.status(400).json({ message: 'Customer, judul, deskripsi, dan alokasi teknisi penanganan wajib diisi.' });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: Number(customerId) }
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer tidak ditemukan.' });
    }
    if (customer.isActive === false) {
      return res.status(400).json({ message: `Customer "${customer.name}" berstatus non-aktif. Tidak dapat menerbitkan tiket baru.` });
    }

    // Validasi kuota tiket pelanggan (Quota Lock / Guard - Direct Balance Model)
    const quotaStr = String(customer.ticketQuota || '').trim().toLowerCase();
    if (quotaStr && quotaStr !== 'unlimited' && !isNaN(Number(quotaStr))) {
      const remainingQuota = Number(quotaStr);
      if (remainingQuota <= 0) {
        return res.status(400).json({
          message: `Gagal membuat tiket: Kuota tiket untuk mitra "${customer.name}" telah habis (sisa 0 tiket). Silakan hubungi admin untuk penambahan kuota tiket terlebih dahulu.`
        });
      }
    }

    const now = new Date();
    const count = await prisma.ticket.count();
    const year2 = String(now.getFullYear()).slice(-2);
    // Ticket format: TK-26001, TK-26002, ...
    const seq = String(count + 1).padStart(3, '0');
    const ticketNumber = `TK-${year2}${seq}`;
    const trackingToken = 'sec_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);

    // Calculate dynamic SLA deadlines
    const { contractTier, responseDeadline, resolutionDeadline, respHours } = await calculateSlaDeadlines({
      customerId,
      severity,
      createdAt: now
    });

    let attachmentUrl = null;
    let attachmentName = null;
    let attachmentSize = null;

    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
      attachmentName = req.file.originalname;
      const sizeBytes = req.file.size;
      attachmentSize = sizeBytes > 1024 * 1024
        ? (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
        : Math.max(1, Math.round(sizeBytes / 1024)) + ' KB';
    }

    const initialStatus = 'ASSIGNED';

    const newTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        customerId: Number(customerId),
        customerPicId: customerPicId ? Number(customerPicId) : null,
        ticketType: ticketType || 'Incident',
        categoryId: categoryId ? Number(categoryId) : null,
        serialNumber: serialNumber ? String(serialNumber).trim() : null,
        severity,
        title: title.trim(),
        description: description.trim(),
        attachmentUrl,
        attachmentName,
        attachmentSize,
        status: initialStatus,
        trackingToken,
        createdById: actor.id,
        assignedToId: Number(assignedToId),
        contractTier,
        sendEmailNotification: sendEmailNotification === true || sendEmailNotification === 'true',
        createdAt: now,
        responseDeadline,
        resolutionDeadline,
        respondedAt: now,
        milestones: {
          create: [
            {
              stepName: 'Laporan Diterima & Teknisi Dialokasikan',
              status: 'ASSIGNED',
              actorId: actor.id,
              notes: `Tiket diterbitkan oleh ${actor.name} dan langsung dialokasikan ke teknisi penanganan. Target respon SLA: ${respHours * 60} menit.`,
              timestampUtc: now
            }
          ]
        }
      },
      include: {
        customer: true,
        customerPic: true,
        category: true,
        assignedTo: true,
        milestones: true
      }
    });

    // Kurangi saldo kuota tiket mitra secara otomatis (Direct Balance Model)
    if (quotaStr && quotaStr !== 'unlimited' && !isNaN(Number(quotaStr))) {
      const remainingQuota = Number(quotaStr);
      try {
        await prisma.customer.update({
          where: { id: Number(customerId) },
          data: {
            ticketQuota: String(Math.max(0, remainingQuota - 1))
          }
        });
      } catch (errQuota) {
        console.warn('Gagal memotong kuota customer di database:', errQuota.message);
      }
    }

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'TICKET_CREATED',
      entityType: 'TICKET',
      entityId: ticketNumber,
      description: `Menerbitkan tiket ${ticketNumber}: ${title} (Severity: ${severity}, Klien: ${newTicket.customer?.name || '-'})`,
      ipAddress: req.ip
    });

    return res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    return res.status(500).json({ message: 'Gagal membuat tiket baru.', error: error.message });
  }
}

export async function assignEngineer(req, res) {
  try {
    const { id } = req.params;
    const { engineerId } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) }
    });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const engineer = await prisma.user.findUnique({
      where: { id: Number(engineerId) }
    });
    if (!engineer) return res.status(404).json({ message: 'Teknisi tidak ditemukan.' });

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        assignedToId: engineer.id,
        status: ticket.status === 'OPEN' ? 'ASSIGNED' : ticket.status,
        respondedAt: ticket.respondedAt || now,
        updatedAt: now
      },
      include: { assignedTo: true }
    });

    // Milestone
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'Penugasan Teknisi Bertugas',
        status: updated.status,
        actorId: actor.id,
        notes: `Tiket dialokasikan kepada ${engineer.name} (${engineer.role || 'Support Engineer'}). Response SLA terpenuhi.`,
        timestampUtc: now
      }
    });

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'ASSIGN_ENGINEER',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Menugaskan tiket ${ticket.ticketNumber} kepada ${engineer.name}`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menugaskan teknisi.', error: error.message });
  }
}

export async function escalateTicket(req, res) {
  try {
    const { id } = req.params;
    const { escalationTier = 'VENDOR_PRINCIPAL', notes } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: `Eskalasi Kasus (${escalationTier})`,
        status: ticket.status,
        actorId: actor.id,
        notes: notes || `Eskalasi kasus ditugaskan ke ${escalationTier}.`,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'TICKET_ESCALATED',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Eskalasi tiket ${ticket.ticketNumber} ke ${escalationTier}`,
      ipAddress: req.ip
    });

    return res.json(ticket);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal melakukan eskalasi tiket.', error: error.message });
  }
}

export async function pauseSla(req, res) {
  try {
    const { id } = req.params;
    const { reasonType, reasonDetail, pendingType, reason, principalCaseId, principalVendor } = req.body;
    const effectiveType = pendingType || reasonType || 'PART_HARDWARE';
    const effectiveDetail = reason || reasonDetail || '';
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const isPartnerCust = effectiveType === 'PARTNER_CUSTOMER' || effectiveType === 'PENDING_CUSTOMER';
    const nextStatus = isPartnerCust ? 'PENDING_CUSTOMER' : 'PENDING_VENDOR';
    const reasonLabel = isPartnerCust ? 'Partner / Customer' : 'Part / Hardware';

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        isPaused: true,
        pausedAt: now,
        pauseReason: isPartnerCust ? 'PARTNER_CUSTOMER' : 'PART_HARDWARE',
        status: nextStatus,
        principalVendor: isPartnerCust ? null : (principalVendor || ticket.principalVendor),
        principalCaseId: isPartnerCust ? null : (principalCaseId || ticket.principalCaseId),
        updatedAt: now
      }
    });

    // Dapatkan progress berjalan saat ini agar milestone penahanan SLA tidak mengubah/merusak persentase
    const existingMilestones = await prisma.ticketMilestone.findMany({
      where: { ticketId: ticket.id },
      select: { progressPercent: true }
    });
    const currentProgress = existingMilestones.reduce((max, m) => Math.max(max, Number(m.progressPercent || 0)), 0);

    // Milestone
    const vendorNote = (!isPartnerCust && principalVendor) ? ` [Vendor/Distributor: ${principalVendor}]` : '';
    const caseNote = (!isPartnerCust && principalCaseId) ? ` [RMA/Case: ${principalCaseId}]` : '';
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: `SLA Ditahan (${reasonLabel})`,
        status: nextStatus,
        actorId: actor.id,
        notes: `Penahanan SLA aktif: Menunggu ${reasonLabel}.${vendorNote}${caseNote} Keterangan: ${effectiveDetail || '-'}.`,
        progressPercent: currentProgress,
        timestampUtc: now
      }
    });

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'SLA_PAUSED',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `SLA tiket ${ticket.ticketNumber} ditahan (Alasan: ${reasonLabel})`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membekukan SLA tiket.', error: error.message });
  }
}

export async function resumeSla(req, res) {
  try {
    const { id } = req.params;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket || !ticket.isPaused) {
      return res.status(400).json({ message: 'Tiket tidak dalam status dibekukan (Hold/Freeze).' });
    }

    const pausedStart = ticket.pausedAt ? new Date(ticket.pausedAt) : now;
    const pausedSeconds = Math.max(0, Math.floor((now - pausedStart) / 1000));

    // Extend resolution deadline by exact paused seconds
    const oldDeadline = new Date(ticket.resolutionDeadline);
    const extendedDeadline = new Date(oldDeadline.getTime() + pausedSeconds * 1000);

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        isPaused: false,
        pausedAt: null,
        totalPausedDurationSec: ticket.totalPausedDurationSec + pausedSeconds,
        resolutionDeadline: extendedDeadline,
        status: 'IN_PROGRESS',
        updatedAt: now
      }
    });

    // Dapatkan progress berjalan saat ini agar milestone kelanjutan SLA tetap mewarisi progres
    const existingMilestones = await prisma.ticketMilestone.findMany({
      where: { ticketId: ticket.id },
      select: { progressPercent: true }
    });
    const currentProgress = existingMilestones.reduce((max, m) => Math.max(max, Number(m.progressPercent || 0)), 0);

    // Milestone
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'SLA Dilanjutkan (Timer Aktif Kembali)',
        status: 'IN_PROGRESS',
        actorId: actor.id,
        notes: `Timer SLA aktif kembali setelah tertahan ${Math.round(pausedSeconds / 60)} menit. Batas waktu resolusi otomatis diperpanjang.`,
        progressPercent: currentProgress,
        timestampUtc: now
      }
    });

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'SLA_RESUMED',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `SLA tiket ${ticket.ticketNumber} dilanjutkan setelah jeda ${Math.round(pausedSeconds / 60)} menit`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal melanjutkan SLA tiket.', error: error.message });
  }
}

export async function addMilestone(req, res) {
  try {
    const { id } = req.params;
    const { stepName, notes, proofFile, nextStatus, progressPercent } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const statusToSet = nextStatus || ticket.status;

    const ticketUpdateData = {
      status: statusToSet,
      updatedAt: now
    };
    if (statusToSet === 'RESOLVED' && !ticket.resolvedAt) {
      ticketUpdateData.resolvedAt = now;
    }
    if (statusToSet === 'CLOSED' && !ticket.closedAt) {
      ticketUpdateData.closedAt = now;
      if (!ticket.resolvedAt) ticketUpdateData.resolvedAt = now;
    }

    await prisma.ticket.update({
      where: { id: Number(id) },
      data: ticketUpdateData
    });

    const prevMilestones = await prisma.ticketMilestone.findMany({
      where: { ticketId: ticket.id },
      select: { progressPercent: true }
    });
    const maxPrevPercent = prevMilestones.reduce((max, m) => Math.max(max, Number(m.progressPercent || 0)), 0);

    let safePercent = progressPercent !== undefined && progressPercent !== null ? Number(progressPercent) : maxPrevPercent;
    if (statusToSet === 'RESOLVED' || statusToSet === 'CLOSED') {
      safePercent = 100;
    } else {
      safePercent = Math.min(100, Math.max(maxPrevPercent, safePercent));
    }

    const milestone = await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName,
        status: statusToSet,
        actorId: actor.id,
        notes,
        proofFile: proofFile || null,
        progressPercent: safePercent,
        timestampUtc: now
      },
      include: {
        actor: { select: { id: true, name: true, role: true } }
      }
    });

    const enrichedMilestone = {
      ...milestone,
      actorName: milestone.actor?.name || actor.name || 'Sistem',
      actorRole: milestone.actor?.role || actor.role || 'SYSTEM',
      progressPercent: safePercent
    };

    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'PROGRESS_UPDATE',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Update milestone penanganan (${statusToSet}, ${safePercent}%): ${stepName}`,
      ipAddress: req.ip
    });

    return res.status(201).json(enrichedMilestone);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan milestone diagnosa.', error: error.message });
  }
}

export async function resolveTicket(req, res) {
  try {
    const { id } = req.params;
    const { rootCause, resolutionStrategy, recommendation } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        status: 'RESOLVED',
        resolvedAt: now, // SLA Resolution stops here!
        rootCause: rootCause || ticket.rootCause,
        resolutionStrategy: resolutionStrategy || ticket.resolutionStrategy,
        recommendation: recommendation || ticket.recommendation,
        updatedAt: now
      }
    });

    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'Solusi Diterapkan & Layanan Pulih (RESOLVED)',
        status: 'RESOLVED',
        actorId: actor.id,
        notes: `Pekerjaan teknis tuntas diselesaikan oleh ${actor.name}. Resolution SLA berhenti. Masa validasi 72 jam berjalan.`,
        progressPercent: 100,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'TICKET_RESOLVED',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Tiket ${ticket.ticketNumber} berstatus RESOLVED oleh ${actor.name}. Resolution SLA selesai.`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menyelesaikan tiket.', error: error.message });
  }
}

export async function closeTicket(req, res) {
  try {
    const { id } = req.params;
    const { confirmationNotes } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        status: 'CLOSED',
        closedAt: now,
        updatedAt: now
      }
    });

    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'Tiket Ditutup Tuntas (CLOSED)',
        status: 'CLOSED',
        actorId: actor.id,
        notes: `Tiket resmi diarsipkan: ${confirmationNotes || 'Verifikasi pelanggan tuntas.'}.`,
        progressPercent: 100,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role,
      action: 'TICKET_CLOSED',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Tiket ${ticket.ticketNumber} ditutup (CLOSED).`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menutup tiket.', error: error.message });
  }
}
