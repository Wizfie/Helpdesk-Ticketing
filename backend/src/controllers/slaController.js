import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';

export async function getSlaPolicies(req, res) {
  try {
    const policies = await prisma.slaPolicy.findMany({
      orderBy: { id: 'asc' }
    });
    return res.json(policies);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data kebijakan SLA.', error: error.message });
  }
}

export async function createSlaPolicy(req, res) {
  try {
    const actor = req.user;
    const {
      tierName,
      operatingHours,
      p1ResponseHours,
      p1ResolutionHours,
      p2ResponseHours,
      p2ResolutionHours,
      p3ResponseHours,
      p3ResolutionHours,
      p4ResponseHours,
      p4ResolutionHours,
      notes,
      isActive
    } = req.body;

    if (!tierName || !operatingHours) {
      return res.status(400).json({ message: 'tierName dan operatingHours wajib diisi.' });
    }

    const existing = await prisma.slaPolicy.findUnique({ where: { tierName } });
    if (existing) {
      return res.status(409).json({ message: `Nama kebijakan SLA "${tierName}" sudah digunakan.` });
    }

    const created = await prisma.slaPolicy.create({
      data: {
        tierName,
        operatingHours,
        p1ResponseHours: parseFloat(p1ResponseHours) || 0.5,
        p1ResolutionHours: parseFloat(p1ResolutionHours) || 4,
        p2ResponseHours: parseFloat(p2ResponseHours) || 1,
        p2ResolutionHours: parseFloat(p2ResolutionHours) || 8,
        p3ResponseHours: parseFloat(p3ResponseHours) || 2,
        p3ResolutionHours: parseFloat(p3ResolutionHours) || 24,
        p4ResponseHours: parseFloat(p4ResponseHours) || 4,
        p4ResolutionHours: parseFloat(p4ResolutionHours) || 72,
        notes: notes || null,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role?.code || 'ADMIN',
      action: 'SLA_POLICY_CREATED',
      entityType: 'SLA_POLICY',
      entityId: String(created.id),
      description: `Menambahkan kebijakan SLA baru: ${created.tierName}`,
      ipAddress: req.ip
    });

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal membuat kebijakan SLA.', error: error.message });
  }
}

export async function updateSlaPolicy(req, res) {
  try {
    const { id } = req.params;
    const actor = req.user;
    const {
      tierName,
      operatingHours,
      p1ResponseHours,
      p1ResolutionHours,
      p2ResponseHours,
      p2ResolutionHours,
      p3ResponseHours,
      p3ResolutionHours,
      p4ResponseHours,
      p4ResolutionHours,
      notes,
      isActive
    } = req.body;

    const oldPolicy = await prisma.slaPolicy.findUnique({
      where: { id: Number(id) }
    });
    if (!oldPolicy) return res.status(404).json({ message: 'Kebijakan SLA tidak ditemukan.' });

    const updated = await prisma.slaPolicy.update({
      where: { id: Number(id) },
      data: {
        tierName: tierName || oldPolicy.tierName,
        operatingHours: operatingHours || oldPolicy.operatingHours,
        p1ResponseHours: p1ResponseHours !== undefined ? parseFloat(p1ResponseHours) : oldPolicy.p1ResponseHours,
        p1ResolutionHours: p1ResolutionHours !== undefined ? parseFloat(p1ResolutionHours) : oldPolicy.p1ResolutionHours,
        p2ResponseHours: p2ResponseHours !== undefined ? parseFloat(p2ResponseHours) : oldPolicy.p2ResponseHours,
        p2ResolutionHours: p2ResolutionHours !== undefined ? parseFloat(p2ResolutionHours) : oldPolicy.p2ResolutionHours,
        p3ResponseHours: p3ResponseHours !== undefined ? parseFloat(p3ResponseHours) : oldPolicy.p3ResponseHours,
        p3ResolutionHours: p3ResolutionHours !== undefined ? parseFloat(p3ResolutionHours) : oldPolicy.p3ResolutionHours,
        p4ResponseHours: p4ResponseHours !== undefined ? parseFloat(p4ResponseHours) : oldPolicy.p4ResponseHours,
        p4ResolutionHours: p4ResolutionHours !== undefined ? parseFloat(p4ResolutionHours) : oldPolicy.p4ResolutionHours,
        notes: notes !== undefined ? notes : oldPolicy.notes,
        isActive: isActive !== undefined ? Boolean(isActive) : oldPolicy.isActive
      }
    });

    // Perekaman Audit Log saat parameter SLA diubah (Sesuai MoM Poin 13)
    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role?.code || 'ADMIN',
      action: 'SLA_POLICY_UPDATED',
      entityType: 'SLA_POLICY',
      entityId: String(updated.id),
      description: `Memperbarui matriks batas waktu kontrak SLA ${updated.tierName} (P1 Response: ${updated.p1ResponseHours}j, Resolution: ${updated.p1ResolutionHours}j)`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui kebijakan SLA.', error: error.message });
  }
}

export async function deleteSlaPolicy(req, res) {
  try {
    const { id } = req.params;
    const actor = req.user;

    const policy = await prisma.slaPolicy.findUnique({
      where: { id: Number(id) }
    });
    if (!policy) return res.status(404).json({ message: 'Kebijakan SLA tidak ditemukan.' });

    // Restrict Guard: Cek apakah masih ada customer yang terikat ke kebijakan SLA ini
    const attachedCustomers = await prisma.customer.findMany({
      where: {
        OR: [
          { slaTier: policy.tierName },
          { slaTier: { contains: policy.tierName } }
        ]
      },
      select: {
        id: true,
        name: true,
        slaTier: true
      }
    });

    if (attachedCustomers.length > 0) {
      const customerNames = attachedCustomers.map(c => c.name);
      const previewNames = customerNames.slice(0, 3).join(', ');
      const moreCount = customerNames.length > 3 ? ` dan ${customerNames.length - 3} pelanggan lainnya` : '';

      return res.status(409).json({
        message: `Kebijakan SLA "${policy.tierName}" tidak dapat dihapus karena masih aktif digunakan oleh ${attachedCustomers.length} pelanggan (${previewNames}${moreCount}). Silakan alihkan kontrak pelanggan ke SLA lain terlebih dahulu.`,
        customerCount: attachedCustomers.length,
        customers: customerNames
      });
    }

    await prisma.slaPolicy.delete({ where: { id: Number(id) } });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role?.code || 'ADMIN',
      action: 'SLA_POLICY_DELETED',
      entityType: 'SLA_POLICY',
      entityId: String(policy.id),
      description: `Menghapus kebijakan SLA: ${policy.tierName}`,
      ipAddress: req.ip
    });

    return res.json({ message: 'Kebijakan SLA berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus kebijakan SLA.', error: error.message });
  }
}
