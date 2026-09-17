// Mock Data for PT Global Transformasi Teknologi (Glotra Technology) Helpdesk Ticketing System

export const ROLES = [
  { id: 1, code: 'ADMIN', name: 'ADMIN / CPIG', badge: 'Admin & Helpdesk', description: 'Kendali penuh tiket, triage laporan, penugasan teknisi, analitik SLA, dan konfigurasi master data' },
  { id: 2, code: 'ENGINEER', name: 'Support Engineer', badge: 'Teknisi NOC', description: 'Pelaksana investigasi teknis, milestone pemulihan, pause SLA, dan resolusi tiket' }
];

export const MOCK_USERS = [
  { id: 1, roleId: 1, roleCode: 'ADMIN', name: 'Ahmad Fauzi', roleTitle: 'System Administrator', email: 'admin@glotratech.com', initials: 'AF', phone: '0811-9988-771', isActive: true },
  { id: 2, roleId: 1, roleCode: 'ADMIN', name: 'Rina Anggraini', roleTitle: 'CPIG / Helpdesk Lead', email: 'rina.cpig@glotratech.com', initials: 'RA', phone: '0812-8877-662', isActive: true },
  { id: 3, roleId: 2, roleCode: 'ENGINEER', name: 'Budi Santoso', roleTitle: 'Lead SysOps Engineer', email: 'budi.eng@glotratech.com', initials: 'BS', phone: '0813-7766-553', isActive: true },
  { id: 4, roleId: 2, roleCode: 'ENGINEER', name: 'Dwi Prasetyo', roleTitle: 'Storage & Backup Specialist', email: 'dwi.eng@glotratech.com', initials: 'DP', phone: '0813-5544-332', isActive: true },
  { id: 5, roleId: 1, roleCode: 'ADMIN', name: 'Ir. Hendra Gunawan', roleTitle: 'Service Operations Manager', email: 'hendra.head@glotratech.com', initials: 'HG', phone: '0811-3322-110', isActive: true }
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

export const ON_DUTY_ROSTER = [
  { id: 1, name: 'Budi Santoso', role: 'Lead SysOps Engineer', initials: 'BS', activeCount: 6, status: 'Optimal Load', statusColor: 'emerald' },
  { id: 2, name: 'Dwi Prasetyo', role: 'Storage & Backup Spec.', initials: 'DP', activeCount: 5, status: 'Ready', statusColor: 'blue' },
  { id: 3, name: 'Rizky Pratama', role: 'Network Infrastructure', initials: 'RP', activeCount: 4, status: 'Ready', statusColor: 'blue' },
  { id: 4, name: 'Hendra Kusuma', role: 'Virtualization Escalation', initials: 'HK', activeCount: 7, status: 'Heavy Load', statusColor: 'amber' }
];

export const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: 'PT Bank Central Asia Tbk',
    code: 'BCA',
    industry: 'Perbankan / Finansial',
    serviceContract: 'PKS Layanan Managed Service 24x7',
    contractSla: 'SLA-PLATINUM-2026',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'CKR-PROD-01',
    environment: 'PROD-DC-01',
    address: 'Menara BCA Lt. 28, Jl. M.H. Thamrin No. 1, Jakarta Pusat',
    isActive: true,
    pics: [
      { id: 101, name: 'Bpk. Kevin Pratama', phone: '0812-1122-3344', email: 'kevin.p@bca.co.id', dept: 'IT Infrastructure' },
      { id: 102, name: 'Ibu Sarah Dewi', phone: '0812-5566-7788', email: 'sarah.d@bca.co.id', dept: 'Core Banking Ops' }
    ]
  },
  {
    id: 2,
    name: 'Dinas Komunikasi & Informatika Prov. Banten',
    code: 'DISKOMINFO',
    industry: 'Pemerintahan / Publik',
    serviceContract: 'PKS Pemeliharaan Jaringan & Data Center 24x7',
    contractSla: 'SLA-GOLD-2026',
    slaTier: '24x7 GOLD PUBLIC SECTOR',
    slaCoverage: 'First Touch: 1h • Resolusi: 8h',
    cluster: 'BTN-KP3B-01',
    environment: 'PROD-DC-BANTEN',
    address: 'Kawasan Pusat Pemerintahan Provinsi Banten (KP3B), Serang',
    isActive: true,
    pics: [
      { id: 103, name: 'Bpk. Joko Susilo, M.Kom', phone: '0813-9988-1122', email: 'joko.s@bantenprov.go.id', dept: 'Jaringan & Data Center' }
    ]
  },
  {
    id: 3,
    name: 'RS Siloam Hospital Group',
    code: 'SILOAM',
    industry: 'Kesehatan / Rumah Sakit',
    serviceContract: 'PKS Dukungan Aplikasi & Server 24x7',
    contractSla: 'SLA-PLATINUM-2026',
    slaTier: '24x7 HEALTHCARE CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'SLM-HOSP-02',
    environment: 'PROD-HEALTH-01',
    address: 'Jl. Siloam No. 6, Lippo Karawaci, Tangerang',
    isActive: true,
    pics: [
      { id: 104, name: 'dr. Andi Wijaya / IT Lead', phone: '0815-4433-2211', email: 'andi.w@siloam.com', dept: 'Hospital Info System (HIS)' }
    ]
  },
  {
    id: 4,
    name: 'PT Astra International Tbk',
    code: 'ASTRA',
    industry: 'Otomotif & Korporasi',
    serviceContract: 'PKS Managed IT Support 24x7',
    contractSla: 'SLA-SILVER-2026',
    slaTier: '8x5 SILVER ENTERPRISE',
    slaCoverage: 'First Touch: 2h • Resolusi: 12h',
    cluster: 'AST-HQ-01',
    environment: 'PROD-CORP-01',
    address: 'Menara Astra, Jl. Jend. Sudirman Kav. 5-6, Jakarta',
    isActive: true,
    pics: [
      { id: 105, name: 'Bpk. Dimas Ramadhan', phone: '0817-2233-4455', email: 'dimas.r@astra.co.id', dept: 'Network & Cloud Security' }
    ]
  }
];

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

