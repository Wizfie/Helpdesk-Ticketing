import prisma from '../lib/prisma.js';
import { logAuditEvent } from './auditService.js';
import crypto from 'crypto';

export const INITIAL_ADMIN = {
  name: 'Ahmad Fauzi',
  email: 'admin@glotratech.com',
  role: 'ADMIN',
  phone: '0811-9988-771'
};

export const INITIAL_ENGINEERS = [
  {
    id: 10,
    name: 'Farhan Pratama',
    email: 'farhan.eng@glotratech.com',
    role: 'ENGINEER',
    phone: '0812-9999-8888'
  },
  {
    id: 11,
    name: 'Budi Santoso',
    email: 'budi.eng@glotratech.com',
    role: 'ENGINEER',
    phone: '0813-1122-3344'
  },
  {
    id: 12,
    name: 'Rizky Ramadhani',
    email: 'rizky.eng@glotratech.com',
    role: 'ENGINEER',
    phone: '0812-4455-6677'
  },
  {
    id: 13,
    name: 'Siti Nurhaliza',
    email: 'siti.eng@glotratech.com',
    role: 'ENGINEER',
    phone: '0813-7788-9900'
  },
  {
    id: 14,
    name: 'Dimas Anggara',
    email: 'dimas.eng@glotratech.com',
    role: 'ENGINEER',
    phone: '0812-3344-5566'
  }
];

/**
 * 1. Clean All Data (Mode Bersih / 0 Tiket)
 * Deletes all transactional data (tickets, milestones, hold logs, attachments, audit logs).
 * Preserves master roles and 1 administrator account.
 */
