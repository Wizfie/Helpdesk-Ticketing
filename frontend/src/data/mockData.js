// Realistic Enterprise Mock Data for PT Global Transformasi Teknologi (Glotra Technology) Helpdesk Ticketing System
// Aligned with 8 Figma Frames & ITIL Enterprise Service Desk Standards

export const ROLES = [
  { id: 1, code: 'ADMIN', name: 'ADMIN / CPIG', badge: 'Admin & Helpdesk', description: 'Kendali penuh tiket, triage laporan, penugasan teknisi, analitik SLA, dan konfigurasi master data' },
  { id: 2, code: 'ENGINEER', name: 'Support Engineer', badge: 'Teknisi NOC', description: 'Pelaksana investigasi teknis, milestone pemulihan, pause SLA, dan resolusi tiket' }
];

export const MOCK_USERS = [
  { id: 1, roleId: 1, roleCode: 'ADMIN', name: 'Ahmad Fauzi', roleTitle: 'System Administrator', email: 'admin@glotratech.com', initials: 'AF', phone: '0811-9988-771', isActive: true },
  { id: 2, roleId: 1, roleCode: 'ADMIN', name: 'Rina Anggraini', roleTitle: 'CPIG / Operations Lead', email: 'rina.cpig@glotratech.com', initials: 'RA', phone: '0812-8877-662', isActive: true },
  { id: 3, roleId: 1, roleCode: 'ADMIN', name: 'Ir. Hendra Gunawan', roleTitle: 'Service Operations Manager', email: 'hendra.head@glotratech.com', initials: 'HG', phone: '0811-3322-110', isActive: true },
  { id: 4, roleId: 2, roleCode: 'ENGINEER', name: 'Budi Santoso', roleTitle: 'Lead SysOps & SAN Specialist', email: 'budi.eng@glotratech.com', initials: 'BS', phone: '0813-7766-553', isActive: true },
  { id: 5, roleId: 2, roleCode: 'ENGINEER', name: 'Dwi Prasetyo', roleTitle: 'Storage & Backup Specialist', email: 'dwi.eng@glotratech.com', initials: 'DP', phone: '0813-5544-332', isActive: true },
  { id: 6, roleId: 2, roleCode: 'ENGINEER', name: 'Rizky Pratama', roleTitle: 'Network Infrastructure Specialist', email: 'rizky.eng@glotratech.com', initials: 'RP', phone: '0812-4455-667', isActive: true },
  { id: 7, roleId: 2, roleCode: 'ENGINEER', name: 'Hendra Kusuma', roleTitle: 'Virtualization Escalation Engineer', email: 'hendra.eng@glotratech.com', initials: 'HK', phone: '0815-9988-223', isActive: true },
  { id: 8, roleId: 2, roleCode: 'ENGINEER', name: 'Ismat Yulian', roleTitle: 'Senior Enterprise Storage Specialist', email: 'ismat.eng@glotratech.com', initials: 'IY', phone: '0813-2211-994', isActive: true }
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
  { id: 4, name: 'Budi Santoso', role: 'Lead SysOps Engineer', initials: 'BS', activeCount: 6, status: 'Optimal Load', statusColor: 'emerald' },
  { id: 5, name: 'Dwi Prasetyo', role: 'Storage & Backup Spec.', initials: 'DP', activeCount: 5, status: 'Ready', statusColor: 'blue' },
  { id: 6, name: 'Rizky Pratama', role: 'Network Infrastructure', initials: 'RP', activeCount: 4, status: 'Ready', statusColor: 'blue' },
  { id: 7, name: 'Hendra Kusuma', role: 'Virtualization Escalation', initials: 'HK', activeCount: 7, status: 'Heavy Load', statusColor: 'amber' },
  { id: 8, name: 'Ismat Yulian', role: 'Senior Storage Engineer', initials: 'IY', activeCount: 3, status: 'Available', statusColor: 'emerald' }
];

