// Realistic Enterprise Mock Data for PT Global Transformasi Teknologi (Glotra Technology) Helpdesk Ticketing System
// Aligned with 8 Figma Frames & ITIL Enterprise Service Desk Standards

export const ROLES = [
  { id: 1, code: 'ADMIN', name: 'ADMIN / CPIG', badge: 'Admin & Helpdesk', description: 'Kendali penuh tiket, triage laporan, penugasan teknisi, analitik SLA, dan konfigurasi master data' },
  { id: 2, code: 'ENGINEER', name: 'Support Engineer', badge: 'Teknisi NOC', description: 'Pelaksana investigasi teknis, milestone pemulihan, pause SLA, dan resolusi tiket' }
];

export const MOCK_USERS = [
  { id: 1, roleId: 1, roleCode: 'ADMIN', name: 'Ahmad Fauzi', roleTitle: 'System Administrator', email: 'admin@glotratech.com', initials: 'AF', phone: '0811-9988-771', isActive: true, password: 'password123' }
];

export const CORE_TELEMETRY = {
  nodeId: 'NODE-JKT-01A',
  uptime: '99.98%',
  engineMode: 'Dual Sync HA',
  services: [
    { name: 'TICKETING SYSTEM', status: 'Operational (99.9%)', state: 'operational' },
    { name: 'EMAIL NOTIFICATION', status: 'Operational (Relay OK)', state: 'operational' },
    { name: 'SLA ENGINE', status: 'Operational (Real-Time)', state: 'operational' },
    { name: 'KNOWLEDGE BASE', status: 'Active (v2.8 Index)', state: 'operational' }
  ]
};

export const ON_DUTY_ROSTER = [];

export const MOCK_CUSTOMERS = [];

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Server & Infrastructure', code: 'SRV', desc: 'Hardware server fisik, Virtual Machine, Cloud Instance, Storage NAS/SAN' },
  { id: 2, name: 'Network & Connectivity', code: 'NET', desc: 'Switch, Router, Firewall, Link FO, VPN IPsec, Bandwidth RTO' },
  { id: 3, name: 'Database & Applications', code: 'APP', desc: 'MySQL, PostgreSQL, Oracle, Web Service API, ERP, Error 500' },
  { id: 4, name: 'Security & Access Control', code: 'SEC', desc: 'Credential reset, LDAP/Active Directory, Privilege issue, SSL cert expired' },
  { id: 5, name: 'Peripheral & Workstation', code: 'WST', desc: 'PC User, Scanner, Printer, OS crashing' }
];

export const QUICK_PRESETS = [
  {
    id: 'preset-1',
    title: 'Server Down / Service Unreachable',
    categoryId: 1,
    severity: 'HIGH',
    responseHours: 0.5,
    resolutionHours: 4,
    description: 'Server utama tidak merespon koneksi (RTO). Seluruh layanan transaksi pengguna terhenti total.'
  },
  {
    id: 'preset-2',
    title: 'Koneksi Jaringan Lambat / High Packet Loss',
    categoryId: 2,
    severity: 'MEDIUM',
    responseHours: 1,
    resolutionHours: 8,
    description: 'Traffic link gateway mengalami lonjakan latency (>250ms) dan packet loss 15-30%.'
  },
  {
    id: 'preset-3',
    title: 'Kendala Akses VPN / Account Locked',
    categoryId: 4,
    severity: 'LOW',
    responseHours: 2,
    resolutionHours: 12,
    description: 'User tidak dapat terhubung ke remote VPN kantor atau akun ter-lock out.'
  },
  {
    id: 'preset-4',
    title: 'Database CPU High & Query Timeout',
    categoryId: 3,
    severity: 'HIGH',
    responseHours: 0.5,
    resolutionHours: 4,
    description: 'Utilisasi CPU database menyentuh 99%, query select mengalami lock and timeout.'
  }
];

export const MOCK_SLA_POLICIES = [];


// Clean Production: No mock / dummy seed tickets
export const INITIAL_TICKETS = [];

export const MOCK_KNOWLEDGE_BASE = [];

export const MOCK_PENDING_KB_APPROVALS = [];

export const MOCK_AUDIT_LOGS = [];
