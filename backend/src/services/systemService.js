import prisma from '../lib/prisma.js';
import { logAuditEvent } from './auditService.js';
import { 
  ROLES, 
  MOCK_USERS, 
  MOCK_CUSTOMERS, 
  MOCK_CATEGORIES, 
  MOCK_SLA_POLICIES, 
  INITIAL_TICKETS, 
  MOCK_KNOWLEDGE_BASE, 
  MOCK_AUDIT_LOGS 
} from '../../../frontend/src/data/mockData.js';

/**
 * 1. Clean All Data (Mode Bersih / 0 Tiket)
 * Deletes all transactional data (tickets, milestones, hold logs, attachments, audit logs).
 * Master data (roles, users, customers, categories, SLA policies) remain intact.
 */
export async function cleanAllTransactionalData(actorUser = null) {
  console.log('🧹 [SystemService] Membersihkan semua data tiket & transaksi (Mode Bersih 0 Tiket)...');

  // Urutan penghapusan sesuai foreign key cascade
  await prisma.attachment.deleteMany({});
  await prisma.slaHoldLog.deleteMany({});
  await prisma.ticketMilestone.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.auditLog.deleteMany({});

  // Catat event inisialisasi Mode Bersih di Audit Log
  const userName = actorUser?.name || 'System Administrator';
  const roleName = actorUser?.role?.code || 'ADMIN';

  await prisma.auditLog.create({
    data: {
      userName,
      role: roleName,
      action: 'SYSTEM_CLEAN_INIT',
      entityType: 'SYSTEM',
      entityId: 'SYS-CLEAN',
      description: 'Sistem Helpdesk dialihkan ke Mode Bersih (0 Tiket) via antarmuka UI. Database siap untuk pengujian alur tiket baru dari nol.',
      ipAddress: '127.0.0.1',
      timestampUtc: new Date()
    }
  });

  return {
    success: true,
    mode: 'CLEAN_DATA',
    ticketCount: 0,
    message: 'Semua tiket berhasil dibersihkan! Database kini berada dalam Mode Bersih (0 Tiket) untuk pengujian alur tiket baru dari awal.'
  };
}

/**
 * 2. Full Seeding (Muat Ulang 156 Tiket Realistis & Master Data)
 * Re-populates the database with the complete canonical dataset.
 */
