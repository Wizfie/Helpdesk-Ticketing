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
          select: { id: true, name: true, initials: true, email: true, roleTitle: true }
        },
        createdBy: {
          select: { id: true, name: true, roleTitle: true }
        }
      },
      orderBy: { id: 'desc' }
    });

    // Evaluate SLA breach statuses dynamically
    const enrichedTickets = tickets.map(t => {
      const { isResponseBreached, isResolutionBreached } = evaluateSlaBreach(t);
      return {
        ...t,
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
          orderBy: { timestampUtc: 'asc' }
        },
        attachments: {
          orderBy: { id: 'desc' }
        },
        holdLogs: {
          orderBy: { id: 'desc' }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Tiket tidak ditemukan.' });
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
          select: { name: true, roleTitle: true }
        },
        milestones: {
          orderBy: { timestampUtc: 'asc' }
        },
        holdLogs: {
          orderBy: { id: 'desc' },
          take: 1
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Nomor tiket tidak terdaftar dalam database.' });
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
      severity = 'MEDIUM',
      channel = 'EMAIL',
      title,
      rawMessage,
      description,
      assignedToId,
      cluster,
      environment,
      impactScope,
      escalationTier = 'INTERNAL',
      principalVendor,
      principalCaseId,
      partnerName,
      partnerPic,
      projectManager
    } = req.body;

    const now = new Date();
    const count = await prisma.ticket.count();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const ticketNumber = `TICK-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    const trackingToken = 'sec_' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);

    // Calculate dynamic SLA deadlines
    const { contractTier, responseDeadline, resolutionDeadline, respHours } = await calculateSlaDeadlines({
      customerId,
      severity,
      createdAt: now
    });

    const initialStatus = assignedToId ? 'ASSIGNED' : 'OPEN';

    const newTicket = await prisma.ticket.create({
      data: {
        ticketNumber,
        customerId: Number(customerId),
        customerPicId: customerPicId ? Number(customerPicId) : null,
        categoryId: Number(categoryId),
        severity,
        channel,
        title,
        rawMessage: rawMessage || null,
        description,
        status: initialStatus,
        trackingToken,
        createdById: actor.id,
        assignedToId: assignedToId ? Number(assignedToId) : null,
        contractTier,
        cluster: cluster || 'PROD-CL01',
        environment: environment || 'PROD-DC-01',
        impactScope: impactScope || 'Standard Operational',
        escalationTier,
        principalVendor: principalVendor || null,
        principalCaseId: principalCaseId || null,
        partnerName: partnerName || null,
        partnerPic: partnerPic || null,
        projectManager: projectManager || null,
        createdAt: now,
        responseDeadline,
        resolutionDeadline,
        respondedAt: assignedToId ? now : null,
        milestones: {
          create: [
            {
              stepName: 'Laporan Diterima (Ticket Created)',
              status: 'OPEN',
              actorId: actor.id,
              actorName: actor.name,
              actorRole: actor.role.code,
              notes: `Tiket diterbitkan oleh ${actor.name}. Target respon SLA: ${respHours * 60} menit.`,
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

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
      action: 'TICKET_CREATED',
      entityType: 'TICKET',
      entityId: ticketNumber,
      description: `Menerbitkan tiket insiden baru: ${title} (Severity: ${severity}, Klien: ${newTicket.customer.name})`,
      ipAddress: req.ip
    });

    return res.status(201).json(newTicket);
  } catch (error) {
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
        actorName: actor.name,
        actorRole: actor.role.code,
        notes: `Tiket dialokasikan kepada ${engineer.name} (${engineer.roleTitle || 'Support Engineer'}). Response SLA terpenuhi.`,
        timestampUtc: now
      }
    });

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
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
    const { escalationTier, principalVendor, principalCaseId, partnerName, partnerPic, projectManager, notes } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        escalationTier: escalationTier || 'VENDOR_PRINCIPAL',
        principalVendor: principalVendor || ticket.principalVendor,
        principalCaseId: principalCaseId || ticket.principalCaseId,
        partnerName: partnerName || ticket.partnerName,
        partnerPic: partnerPic || ticket.partnerPic,
        projectManager: projectManager || ticket.projectManager,
        updatedAt: now
      }
    });

    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: `Eskalasi Tingkat Lanjut (${escalationTier})`,
        status: ticket.status,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role.code,
        notes: notes || `Eskalasi diaktifkan ke tier ${escalationTier}. Kasus terkait: ${principalCaseId || partnerName || 'Koordinasi PM'}.`,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
      action: 'TICKET_ESCALATED',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Eskalasi tiket ${ticket.ticketNumber} ke tier ${escalationTier}`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal melakukan eskalasi tiket.', error: error.message });
  }
}

