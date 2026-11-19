import { defineStore } from 'pinia';
import { api } from '../services/api';
import { useAuthStore } from './authStore';
import { 
  INITIAL_TICKETS, 
  MOCK_CUSTOMERS, 
  MOCK_CATEGORIES, 
  QUICK_PRESETS, 
  MOCK_AUDIT_LOGS, 
  MOCK_KNOWLEDGE_BASE,
  MOCK_PENDING_KB_APPROVALS,
  MOCK_SLA_POLICIES
} from '../data/mockData';

// Safe Deep Clone utility to prevent in-memory state mutations on original mock objects
function cloneDeep(data) {
  if (data === null || data === undefined) return data;
  try {
    return structuredClone(data);
  } catch (e) {
    return JSON.parse(JSON.stringify(data));
  }
}

const STORAGE_KEYS = {
  TICKETS: 'gtt_tickets_data',
  CUSTOMERS: 'gtt_customers_data',
  CATEGORIES: 'gtt_categories_data',
  SLA_POLICIES: 'gtt_sla_policies_clean_v1',
  QUICK_PRESETS: 'gtt_quick_presets_data',
  AUDIT_LOGS: 'gtt_audit_logs_data',
  KNOWLEDGE_BASE: 'gtt_knowledge_base_data',
  SELECTED_TICKET_ID: 'gtt_selected_ticket_id'
};

export const MOCK_SLA_CODES = ['PLATINUM_24X7', 'GOLD_8X5', 'GOV_TIER1', 'SILVER_8X5'];
export function filterCleanSlaPolicies(list) {
  return (list || []).filter(p => p && !MOCK_SLA_CODES.includes(p.tierCode) && !(p.id >= 1 && p.id <= 4));
}

/**
 * Robust Stored Data Loader:
 * - Reads from localStorage safely
 * - Auto-repairs if stored data is corrupted or an empty array when fallback is populated
 * - Ensures all returned fallbacks are deeply cloned
 */
function loadStoredData(key, fallback, allowEmpty = false) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return cloneDeep(fallback);
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed !== null && parsed !== undefined) {
        // Auto-heal: If stored data is empty array but fallback is populated, return fresh clone of fallback
        if (!allowEmpty && Array.isArray(fallback) && fallback.length > 0) {
          if (!Array.isArray(parsed) || parsed.length === 0) {
            return cloneDeep(fallback);
          }
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
  }
  return cloneDeep(fallback);
}

function saveStoredData(key, data) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

/**
 * Ensures all 8 canonical mockup tickets (Point 6 specification) are present and properly enriched.
 * Any custom tickets created by the user during interactive testing are preserved.
 */
function ensureCanonicalTickets(existingTickets) {
  return Array.isArray(existingTickets) ? existingTickets : [];
}

export const DATA_MODES = {
  FULL_MOCK: 'FULL_MOCK',
  CLEAN_TESTING: 'CLEAN_TESTING'
};

const DATA_MODE_KEY = 'gtt_app_data_mode';
const DATA_VERSION_KEY = 'gtt_data_version';
const CURRENT_DATA_VERSION = 'v8.0-clean-all-zero';

function getStoredDataMode() {
  if (typeof window === 'undefined' || !window.localStorage) return DATA_MODES.CLEAN_TESTING;
  const mode = localStorage.getItem(DATA_MODE_KEY);
  return mode === DATA_MODES.FULL_MOCK ? DATA_MODES.FULL_MOCK : DATA_MODES.CLEAN_TESTING;
}

function checkAndMigrateData() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const currentVersion = localStorage.getItem(DATA_VERSION_KEY);
    if (currentVersion !== CURRENT_DATA_VERSION) {
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      // Clean stale storage keys on version upgrade
      localStorage.removeItem(STORAGE_KEYS.TICKETS);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
      localStorage.removeItem(STORAGE_KEYS.KNOWLEDGE_BASE);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.SLA_POLICIES);
      localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_TICKET_ID);
      localStorage.removeItem(DATA_MODE_KEY);
      localStorage.removeItem('gtt_read_notifications');
      localStorage.removeItem('gtt_dismissed_notifications_map');
      localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASE, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    }
  } catch (e) {
    console.error('Data migration error:', e);
  }
}
checkAndMigrateData();