export async function seedCompleteEnterpriseData(actorUser = null) {
  console.log('🌱 [SystemService] Memulai seeding database Helpdesk PT Glotra (156 Tiket + Master Data)...');

  // 1. Bersihkan semua data dengan urutan foreign key
  await prisma.attachment.deleteMany({});
  await prisma.slaHoldLog.deleteMany({});
  await prisma.ticketMilestone.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.customerPic.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.quickPreset.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.knowledgeBase.deleteMany({});
  await prisma.principal.deleteMany({});
  await prisma.slaHoldReason.deleteMany({});
  await prisma.slaPolicy.deleteMany({});
  await prisma.auditLog.deleteMany({});

  // 2. Roles
  for (const r of ROLES) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: { name: r.name },
      create: { code: r.code, name: r.name }
    });
  }
  const roleAdmin = await prisma.role.findUnique({ where: { code: 'ADMIN' } });
  const roleEngineer = await prisma.role.findUnique({ where: { code: 'ENGINEER' } });

  // 3. Users (9 Staff Users)
  for (const u of MOCK_USERS) {
    const roleId = u.roleCode === 'ADMIN' ? roleAdmin.id : roleEngineer.id;
    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        email: u.email,
        roleId,
        roleTitle: u.roleTitle,
        initials: u.initials,
        phone: u.phone,
        isActive: u.isActive !== undefined ? u.isActive : true
      },
      create: {
        id: u.id,
        roleId,
        name: u.name,
        email: u.email,
        password: '$2a$10$defaultPlaceholderHash2026',
        initials: u.initials,
        phone: u.phone,
        roleTitle: u.roleTitle,
        isActive: u.isActive !== undefined ? u.isActive : true
      }
    });
  }

  // 4. Categories
  for (const cat of MOCK_CATEGORIES) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        code: cat.code,
        desc: cat.desc
      }
    });
  }

  // 5. SLA Policies
  for (const pol of MOCK_SLA_POLICIES) {
    await prisma.slaPolicy.create({
      data: {
        id: pol.id,
        tierCode: pol.tierCode,
        tierName: pol.tierName,
        operatingHours: pol.operatingHours,
        p1ResponseHours: pol.p1ResponseHours,
        p1ResolutionHours: pol.p1ResolutionHours,
        p2ResponseHours: pol.p2ResponseHours,
        p2ResolutionHours: pol.p2ResolutionHours,
        p3ResponseHours: pol.p3ResponseHours,
        p3ResolutionHours: pol.p3ResolutionHours,
        p4ResponseHours: pol.p4ResponseHours,
        p4ResolutionHours: pol.p4ResolutionHours,
        notes: pol.notes
      }
    });
  }

  // 5. Customers & PICs (16 Enterprise Customers)
  for (const cust of MOCK_CUSTOMERS) {
    const pics = cust.pics || [];
    const customerRecord = await prisma.customer.upsert({
      where: { code: cust.code },
      update: {
        name: cust.name,
        industry: cust.industry,
        serviceContract: cust.serviceContract,
        contractTier: cust.slaTier || cust.contractTier || '8x5 GOLD ENTERPRISE',
        contractSla: cust.contractSla || 'GOLD_8X5',
        slaTier: cust.slaTier || '8x5 GOLD ENTERPRISE',
        slaCoverage: cust.slaCoverage || 'First Touch: 30m • Resolusi: 8h',
        address: cust.address,
        cluster: cust.cluster || 'PROD-CL01',
        environment: cust.environment || 'PROD-DC-01',
        maintenanceStart: cust.maintenanceStart || null,
        maintenanceEnd: cust.maintenanceEnd || null,
        ticketQuota: cust.ticketQuota !== undefined ? String(cust.ticketQuota) : 'Unlimited',
        initialUsedTickets: cust.initialUsedTickets || 0,
        deactivatedReason: cust.deactivatedReason || null,
        isActive: cust.isActive !== undefined ? cust.isActive : true
      },
      create: {
        id: cust.id,
        name: cust.name,
        code: cust.code,
        industry: cust.industry,
        serviceContract: cust.serviceContract,
        contractTier: cust.slaTier || cust.contractTier || '8x5 GOLD ENTERPRISE',
        contractSla: cust.contractSla || 'GOLD_8X5',
        slaTier: cust.slaTier || '8x5 GOLD ENTERPRISE',
        slaCoverage: cust.slaCoverage || 'First Touch: 30m • Resolusi: 8h',
        address: cust.address,
        cluster: cust.cluster || 'PROD-CL01',
        environment: cust.environment || 'PROD-DC-01',
        maintenanceStart: cust.maintenanceStart || null,
        maintenanceEnd: cust.maintenanceEnd || null,
        ticketQuota: cust.ticketQuota !== undefined ? String(cust.ticketQuota) : 'Unlimited',
        initialUsedTickets: cust.initialUsedTickets || 0,
        deactivatedReason: cust.deactivatedReason || null,
        isActive: cust.isActive !== undefined ? cust.isActive : true
      }
    });

    for (const pic of pics) {
      await prisma.customerPic.upsert({
        where: { id: pic.id },
        update: {
          name: pic.name,
          phone: pic.phone,
          email: pic.email,
          dept: pic.dept,
          customerId: customerRecord.id
        },
        create: {
          id: pic.id,
          customerId: customerRecord.id,
          name: pic.name,
          phone: pic.phone,
          email: pic.email,
          dept: pic.dept
        }
      });
    }
  }

  // 6. Principals (OEM Technology Vendors)
  const masterPrincipals = [
    { name: 'Hewlett Packard Enterprise (HPE)', code: 'HPE', category: 'Storage & SAN' },
    { name: 'Cisco Systems', code: 'CISCO', category: 'Network Infrastructure' },
    { name: 'VMware / Broadcom', code: 'VMWARE', category: 'Virtualization & Hypervisor' },
    { name: 'Rubrik CDM', code: 'RUBRIK', category: 'Backup & Disaster Recovery' },
    { name: 'Brocade Fabric OS', code: 'BROCADE', category: 'SAN Switch Fabric' },
    { name: 'Fortinet', code: 'FORTINET', category: 'Network & Security' },
    { name: 'Oracle Database', code: 'ORACLE', category: 'Database & Middleware' },
    { name: 'MikroTik', code: 'MIKROTIK', category: 'Edge Routing & Gateway' }
  ];
  for (const p of masterPrincipals) {
    await prisma.principal.upsert({
      where: { code: p.code },
      update: { name: p.name, category: p.category },
      create: p
    });
  }

  // 7. Seed All 156 Tickets with Milestones & Attachments
  console.log(`  -> Seeding ${INITIAL_TICKETS.length} enterprise tickets...`);
  
  for (const t of INITIAL_TICKETS) {
    // Validasi createdBy & assignedTo
    const createdById = t.createdById || 1;
    const assignedToId = t.assignedToId || null;
    const customerId = t.customerId || 1;
    const customerPicId = t.customerPicId || null;
    const categoryId = t.categoryId || 1;

    const createdAt = t.createdAt ? new Date(t.createdAt) : new Date();
    const updatedAt = t.updatedAt ? new Date(t.updatedAt) : createdAt;
    const responseDeadline = t.responseDeadline ? new Date(t.responseDeadline) : new Date(createdAt.getTime() + 30 * 60 * 1000);
    const resolutionDeadline = t.resolutionDeadline ? new Date(t.resolutionDeadline) : new Date(createdAt.getTime() + 8 * 3600 * 1000);
    const respondedAt = t.respondedAt ? new Date(t.respondedAt) : null;
    const resolvedAt = t.resolvedAt ? new Date(t.resolvedAt) : null;
    const closedAt = t.closedAt ? new Date(t.closedAt) : null;
    const pausedAt = t.pausedAt ? new Date(t.pausedAt) : null;

    const createdTicket = await prisma.ticket.upsert({
      where: { ticketNumber: t.ticketNumber },
      update: {
        customerId,
        customerPicId,
        categoryId,
        severity: t.severity || 'MEDIUM',
        channel: t.channel || 'EMAIL',
        title: t.title,
        description: t.description || t.scopeSubtitle || 'Laporan insiden sistem',
        status: t.status || 'OPEN',
        trackingToken: t.trackingToken || `sec_${t.ticketNumber}`,
        createdById,
        assignedToId,
        contractSla: t.contractSla || 'GOLD_8X5',
        contractTier: t.contractTier || '8x5 GOLD ENTERPRISE',
        cluster: t.cluster || 'PROD-CL01',
        environment: t.environment || 'PROD-DC-01',
        impactScope: t.impactScope || 'Standard Operational',
        isEmailSync: t.isEmailSync !== undefined ? t.isEmailSync : true,
        isProposeKb: t.isProposeKb !== undefined ? t.isProposeKb : false,
        escalationTier: t.escalationTier || 'INTERNAL',
        principalVendor: t.principalVendor || null,
        principalCaseId: t.principalCaseId || null,
        principalSpecialist: t.principalSpecialist || null,
        principalBridgeStatus: t.principalBridgeStatus || null,
        createdAt,
        updatedAt,
        responseDeadline,
        resolutionDeadline,
        respondedAt,
        resolvedAt,
        closedAt,
        isPaused: Boolean(t.isPaused),
        pausedAt,
        totalPausedDurationSec: t.totalPausedDurationSec || 0,
        isSlaResponseBreached: Boolean(t.isSlaResponseBreached),
        isSlaResolutionBreached: Boolean(t.isSlaResolutionBreached),
        isNearBreachFlag: Boolean(t.isNearBreachFlag),
        rootCause: t.rootCause || null,
        resolutionStrategy: t.resolutionStrategy || null,
        actionTaken: t.actionTaken || null
      },
      create: {
        ticketNumber: t.ticketNumber,
        customerId,
        customerPicId,
        categoryId,
        severity: t.severity || 'MEDIUM',
        channel: t.channel || 'EMAIL',
        title: t.title,
        description: t.description || t.scopeSubtitle || 'Laporan insiden sistem',
        status: t.status || 'OPEN',
        trackingToken: t.trackingToken || `sec_${t.ticketNumber}`,
        createdById,
        assignedToId,
        contractSla: t.contractSla || 'GOLD_8X5',
        contractTier: t.contractTier || '8x5 GOLD ENTERPRISE',
        cluster: t.cluster || 'PROD-CL01',
        environment: t.environment || 'PROD-DC-01',
        impactScope: t.impactScope || 'Standard Operational',
        isEmailSync: t.isEmailSync !== undefined ? t.isEmailSync : true,
        isProposeKb: t.isProposeKb !== undefined ? t.isProposeKb : false,
        escalationTier: t.escalationTier || 'INTERNAL',
        principalVendor: t.principalVendor || null,
        principalCaseId: t.principalCaseId || null,
        principalSpecialist: t.principalSpecialist || null,
        principalBridgeStatus: t.principalBridgeStatus || null,
        createdAt,
        updatedAt,
        responseDeadline,
        resolutionDeadline,
        respondedAt,
        resolvedAt,
        closedAt,
        isPaused: Boolean(t.isPaused),
        pausedAt,
        totalPausedDurationSec: t.totalPausedDurationSec || 0,
        isSlaResponseBreached: Boolean(t.isSlaResponseBreached),
        isSlaResolutionBreached: Boolean(t.isSlaResolutionBreached),
        isNearBreachFlag: Boolean(t.isNearBreachFlag),
        rootCause: t.rootCause || null,
        resolutionStrategy: t.resolutionStrategy || null,
        actionTaken: t.actionTaken || null
      }
    });

    // Milestones
    if (t.milestones && t.milestones.length > 0) {
      for (const m of t.milestones) {
        await prisma.ticketMilestone.create({
          data: {
            ticketId: createdTicket.id,
            stepName: m.stepName,
            status: m.status || 'OPEN',
            actorName: m.actorName || 'Helpdesk Admin',
            actorRole: m.actorRole || 'ADMIN',
            notes: m.notes || 'Pembaruan milestone penanganan tiket.',
            proofFile: m.proofFile || null,
            timestampUtc: m.timestampUtc ? new Date(m.timestampUtc) : createdAt
          }
        });
      }
    }

    // Attachments
    if (t.attachments && t.attachments.length > 0) {
      for (const att of t.attachments) {
        await prisma.attachment.create({
          data: {
            ticketId: createdTicket.id,
            name: att.name,
            originalName: att.name,
            fileType: att.fileType || 'application/pdf',
            size: att.size || '45 KB',
            uploadedBy: att.uploadedBy || 'Monitoring System',
            source: att.source || 'Laporan Insiden'
          }
        });
      }
    }

    // SLA Hold Log jika status paused
    if (t.isPaused) {
      await prisma.slaHoldLog.create({
        data: {
          ticketId: createdTicket.id,
          reasonType: t.escalationTier === 'PARTNER' ? 'PART_INDENT' : 'VENDOR_DEPENDENCY',
          reasonDetail: t.description || 'Menunggu sparepart dan eskalasi teknis vendor.',
          principalCaseId: t.principalCaseId || 'CASE-PAUSED-001',
          pausedAt: pausedAt || new Date(createdAt.getTime() + 3600000),
          durationSec: t.totalPausedDurationSec || 3600,
          actorName: 'Budi Santoso'
        }
      });
    }
  }

  // 8. Knowledge Base
  console.log(`  -> Seeding ${MOCK_KNOWLEDGE_BASE.length} knowledge base runbooks...`);
  for (const kb of MOCK_KNOWLEDGE_BASE) {
    await prisma.knowledgeBase.upsert({
      where: { kbCode: kb.kbCode },
      update: {
        title: kb.title,
        category: kb.category,
        categoryGroup: kb.categoryGroup,
        technologyPrincipal: kb.technologyPrincipal,
        author: kb.author,
        approver: kb.approver || 'Ir. Hendra Gunawan',
        status: kb.status || 'PUBLISHED',
        symptom: kb.symptom || 'Indikasi anomali',
        rootCause: kb.rootCause || 'Penyebab insiden',
        prerequisites: kb.prerequisites || null,
        cliSnippet: kb.cliSnippet || null,
        verificationSteps: kb.verificationSteps || null,
        rollbackProcedure: kb.rollbackProcedure || null,
        recommendation: kb.recommendation || null,
        sourceTicket: kb.ticketNumber || kb.sourceTicket || null,
        ticketsReferencedCount: kb.ticketsReferencedCount || 3
      },
      create: {
        kbCode: kb.kbCode,
        title: kb.title,
        category: kb.category,
        categoryGroup: kb.categoryGroup,
        technologyPrincipal: kb.technologyPrincipal,
        author: kb.author,
        approver: kb.approver || 'Ir. Hendra Gunawan',
        status: kb.status || 'PUBLISHED',
        symptom: kb.symptom || 'Indikasi anomali',
        rootCause: kb.rootCause || 'Penyebab insiden',
        prerequisites: kb.prerequisites || null,
        cliSnippet: kb.cliSnippet || null,
        verificationSteps: kb.verificationSteps || null,
        rollbackProcedure: kb.rollbackProcedure || null,
        recommendation: kb.recommendation || null,
        sourceTicket: kb.ticketNumber || kb.sourceTicket || null,
        ticketsReferencedCount: kb.ticketsReferencedCount || 3
      }
    });
  }

  // 9. Initial Audit Logs
  const auditLogsToInsert = (MOCK_AUDIT_LOGS || []).slice(0, 15);
  for (const a of auditLogsToInsert) {
    await prisma.auditLog.create({
      data: {
        userName: a.userName || 'System Administrator',
        role: a.role || 'ADMIN',
        action: a.action || 'SYSTEM_INIT',
        entityType: a.entityType || 'SYSTEM',
        entityId: a.entityId || 'SYS',
        description: a.description || 'Perekaman audit sistem.',
        ipAddress: '127.0.0.1',
        timestampUtc: a.timestampUtc ? new Date(a.timestampUtc) : new Date()
      }
    });
  }

  // Log seeding action
  const actorName = actorUser?.name || 'System Administrator';
  const actorRole = actorUser?.role?.code || 'ADMIN';
  await prisma.auditLog.create({
    data: {
      userName: actorName,
      role: actorRole,
      action: 'SYSTEM_SEED_COMPLETE',
      entityType: 'SYSTEM',
      entityId: 'SYS-SEED-156',
      description: `Database berhasil di-reset dan dimuat ulang dengan ${INITIAL_TICKETS.length} tiket realistis dan master data lengkap via UI.`,
      ipAddress: '127.0.0.1',
      timestampUtc: new Date()
    }
  });

  console.log('✅ [SystemService] Seeding database selesai sukses!');

  return {
    success: true,
    mode: 'FULL_DATA',
    ticketCount: INITIAL_TICKETS.length,
    customerCount: MOCK_CUSTOMERS.length,
    message: `Database berhasil dimuat ulang dengan ${INITIAL_TICKETS.length} tiket realistis dan master data lengkap!`
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
    mode: ticketCount === 0 ? 'CLEAN_DATA' : 'FULL_DATA',
    modeLabel: ticketCount === 0 ? 'Mode Bersih (0 Tiket)' : `Mode Penuh (${ticketCount} Tiket)`,
    timestamp: new Date().toISOString()
  };
}
