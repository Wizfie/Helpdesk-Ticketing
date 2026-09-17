import { defineStore } from 'pinia';
import { 
  INITIAL_TICKETS, 
  MOCK_CUSTOMERS, 
  MOCK_CATEGORIES, 
  QUICK_PRESETS, 
  MOCK_AUDIT_LOGS, 
  MOCK_KNOWLEDGE_BASE 
} from '../data/mockData';

const STORAGE_KEYS = {
  TICKETS: 'gtt_tickets_data',
  CUSTOMERS: 'gtt_customers_data',
  CATEGORIES: 'gtt_categories_data',
  AUDIT_LOGS: 'gtt_audit_logs_data',
  KNOWLEDGE_BASE: 'gtt_knowledge_base_data',
  SELECTED_TICKET_ID: 'gtt_selected_ticket_id'
};

function loadStoredData(key, fallback) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return JSON.parse(JSON.stringify(fallback));
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && parsed !== undefined) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
  }
  return JSON.parse(JSON.stringify(fallback));
}

function saveStoredData(key, data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: loadStoredData(STORAGE_KEYS.TICKETS, INITIAL_TICKETS),
    customers: loadStoredData(STORAGE_KEYS.CUSTOMERS, MOCK_CUSTOMERS),
    categories: loadStoredData(STORAGE_KEYS.CATEGORIES, MOCK_CATEGORIES),
    quickPresets: JSON.parse(JSON.stringify(QUICK_PRESETS)),
    auditLogs: loadStoredData(STORAGE_KEYS.AUDIT_LOGS, MOCK_AUDIT_LOGS),
    knowledgeBase: loadStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, MOCK_KNOWLEDGE_BASE),
    selectedTicketId: Number(loadStoredData(STORAGE_KEYS.SELECTED_TICKET_ID, 1)) || 1
  }),

  getters: {
    selectedTicket(state) {
      return state.tickets.find(t => t.id === state.selectedTicketId) || state.tickets[0];
    },
    totalTickets(state) {
      return state.tickets.length;
    },
    openCount(state) {
      return state.tickets.filter(t => ['OPEN', 'ASSIGNED'].includes(t.status)).length;
    },
    inProgressCount(state) {
      return state.tickets.filter(t => ['IN_PROGRESS', 'PENDING_VENDOR', 'PENDING_CUSTOMER'].includes(t.status)).length;
    },
    resolvedCount(state) {
      return state.tickets.filter(t => t.status === 'RESOLVED').length;
    },
    closedCount(state) {
      return state.tickets.filter(t => t.status === 'CLOSED').length;
    },
    slaComplianceRate(state) {
      if (state.tickets.length === 0) return 100;
      const breachedCount = state.tickets.filter(t => t.isSlaResponseBreached || t.isSlaResolutionBreached).length;
      return Math.round(((state.tickets.length - breachedCount) / state.tickets.length) * 100);
    }
  },

  actions: {
    selectTicket(id) {
      this.selectedTicketId = Number(id);
    },

    createTicket(ticketData, actorUser) {
      const nowUtc = new Date().toISOString();
      const count = this.tickets.length + 1;
      const padNum = String(count).padStart(4, '0');
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const ticketNumber = `TICK-${dateStr}-${padNum}`;

      // Calculate SLA response & resolution deadlines based on Customer's Contract Tier & Severity
      const contract = (ticketData.contractSla || '').toUpperCase();
      let respHours = 1;
      let resHours = 8;

      if (contract.includes('PLATINUM')) {
        respHours = ticketData.severity === 'HIGH' ? 0.5 : ticketData.severity === 'MEDIUM' ? 1 : 1.5;
        resHours = ticketData.severity === 'HIGH' ? 4 : ticketData.severity === 'MEDIUM' ? 6 : 12;
      } else if (contract.includes('SILVER')) {
        respHours = ticketData.severity === 'HIGH' ? 1 : ticketData.severity === 'MEDIUM' ? 2 : 4;
        resHours = ticketData.severity === 'HIGH' ? 12 : ticketData.severity === 'MEDIUM' ? 16 : 24;
      } else {
        // Default / GOLD Enterprise
        respHours = ticketData.severity === 'HIGH' ? 0.5 : ticketData.severity === 'MEDIUM' ? 1 : 2;
        resHours = ticketData.severity === 'HIGH' ? 8 : ticketData.severity === 'MEDIUM' ? 12 : 24;
      }

      const responseDeadline = new Date(Date.now() + respHours * 3600 * 1000).toISOString();
      const resolutionDeadline = new Date(Date.now() + resHours * 3600 * 1000).toISOString();

      const newTicket = {
        id: count,
        ticketNumber,
        customerId: Number(ticketData.customerId),
        customerPicId: ticketData.customerPicId ? Number(ticketData.customerPicId) : null,
        categoryId: Number(ticketData.categoryId),
        severity: ticketData.severity || 'MEDIUM',
        channel: ticketData.channel || 'WHATSAPP',
        title: ticketData.title,
        rawMessage: ticketData.rawMessage || null,
        description: ticketData.description,
        status: ticketData.assignedToId ? 'ASSIGNED' : 'OPEN',
        trackingToken: 'sec_' + Math.random().toString(36).substring(2, 10),
        createdById: actorUser.id,
        assignedToId: ticketData.assignedToId ? Number(ticketData.assignedToId) : null,
        
        // Enterprise ITSM fields (Figma Spec)
        contractSla: ticketData.contractSla || 'SLA-GOLD-2026',
        contractTier: ticketData.contractTier || '8x5 GOLD ENTERPRISE',
        cluster: ticketData.cluster || 'PROD-CL01',
        environment: ticketData.environment || 'PROD-DC-01',
        impactScope: ticketData.impactScope || 'Standard Operational',
        isEmailSync: ticketData.isEmailSync !== undefined ? !!ticketData.isEmailSync : (ticketData.isWhatsAppSync !== undefined ? !!ticketData.isWhatsAppSync : true),
        isWhatsAppSync: false,
        isProposeKb: false,
        principalVendor: ticketData.principalVendor || ticketData.principalName || null,
        principalCaseId: ticketData.principalCaseId || null,
        principalSpecialist: ticketData.principalSpecialist || null,
        principalBridgeStatus: ticketData.principalCaseId ? 'Connected via OEM API Bridge' : null,
        principalLatestUpdate: ticketData.principalCaseId ? 'Case successfully registered with Principal Support Desk' : null,
        principalUpdateTimestamp: ticketData.principalCaseId ? 'Just now' : null,

        createdAt: nowUtc,
        updatedAt: nowUtc,
        responseDeadline,
        resolutionDeadline,
        respondedAt: ticketData.assignedToId ? nowUtc : null,
        resolvedAt: null,
        closedAt: null,

        isPaused: false,
        pausedAt: null,
        totalPausedDurationSec: 0,
        isSlaResponseBreached: false,
        isSlaResolutionBreached: false,

        rootCause: ticketData.rootCause || '',
        resolutionStrategy: ticketData.resolutionStrategy || '',
        actionTaken: '',
        resolutionNotes: '',
        recommendation: '',

        attachments: ticketData.attachments || (ticketData.uploadedProof ? [{
          id: 'att-' + Date.now(),
          name: ticketData.uploadedProof,
          originalName: ticketData.uploadedProof,
          fileType: 'image/svg+xml',
          size: '180 KB',
          uploadedBy: actorUser.name,
          uploadedAt: nowUtc,
          source: 'Laporan Awal Customer'
        }] : []),

        milestones: [
          {
            id: Date.now(),
            stepName: 'Laporan Diterima (Ticket Created)',
            status: 'OPEN',
            actorName: actorUser.name,
            actorRole: actorUser.roleCode,
            notes: `Tiket diterbitkan oleh ${actorUser.name}. Target respon: ${respHours * 60} menit.`,
            timestampUtc: nowUtc,
            proofFile: ticketData.uploadedProof || null
          }
        ]
      };

      if (ticketData.assignedToId) {
        newTicket.milestones.push({
          id: Date.now() + 1,
          stepName: 'Penugasan Teknisi Langsung',
          status: 'ASSIGNED',
          actorName: actorUser.name,
          actorRole: actorUser.roleCode,
          notes: `Tiket langsung ditugaskan saat pembuatan.`,
          timestampUtc: nowUtc,
          proofFile: null
        });
      }

      this.tickets.unshift(newTicket);
      this.selectedTicketId = newTicket.id;

      // Log to Audit Trail
      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'TICKET_CREATED',
        entityType: 'TICKET',
        entityId: ticketNumber,
        description: `Membuat tiket baru: ${ticketData.title} (Severity: ${ticketData.severity})`
      });

      return newTicket;
    },

    assignEngineer(ticketId, engineerId, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      ticket.assignedToId = Number(engineerId);
      ticket.status = 'ASSIGNED';
      ticket.updatedAt = nowUtc;
      if (!ticket.respondedAt) {
        ticket.respondedAt = nowUtc;
      }

      ticket.milestones.push({
        id: Date.now(),
        stepName: 'Penugasan ke Teknisi Lapangan',
        status: 'ASSIGNED',
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: `Tiket dialokasikan untuk penanganan lanjutan. Response SLA terpenuhi.`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'ASSIGN_ENGINEER',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Menugaskan tiket kepada engineer ID ${engineerId}`
      });
    },

    addProgressMilestone(ticketId, { stepName, notes, proofFile, nextStatus }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      if (nextStatus) {
        ticket.status = nextStatus;
      }
      ticket.updatedAt = nowUtc;

      ticket.milestones.push({
        id: Date.now(),
        stepName,
        status: ticket.status,
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes,
        timestampUtc: nowUtc,
        proofFile: proofFile || null
      });

      if (proofFile) {
        if (!ticket.attachments) ticket.attachments = [];
        const isAlreadyAdded = ticket.attachments.some(a => a.name === proofFile);
        if (!isAlreadyAdded) {
          ticket.attachments.push({
            id: 'att-' + Date.now(),
            name: proofFile,
            originalName: proofFile,
            fileType: proofFile.endsWith('.txt') || proofFile.endsWith('.log') ? 'text/plain' : 'image/svg+xml',
            size: '142 KB',
            uploadedBy: actorUser.name,
            uploadedAt: nowUtc,
            source: stepName
          });
        }
      }

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'PROGRESS_UPDATE',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Update milestone: ${stepName} (${notes.slice(0, 40)}...)`
      });
    },

    addAttachment(ticketId, { fileName, fileType, size, source }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      if (!ticket.attachments) ticket.attachments = [];
      const nowUtc = new Date().toISOString();
      const newAtt = {
        id: 'att-' + Date.now(),
        name: fileName,
        originalName: fileName,
        fileType: fileType || 'image/svg+xml',
        size: size || '150 KB',
        uploadedBy: actorUser.name,
        uploadedAt: nowUtc,
        source: source || 'Dokumen Tambahan'
      };
      ticket.attachments.push(newAtt);
      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'ATTACHMENT_UPLOADED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Unggah lampiran baru: ${fileName} (${source || 'Dokumen Tambahan'})`
      });
      return newAtt;
    },

    pauseSla(ticketId, { pendingType, reason, principalCaseId }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      ticket.isPaused = true;
      ticket.pausedAt = nowUtc;
      ticket.status = pendingType === 'VENDOR' ? 'PENDING_VENDOR' : 'PENDING_CUSTOMER';
      ticket.updatedAt = nowUtc;
      if (principalCaseId) {
        ticket.principalCaseId = principalCaseId;
      }

      ticket.milestones.push({
        id: Date.now(),
        stepName: `SLA Ditahan (${ticket.status})`,
        status: ticket.status,
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: `Alasan penahanan SLA: ${reason}${principalCaseId ? ` (Case Principal: ${principalCaseId})` : ''}. Timer Resolution SLA dibekukan sementara.`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'SLA_PAUSED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `SLA di-pause karena ${reason}`
      });
    },

    resumeSla(ticketId, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket || !ticket.isPaused) return;

      const now = new Date();
      const pausedStart = new Date(ticket.pausedAt);
      const pausedSeconds = Math.max(0, Math.floor((now - pausedStart) / 1000));

      ticket.totalPausedDurationSec += pausedSeconds;
      ticket.isPaused = false;
      ticket.pausedAt = null;
      ticket.status = 'IN_PROGRESS';
      
      // Extend resolution deadline by paused duration
      const oldDeadline = new Date(ticket.resolutionDeadline);
      ticket.resolutionDeadline = new Date(oldDeadline.getTime() + pausedSeconds * 1000).toISOString();
      ticket.updatedAt = now.toISOString();

      ticket.milestones.push({
        id: Date.now(),
        stepName: 'SLA Dilanjutkan (Pekerjaan Aktif Kembali)',
        status: 'IN_PROGRESS',
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: `Respon dari pihak terkait telah diterima. Timer SLA aktif kembali, deadline diperpanjang ${Math.round(pausedSeconds / 60)} menit.`,
        timestampUtc: now.toISOString(),
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'SLA_RESUMED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `SLA dilanjutkan setelah tertahan ${Math.round(pausedSeconds / 60)} menit`
      });
    },

    resolveTicket(ticketId, { rootCause, resolutionStrategy, actionTaken, resolutionNotes, recommendation }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      ticket.status = 'RESOLVED';
      ticket.resolvedAt = nowUtc; // SLA Resolution Timer STOPS here!
      if (rootCause) ticket.rootCause = rootCause;
      if (resolutionStrategy) ticket.resolutionStrategy = resolutionStrategy;
      ticket.actionTaken = actionTaken || '';
      ticket.resolutionNotes = resolutionNotes || '';
      ticket.recommendation = recommendation || '';
      ticket.updatedAt = nowUtc;

      ticket.milestones.push({
        id: Date.now(),
        stepName: 'Solusi Diterapkan & Layanan Pulih (RESOLVED)',
        status: 'RESOLVED',
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: `Pekerjaan teknis selesai. Resolution SLA BERHENTI. Tiket memasuki masa validasi 72 jam (auto-close).`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'TICKET_RESOLVED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Tiket berstatus RESOLVED oleh ${actorUser.name}. Resolution SLA tuntas.`
      });
      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
    },

    toggleEmailSync(ticketId) {
      const ticket = this.tickets.find(t => t.id === Number(ticketId));
      if (ticket) {
        ticket.isEmailSync = ticket.isEmailSync !== undefined ? !ticket.isEmailSync : false;
        saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
      }
    },

    toggleWhatsAppSync(ticketId) {
      this.toggleEmailSync(ticketId);
    },

    toggleProposeKb(ticketId) {
      const ticket = this.tickets.find(t => t.id === Number(ticketId));
      if (ticket) {
        ticket.isProposeKb = !ticket.isProposeKb;
        saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
      }
    },

    updateRootCause(ticketId, { rootCause, resolutionStrategy }) {
      const ticket = this.tickets.find(t => t.id === Number(ticketId));
      if (ticket) {
        if (rootCause !== undefined) ticket.rootCause = rootCause;
        if (resolutionStrategy !== undefined) ticket.resolutionStrategy = resolutionStrategy;
        saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
      }
    },

    closeTicket(ticketId, reason, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      ticket.status = 'CLOSED';
      ticket.closedAt = nowUtc;
      ticket.updatedAt = nowUtc;

      ticket.milestones.push({
        id: Date.now(),
        stepName: 'Tiket Ditutup Tuntas (CLOSED)',
        status: 'CLOSED',
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: `Konfirmasi: ${reason}. Tiket resmi diarsipkan.`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'TICKET_CLOSED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Tiket CLOSED dengan konfirmasi: ${reason}`
      });
    },

    submitTicketToKb(ticketId, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return null;

      const category = this.categories.find(c => c.id === ticket.categoryId);
      const newKb = {
        id: this.knowledgeBase.length + 1,
        ticketReferenceId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        title: `Solusi: ${ticket.title}`,
        categoryId: ticket.categoryId,
        categoryName: category ? category.name : 'Umum',
        author: actorUser.name,
        status: 'DRAFT', // Butuh review Lead/Admin
        symptom: ticket.description,
        rootCause: ticket.rootCause || 'Dalam penelaahan',
        resolutionSteps: ticket.actionTaken || ticket.resolutionNotes || 'Langkah teknis tercatat di histori tiket.',
        recommendation: ticket.recommendation || '-',
        createdAt: new Date().toISOString()
      };

      this.knowledgeBase.unshift(newKb);

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'KB_SUBMITTED',
        entityType: 'KNOWLEDGE_BASE',
        entityId: String(newKb.id),
        description: `Mengajukan kandidat Knowledge Base dari tiket ${ticket.ticketNumber}`
      });

      return newKb;
    },

    publishKbArticle(articleId, actorUser) {
      const article = this.knowledgeBase.find(a => a.id === articleId);
      if (!article) return;

      article.status = 'PUBLISHED';
      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'KB_PUBLISHED',
        entityType: 'KNOWLEDGE_BASE',
        entityId: String(article.id),
        description: `Mempublikasikan artikel Knowledge Base: ${article.title}`
      });
    },

    addCustomer(customerData, actorUser) {
      const newId = this.customers.length + 1;
      const created = {
        id: newId,
        name: customerData.name,
        code: customerData.code.toUpperCase(),
        industry: customerData.industry,
        serviceContract: 'PKS Layanan Managed Service 24x7',
        address: customerData.address,
        isActive: true,
        pics: [
          {
            id: newId * 100 + 1,
            name: customerData.picName,
            phone: customerData.picPhone,
            dept: customerData.picDept,
            email: customerData.picEmail
          }
        ]
      };
      this.customers.push(created);

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'CUSTOMER_CREATED',
        entityType: 'CUSTOMER',
        entityId: created.code,
        description: `Mendaftarkan perusahaan mitra baru: ${created.name} (${created.code})`
      });

      return created;
    },

    updateCustomer(customerId, updatedData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust) return null;

      const oldName = cust.name;
      cust.name = updatedData.name;
      cust.code = updatedData.code.toUpperCase();
      cust.industry = updatedData.industry;
      cust.address = updatedData.address;
      if (typeof updatedData.isActive === 'boolean') {
        cust.isActive = updatedData.isActive;
      }

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'CUSTOMER_UPDATED',
        entityType: 'CUSTOMER',
        entityId: cust.code,
        description: `Memperbarui data profil mitra pelanggan: ${cust.name} (sebelumnya: ${oldName})`
      });

      return cust;
    },

    addCustomerPic(customerId, picData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust) return null;

      const newPic = {
        id: Date.now(),
        name: picData.name,
        dept: picData.dept,
        phone: picData.phone,
        email: picData.email
      };
      cust.pics.push(newPic);

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'CUSTOMER_PIC_ADDED',
        entityType: 'CUSTOMER',
        entityId: cust.code,
        description: `Menambahkan kontak PIC baru: ${newPic.name} (${newPic.dept}) untuk mitra ${cust.name}`
      });

      return newPic;
    },

    updateCustomerPic(customerId, picId, picData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust) return null;

      const pic = cust.pics.find(p => p.id === picId);
      if (!pic) return null;

      const oldName = pic.name;
      pic.name = picData.name;
      pic.dept = picData.dept;
      pic.phone = picData.phone;
      pic.email = picData.email;

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'CUSTOMER_PIC_UPDATED',
        entityType: 'CUSTOMER',
        entityId: cust.code,
        description: `Memperbarui kontak PIC: ${pic.name} (${pic.dept}) untuk mitra ${cust.name}`
      });

      return pic;
    },

    addCategory(categoryData, actorUser) {
      const newId = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1;
      const code = categoryData.code ? categoryData.code.trim().toUpperCase() : categoryData.name.trim().slice(0, 3).toUpperCase();
      const newCat = {
        id: newId,
        name: categoryData.name.trim(),
        code: code,
        desc: categoryData.desc ? categoryData.desc.trim() : `Kategori masalah teknis: ${categoryData.name.trim()}`
      };
      this.categories.push(newCat);

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CATEGORY_CREATED',
          entityType: 'CATEGORY',
          entityId: code,
          description: `Menambahkan kategori masalah baru: ${newCat.name} (${code})`
        });
      }

      return newCat;
    },

    addAuditLog(entry) {
      this.auditLogs.unshift({
        id: this.auditLogs.length + 1,
        userName: entry.userName,
        role: entry.role,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        description: entry.description,
        ipAddress: '192.168.10.' + (Math.floor(Math.random() * 80) + 10),
        timestampUtc: new Date().toISOString()
      });
    },

    persistState() {
      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
      saveStoredData(STORAGE_KEYS.CATEGORIES, this.categories);
      saveStoredData(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
      saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      saveStoredData(STORAGE_KEYS.SELECTED_TICKET_ID, this.selectedTicketId);
    },

    resetToDefaultData() {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.values(STORAGE_KEYS).forEach(k => {
          try {
            localStorage.removeItem(k);
          } catch (e) {
            console.error('Failed to clear key', k, e);
          }
        });
      }
      this.tickets = JSON.parse(JSON.stringify(INITIAL_TICKETS));
      this.customers = JSON.parse(JSON.stringify(MOCK_CUSTOMERS));
      this.categories = JSON.parse(JSON.stringify(MOCK_CATEGORIES));
      this.quickPresets = JSON.parse(JSON.stringify(QUICK_PRESETS));
      this.auditLogs = JSON.parse(JSON.stringify(MOCK_AUDIT_LOGS));
      this.knowledgeBase = JSON.parse(JSON.stringify(MOCK_KNOWLEDGE_BASE));
      this.selectedTicketId = 1;
      this.persistState();
    }
  }
});