export const INITIAL_TICKETS = [
  {
    id: 1,
    ticketNumber: 'TICK-20260913-0001',
    customerId: 1,
    customerPicId: 101,
    categoryId: 1,
    severity: 'HIGH',
    channel: 'WHATSAPP',
    title: 'Server Core Transaction BCA Cabang Thamrin Unreachable',
    rawMessage: 'Pagi tim GTT, mohon bantuannya server core transaction di cabang Thamrin tiba2 offline tidak bisa diakses sama sekali sejak 15 menit lalu, antrean teller terhambat urgent ya!',
    description: 'Customer reported that VMware datastore became inaccessible following scheduled SAN controller firmware health checks on enterprise storage matrix. Multiple production VMs unready.',
    status: 'IN_PROGRESS',
    trackingToken: 'sec_bca_9912a7f8',
    createdById: 2,
    assignedToId: 3,
    
    // Enterprise Contract & Architecture Scope (Figma Spec)
    contractSla: 'SLA-PLATINUM-2026',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'CKR-PROD-01',
    environment: 'PROD-DC-01',
    impactScope: 'Critical Workloads (Core Banking Offline)',
    isWhatsAppSync: true,
    isProposeKb: true,

    // Technology Principal Integration (L3 OEM Support - Figma Spec)
    principalVendor: 'Hewlett Packard Enterprise Global Support Desk',
    principalCaseId: 'HPE-2026-004821',
    principalSpecialist: 'Marcus Vance (HPE Storage L3)',
    principalBridgeStatus: 'Connected via HPE InfoSight API',
    principalLatestUpdate: 'HPE Support analyzed controller B core dump logs; transient PCIe bus assertion detected on Node 1 midplane bus interface. Recommended NVRAM battery status verification and selective cache invalidation prior to re-enabling automatic failback.',
    principalUpdateTimestamp: '11:38 WIB',

    createdAt: '2026-09-13T03:15:00.000Z',
    updatedAt: '2026-09-13T04:30:00.000Z',
    responseDeadline: '2026-09-13T03:45:00.000Z',
    resolutionDeadline: '2026-09-13T07:15:00.000Z',
    respondedAt: '2026-09-13T03:25:00.000Z',
    resolvedAt: null,
    closedAt: null,
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Transient PCIe interconnect bus stall between Controller Node 0 and Node 1 triggered sudden failover while sync threshold sat at 88%, resulting in host path timeout prior to full NVRAM mirroring reconciliation.',
    resolutionStrategy: 'Rebalance FC host paths across Fabric 1, clear stalled cache unmap operations via HPE CLI command line, and trigger targeted rescan on ESXi host storage adapters to re-mount production datastore.',
    actionTaken: 'Analisis core dump controller B, rebalance path FC fabric 1, dan koordinasi dengan HPE Enterprise Support.',
    resolutionNotes: 'Datastore LUN berhasil dimount ulang dan VM production operational kembali.',
    recommendation: 'Upgrade firmware controller ke patch SP4 stabil dan jadwalkan maintenance window penggantian riser PCIe.',
    
    attachments: [
      {
        id: 'att-101',
        name: 'whatsapp-chat-kendala.svg',
        originalName: 'Screenshot-Chat-BCA-Thamrin.png',
        fileType: 'image/svg+xml',
        size: '245 KB',
        uploadedBy: 'Rina Anggraini (CPIG)',
        uploadedAt: '2026-09-13T03:15:00.000Z',
        source: 'Laporan Awal Customer'
      },
      {
        id: 'att-102',
        name: 'kvm-console-error-log.txt',
        originalName: 'cisco-catalyst-kvm-log.txt',
        fileType: 'text/plain',
        size: '18 KB',
        uploadedBy: 'Budi Santoso (Sr. Engineer)',
        uploadedAt: '2026-09-13T03:45:00.000Z',
        source: 'Investigasi & Diagnosa Lapangan'
      },
      {
        id: 'att-103',
        name: 'cisco-tac-ticket-confirmation.svg',
        originalName: 'Cisco-TAC-Case-CSCO-2026-99120.png',
        fileType: 'image/svg+xml',
        size: '312 KB',
        uploadedBy: 'Budi Santoso (Sr. Engineer)',
        uploadedAt: '2026-09-13T04:30:00.000Z',
        source: 'Eskalasi Principal Cisco TAC'
      }
    ],

    milestones: [
      {
        id: 101,
        stepName: 'Laporan Diterima (Ticket Created)',
        status: 'OPEN',
        actorName: 'Rina Anggraini (CPIG)',
        actorRole: 'CPIG',
        notes: 'Laporan diterima via WhatsApp darurat Bpk. Kevin. Severity diklasifikasikan HIGH.',
        timestampUtc: '2026-09-13T03:15:00.000Z',
        proofFile: null
      },
      {
        id: 102,
        stepName: 'Assignment ke Engineer',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini (CPIG)',
        actorRole: 'CPIG',
        notes: 'Tiket dialokasikan kepada Budi Santoso (Sr. Infrastructure Engineer). Response SLA aman (10 menit).',
        timestampUtc: '2026-09-13T03:25:00.000Z',
        proofFile: null
      },
      {
        id: 103,
        stepName: 'Investigasi & Diagnosa Lapangan',
        status: 'IN_PROGRESS',
        actorName: 'Budi Santoso',
        actorRole: 'ENGINEER',
        notes: 'Akses console KVM berhasil dibuka. Ditemukan port uplink switch Cisco mengalami flap (down/up berulang).',
        timestampUtc: '2026-09-13T03:45:00.000Z',
        proofFile: 'kvm-console-error-log.txt'
      },
      {
        id: 104,
        stepName: 'Eskalasi Vendor & Isolasi Masalah',
        status: 'IN_PROGRESS',
        actorName: 'Budi Santoso',
        actorRole: 'ENGINEER',
        notes: 'Buka case eskalasi ke Cisco TAC #CSCO-2026-99120 untuk penggantian optic transceiver SFP+ port 10.',
        timestampUtc: '2026-09-13T04:30:00.000Z',
        proofFile: 'cisco-tac-ticket-confirmation.png'
      }
    ]
  },
  {
    id: 2,
    ticketNumber: 'TICK-20260913-0002',
    customerId: 3,
    customerPicId: 104,
    categoryId: 3,
    severity: 'MEDIUM',
    channel: 'EMAIL',
    title: 'Siloam Hospital: Web Portal Pasien Error 502 Bad Gateway',
    rawMessage: 'Kepada support GTT, web pendaftaran pasien pagi ini menampilkan layar 502 Bad Gateway sejak jam 09.00 WIB. Mohon dibantu perbaikannya.',
    description: 'Nginx reverse proxy mengembalikan 502 Bad Gateway saat memanggil API backend Node.js.',
    status: 'RESOLVED',
    trackingToken: 'sec_siloam_8834c2d1',
    createdById: 2,
    assignedToId: 4,
    principalName: null,
    principalCaseId: null,
    
    createdAt: '2026-09-13T02:00:00.000Z',
    updatedAt: '2026-09-13T05:10:00.000Z',
    responseDeadline: '2026-09-13T03:00:00.000Z',
    resolutionDeadline: '2026-09-13T10:00:00.000Z',
    respondedAt: '2026-09-13T02:20:00.000Z',
    resolvedAt: '2026-09-13T05:10:00.000Z',
    closedAt: null,
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Service PM2 backend mengalami Out Of Memory (OOM) karena memory leak pada query reporting besar.',
    actionTaken: 'Menaikkan batas memory PM2 max_memory_restart menjadi 2G, merestart cluster, dan menambahkan indexing query pasien.',
    resolutionNotes: 'Web portal kembali online stabil. HTTP 200 OK diuji coba pada 10 request beruntun.',
    recommendation: 'Optimasi query SQL pada modul reporting pasien lama agar tidak memakan RAM berlebihan.',
    
    attachments: [
      {
        id: 'att-201',
        name: 'error-502-bad-gateway.svg',
        originalName: 'screenshot-error-502-siloam.png',
        fileType: 'image/svg+xml',
        size: '180 KB',
        uploadedBy: 'Rina Anggraini (CPIG)',
        uploadedAt: '2026-09-13T02:00:00.000Z',
        source: 'Laporan Awal Customer'
      },
      {
        id: 'att-202',
        name: 'ping-http200-proof.svg',
        originalName: 'curl-http200-benchmark-test.png',
        fileType: 'image/svg+xml',
        size: '195 KB',
        uploadedBy: 'Dewi Paramita (System Engineer)',
        uploadedAt: '2026-09-13T05:10:00.000Z',
        source: 'Bukti Verifikasi Pemulihan Layanan'
      }
    ],

    milestones: [
      {
        id: 201,
        stepName: 'Laporan Diterima via Email',
        status: 'OPEN',
        actorName: 'Rina Anggraini (CPIG)',
        actorRole: 'CPIG',
        notes: 'Tiket dibuat dari email dr. Andi Siloam.',
        timestampUtc: '2026-09-13T02:00:00.000Z',
        proofFile: null
      },
      {
        id: 202,
        stepName: 'Penugasan Teknisi',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini (CPIG)',
        actorRole: 'CPIG',
        notes: 'Diserahkan kepada Dwi Prasetyo.',
        timestampUtc: '2026-09-13T02:20:00.000Z',
        proofFile: null
      },
      {
        id: 203,
        stepName: 'Penyelidikan & Restart Cluster',
        status: 'IN_PROGRESS',
        actorName: 'Dwi Prasetyo',
        actorRole: 'ENGINEER',
        notes: 'Log PM2 menunjukkan error JavaScript heap out of memory.',
        timestampUtc: '2026-09-13T03:10:00.000Z',
        proofFile: 'pm2-oom-log.png'
      },
      {
        id: 204,
        stepName: 'Solusi Berhasil Diterapkan (RESOLVED)',
        status: 'RESOLVED',
        actorName: 'Dwi Prasetyo',
        actorRole: 'ENGINEER',
        notes: 'Layanan pulih total. SLA resolution berhenti. Menunggu konfirmasi customer / auto-close 3 hari.',
        timestampUtc: '2026-09-13T05:10:00.000Z',
        proofFile: 'ping-http200-proof.png'
      }
    ]
  },
  {
    id: 3,
    ticketNumber: 'TICK-20260912-0045',
    customerId: 2,
    customerPicId: 103,
    categoryId: 2,
    severity: 'LOW',
    channel: 'WHATSAPP',
    title: 'Diskominfo Banten: Permintaan Konfigurasi Routing Subnet Baru Gedung B',
    rawMessage: 'Siang mas, ada permohonan route subnet VLAN 192.168.50.0/24 untuk lab komputer baru.',
    description: 'Penambahan konfigurasi IP address & routing table di core router Mikrotik CCR.',
    status: 'CLOSED',
    trackingToken: 'sec_diskominfo_7712e4b3',
    createdById: 2,
    assignedToId: 4,
    principalName: null,
    principalCaseId: null,
    
    createdAt: '2026-09-12T04:00:00.000Z',
    updatedAt: '2026-09-12T09:00:00.000Z',
    responseDeadline: '2026-09-12T06:00:00.000Z',
    resolutionDeadline: '2026-09-12T16:00:00.000Z',
    respondedAt: '2026-09-12T04:30:00.000Z',
    resolvedAt: '2026-09-12T08:00:00.000Z',
    closedAt: '2026-09-12T09:00:00.000Z',
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Permintaan change request standar (bukan insiden kerusakan).',
    actionTaken: 'Tambahkan VLAN 50 di router CCR, setting DHCP pool dan firewall nat bypass.',
    resolutionNotes: 'Subnet baru sudah bisa ping ke gateway dan internet.',
    recommendation: 'Dokumentasikan alokasi IP di IPAM spreadsheet Diskominfo.',
    
    attachments: [
      {
        id: 'att-301',
        name: 'kvm-console-error-log.txt',
        originalName: 'vlan50-mikrotik-export.rsc',
        fileType: 'text/plain',
        size: '12 KB',
        uploadedBy: 'Dwi Prasetyo (Engineer)',
        uploadedAt: '2026-09-12T08:00:00.000Z',
        source: 'Konfigurasi VLAN & Routing Proof'
      }
    ],

    milestones: [
      {
        id: 301,
        stepName: 'Tiket Dibuat',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Change request baru diterima.',
        timestampUtc: '2026-09-12T04:00:00.000Z',
        proofFile: null
      },
      {
        id: 302,
        stepName: 'Konfigurasi Selesai',
        status: 'RESOLVED',
        actorName: 'Dwi Prasetyo',
        actorRole: 'ENGINEER',
        notes: 'Route VLAN 50 aktif.',
        timestampUtc: '2026-09-12T08:00:00.000Z',
        proofFile: null
      },
      {
        id: 303,
        stepName: 'Konfirmasi Customer & Tiket Ditutup',
        status: 'CLOSED',
        actorName: 'Bpk. Joko (PIC Diskominfo)',
        actorRole: 'CUSTOMER',
        notes: 'Customer konfirmasi via WA lab sudah bisa internetan. Tiket ditutup.',
        timestampUtc: '2026-09-12T09:00:00.000Z',
        proofFile: null
      }
    ]
  }
];