export const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: 'PT Bank Central Asia Tbk',
    code: 'BCA',
    industry: 'Perbankan & Jasa Keuangan',
    serviceContract: 'PKS Layanan Managed Service 24x7 Mission Critical',
    contractSla: 'SLA-PLATINUM-2026',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'HaloBCA Cikarang Data Center Tier IV',
    environment: 'PROD-DC-01',
    address: 'Menara BCA Grand Indonesia Lt. 28, Jl. M.H. Thamrin No. 1, Jakarta Pusat',
    isActive: true,
    pics: [
      { id: 101, name: 'Bpk. Kevin Pratama', phone: '0812-1122-3344', email: 'kevin.pratama@bca.co.id', dept: 'IT Infrastructure & DC Operations' },
      { id: 102, name: 'Ibu Sarah Dewi', phone: '0812-5566-7788', email: 'sarah.dewi@bca.co.id', dept: 'Core Banking Operations Lead' }
    ]
  },
  {
    id: 2,
    name: 'PT Astra Honda Motor',
    code: 'AHM',
    industry: 'Manufaktur Otomotif',
    serviceContract: 'PKS Managed Storage & Industrial IT Support 8x5',
    contractSla: 'SLA-GOLD-2026',
    slaTier: '8x5 GOLD INDUSTRIAL SLA',
    slaCoverage: 'First Touch: 30m • Resolusi: 8h',
    cluster: 'Plant 3 Cikarang DC Cluster',
    environment: 'PROD-PLANT-03',
    address: 'Kawasan Industri MM2100 Blok DD No. 1, Cikarang Barat, Bekasi',
    isActive: true,
    pics: [
      { id: 103, name: 'Bpk. Dimas Setiawan', phone: '0811-9928-1102', email: 'dimas.setiawan@ahm.astra.co.id', dept: 'IT Operations & Plant Systems' },
      { id: 104, name: 'Bpk. Rahmat Hidayat', phone: '0813-8822-4411', email: 'rahmat.h@ahm.astra.co.id', dept: 'Plant Automation & SCADA' }
    ]
  },
  {
    id: 3,
    name: 'RS Siloam Hospitals Group',
    code: 'SILOAM',
    industry: 'Kesehatan & Layanan Rumah Sakit',
    serviceContract: 'PKS Pemeliharaan Server & Critical HIS 24x7',
    contractSla: 'SLA-PLATINUM-2026',
    slaTier: '24x7 HEALTHCARE CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'Siloam Core Hospital Information System (HIS)',
    environment: 'PROD-HEALTH-01',
    address: 'Jl. Siloam No. 6, Lippo Karawaci 1600, Tangerang, Banten',
    isActive: true,
    pics: [
      { id: 105, name: 'dr. Andi Wijaya / IT Lead', phone: '0815-4433-2211', email: 'andi.wijaya@siloam.com', dept: 'Hospital Information System (HIS)' },
      { id: 106, name: 'Ibu Ratna Paramitha', phone: '0812-7788-9900', email: 'ratna.p@siloam.com', dept: 'Clinical Systems Support' }
    ]
  },
  {
    id: 4,
    name: 'Diskominfo Kota Tangerang Selatan',
    code: 'DISKOMINFO',
    industry: 'Pemerintahan / Publik',
    serviceContract: 'PKS Dukungan Data Center & Jaringan Publik 8x5',
    contractSla: 'SLA-GOV-2026',
    slaTier: 'GOVERNMENT TIER-1 (8x5)',
    slaCoverage: 'First Touch: 1h • Resolusi: 12h',
    cluster: 'Data Center Balai Kota Pamulang Node-A',
    environment: 'PROD-DC-TANGSEL',
    address: 'Jl. Maruga Raya No. 1, Serua, Ciputat, Kota Tangerang Selatan',
    isActive: true,
    pics: [
      { id: 107, name: 'Bpk. Joko Susilo, M.Kom', phone: '0813-9988-1122', email: 'joko.susilo@tangerangselatankota.go.id', dept: 'Jaringan & Data Center' },
      { id: 108, name: 'Bpk. Tri Wahyudi', phone: '0818-4455-1122', email: 'tri.wahyudi@tangerangselatankota.go.id', dept: 'Aplikasi Informatika' }
    ]
  },
  {
    id: 5,
    name: 'PT Telekomunikasi Selular',
    code: 'TELKOMSEL',
    industry: 'Telekomunikasi Selular & ISP',
    serviceContract: 'PKS Support NOC Infrastructure & Database 24x7',
    contractSla: 'SLA-PLATINUM-2026',
    slaTier: '24x7 PLATINUM TELCO CARRIER',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'Telkomsel Core NOC BSD City Tier IV',
    environment: 'PROD-TELCO-01',
    address: 'Telkomsel Smart Office, Jl. Jend. Gatot Subroto Kav. 52, Jakarta Selatan',
    isActive: true,
    pics: [
      { id: 109, name: 'Bpk. Faisal Akbar', phone: '0811-8899-001', email: 'faisal_akbar@telkomsel.co.id', dept: 'Core Network Operations' },
      { id: 110, name: 'Ibu Nindy Anggraini', phone: '0812-9900-112', email: 'nindy_a@telkomsel.co.id', dept: 'Billing & Mediation Systems' }
    ]
  },
  {
    id: 6,
    name: 'PT Bank Mandiri (Persero) Tbk',
    code: 'MANDIRI',
    industry: 'Perbankan BUMN',
    serviceContract: 'PKS Enterprise Storage & Backup System 24x7',
    contractSla: 'SLA-PLATINUM-2026',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'Plaza Mandiri Data Center Gatot Subroto',
    environment: 'PROD-MND-01',
    address: 'Plaza Mandiri Lt. 14, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta Selatan',
    isActive: true,
    pics: [
      { id: 111, name: 'Bpk. Aditya Nugraha', phone: '0812-3344-5566', email: 'aditya.nugraha@bankmandiri.co.id', dept: 'Enterprise Storage & SAN' }
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
  // 1. Ticket #1 - High Severity In Progress (Figma Frame 02 Primary Reference)
  {
    id: 1,
    ticketNumber: 'TICK-20260913-0001',
    customerId: 2,
    customerPicId: 103,
    categoryId: 1,
    severity: 'HIGH',
    channel: 'PORTAL',
    title: 'HPE 3PAR Storage Controller Node 0 Offline & Host Multipath Failover',
    rawMessage: 'Peringatan otomatis dari monitoring HPE InfoSight: Controller Node 0 pada array 3PAR Primera Plant 3 berstatus Degraded/Offline. Terjadi failover host path ke Node 1.',
    description: 'Customer reported that VMware datastore experienced path latency spikes following scheduled SAN controller failover. Controller Node 0 degraded after PCIe unmap queue burst.',
    status: 'IN_PROGRESS',
    trackingToken: 'sec_ahm_9912a7f8',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    
    // Architecture Specs
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'Plant 3 Cikarang DC Cluster',
    environment: 'PROD-PLANT-03',
    impactScope: 'Production ERP & Assembly SCADA Datastores',
    isEmailSync: true,
    isProposeKb: true,

    // Technology Principal Integration (L3 OEM Support)
    principalVendor: 'Hewlett Packard Enterprise Global Support Desk',
    principalCaseId: 'HPE-2026-004821',
    principalSpecialist: 'Marcus Vance (HPE Storage L3 Specialist)',
    principalBridgeStatus: 'Connected via HPE InfoSight API',
    principalLatestUpdate: 'HPE Support analyzed controller B core dump logs; transient PCIe bus assertion detected on Node 1 midplane bus interface. Recommended NVRAM battery status verification and selective cache invalidation prior to re-enabling automatic failback.',
    principalUpdateTimestamp: '11:38 WIB',

    createdAt: '2026-09-13T03:15:00.000Z',
    updatedAt: '2026-09-13T04:30:00.000Z',
    responseDeadline: '2026-09-13T03:45:00.000Z',
    resolutionDeadline: '2026-09-13T11:15:00.000Z',
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
        name: 'controller_status.png',
        originalName: 'hpe-3par-node0-status.png',
        fileType: 'image/svg+xml',
        size: '284 KB',
        uploadedBy: 'Rina Anggraini (CPIG)',
        uploadedAt: '2026-09-13T03:15:00.000Z',
        source: 'Laporan Awal Monitoring Alert'
      },
      {
        id: 'att-102',
        name: 'vmkernel_dmesg.log',
        originalName: 'vmkernel-storage-path.log',
        fileType: 'text/plain',
        size: '42 KB',
        uploadedBy: 'Budi Santoso (Lead SysOps)',
        uploadedAt: '2026-09-13T03:45:00.000Z',
        source: 'Investigasi Host ESXi Storage Log'
      }
    ],

    milestones: [
      {
        id: 101,
        stepName: 'Laporan Masuk & Verifikasi Telemetri Awal',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Alert otomatis diterima dari sistem monitoring AHM Plant 3. Klasifikasi Severity HIGH, tiket diterbitkan.',
        timestampUtc: '2026-09-13T03:15:00.000Z',
        proofFile: null
      },
      {
        id: 102,
        stepName: 'Alokasi Penanganan ke Senior Storage Engineer',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Tiket ditugaskan kepada Budi Santoso (Lead SysOps). SLA Response berhasil dipenuhi dalam 10 menit (Target: 30m).',
        timestampUtc: '2026-09-13T03:25:00.000Z',
        proofFile: null
      },
      {
        id: 103,
        stepName: 'Isolasi Node Degraded & Analisis Core Dump',
        status: 'IN_PROGRESS',
        actorName: 'Budi Santoso',
        actorRole: 'ENGINEER',
        notes: 'Akses SSH ke Service Processor berhasil. Ditemukan Node 0 status Degraded akibat unmap burst latency. Memulai isolasi failover terencana.',
        timestampUtc: '2026-09-13T03:45:00.000Z',
        proofFile: 'vmkernel_dmesg.log'
      },
      {
        id: 104,
        stepName: 'Aktivasi Case Eskalasi Principal HPE L3',
        status: 'IN_PROGRESS',
        actorName: 'Budi Santoso',
        actorRole: 'ENGINEER',
        notes: 'Case dibuka ke HPE Global Desk #HPE-2026-004821. Specialist Marcus Vance mengonfirmasi instruksi clearing cache mirror.',
        timestampUtc: '2026-09-13T04:30:00.000Z',
        proofFile: 'controller_status.png'
      }
    ]
  },

  // 2. Ticket #2 - Pending Vendor SLA Pause (Figma Spec)
  {
    id: 2,
    ticketNumber: 'TICK-20260913-0002',
    customerId: 3,
    customerPicId: 105,
    categoryId: 1,
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'VMware ESXi 8.0 Diagnostic Purple Screen (PSOD) on Hospital HIS Host-03',
    rawMessage: 'Yth. Support GTT, Host physical node 3 pada cluster vSphere RS Siloam Karawaci mendadak PSOD dengan kode exception qfle3 driver. VM database ter-restart oleh HA.',
    description: 'Physical ESXi host experienced kernel panic purple screen. Host isolation occurred and vSphere HA successfully restarted 14 critical clinical VMs on adjacent nodes.',
    status: 'PENDING_VENDOR',
    trackingToken: 'sec_siloam_8834c2d1',
    createdById: 2,
    assignedToId: 7, // Hendra Kusuma
    
    contractSla: 'SLA-PLATINUM-2026',
    contractTier: '24x7 HEALTHCARE CRITICAL',
    cluster: 'Siloam Core Hospital Information System (HIS)',
    environment: 'PROD-HEALTH-01',
    impactScope: 'Host Capacity Degraded (Cluster HA Active)',
    isEmailSync: true,
    isProposeKb: true,

    principalVendor: 'Broadcom VMware Global Support',
    principalCaseId: 'VMW-SR-8849102',
    principalSpecialist: 'Alexander Schmidt (VMware Escalation)',
    principalBridgeStatus: 'Case Active • Engineering Review',
    principalLatestUpdate: 'Vendor VMware menganalisis coredump dump partisi; mengonfirmasi async qfle3 NIC bug. Hotfix patch async VIB sedang dikirimkan via portal customer.',
    principalUpdateTimestamp: '10:15 WIB',

    createdAt: '2026-09-13T02:00:00.000Z',
    updatedAt: '2026-09-13T04:10:00.000Z',
    responseDeadline: '2026-09-13T02:30:00.000Z',
    resolutionDeadline: '2026-09-13T06:00:00.000Z',
    respondedAt: '2026-09-13T02:20:00.000Z',
    resolvedAt: null,
    closedAt: null,
    
    isPaused: true,
    pausedAt: '2026-09-13T03:30:00.000Z',
    totalPausedDurationSec: 3600,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Driver async qfle3 10GbE network controller exception memicu unhandled kernel memory allocation interrupt.',
    resolutionStrategy: 'Menunggu paket hotfix custom VIB dari engineering VMware, kemudian disable module lama dan reboot host.',
    actionTaken: 'Ekstraksi dump file via IPMI iLO, upload coredump ke portal Broadcom VMware, dan penahanan timer SLA resmi.',
    resolutionNotes: 'Timer SLA ditahan (Paused) menunggu rilis patch resmi vendor principal.',
    recommendation: 'Standardisasi image profile seluruh host ESXi menggunakan vSphere Lifecycle Manager (vLCM).',
    
    attachments: [
      {
        id: 'att-201',
        name: 'esxi_psod_backtrace.png',
        originalName: 'esxi-node03-psod-crash.png',
        fileType: 'image/svg+xml',
        size: '310 KB',
        uploadedBy: 'Hendra Kusuma (Engineer)',
        uploadedAt: '2026-09-13T02:40:00.000Z',
        source: 'Tangkapan Layar Konsol IPMI'
      }
    ],

    milestones: [
      {
        id: 201,
        stepName: 'Penerimaan Insiden & Triaging Cepat',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Insiden PSOD dilaporkan dr. Andi Wijaya. SLA Platinum 30 menit dimulai.',
        timestampUtc: '2026-09-13T02:00:00.000Z',
        proofFile: null
      },
      {
        id: 202,
        stepName: 'Penugasan ke Virtualization Escalation Lead',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Dialokasikan kepada Hendra Kusuma. Respon dalam 20 menit.',
        timestampUtc: '2026-09-13T02:20:00.000Z',
        proofFile: null
      },
      {
        id: 203,
        stepName: 'Ekstraksi Coredump & Buka Case VMware SR',
        status: 'IN_PROGRESS',
        actorName: 'Hendra Kusuma',
        actorRole: 'ENGINEER',
        notes: 'Coredump 2.1 GB berhasil diekstrak dan diunggah ke case Broadcom #VMW-SR-8849102.',
        timestampUtc: '2026-09-13T03:00:00.000Z',
        proofFile: 'esxi_psod_backtrace.png'
      },
      {
        id: 204,
        stepName: 'Permintaan Pause SLA (Pending Part/Patch Vendor)',
        status: 'PENDING_VENDOR',
        actorName: 'Hendra Kusuma',
        actorRole: 'ENGINEER',
        notes: 'SLA Clock ditahan resmi sesuai klausul MSA. Menunggu rilis hotfix driver dari VMware Tier-3.',
        timestampUtc: '2026-09-13T03:30:00.000Z',
        proofFile: null
      }
    ]
  },

  // 3. Ticket #3 - Assigned to Dwi Prasetyo
  {
    id: 3,
    ticketNumber: 'TICK-20260913-0003',
    customerId: 1,
    customerPicId: 101,
    categoryId: 2,
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'Core Banking SAN Switch Brocade G620 FC Port 14 CRC Error & Flapping',
    rawMessage: 'Monitoring Fabric SAN BCA mendeteksi alarm Rx Power attenuation pada Port 14 Brocade Switch G620 Fabric-A. SFP terindikasi degradasi.',
    description: 'SAN Optical link reporting severe frame CRC discards and credit loss warnings, impacting backup bandwidth throughput to secondary data lake.',
    status: 'ASSIGNED',
    trackingToken: 'sec_bca_7712bb90',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo
    
    contractSla: 'SLA-PLATINUM-2026',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'HaloBCA Cikarang Data Center Tier IV',
    environment: 'PROD-DC-01',
    impactScope: 'Fabric SAN Throughput Redundancy',
    isEmailSync: true,
    isProposeKb: false,

    principalVendor: 'Brocade / Broadcom Fabric Support',
    principalCaseId: 'BRCD-2026-9021',
    principalSpecialist: 'NOC On-Call Support',
    principalBridgeStatus: 'Standby',
    principalLatestUpdate: null,
    principalUpdateTimestamp: null,

    createdAt: '2026-09-13T04:00:00.000Z',
    updatedAt: '2026-09-13T04:15:00.000Z',
    responseDeadline: '2026-09-13T04:30:00.000Z',
    resolutionDeadline: '2026-09-13T08:00:00.000Z',
    respondedAt: '2026-09-13T04:15:00.000Z',
    resolvedAt: null,
    closedAt: null,
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: null,
    resolutionStrategy: null,
    actionTaken: 'Tiket telah dialokasikan ke teknisi; sedang persiapan pengecekan optical power dBm via command sfpshow di lokasi DC.',
    resolutionNotes: null,
    recommendation: null,
    
    attachments: [],
    milestones: [
      {
        id: 301,
        stepName: 'Tiket Diterbitkan dari Email Monitoring BCA',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Tiket P1 High Severity dibuat untuk Fabric Brocade.',
        timestampUtc: '2026-09-13T04:00:00.000Z',
        proofFile: null
      },
      {
        id: 302,
        stepName: 'Penugasan ke Dwi Prasetyo',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Dialokasikan kepada teknisi storage & SAN. First response met dalam 15 menit.',
        timestampUtc: '2026-09-13T04:15:00.000Z',
        proofFile: null
      }
    ]
  },

  // 4. Ticket #4 - Open & Unassigned (Needs Dispatch)
  {
    id: 4,
    ticketNumber: 'TICK-20260913-0004',
    customerId: 5,
    customerPicId: 110,
    categoryId: 3,
    severity: 'HIGH',
    channel: 'PORTAL',
    title: 'Billing Database PostgreSQL Read Replica Replication Lag Exceeding 900s',
    rawMessage: 'Alert Telemetri: PostgreSQL cluster billing mediation Telkomsel node slave mengalami replication delay 940 detik. Query reporting transaksi pelanggan tertunda.',
    description: 'PostgreSQL wal receiver thread reporting I/O bottleneck on shared storage mount during peak batch CDR billing calculation window.',
    status: 'OPEN',
    trackingToken: 'sec_tsel_1188aa44',
    createdById: 2,
    assignedToId: null, // UNASSIGNED!
    
    contractSla: 'SLA-PLATINUM-2026',
    contractTier: '24x7 PLATINUM TELCO CARRIER',
    cluster: 'Telkomsel Core NOC BSD City Tier IV',
    environment: 'PROD-TELCO-01',
    impactScope: 'Customer CDR Billing Real-time Sync',
    isEmailSync: true,
    isProposeKb: false,

    principalVendor: null,
    principalCaseId: null,
    principalSpecialist: null,
    principalBridgeStatus: 'Not Connected',
    principalLatestUpdate: null,
    principalUpdateTimestamp: null,

    createdAt: '2026-09-13T04:35:00.000Z',
    updatedAt: '2026-09-13T04:35:00.000Z',
    responseDeadline: '2026-09-13T05:05:00.000Z',
    resolutionDeadline: '2026-09-13T08:35:00.000Z',
    respondedAt: null,
    resolvedAt: null,
    closedAt: null,
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: null,
    resolutionStrategy: null,
    actionTaken: 'Tiket baru masuk. Menunggu alokasi dari Admin / CPIG Helpdesk.',
    resolutionNotes: null,
    recommendation: null,
    
    attachments: [],
    milestones: [
      {
        id: 401,
        stepName: 'Tiket Diterbitkan Melalui Customer Portal',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Tiket masuk kategori Database & Applications. Menunggu penugasan teknisi database on-duty.',
        timestampUtc: '2026-09-13T04:35:00.000Z',
        proofFile: null
      }
    ]
  },

  // 5. Ticket #5 - Resolved Ticket (Diskominfo Tangsel)
  {
    id: 5,
    ticketNumber: 'TICK-20260912-0001',
    customerId: 4,
    customerPicId: 107,
    categoryId: 3,
    severity: 'MEDIUM',
    channel: 'EMAIL',
    title: 'Diskominfo Tangsel: Portal Layanan Publik 502 Bad Gateway Pasca Patch Kernel',
    rawMessage: 'Selamat siang tim GTT, portal perizinan publik Tangsel tidak bisa diakses dan menampilkan pesan Nginx 502 Bad Gateway setelah restart berkala tadi subuh.',
    description: 'Systemd service php8.2-fpm failed to bind to UNIX socket /run/php/php8.2-fpm.sock due to permission mismatch following automated OS kernel update.',
    status: 'RESOLVED',
    trackingToken: 'sec_tng_4433bb11',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo
    
    contractSla: 'SLA-GOV-2026',
    contractTier: 'GOVERNMENT TIER-1 (8x5)',
    cluster: 'Data Center Balai Kota Pamulang Node-A',
    environment: 'PROD-DC-TANGSEL',
    impactScope: 'Portal Perizinan Publik Kota',
    isEmailSync: true,
    isProposeKb: true,

    principalVendor: null,
    principalCaseId: null,
    principalSpecialist: null,
    principalBridgeStatus: 'Not Applicable',
    principalLatestUpdate: null,
    principalUpdateTimestamp: null,

    createdAt: '2026-09-12T01:00:00.000Z',
    updatedAt: '2026-09-12T04:20:00.000Z',
    responseDeadline: '2026-09-12T02:00:00.000Z',
    resolutionDeadline: '2026-09-12T13:00:00.000Z',
    respondedAt: '2026-09-12T01:30:00.000Z',
    resolvedAt: '2026-09-12T04:20:00.000Z',
    closedAt: null,
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Ownership directory /run/php berubah menjadi root:root setelah package unattended-upgrade dijalankan.',
    resolutionStrategy: 'Perbaiki permission direktori socket PHP-FPM menjadi www-data:www-data dan aktifkan socket override.',
    actionTaken: 'Menjalankan chown -R www-data:www-data /run/php dan reload nginx systemctl.',
    resolutionNotes: 'Portal perizinan telah kembali responsif dengan status HTTP 200 OK. Respon SLA dan Resolusi SLA berhasil dipenuhi.',
    recommendation: 'Nonaktifkan automated reboot pada server produksi dan terapkan canary staging testing.',
    
    attachments: [
      {
        id: 'att-501',
        name: 'nginx_error_502.log',
        originalName: 'nginx-php-socket-error.log',
        fileType: 'text/plain',
        size: '14 KB',
        uploadedBy: 'Dwi Prasetyo (Engineer)',
        uploadedAt: '2026-09-12T02:00:00.000Z',
        source: 'Investigasi Nginx Log'
      }
    ],

    milestones: [
      {
        id: 501,
        stepName: 'Laporan Diterima dari Bpk. Joko Susilo',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Tiket diverifikasi dan diklasifikasikan Medium Severity.',
        timestampUtc: '2026-09-12T01:00:00.000Z',
        proofFile: null
      },
      {
        id: 502,
        stepName: 'Penugasan ke Dwi Prasetyo',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Respon dalam 30 menit.',
        timestampUtc: '2026-09-12T01:30:00.000Z',
        proofFile: null
      },
      {
        id: 503,
        stepName: 'Perbaikan Socket PHP-FPM & Validasi Akses',
        status: 'IN_PROGRESS',
        actorName: 'Dwi Prasetyo',
        actorRole: 'ENGINEER',
        notes: 'Socket permission dikembalikan ke www-data dan Nginx berhasil reload.',
        timestampUtc: '2026-09-12T03:40:00.000Z',
        proofFile: 'nginx_error_502.log'
      },
      {
        id: 504,
        stepName: 'Solusi Berhasil Diterapkan & Verifikasi Client',
        status: 'RESOLVED',
        actorName: 'Dwi Prasetyo',
        actorRole: 'ENGINEER',
        notes: 'Portal terverifikasi normal. Tiket dinyatakan RESOLVED.',
        timestampUtc: '2026-09-12T04:20:00.000Z',
        proofFile: null
      }
    ]
  },

  // 6. Ticket #6 - Closed Ticket (Bank Mandiri Rubrik Backup)
  {
    id: 6,
    ticketNumber: 'TICK-20260912-0002',
    customerId: 6,
    customerPicId: 111,
    categoryId: 1,
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'Bank Mandiri: Rubrik CDM Backup Job Timeout on Oracle Archive Volumes',
    rawMessage: 'Laporan otomatis Rubrik CDM: Proteksi harian SLA Domain Gold untuk volume ASM Archive Log Oracle RAC Mandiri terhenti dengan kode VSS Writer Timeout.',
    description: 'Rubrik CDM snapshot job timed out while waiting for storage freeze acknowledgement during peak nocturnal batch transaction balancing.',
    status: 'CLOSED',
    trackingToken: 'sec_mnd_99221100',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    
    contractSla: 'SLA-PLATINUM-2026',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'Plaza Mandiri Data Center Gatot Subroto',
    environment: 'PROD-MND-01',
    impactScope: 'Backup SLA Compliance Compliance Target',
    isEmailSync: true,
    isProposeKb: true,

    principalVendor: 'Rubrik Enterprise Customer Support',
    principalCaseId: 'RBK-2026-10499',
    principalSpecialist: 'Jonathan Lee (Rubrik Senior TAC)',
    principalBridgeStatus: 'Case Resolved & Closed',
    principalLatestUpdate: 'Rubrik TAC mengonfirmasi timeout threshold telah dinaikkan dan snapshot synthetic full berhasil diselesaikan.',
    principalUpdateTimestamp: '2026-09-12 16:00 WIB',

    createdAt: '2026-09-12T05:00:00.000Z',
    updatedAt: '2026-09-12T11:00:00.000Z',
    responseDeadline: '2026-09-12T05:30:00.000Z',
    resolutionDeadline: '2026-09-12T09:00:00.000Z',
    respondedAt: '2026-09-12T05:15:00.000Z',
    resolvedAt: '2026-09-12T08:30:00.000Z',
    closedAt: '2026-09-12T11:00:00.000Z',
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Freeze timeout window pada database client terlalu singkat (30 detik) saat I/O archive disk utilization mencapai 92%.',
    resolutionStrategy: 'Sesuaikan parameter freeze-timeout di agent Rubrik CDM menjadi 90 detik dan atur concurrency limit throttle.',
    actionTaken: 'Parameter freeze window disesuaikan via rubric CLI dan test snapshot manual berhasil dalam 1 menit 42 detik.',
    resolutionNotes: 'Bpk. Aditya Nugraha (PIC Bank Mandiri) mengonfirmasi via portal tiket backup normal. Tiket ditutup permanen.',
    recommendation: 'Atur jadwal retensi backup archive log di luar jendela pemrosesan kliring batch BI-FAST.',
    
    attachments: [
      {
        id: 'att-601',
        name: 'rubrik_snapshot_success.png',
        originalName: 'rubrik-mandiri-success.png',
        fileType: 'image/svg+xml',
        size: '198 KB',
        uploadedBy: 'Budi Santoso (Engineer)',
        uploadedAt: '2026-09-12T08:30:00.000Z',
        source: 'Bukti Resolusi Rubrik CDM'
      }
    ],

    milestones: [
      {
        id: 601,
        stepName: 'Alert Masuk dari Portal API Rubrik Mandiri',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Tiket otomatis diterbitkan.',
        timestampUtc: '2026-09-12T05:00:00.000Z',
        proofFile: null
      },
      {
        id: 602,
        stepName: 'Alokasi ke Budi Santoso',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Respon dalam 15 menit.',
        timestampUtc: '2026-09-12T05:15:00.000Z',
        proofFile: null
      },
      {
        id: 603,
        stepName: 'Penyesuaian Throttle & Trigger On-Demand Backup',
        status: 'RESOLVED',
        actorName: 'Budi Santoso',
        actorRole: 'ENGINEER',
        notes: 'Backup SLA Domain dinyatakan sukses.',
        timestampUtc: '2026-09-12T08:30:00.000Z',
        proofFile: 'rubrik_snapshot_success.png'
      },
      {
        id: 604,
        stepName: 'Konfirmasi Customer & Tiket Ditutup',
        status: 'CLOSED',
        actorName: 'Aditya Nugraha (Bank Mandiri)',
        actorRole: 'CUSTOMER',
        notes: 'Customer menandatangani penyelesaian. Tiket ditutup.',
        timestampUtc: '2026-09-12T11:00:00.000Z',
        proofFile: null
      }
    ]
  },

  // 7. Ticket #7 - Closed Ticket (AHM BGP Flapping)
  {
    id: 7,
    ticketNumber: 'TICK-20260911-0001',
    customerId: 2,
    customerPicId: 104,
    categoryId: 2,
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'PT Astra Honda Motor: Intermittent BGP Route Flapping on Primary WAN MPLS',
    rawMessage: 'Pemberitahuan gangguan inter-koneksi: Jalur data Plant 3 ke Kantor Pusat Sunter mengalami route flapping setiap 10-15 menit melalui link provider Telkom.',
    description: 'BGP session state flapping between Established and Active due to carrier transport MTU mismatch causing large OSPF/BGP keepalive drops.',
    status: 'CLOSED',
    trackingToken: 'sec_ahm_55110099',
    createdById: 2,
    assignedToId: 6, // Rizky Pratama
    
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'Plant 3 Cikarang DC Cluster',
    environment: 'PROD-PLANT-03',
    impactScope: 'Inter-Plant SCADA WAN Telemetry',
    isEmailSync: true,
    isProposeKb: true,

    principalVendor: 'Cisco Systems TAC',
    principalCaseId: 'CSCO-699210',
    principalSpecialist: 'Dedy Kurniawan (Cisco CCIE)',
    principalBridgeStatus: 'Resolved',
    principalLatestUpdate: 'Case TAC ditutup setelah penyesuaian ip mtu 1500 dan ip tcp adjust-mss 1460 pada antarmuka WAN.',
    principalUpdateTimestamp: '2026-09-11 15:30 WIB',

    createdAt: '2026-09-11T02:00:00.000Z',
    updatedAt: '2026-09-11T08:00:00.000Z',
    responseDeadline: '2026-09-11T02:30:00.000Z',
    resolutionDeadline: '2026-09-11T10:00:00.000Z',
    respondedAt: '2026-09-11T02:15:00.000Z',
    resolvedAt: '2026-09-11T06:30:00.000Z',
    closedAt: '2026-09-11T08:00:00.000Z',
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Provider MPLS carrier melakukan update switch agregasi yang menurunkan effective path MTU menjadi 1492 byte.',
    resolutionStrategy: 'Konfigurasi TCP MSS clamping pada router WAN Cisco ISR 4451 dan koordinasi penyesuaian MTU provider.',
    actionTaken: 'Penerapan ip tcp adjust-mss 1460 dan monitoring paket BFD selama 1 jam stabil tanpa drop.',
    resolutionNotes: 'BGP session state stabil dan peering up 100%. Tiket ditutup.',
    recommendation: 'Jadwalkan periodic automated MTU discovery test via Cisco IP SLA script.',
    
    attachments: [],
    milestones: [
      {
        id: 701,
        stepName: 'Laporan Diterima & Eskalasi Jaringan',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Tiket diterbitkan dengan Severity High.',
        timestampUtc: '2026-09-11T02:00:00.000Z',
        proofFile: null
      },
      {
        id: 702,
        stepName: 'Penugasan ke Rizky Pratama',
        status: 'ASSIGNED',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Respon dalam 15 menit.',
        timestampUtc: '2026-09-11T02:15:00.000Z',
        proofFile: null
      },
      {
        id: 703,
        stepName: 'Penerapan MSS Clamping & Verifikasi Peering',
        status: 'RESOLVED',
        actorName: 'Rizky Pratama',
        actorRole: 'ENGINEER',
        notes: 'BGP flapping berhenti.',
        timestampUtc: '2026-09-11T06:30:00.000Z',
        proofFile: null
      },
      {
        id: 704,
        stepName: 'Penutupan Resmi Tiket',
        status: 'CLOSED',
        actorName: 'Rahmat Hidayat (AHM)',
        actorRole: 'CUSTOMER',
        notes: 'Verifikasi jalur produksi normal.',
        timestampUtc: '2026-09-11T08:00:00.000Z',
        proofFile: null
      }
    ]
  },

  // 8. Ticket #8 - Resolved (BCA Cisco Nexus Spine Upgrade)
  {
    id: 8,
    ticketNumber: 'TICK-20260910-0001',
    customerId: 1,
    customerPicId: 102,
    categoryId: 2,
    severity: 'LOW',
    channel: 'PORTAL',
    title: 'PT Bank Central Asia Tbk: Maintenance Window Firmware Upgrade Cisco Nexus Spine',
    rawMessage: 'Permohonan pendampingan teknis Helpdesk GTT untuk jadwal maintenance upgrade NX-OS 9.3(10) pada sepasang Spine Nexus 9336C-FX2 Cikarang DC.',
    description: 'Non-disruptive In-Service Software Upgrade (ISSU) on core data center spine switches in accordance with annual security audit compliance.',
    status: 'RESOLVED',
    trackingToken: 'sec_bca_33001199',
    createdById: 2,
    assignedToId: 6, // Rizky Pratama
    
    contractSla: 'SLA-PLATINUM-2026',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'HaloBCA Cikarang Data Center Tier IV',
    environment: 'PROD-DC-01',
    impactScope: 'Scheduled Maintenance Window',
    isEmailSync: true,
    isProposeKb: false,

    principalVendor: 'Cisco Systems Enterprise Support',
    principalCaseId: 'CSCO-CHANGE-9102',
    principalSpecialist: 'Cisco Remote Support Desk',
    principalBridgeStatus: 'Standby Monitoring',
    principalLatestUpdate: null,
    principalUpdateTimestamp: null,

    createdAt: '2026-09-10T14:00:00.000Z',
    updatedAt: '2026-09-10T19:30:00.000Z',
    responseDeadline: '2026-09-10T15:00:00.000Z',
    resolutionDeadline: '2026-09-10T22:00:00.000Z',
    respondedAt: '2026-09-10T14:20:00.000Z',
    resolvedAt: '2026-09-10T19:30:00.000Z',
    closedAt: null,
    
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    isSlaResponseBreached: false,
    isSlaResolutionBreached: false,
    
    rootCause: 'Scheduled maintenance change request.',
    resolutionStrategy: 'Eksekusi dual ISSU berurutan dengan monitoring traffic telemetry pada spine 1 dan spine 2.',
    actionTaken: 'ISSU Spine 1 sukses (0 drop), ISSU Spine 2 sukses. Seluruh BGP EVPN fabric adjacency normal.',
    resolutionNotes: 'Maintenance window selesai lebih cepat dari jadwal. Klien menandatangani BA pelaksanaan.',
    recommendation: 'Arsipkan konfigurasi running-config pasca upgrade ke TFTP repository backup harian.',
    
    attachments: [],
    milestones: [
      {
        id: 801,
        stepName: 'Pengajuan Change Request Terjadwal',
        status: 'OPEN',
        actorName: 'Rina Anggraini',
        actorRole: 'CPIG',
        notes: 'Jadwal disetujui untuk jendela 20:00 - 23:00 WIB.',
        timestampUtc: '2026-09-10T14:00:00.000Z',
        proofFile: null
      },
      {
        id: 802,
        stepName: 'Eksekusi ISSU & Verifikasi Evpn Adjacency',
        status: 'RESOLVED',
        actorName: 'Rizky Pratama',
        actorRole: 'ENGINEER',
        notes: 'Seluruh port 100G aktif dan forwarding traffic normal.',
        timestampUtc: '2026-09-10T19:30:00.000Z',
        proofFile: null
      }
    ]
  }
];

