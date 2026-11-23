import { 
  getMaskedConfig, 
  updateRuntimeAndEnvConfig, 
  testEmailConnection,
  sendEngineerDispatchNotification,
  sendTicketResolutionNotification,
  sendTicketCustomerTrackingNotification
} from '../services/mailService.js';
import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';

export async function getConfig(req, res) {
  try {
    const config = getMaskedConfig();
    return res.json({ success: true, data: config });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal mengambil konfigurasi email.', error: error.message });
  }
}

export async function updateConfig(req, res) {
  try {
    const { fromName, fromAddress, host, port, user, pass } = req.body;

    // Security & Anti-Injection Guard
    if (fromAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fromAddress).trim())) {
      return res.status(400).json({ success: false, message: 'Format alamat email pengirim tidak valid.' });
    }

    if (port !== undefined && port !== null) {
      const portNum = Number(port);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        return res.status(400).json({ success: false, message: 'Port SMTP harus berupa angka valid (1 - 65535).' });
      }
    }

    // Anti-CRLF / Newline Injection check on all text inputs
    const textFields = { fromName, fromAddress, host, user, pass };
    for (const [fieldName, val] of Object.entries(textFields)) {
      if (val && typeof val === 'string' && /[\r\n\0]/.test(val)) {
        return res.status(400).json({ 
          success: false, 
          message: `Input '${fieldName}' mengandung karakter newline (CRLF) yang tidak diizinkan demi keamanan server.` 
        });
      }
    }

    const newConfig = updateRuntimeAndEnvConfig(req.body);
    const activeLabel = (newConfig.platform || newConfig.driver || 'SMTP').toUpperCase();
    await logAuditEvent({
      userName: req.user?.name || 'System Admin',
      role: req.user?.role || 'ADMIN',
      action: 'EMAIL_CONFIG_UPDATED',
      entityType: 'SYSTEM',
      entityId: `GATEWAY-${activeLabel}`,
      description: `Memperbarui konfigurasi gateway email sistem (Host: ${newConfig.host || 'SMTP'})`,
      ipAddress: req.ip
    });
    return res.json({ success: true, message: 'Konfigurasi email gateway berhasil diperbarui!', data: newConfig });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Gagal menyimpan konfigurasi email.' });
  }
}

export async function testConnection(req, res) {
  try {
    const { targetEmail, driver } = req.body;
    if (!targetEmail) {
      return res.status(400).json({ success: false, message: 'Email tujuan wajib diisi.' });
    }
    const result = await testEmailConnection(targetEmail, driver);
    return res.json({ success: true, message: 'Email uji coba berhasil dikirim!', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Gagal mengirim email uji coba.' });
  }
}

export async function sendDispatch(req, res) {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        assignedTo: true
      }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
    }

    if (!ticket.assignedTo) {
      return res.status(400).json({ success: false, message: 'Tiket belum memiliki teknisi penanganan yang ditugaskan.' });
    }

    const result = await sendEngineerDispatchNotification(ticket, ticket.assignedTo, ticket.customer);

    // Rekam milestone tiket
    const now = new Date();
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'Email Penugasan Terkirim ke Teknisi',
        status: ticket.status,
        actorId: req.user?.id || ticket.createdById,
        notes: `Notifikasi penugasan tiket resmi dikirim ke email teknisi (${ticket.assignedTo.name} - ${ticket.assignedTo.email}) oleh ${req.user?.name || 'Admin'}.`,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: req.user?.name || 'System Admin',
      role: req.user?.role || 'ADMIN',
      action: 'EMAIL_DISPATCH_SENT',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Mengirim notifikasi email penugasan tiket ${ticket.ticketNumber} ke teknisi ${ticket.assignedTo.name}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: `Email penugasan berhasil dikirim ke ${ticket.assignedTo.email}!`, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Gagal mengirim email penugasan teknisi.' });
  }
}

export async function sendCustomerTracking(req, res) {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        customerPic: true
      }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
    }

    const host = req.get('host') || 'localhost:5000';
    const proto = req.protocol || 'http';
    const clientBase = (process.env.CLIENT_URL || process.env.APP_URL || `${proto}://${host}`).replace(/\/$/, '');
    const trackingUrl = `${clientBase}/track/${ticket.ticketNumber}?token=${ticket.trackingToken}`;

    const result = await sendTicketCustomerTrackingNotification(ticket, ticket.customer, ticket.customerPic, trackingUrl);

    // Rekam milestone tiket
    const now = new Date();
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'Email Tiket & Tracking Dikirim ke PIC',
        status: ticket.status,
        actorId: req.user?.id || ticket.createdById,
        notes: `Email rincian tiket dan tautan portal tracking mandiri resmi dikirimkan ke PIC klien (${ticket.customerPic?.email || ticket.customer?.name}) oleh ${req.user?.name || 'Admin'}.`,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: req.user?.name || 'System Admin',
      role: req.user?.role || 'ADMIN',
      action: 'EMAIL_CUSTOMER_TRACKING_SENT',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Mengirim email tiket & tautan tracking mandiri ${ticket.ticketNumber} ke PIC klien ${ticket.customerPic?.name || ticket.customer?.name}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: `Email tiket & tautan tracking mandiri berhasil dikirim ke PIC klien!`, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Gagal mengirim email ke PIC klien.' });
  }
}

export async function sendResolutionBap(req, res) {
  try {
    const { id } = req.params;
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: {
        customer: true,
        customerPic: true
      }
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
    }

    const host = req.get('host') || 'localhost:5000';
    const proto = req.protocol || 'http';
    const clientBase = (process.env.CLIENT_URL || process.env.APP_URL || `${proto}://${host}`).replace(/\/$/, '');
    const trackingUrl = `${clientBase}/track/${ticket.ticketNumber}?token=${ticket.trackingToken}`;

    const result = await sendTicketResolutionNotification(ticket, ticket.customer, ticket.customerPic, trackingUrl);

    // Rekam milestone tiket
    const now = new Date();
    await prisma.ticketMilestone.create({
      data: {
        ticketId: ticket.id,
        stepName: 'Berita Acara (BAP) Dikirim ke Klien',
        status: ticket.status,
        actorId: req.user?.id || ticket.createdById,
        notes: `Berita Acara Penyelesaian resmi dikirimkan ke email PIC klien (${ticket.customerPic?.email || ticket.customer?.name}) oleh ${req.user?.name || 'Admin'}.`,
        timestampUtc: now
      }
    });

    await logAuditEvent({
      userName: req.user?.name || 'System Admin',
      role: req.user?.role || 'ADMIN',
      action: 'EMAIL_BAP_SENT',
      entityType: 'TICKET',
      entityId: ticket.ticketNumber,
      description: `Mengirim Berita Acara Penyelesaian (BAP) tiket ${ticket.ticketNumber} ke PIC klien ${ticket.customerPic?.name || ticket.customer?.name}`,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: `Berita Acara resmi berhasil dikirim ke email PIC klien!`, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Gagal mengirim Berita Acara ke klien.' });
  }
}