export async function pauseSla(req, res) {
  try {
    const { id } = req.params;
    const { reasonType = 'PART_INDENT', reasonDetail, principalCaseId } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const nextStatus = reasonType === 'PENDING_CUSTOMER' ? 'PENDING_CUSTOMER' : 'PENDING_VENDOR';

    const updated = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        isPaused: true,
        pausedAt: now,
        status: nextStatus,
        principalCaseId: principalCaseId || ticket.principalCaseId,
        updatedAt: now
      }
    });

    // Create Hold Log
    await prisma.slaHoldLog.create({
      data: {
        ticketId: ticket.id,
        reasonType,
        reasonDetail: reasonDetail || 'Penahanan waktu SLA sesuai kondisi operasional.',
        principalCaseId: principalCaseId || null,
        pausedAt: now,
        actorName: actor.name
      }
    });

    // Milestone
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: `SLA Ditahan (Freeze Clock: ${nextStatus})`,
        status: nextStatus,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role.code,
        notes: `SLA dibekukan sementara. Kategori: ${reasonType}. Keterangan: ${reasonDetail || '-'}.`,
        timestampUtc: now
      }
    });

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
      action: 'SLA_PAUSED',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `SLA tiket ${ticket.ticketNumber} dibekukan (Alasan: ${reasonType})`,
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

    // Update active Hold Log
    const activeHoldLog = await prisma.slaHoldLog.findFirst({
      where: { ticketId: ticket.id, resumedAt: null },
      orderBy: { id: 'desc' }
    });

    if (activeHoldLog) {
      await prisma.slaHoldLog.update({
        where: { id: activeHoldLog.id },
        data: {
          resumedAt: now,
          durationSec: pausedSeconds
        }
      });
    }

    // Milestone
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'SLA Dilanjutkan (Timer Aktif Kembali)',
        status: 'IN_PROGRESS',
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role.code,
        notes: `Timer SLA aktif kembali setelah tertahan ${Math.round(pausedSeconds / 60)} menit. Batas waktu resolusi otomatis diperpanjang.`,
        timestampUtc: now
      }
    });

    // Audit Log
    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
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
    const { stepName, notes, proofFile, nextStatus } = req.body;
    const actor = req.user;
    const now = new Date();

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const statusToSet = nextStatus || ticket.status;

    await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        status: statusToSet,
        updatedAt: now
      }
    });

    const milestone = await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName,
        status: statusToSet,
        actorId: actor.id,
        actorName: actor.name,
        actorRole: actor.role.code,
        notes,
        proofFile: proofFile || null,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
      action: 'PROGRESS_UPDATE',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Update milestone penanganan: ${stepName}`,
      ipAddress: req.ip
    });

    return res.status(201).json(milestone);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan milestone diagnosa.', error: error.message });
  }
}

export async function resolveTicket(req, res) {
  try {
    const { id } = req.params;
    const { rootCause, resolutionStrategy, actionTaken, resolutionNotes, recommendation } = req.body;
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
        actionTaken: actionTaken || '',
        resolutionNotes: resolutionNotes || '',
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
        actorName: actor.name,
        actorRole: actor.role.code,
        notes: `Pekerjaan teknis tuntas diselesaikan oleh ${actor.name}. Resolution SLA berhenti. Masa validasi 72 jam berjalan.`,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
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
        actorName: actor.name,
        actorRole: actor.role.code,
        notes: `Tiket resmi diarsipkan: ${confirmationNotes || 'Verifikasi pelanggan tuntas.'}.`,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: actor.name,
      role: actor.role.code,
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

export async function uploadAttachment(req, res) {
  try {
    const { id } = req.params;
    const actor = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Tidak ada berkas yang diunggah.' });
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) return res.status(404).json({ message: 'Tiket tidak ditemukan.' });

    const attachment = await prisma.attachment.create({
      data: {
        ticketId: ticket.id,
        name: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedBy: actor.name,
        source: req.body.source || 'Lampiran Bukti Milestone'
      }
    });

    return res.status(201).json(attachment);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengunggah lampiran.', error: error.message });
  }
}