export const MOCK_KNOWLEDGE_BASE = [
  {
    id: 8821,
    kbCode: 'KB-8821',
    ticketReferenceId: 1,
    ticketNumber: 'TICK-20260913-0001',
    title: 'HPE 3PAR / Primera Controller Node Failover & Cache Rebalance Procedure',
    category: 'Storage',
    categoryGroup: 'SAN & Enterprise Storage',
    technologyPrincipal: 'HPE 3PAR / Primera',
    author: 'Ismat Yulian',
    approver: 'Denny Wicaksono (Supervisor)',
    status: 'PUBLISHED',
    updatedAt: '2 days ago',
    ticketsReferencedCount: 14,
    source: 'Dari Tiket Resolved TICK-20260913-0001 (Astra Honda Motor)',
    symptom: 'Step-by-step instructions to isolate degraded controller nodes, clear stalled PCIe unmap commands, and trigger safe host multipath rescans during active degraded failover.',
    rootCause: 'PCIe interconnect synchronization degradation leading to unmap command queues bottleneck and dirty cache mirror latency exceeding 120ms.',
    prerequisites: 'Akses CLI SSH via Service IP, privilege 3PAR Service Level 3, firmware 3.3.1 MU5 atau lebih baru.',
    cliSnippet: `# 1. Evaluasi kesehatan cluster node sebelum isolasi\ncheckhealth -svc -detail\n\n# 2. Periksa status port FC host dan dirty cache balance\nshowport -devspeed\nshowsys -d\n\n# 3. Lakukan failover terisolasi pada Node 0 ke Node 1 partner\nservicenode start 0\n\n# 4. Verifikasi status sinkronisasi mirror cache\nstatcmp -iter 5\n\n# 5. Online-kan kembali controller node setelah penggantian part/reseat\nsetnode online 0`,
    verificationSteps: 'Pastikan seluruh Virtual Volumes (VV) melaporkan status normal via showvv -s, dan host multipathing ESXi melaporkan state Active/Optimized.',
    rollbackProcedure: 'Jika node gagal sinkronisasi ulang dalam 10 menit, hentikan proses dengan servicenode halt 0 dan segera aktivasi tiket eskalasi L3 HPE Support.',
    recommendation: 'Jadwalkan quarterly battery backup unit (BBU) and PCIe fabric health check.',
    createdAt: '2026-09-11T04:30:00.000Z'
  },
  {
    id: 9610,
    kbCode: 'KB-9610',
    ticketReferenceId: 2,
    ticketNumber: 'TICK-20260913-0002',
    title: 'VMware ESXi Host Diagnostic Purple Screen (PSOD) Crash Dump Triage',
    category: 'VMware',
    categoryGroup: 'VMware & Hypervisors',
    technologyPrincipal: 'ESXi Kernel / vSAN',
    author: 'Hendra K.',
    approver: 'Denny Wicaksono (Supervisor)',
    status: 'PUBLISHED',
    updatedAt: '1 week ago',
    ticketsReferencedCount: 9,
    source: 'Dari Tiket Resolved TICK-20260913-0002 (RS Siloam)',
    symptom: 'Decoding backtrace registers, identifying failing VIB drivers, and recovering cluster hosts without losing HA state or storage lock files.',
    rootCause: 'Driver qfle3 NIC hardware exception memicu interupsi kernel tak tertangani pada ESXi 8.0 Update 2 build 22380479.',
    prerequisites: 'Konsol IPMI/iLO/iDRAC terhubung, ketersediaan core dump partition 2.5 GB.',
    cliSnippet: `# 1. Ekstraksi dump coredump aktif dari partisi diagnostik\nesxcfg-dumppart -L\n\n# 2. Baca register backtrace exception crash\nesxcli system coredump file get\n\n# 3. Periksa versi VIB driver antarmuka yang terindikasi crash\nesxcli software vib list | grep -i qfle3\n\n# 4. Disable driver async buggy dan aktifkan fallback native inbox\nesxcli system module set --enabled=false --module=qfle3`,
    verificationSteps: 'Host berhasil booting tanpa PSOD, status cluster HA vCenter terverifikasi hijau (Connected), dan host vSAN diskgroup tersinkronisasi 100%.',
    rollbackProcedure: 'Jika fallback native driver gagal inisialisasi link jaringan, boot kembali via ESXi recovery kernel (Shift+R saat boot loader) ke build sebelumnya.',
    recommendation: 'Update seluruh cluster farm ke image profile seragam via vSphere Lifecycle Manager (vLCM).',
    createdAt: '2026-09-08T08:15:00.000Z'
  },
  {
    id: 7712,
    kbCode: 'KB-7712',
    ticketReferenceId: 6,
    ticketNumber: 'TICK-20260912-0002',
    title: 'Rubrik Backup Job Timeout & VSS Writer Quiescing Failure on Windows Cluster',
    category: 'Backup & DR',
    categoryGroup: 'Backup & DR',
    technologyPrincipal: 'Rubrik CDM / VSS',
    author: 'Bayu A.',
    approver: 'Denny Wicaksono (Supervisor)',
    status: 'PUBLISHED',
    updatedAt: '3 weeks ago',
    ticketsReferencedCount: 7,
    source: 'Dari Tiket Resolved TICK-20260912-0002 (Bank Mandiri DC)',
    symptom: 'Resolving SQL server shadow-copy provider exceptions during high I/O windows, adjusting throttle envelopes, and re-registering vssadmin providers.',
    rootCause: 'VSS Writer timed out akibat shadow storage allocation limit penuh dan disk I/O burst bersamaan dengan job batch ETL.',
    prerequisites: 'Hak akses Administrator domain lokal pada VM target, koneksi port 443 ke Rubrik Brik cluster.',
    cliSnippet: `# 1. Cek status writer Windows VSS\nvssadmin list writers\n\n# 2. Restart layanan Volume Shadow Copy & provider SW\nnet stop swprv\nnet stop vss\nnet start vss\nnet start swprv\n\n# 3. Alokasikan batas maksimum shadow storage drive volume\nvssadmin resize shadowstorage /for=D: /on=D: /maxsize=25%`,
    verificationSteps: 'Jalankan on-demand snapshot test via Rubrik CDM UI; snapshot harus berstatus Succeeded dalam rentang < 3 menit tanpa VSS error.',
    rollbackProcedure: 'Kembalikan limit shadow storage ke 15% jika terdapat penurunan kapasitas disk partisi database.',
    recommendation: 'Geser jadwal proteksi SLA domain Rubrik di luar jendela eksekusi stored procedure SQL batch harian.',
    createdAt: '2026-08-25T11:00:00.000Z'
  },
  {
    id: 6534,
    kbCode: 'KB-6534',
    ticketReferenceId: 3,
    ticketNumber: 'TICK-20260913-0003',
    title: 'Brocade SAN Switch FC Port Flapping and SFP Optical Signal Attenuation',
    category: 'Storage Networking',
    categoryGroup: 'Network & Switches',
    technologyPrincipal: 'Brocade / Broadcom Fabric OS',
    author: 'Ismat Yulian',
    approver: 'Denny Wicaksono (Supervisor)',
    status: 'PUBLISHED',
    updatedAt: 'May 2026',
    ticketsReferencedCount: 11,
    source: 'Dari Tiket Resolusi Lapangan Brocade G620 SAN Switch (BCA)',
    symptom: 'Optical dBm power inspection via sfpshow, credit loss isolation, CRC error rate counters, and live transceiver hot-swap safety protocols.',
    rootCause: 'Modul SFP+ 16Gbps mengalami degradasi laser diode (Rx power drop ke -19.4 dBm) menyebabkan frame CRC discard.',
    prerequisites: 'Akses SSH Fabric OS (FOS), permission Admin, ketersediaan kabel fiber LC-LC dan spare transceiver Brocade certified.',
    cliSnippet: `# 1. Periksa nilai optical power dBm pada port bermasalah\nsfpshow 1/14\n\n# 2. Tampilkan akumulasi error frame dan buffer credit loss\nportstatsshow 1/14\n\n# 3. Nonaktifkan port secara terkontrol sebelum pencabutan SFP\nportdisable 1/14\n\n# 4. Ganti optic, pasang fiber patchcord, dan aktifkan port kembali\nportenable 1/14\n\n# 5. Reset counter error untuk verifikasi stabilitas\nportstatsclear 1/14`,
    verificationSteps: 'Pastikan sfpshow 1/14 membaca Rx Power antara -2.0 dBm hingga -9.0 dBm dan statshow tidak lagi menambah enc_in / crc_err counter.',
    rollbackProcedure: 'Jika port baru tetap no_light, pindahkan patchcord ke port spare yang telah di-zone sebelumnya pada active fabric config.',
    recommendation: 'Lakukan inspeksi pembersihan optik berkala menggunakan One-Click Fiber Cleaner pada setiap koneksi patch panel.',
    createdAt: '2026-05-18T09:20:00.000Z'
  },
  {
    id: 5120,
    kbCode: 'KB-5120',
    ticketReferenceId: 4,
    ticketNumber: 'TICK-20260913-0004',
    title: 'Oracle RAC & PostgreSQL Read Replica High I/O Latency Diagnostics',
    category: 'Database',
    categoryGroup: 'Database & Middleware',
    technologyPrincipal: 'Oracle Database / PostgreSQL',
    author: 'Dwi Satria',
    approver: 'Denny Wicaksono (Supervisor)',
    status: 'PUBLISHED',
    updatedAt: 'May 2026',
    ticketsReferencedCount: 5,
    source: 'Dari Tiket Resolved TICK-20260913-0004 (Telkomsel Core NOC)',
    symptom: 'AWR report extraction, latch contention identification, and NFS/FC block storage response profiling under peak batch transactional loads.',
    rootCause: 'Checkpoint timeout terlalu pendek dan lock contention pada shared buffer table partition.',
    prerequisites: 'Akses sysdba pada Oracle RAC atau superuser postgres, akses read /sys/block IO scheduler.',
    cliSnippet: `# 1. Periksa query locks aktif pada PostgreSQL\nSELECT pid, now() - query_start AS duration, query, state \nFROM pg_stat_activity \nWHERE state != 'idle' AND now() - query_start > interval '30 seconds';\n\n# 2. Ekstrak diagnostik I/O latency block device kernel OS\niostat -xz 1 10\n\n# 3. Generate automatic workload repository (AWR) report Oracle\nsqlplus / as sysdba @$ORACLE_HOME/rdbms/admin/awrrpt.sql`,
    verificationSteps: 'Query latency kembali di bawah 25ms dan average await time block device disk di bawah 2ms.',
    rollbackProcedure: 'Reset checkpoint_completion_target dan max_parallel_workers ke konfigurasi default jika CPU utilization melebihi 90%.',
    recommendation: 'Aktifkan connection pooling PgBouncer / Oracle Connection Pool untuk membatasi lonjakan thread concurrency.',
    createdAt: '2026-05-04T14:40:00.000Z'
  }
];

