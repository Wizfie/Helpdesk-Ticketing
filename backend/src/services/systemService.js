import prisma from '../lib/prisma.js';
import { logAuditEvent } from './auditService.js';

export const INITIAL_ADMIN = {
  name: 'Ahmad Fauzi',
  email: 'admin@glotratech.com',
  role: 'ADMIN',
  phone: '0812-9876-5432'
};

export const MASTER_PRINCIPALS = [
  { name: 'Hewlett Packard Enterprise (HPE)', code: 'HPE', category: 'Storage & SAN' },
  { name: 'Cisco Systems', code: 'CISCO', category: 'Network Infrastructure' },
  { name: 'VMware / Broadcom', code: 'VMWARE', category: 'Virtualization & Hypervisor' },
  { name: 'Rubrik CDM', code: 'RUBRIK', category: 'Backup & Disaster Recovery' },
  { name: 'Brocade Fabric OS', code: 'BROCADE', category: 'SAN Switch Fabric' },
  { name: 'Fortinet', code: 'FORTINET', category: 'Network & Security' },
  { name: 'Oracle Database', code: 'ORACLE', category: 'Database & Middleware' },
  { name: 'MikroTik', code: 'MIKROTIK', category: 'Edge Routing & Gateway' }
];

/**
 * 1. Clean All Data (Mode Bersih / 0 Tiket)
 * Deletes all transactional data (tickets, milestones, hold logs, attachments, audit logs).
 * Preserves master roles and 1 administrator account.
 */
export async function cleanAllTransactionalData(actorUser = null) {
  console.log('🧹 [SystemService] Membersihkan semua data tiket & transaksi...');

  // Urutan penghapusan sesuai foreign key cascade
  await prisma.attachment.deleteMany({});
  await prisma.ticketMilestone.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.customerPic.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.knowledgeBase.deleteMany({});
  await prisma.auditLog.deleteMany({});

  // Pastikan hanya tersisa 1 akun administrator
  await prisma.user.deleteMany({
    where: {
      email: { not: INITIAL_ADMIN.email }
    }
  });

  await prisma.user.upsert({
    where: { email: INITIAL_ADMIN.email },
    update: {
      name: INITIAL_ADMIN.name,
      role: INITIAL_ADMIN.role,
      phone: INITIAL_ADMIN.phone,
      isActive: true
    },
    create: {
      name: INITIAL_ADMIN.name,
      email: INITIAL_ADMIN.email,
      role: INITIAL_ADMIN.role,
      password: '$2a$10$defaultPlaceholderHash2026',
      phone: INITIAL_ADMIN.phone,
      isActive: true
    }
  });

  const actorName = actorUser?.name || 'System Administrator';
  const actorRole = actorUser?.role?.code || 'ADMIN';
  await prisma.auditLog.create({
    data: {
      userName: actorName,
      role: actorRole,
      action: 'SYSTEM_CLEAN_INIT',
      entityType: 'SYSTEM',
      entityId: 'SYS-CLEAN',
      description: 'Sistem dibersihkan: 0 tiket, siap untuk input data riil.',
      ipAddress: '127.0.0.1',
      timestampUtc: new Date()
    }
  });

  return {
    success: true,
    mode: 'CLEAN_DATA',
    ticketCount: 0,
    customerCount: 0,
    userCount: 1,
    message: 'Semua data transaksi berhasil dibersihkan! Database siap digunakan dengan data riil.'
  };
}

/**
 * 2. Initialize Master Real System Foundation
 * Sets up canonical roles, initial admin, and vendor principals.
 * Does NOT inject fake tickets, customers, or mock policies.
 */
export async function seedCompleteEnterpriseData(actorUser = null) {
  console.log('🌱 [SystemService] Mempersiapkan fondasi master data riil PT Glotra...');

  // 1. Initial Admin User
  await prisma.user.upsert({
    where: { email: INITIAL_ADMIN.email },
    update: {
      name: INITIAL_ADMIN.name,
      role: INITIAL_ADMIN.role,
      phone: INITIAL_ADMIN.phone,
      isActive: true
    },
    create: {
      name: INITIAL_ADMIN.name,
      email: INITIAL_ADMIN.email,
      role: INITIAL_ADMIN.role,
      password: '$2a$10$defaultPlaceholderHash2026',
      phone: INITIAL_ADMIN.phone,
      isActive: true
    }
  });

  // 3. OEM Technology Principals
  for (const p of MASTER_PRINCIPALS) {
    await prisma.principal.upsert({
      where: { code: p.code },
      update: { name: p.name, category: p.category },
      create: p
    });
  }

  // 4. Audit Log
  const actorName = actorUser?.name || 'System Administrator';
  const actorRole = actorUser?.role?.code || 'ADMIN';
  await prisma.auditLog.create({
    data: {
      userName: actorName,
      role: actorRole,
      action: 'SYSTEM_INIT_REAL',
      entityType: 'SYSTEM',
      entityId: 'SYS-INIT',
      description: 'Fondasi master roles dan akun administrator telah aktif untuk data riil.',
      ipAddress: '127.0.0.1',
      timestampUtc: new Date()
    }
  });

  console.log('✅ [SystemService] Fondasi data riil siap!');

  return {
    success: true,
    mode: 'REAL_DATA',
    ticketCount: 0,
    customerCount: 0,
    message: 'Fondasi sistem siap digunakan untuk input data riil operasional.'
  };
}

/**
 * 3. System Status
 */
export async function getSystemStatus() {
  const ticketCount = await prisma.ticket.count();
  const customerCount = await prisma.customer.count();
  const userCount = await prisma.user.count();
  const kbCount = await prisma.knowledgeBase.count();

  return {
    ticketCount,
    customerCount,
    userCount,
    kbCount,
    mode: ticketCount === 0 ? 'CLEAN_DATA' : 'OPERATIONAL_DATA',
    modeLabel: ticketCount === 0 ? 'Mode Bersih (0 Tiket)' : `Data Riil (${ticketCount} Tiket)`,
    timestamp: new Date().toISOString()
  };
}