export async function cleanAllTransactionalData(actorUser = null) {
  console.log('🧹 [SystemService] Membersihkan semua data tiket & transaksi...');

  // Urutan penghapusan sesuai foreign key cascade
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
 * 2. Initialize Master Enterprise Data & Realistic Seed Tickets
 * Seeds users (admin + engineers), SLA policies (including Titanium), categories, customers, and tickets (TK-26001..26006).
 */
export async function seedCompleteEnterpriseData(actorUser = null) {
  console.log('🌱 [SystemService] Mempersiapkan data enterprise PT Glotra (Users, SLA, Customers, Tickets)...');

  // 0. Truncate data transaksi & relasi lama untuk memastikan re-seeding bersih dan mutakhir
  await prisma.ticketMilestone.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.customerPic.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.slaPolicy.deleteMany({});

  // 1. Users (Admin + 5 Engineers)
  const allUsers = [INITIAL_ADMIN, ...INITIAL_ENGINEERS];
  const userMap = {};
  for (const u of allUsers) {
    const upserted = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        phone: u.phone,
        isActive: true
      },
      create: {
        name: u.name,
        email: u.email,
        role: u.role,
        password: '$2a$10$defaultPlaceholderHash2026',
        phone: u.phone,
        isActive: true
      }
    });
    userMap[u.email] = upserted;
  }

  // 2. Master SLA Policies (including TITANIUM 24x7 CRITICAL)
  const slaPoliciesData = [
    {
      tierName: 'TITANIUM 24x7 CRITICAL',
      operatingHours: '24 Jam x 7 Hari (Non-Stop)',
      p1ResponseHours: 0.25,
      p1ResolutionHours: 2.0,
      p2ResponseHours: 0.5,
      p2ResolutionHours: 4.0,
      p3ResponseHours: 1.0,
      p3ResolutionHours: 12.0,
      p4ResponseHours: 2.0,
      p4ResolutionHours: 24.0,
      notes: 'Tier prioritas tertinggi untuk sistem perbankan & mission-critical tier-1 dengan respons darurat 15 menit dan jaminan resolusi maksimal 2 jam.',
      isActive: true
    },
    {
      tierName: 'GOLD 24x7 PRODUCTION',
      operatingHours: '24 Jam x 7 Hari (Non-Stop)',
      p1ResponseHours: 0.5,
      p1ResolutionHours: 4.0,
      p2ResponseHours: 1.0,
      p2ResolutionHours: 8.0,
      p3ResponseHours: 2.0,
      p3ResolutionHours: 24.0,
      p4ResponseHours: 4.0,
      p4ResolutionHours: 72.0,
      notes: 'Paket enterprise standar untuk sistem operasional produksi 24 jam.',
      isActive: true
    },
    {
      tierName: 'SILVER 8x5 BUSINESS',
      operatingHours: 'Senin - Jumat (08:00 - 17:00 WIB)',
      p1ResponseHours: 1.0,
      p1ResolutionHours: 8.0,
      p2ResponseHours: 2.0,
      p2ResolutionHours: 32.0,
      p3ResponseHours: 4.0,
      p3ResolutionHours: 48.0,
      p4ResponseHours: 8.0,
      p4ResolutionHours: 72.0,
      notes: 'Paket operasional jam kerja reguler Senin hingga Jumat.',
      isActive: true
    }
  ];

  for (const sp of slaPoliciesData) {
    await prisma.slaPolicy.upsert({
      where: { tierName: sp.tierName },
      update: sp,
      create: sp
    });
  }

  // 4. Master Categories (kb_options)
  const categoriesData = [
    'Server & Hardware',
    'Jaringan & Switching',
    'Storage & SAN Fabric',
    'Virtualisasi & Cloud',
    'Keamanan & Firewall'
  ];
  const categoryMap = {};
  for (const catName of categoriesData) {
    const cat = await prisma.kbOption.upsert({
      where: {
        type_name: { type: 'CATEGORY', name: catName }
      },
      update: {},
      create: { type: 'CATEGORY', name: catName }
    });
    categoryMap[catName] = cat;
  }

  // 5. Master Customers & PICs
  const customersData = [
    {
      name: 'PT Astra Graphia Information Technology',
      industry: 'Teknologi Informasi & Integrator',
      slaTier: 'GOLD 24x7 PRODUCTION',
      address: 'Jl. Kramat Raya No. 43, Senen, Jakarta Pusat',
      ticketQuota: 'Unlimited',
      pics: [
        { name: 'Bambang Trihatmodjo', phone: '08123456789', email: 'bambang.t@agit.astra.co.id' },
        { name: 'Fransiska Merita', phone: '08139988776', email: 'fransiska@agit.astra.co.id' }
      ]
    },
    {
      name: 'PT Bank Central Asia Tbk (BCA)',
      industry: 'Perbankan & Jasa Keuangan',
      slaTier: 'TITANIUM 24x7 CRITICAL',
      address: 'Menara BCA, Grand Indonesia, Jl. M.H. Thamrin No. 1, Jakarta Pusat',
      ticketQuota: 'Unlimited',
      pics: [
        { name: 'Hendrik Pratama', phone: '081122334455', email: 'hendrik.p@bca.co.id' }
      ]
    },
    {
      name: 'PT Telekomunikasi Selular (Telkomsel)',
      industry: 'Telekomunikasi Seluler',
      slaTier: 'SILVER 8x5 BUSINESS',
      address: 'Telkom Landmark Tower, Jl. Gatot Subroto Kav. 52, Jakarta Selatan',
      ticketQuota: '50',
      pics: [
        { name: 'Dini Fitria', phone: '081288990011', email: 'dini.fitria@telkomsel.co.id' }
      ]
    }
  ];

  const customerList = [];
  for (const c of customersData) {
    let cust = await prisma.customer.findFirst({ where: { name: c.name }, include: { pics: true } });
    if (!cust) {
      cust = await prisma.customer.create({
        data: {
          name: c.name,
          industry: c.industry,
          slaTier: c.slaTier,
          address: c.address,
          ticketQuota: c.ticketQuota,
          isActive: true,
          pics: {
            create: c.pics
          }
        },
        include: { pics: true }
      });
    }
    customerList.push(cust);
  }

  // 6. Realistic Tickets (TK-26001..26006)
  const now = new Date();
  const c1 = customerList[0];
  const c2 = customerList[1] || c1;
  const c3 = customerList[2] || c1;

  const adminId = userMap['admin@glotratech.com']?.id || 1;
  const engFarhanId = userMap['farhan.eng@glotratech.com']?.id || 10;
  const engBudiId = userMap['budi.eng@glotratech.com']?.id || engFarhanId;
  const engRizkyId = userMap['rizky.eng@glotratech.com']?.id || engFarhanId;
  const engSitiId = userMap['siti.eng@glotratech.com']?.id || engFarhanId;
  const engDimasId = userMap['dimas.eng@glotratech.com']?.id || engFarhanId;

  const ticketsSeed = [
    {
      ticketNumber: 'TK-26001',
      title: 'Server Down / Storage Controller Degraded',
      customerId: c1.id,
      customerPicId: c1.pics[0]?.id || null,
      ticketType: 'Incident',
      categoryId: categoryMap['Server & Hardware']?.id || null,
      serialNumber: 'SN-HPE-3PAR-8200',
      severity: 'HIGH',
      status: 'ASSIGNED',
      createdById: adminId,
      assignedToId: engFarhanId,
      contractTier: 'GOLD 24x7 PRODUCTION',
      description: 'Perangkat storage array controller Node 0 mengalami kegagalan hardware bus. Failover otomatis berpindah ke Node 1 namun performa throughput I/O terdegradasi sebesar 60%. Seluruh host ESXi melaporkan latency tinggi.',
      trackingToken: 'trk_' + crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(now.getTime() - 45 * 60 * 1000),
      respondedAt: new Date(now.getTime() - 30 * 60 * 1000),
      responseDeadline: new Date(now.getTime() - 15 * 60 * 1000),
      resolutionDeadline: new Date(now.getTime() + 3.25 * 3600 * 1000),
      milestones: [
        {
          stepName: 'Ticket Intake & Auto-Assignment',
          status: 'ASSIGNED',
          actorId: adminId,
          notes: 'Tiket berhasil diterbitkan dengan format baru TK-26001. Penugasan dialokasikan ke Teknisi Farhan Pratama. First touch SLA terpenuhi dalam 15 menit.',
          timestampUtc: new Date(now.getTime() - 30 * 60 * 1000)
        }
      ]
    },
    {
      ticketNumber: 'TK-26002',
      title: 'Core Switch Trunk Link Flapping (Intermittent Packet Loss)',
      customerId: c2.id,
      customerPicId: c2.pics[0]?.id || null,
      ticketType: 'Incident',
      categoryId: categoryMap['Jaringan & Switching']?.id || null,
      serialNumber: 'SN-CSCO-N9K-93180',
      severity: 'HIGH',
      status: 'IN_PROGRESS',
      createdById: adminId,
      assignedToId: engBudiId,
      contractTier: 'TITANIUM 24x7 CRITICAL',
      description: 'Port-Channel trunk antar Core Switch Data Center 1 dan Data Center 2 mengalami flapping berkala setiap 8-10 menit. Paket loss terukur 30%. Membutuhkan deep inspection transceiver optics dan link budget.',
      trackingToken: 'trk_' + crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(now.getTime() - 50 * 60 * 1000),
      respondedAt: new Date(now.getTime() - 40 * 60 * 1000),
      responseDeadline: new Date(now.getTime() - 35 * 60 * 1000),
      resolutionDeadline: new Date(now.getTime() + 70 * 60 * 1000),
      milestones: [
        {
          stepName: 'Intake & Assignment',
          status: 'ASSIGNED',
          actorId: engBudiId,
          notes: 'Tiket ditugaskan langsung. Memulai investigasi telemetry switch Cisco Nexus 9300.',
          timestampUtc: new Date(now.getTime() - 40 * 60 * 1000)
        },
        {
          stepName: 'Optical Power Diagnostics',
          status: 'IN_PROGRESS',
          actorId: engBudiId,
          notes: 'Hasil eksekusi "show interface transceiver details": Rx power pada modul SFP-10G-LR port Eth1/49 terbaca -14.8 dBm (di bawah optical threshold -11.0 dBm). Diperlukan pembersihan fiber optic patch cord.',
          timestampUtc: new Date(now.getTime() - 20 * 60 * 1000)
        }
      ]
    },
    {
      ticketNumber: 'TK-26003',
      title: 'SFP+ 16Gb Optical Module Defective pada SAN Switch',
      customerId: c1.id,
      customerPicId: c1.pics[0]?.id || null,
      ticketType: 'Incident',
      categoryId: categoryMap['Storage & SAN Fabric']?.id || null,
      serialNumber: 'SN-BRCD-G620',
      severity: 'MEDIUM',
      status: 'PENDING_VENDOR',
      createdById: adminId,
      assignedToId: engRizkyId,
      contractTier: 'GOLD 24x7 PRODUCTION',
      description: 'Modul SFP+ pada port FC 12 switch Brocade G620 mati total. Tidak ada link light. Telah dicoba pembersihan optic patch cord, dipastikan modul optik rusak fisik (laser diode failure).',
      trackingToken: 'trk_' + crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(now.getTime() - 120 * 60 * 1000),
      respondedAt: new Date(now.getTime() - 100 * 60 * 1000),
      responseDeadline: new Date(now.getTime() - 60 * 60 * 1000),
      resolutionDeadline: new Date(now.getTime() + 6 * 3600 * 1000),
      isPaused: true,
      pauseReason: 'PART_HARDWARE',
      pausedAt: new Date(now.getTime() - 60 * 60 * 1000),
      milestones: [
        {
          stepName: 'Intake & Assignment',
          status: 'ASSIGNED',
          actorId: adminId,
          notes: 'Tiket diterbitkan dan dialokasikan ke teknisi.',
          timestampUtc: new Date(now.getTime() - 100 * 60 * 1000)
        },
        {
          stepName: 'Penahanan SLA: Part/Hardware',
          status: 'PENDING_VENDOR',
          actorId: engRizkyId,
          notes: 'Timer Resolution SLA dibekukan sementara (Penahan SLA: Part/Hardware). Kasus RMA dibuka ke principal Brocade dengan No. Tiket RMA-BRCD-99412.',
          timestampUtc: new Date(now.getTime() - 60 * 60 * 1000)
        }
      ]
    },
    {
      ticketNumber: 'TK-26004',
      title: 'Maintenance Window Approval untuk Hotfix Kernel Firewall',
      customerId: c3.id,
      customerPicId: c3.pics[0]?.id || null,
      ticketType: 'Incident',
      categoryId: categoryMap['Keamanan & Firewall']?.id || null,
      serialNumber: 'SN-FGT-100F-BD90',
      severity: 'MEDIUM',
      status: 'PENDING_CUSTOMER',
      createdById: adminId,
      assignedToId: engSitiId,
      contractTier: 'SILVER 8x5 BUSINESS',
      description: 'Ditemukan indikasi memory leak pada modul IPS engine FortiOS v7.2.3. Patch hotfix telah diverifikasi di lab staging, namun eksekusi production membutuhkan reboot cluster HA dan jendela pemeliharaan resmi dari manajemen klien.',
      trackingToken: 'trk_' + crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(now.getTime() - 150 * 60 * 1000),
      respondedAt: new Date(now.getTime() - 130 * 60 * 1000),
      responseDeadline: new Date(now.getTime() - 90 * 60 * 1000),
      resolutionDeadline: new Date(now.getTime() + 14 * 3600 * 1000),
      isPaused: true,
      pauseReason: 'PARTNER_CUSTOMER',
      pausedAt: new Date(now.getTime() - 90 * 60 * 1000),
      milestones: [
        {
          stepName: 'Penahanan SLA: Partner/Customer',
          status: 'PENDING_CUSTOMER',
          actorId: engSitiId,
          notes: 'Timer SLA dijeda sementara. Mengirimkan permohonan change request dan jadwal window maintenance kepada PIC customer via email resmi.',
          timestampUtc: new Date(now.getTime() - 90 * 60 * 1000)
        }
      ]
    },
    {
      ticketNumber: 'TK-26005',
      title: 'ESXi Host Purple Screen of Death (PSOD) pasca Driver Update',
      customerId: c2.id,
      customerPicId: c2.pics[0]?.id || null,
      ticketType: 'Incident',
      categoryId: categoryMap['Virtualisasi & Cloud']?.id || null,
      serialNumber: 'SN-VMW-ESXI-703',
      severity: 'HIGH',
      status: 'RESOLVED',
      createdById: adminId,
      assignedToId: engFarhanId,
      contractTier: 'TITANIUM 24x7 CRITICAL',
      description: 'Host ESXi prod-03 mengalami PSOD dengan exception "Panic: 0x439121 CPU 12 / ixgben lock contention". Sebanyak 18 VM terdampak mengalami restart via vSphere HA.',
      rootCause: 'Bug inkompatibilitas firmware kartu NIC 10GbE Intel x550 dengan async driver versi 1.10.3 pada ESXi 7.0 Update 3.',
      resolutionStrategy: 'Rollback async driver ixgben ke versi 1.7.1 stability baseline melalui SSH CLI, kemudian update EEPROM microcode sesuai panduan VMware KB-82154.',
      recommendation: 'Lakukan firmware pinning pada image profile Host vCenter dan nonaktifkan automatic driver staging tanpa uji coba lab.',
      trackingToken: 'trk_' + crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(now.getTime() - 2 * 3600 * 1000),
      respondedAt: new Date(now.getTime() - 1.8 * 3600 * 1000),
      responseDeadline: new Date(now.getTime() - 1.75 * 3600 * 1000),
      resolutionDeadline: new Date(now.getTime()),
      resolvedAt: new Date(now.getTime() - 1 * 3600 * 1000),
      milestones: [
        {
          stepName: 'Penyelesaian Tiket (Resolved)',
          status: 'RESOLVED',
          actorId: engFarhanId,
          notes: 'Seluruh VM telah dimigrasi kembali ke prod-03. Uji beban CPU dan IOPS 60 menit lulus tanpa drop paket. Tiket diselesaikan sesuai target SLA 2 jam.',
          timestampUtc: new Date(now.getTime() - 1 * 3600 * 1000)
        }
      ]
    },
    {
      ticketNumber: 'TK-26006',
      title: 'Database Archival Backup Storage Full Capacity Warning',
      customerId: c3.id,
      customerPicId: c3.pics[0]?.id || null,
      ticketType: 'Incident',
      categoryId: categoryMap['Storage & SAN Fabric']?.id || null,
      serialNumber: 'SN-RBK-R6412-CL',
      severity: 'LOW',
      status: 'CLOSED',
      createdById: adminId,
      assignedToId: engDimasId,
      contractTier: 'SILVER 8x5 BUSINESS',
      description: 'Storage pool backup harian mencapai utilitas 94%. Dibutuhkan pembersihan log transaksi kadaluarsa dan optimasi snapshot retention.',
      rootCause: 'Retensi snapshot database staging tidak terpangkas otomatis karena task scheduler internal appliance terhenti.',
      resolutionStrategy: 'Restart SLA archival policy di Rubrik CDM console, force prune snapshot lebih dari 30 hari, membebaskan kapasitas 4.2 TB storage pool.',
      recommendation: 'Pasang alert SNMP trap utilitas kapasitas pada ambang batas 85% untuk early notification.',
      trackingToken: 'trk_' + crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(now.getTime() - 24 * 3600 * 1000),
      respondedAt: new Date(now.getTime() - 23.5 * 3600 * 1000),
      responseDeadline: new Date(now.getTime() - 20 * 3600 * 1000),
      resolutionDeadline: new Date(now.getTime() + 12 * 3600 * 1000),
      resolvedAt: new Date(now.getTime() - 18 * 3600 * 1000),
      closedAt: new Date(now.getTime() - 12 * 3600 * 1000),
      milestones: [
        {
          stepName: 'Verifikasi Klien & Tiket Ditutup',
          status: 'CLOSED',
          actorId: engDimasId,
          notes: 'Customer telah mengonfirmasi bahwa backup job semalam berjalan sukses 100%. Tiket ditutup permanen.',
          timestampUtc: new Date(now.getTime() - 12 * 3600 * 1000)
        }
      ]
    }
  ];

  for (const t of ticketsSeed) {
    const { milestones, ...ticketData } = t;
    const createdTicket = await prisma.ticket.create({
      data: ticketData
    });
    if (milestones && milestones.length > 0) {
      for (const m of milestones) {
        await prisma.ticketMilestone.create({
          data: {
            ticketId: createdTicket.id,
            ...m
          }
        });
      }
    }
  }

  // 7. Audit Log
  const actorName = actorUser?.name || 'System Administrator';
  const actorRole = actorUser?.role?.code || 'ADMIN';
  await prisma.auditLog.create({
    data: {
      userName: actorName,
      role: actorRole,
      action: 'SYSTEM_INIT_REAL',
      entityType: 'SYSTEM',
      entityId: 'SYS-INIT',
      description: 'Master data (Users, SLA Titanium, Customers, TK-26001..26006) berhasil di-seed.',
      ipAddress: '127.0.0.1',
      timestampUtc: new Date()
    }
  });

  console.log('✅ [SystemService] Seeding data enterprise PT Glotra sukses!');

  const ticketCount = await prisma.ticket.count();
  const customerCount = await prisma.customer.count();
  const userCount = await prisma.user.count();

  return {
    success: true,
    mode: 'REAL_DATA',
    ticketCount,
    customerCount,
    userCount,
    message: `Berhasil melakukan seeding: ${ticketCount} tiket insiden, ${customerCount} mitra klien, ${userCount} pengguna (admin & engineers), dan paket SLA Titanium!`
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