export const MOCK_PENDING_KB_APPROVALS = [
  {
    id: 9901,
    title: 'BGP Route Reflector flapping post IOS-XE 17.9.4 upgrade',
    sourceTicket: 'INC-1094',
    customer: 'PT Bank Central Asia Tbk',
    author: 'Rizky Pratama',
    category: 'Network & Connectivity',
    stage: 'Ready for QA',
    submittedAt: 'Today, 10:15 WIB',
    summary: 'Prosedur mitigasi BFD timer mismatch dan MTU path discovery blackhole pada inter-VRF routing.'
  },
  {
    id: 9902,
    title: 'NetApp MetroCluster switchover split-brain tiebreaker isolation',
    sourceTicket: 'INC-1088',
    customer: 'PT Astra Honda Motor',
    author: 'Ismat Yulian',
    category: 'Storage & Infrastructure',
    stage: 'Supervisor review',
    submittedAt: 'Yesterday, 16:40 WIB',
    summary: 'Instruksi pemulihan mailbox disk quorum dan penonaktifan automated unforced switchover saat WAN latency spike.'
  },
  {
    id: 9903,
    title: 'Kubernetes CoreDNS intermittent upstream UDP drop in Calico CNI',
    sourceTicket: 'INC-1072',
    customer: 'Diskominfo Kota Tangerang Selatan',
    author: 'Budi Santoso',
    category: 'Cloud & Kubernetes',
    stage: 'Draft stage',
    submittedAt: '3 days ago',
    summary: 'Penyesuaian nodelocaldns caching layer dan peningkatan conntrack max limit pada node worker.'
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
    description: 'Menerbitkan tiket insiden baru untuk PT Astra Honda Motor: HPE 3PAR Storage Controller Node 0 Offline',
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
    description: 'Menugaskan tiket TICK-20260913-0001 kepada Budi Santoso (Lead SysOps)',
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
    description: 'Mengubah status tiket ke IN_PROGRESS dan menambah milestone investigasi isolasi controller node',
    ipAddress: '192.168.10.88',
    timestampUtc: '2026-09-13T03:45:00.000Z'
  },
  {
    id: 4,
    userName: 'Budi Santoso',
    role: 'ENGINEER',
    action: 'PRINCIPAL_INTEGRATION_ACTIVATED',
    entityType: 'TICKET',
    entityId: 'TICK-20260913-0001',
    description: 'Menghubungkan tiket ke Technology Principal L3 Bridge HPE Global Support Case #HPE-2026-004821',
    ipAddress: '192.168.10.88',
    timestampUtc: '2026-09-13T04:30:00.000Z'
  },
  {
    id: 5,
    userName: 'Hendra Kusuma',
    role: 'ENGINEER',
    action: 'SLA_PAUSED',
    entityType: 'TICKET',
    entityId: 'TICK-20260913-0002',
    description: 'Menahan waktu SLA tiket RS Siloam (Pending Vendor Broadcom VMware untuk hotfix patch async VIB)',
    ipAddress: '192.168.10.92',
    timestampUtc: '2026-09-13T03:30:00.000Z'
  },
  {
    id: 6,
    userName: 'Dwi Prasetyo',
    role: 'ENGINEER',
    action: 'STATUS_CHANGED_RESOLVED',
    entityType: 'TICKET',
    entityId: 'TICK-20260912-0001',
    description: 'Menyelesaikan tiket TICK-20260912-0001 (Diskominfo Tangsel). Timer SLA Resolution resmi dihentikan.',
    ipAddress: '192.168.10.89',
    timestampUtc: '2026-09-12T04:20:00.000Z'
  },
  {
    id: 7,
    userName: 'Ir. Hendra Gunawan',
    role: 'ADMIN',
    action: 'KB_PUBLISHED',
    entityType: 'KNOWLEDGE_BASE',
    entityId: 'KB-8821',
    description: 'Menyetujui dan mempublikasikan runbook resmi ITIL KB-8821: HPE 3PAR / Primera Controller Node Failover',
    ipAddress: '192.168.10.12',
    timestampUtc: '2026-09-11T05:00:00.000Z'
  }
];
