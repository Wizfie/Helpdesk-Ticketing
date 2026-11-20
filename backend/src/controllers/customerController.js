import prisma from '../lib/prisma.js';
import { logAuditEvent } from '../services/auditService.js';

export async function getCustomers(req, res) {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        pics: true,
        _count: {
          select: {
            tickets: {
              where: { status: { not: 'CLOSED' } }
            }
          }
        }
      },
      orderBy: { id: 'asc' }
    });
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal mengambil data klien mitra.', error: error.message });
  }
}

export async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: {
        pics: true,
        tickets: {
          orderBy: { id: 'desc' },
          take: 10
        }
      }
    });
    if (!customer) return res.status(404).json({ message: 'Data mitra tidak ditemukan.' });
    return res.json(customer);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memuat detail klien mitra.', error: error.message });
  }
}

export async function createCustomer(req, res) {
  try {
    const { name, industry, slaTier, address, picName, picPhone, picEmail, ticketQuota, maintenanceStart, maintenanceEnd } = req.body;
    const actor = req.user;

    const assignedSlaTier = slaTier || 'GOLD';

    const newCustomer = await prisma.customer.create({
      data: {
        name,
        industry: industry || null,
        slaTier: assignedSlaTier,
        address: address || '',
        maintenanceStart: maintenanceStart || null,
        maintenanceEnd: maintenanceEnd || null,
        ticketQuota: ticketQuota ? String(ticketQuota) : 'Unlimited',
        isActive: true,
        pics: {
          create: [
            {
              name: picName,
              phone: picPhone,
              email: picEmail
            }
          ]
        }
      },
      include: { pics: true }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role || 'ADMIN',
      action: 'CUSTOMER_CREATED',
      entityType: 'CUSTOMER',
      entityId: String(newCustomer.id),
      description: `Mendaftarkan klien mitra baru: ${newCustomer.name}`,
      ipAddress: req.ip
    });

    return res.status(201).json(newCustomer);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan mitra baru.', error: error.message });
  }
}

export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name, industry, slaTier, address, isActive, maintenanceStart, maintenanceEnd, ticketQuota } = req.body;
    const actor = req.user;

    const updated = await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        name,
        industry: industry !== undefined ? industry : undefined,
        slaTier: slaTier !== undefined ? slaTier : undefined,
        address,
        maintenanceStart: maintenanceStart !== undefined ? maintenanceStart : undefined,
        maintenanceEnd: maintenanceEnd !== undefined ? maintenanceEnd : undefined,
        ticketQuota: ticketQuota !== undefined ? String(ticketQuota) : undefined,
        isActive
      },
      include: { pics: true }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role || 'ADMIN',
      action: 'CUSTOMER_UPDATED',
      entityType: 'CUSTOMER',
      entityId: String(updated.id),
      description: `Memperbarui profil mitra korporat: ${updated.name}`,
      ipAddress: req.ip
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui profil mitra.', error: error.message });
  }
}

export async function addCustomerPic(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, email } = req.body;
    const actor = req.user;

    const customer = await prisma.customer.findUnique({ where: { id: Number(id) } });
    if (!customer) return res.status(404).json({ message: 'Mitra tidak ditemukan.' });

    const pic = await prisma.customerPic.create({
      data: {
        customerId: customer.id,
        name,
        phone,
        email
      }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role || 'ADMIN',
      action: 'CUSTOMER_PIC_ADDED',
      entityType: 'CUSTOMER',
      entityId: String(customer.id),
      description: `Menambahkan kontak PIC baru ${pic.name} untuk mitra ${customer.name}`,
      ipAddress: req.ip
    });

    return res.status(201).json(pic);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menambahkan kontak PIC mitra.', error: error.message });
  }
}

export async function deleteCustomer(req, res) {
  try {
    const { id } = req.params;
    const actor = req.user;

    const customer = await prisma.customer.findUnique({
      where: { id: Number(id) },
      include: { _count: { select: { tickets: true } } }
    });

    if (!customer) {
      return res.status(404).json({ message: 'Mitra tidak ditemukan.' });
    }

    if (customer._count.tickets > 0) {
      return res.status(400).json({ 
        message: `Tidak dapat menghapus mitra "${customer.name}" karena memiliki ${customer._count.tickets} riwayat tiket terkait. Arsipkan atau selesaikan tiket terlebih dahulu.` 
      });
    }

    await prisma.customerPic.deleteMany({ where: { customerId: Number(id) } });
    await prisma.customer.delete({ where: { id: Number(id) } });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role || 'ADMIN',
      action: 'CUSTOMER_DELETED',
      entityType: 'CUSTOMER',
      entityId: String(customer.id),
      description: `Menghapus data klien mitra: ${customer.name}`,
      ipAddress: req.ip
    });

    return res.json({ message: `Mitra ${customer.name} berhasil dihapus.`, deletedId: Number(id) });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus mitra.', error: error.message });
  }
}

export async function updateCustomerPic(req, res) {
  try {
    const { id, picId } = req.params;
    const { name, phone, email } = req.body;
    const actor = req.user;

    const updatedPic = await prisma.customerPic.update({
      where: { id: Number(picId) },
      data: { name, phone, email }
    });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role || 'ADMIN',
      action: 'CUSTOMER_PIC_UPDATED',
      entityType: 'CUSTOMER',
      entityId: String(id),
      description: `Memperbarui kontak PIC: ${updatedPic.name}`,
      ipAddress: req.ip
    });

    return res.json(updatedPic);
  } catch (error) {
    return res.status(500).json({ message: 'Gagal memperbarui kontak PIC.', error: error.message });
  }
}

export async function deleteCustomerPic(req, res) {
  try {
    const { id, picId } = req.params;
    const actor = req.user;

    const pic = await prisma.customerPic.findUnique({ where: { id: Number(picId) } });
    if (!pic) return res.status(404).json({ message: 'Kontak PIC tidak ditemukan.' });

    await prisma.customerPic.delete({ where: { id: Number(picId) } });

    await logAuditEvent({
      userName: actor?.name || 'System Admin',
      role: actor?.role?.code || 'ADMIN',
      action: 'CUSTOMER_PIC_DELETED',
      entityType: 'CUSTOMER',
      entityId: String(id),
      description: `Menghapus kontak PIC: ${pic.name}`,
      ipAddress: req.ip
    });

    return res.json({ message: 'Kontak PIC berhasil dihapus.', deletedPicId: Number(picId) });
  } catch (error) {
    return res.status(500).json({ message: 'Gagal menghapus kontak PIC.', error: error.message });
  }
}
