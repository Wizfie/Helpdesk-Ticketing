import { defineStore } from 'pinia';
import { api } from '../services/api';
import { useAuthStore } from './authStore';

// Safe Deep Clone utility to prevent in-memory state mutations
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
  CUSTOMERS: 'gtt_customers_data_v3',
  CATEGORIES: 'gtt_categories_data',
  SLA_POLICIES: 'gtt_sla_policies_clean_v2',
  QUICK_PRESETS: 'gtt_quick_presets_data',
  AUDIT_LOGS: 'gtt_audit_logs_data',
  KNOWLEDGE_BASE: 'gtt_knowledge_base_data',
  SELECTED_TICKET_ID: 'gtt_selected_ticket_id'
};

export function filterCleanSlaPolicies(list) {
  return (list || []).filter(Boolean);
}

function getSafeActor(actorUser) {
  return {
    name: actorUser?.name || 'Support Engineer',
    roleCode: actorUser?.roleCode || actorUser?.role || 'ENGINEER'
  };
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

export const DEFAULT_SLA_POLICIES = [
  {
    id: 101,
    tierCode: 'TITANIUM_24X7',
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
    id: 102,
    tierCode: 'GOLD_24X7',
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
    id: 103,
    tierCode: 'SILVER_8X5',
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

// Kategori default hanya digunakan sebagai fallback jika API belum tersedia
export const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Server & Hardware', code: 'SRV', description: 'Gangguan fisik server, modul controller, motherboard, PSU, dan chassis' },
  { id: 2, name: 'Jaringan & Switching', code: 'NET', description: 'Switch core, spine-leaf, VLAN trunking, interface port flapping, link optical' },
  { id: 3, name: 'Storage & SAN Fabric', code: 'STR', description: 'SAN storage array, Brocade fiber channel switch, LUN datastore, hard drive failure' },
  { id: 4, name: 'Virtualisasi & Cloud', code: 'VIRT', description: 'VMware ESXi, vCenter, kernel panic / PSOD, failover cluster HA/DRS' },
  { id: 5, name: 'Keamanan & Firewall', code: 'SEC', description: 'Next-gen firewall, VPN IPSec tunnel, SSL inspection, security intrusion prevention' }
];

// Kategori default hanya digunakan sebagai fallback jika API belum tersedia (duplikat dihapus)

function getInitialSlaPolicies() {
  const loaded = loadStoredData(STORAGE_KEYS.SLA_POLICIES, DEFAULT_SLA_POLICIES, false);
  let policies = Array.isArray(loaded) && loaded.length > 0 ? loaded : cloneDeep(DEFAULT_SLA_POLICIES);
  
  // Make sure the NEW SLA Policy (TITANIUM 24x7 CRITICAL) is always present!
  const hasTitanium = policies.some(p => p.tierCode === 'TITANIUM_24X7' || (p.tierName && p.tierName.toUpperCase().includes('TITANIUM')));
  if (!hasTitanium) {
    policies.unshift(cloneDeep(DEFAULT_SLA_POLICIES[0]));
    saveStoredData(STORAGE_KEYS.SLA_POLICIES, policies);
  }
  return filterCleanSlaPolicies(policies);
}

function getInitialCustomers() {
  // Hanya gunakan data dari localStorage (yang sudah di-fetch dari API)
  // Jika kosong, kembalikan array kosong — data akan diisi saat backend online
  return loadStoredData(STORAGE_KEYS.CUSTOMERS, [], true);
}

function getInitialCategories() {
  // Gunakan data dari localStorage; fallback ke DEFAULT_CATEGORIES hanya jika benar-benar kosong
  const loaded = loadStoredData(STORAGE_KEYS.CATEGORIES, [], true);
  return Array.isArray(loaded) && loaded.length > 0 ? loaded : cloneDeep(DEFAULT_CATEGORIES);
}

function getInitialTickets() {
  // Hanya gunakan data dari localStorage (yang sudah di-fetch dari API)
  // Jika kosong, kembalikan array kosong — tidak ada seed dummy
  return loadStoredData(STORAGE_KEYS.TICKETS, [], true);
}

export const DATA_MODES = {
  FULL_MOCK: 'FULL_MOCK',
  CLEAN_TESTING: 'CLEAN_TESTING'
};

const DATA_MODE_KEY = 'gtt_app_data_mode';
const DATA_VERSION_KEY = 'gtt_data_version';
const CURRENT_DATA_VERSION = 'v11.0-clean-real-data';

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
      localStorage.removeItem('gtt_customers_data');
      localStorage.removeItem('gtt_customers_data_v3');
      localStorage.removeItem(STORAGE_KEYS.KNOWLEDGE_BASE);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.SLA_POLICIES);
      localStorage.removeItem('gtt_sla_policies_clean_v1');
      localStorage.removeItem('gtt_sla_policies_clean_v2');
      localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_TICKET_ID);
      localStorage.removeItem(DATA_MODE_KEY);
      localStorage.removeItem('gtt_read_notifications');
      localStorage.removeItem('gtt_dismissed_notifications_map');
      localStorage.removeItem('gtt_jwt_token');
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
    const initPolicies = getInitialSlaPolicies();
    const initTickets = getInitialTickets();
    const initCustomers = getInitialCustomers();

    return {
      appDataMode: activeMode,
      tickets: initTickets,
      customers: initCustomers,
      categories: getInitialCategories(),
      slaPolicies: initPolicies,
      quickPresets: [],
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
      selectedTicketId: initTickets[0]?.id || null,
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
        const actualTicketsCount = state.tickets.filter(t => t.customerId === customer.id || String(t.customerId) === String(customer.id)).length;
        if (!quotaStr || quotaStr === 'unlimited') {
          return {
            quota: 'Unlimited',
            used: actualTicketsCount,
            remaining: 'Unlimited',
            percentage: null,
            isNearLimit: false,
            isCritical: false,
            badgeColor: 'slate'
          };
        }
        const remaining = Math.max(0, parseInt(quotaStr, 10) || 0);
        // Opsi 2 (Baseline Kuota Kontrak / Paket PKS Aktif):
        // Pembagi persentase adalah alokasi paket kontrak aktif, bukan akumulasi seumur hidup.
        // Menjaga keselarasan 100% dengan TC-05 Bab 3 Laporan KP (contoh PT PJB sisa 5 dari 50 tiket / 10%).
        const baseline = (customer.baselineQuota && Number(customer.baselineQuota) > 0)
          ? Number(customer.baselineQuota)
          : (customer.contractQuota && Number(customer.contractQuota) > 0)
            ? Number(customer.contractQuota)
            : Math.max(remaining, remaining + actualTicketsCount);
        const percentage = baseline > 0 ? Math.round((remaining / baseline) * 100) : (remaining === 0 ? 0 : 100);
        // Alert Kritis jika sisa kuota <= 10% (sesuai TC-05 Laporan) ATAU sisa tiket <= 1
        const isCritical = remaining === 0 || percentage <= 10 || remaining <= 1;
        // Alert Peringatan jika sisa kuota <= 20% ATAU sisa tiket <= 3 (dan belum kritis)
        const isNearLimit = !isCritical && (percentage <= 20 || remaining <= 3);
        const badgeColor = isCritical ? 'rose' : (isNearLimit ? 'amber' : 'emerald');
        return {
          quota: baseline,
          used: actualTicketsCount,
          remaining: remaining,
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
            totalUsed += actualTicketsCount;
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

      // 1. Quota alerts for customers (critical <= 10% / sisa <= 1 tiket & warning <= 20% / sisa <= 3 tiket)
      state.customers.forEach(c => {
        const qInfo = getInfo(c);
        if (qInfo.quota !== 'Unlimited' && qInfo.isCritical) {
          notifs.push({
            id: `quota-${c.id}`,
            category: 'KUOTA',
            type: 'QUOTA_CRITICAL',
            severity: 'CRITICAL',
            title: `Sisa Kuota Kritis: ${c.name}`,
            entityName: c.name,
            entityCode: String(c.id),
            message: `Sisa kuota ${qInfo.remaining} tiket${qInfo.percentage !== null ? ` (${qInfo.percentage}%)` : ''}. Segera tambah kuota melalui menu Kelola Customer.`,
            shortDesc: `Sisa ${qInfo.remaining} tiket${qInfo.percentage !== null ? ` (${qInfo.percentage}%)` : ''}`,
            timestamp: 'Penting',
            link: '/admin/customers',
            targetId: c.id,
            badgeText: `${qInfo.remaining} Tiket${qInfo.percentage !== null ? ` (${qInfo.percentage}%)` : ''}`,
            badgeColor: 'rose'
          });
        } else if (qInfo.quota !== 'Unlimited' && qInfo.isNearLimit) {
          notifs.push({
            id: `quota-warn-${c.id}`,
            category: 'KUOTA',
            type: 'QUOTA_WARNING',
            severity: 'WARNING',
            title: `Sisa Kuota Menipis: ${c.name}`,
            entityName: c.name,
            entityCode: String(c.id),
            message: `Sisa kuota tersisa ${qInfo.remaining} tiket${qInfo.percentage !== null ? ` (${qInfo.percentage}%)` : ''}.`,
            shortDesc: `Sisa ${qInfo.remaining} tiket${qInfo.percentage !== null ? ` (${qInfo.percentage}%)` : ''}`,
            timestamp: 'Perhatian',
            link: '/admin/customers',
            targetId: c.id,
            badgeText: `${qInfo.remaining} Tiket${qInfo.percentage !== null ? ` (${qInfo.percentage}%)` : ''}`,
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
              entityCode: String(c.id),
              message: `Kontrak berakhir per ${c.maintenanceEnd}. Akun dinonaktifkan.`,
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
              entityCode: String(c.id),
              message: `Kontrak berakhir dalam ${diffDays} hari (${c.maintenanceEnd}).`,
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
            message: `"${t.title}" telah melampaui batas waktu SLA.`,
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
            message: `"${t.title}" mendekati batas waktu penanganan.`,
            shortDesc: t.title,
            timestamp: 'Prioritas Tinggi',
            link: '/tickets',
            targetTicketId: t.id,
            badgeText: 'Sisa < 30m',
            badgeColor: 'amber'
          });
        }
      });

      // 5. Tickets Assigned to Current Logged-in Engineer
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
            message: `Anda ditugaskan menangani "${t.title}".`,
            shortDesc: t.title,
            timestamp: 'Ditugaskan ke Anda',
            link: '/tickets',
            targetTicketId: t.id,
            badgeText: t.severity,
            badgeColor: t.severity === 'CRITICAL' ? 'rose' : (t.severity === 'HIGH' ? 'amber' : 'blue')
          });
        });
      }

      // 6. Critical Severity Incidents (P1 Incident Alert)
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
              message: `Insiden darurat aktif: "${t.title}".`,
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
        const [ticketsRes, customersRes, kbRes, categoriesRes, presetsRes, holdReasonsRes, slaPoliciesRes] = await Promise.all([
          api.getTickets().catch(() => null),
          api.getCustomers().catch(() => null),
          api.getArticles().catch(() => null),
          api.getCategories().catch(() => null),
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
        } else if (!this.categories) {
          this.categories = [];
          saveStoredData(STORAGE_KEYS.CATEGORIES, this.categories);
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
        } else {
          this.slaPolicies = [];
          saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
        }
        return this.slaPolicies;
      } catch (err) {
        console.warn('[TicketStore] Gagal fetch SLA policies:', err.message);
        this.slaPolicies = [];
        return this.slaPolicies;
      }
    },

    async fetchCustomers() {
      try {
        const res = await api.getCustomers();
        const list = Array.isArray(res) ? res : (res?.data || null);
        if (list !== null) {
          this.customers = list;
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        } else {
          this.customers = [];
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        }
        this.checkAndSyncCustomerMaintenanceStatus();
        return this.customers;
      } catch (err) {
        console.warn('[TicketStore] Gagal fetch customers:', err.message);
        return this.customers;
      }
    },

    async fetchTickets(params = {}) {
      try {
        const res = await api.getTickets(params);
        const list = Array.isArray(res) ? res : (res?.data || null);
        if (list !== null) {
          this.tickets = list.map(t => ({
            ...t,
            milestones: t.milestones || [],
            attachments: t.attachments || []
          }));
          saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
        } else {
          this.tickets = [];
          saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
        }
        return this.tickets;
      } catch (err) {
        console.warn('[TicketStore] Gagal fetch tickets:', err.message);
        return this.tickets;
      }
    },

    async fetchKnowledgeBase(params = {}) {
      try {
        const res = await api.getArticles(params);
        const list = Array.isArray(res) ? res : (res?.data || null);
        if (list !== null) {
          this.knowledgeBase = list;
          saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
        } else {
          this.knowledgeBase = [];
          saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
        }
        return this.knowledgeBase;
      } catch (err) {
        console.warn('[TicketStore] Gagal fetch KB:', err.message);
        return this.knowledgeBase;
      }
    },

    async deleteKnowledgeBase(id) {
      try {
        await api.deleteArticle(id);
      } catch (e) {
        console.warn('[TicketStore] Gagal delete KB via API:', e.message);
      }
      const idx = this.knowledgeBase.findIndex(k => k.id === id);
      if (idx !== -1) {
        this.knowledgeBase.splice(idx, 1);
        saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      }
    },

    async fetchAuditLogs(params = {}) {
      try {
        const res = await api.getAuditLogs(params);
        const list = Array.isArray(res) ? res : (res?.logs || res?.data || null);
        if (list !== null) {
          this.auditLogs = list;
          saveStoredData(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
        } else {
          this.auditLogs = [];
          saveStoredData(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
        }
        return this.auditLogs;
      } catch (err) {
        console.warn('[TicketStore] Gagal fetch audit logs:', err.message);
        return this.auditLogs;
      }
    },

    setSlaPolicies(policies) {
      this.slaPolicies = filterCleanSlaPolicies(policies);
      saveStoredData(STORAGE_KEYS.SLA_POLICIES, this.slaPolicies);
    },

    saveSlaPolicy(policy) {
      if (!this.slaPolicies) this.slaPolicies = [];
      const idx = this.slaPolicies.findIndex(p => p.id === policy.id || p.tierName === policy.tierName);
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

    async seedRealisticTickets() {
      try {
        if (api && typeof api.resetDatabaseSeed === 'function') {
          await api.resetDatabaseSeed();
          await this.fetchInitialDataFromApi();
        }
      } catch (err) {
        console.warn('[ticketStore] Backend seed call bypassed or failed:', err?.message);
      }
      return this.tickets;
    },

    createTicket(ticketData, actorUser) {
      if (ticketData.customerId) {
        const customer = (this.customers || []).find(c => String(c.id) === String(ticketData.customerId));
        if (customer) {
          const qInfo = this.getCustomerQuotaInfo(customer);
          if (qInfo && qInfo.quota !== 'Unlimited' && typeof qInfo.remaining === 'number' && qInfo.remaining <= 0) {
            throw new Error(`Gagal membuat tiket: Kuota tiket untuk mitra "${customer.name}" telah habis (sisa 0 tiket). Silakan tambah kuota terlebih dahulu.`);
          }
          // Kurangi saldo kuota tiket aktif jika bukan Unlimited (Model Saldo Kuota Berjalan)
          if (customer.ticketQuota && String(customer.ticketQuota).toLowerCase() !== 'unlimited') {
            const cur = parseInt(customer.ticketQuota, 10) || 0;
            customer.ticketQuota = String(Math.max(0, cur - 1));
            saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
          }
        }
      }

      const nowUtc = new Date().toISOString();
      const count = this.tickets.length + 1;
      const year2 = String(new Date().getFullYear()).slice(-2);
      const padNum = String(count).padStart(3, '0');
      const ticketNumber = `TK-${year2}${padNum}`;

      // Calculate SLA response & resolution deadlines based on Customer's Contract Tier & Severity
      const contract = (ticketData.contractSla || ticketData.contractTier || '').toUpperCase();
      let respHours = 1;
      let resHours = 8;

      const matchedPolicy = (this.slaPolicies || []).find(p => 
        p.tierCode === ticketData.contractSla || 
        p.tierName === ticketData.contractSla ||
        p.tierName === ticketData.contractTier ||
        (p.tierCode && contract.includes(p.tierCode.toUpperCase())) ||
        (p.tierName && contract.includes(p.tierName.toUpperCase()))
      );
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
        ticketType: ticketData.ticketType || 'Incident',
        categoryId: ticketData.categoryId ? Number(ticketData.categoryId) : null,
        serialNumber: ticketData.serialNumber || null,
        severity: ticketData.severity || 'MEDIUM',
        title: ticketData.title,
        description: ticketData.description,
        attachmentUrl: ticketData.attachmentUrl || null,
        attachmentName: ticketData.attachmentName || null,
        attachmentSize: ticketData.attachmentSize || null,
        status: 'ASSIGNED',
        trackingToken: 'sec_' + Math.random().toString(36).substring(2, 10),
        createdById: actorUser?.id || 1,
        assignedToId: Number(ticketData.assignedToId),
        contractTier: ticketData.contractTier || '8x5 GOLD ENTERPRISE',
        sendEmailNotification: Boolean(ticketData.sendEmailNotification),
        createdAt: nowUtc,
        updatedAt: nowUtc,
        responseDeadline,
        resolutionDeadline,
        respondedAt: nowUtc,
        resolvedAt: null,
        closedAt: null,
        isPaused: false,
        totalPausedDurationSec: 0,
        isSlaResponseBreached: false,
        isSlaResolutionBreached: false,
        rootCause: null,
        resolutionStrategy: null,
        recommendation: null,
        milestones: [
          {
            id: Date.now(),
            stepName: 'Laporan Diterima & Teknisi Dialokasikan',
            status: 'ASSIGNED',
            actorName: actorUser?.name || 'CPIG Operator',
            actorRole: actorUser?.role || 'CPIG_OPERATOR',
            notes: `Tiket diterbitkan dengan nomor ${ticketNumber} dan langsung dialokasikan ke teknisi.`,
            timestampUtc: nowUtc
          }
        ]
      };

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
      const ticket = this.tickets.find(t => t.id == ticketId || String(t.id) === String(ticketId));
      if (!ticket) return;

      const user = getSafeActor(actorUser);
      const nowUtc = new Date().toISOString();
      ticket.assignedToId = Number(engineerId);
      ticket.status = 'ASSIGNED';
      ticket.updatedAt = nowUtc;
      if (!ticket.respondedAt) {
        ticket.respondedAt = nowUtc;
      }

      if (!ticket.milestones) ticket.milestones = [];
      ticket.milestones.push({
        id: Date.now(),
        stepName: 'Penugasan ke Teknisi Lapangan',
        status: 'ASSIGNED',
        actorName: user.name,
        actorRole: user.roleCode,
        notes: `Tiket dialokasikan untuk penanganan lanjutan. Response SLA terpenuhi.`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: user.name,
        role: user.roleCode,
        action: 'ASSIGN_ENGINEER',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Menugaskan tiket kepada engineer ID ${engineerId}`
      });
    },

    addProgressMilestone(ticketId, { stepName, notes, proofFile, nextStatus, proofFileSize, progressPercent, additionalNotes, syncToKb }, actorUser) {
      const ticket = this.tickets.find(t => t.id == ticketId || String(t.id) === String(ticketId));
      if (!ticket) return;

      const user = getSafeActor(actorUser);
      const nowUtc = new Date().toISOString();
      if (nextStatus) {
        ticket.status = nextStatus;
        if (nextStatus === 'RESOLVED' && !ticket.resolvedAt) {
          ticket.resolvedAt = nowUtc;
        }
        if (nextStatus === 'CLOSED' && !ticket.closedAt) {
          ticket.closedAt = nowUtc;
          if (!ticket.resolvedAt) ticket.resolvedAt = nowUtc;
        }
      }
      if (progressPercent !== undefined && progressPercent !== null) {
        ticket.progressPercent = Math.min(100, Math.max(0, Number(progressPercent)));
      }
      ticket.updatedAt = nowUtc;

      if (!ticket.milestones || ticket.milestones.length === 0) {
        ticket.milestones = [
          {
            id: 'init-' + (ticket.id || 1),
            stepName: 'Laporan Diterima (Ticket Created)',
            status: 'OPEN',
            actorName: ticket.creatorName || 'Admin',
            actorRole: 'Admin',
            notes: `Tiket #${ticket.ticketNumber || ''} berhasil diterbitkan dan masuk ke sistem Helpdesk. Target respon SLA berjalan.`,
            progressPercent: 0,
            timestampUtc: ticket.createdAt || nowUtc,
            proofFile: ticket.attachmentName || null
          }
        ];
      }
      const newStep = {
        id: Date.now(),
        stepName,
        status: nextStatus || ticket.status,
        actorName: user.name,
        actorRole: user.roleCode,
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
            uploadedBy: user.name,
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
          author: `${user.name} (${user.roleCode})`,
          approver: user.roleCode === 'ADMIN' ? user.name : 'Menunggu Review Admin / Lead',
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
        userName: user.name,
        role: user.roleCode,
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

    pauseSla(ticketId, { pendingType, reason, principalCaseId, principalVendor }, actorUser) {
      const ticket = this.tickets.find(t => t.id == ticketId || String(t.id) === String(ticketId));
      if (!ticket) return;

      const user = getSafeActor(actorUser);
      const nowUtc = new Date().toISOString();
      ticket.isPaused = true;
      ticket.pausedAt = nowUtc;
      ticket.pauseReason = pendingType;
      ticket.pauseDetails = reason;
      ticket.status = (pendingType === 'CUSTOMER' || pendingType === 'PARTNER_CUSTOMER') ? 'PENDING_CUSTOMER' : 'PENDING_VENDOR';
      ticket.updatedAt = nowUtc;
      if (principalCaseId) {
        ticket.principalCaseId = principalCaseId;
      }
      if (principalVendor) {
        ticket.principalVendor = principalVendor;
      }

      const presetLabels = {
        PART_HARDWARE: 'Part / Hardware (Menunggu Suku Cadang)',
        PART_INDENT: 'Part Indent (Menunggu Suku Cadang/Hardware)',
        PARTNER_CUSTOMER: 'Partner / Customer (Menunggu Konfirmasi)',
        CUSTOMER: 'Menunggu Konfirmasi / Akses Customer',
        VENDOR: 'Dependensi Vendor / Partner / PM'
      };
      const label = presetLabels[pendingType] || pendingType;

      if (!ticket.milestones) ticket.milestones = [];
      const currentProgress = ticket.milestones.reduce((max, m) => Math.max(max, Number(m.progressPercent || 0)), Number(ticket.progressPercent || 0));
      ticket.milestones.push({
        id: Date.now(),
        stepName: `SLA Ditahan (${label})`,
        status: ticket.status,
        actorName: user.name,
        actorRole: user.roleCode,
        notes: `[Preset: ${label}] ${reason}${principalCaseId ? ` (Case Principal: ${principalCaseId})` : ''}. Timer Resolution SLA dibekukan sementara.`,
        timestampUtc: nowUtc,
        proofFile: null,
        progressPercent: currentProgress
      });

      this.addAuditLog({
        userName: user.name,
        role: user.roleCode,
        action: 'SLA_PAUSED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `SLA di-pause (${label}): ${reason}`
      });
      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
    },

    addPrincipal(name) {
      if (!name || typeof name !== 'string') return;
      const trimmed = name.trim();
      if (!this.principals) this.principals = [];
      if (!this.principals.includes(trimmed)) {
        this.principals.push(trimmed);
        saveStoredData('gtt_principals_data', this.principals);
      }
    },

    escalateTicket(ticketId, { target, vendorName, vendorCaseId, vendorSpecialist, note }, actorUser) {
      const ticket = this.tickets.find(t => t.id == ticketId || String(t.id) === String(ticketId));
      if (!ticket) return;

      const user = getSafeActor(actorUser);
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

      if (!ticket.milestones) ticket.milestones = [];
      ticket.milestones.push({
        id: Date.now(),
        stepName: `Eskalasi ke ${targetLabel}`,
        status: ticket.status,
        actorName: user.name,
        actorRole: user.roleCode,
        notes: `Tiket dialihkan/eskalasi ke ${targetLabel}.${vendorCaseId ? ` No Kasus Vendor: ${vendorCaseId}.` : ''} Catatan Teknis: ${note}`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: user.name,
        role: user.roleCode,
        action: 'TICKET_ESCALATED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Eskalasi ke ${targetLabel}: ${note.slice(0, 50)}...`
      });
      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
    },

    resumeSla(ticketId, actorUser) {
      const ticket = this.tickets.find(t => t.id == ticketId || String(t.id) === String(ticketId));
      if (!ticket || !ticket.isPaused) return;

      const user = getSafeActor(actorUser);
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

      if (!ticket.milestones) ticket.milestones = [];
      const currentProgress = ticket.milestones.reduce((max, m) => Math.max(max, Number(m.progressPercent || 0)), Number(ticket.progressPercent || 0));
      ticket.milestones.push({
        id: Date.now(),
        stepName: 'SLA Dilanjutkan (Pekerjaan Aktif Kembali)',
        status: 'IN_PROGRESS',
        actorName: user.name,
        actorRole: user.roleCode,
        notes: `Respon dari pihak terkait telah diterima. Timer SLA aktif kembali, deadline diperpanjang ${Math.round(pausedSeconds / 60)} menit.`,
        timestampUtc: now.toISOString(),
        proofFile: null,
        progressPercent: currentProgress
      });

      this.addAuditLog({
        userName: user.name,
        role: user.roleCode,
        action: 'SLA_RESUMED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `SLA dilanjutkan setelah tertahan ${Math.round(pausedSeconds / 60)} menit`
      });
      saveStoredData(STORAGE_KEYS.TICKETS, this.tickets);
    },

    resolveTicket(ticketId, { rootCause, resolutionStrategy, actionTaken, resolutionNotes, recommendation }, actorUser) {
      const ticket = this.tickets.find(t => t.id == ticketId || String(t.id) === String(ticketId));
      if (!ticket) return;

      const user = getSafeActor(actorUser);
      const nowUtc = new Date().toISOString();
      ticket.status = 'RESOLVED';
      ticket.resolvedAt = nowUtc; // SLA Resolution Timer STOPS here!
      if (rootCause) ticket.rootCause = rootCause;
      if (resolutionStrategy) ticket.resolutionStrategy = resolutionStrategy;
      ticket.actionTaken = actionTaken || '';
      ticket.resolutionNotes = resolutionNotes || '';
      ticket.recommendation = recommendation || '';
      ticket.updatedAt = nowUtc;

      if (!ticket.milestones) ticket.milestones = [];
      ticket.milestones.push({
        id: Date.now(),
        stepName: 'Solusi Diterapkan & Layanan Pulih (RESOLVED)',
        status: 'RESOLVED',
        actorName: user.name,
        actorRole: user.roleCode,
        notes: `Pekerjaan teknis selesai. Resolution SLA BERHENTI. Tiket memasuki masa validasi 72 jam (auto-close).`,
        timestampUtc: nowUtc,
        proofFile: null
      });

      this.addAuditLog({
        userName: user.name,
        role: user.roleCode,
        action: 'TICKET_RESOLVED',
        entityType: 'TICKET',
        entityId: ticket.ticketNumber,
        description: `Tiket berstatus RESOLVED oleh ${user.name}. Resolution SLA tuntas.`
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

    proposeNewArticle(data, actorUser) {
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const newKb = {
        id: data.id || codeNum,
        kbCode: data.kbCode || `KB-${codeNum}`,
        title: data.title,
        caseType: data.caseType || 'Incident',
        category: data.category || data.categoryGroup || 'General',
        product: data.product || data.productPlatform || '',
        author: actorUser?.name || 'Support Engineer',
        documentName: data.documentName || data.uploadedDocName || null,
        documentSize: data.documentSize || data.uploadedDocSize || null,
        pdfAttachmentUrl: data.pdfAttachmentUrl || null,
        sourceTicket: data.sourceTicket || data.relatedTicketId || null,
        ticketsReferencedCount: (data.sourceTicket || data.relatedTicketId) ? 1 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.knowledgeBase.unshift(newKb);
      saveStoredData(STORAGE_KEYS.KNOWLEDGE_BASE, this.knowledgeBase);
      this.addAuditLog({
        userName: actorUser?.name || 'Support Engineer',
        role: actorUser?.roleCode || 'ENGINEER',
        action: 'KB_CREATED',
        entityType: 'KNOWLEDGE_BASE',
        entityId: newKb.kbCode,
        description: `Menerbitkan dokumen runbook Knowledge Base: ${newKb.title}`
      });
      return newKb;
    },

    async addCustomer(customerData, actorUser) {
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
        industry: customerData.industry || 'Klien Korporat',
        slaTier: tierName,
        contractSla: tierName,
        slaCoverage,
        address: customerData.address || '',
        maintenanceStart: customerData.maintenanceStart || new Date().toISOString().slice(0, 10),
        maintenanceEnd: customerData.maintenanceEnd || new Date(Date.now() + 365*24*3600*1000).toISOString().slice(0, 10),
        ticketQuota: customerData.ticketQuota !== undefined && customerData.ticketQuota !== '' ? customerData.ticketQuota : 'Unlimited',
        baselineQuota: (customerData.ticketQuota && String(customerData.ticketQuota).toLowerCase() !== 'unlimited' && !isNaN(Number(customerData.ticketQuota))) ? Number(customerData.ticketQuota) : null,
        isActive: true,
        pics: [
          {
            id: newId * 100 + 1,
            name: customerData.picName,
            phone: customerData.picPhone,
            email: customerData.picEmail
          }
        ]
      };
      this.customers.push(created);
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
      this.checkAndSyncCustomerMaintenanceStatus();

      // Simpan langsung ke database MySQL Glotra (di-await)
      try {
        const res = await api.createCustomer({
          name: created.name,
          industry: created.industry,
          slaTier: created.slaTier,
          address: created.address,
          maintenanceStart: created.maintenanceStart,
          maintenanceEnd: created.maintenanceEnd,
          ticketQuota: created.ticketQuota,
          picName: customerData.picName,
          picPhone: customerData.picPhone,
          picEmail: customerData.picEmail
        });
        const createdServer = res?.data || res;
        if (createdServer && createdServer.id) {
          created.id = createdServer.id;
          if (createdServer.pics && createdServer.pics.length > 0) {
            created.pics = createdServer.pics;
          }
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        }
      } catch (err) {
        console.warn('[TicketStore] Gagal simpan customer ke MySQL:', err.message);
      }

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name || 'Admin',
          role: actorUser.roleCode || actorUser.role || 'ADMIN',
          action: 'CUSTOMER_CREATED',
          entityType: 'CUSTOMER',
          entityId: String(created.id),
          description: `Mendaftarkan perusahaan mitra baru: ${created.name}`
        });
      }

      return created;
    },

    async updateCustomer(customerId, updatedData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust) return null;

      const oldName = cust.name;
      cust.name = updatedData.name;
      cust.industry = updatedData.industry || cust.industry || 'Klien Korporat';
      cust.address = updatedData.address;
      if (updatedData.slaTier || updatedData.contractSla) {
        const rawTier = updatedData.slaTier || updatedData.contractSla;
        const matched = (this.slaPolicies || []).find(p => p.tierCode === rawTier || p.tierName === rawTier);
        cust.slaTier = matched ? matched.tierName : rawTier;
        cust.contractSla = cust.slaTier;
        if (matched) {
          cust.slaCoverage = `First Touch ≤ ${matched.p1ResponseHours}h • Res ≤ ${matched.p1ResolutionHours}h`;
        }
      }
      if (updatedData.maintenanceStart !== undefined) cust.maintenanceStart = updatedData.maintenanceStart;
      if (updatedData.maintenanceEnd !== undefined) cust.maintenanceEnd = updatedData.maintenanceEnd;
      if (updatedData.ticketQuota !== undefined) {
        cust.ticketQuota = updatedData.ticketQuota;
        if (cust.ticketQuota && String(cust.ticketQuota).toLowerCase() !== 'unlimited' && !isNaN(Number(cust.ticketQuota))) {
          cust.baselineQuota = Number(cust.ticketQuota);
        }
      }
      if (typeof updatedData.isActive === 'boolean') {
        cust.isActive = updatedData.isActive;
      }
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Sinkronisasi ke MySQL database (di-await agar data tersimpan tuntas sebelum re-fetch)
      try {
        const res = await api.updateCustomer(customerId, {
          name: cust.name,
          industry: cust.industry,
          slaTier: cust.slaTier || '8x5 GOLD ENTERPRISE',
          address: cust.address,
          maintenanceStart: cust.maintenanceStart,
          maintenanceEnd: cust.maintenanceEnd,
          ticketQuota: cust.ticketQuota,
          isActive: cust.isActive
        });
        const updated = res?.data || res;
        if (updated && updated.id) {
          cust.slaTier = updated.slaTier || cust.slaTier;
          cust.contractSla = cust.slaTier;
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        }
      } catch (err) {
        console.warn('[TicketStore] Gagal update customer di MySQL:', err.message);
      }

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name || 'Admin',
          role: actorUser.roleCode || actorUser.role || 'ADMIN',
          action: 'CUSTOMER_UPDATED',
          entityType: 'CUSTOMER',
          entityId: String(cust.id),
          description: `Memperbarui data profil mitra pelanggan: ${cust.name} (sebelumnya: ${oldName})`
        });
      }

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
          c.deactivatedAt = c.deactivatedAt || new Date().toISOString();
          changed = true;
        } else if (!isExpired && c.isActive === false) {
          // Jika masa maintenance diperpanjang melampaui hari ini, otomatis aktifkan kembali
          c.isActive = true;
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
        cust.manualActiveOverride = false;
      } else {
        cust.activatedAt = new Date().toISOString();
        cust.activatedBy = actorUser?.name || 'Administrator';
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
          entityId: String(cust.id),
          description: `${newState ? 'Mengaktifkan' : 'Menonaktifkan'} status mitra ${cust.name} secara manual`
        });
      }

      return cust;
    },

    async topUpCustomerQuota(customerId, amount, notes, actorUser) {
      const cust = this.customers.find(c => String(c.id) === String(customerId));
      if (!cust) throw new Error('Data mitra pelanggan tidak ditemukan.');

      const addVal = parseInt(amount, 10);
      if (isNaN(addVal) || addVal <= 0) {
        throw new Error('Jumlah tambahan kuota harus angka bulat positif lebih dari 0.');
      }

      const currentQuotaStr = String(cust.ticketQuota || '').trim().toLowerCase();
      let newQuota;
      if (!currentQuotaStr || currentQuotaStr === 'unlimited') {
        newQuota = addVal;
      } else {
        const cur = parseInt(currentQuotaStr, 10) || 0;
        newQuota = cur + addVal;
      }

      cust.ticketQuota = String(newQuota);
      // Opsi 2: Perbarui baseline kapasitas aktif dengan saldo baru agar persentase proporsional dan tidak false-alert
      cust.baselineQuota = newQuota;
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Sinkronisasi ke MySQL Backend
      try {
        const res = await api.topUpCustomerQuota(customerId, {
          amount: addVal,
          notes: notes || ''
        });
        if (res && res.ticketQuota !== undefined) {
          cust.ticketQuota = String(res.ticketQuota);
          saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);
        }
      } catch (err) {
        console.warn('[TicketStore] Gagal top-up kuota customer di MySQL:', err.message);
        // Fallback ke endpoint updateCustomer standar
        try {
          await api.updateCustomer(customerId, { ticketQuota: String(newQuota) });
        } catch (e2) {}
      }

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_QUOTA_TOPUP',
          entityType: 'CUSTOMER',
          entityId: String(cust.id),
          description: `Top-up kuota tiket mitra ${cust.name}: +${addVal} tiket (Total kuota baru: ${cust.ticketQuota} tiket)${notes ? ` [Ref: ${notes}]` : ''}`
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
          entityId: String(cust.id),
          description: `Menghapus mitra pelanggan: ${cust.name}`
        });
      }

      return true;
    },

    async addCustomerPic(customerId, picData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust) return null;

      const payload = {
        name: picData.name,
        phone: picData.phone,
        email: picData.email
      };

      try {
        // Simpan langsung ke MySQL via backend REST API
        const saved = await api.addCustomerPic(customerId, payload);
        const picWithId = saved && saved.id ? saved : {
          id: Date.now(),
          ...payload
        };

        if (!cust.pics) cust.pics = [];
        const existingIdx = cust.pics.findIndex(p => p.id === picWithId.id);
        if (existingIdx === -1) {
          cust.pics.push(picWithId);
        } else {
          cust.pics[existingIdx] = picWithId;
        }

        saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

        if (actorUser) {
          this.addAuditLog({
            userName: actorUser.name,
            role: actorUser.roleCode,
            action: 'CUSTOMER_PIC_ADDED',
            entityType: 'CUSTOMER',
            entityId: String(cust.id),
            description: `Menambahkan kontak PIC baru: ${picWithId.name} untuk mitra ${cust.name}`
          });
        }

        // Refresh data pelanggan dari MySQL database
        await this.fetchCustomers();

        return picWithId;
      } catch (err) {
        console.warn('[TicketStore] Gagal simpan PIC ke MySQL:', err.message);
        throw err;
      }
    },

    async deleteCustomerPic(customerId, picId, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust || !cust.pics) return false;

      const pIdx = cust.pics.findIndex(p => p.id === picId);
      if (pIdx === -1) return false;

      const pic = cust.pics[pIdx];
      cust.pics.splice(pIdx, 1);
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Hapus di MySQL
      try {
        await api.deleteCustomerPic(customerId, picId);
      } catch (err) {
        console.warn('[TicketStore] Gagal hapus PIC di MySQL:', err.message);
      }

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_PIC_DELETED',
          entityType: 'CUSTOMER',
          entityId: String(cust.id),
          description: `Menghapus kontak PIC: ${pic.name} dari mitra ${cust.name}`
        });
      }

      // Refresh data pelanggan dari MySQL database
      await this.fetchCustomers();

      return true;
    },

    updateCustomerPic(customerId, picId, picData, actorUser) {
      const cust = this.customers.find(c => c.id === customerId);
      if (!cust || !cust.pics) return null;

      const pic = cust.pics.find(p => p.id === picId);
      if (!pic) return null;

      pic.name = picData.name;
      pic.phone = picData.phone;
      pic.email = picData.email;
      saveStoredData(STORAGE_KEYS.CUSTOMERS, this.customers);

      // Update di MySQL
      api.updateCustomerPic(customerId, picId, {
        name: pic.name,
        phone: pic.phone,
        email: pic.email
      }).catch(err => {
        console.warn('[TicketStore] Gagal update PIC di MySQL:', err.message);
      });

      if (actorUser) {
        this.addAuditLog({
          userName: actorUser.name,
          role: actorUser.roleCode,
          action: 'CUSTOMER_PIC_UPDATED',
          entityType: 'CUSTOMER',
          entityId: String(cust.id),
          description: `Memperbarui kontak PIC: ${pic.name} untuk mitra ${cust.name}`
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
      const newLog = {
        id: this.auditLogs.length + 1,
        userName: entry.userName,
        role: entry.role,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        description: entry.description,
        ipAddress: '192.168.10.' + (Math.floor(Math.random() * 80) + 10),
        timestampUtc: new Date().toISOString()
      };
      this.auditLogs.unshift(newLog);
      saveStoredData(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);

      // Sinkronisasi perubahan ke MySQL audit_logs
      api.createAuditLog({
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        description: entry.description,
        userName: entry.userName,
        role: entry.role
      }).catch(err => {
        console.warn('[TicketStore] Gagal mencatat audit log ke DB:', err.message);
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