export const useTicketStore = defineStore('tickets', {
  state: () => {
    const activeMode = getStoredDataMode();

    return {
      appDataMode: activeMode,
      tickets: loadStoredData(STORAGE_KEYS.TICKETS, [], true),
      customers: loadStoredData(STORAGE_KEYS.CUSTOMERS, [], true),
      categories: loadStoredData(STORAGE_KEYS.CATEGORIES, MOCK_CATEGORIES),
      slaPolicies: filterCleanSlaPolicies(loadStoredData(STORAGE_KEYS.SLA_POLICIES, [], true)),
      quickPresets: loadStoredData(STORAGE_KEYS.QUICK_PRESETS, QUICK_PRESETS),
      auditLogs: loadStoredData(STORAGE_KEYS.AUDIT_LOGS, [], true),
      knowledgeBase: loadStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, [], true),
      pendingKbApprovals: [],
      principals: loadStoredData('gtt_principals_data', [
        'Hewlett Packard Enterprise (HPE)',
        'Cisco Systems',
        'VMware / Broadcom',
        'Rubrik CDM',
        'Brocade Fabric OS',
        'Fortinet',
        'Oracle Database',
        'MikroTik'
      ]),
      holdReasons: [],
      selectedTicketId: null,
      readNotificationIds: loadStoredData('gtt_read_notifications', []),
      dismissedNotifications: loadStoredData('gtt_dismissed_notifications_map', {}),
      lastNotificationCheck: new Date().toISOString(),
      isSystemResetting: false,
      systemDbStatus: null
    };
  },

  getters: {
    isCleanMode(state) {
      return false;
    },
    allPrincipals(state) {
      const set = new Set(state.principals || []);
      (state.knowledgeBase || []).forEach(k => {
        if (k.technologyPrincipal) set.add(k.technologyPrincipal.trim());
      });
      (state.tickets || []).forEach(t => {
        if (t.principalVendor) set.add(t.principalVendor.trim());
      });
      return Array.from(set).filter(Boolean).sort();
    },
    selectedTicket(state) {
      if (!state.tickets || state.tickets.length === 0) return null;
      return state.tickets.find(t => t.id === state.selectedTicketId) || state.tickets[0] || null;
    },
    totalTickets(state) {
      return state.tickets.length;
    },
    openCount(state) {
      return state.tickets.filter(t => ['OPEN', 'ASSIGNED'].includes(t.status)).length;
    },
    inProgressCount(state) {
      return state.tickets.filter(t => t.status === 'IN_PROGRESS' && !t.isPaused).length;
    },
    holdCount(state) {
      return state.tickets.filter(t => ['PENDING_VENDOR', 'PENDING_CUSTOMER', 'PENDING'].includes(t.status) || t.isPaused).length;
    },
    resolvedCount(state) {
      return state.tickets.filter(t => t.status === 'RESOLVED').length;
    },
    closedCount(state) {
      return state.tickets.filter(t => t.status === 'CLOSED').length;
    },
    slaComplianceRate(state) {
      if (state.tickets.length === 0) return null; // null = belum ada data
      const now = Date.now();
      const breachedCount = state.tickets.filter(t => {
        const isResBreach = t.isSlaResolutionBreached === true || 
          (!['RESOLVED', 'CLOSED'].includes(t.status) && !t.isPaused && t.resolutionDeadline && new Date(t.resolutionDeadline).getTime() < now) || 
          (t.resolvedAt && t.resolutionDeadline && new Date(t.resolvedAt).getTime() > new Date(t.resolutionDeadline).getTime());
        const isRespBreach = t.isSlaResponseBreached === true || 
          (!t.respondedAt && t.responseDeadline && new Date(t.responseDeadline).getTime() < now) || 
          (t.respondedAt && t.responseDeadline && new Date(t.respondedAt).getTime() > new Date(t.responseDeadline).getTime());
        return isResBreach || isRespBreach;
      }).length;
      return Math.round(((state.tickets.length - breachedCount) / state.tickets.length) * 100);
    },
    getCustomerQuotaInfo(state) {
      return (customer) => {
        if (!customer) {
          return {
            quota: 'Unlimited',
            used: 0,
            remaining: 'Unlimited',
            percentage: null,
            isNearLimit: false,
            isCritical: false,
            badgeColor: 'slate'
          };
        }
        const quotaStr = String(customer.ticketQuota || '').trim().toLowerCase();
        if (!quotaStr || quotaStr === 'unlimited' || isNaN(Number(quotaStr)) || Number(quotaStr) <= 0) {
          return {
            quota: 'Unlimited',
            used: Number(customer.initialUsedTickets || 0),
            remaining: 'Unlimited',
            percentage: null,
            isNearLimit: false,
            isCritical: false,
            badgeColor: 'slate'
          };
        }
        const numQuota = Number(quotaStr);
        const actualTicketsCount = state.tickets.filter(t => t.customerId === customer.id).length;
        const used = Math.max(Number(customer.initialUsedTickets || 0), actualTicketsCount);
        const remaining = Math.max(0, numQuota - used);
        const percentage = Math.round((remaining / numQuota) * 100);
        const isCritical = percentage <= 10;
        const isNearLimit = percentage <= 20;
        const badgeColor = isCritical ? 'rose' : (isNearLimit ? 'amber' : 'emerald');
        return {
          quota: numQuota,
          used,
          remaining,
          percentage,
          isNearLimit,
          isCritical,
          badgeColor
        };
      };
    },
    totalQuotaStats(state) {
      let totalQuota = 0;
      let totalUsed = 0;
      state.customers.forEach(c => {
        const qStr = String(c.ticketQuota || '').trim().toLowerCase();
        if (qStr && qStr !== 'unlimited') {
          const num = Number(qStr);
          if (!isNaN(num) && num > 0) {
            totalQuota += num;
            const actualTicketsCount = state.tickets.filter(t => t.customerId === c.id).length;
            totalUsed += Math.max(Number(c.initialUsedTickets || 0), actualTicketsCount);
          }
        }
      });
      const percentage = totalQuota > 0 ? Math.round((totalUsed / totalQuota) * 100) : 0;
      return {
        totalQuota,
        totalUsed,
        percentage
      };
    },
    criticalQuotaCustomers(state) {
      const getInfo = this.getCustomerQuotaInfo;
      return state.customers.filter(c => {
        const info = getInfo(c);
        return info.isCritical;
      });
    },
    systemNotifications(state) {
      const notifs = [];
      const getInfo = this.getCustomerQuotaInfo;

      let currentUser = null;
      let isEngineer = false;
      let isAdmin = true;

      try {
        const authStore = useAuthStore();
        currentUser = authStore.currentUser;
        isEngineer = authStore.isEngineer;
        isAdmin = authStore.isAdmin;
      } catch (e) {
        const storedRole = typeof window !== 'undefined' ? localStorage.getItem('gtt_current_role') : null;
        isEngineer = storedRole === 'ENGINEER';
        isAdmin = !isEngineer;
      }

      // 1. Quota alerts for customers (critical <= 10% & warning <= 20%)
      state.customers.forEach(c => {
        const qInfo = getInfo(c);
        if (qInfo.percentage !== null && qInfo.isCritical) {
          notifs.push({
            id: `quota-${c.id}`,
            category: 'KUOTA',
            type: 'QUOTA_CRITICAL',
            severity: 'CRITICAL',
            title: `Sisa Kuota Kritis: ${c.name}`,
            entityName: c.name,
            entityCode: c.code,
            message: `Tersisa ${qInfo.remaining} dari ${qInfo.quota} tiket (${qInfo.percentage}%). Segera konfirmasi penambahan kuota.`,
            shortDesc: `Sisa ${qInfo.remaining} tiket (${qInfo.percentage}%)`,
            timestamp: 'Penting',
            link: '/admin/customers',
            targetId: c.id,
            badgeText: `${qInfo.remaining} Tiket (${qInfo.percentage}%)`,
            badgeColor: 'rose'
          });
        } else if (qInfo.percentage !== null && qInfo.isNearLimit) {
          notifs.push({
            id: `quota-warn-${c.id}`,
            category: 'KUOTA',
            type: 'QUOTA_WARNING',
            severity: 'WARNING',
            title: `Sisa Kuota Menipis: ${c.name}`,
            entityName: c.name,
            entityCode: c.code,
            message: `Tersisa ${qInfo.remaining} dari ${qInfo.quota} tiket (${qInfo.percentage}%). Kuota mendekati ambang batas.`,
            shortDesc: `Sisa ${qInfo.remaining} tiket (${qInfo.percentage}%)`,
            timestamp: 'Perhatian',
            link: '/admin/customers',
            targetId: c.id,
            badgeText: `${qInfo.remaining} Tiket (${qInfo.percentage}%)`,
            badgeColor: 'amber'
          });
        }

        // 2. Maintenance period check & Auto-deactivate notification
        if (c.maintenanceEnd) {
          const end = new Date(c.maintenanceEnd);
          const now = new Date();
          const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
          if (diffDays < 0) {
            notifs.push({
              id: `maint-expired-${c.id}`,
              category: 'MAINTENANCE',
              type: 'MAINTENANCE_EXPIRED',
              severity: 'CRITICAL',
              title: `Maintenance Expired: ${c.name}`,
              entityName: c.name,
              entityCode: c.code,
              message: `Kontrak berakhir per ${c.maintenanceEnd}. Akun mitra otomatis dinonaktifkan.`,
              shortDesc: `Expired (${c.maintenanceEnd})`,
              timestamp: 'Kontrak Berakhir',
              link: '/admin/customers',
              targetId: c.id,
              badgeText: 'Expired / Nonaktif',
              badgeColor: 'rose'
            });
          } else if (diffDays <= 60 && diffDays >= 0) {
            notifs.push({
              id: `maint-${c.id}`,
              category: 'MAINTENANCE',
              type: 'MAINTENANCE_EXPIRING',
              severity: 'WARNING',
              title: `Maintenance Mendekati Akhir: ${c.name}`,
              entityName: c.name,
              entityCode: c.code,
              message: `Kontrak berakhir dalam ${diffDays} hari (${c.maintenanceEnd}). Segera review PKS.`,
              shortDesc: `Berakhir dlm ${diffDays} hari`,
              timestamp: 'Review Kontrak',
              link: '/admin/customers',
              targetId: c.id,
              badgeText: `${diffDays} Hari Lagi`,
              badgeColor: 'amber'
            });
          }
        }
      });

      // 3. Active Breached SLA Tickets
      state.tickets.forEach(t => {
        const isResBreach = t.isSlaResolutionBreached === true || 
          (!['RESOLVED', 'CLOSED'].includes(t.status) && !t.isPaused && t.resolutionDeadline && new Date(t.resolutionDeadline).getTime() < Date.now());
        const isRespBreach = t.isSlaResponseBreached === true || 
          (!t.respondedAt && t.responseDeadline && new Date(t.responseDeadline).getTime() < Date.now());

        if ((isResBreach || isRespBreach) && !['RESOLVED', 'CLOSED'].includes(t.status)) {
          notifs.push({
            id: `sla-breach-${t.id}`,
            category: 'SLA',
            type: 'SLA_BREACHED',
            severity: 'CRITICAL',
            title: `SLA Breached: ${t.ticketNumber}`,
            entityName: t.ticketNumber,
            message: `Tiket "${t.title}" telah melampaui batas SLA. Memerlukan eskalasi segera.`,
            shortDesc: t.title,
            timestamp: 'Perlu Eskalasi',
            link: '/tickets',
            targetTicketId: t.id,
            badgeText: 'Breached',
            badgeColor: 'rose'
          });
        }
      });

      // 4. SLA Near Breach (< 30m / near limit flag)
      state.tickets.forEach(t => {
        const isResBreach = t.isSlaResolutionBreached === true || 
          (!['RESOLVED', 'CLOSED'].includes(t.status) && !t.isPaused && t.resolutionDeadline && new Date(t.resolutionDeadline).getTime() < Date.now());
        const isNear = t.isNearBreachFlag || (!isResBreach && !['RESOLVED', 'CLOSED'].includes(t.status) && !t.isPaused && t.resolutionDeadline && (new Date(t.resolutionDeadline).getTime() - Date.now() < 30 * 60 * 1000) && (new Date(t.resolutionDeadline).getTime() - Date.now() > 0));

        if (isNear && !isResBreach && !['RESOLVED', 'CLOSED'].includes(t.status)) {
          notifs.push({
            id: `sla-near-${t.id}`,
            category: 'SLA',
            type: 'SLA_NEAR_BREACH',
            severity: 'WARNING',
            title: `Mendekati Batas SLA: ${t.ticketNumber}`,
            entityName: t.ticketNumber,
            message: `Tiket "${t.title}" mendekati batas waktu SLA (< 30 menit). Harap diprioritaskan.`,
            shortDesc: t.title,
            timestamp: 'Prioritas Tinggi',
            link: '/tickets',
            targetTicketId: t.id,
            badgeText: 'Sisa < 30m',
            badgeColor: 'amber'
          });
        }
      });

      // 5. Unassigned Active Tickets (Dispatched for Admin / Helpdesk Lead)
      if (!isEngineer) {
        const unassignedList = state.tickets.filter(t => 
          !t.assignedToId && !t.assignedTo && ['OPEN', 'ASSIGNED'].includes(t.status)
        );
        unassignedList.slice(0, 2).forEach(t => {
          notifs.push({
            id: `unassigned-${t.id}`,
            category: 'DISPATCH',
            type: 'TICKET_UNASSIGNED',
            severity: 'WARNING',
            title: `Tiket Baru Tanpa PIC: ${t.ticketNumber}`,
            entityName: t.ticketNumber,
            message: `Tiket "${t.title}" (${t.customerName || 'Mitra'}) belum ditugaskan ke teknisi.`,
            shortDesc: t.title,
            timestamp: 'Belum Di-assign',
            link: '/tickets',
            targetTicketId: t.id,
            badgeText: 'Belum Ada PIC',
            badgeColor: 'amber'
          });
        });
      }

      // 6. Tickets Assigned to Current Logged-in Engineer
      if (isEngineer && currentUser) {
        const myTickets = state.tickets.filter(t => 
          (t.assignedToId === currentUser.id || t.assignedTo?.id === currentUser.id || t.assignedTo === currentUser.name) &&
          !['RESOLVED', 'CLOSED'].includes(t.status)
        );
        myTickets.slice(0, 3).forEach(t => {
          notifs.push({
            id: `assigned-to-me-${t.id}`,
            category: 'ASSIGNMENT',
            type: 'TICKET_ASSIGNED_TO_ME',
            severity: t.severity === 'CRITICAL' ? 'CRITICAL' : 'INFO',
            title: `Tiket Ditugaskan: ${t.ticketNumber}`,
            entityName: t.ticketNumber,
            message: `Anda ditugaskan menangani tiket "${t.title}" (Prioritas: ${t.severity}).`,
            shortDesc: t.title,
            timestamp: 'Ditugaskan ke Anda',
            link: '/tickets',
            targetTicketId: t.id,
            badgeText: t.severity,
            badgeColor: t.severity === 'CRITICAL' ? 'rose' : (t.severity === 'HIGH' ? 'amber' : 'blue')
          });
        });
      }

      // 7. Critical Severity Incidents (P1 Incident Alert)
      state.tickets.forEach(t => {
        if (t.severity === 'CRITICAL' && !t.isSlaResolutionBreached && !['RESOLVED', 'CLOSED'].includes(t.status)) {
          const alreadyNotified = notifs.some(n => n.id === `assigned-to-me-${t.id}`);
          if (!alreadyNotified) {
            notifs.push({
              id: `crit-incident-${t.id}`,
              category: 'INCIDENT',
              type: 'INCIDENT_CRITICAL',
              severity: 'CRITICAL',
              title: `🚨 Insiden Kritis: ${t.ticketNumber}`,
              entityName: t.ticketNumber,
              message: `Insiden Severity Critical aktif: "${t.title}". Memerlukan respon cepat seluruh tim.`,
              shortDesc: t.title,
              timestamp: 'P1 Darurat',
              link: '/tickets',
              targetTicketId: t.id,
              badgeText: 'P1 Critical',
              badgeColor: 'rose'
            });
          }
        }
      });

      // 8. Pending Knowledge Base Review (For Admin)
      if (!isEngineer && state.pendingKbApprovals && state.pendingKbApprovals.length > 0) {
        state.pendingKbApprovals.slice(0, 2).forEach(kb => {
          notifs.push({
            id: `kb-pending-${kb.id}`,
            category: 'KNOWLEDGE_BASE',
            type: 'KB_APPROVAL_PENDING',
            severity: 'INFO',
            title: `Review KB: ${kb.sourceTicket || 'Runbook'}`,
            entityName: kb.title,
            message: `Draft runbook "${kb.title}" diajukan oleh ${kb.author || 'Teknisi'}. Menunggu review & publikasi.`,
            shortDesc: kb.title,
            timestamp: kb.submittedAt || 'Menunggu Review',
            link: '/knowledge-base',
            badgeText: 'Review KB',
            badgeColor: 'blue'
          });
        });
      }

      // Model B: 30-minute snooze reminder
      // If notification was cleared/dismissed, suppress it for 30 minutes. If condition still exists after 30 min, re-alert!
      const SNOOZE_DURATION_MS = 30 * 60 * 1000;
      const now = Date.now();

      return notifs
        .filter(n => {
          const dismissedAt = state.dismissedNotifications ? state.dismissedNotifications[n.id] : null;
          if (!dismissedAt) return true;
          // Re-alert if 30 minutes have elapsed
          return (now - Number(dismissedAt)) >= SNOOZE_DURATION_MS;
        })
        .map(n => ({
          ...n,
          isRead: state.readNotificationIds.includes(n.id)
        }));
    },

    unreadNotificationCount(state) {
      return this.systemNotifications.filter(n => !n.isRead).length;
    }
  },

  actions: {
    selectTicket(id) {
      this.selectedTicketId = Number(id);
    },

    markNotificationAsRead(id) {
      if (!this.readNotificationIds.includes(id)) {
        this.readNotificationIds.push(id);
        saveStoredData('gtt_read_notifications', this.readNotificationIds);
      }
    },

    markAllNotificationsAsRead() {
      const activeIds = this.systemNotifications.map(n => n.id);
      activeIds.forEach(id => {
        if (!this.readNotificationIds.includes(id)) {
          this.readNotificationIds.push(id);
        }
      });
      saveStoredData('gtt_read_notifications', this.readNotificationIds);
    },

    clearNotification(id) {
      if (!this.dismissedNotifications) this.dismissedNotifications = {};
      this.dismissedNotifications[id] = Date.now();
      saveStoredData('gtt_dismissed_notifications_map', this.dismissedNotifications);
    },

    clearAllNotifications() {
      if (!this.dismissedNotifications) this.dismissedNotifications = {};
      const now = Date.now();
      this.systemNotifications.forEach(n => {
        this.dismissedNotifications[n.id] = now;
      });
      saveStoredData('gtt_dismissed_notifications_map', this.dismissedNotifications);
    },

    async recheckNotifications() {
      this.lastNotificationCheck = new Date().toISOString();
      this.checkAndSyncCustomerMaintenanceStatus();
      try {
        const [ticketsRes, customersRes] = await Promise.all([
          api.getTickets().catch(() => null),
          api.getCustomers().catch(() => null)
        ]);
        const ticketsList = Array.isArray(ticketsRes) ? ticketsRes : (ticketsRes?.data || null);
        if (ticketsList !== null) {
          this.tickets = ticketsList;
          saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
        }
      } catch (e) {
        // Fallback already loaded
      }
    },

    async fetchInitialDataFromApi() {
      try {
        const [ticketsRes, customersRes, kbRes, categoriesRes, principalsRes, presetsRes, holdReasonsRes, slaPoliciesRes] = await Promise.all([
          api.getTickets().catch(() => null),
          api.getCustomers().catch(() => null),
          api.getArticles().catch(() => null),
          api.getCategories().catch(() => null),
          api.getPrincipals().catch(() => null),
          api.getQuickPresets().catch(() => null),
          api.getHoldReasons().catch(() => null),
          api.getSlaPolicies().catch(() => null)
        ]);

        const ticketsList = Array.isArray(ticketsRes) ? ticketsRes : (ticketsRes?.data || null);
        if (ticketsList !== null) {
          const mapped = ticketsList.map(t => ({
            ...t,
            milestones: t.milestones || [],
            attachments: t.attachments || []
          }));
          this.tickets = mapped;
          saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
        }
        
        await this.checkSystemStatus();

        const customersList = Array.isArray(customersRes) ? customersRes : (customersRes?.data || null);
        if (customersList !== null) {
          this.customers = customersList;
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        } else if (!this.customers) {
          this.customers = [];
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        }
        this.checkAndSyncCustomerMaintenanceStatus();

        const kbList = Array.isArray(kbRes) ? kbRes : (kbRes?.data || null);
        if (kbList !== null) {
          this.knowledgeBase = kbList;
          saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
        } else if (!this.knowledgeBase) {
          this.knowledgeBase = [];
          saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
        }

        // Master Categories from Database
        const categoriesList = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : null);
        if (categoriesList !== null && categoriesList.length > 0) {
          this.categories = categoriesList;
          saveStoredData(STORAGE_KEYS.CATEGORIES, this.categories);
        } else if (!this.categories || this.categories.length === 0) {
          this.categories = cloneDeep(MOCK_CATEGORIES);
          saveStoredData(STORAGE_KEYS.CATEGORIES, this.categories);
        }

        // Master Principals from Database
        const principalsList = principalsRes?.data || (Array.isArray(principalsRes) ? principalsRes : null);
        if (principalsList !== null && principalsList.length > 0) {
          this.principals = principalsList.map(p => p.name || p);
          saveStoredData('gtt_principals_data', this.principals);
        }

        // Master Quick Presets from Database
        if (presetsRes && presetsRes.data && presetsRes.data.length > 0) {
          this.quickPresets = presetsRes.data;
        }

        // Master SLA Hold Reasons from Database
        if (holdReasonsRes && holdReasonsRes.data && holdReasonsRes.data.length > 0) {
          this.holdReasons = holdReasonsRes.data;
        }

        // Master SLA Policies from Database
        const slaPoliciesList = Array.isArray(slaPoliciesRes) ? slaPoliciesRes : (slaPoliciesRes?.data || null);
        if (slaPoliciesList !== null) {
          this.slaPolicies = filterCleanSlaPolicies(slaPoliciesList);
          saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
        } else if (!this.slaPolicies) {
          this.slaPolicies = [];
          saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
        } else {
          this.slaPolicies = filterCleanSlaPolicies(this.slaPolicies);
        }
      } catch (e) {
        console.warn('[TicketStore] Backend offline or initial fetch error, using local fallback:', e.message);
      }
    },

    async fetchSlaPolicies() {
      try {
        const res = await api.getSlaPolicies();
        const list = Array.isArray(res) ? res : (res?.data || null);
        if (list !== null) {
          this.slaPolicies = filterCleanSlaPolicies(list);
          saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
        } else if (!this.slaPolicies) {
          this.slaPolicies = [];
          saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
        } else {
          this.slaPolicies = filterCleanSlaPolicies(this.slaPolicies);
        }
        return this.slaPolicies;
      } catch (err) {
        console.warn('[TicketStore] Gagal fetch SLA policies:', err.message);
        if (!this.slaPolicies) {
          this.slaPolicies = [];
        }
        this.slaPolicies = filterCleanSlaPolicies(this.slaPolicies);
        return this.slaPolicies;
      }
    },

    setSlaPolicies(policies) {
      this.slaPolicies = filterCleanSlaPolicies(policies);
      saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
    },

    saveSlaPolicy(policy) {
      if (!this.slaPolicies) this.slaPolicies = [];
      const idx = this.slaPolicies.findIndex(p => p.id === policy.id || p.tierCode === policy.tierCode);
      if (idx !== -1) {
        this.slaPolicies[idx] = policy;
      } else {
        this.slaPolicies.push(policy);
      }
      this.slaPolicies = filterCleanSlaPolicies(this.slaPolicies);
      saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
    },

    removeSlaPolicy(policyId) {
      if (!this.slaPolicies) return;
      this.slaPolicies = this.slaPolicies.filter(p => p.id !== policyId);
      saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
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

      const matchedPolicy = (this.slaPolicies || []).find(p => p.tierCode === ticketData.contractSla || contract.includes(p.tierCode));
      if (matchedPolicy) {
        if (ticketData.severity === 'HIGH') {
          respHours = matchedPolicy.p1ResponseHours;
          resHours = matchedPolicy.p1ResolutionHours;
        } else if (ticketData.severity === 'LOW') {
          respHours = matchedPolicy.p3ResponseHours || matchedPolicy.p4ResponseHours || 4;
          resHours = matchedPolicy.p3ResolutionHours || matchedPolicy.p4ResolutionHours || 24;
        } else {
          // MEDIUM
          respHours = matchedPolicy.p2ResponseHours;
          resHours = matchedPolicy.p2ResolutionHours;
        }
      } else {
        // Fallback to first configured policy in system
        const defaultPol = this.slaPolicies?.[0];
        if (defaultPol) {
          respHours = ticketData.severity === 'HIGH' ? defaultPol.p1ResponseHours : defaultPol.p2ResponseHours;
          resHours = ticketData.severity === 'HIGH' ? defaultPol.p1ResolutionHours : defaultPol.p2ResolutionHours;
        } else {
          respHours = 1;
          resHours = 8;
        }
      }

      const responseDeadline = new Date(Date.now() + respHours * 3600 * 1000).toISOString();
      const resolutionDeadline = new Date(Date.now() + resHours * 3600 * 1000).toISOString();

      const maxExistingId = this.tickets.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0);
      const newId = maxExistingId + 1;

      const newTicket = {
        id: newId,
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
        contractSla: ticketData.contractSla || '',
        contractTier: ticketData.contractTier || '',
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

      // Increment customer's used ticket count
      const targetCustomer = this.customers.find(c => c.id === Number(ticketData.customerId));
      if (targetCustomer) {
        if (targetCustomer.initialUsedTickets !== undefined) {
          targetCustomer.initialUsedTickets += 1;
        } else {
          targetCustomer.initialUsedTickets = 1;
        }
        saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
      }

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

    addProgressMilestone(ticketId, { stepName, notes, proofFile, nextStatus, proofFileSize, progressPercent, additionalNotes, syncToKb }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      if (nextStatus) {
        ticket.status = nextStatus;
      }
      if (progressPercent !== undefined && progressPercent !== null) {
        ticket.progressPercent = Math.min(100, Math.max(0, Number(progressPercent)));
      }
      ticket.updatedAt = nowUtc;

      if (!ticket.milestones) ticket.milestones = [];
      const newStep = {
        id: Date.now(),
        stepName,
        status: ticket.status,
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes,
        additionalNotes: additionalNotes || '',
        progressPercent: progressPercent !== undefined ? Number(progressPercent) : (ticket.progressPercent || 0),
        timestampUtc: nowUtc,
        proofFile: proofFile || null
      };
      ticket.milestones.push(newStep);

      if (proofFile) {
        if (!ticket.attachments) ticket.attachments = [];
        const isAlreadyAdded = ticket.attachments.some(a => a.name === proofFile);
        if (!isAlreadyAdded) {
          ticket.attachments.push({
            id: 'att-' + Date.now(),
            name: proofFile,
            originalName: proofFile,
            fileType: proofFile.endsWith('.txt') || proofFile.endsWith('.log') ? 'text/plain' : (proofFile.endsWith('.pdf') ? 'application/pdf' : 'image/svg+xml'),
            size: proofFileSize || '142 KB',
            uploadedBy: actorUser.name,
            uploadedAt: nowUtc,
            source: `Step: ${stepName}`
          });
        } else {
          const existingAtt = ticket.attachments.find(a => a.name === proofFile);
          if (existingAtt && (!existingAtt.source || existingAtt.source === 'Upload Lampiran' || existingAtt.source === 'Upload Manual Pengguna')) {
            existingAtt.source = `Step: ${stepName}`;
          }
        }
      }

      // Auto-sync troubleshooting findings to Knowledge Base if requested
      if (syncToKb) {
        const kbCodeNum = Math.floor(1000 + Math.random() * 9000);
        const customerObj = this.customers.find(c => c.id === ticket.customerId);
        const newKb = {
          id: kbCodeNum,
          kbCode: `KB-${kbCodeNum}`,
          title: `[Troubleshoot] ${ticket.title} - ${stepName}`,
          category: (ticket.categoryName || 'Infrastruktur').split('&')[0].trim(),
          categoryGroup: ticket.categoryName || 'General Infrastructure',
          technologyPrincipal: ticket.principalVendor || 'Enterprise Systems',
          productPlatform: ticket.affectedSystem || 'Server & Network',
          firmwareVersion: 'Production Release',
          caseType: 'Troubleshooting Runbook',
          author: `${actorUser.name} (${actorUser.roleCode})`,
          approver: actorUser.roleCode === 'ADMIN' ? actorUser.name : 'Menunggu Review Admin / Lead',
          status: 'DRAFT',
          updatedAt: 'Baru saja',
          ticketsReferencedCount: 1,
          source: `Tiket #${ticket.ticketNumber} (${customerObj?.name || 'Customer'})`,
          symptom: ticket.description,
          rootCause: `Temuan diagnosa pada ${stepName}: ${notes}`,
          prerequisites: 'Akses privilege administrator pada environment.',
          diagnosticSteps: notes,
          resolutionSteps: additionalNotes || notes,
          verificationSteps: 'Verifikasi stabilitas koneksi & layanan bebas dari trigger alert.',
          createdAt: nowUtc
        };
        this.knowledgeBase.unshift(newKb);
        saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      }

      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'PROGRESS_UPDATE',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Update milestone: ${stepName} [Progress: ${ticket.progressPercent || 0}%] (${notes.slice(0, 40)}...)`
      });
    },

    updateTicketDetails(ticketId, updatedFields, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      Object.assign(ticket, updatedFields);
      ticket.updatedAt = new Date().toISOString();
      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'TICKET_UPDATED',
          entityType: 'TICKET',
          entityId: ticket.ticketNumber,
          description: `Memperbarui rincian informasi tiket: ${ticket.title}`
        });
      }
    },

    addAttachment(ticketId, { fileName, fileType, size, source, targetStepName }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      if (!ticket.attachments) ticket.attachments = [];
      const nowUtc = new Date().toISOString();
      const finalSource = targetStepName ? `Step: ${targetStepName}` : (source || 'Dokumen Tambahan');
      const newAtt = {
        id: 'att-' + Date.now(),
        name: fileName,
        originalName: fileName,
        fileType: fileType || 'image/svg+xml',
        size: size || '150 KB',
        uploadedBy: actorUser ? actorUser.name : 'System',
        uploadedAt: nowUtc,
        source: finalSource
      };
      ticket.attachments.push(newAtt);

      if (targetStepName && ticket.milestones) {
        const step = ticket.milestones.find(m => m.stepName === targetStepName);
        if (step) {
          step.proofFile = fileName;
        }
      }

      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'ATTACHMENT_UPLOADED',
          entityType: 'TICKET',
          entityId: ticket.ticketNumber,
          description: `Unggah lampiran baru: ${fileName} (${finalSource})`
        });
      }
      return newAtt;
    },

    linkAttachmentToStep(ticketId, attachmentName, stepName, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      if (!ticket.attachments) ticket.attachments = [];
      const att = ticket.attachments.find(a => a.name === attachmentName);
      if (att) {
        att.source = `Step: ${stepName}`;
      } else {
        ticket.attachments.push({
          id: 'att-' + Date.now(),
          name: attachmentName,
          originalName: attachmentName,
          fileType: attachmentName.endsWith('.pdf') ? 'application/pdf' : 'text/plain',
          size: '142 KB',
          uploadedBy: actorUser.name,
          uploadedAt: new Date().toISOString(),
          source: `Step: ${stepName}`
        });
      }

      if (!ticket.milestones) ticket.milestones = [];
      const step = ticket.milestones.find(m => m.stepName === stepName);
      if (step) {
        step.proofFile = attachmentName;
      }

      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'ATTACHMENT_LINKED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Menautkan berkas ${attachmentName} ke tahapan: ${stepName}`
      });
    },

    pauseSla(ticketId, { pendingType, reason, principalCaseId }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      ticket.isPaused = true;
      ticket.pausedAt = nowUtc;
      ticket.status = pendingType === 'CUSTOMER' ? 'PENDING_CUSTOMER' : 'PENDING_VENDOR';
      ticket.updatedAt = nowUtc;
      if (principalCaseId) {
        ticket.principalCaseId = principalCaseId;
      }

      const presetLabels = {
        PART_INDENT: 'Part Indent (Menunggu Suku Cadang/Hardware)',
        CUSTOMER: 'Menunggu Konfirmasi / Akses Customer',
        VENDOR: 'Dependensi Vendor / Partner / PM'
      };
      const label = presetLabels[pendingType] || pendingType;

      ticket.milestones.push({
        id: Date.now(),
        stepName: `SLA Ditahan (${label})`,
        status: ticket.status,
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: `[Preset: ${label}] ${reason}${principalCaseId ? ` (Case Principal: ${principalCaseId})` : ''}. Timer Resolution SLA dibekukan sementara.`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'SLA_PAUSED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `SLA di-pause (${label}): ${reason}`
      });
    },

    addPrincipal(name) {
      if (!name || typeof name !== 'string') return;
      const trimmed = name.trim();
      if (!this.principals) this.principals = [];
      if (!this.principals.includes(trimmed)) {
        this.principals.push(trimmed);
        saveStoredData('gtt_principals_data', this.principals);
        // Simpan langsung ke database MySQL Glotra
        api.createPrincipal({ name: trimmed }).catch(err => {
          console.warn('[TicketStore] Gagal simpan principal ke database:', err.message);
        });
      }
    },

    escalateTicket(ticketId, { target, vendorName, vendorCaseId, vendorSpecialist, note }, actorUser) {
      const ticket = this.tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      if (target === 'VENDOR') {
        ticket.status = 'PENDING_VENDOR';
        ticket.escalationTier = 'VENDOR_PRINCIPAL';
        ticket.principalVendor = vendorName || 'Vendor / Principal TAC';
        ticket.principalCaseId = vendorCaseId || null;
        ticket.principalSpecialist = vendorSpecialist || 'Principal Support Engineer L3';
        ticket.principalBridgeStatus = 'Eskalasi Terhubung (Bridge Aktif)';
        ticket.principalLatestUpdate = note;
        ticket.principalUpdateTimestamp = 'Baru saja';
        if (vendorName) {
          this.addPrincipal(vendorName);
        }
      } else if (target === 'PM') {
        ticket.escalationTier = 'PROJECT_MANAGER';
      } else if (target === 'PARTNER') {
        ticket.escalationTier = 'PARTNER';
      } else {
        ticket.escalationTier = 'INTERNAL_L2';
      }
      ticket.updatedAt = nowUtc;

      const targetLabels = {
        PM: 'Project Manager (PM)',
        PARTNER: 'Mitra / Partner Implementasi',
        VENDOR: `Vendor / Principal TAC (${ticket.principalVendor || 'L3 OEM'})`,
        INTERNAL_L2: 'Internal Lead / Tier 2 Specialist'
      };
      const targetLabel = targetLabels[target] || target;

      ticket.milestones.push({
        id: Date.now(),
        stepName: `Eskalasi ke ${targetLabel}`,
        status: ticket.status,
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: `Tiket dialihkan/eskalasi ke ${targetLabel}.${vendorCaseId ? ` No Kasus Vendor: ${vendorCaseId}.` : ''} Catatan Teknis: ${note}`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'TICKET_ESCALATED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Eskalasi ke ${targetLabel}: ${note.slice(0, 50)}...`
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

    closeTicket(ticketId, actorUser = { name: 'Customer / Client PIC', roleCode: 'CUSTOMER' }, closureNotes = 'Konfirmasi kepuasan pelanggan diterima. Layanan normal dan tiket resmi diarsipkan.') {
      const ticket = this.tickets.find(t => t.id === Number(ticketId));
      if (!ticket) return;

      const nowUtc = new Date().toISOString();
      ticket.status = 'CLOSED';
      ticket.closedAt = nowUtc;
      ticket.progressPercent = 100;
      ticket.updatedAt = nowUtc;

      if (!ticket.milestones) ticket.milestones = [];
      ticket.milestones.push({
        id: Date.now(),
        stepName: 'Konfirmasi Pelanggan & Penutupan (CLOSED)',
        status: 'CLOSED',
        actorName: actorUser.name,
        actorRole: actorUser.roleCode,
        notes: closureNotes,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'TICKET_CLOSED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Tiket resmi diarsipkan (CLOSED). ${closureNotes}`
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
      saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'KB_PUBLISHED',
        entityType: 'KNOWLEDGE_BASE',
        entityId: String(article.id),
        description: `Mempublikasikan artikel Knowledge Base: ${article.title}`
      });
    },

    approvePendingApproval(pendingId, actorUser) {
      const idx = this.pendingKbApprovals.findIndex(p => p.id === pendingId);
      if (idx === -1) return;
      const item = this.pendingKbApprovals[idx];
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const newKb = {
        id: codeNum,
        kbCode: `KB-${codeNum}`,
        title: item.title,
        category: item.category.split('&')[0].trim(),
        categoryGroup: item.category,
        technologyPrincipal: item.category,
        author: item.author,
        approver: `${actorUser.name} (${actorUser.roleCode === 'ADMIN' ? 'Supervisor' : 'Lead'})`,
        status: 'PUBLISHED',
        updatedAt: 'Just now',
        ticketsReferencedCount: 1,
        source: `Dari Tiket ${item.sourceTicket} (${item.customer})`,
        symptom: item.summary,
        rootCause: 'Investigasi formal pasca insiden tervalidasi.',
        prerequisites: 'Akses root / admin pada subsystem.',
        cliSnippet: `# Prosedur diverifikasi dari ${item.sourceTicket}\n# Eksekusi diagnostik baseline\nshow system status`,
        verificationSteps: 'Verifikasi stabilitas koneksi & log bebas dari trigger error alert.',
        rollbackProcedure: 'Rollback perubahan konfigurasi jika service degraded.',
        recommendation: 'Jadwalkan review pencegahan preventif berkala.',
        createdAt: new Date().toISOString()
      };
      this.knowledgeBase.unshift(newKb);
      this.pendingKbApprovals.splice(idx, 1);
      saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'KB_APPROVED',
        entityType: 'KNOWLEDGE_BASE',
        entityId: newKb.kbCode,
        description: `Menyetujui dan mempublikasikan runbook Knowledge Base: ${newKb.title}`
      });
    },

    proposeNewArticle(data, actorUser) {
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const newKb = {
        id: codeNum,
        kbCode: `KB-${codeNum}`,
        title: data.title,
        category: (data.categoryGroup || 'Storage').split('&')[0].trim(),
        categoryGroup: data.categoryGroup || 'SAN & Enterprise Storage',
        technologyPrincipal: data.technologyPrincipal || 'Enterprise Multi-Vendor',
        productPlatform: data.productPlatform || 'Enterprise Storage/Server',
        firmwareVersion: data.firmwareVersion || 'Latest Stable',
        caseType: data.caseType || 'Incident',
        
        // 2. Problem Description
        symptom: data.symptom,
        errorCode: data.errorCode || 'N/A',
        environment: data.environment || 'Production DC',
        impactScope: data.impactScope || 'Standard Operational',

        // 3. Pre-check / Prerequisite
        prerequisites: data.prerequisites || 'Akses root / privilege admin pada perangkat.',

        // 4. Troubleshooting / Diagnostic
        diagnosticSteps: data.diagnosticSteps || 'Periksa status indikator LED, CLI logging, dan telemetry hardware.',

        // 5. Root Cause Analysis
        rootCause: data.rootCause,

        // 6. Resolution Procedure
        resolutionSteps: data.resolutionSteps || 'Terapkan perbaikan parameter konfigurasi dan restart service terkait.',
        cliSnippet: data.cliSnippet || '# Command snippet\nshow status',

        // 7. Verification
        verificationSteps: data.verificationSteps || 'Uji fungsionalitas sistem normal pasca perbaikan.',
        expectedResult: data.expectedResult || 'Semua layanan dan antarmuka kembali ke status UP/Normal tanpa error.',

        // 8. Rollback Procedure
        rollbackProcedure: data.rollbackProcedure || 'Rollback ke state konfigurasi atau snapshot sebelumnya jika gagal.',

        // 9. Risk / Potential Impact
        riskPotentialImpact: data.riskPotentialImpact || 'Potensi transient failover selama proses eksekusi perbaikan.',

        // 10. Related Case / Ticket
        relatedTicketId: data.relatedTicketId || '-',
        caseDate: data.caseDate || new Date().toISOString().slice(0, 10),
        engineerName: data.engineerName || actorUser.name,
        source: data.relatedTicketId ? `Dari Tiket #${data.relatedTicketId}` : (data.source || 'Standard Engineering SOP'),

        // 11. Supporting Document & Evidence
        uploadedDocName: data.uploadedDocName || null,
        uploadedDocDesc: data.uploadedDocDesc || null,
        supportingDocs: Array.isArray(data.supportingDocs) ? data.supportingDocs : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        creationMethod: data.creationMethod || 'MANUAL',
        customerName: data.customerName || null,
        caseDescription: data.caseDescription || null,

        // 12. Review & Approval
        author: actorUser.name,
        approver: `${actorUser.name} (${actorUser.roleCode === 'ADMIN' ? 'Supervisor' : 'Lead Engineer'})`,
        version: data.version || '1.0',
        reviewDate: new Date().toISOString().slice(0, 10),
        // Draft disimpan apa adanya; submit oleh Admin langsung terbit, oleh Engineer menunggu review
        status: data.saveAsDraft
          ? 'DRAFT'
          : (actorUser.roleCode === 'ADMIN' ? 'PUBLISHED' : 'PENDING_APPROVAL'),
        updatedAt: 'Just now',
        ticketsReferencedCount: 0,
        createdAt: new Date().toISOString()
      };
      this.knowledgeBase.unshift(newKb);
      saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'KB_CREATED',
        entityType: 'KNOWLEDGE_BASE',
        entityId: newKb.kbCode,
        description: `Menerbitkan dokumen runbook Knowledge Base: ${newKb.title}`
      });
      return newKb;
    },

    addCustomer(customerData, actorUser) {
      const newId = this.customers.length > 0 ? Math.max(...this.customers.map(c => c.id)) + 1 : 1;
      const matchedPolicy = (this.slaPolicies || []).find(p => p.tierCode === customerData.contractSla || p.tierName === customerData.slaTier);
      const tierName = customerData.slaTier || (matchedPolicy ? matchedPolicy.tierName : (customerData.contractSla || '8x5 GOLD ENTERPRISE'));
      const slaCoverage = matchedPolicy
        ? `First Touch ≤ ${matchedPolicy.p1ResponseHours}h • Res ≤ ${matchedPolicy.p1ResolutionHours}h`
        : '-';

      let customerCode = customerData.code;
      if (!customerCode || !customerCode.trim()) {
        const cleanName = (customerData.name || 'CUST').replace(/^(PT|CV|UD|PD|TBK)\s+/i, '').trim();
        const words = cleanName.split(/\s+/).filter(Boolean);
        if (words.length >= 2) {
          customerCode = words.slice(0, 4).map(w => w[0]).join('').toUpperCase();
        } else if (words.length === 1) {
          customerCode = words[0].slice(0, 4).toUpperCase();
        } else {
          customerCode = 'CUST' + String(newId).padStart(2, '0');
        }
      }

      const created = {
        id: newId,
        name: customerData.name,
        code: customerCode.toUpperCase(),
        industry: customerData.industry || 'Klien Korporat',
        serviceContract: customerData.serviceContract || 'PKS Layanan Managed Service 24x7',
        slaTier: tierName,
        slaCoverage,
        address: customerData.address || '',
        maintenanceStart: customerData.maintenanceStart || new Date().toISOString().slice(0, 10),
        maintenanceEnd: customerData.maintenanceEnd || new Date(Date.now() + 365*24*3600*1000).toISOString().slice(0, 10),
        ticketQuota: customerData.ticketQuota !== undefined && customerData.ticketQuota !== '' ? customerData.ticketQuota : 'Unlimited',
        initialUsedTickets: 0,
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
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
      this.checkAndSyncCustomerMaintenanceStatus();

      // Simpan langsung ke database MySQL Glotra
      api.createCustomer({
        name: created.name,
        code: created.code,
        industry: created.industry,
        serviceContract: created.serviceContract,
        slaTier: created.slaTier,
        address: created.address,
        maintenanceStart: created.maintenanceStart,
        maintenanceEnd: created.maintenanceEnd,
        ticketQuota: created.ticketQuota,
        picName: customerData.picName,
        picPhone: customerData.picPhone,
        picEmail: customerData.picEmail,
        picDept: customerData.picDept
      }).then(res => {
        if (res && res.id) {
          created.id = res.id;
          if (res.pics && res.pics.length > 0) {
            created.pics = res.pics;
          }
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        }
      }).catch(err => {
        console.warn('[TicketStore] Gagal simpan customer ke MySQL:', err.message);
      });

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_CREATED',
          entityType: 'CUSTOMER',
          entityId: created.code,
          description: `Mendaftarkan perusahaan mitra baru: ${created.name} (${created.code})`
        });
      }

      return created;
    },

    updateCustomer(customerId, updatedData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust) return null;

      const oldName = cust.name;
      cust.name = updatedData.name;
      if (updatedData.code) cust.code = updatedData.code.toUpperCase();
      cust.industry = updatedData.industry || cust.industry || 'Klien Korporat';
      cust.address = updatedData.address;
      if (updatedData.slaTier || updatedData.contractSla) {
        const rawTier = updatedData.slaTier || updatedData.contractSla;
        const matched = (this.slaPolicies || []).find(p => p.tierCode === rawTier || p.tierName === rawTier);
        cust.slaTier = matched ? matched.tierName : rawTier;
        if (matched) {
          cust.slaCoverage = `First Touch ≤ ${matched.p1ResponseHours}h • Res ≤ ${matched.p1ResolutionHours}h`;
        }
      }
      if (updatedData.maintenanceStart !== undefined) cust.maintenanceStart = updatedData.maintenanceStart;
      if (updatedData.maintenanceEnd !== undefined) cust.maintenanceEnd = updatedData.maintenanceEnd;
      if (updatedData.ticketQuota !== undefined) cust.ticketQuota = updatedData.ticketQuota;
      if (typeof updatedData.isActive === 'boolean') {
        cust.isActive = updatedData.isActive;
      }
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Sinkronisasi ke MySQL database
      api.updateCustomer(customerId, {
        name: cust.name,
        code: cust.code,
        industry: cust.industry,
        slaTier: cust.slaTier || '8x5 GOLD ENTERPRISE',
        address: cust.address,
        maintenanceStart: cust.maintenanceStart,
        maintenanceEnd: cust.maintenanceEnd,
        ticketQuota: cust.ticketQuota,
        isActive: cust.isActive
      }).catch(err => {
        console.warn('[TicketStore] Gagal update customer di MySQL:', err.message);
      });

      this.addAuditLog({
        userName: actorUser.name,
        role: actorUser.roleCode,
        action: 'CUSTOMER_UPDATED',
        entityType: 'CUSTOMER',
        entityId: cust.code,
        description: `Memperbarui data profil mitra pelanggan: ${cust.name} (sebelumnya: ${oldName})`
      });

      this.checkAndSyncCustomerMaintenanceStatus();
      return cust;
    },

    checkAndSyncCustomerMaintenanceStatus() {
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10);
      let changed = false;

      this.customers.forEach(c => {
        // Auto-heal missing maintenance dates for customers
        if (!c.maintenanceStart) {
          c.maintenanceStart = c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : todayStr;
          changed = true;
        }
        if (!c.maintenanceEnd) {
          const start = new Date(c.maintenanceStart);
          const end = isNaN(start.getTime()) ? new Date(today) : new Date(start);
          end.setFullYear(end.getFullYear() + 1);
          c.maintenanceEnd = end.toISOString().slice(0, 10);
          changed = true;
        }

        const isExpired = c.maintenanceEnd < todayStr;
        c.isMaintenanceExpired = isExpired;

        // Otomatis nonaktifkan jika periode maintenance telah selesai dan bukan override manual
        if (isExpired && c.isActive !== false && !c.manualActiveOverride) {
          c.isActive = false;
          c.deactivatedReason = 'MAINTENANCE_EXPIRED';
          c.deactivatedAt = c.deactivatedAt || new Date().toISOString();
          changed = true;
        } else if (!isExpired && c.isActive === false && c.deactivatedReason === 'MAINTENANCE_EXPIRED') {
          // Jika masa maintenance diperpanjang melampaui hari ini, otomatis aktifkan kembali
          c.isActive = true;
          c.deactivatedReason = null;
          changed = true;
        }
      });

      if (changed) {
        saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
      }
    },

    toggleCustomerStatus(customerId, actorUser = null) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust) return null;

      const todayStr = new Date().toISOString().slice(0, 10);
      const isExpired = cust.maintenanceEnd ? cust.maintenanceEnd < todayStr : false;
      const previousState = cust.isActive !== false;
      const newState = !previousState;
      cust.isActive = newState;

      if (!newState) {
        cust.deactivatedAt = new Date().toISOString();
        cust.deactivatedBy = actorUser?.name || 'Administrator';
        cust.deactivatedReason = 'MANUAL_DEACTIVATION';
        cust.manualActiveOverride = false;
      } else {
        cust.activatedAt = new Date().toISOString();
        cust.activatedBy = actorUser?.name || 'Administrator';
        cust.deactivatedReason = null;
        if (isExpired) {
          cust.manualActiveOverride = true;
        } else {
          cust.manualActiveOverride = false;
        }
      }

      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Sinkronisasi status ke MySQL database
      api.updateCustomer(customerId, {
        isActive: cust.isActive
      }).catch(err => {
        console.warn('[TicketStore] Gagal update status customer di MySQL:', err.message);
      });

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: newState ? 'CUSTOMER_ACTIVATED' : 'CUSTOMER_DEACTIVATED',
          entityType: 'CUSTOMER',
          entityId: cust.code,
          description: `${newState ? 'Mengaktifkan' : 'Menonaktifkan'} status mitra ${cust.name} (${cust.code}) secara manual`
        });
      }

      return cust;
    },

    deleteCustomer(customerId, actorUser) {
      const idx = this.customers.findIndex(c => c.id === customerId);
      if (idx === -1) return false;

      const cust = this.customers[idx];
      this.customers.splice(idx, 1);
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Hapus di MySQL
      api.deleteCustomer(customerId).catch(err => {
        console.warn('[TicketStore] Gagal hapus customer di MySQL:', err.message);
      });

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_DELETED',
          entityType: 'CUSTOMER',
          entityId: cust.code,
          description: `Menghapus mitra pelanggan: ${cust.name} (${cust.code})`
        });
      }

      return true;
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
      if (!cust.pics) cust.pics = [];
      cust.pics.push(newPic);
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Simpan ke MySQL
      api.addCustomerPic(customerId, {
        name: newPic.name,
        phone: newPic.phone,
        email: newPic.email,
        dept: newPic.dept
      }).then(res => {
        if (res && res.id) {
          newPic.id = res.id;
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        }
      }).catch(err => {
        console.warn('[TicketStore] Gagal simpan PIC ke MySQL:', err.message);
      });

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_PIC_ADDED',
          entityType: 'CUSTOMER',
          entityId: cust.code,
          description: newPic.dept
            ? `Menambahkan kontak PIC baru: ${newPic.name} (${newPic.dept}) untuk mitra ${cust.name}`
            : `Menambahkan kontak PIC baru: ${newPic.name} (${newPic.phone || newPic.email || 'PIC'}) untuk mitra ${cust.name}`
        });
      }

      return newPic;
    },

    deleteCustomerPic(customerId, picId, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust || !cust.pics) return false;

      const pIdx = cust.pics.findIndex(p => p.id === picId);
      if (pIdx === -1) return false;

      const pic = cust.pics[pIdx];
      cust.pics.splice(pIdx, 1);
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Hapus di MySQL
      api.deleteCustomerPic(customerId, picId).catch(err => {
        console.warn('[TicketStore] Gagal hapus PIC di MySQL:', err.message);
      });

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_PIC_DELETED',
          entityType: 'CUSTOMER',
          entityId: cust.code,
          description: `Menghapus kontak PIC: ${pic.name} dari mitra ${cust.name}`
        });
      }

      return true;
    },

    updateCustomerPic(customerId, picId, picData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust || !cust.pics) return null;

      const pic = cust.pics.find(p => p.id === picId);
      if (!pic) return null;

      const oldName = pic.name;
      pic.name = picData.name;
      pic.dept = picData.dept;
      pic.phone = picData.phone;
      pic.email = picData.email;
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Update di MySQL
      api.updateCustomerPic(customerId, picId, {
        name: pic.name,
        phone: pic.phone,
        email: pic.email,
        dept: pic.dept
      }).catch(err => {
        console.warn('[TicketStore] Gagal update PIC di MySQL:', err.message);
      });

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_PIC_UPDATED',
          entityType: 'CUSTOMER',
          entityId: cust.code,
          description: `Memperbarui kontak PIC: ${pic.name} (${pic.dept}) untuk mitra ${cust.name}`
        });
      }

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
      saveStoredData(STORAGE_KEYS.CATEGORIES, this.categories);

      // Simpan langsung ke database MySQL Glotra
      api.createCategory({
        name: newCat.name,
        code: newCat.code,
        desc: newCat.desc
      }).catch(err => {
        console.warn('[TicketStore] Gagal simpan kategori ke database:', err.message);
      });

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
      saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
      saveStoredData(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
      saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      saveStoredData(STORAGE_KEYS.SELECTED_TICKET_ID, this.selectedTicketId);
    },

    async checkSystemStatus() {
      try {
        const res = await api.getSystemStatus();
        this.systemDbStatus = res;
        return res;
      } catch (e) {
        return null;
      }
    },

    async switchToCleanMode() {
      this.isSystemResetting = true;
      try {
        await api.resetDatabaseClean();
      } catch (err) {
        console.warn('Backend clean error, using local fallback:', err);
      }
      this.appDataMode = DATA_MODES.CLEAN_TESTING;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(DATA_MODE_KEY, DATA_MODES.CLEAN_TESTING);
        localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify([]));
        localStorage.removeItem('gtt_read_notifications');
        localStorage.removeItem('gtt_dismissed_notifications_map');
      }
      this.tickets = [];
      this.selectedTicketId = null;
      this.readNotificationIds = [];
      this.dismissedNotifications = {};
      this.auditLogs = [
        {
          id: Date.now(),
          timestampUtc: new Date().toISOString(),
          userName: 'System Administrator',
          role: 'ADMIN',
          action: 'SYSTEM_CLEAN_INIT',
          entityType: 'SYSTEM',
          entityId: 'SYS-INIT',
          description: 'Sistem dialihkan ke Mode Bersih (0 Tiket) pada database MySQL. Antrean kosong untuk pengujian alur tiket baru dari awal.'
        }
      ];
      this.persistState();
      await this.checkSystemStatus();
      this.isSystemResetting = false;
      return true;
    },

    async switchToFullMockMode() {
      this.isSystemResetting = true;
      try {
        await api.resetDatabaseSeed();
      } catch (err) {
        console.warn('Backend seed error, using local fallback:', err);
      }
      this.appDataMode = 'PRODUCTION';
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(DATA_MODE_KEY, DATA_MODES.FULL_MOCK);
        localStorage.removeItem(STORAGE_KEYS.TICKETS);
        localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
        localStorage.removeItem(STORAGE_KEYS.KNOWLEDGE_BASE);
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        localStorage.removeItem(STORAGE_KEYS.SLA_POLICIES);
        localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
        localStorage.removeItem('gtt_read_notifications');
        localStorage.removeItem('gtt_dismissed_notifications_map');
      }
      await this.fetchInitialDataFromApi();
      this.selectedTicketId = this.tickets[0]?.id || null;
      this.readNotificationIds = [];
      this.dismissedNotifications = {};
      this.persistState();
      await this.checkSystemStatus();
      this.isSystemResetting = false;
      return true;
    },

    async resetToDefaultData() {
      if (this.isCleanMode) {
        return await this.switchToCleanMode();
      } else {
        return await this.switchToFullMockMode();
      }
    }
  }
});