export const MOCK_KNOWLEDGE_BASE = [
  {
    id: 1,
    ticketReferenceId: 2,
    ticketNumber: 'TICK-20260913-0002',
    title: 'Penanganan Service PM2 Node.js Error 502 Bad Gateway (OOM)',
    categoryId: 3,
    categoryName: 'Database & Applications',
    author: 'Dwi Prasetyo',
    status: 'PUBLISHED',
    source: 'Dari Tiket Resolved TICK-20260913-0002',
    symptom: 'Nginx menampilkan error 502 Bad Gateway, log pm2 menunjukkan out of memory exception.',
    rootCause: 'Node.js memory heap mencapai batas default (1.4 GB) akibat unpaginated query.',
    resolutionSteps: '1. Periksa log pm2 logs --lines 100\n2. Naikkan max-memory-restart di ecosystem.config.js menjadi 2048M\n3. Restart pm2 restart all\n4. Tambahkan limit & offset pagination pada query database.',
    recommendation: 'Terapkan monitoring memory alert di Grafana jika RAM nodejs > 80%.',
    createdAt: '2026-09-13T06:00:00.000Z'
  },
  {
    id: 2,
    ticketReferenceId: 1,
    ticketNumber: 'TICK-20260913-0001',
    title: 'Troubleshooting Link Flapping pada Port SFP+ Switch Cisco Catalyst',
    categoryId: 2,
    categoryName: 'Network & Connectivity',
    author: 'Budi Santoso',
    status: 'DRAFT',
    source: 'Kandidat Pengajuan Tiket TICK-20260913-0001',
    symptom: 'Interface TenGigabitEthernet berstatus down/up secara konstan setiap 30 detik.',
    rootCause: 'Transceiver modul optik kotor atau power optic dBm drop di bawah ambang batas (-18 dBm).',
    resolutionSteps: '1. Jalankan command: show int transceiver detail\n2. Bersihkan konektor fiber optik LC dengan pen cleaner\n3. Ganti modul SFP jika Tx/Rx power tidak terbaca.',
    recommendation: 'Sediakan spare optic 10G LR di rak data center.',
    createdAt: '2026-09-13T06:30:00.000Z'
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 1,
    userName: 'Rina Anggraini (CPIG)',
    role: 'CPIG',
    action: 'TICKET_CREATED',
    entityType: 'TICKET',
    entityId: 'TICK-20260913-0001',
    description: 'Membuat tiket baru via Quick Ingestion WhatsApp untuk customer PT Bank Central Asia Tbk',
    ipAddress: '192.168.10.45',
    timestampUtc: '2026-09-13T03:15:00.000Z'
  },
  {
    id: 2,
    userName: 'Rina Anggraini (CPIG)',
    role: 'CPIG',
    action: 'ASSIGN_ENGINEER',
    entityType: 'TICKET',
    entityId: 'TICK-20260913-0001',
    description: 'Menugaskan tiket TICK-20260913-0001 kepada Budi Santoso (Sr. Engineer)',
    ipAddress: '192.168.10.45',
    timestampUtc: '2026-09-13T03:25:00.000Z'
  },
  {
    id: 3,
    userName: 'Budi Santoso',
    role: 'ENGINEER',
    action: 'STATUS_CHANGED',
    entityType: 'TICKET',
    entityId: 'TICK-20260913-0001',
    description: 'Mengubah status tiket dari ASSIGNED menjadi IN_PROGRESS dan menambah milestone investigasi',
    ipAddress: '192.168.10.88',
    timestampUtc: '2026-09-13T03:45:00.000Z'
  },
  {
    id: 4,
    userName: 'Dwi Prasetyo',
    role: 'ENGINEER',
    action: 'STATUS_CHANGED_RESOLVED',
    entityType: 'TICKET',
    entityId: 'TICK-20260913-0002',
    description: 'Menyelesaikan tiket TICK-20260913-0002. Timer SLA Resolution resmi dihentikan.',
    ipAddress: '192.168.10.89',
    timestampUtc: '2026-09-13T05:10:00.000Z'
  }
];
