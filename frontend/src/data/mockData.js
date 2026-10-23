// Realistic Enterprise Mock Data for PT Global Transformasi Teknologi (Glotra Technology) Helpdesk Ticketing System
// Aligned with 8 Figma Frames & ITIL Enterprise Service Desk Standards

export const ROLES = [
  { id: 1, code: 'ADMIN', name: 'ADMIN / CPIG', badge: 'Admin & Helpdesk', description: 'Kendali penuh tiket, triage laporan, penugasan teknisi, analitik SLA, dan konfigurasi master data' },
  { id: 2, code: 'ENGINEER', name: 'Support Engineer', badge: 'Teknisi NOC', description: 'Pelaksana investigasi teknis, milestone pemulihan, pause SLA, dan resolusi tiket' }
];

export const MOCK_USERS = [
  { id: 1, roleId: 1, roleCode: 'ADMIN', name: 'Ahmad Fauzi', roleTitle: 'System Administrator', email: 'admin@glotratech.com', initials: 'AF', phone: '0811-9988-771', isActive: true, password: 'password123' },
  { id: 2, roleId: 1, roleCode: 'ADMIN', name: 'Rina Anggraini', roleTitle: 'CPIG / Operations Lead', email: 'rina.cpig@glotratech.com', initials: 'RA', phone: '0812-8877-662', isActive: true, password: 'password123' },
  { id: 3, roleId: 1, roleCode: 'ADMIN', name: 'Ir. Hendra Gunawan', roleTitle: 'Service Operations Manager', email: 'hendra.head@glotratech.com', initials: 'HG', phone: '0811-3322-110', isActive: true, password: 'password123' },
  { id: 4, roleId: 2, roleCode: 'ENGINEER', name: 'Budi Santoso', roleTitle: 'Lead SysOps & SAN Specialist', email: 'budi.eng@glotratech.com', initials: 'BS', phone: '0813-7766-553', isActive: true, password: 'password123' },
  { id: 5, roleId: 2, roleCode: 'ENGINEER', name: 'Dwi Prasetyo', roleTitle: 'Storage & Backup Specialist', email: 'dwi.eng@glotratech.com', initials: 'DP', phone: '0813-5544-332', isActive: true, password: 'password123' },
  { id: 6, roleId: 2, roleCode: 'ENGINEER', name: 'Rizky Pratama', roleTitle: 'Network Infrastructure Specialist', email: 'rizky.eng@glotratech.com', initials: 'RP', phone: '0812-4455-667', isActive: true, password: 'password123' },
  { id: 7, roleId: 2, roleCode: 'ENGINEER', name: 'Hendra Kusuma', roleTitle: 'Virtualization Escalation Engineer', email: 'hendra.eng@glotratech.com', initials: 'HK', phone: '0815-9988-223', isActive: true, password: 'password123' },
  { id: 8, roleId: 2, roleCode: 'ENGINEER', name: 'Siti Nurhaliza', roleTitle: 'Database & Cloud Specialist', email: 'siti.eng@glotratech.com', initials: 'SN', phone: '0813-2211-994', isActive: true, password: 'password123' },
  { id: 9, roleId: 2, roleCode: 'ENGINEER', name: 'Andi Wijaya', roleTitle: 'Senior Cloud & Network Engineer', email: 'andi.eng@glotratech.com', initials: 'AW', phone: '0812-7711-2233', isActive: true, password: 'password123' }
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
    name: 'PT Astra',
    code: 'AST',
    industry: 'Otomotif',
    serviceContract: 'PKS Dukungan Infrastruktur SAP & Cloud ERP',
    contractSla: 'GOLD_8X5',
    slaTier: '8x5 GOLD ENTERPRISE',
    slaCoverage: 'First Touch: 30m • Resolusi: 8h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    address: 'Prudential Center Kota Kasablanka Fl 22 Unit A Jalan Casablanca Kav. 88, Tebet, Jakarta Selatan',
    maintenanceStart: '2026-12-01',
    maintenanceEnd: '2027-11-30',
    ticketQuota: 100,
    initialUsedTickets: 88, // 100 - 88 = 12 remaining (12%)
    isActive: true,
    pics: [
      { id: 101, name: 'Bpk. Bambang Sutrisno', phone: '0811-1234-5678', email: 'bambang.sutrisno@astra.co.id', dept: 'Corporate IT & SAP Basis Lead' },
      { id: 102, name: 'Ibu Ratna Paramita', phone: '0812-9876-5432', email: 'ratna.paramita@astra.co.id', dept: 'Enterprise Network & Facility' }
    ]
  },
  {
    id: 2,
    name: 'PT Mandiri Taspen',
    code: 'TMT',
    industry: 'Keuangan',
    serviceContract: 'PKS Core Banking Support & Data Center Colocation 8x5',
    contractSla: 'GOLD_8X5',
    slaTier: '8x5 GOLD ENTERPRISE',
    slaCoverage: 'First Touch: 30m • Resolusi: 8h',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    address: 'Menara Mandiri Taspen Lt. 5, Jl. Jend. Sudirman Kav. 2, Jakarta Pusat',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 250,
    initialUsedTickets: 205, // 250 - 205 = 45 remaining (18%)
    isActive: true,
    pics: [
      { id: 103, name: 'Bpk. Hendro Wicaksono', phone: '0812-3344-7788', email: 'hendro.w@mandiritaspen.co.id', dept: 'IT Infrastructure & Security' },
      { id: 104, name: 'Ibu Maya Anggraini', phone: '0813-8899-2211', email: 'maya.a@mandiritaspen.co.id', dept: 'Database & Applications' }
    ]
  },
  {
    id: 3,
    name: 'PT PJB',
    code: 'PJB',
    industry: 'Energi',
    serviceContract: 'PKS Monitoring SCADA & Power Generation Infrastructure',
    contractSla: 'SILVER_8X5',
    slaTier: '8x5 SILVER BUSINESS',
    slaCoverage: 'First Touch: 1h • Resolusi: 12h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    address: 'Jl. Ketintang Baru No. 11, Gayungan, Kota Surabaya, Jawa Timur',
    maintenanceStart: '2026-03-01',
    maintenanceEnd: '2027-02-28',
    ticketQuota: 50,
    initialUsedTickets: 45, // 50 - 45 = 5 remaining (10%) -> ALERT CRITICAL!
    isActive: true,
    pics: [
      { id: 105, name: 'Bpk. Sigit Prabowo, ST', phone: '0811-3322-9900', email: 'sigit.prabowo@pjb.co.id', dept: 'SCADA & Automation Unit' },
      { id: 106, name: 'Bpk. Arif Rachman', phone: '0815-6677-8899', email: 'arif.rachman@pjb.co.id', dept: 'IT Network & Server Ops' }
    ]
  },
  {
    id: 4,
    name: 'PT Telkomsel',
    code: 'TSEL',
    industry: 'Telekomunikasi',
    serviceContract: 'PKS Support NOC Infrastructure & Telco Core 24x7',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL03',
    environment: 'PROD-TELCO-01',
    address: 'Telkomsel Smart Office, Jl. Jend. Gatot Subroto Kav. 52, Jakarta Selatan',
    maintenanceStart: '2026-12-01',
    maintenanceEnd: '2027-11-30',
    ticketQuota: 500,
    initialUsedTickets: 20, // 500 - 20 = 480 remaining (96%)
    isActive: true,
    pics: [
      { id: 107, name: 'Bpk. Faisal Akbar', phone: '0811-8899-001', email: 'faisal_akbar@telkomsel.co.id', dept: 'Core Network Operations' },
      { id: 108, name: 'Ibu Nindy Anggraini', phone: '0812-9900-112', email: 'nindy_a@telkomsel.co.id', dept: 'Billing & Mediation Systems' }
    ]
  },
  {
    id: 5,
    name: 'PT FAO',
    code: 'FAO',
    industry: 'Organisasi Internasional',
    serviceContract: 'PKS Dedicated Enterprise Cloud Node & Disaster Recovery',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    address: 'Menara Thamrin Lt. 7, Jl. M.H. Thamrin Kav. 3, Jakarta Pusat',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 'Unlimited',
    initialUsedTickets: 14,
    isActive: true,
    pics: [
      { id: 109, name: 'Mr. David Miller', phone: '0811-9900-3344', email: 'david.miller@fao.org', dept: 'Regional ICT Coordination' }
    ]
  },
  {
    id: 6,
    name: 'PT Bank Central Asia Tbk',
    code: 'BCA',
    industry: 'Perbankan & Jasa Keuangan',
    serviceContract: 'PKS Layanan Managed Service 24x7 Mission Critical',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    address: 'Menara BCA Grand Indonesia Lt. 28, Jl. M.H. Thamrin No. 1, Jakarta Pusat',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 250,
    initialUsedTickets: 60, // 190 remaining
    isActive: true,
    pics: [
      { id: 110, name: 'Bpk. Kevin Pratama', phone: '0812-1122-3344', email: 'kevin.pratama@bca.co.id', dept: 'IT Infrastructure & DC Operations' },
      { id: 111, name: 'Ibu Sarah Dewi', phone: '0812-5566-7788', email: 'sarah.dewi@bca.co.id', dept: 'Core Banking Operations Lead' }
    ]
  },
  {
    id: 7,
    name: 'RS Siloam Hospitals Group',
    code: 'SILOAM',
    industry: 'Kesehatan & Layanan Rumah Sakit',
    serviceContract: 'PKS Pemeliharaan Server & Critical HIS 24x7',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 HEALTHCARE CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL02',
    environment: 'PROD-HEALTH-01',
    address: 'Jl. Siloam No. 6, Lippo Karawaci 1600, Tangerang, Banten',
    maintenanceStart: '2026-02-01',
    maintenanceEnd: '2027-01-31',
    ticketQuota: 100,
    initialUsedTickets: 25, // 75 remaining
    isActive: true,
    pics: [
      { id: 112, name: 'dr. Andi Wijaya / IT Lead', phone: '0815-4433-2211', email: 'andi.wijaya@siloam.com', dept: 'Hospital Information System (HIS)' },
      { id: 113, name: 'Ibu Ratna Paramitha', phone: '0812-7788-9900', email: 'ratna.p@siloam.com', dept: 'Clinical Systems Support' }
    ]
  },
  {
    id: 8,
    name: 'Diskominfo Kota Tangerang Selatan',
    code: 'DISKOMINFO',
    industry: 'Pemerintahan / Publik',
    serviceContract: 'PKS Dukungan Data Center & Jaringan Publik 8x5',
    contractSla: 'GOV_TIER1',
    slaTier: 'GOVERNMENT TIER-1 (8x5)',
    slaCoverage: 'First Touch: 1h • Resolusi: 12h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-TANGSEL',
    address: 'Jl. Maruga Raya No. 1, Serua, Ciputat, Kota Tangerang Selatan',
    maintenanceStart: '2025-10-01',
    maintenanceEnd: '2026-09-30',
    ticketQuota: 50,
    initialUsedTickets: 12, // 38 remaining
    isActive: false, // Periode maintenance selesai pada 30 Sep 2026 -> Auto-deactivated
    deactivatedReason: 'MAINTENANCE_EXPIRED',
    pics: [
      { id: 114, name: 'Bpk. Joko Susilo, M.Kom', phone: '0813-9988-1122', email: 'joko.susilo@tangerangselatankota.go.id', dept: 'Jaringan & Data Center' },
      { id: 115, name: 'Bpk. Tri Wahyudi', phone: '0818-4455-1122', email: 'tri.wahyudi@tangerangselatankota.go.id', dept: 'Aplikasi Informatika' }
    ]
  },
  {
    id: 9,
    name: 'PT Bank Mandiri (Persero) Tbk',
    code: 'MANDIRI',
    industry: 'Perbankan BUMN',
    serviceContract: 'PKS Enterprise Storage & Backup System 24x7',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL02',
    environment: 'PROD-MND-01',
    address: 'Plaza Mandiri Lt. 14, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta Selatan',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 500,
    initialUsedTickets: 90, // 410 remaining
    isActive: true,
    pics: [
      { id: 116, name: 'Bpk. Aditya Nugraha', phone: '0812-3344-5566', email: 'aditya.nugraha@bankmandiri.co.id', dept: 'Enterprise Storage & SAN' }
    ]
  },
  {
    id: 10,
    name: 'PT Perusahaan Gas Negara Tbk',
    code: 'PGN',
    industry: 'Energi',
    serviceContract: 'PKS Jaringan Telemetri Gas & ERP Infrastructure',
    contractSla: 'GOLD_8X5',
    slaTier: '8x5 GOLD ENTERPRISE',
    slaCoverage: 'First Touch: 30m • Resolusi: 8h',
    cluster: 'PROD-CL03',
    environment: 'PROD-DC-03',
    address: 'Jl. K.H. Zainul Arifin No. 20, Krukut, Taman Sari, Jakarta Barat',
    maintenanceStart: '2026-04-01',
    maintenanceEnd: '2027-03-31',
    ticketQuota: 100,
    initialUsedTickets: 18, // 82 remaining
    isActive: true,
    pics: [
      { id: 117, name: 'Bpk. Rahmat Santoso', phone: '0812-4455-6677', email: 'rahmat.santoso@pgn.co.id', dept: 'SCADA Infrastructure' }
    ]
  },
  {
    id: 11,
    name: 'PT Kereta Api Indonesia (Persero)',
    code: 'KAI',
    industry: 'Transportasi',
    serviceContract: 'PKS Ticketing Reservation Cloud & Station Gate Support',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    address: 'Jl. Perintis Kemerdekaan No. 1, Babakan Ciamis, Sumur Bandung, Kota Bandung',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 100,
    initialUsedTickets: 92, // 100 - 92 = 8 remaining (8%) -> ALERT CRITICAL!
    isActive: true,
    pics: [
      { id: 118, name: 'Bpk. Tri Wibowo', phone: '0813-7788-9900', email: 'tri.wibowo@kai.id', dept: 'Enterprise Ticketing IT' }
    ]
  },
  {
    id: 12,
    name: 'PT Bio Farma (Persero)',
    code: 'BIO',
    industry: 'Farmasi & Kesehatan',
    serviceContract: 'PKS Cold Chain Monitoring & Laboratory IT Infrastructure',
    contractSla: 'GOLD_8X5',
    slaTier: '8x5 GOLD ENTERPRISE',
    slaCoverage: 'First Touch: 30m • Resolusi: 8h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    address: 'Jl. Pasteur No. 28, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat',
    maintenanceStart: '2026-05-01',
    maintenanceEnd: '2027-04-30',
    ticketQuota: 50,
    initialUsedTickets: 15, // 35 remaining
    isActive: true,
    pics: [
      { id: 119, name: 'Ibu Dr. Fitri Handayani', phone: '0812-8899-1122', email: 'fitri.h@biofarma.co.id', dept: 'Bioinformatics & Systems' }
    ]
  },
  {
    id: 13,
    name: 'Bank Mantap',
    code: 'BMP',
    industry: 'Perbankan & Jasa Pensiun',
    serviceContract: 'PKS Core Banking Support & Micro Services 8x5',
    contractSla: 'GOLD_8X5',
    slaTier: '8x5 GOLD ENTERPRISE',
    slaCoverage: 'First Touch: 30m • Resolusi: 8h',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    address: 'Jl. Pemuda No. 75, Rawamangun, Pulo Gadung, Jakarta Timur',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 150,
    initialUsedTickets: 42,
    isActive: true,
    pics: [
      { id: 120, name: 'Bpk. Hery Susanto', phone: '0812-7788-1122', email: 'hery.s@bankmantap.co.id', dept: 'Application Support Lead' },
      { id: 121, name: 'Ibu Dewi Sartika', phone: '0813-9900-2233', email: 'dewi.s@bankmantap.co.id', dept: 'IT Operations' }
    ]
  },
  {
    id: 14,
    name: 'Artajasa',
    code: 'ART',
    industry: 'Fintech & Switching ATM Bersama',
    serviceContract: 'PKS Switching Infrastructure & Core Payment Gateway 24x7',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    address: 'Grha Artajasa, Jl. Letnan Sutopo No. 1, BSD City, Tangerang Selatan',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 300,
    initialUsedTickets: 78,
    isActive: true,
    pics: [
      { id: 122, name: 'Bpk. Bayu Anggoro', phone: '0811-2233-4455', email: 'bayu.a@artajasa.co.id', dept: 'Switching & Network Systems' },
      { id: 123, name: 'Ibu Nina Herlina', phone: '0812-4455-7788', email: 'nina.h@artajasa.co.id', dept: 'Payment Infrastructure' }
    ]
  },
  {
    id: 15,
    name: 'Kemenlu',
    code: 'KML',
    industry: 'Pemerintahan / Hubungan Internasional',
    serviceContract: 'PKS Portal Diplomatik & Arsip Luar Negeri 8x5',
    contractSla: 'GOV_TIER1',
    slaTier: 'GOVERNMENT TIER-1 (8x5)',
    slaCoverage: 'First Touch: 1h • Resolusi: 12h',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-TANGSEL',
    address: 'Jl. Taman Pejambon No. 6, Senen, Jakarta Pusat',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 80,
    initialUsedTickets: 24,
    isActive: true,
    pics: [
      { id: 124, name: 'Bpk. Dian Wardhana, ST', phone: '0813-1122-3344', email: 'dian.wardhana@kemlu.go.id', dept: 'Pusat TIK Kemlu' },
      { id: 125, name: 'Bpk. Farhan Prasetya', phone: '0815-3344-5566', email: 'farhan.p@kemlu.go.id', dept: 'Sistem Informasi Diplomatik' }
    ]
  },
  {
    id: 16,
    name: 'JAH',
    code: 'JAH',
    industry: 'Internet & Data Center (ISP)',
    serviceContract: 'PKS Cloud Backup & Host Redundancy Tier III 24x7',
    contractSla: 'PLATINUM_24X7',
    slaTier: '24x7 PLATINUM MISSION CRITICAL',
    slaCoverage: 'First Touch: 30m • Resolusi: 4h',
    cluster: 'PROD-CL03',
    environment: 'PROD-DC-03',
    address: 'Cyber Building 1 Lt. 3, Jl. Kuningan Barat No. 8, Mampang Prapatan, Jakarta Selatan',
    maintenanceStart: '2026-01-01',
    maintenanceEnd: '2026-12-31',
    ticketQuota: 200,
    initialUsedTickets: 56,
    isActive: true,
    pics: [
      { id: 126, name: 'Bpk. Fikri Ramadhan', phone: '0812-8877-0011', email: 'fikri.r@jaringanantarhost.net', dept: 'Infrastructure & NOC Manager' },
      { id: 127, name: 'Bpk. Satria Wibisono', phone: '0811-9988-3344', email: 'satria.w@jaringanantarhost.net', dept: 'Cloud Storage Operations' }
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

export const MOCK_SLA_POLICIES = [
  {
    id: 1,
    tierCode: 'PLATINUM_24X7',
    tierName: 'Platinum 24x7 Mission Critical',
    operatingHours: '24 Jam x 7 Hari (Non-Stop)',
    p1ResponseHours: 0.5,
    p1ResolutionHours: 4,
    p2ResponseHours: 1,
    p2ResolutionHours: 8,
    p3ResponseHours: 2,
    p3ResolutionHours: 24,
    p4ResponseHours: 4,
    p4ResolutionHours: 72,
    notes: '2.5% Rebate / 1h Breach (Maksimal 15%)',
    isActive: true
  },
  {
    id: 2,
    tierCode: 'GOLD_8X5',
    tierName: 'Enterprise 8x5 Gold Standard',
    operatingHours: 'Senin - Jumat (08:00 - 17:00 WIB)',
    p1ResponseHours: 1,
    p1ResolutionHours: 8,
    p2ResponseHours: 2,
    p2ResolutionHours: 16,
    p3ResponseHours: 4,
    p3ResolutionHours: 48,
    p4ResponseHours: 8,
    p4ResolutionHours: 120,
    notes: '1.5% Service Credit / Breach',
    isActive: true
  },
  {
    id: 3,
    tierCode: 'GOV_TIER1',
    tierName: 'Government 8x5 Tier-1 Dedicated',
    operatingHours: 'Senin - Jumat (07:30 - 16:30 WIB)',
    p1ResponseHours: 1,
    p1ResolutionHours: 12,
    p2ResponseHours: 2,
    p2ResolutionHours: 24,
    p3ResponseHours: 4,
    p3ResolutionHours: 72,
    p4ResponseHours: 8,
    p4ResolutionHours: 168,
    notes: 'Pinalti Keterlambatan SP-1 sesuai regulasi BAST',
    isActive: true
  },
  {
    id: 4,
    tierCode: 'SILVER_8X5',
    tierName: 'Standard Silver Managed Care',
    operatingHours: 'Senin - Jumat (08:00 - 17:00 WIB)',
    p1ResponseHours: 2,
    p1ResolutionHours: 24,
    p2ResponseHours: 4,
    p2ResolutionHours: 48,
    p3ResponseHours: 8,
    p3ResolutionHours: 96,
    p4ResponseHours: 24,
    p4ResolutionHours: 240,
    notes: 'Layanan standar jam kerja reguler',
    isActive: true
  }
];

const BASE_TIME = Date.now();

// 1. Core Handcrafted Canonical Tickets (SLA Watch, Point 6 Mockup, and Role-specific Tickets)
const PRIMARY_CANONICAL_TICKETS = [
  // --- A. 5 CANONICAL DASHBOARD SLA WATCH TICKETS ---
  // 1. TICK-20261001-0002 (PT Astra - High Packet Loss - SLA RISK: 00:45:12)
  {
    id: 201,
    ticketNumber: 'TICK-20261001-0002',
    customerId: 1, // PT Astra
    customerPicId: 101,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'HIGH',
    channel: 'WHATSAPP',
    title: 'Koneksi Jaringan Lambat / High Packet Loss',
    scopeSubtitle: 'Traffic link gateway mengalami lonjakan latency (>250ms) dan packet loss 15-30%.',
    description: 'Traffic link gateway interconnect SAP ERP ke production cloud mengalami lonjakan latency (>250ms) dan packet loss 15-30%, mengganggu antrean sinkronisasi database.',
    status: 'IN_PROGRESS',
    progressPercent: 85,
    trackingToken: 'sec_astra_0002',
    createdById: 2,
    assignedToId: 1, // Ahmad Fauzi (Admin / SysAdmin SLA Risk)
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Core WAN Gateway Interconnect',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Cisco Systems TAC',
    principalCaseId: 'CSCO-99214',
    principalSpecialist: 'Dedy Kurniawan',
    principalBridgeStatus: 'Connected',
    slaResponseText: '14m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '00:45:12 / 8h',
    isSlaResolutionBreached: false,
    isNearBreachFlag: false,
    kbMatchCount: 4,
    actionLabel: 'Detail',
    createdAt: new Date(BASE_TIME - 7 * 3600 * 1000 - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_TIME - 30 * 60 * 1000).toISOString(),
    responseDeadline: new Date(BASE_TIME - 6 * 3600 * 1000).toISOString(),
    resolutionDeadline: new Date(BASE_TIME + (45 * 60 + 12) * 1000).toISOString(), // ~00:45:12 remaining!
    respondedAt: new Date(BASE_TIME - 7 * 3600 * 1000).toISOString(),
    resolvedAt: null,
    closedAt: null,
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    rootCause: 'BGP peering interface ge-0/0/1 flapping akibat degradasi kabel optik patch cord pada ODF rack 4.',
    resolutionStrategy: 'Pembersihan konektor optik LC-LC dan migrasi jalur traffic sementara ke link proteksi redundant Telkom BGP.',
    attachments: [
      { id: 'att-201-1', name: 'ping-rto-latency.log', size: '24 KB', source: 'Laporan Awal Monitoring Alert' },
      { id: 'att-201-2', name: 'cisco-tac-optics.pdf', size: '412 KB', source: 'Eskalasi Principal Cisco TAC' }
    ],
    milestones: [
      { id: 1, stepName: 'Laporan Masuk (WhatsApp Helpdesk)', status: 'OPEN', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Laporan masuk dari Bpk. Bambang Sutrisno terkait latency SAP ERP.', timestampUtc: new Date(BASE_TIME - 7 * 3600 * 1000).toISOString(), proofFile: null },
      { id: 2, stepName: 'Penugasan Teknisi & Triage', status: 'ASSIGNED', actorName: 'Ahmad Fauzi', actorRole: 'SysAdmin', notes: 'Tiket dialokasikan untuk penanganan jaringan mendesak.', timestampUtc: new Date(BASE_TIME - 6 * 3600 * 1000 - 45 * 60 * 1000).toISOString(), proofFile: null },
      { id: 3, stepName: 'Inspeksi OTDR & Pembersihan Konektor', status: 'IN_PROGRESS', actorName: 'Ahmad Fauzi', actorRole: 'SysAdmin', notes: 'Ditemukan redaman optik melonjak hingga -24dBm.', timestampUtc: new Date(BASE_TIME - 4 * 3600 * 1000).toISOString(), proofFile: 'ping-rto-latency.log' },
      { id: 4, stepName: 'Eskalasi Principal Cisco TAC', status: 'IN_PROGRESS', actorName: 'Ahmad Fauzi', actorRole: 'SysAdmin', notes: 'Case TAC dibuka #CSCO-99214. Sedang menunggu patch cord pengganti.', timestampUtc: new Date(BASE_TIME - 1 * 3600 * 1000).toISOString(), proofFile: 'cisco-tac-optics.pdf' }
    ]
  },

  // 2. TICK-20261001-0005 (Bank Mantap - Akses ke aplikasi tidak dapat dibuka - WARNING: 02:10:33)
  {
    id: 202,
    ticketNumber: 'TICK-20261001-0005',
    customerId: 13, // Bank Mantap
    customerPicId: 120,
    categoryId: 3,
    categoryName: 'Application',
    severity: 'HIGH',
    channel: 'PORTAL',
    title: 'Akses ke aplikasi tidak dapat dibuka',
    scopeSubtitle: 'User cabang tidak dapat membuka aplikasi layanan pensiun (HTTP 504 Gateway Timeout).',
    description: 'Aplikasi layanan pensiun Bank Mantap terhenti pada load balancer gateway karena thread starvation pada connection pool server backend Tomcat cluster.',
    status: 'IN_PROGRESS',
    progressPercent: 45,
    trackingToken: 'sec_mantap_0005',
    createdById: 2,
    assignedToId: 4, // Budi Santoso (Lead SysOps SLA Warning)
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD ENTERPRISE',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    impactScope: 'Core Pension Web Portal',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Oracle Middleware Support',
    principalCaseId: 'ORA-SR-55190',
    principalSpecialist: 'Budi Santoso',
    principalBridgeStatus: 'Connected',
    slaResponseText: '18m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '02:10:33 / 8h',
    isSlaResolutionBreached: false,
    isNearBreachFlag: true,
    kbMatchCount: 3,
    actionLabel: 'Detail',
    createdAt: new Date(BASE_TIME - 5 * 3600 * 1000 - 50 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_TIME - 15 * 60 * 1000).toISOString(),
    responseDeadline: new Date(BASE_TIME - 5 * 3600 * 1000).toISOString(),
    resolutionDeadline: new Date(BASE_TIME + (2 * 3600 + 10 * 60 + 33) * 1000).toISOString(), // ~02:10:33 remaining!
    respondedAt: new Date(BASE_TIME - 5 * 3600 * 1000 - 30 * 60 * 1000).toISOString(),
    resolvedAt: null,
    closedAt: null,
    isPaused: false,
    pausedAt: null,
    totalPausedDurationSec: 0,
    rootCause: 'Connection leak pada pooling HikariCP database Oracle saat kalkulasi premi massal.',
    resolutionStrategy: 'Purge stalled connection pool, perbesar maxPoolSize ke 150 thread, dan restart Tomcat worker pod.',
    attachments: [
      { id: 'att-202-1', name: 'catalina-out-threadleak.log', size: '156 KB', source: 'Investigasi Server Tomcat' }
    ],
    milestones: [
      { id: 1, stepName: 'Tiket Diterbitkan dari Portal Klien', status: 'OPEN', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Laporan 504 Gateway Timeout diterima dari Bank Mantap.', timestampUtc: new Date(BASE_TIME - 5 * 3600 * 1000 - 50 * 60 * 1000).toISOString(), proofFile: null },
      { id: 2, stepName: 'Penugasan ke Budi Santoso', status: 'ASSIGNED', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Ditugaskan ke SysOps Lead.', timestampUtc: new Date(BASE_TIME - 5 * 3600 * 1000 - 30 * 60 * 1000).toISOString(), proofFile: null },
      { id: 3, stepName: 'Restart Rolling Node Worker 1 & 2', status: 'IN_PROGRESS', actorName: 'Budi Santoso', actorRole: 'Engineer', notes: 'Mengembalikan 60% traffic pensiun, sedang memonitor memory footprint.', timestampUtc: new Date(BASE_TIME - 2 * 3600 * 1000).toISOString(), proofFile: 'catalina-out-threadleak.log' }
    ]
  },

  // 3. TICK-20260930-0087 (Artajasa - Server mati & failover tidak otomatis - IN PROGRESS: 03:25:18)
  {
    id: 203,
    ticketNumber: 'TICK-20260930-0087',
    customerId: 14, // Artajasa
    customerPicId: 122,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'Server mati & failover tidak otomatis',
    scopeSubtitle: 'Node host fisik blade server 4 down, heartbeat cluster timeout.',
    description: 'Power supply modul redundant unit A mengalami hardware fault memicu shutdown mendadak pada blade node 4, mekanisme failover tertunda karena kuncian disk quorum.',
    status: 'IN_PROGRESS',
    progressPercent: 65,
    trackingToken: 'sec_artajasa_0087',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'ATM Bersama Core Switching Cluster',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'HPE Global Support',
    principalCaseId: 'HPE-990142',
    slaResponseText: '10m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '04:15:20 / 4h',
    isSlaResolutionBreached: true,
    isNearBreachFlag: false,
    kbMatchCount: 5,
    actionLabel: 'Detail',
    createdAt: new Date(BASE_TIME - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_TIME - 5 * 60 * 1000).toISOString(),
    responseDeadline: new Date(BASE_TIME - 5 * 60 * 1000).toISOString(),
    resolutionDeadline: new Date(BASE_TIME + (3 * 3600 + 25 * 60 + 18) * 1000).toISOString(), // ~03:25:18 remaining!
    respondedAt: new Date(BASE_TIME - 25 * 60 * 1000).toISOString(),
    resolvedAt: null,
    closedAt: null,
    isPaused: false,
    attachments: [
      { id: 'att-203-1', name: 'ilo-chassis-power.png', size: '320 KB', source: 'IPMI Chassis Alert' }
    ],
    milestones: [
      { id: 1, stepName: 'Alert SNMP Ingestion', status: 'OPEN', actorName: 'System Bot', actorRole: 'System', notes: 'SNMP trap iLO Blade Chassis Node 4 power trip.', timestampUtc: new Date(BASE_TIME - 35 * 60 * 1000).toISOString(), proofFile: null },
      { id: 2, stepName: 'Penanganan Darurat SysOps', status: 'ASSIGNED', actorName: 'Budi Santoso', actorRole: 'Engineer', notes: 'Respon awal 10 menit terpenuhi.', timestampUtc: new Date(BASE_TIME - 25 * 60 * 1000).toISOString(), proofFile: null },
      { id: 3, stepName: 'Manual Quorum Eviction', status: 'IN_PROGRESS', actorName: 'Budi Santoso', actorRole: 'Engineer', notes: 'Melepaskan disk quorum lock via command line storcli.', timestampUtc: new Date(BASE_TIME - 10 * 60 * 1000).toISOString(), proofFile: 'ilo-chassis-power.png' }
    ]
  },

  // 4. TICK-20260930-0061 (Kemenlu - Storage high latency & dirty cache mirror - ASSIGNED: 05:12:10)
  {
    id: 204,
    ticketNumber: 'TICK-20260930-0061',
    customerId: 15, // Kemenlu
    customerPicId: 124,
    categoryId: 1,
    categoryName: 'Storage',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'Storage high latency & dirty cache mirror',
    scopeSubtitle: 'SAN controller mirror cache latency 125ms pada jam sibuk diplomatik.',
    description: 'Volume SAN storage data arsip perwakilan luar negeri mengalami lonjakan queue depth dan dirty cache mirror de-synchronization pada controller B.',
    status: 'ASSIGNED',
    progressPercent: 20,
    trackingToken: 'sec_kemenlu_0061',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo (Storage Specialist)
    contractSla: 'GOV_TIER1',
    contractTier: 'GOVERNMENT TIER-1 (8x5)',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-TANGSEL',
    impactScope: 'Diplomatic Archive Storage Pool',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'NetApp Global Support',
    principalCaseId: 'NTAP-44021',
    slaResponseText: '25m / 60m',
    isSlaResponseBreached: false,
    slaResolutionText: '05:12:10 / 12h',
    isSlaResolutionBreached: false,
    kbMatchCount: 3,
    actionLabel: 'Detail',
    createdAt: new Date(BASE_TIME - 6 * 3600 * 1000 - 48 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_TIME - 6 * 3600 * 1000 - 23 * 60 * 1000).toISOString(),
    responseDeadline: new Date(BASE_TIME - 5 * 3600 * 1000).toISOString(),
    resolutionDeadline: new Date(BASE_TIME + (5 * 3600 + 12 * 60 + 10) * 1000).toISOString(), // ~05:12:10 remaining!
    respondedAt: new Date(BASE_TIME - 6 * 3600 * 1000 - 23 * 60 * 1000).toISOString(),
    resolvedAt: null,
    closedAt: null,
    isPaused: false,
    attachments: [],
    milestones: [
      { id: 1, stepName: 'Tiket Masuk dari PIC Diplomatik', status: 'OPEN', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Laporan degradasi response time dokumen visa dan paspor diplomatik.', timestampUtc: new Date(BASE_TIME - 6 * 3600 * 1000 - 48 * 60 * 1000).toISOString(), proofFile: null },
      { id: 2, stepName: 'Alokasi ke Dwi Prasetyo', status: 'ASSIGNED', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Ditugaskan ke spesialis storage SAN.', timestampUtc: new Date(BASE_TIME - 6 * 3600 * 1000 - 23 * 60 * 1000).toISOString(), proofFile: null }
    ]
  },

  // 5. TICK-20260929-0043 (JAH - Backup job failed pada VSS snapshot volume - OPEN: 07:31:50)
  {
    id: 205,
    ticketNumber: 'TICK-20260929-0043',
    customerId: 16, // JAH
    customerPicId: 126,
    categoryId: 1,
    categoryName: 'Backup',
    severity: 'LOW',
    channel: 'WHATSAPP',
    title: 'Backup job failed pada VSS snapshot volume',
    scopeSubtitle: 'Job backup harian VMware snapshot gagal akibat VSS writer timeout.',
    description: 'Backup job terjadwal pada cluster customer host mengalami kegagalan quiesce pada volume snapshot VSS drive D partisi shared hosting.',
    status: 'OPEN',
    progressPercent: 0,
    trackingToken: 'sec_jah_0043',
    createdById: 2,
    assignedToId: null, // UNASSIGNED OPEN!
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL03',
    environment: 'PROD-DC-03',
    impactScope: 'Daily Backup Integrity Volume',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Rubrik CDM',
    principalCaseId: null,
    slaResponseText: '12m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '07:31:50 / 24h',
    isSlaResolutionBreached: false,
    kbMatchCount: 4,
    actionLabel: 'Tugaskan',
    createdAt: new Date(BASE_TIME - 16 * 3600 * 1000 - 28 * 60 * 1000).toISOString(),
    updatedAt: new Date(BASE_TIME - 16 * 3600 * 1000 - 28 * 60 * 1000).toISOString(),
    responseDeadline: new Date(BASE_TIME - 15 * 3600 * 1000).toISOString(),
    resolutionDeadline: new Date(BASE_TIME + (7 * 3600 + 31 * 60 + 50) * 1000).toISOString(), // ~07:31:50 remaining!
    respondedAt: null,
    resolvedAt: null,
    closedAt: null,
    isPaused: false,
    attachments: [],
    milestones: [
      { id: 1, stepName: 'Tiket Diterbitkan dari WhatsApp NOC JAH', status: 'OPEN', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Menunggu alokasi teknisi backup on-duty.', timestampUtc: new Date(BASE_TIME - 16 * 3600 * 1000 - 28 * 60 * 1000).toISOString(), proofFile: null }
    ]
  },

  // --- B. 8 CANONICAL FIGMA POINT 6 SPECIFICATION TICKETS (PT Astra) ---
  // 6. TICK-20261004-0005 (id: 5)
  {
    id: 5,
    ticketNumber: 'TICK-20261004-0005',
    customerId: 1, // PT Astra
    customerPicId: 101,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'HIGH',
    channel: 'WHATSAPP',
    title: 'Server Down / Service Unreachable',
    scopeSubtitle: 'Server utama tidak merespon koneksi (RTO).',
    description: 'Server utama tidak merespon koneksi (RTO). Seluruh layanan transaksi pengguna terhenti total.',
    status: 'IN_PROGRESS',
    progressPercent: 40,
    trackingToken: 'sec_astra_0005',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Standard Operational',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Cisco TAC Global',
    principalCaseId: '24325',
    principalSpecialist: 'Marcus Vance',
    principalBridgeStatus: 'Connected',
    slaResponseText: '12m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '5h 20m / 8h',
    isSlaResolutionBreached: false,
    kbMatchCount: 3,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T07:25:45.000Z',
    updatedAt: '2026-10-04T10:15:21.000Z',
    responseDeadline: '2026-10-04T07:55:45.000Z',
    resolutionDeadline: '2026-10-04T15:25:45.000Z',
    respondedAt: '2026-10-04T07:37:12.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false,
    rootCause: 'Transient PCIe interconnect bus stall between Controller Node 0 and Node 1 triggered sudden failover while sync threshold sat at 88%, resulting in host path timeout prior to full NVRAM mirroring reconciliation.',
    resolutionStrategy: 'Rebalance FC host paths across Fabric 1, clear stalled cache unmap operations via HPE CLI command line, and trigger targeted rescan on ESXi host storage adapters to re-mount production datastore.',
    attachments: [
      { id: 'att-1', name: 'ping-test-result.txt', size: '12 KB', source: 'Troubleshooting Step 3' },
      { id: 'att-2', name: 'case-24325.pdf', size: '542 KB', source: 'Eskalasi Principal Cisco TAC' },
      { id: 'att-3', name: 'tac-analysis.pdf', size: '1.2 MB', source: 'Analisis Hardware Bus Cisco' },
      { id: 'att-4', name: 'resolution-steps.txt', size: '18 KB', source: 'Prosedur Rescan Storage' }
    ],
    milestones: [
      { id: 1, stepName: 'Laporan Diterima (Ticket Created)', status: 'OPEN', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Tiket diterbitkan oleh Admin. Target respon: 30 menit.', timestampUtc: '2026-10-04T07:25:45.000Z', proofFile: null },
      { id: 2, stepName: 'Penugasan Teknisi', status: 'ASSIGNED', actorName: 'Budi Santoso', actorRole: 'Engineer', notes: 'Tiket ditugaskan ke Budi Santoso untuk pengecekan awal.', timestampUtc: '2026-10-04T07:37:12.000Z', proofFile: null },
      { id: 3, stepName: 'Pengecekan Awal', status: 'IN PROGRESS', actorName: 'Budi Santoso', actorRole: 'Engineer', notes: 'Melakukan pengecekan koneksi ke server dan status layanan. Ditemukan server tidak merespon ping.', timestampUtc: '2026-10-04T07:50:33.000Z', proofFile: 'ping-test-result.txt' },
      { id: 4, stepName: 'Eskalasi ke Principal', status: 'ESCALATED', actorName: 'Budi Santoso', actorRole: 'Engineer', notes: 'Dibuat case ke Cisco TAC Global. Case ID: 24325.', timestampUtc: '2026-10-04T08:35:10.000Z', proofFile: 'case-24325.pdf' },
      { id: 5, stepName: 'Root Cause Identified', status: 'UPDATE', actorName: 'Cisco TAC', actorRole: 'Principal', notes: 'Ditemukan transient PCIe interconnect bus stall.', timestampUtc: '2026-10-04T10:15:21.000Z', proofFile: 'tac-analysis.pdf' },
      { id: 6, stepName: 'Resolution Applied', status: 'RESOLVED', actorName: 'Budi Santoso', actorRole: 'Engineer', notes: 'Rebalance FC host paths dan rescan storage. Layanan normal kembali.', timestampUtc: '2026-10-04T11:00:05.000Z', proofFile: 'resolution-steps.txt' }
    ]
  },

  // 7. TICK-20261004-0004 (id: 4)
  {
    id: 4,
    ticketNumber: 'TICK-20261004-0004',
    customerId: 1,
    customerPicId: 101,
    categoryId: 1,
    categoryName: 'VMware',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'VM Tidak Merespon di Cluster',
    scopeSubtitle: 'VM pada cluster PROD-CL01 tidak dapat...',
    description: 'VM pada cluster PROD-CL01 tidak dapat diakses dan mengalami status degraded.',
    status: 'ASSIGNED',
    progressPercent: 0,
    trackingToken: 'sec_astra_0004',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Virtual Machines',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '8m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 15m / 8h',
    isSlaResolutionBreached: false,
    kbMatchCount: 2,
    actionLabel: 'Terima',
    createdAt: '2026-10-04T08:00:00.000Z',
    updatedAt: '2026-10-04T08:08:00.000Z',
    responseDeadline: '2026-10-04T08:30:00.000Z',
    resolutionDeadline: '2026-10-04T16:00:00.000Z',
    respondedAt: '2026-10-04T08:08:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 8. TICK-20261004-0003 (id: 3)
  {
    id: 3,
    ticketNumber: 'TICK-20261004-0003',
    customerId: 1,
    customerPicId: 101,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'Network Timeout ke Server',
    scopeSubtitle: 'User tidak dapat mengakses aplikasi.',
    description: 'User tidak dapat mengakses aplikasi akibat intermittent timeout ke server gateway.',
    status: 'IN_PROGRESS',
    progressPercent: 70,
    trackingToken: 'sec_astra_0003',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Network Gateway',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '32m / 30m',
    isSlaResponseBreached: true,
    slaResolutionText: '1h 10m / 8h',
    isSlaResolutionBreached: false,
    kbMatchCount: 1,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T06:15:00.000Z',
    updatedAt: '2026-10-04T07:45:00.000Z',
    responseDeadline: '2026-10-04T06:45:00.000Z',
    resolutionDeadline: '2026-10-04T14:15:00.000Z',
    respondedAt: '2026-10-04T06:47:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 9. TICK-20261003-0021 (id: 21)
  {
    id: 21,
    ticketNumber: 'TICK-20261003-0021',
    customerId: 1,
    customerPicId: 101,
    categoryId: 3,
    categoryName: 'Database',
    severity: 'HIGH',
    channel: 'PORTAL',
    title: 'Database High CPU & Query Timeout',
    scopeSubtitle: 'CPU tinggi dan transaksi lambat.',
    description: 'CPU tinggi dan transaksi lambat pada database cluster operasional.',
    status: 'PENDING',
    statusSubtext: 'Menunggu Konfirmasi',
    progressPercent: 50,
    trackingToken: 'sec_astra_0021',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Production Database',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '18m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '6h 40m / 8h',
    isSlaResolutionBreached: false,
    kbMatchCount: 4,
    actionLabel: 'Update',
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-03T11:18:00.000Z',
    responseDeadline: '2026-10-03T10:30:00.000Z',
    resolutionDeadline: '2026-10-03T18:00:00.000Z',
    respondedAt: '2026-10-03T10:18:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: true,
    pausedAt: '2026-10-03T11:00:00.000Z'
  },

  // 10. TICK-20261003-0019 (id: 19)
  {
    id: 19,
    ticketNumber: 'TICK-20261003-0019',
    customerId: 1,
    customerPicId: 101,
    categoryId: 4,
    categoryName: 'Security',
    severity: 'LOW',
    channel: 'WHATSAPP',
    title: 'Koneksi VPN / Account Locked',
    scopeSubtitle: 'User tidak bisa login VPN.',
    description: 'User tidak bisa login VPN karena akun terkunci akibat salah password.',
    status: 'RESOLVED',
    statusSubtext: 'Selesai',
    progressPercent: 100,
    trackingToken: 'sec_astra_0019',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'User Access',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '5m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '4h 10m / 24h',
    isSlaResolutionBreached: false,
    kbMatchCount: 5,
    actionLabel: 'Lihat',
    createdAt: '2026-10-03T08:00:00.000Z',
    updatedAt: '2026-10-03T12:10:00.000Z',
    responseDeadline: '2026-10-03T08:30:00.000Z',
    resolutionDeadline: '2026-10-04T08:00:00.000Z',
    respondedAt: '2026-10-03T08:05:00.000Z',
    resolvedAt: '2026-10-03T12:10:00.000Z',
    closedAt: null,
    isPaused: false
  },

  // 11. TICK-20261003-0018 (id: 18)
  {
    id: 18,
    ticketNumber: 'TICK-20261003-0018',
    customerId: 1,
    customerPicId: 101,
    categoryId: 1,
    categoryName: 'Storage',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'Storage Latency di HPE 3PAR',
    scopeSubtitle: 'Performance storage menurun.',
    description: 'Performance storage menurun pada tier FC volume cluster.',
    status: 'PENDING_VENDOR',
    statusSubtext: 'Menunggu Principal',
    progressPercent: 60,
    trackingToken: 'sec_astra_0018',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'SAN Storage Latency',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'HPE Support',
    principalCaseId: 'HP-77821',
    slaResponseText: '14m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '3h 50m / 8h',
    isSlaResolutionBreached: false,
    kbMatchCount: 2,
    actionLabel: 'Detail',
    createdAt: '2026-10-03T09:15:00.000Z',
    updatedAt: '2026-10-03T13:05:00.000Z',
    responseDeadline: '2026-10-03T09:45:00.000Z',
    resolutionDeadline: '2026-10-03T17:15:00.000Z',
    respondedAt: '2026-10-03T09:29:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: true,
    pausedAt: '2026-10-03T13:05:00.000Z'
  },

  // 12. TICK-20261003-0017 (id: 17)
  {
    id: 17,
    ticketNumber: 'TICK-20261003-0017',
    customerId: 1,
    customerPicId: 101,
    categoryId: 4,
    categoryName: 'Service Request',
    severity: 'LOW',
    channel: 'PORTAL',
    title: 'Service Restart Request',
    scopeSubtitle: 'Permintaan restart service aplikasi.',
    description: 'Permintaan restart service aplikasi pasca rotasi sertifikat SSL.',
    status: 'IN_PROGRESS',
    progressPercent: 50,
    trackingToken: 'sec_astra_0017',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Service Request',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '6m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '6h 30m / 24h',
    isSlaResolutionBreached: false,
    kbMatchCount: 1,
    actionLabel: 'Detail',
    createdAt: '2026-10-03T11:00:00.000Z',
    updatedAt: '2026-10-03T11:30:00.000Z',
    responseDeadline: '2026-10-03T11:30:00.000Z',
    resolutionDeadline: '2026-10-04T11:00:00.000Z',
    respondedAt: '2026-10-03T11:06:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 13. TICK-20261003-0015 (id: 15)
  {
    id: 15,
    ticketNumber: 'TICK-20261003-0015',
    customerId: 1,
    customerPicId: 101,
    categoryId: 4,
    categoryName: 'Application',
    severity: 'MEDIUM',
    channel: 'PHONE',
    title: 'Akses Aplikasi Internal Error',
    scopeSubtitle: 'Muncul error 500 saat akses aplikasi.',
    description: 'Muncul error 500 saat akses aplikasi internal perusahaan.',
    status: 'IN_PROGRESS',
    progressPercent: 90,
    trackingToken: 'sec_astra_0015',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'SLA-GOLD-2026',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Internal Application',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '20m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '7h 45m / 8h',
    isSlaResolutionBreached: false,
    isNearBreachFlag: true,
    kbMatchCount: 3,
    actionLabel: 'Detail',
    createdAt: '2026-10-03T07:15:00.000Z',
    updatedAt: '2026-10-03T14:50:00.000Z',
    responseDeadline: '2026-10-03T07:45:00.000Z',
    resolutionDeadline: '2026-10-03T15:15:00.000Z',
    respondedAt: '2026-10-03T07:35:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // --- C. SPECIALIST ENGINEER ASSIGNMENTS (Dwi, Rizky, Siti, Hendra, Andi, Ahmad) ---
  // 14. TICK-20261004-0010 (Dwi Prasetyo - Storage & Backup)
  {
    id: 110,
    ticketNumber: 'TICK-20261004-0010',
    customerId: 9, // PT Bank Mandiri
    customerPicId: 116,
    categoryId: 1,
    categoryName: 'Backup',
    severity: 'HIGH',
    channel: 'PORTAL',
    title: 'Rubrik CDM Backup Cluster Job Failure on Oracle DB',
    scopeSubtitle: 'Backup snapshot volume database timeout.',
    description: 'SLA backup snapshot harian database cluster terhenti akibat timeout VSS writer pada node active.',
    status: 'IN_PROGRESS',
    progressPercent: 60,
    trackingToken: 'sec_mandiri_0010',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-MND-01',
    environment: 'PROD-DC-02',
    impactScope: 'Backup & DR Data Center',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Rubrik CDM Support',
    principalCaseId: 'RBK-99021',
    slaResponseText: '10m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 45m / 4h',
    isSlaResolutionBreached: false,
    kbMatchCount: 2,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T09:00:00.000Z',
    updatedAt: '2026-10-04T10:15:00.000Z',
    responseDeadline: '2026-10-04T09:30:00.000Z',
    resolutionDeadline: '2026-10-04T13:00:00.000Z',
    respondedAt: '2026-10-04T09:10:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 15. TICK-20261004-0011 (Dwi Prasetyo - Storage & Backup)
  {
    id: 111,
    ticketNumber: 'TICK-20261004-0011',
    customerId: 2, // PT Mandiri Taspen
    customerPicId: 103,
    categoryId: 1,
    categoryName: 'Storage',
    severity: 'MEDIUM',
    channel: 'EMAIL',
    title: 'Brocade SAN Switch Port 14 CRC Error & Flapping',
    scopeSubtitle: 'Port FC mengalami framing error berulang.',
    description: 'Port FC SAN switch Brocade G620 mendeteksi lonjakan CRC error counter melebihi ambang batas 500 error/jam.',
    status: 'ASSIGNED',
    progressPercent: 20,
    trackingToken: 'sec_taspen_0011',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD ENTERPRISE',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    impactScope: 'Fabric SAN Switch',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '5h 10m / 8h',
    isSlaResolutionBreached: false,
    kbMatchCount: 3,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T08:30:00.000Z',
    updatedAt: '2026-10-04T08:45:00.000Z',
    responseDeadline: '2026-10-04T09:00:00.000Z',
    resolutionDeadline: '2026-10-04T16:30:00.000Z',
    respondedAt: '2026-10-04T08:45:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 16. TICK-20261004-0012 (Dwi Prasetyo - Storage & Backup)
  {
    id: 112,
    ticketNumber: 'TICK-20261004-0012',
    customerId: 13, // Bank Mantap
    customerPicId: 120,
    categoryId: 1,
    categoryName: 'Storage',
    severity: 'MEDIUM',
    channel: 'WHATSAPP',
    title: 'Kapasitas LUN Datastore VMS-DATA-02 Mendekati 92%',
    scopeSubtitle: 'Alokasi LUN storage tier 1 hampir habis.',
    description: 'Volume datastore storage tier 1 menyentuh ambang batas 92% pasca migrasi VM core banking.',
    status: 'ASSIGNED',
    progressPercent: 10,
    trackingToken: 'sec_mantap_0012',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD ENTERPRISE',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    impactScope: 'Datastore Capacity',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '6h 15m / 8h',
    isSlaResolutionBreached: false,
    kbMatchCount: 2,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T09:15:00.000Z',
    updatedAt: '2026-10-04T09:30:00.000Z',
    responseDeadline: '2026-10-04T09:45:00.000Z',
    resolutionDeadline: '2026-10-04T17:15:00.000Z',
    respondedAt: '2026-10-04T09:30:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 17. TICK-20261004-0020 (Rizky Pratama - Network Specialist)
  {
    id: 120,
    ticketNumber: 'TICK-20261004-0020',
    customerId: 3, // PT PJB
    customerPicId: 105,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'HIGH',
    channel: 'WHATSAPP',
    title: 'FortiGate 100F HA Synchronization Out of Sync',
    scopeSubtitle: 'Cluster firewall secondary gagal sinkronisasi.',
    description: 'Unit secondary FortiGate melaporkan status checksum mismatch pada sesi inspeksi SCADA telemetry link.',
    status: 'IN_PROGRESS',
    progressPercent: 75,
    trackingToken: 'sec_pjb_0020',
    createdById: 2,
    assignedToId: 6, // Rizky Pratama
    contractSla: 'SILVER_8X5',
    contractTier: '8x5 SILVER BUSINESS',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Security Gateway & SCADA',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Fortinet TAC Asia',
    principalCaseId: 'FTNT-55410',
    slaResponseText: '12m / 60m',
    isSlaResponseBreached: false,
    slaResolutionText: '3h 30m / 12h',
    isSlaResolutionBreached: false,
    kbMatchCount: 4,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T07:45:00.000Z',
    updatedAt: '2026-10-04T09:20:00.000Z',
    responseDeadline: '2026-10-04T08:45:00.000Z',
    resolutionDeadline: '2026-10-04T19:45:00.000Z',
    respondedAt: '2026-10-04T07:57:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 18. TICK-20261004-0021 (Rizky Pratama - Network Specialist)
  {
    id: 121,
    ticketNumber: 'TICK-20261004-0021',
    customerId: 4, // PT Telkomsel
    customerPicId: 107,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'BGP Peer Flapping & Packet Loss via Indosat Uplink',
    scopeSubtitle: 'Packet loss 18% pada interface ge-0/0/2.',
    description: 'Sesi eBGP AS65100 mengalami flap setiap 15 menit, memicu rerouting otomatis ke link backup.',
    status: 'ASSIGNED',
    progressPercent: 30,
    trackingToken: 'sec_tsel_0021',
    createdById: 2,
    assignedToId: 6, // Rizky Pratama
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL03',
    environment: 'PROD-TELCO-01',
    impactScope: 'Core WAN Gateway',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '14m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 10m / 4h',
    isSlaResolutionBreached: false,
    kbMatchCount: 1,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T10:00:00.000Z',
    updatedAt: '2026-10-04T10:14:00.000Z',
    responseDeadline: '2026-10-04T10:30:00.000Z',
    resolutionDeadline: '2026-10-04T14:00:00.000Z',
    respondedAt: '2026-10-04T10:14:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 19. TICK-20261004-0022 (Rizky Pratama - Network Specialist)
  {
    id: 122,
    ticketNumber: 'TICK-20261004-0022',
    customerId: 11, // PT Kereta Api Indonesia
    customerPicId: 118,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'Inter-VLAN Routing Stalled pada Switch Core Stasiun Gambir',
    scopeSubtitle: 'VLAN gate ticketing tidak dapat menjangkau server reservasi.',
    description: 'Trafik antara gate barrier stasiun dan backend cloud mengalami drop akibat loop spanning-tree lokal.',
    status: 'PENDING_VENDOR',
    statusSubtext: 'Menunggu Principal',
    progressPercent: 50,
    trackingToken: 'sec_kai_0022',
    createdById: 2,
    assignedToId: 6, // Rizky Pratama
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Station Gate Ticketing VLAN',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: 'Cisco Systems',
    principalCaseId: 'CSCO-88112',
    slaResponseText: '11m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 40m / 4h',
    isSlaResolutionBreached: false,
    isPaused: true,
    pausedAt: '2026-10-04T10:30:00.000Z',
    createdAt: '2026-10-04T08:00:00.000Z',
    updatedAt: '2026-10-04T10:30:00.000Z',
    responseDeadline: '2026-10-04T08:30:00.000Z',
    resolutionDeadline: '2026-10-04T12:00:00.000Z',
    respondedAt: '2026-10-04T08:11:00.000Z'
  },

  // 20. TICK-20261004-0030 (Siti Nurhaliza - Database & Cloud Specialist)
  {
    id: 130,
    ticketNumber: 'TICK-20261004-0030',
    customerId: 5, // PT FAO
    customerPicId: 109,
    categoryId: 3,
    categoryName: 'Database',
    severity: 'MEDIUM',
    channel: 'EMAIL',
    title: 'PostgreSQL Replication Delay Exceeding 900s on Secondary Node',
    scopeSubtitle: 'WAL receiver replication thread latency tinggi.',
    description: 'Replikasi data streaming PostgreSQL node secondary tertinggal 980 detik di bawah beban batch reporting.',
    status: 'IN_PROGRESS',
    progressPercent: 50,
    trackingToken: 'sec_fao_0030',
    createdById: 2,
    assignedToId: 8, // Siti Nurhaliza
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    impactScope: 'Replica Database Cluster',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: null,
    principalCaseId: null,
    slaResponseText: '18m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '1h 50m / 4h',
    isSlaResolutionBreached: false,
    kbMatchCount: 3,
    actionLabel: 'Detail',
    createdAt: '2026-10-04T08:15:00.000Z',
    updatedAt: '2026-10-04T09:30:00.000Z',
    responseDeadline: '2026-10-04T08:45:00.000Z',
    resolutionDeadline: '2026-10-04T12:15:00.000Z',
    respondedAt: '2026-10-04T08:33:00.000Z',
    resolvedAt: null,
    closedAt: null,
    isPaused: false
  },

  // 21. TICK-20261004-0031 (Siti Nurhaliza - Database Specialist)
  {
    id: 131,
    ticketNumber: 'TICK-20261004-0031',
    customerId: 9, // Bank Mandiri
    customerPicId: 116,
    categoryId: 3,
    categoryName: 'Database',
    severity: 'LOW',
    channel: 'PORTAL',
    title: 'Rotasi Tablespace Database Analytics Mandiri Terisi 95%',
    scopeSubtitle: 'Tablespace tempdb mengalami lonjakan saat batch report bulanan.',
    description: 'Partisi temporary tablespace database analytics perlu diekspansi 200 GB.',
    status: 'ASSIGNED',
    progressPercent: 15,
    trackingToken: 'sec_mnd_0031',
    createdById: 2,
    assignedToId: 8, // Siti Nurhaliza
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-MND-01',
    environment: 'PROD-DC-02',
    impactScope: 'Data Warehouse Tablespace',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '20m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '3h 10m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-10-04T09:40:00.000Z',
    updatedAt: '2026-10-04T10:00:00.000Z',
    responseDeadline: '2026-10-04T10:10:00.000Z',
    resolutionDeadline: '2026-10-04T13:40:00.000Z',
    respondedAt: '2026-10-04T10:00:00.000Z'
  },

  // 22. TICK-20260913-0002 (Hendra Kusuma - Virtualization Escalation)
  {
    id: 2,
    ticketNumber: 'TICK-20260913-0002',
    customerId: 7, // RS Siloam
    customerPicId: 112,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'VMware ESXi 8.0 Diagnostic Purple Screen (PSOD) on Hospital HIS Host-03',
    scopeSubtitle: 'Kernel panic qfle3 driver exception pada host HIS.',
    description: 'Physical ESXi host experienced kernel panic purple screen. Host isolation occurred and vSphere HA successfully restarted 14 critical clinical VMs on adjacent nodes.',
    status: 'PENDING_VENDOR',
    trackingToken: 'sec_siloam_8834c2d1',
    createdById: 2,
    assignedToId: 7, // Hendra Kusuma
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 HEALTHCARE CRITICAL',
    cluster: 'Siloam Core Hospital Information System (HIS)',
    environment: 'PROD-HEALTH-01',
    impactScope: 'Host Capacity Degraded (Cluster HA Active)',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Broadcom VMware Global Support',
    principalCaseId: 'VMW-SR-8849102',
    principalSpecialist: 'Alexander Schmidt',
    slaResponseText: '20m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 10m / 4h',
    isSlaResolutionBreached: false,
    isPaused: true,
    pausedAt: '2026-09-13T03:30:00.000Z',
    totalPausedDurationSec: 3600,
    createdAt: '2026-09-13T02:00:00.000Z',
    updatedAt: '2026-09-13T04:10:00.000Z',
    responseDeadline: '2026-09-13T02:30:00.000Z',
    resolutionDeadline: '2026-09-13T06:00:00.000Z',
    respondedAt: '2026-09-13T02:20:00.000Z'
  },

  // 23. TICK-20261004-0050 (Hendra Kusuma - Virtualization Specialist)
  {
    id: 150,
    ticketNumber: 'TICK-20261004-0050',
    customerId: 9, // Bank Mandiri
    customerPicId: 116,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'vCenter Server Appliance (VCSA) High Memory Utilization 94%',
    scopeSubtitle: 'Layanan vmware-vpxd reporting memory threshold alert.',
    description: 'Alokasi RAM VCSA menyentuh limit akibat akumulasi event log audit vSphere.',
    status: 'IN_PROGRESS',
    progressPercent: 55,
    trackingToken: 'sec_mnd_0050',
    createdById: 2,
    assignedToId: 7, // Hendra Kusuma
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-MND-01',
    environment: 'PROD-DC-02',
    impactScope: 'vCenter Appliance',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '12m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '1h 45m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-10-04T08:30:00.000Z',
    updatedAt: '2026-10-04T09:15:00.000Z',
    responseDeadline: '2026-10-04T09:00:00.000Z',
    resolutionDeadline: '2026-10-04T12:30:00.000Z',
    respondedAt: '2026-10-04T08:42:00.000Z'
  },

  // 24. TICK-20261004-0051 (Hendra Kusuma - Virtualization Specialist)
  {
    id: 151,
    ticketNumber: 'TICK-20261004-0051',
    customerId: 11, // KAI
    customerPicId: 118,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'LOW',
    channel: 'PORTAL',
    title: 'Pembaruan VMware Tools pada Cluster Web Booking KAI',
    scopeSubtitle: 'VMware tools out of date pada 18 VM Linux guest.',
    description: 'Pembaruan rutin versi open-vm-tools pada seluruh cluster VM reservation.',
    status: 'ASSIGNED',
    progressPercent: 10,
    trackingToken: 'sec_kai_0051',
    createdById: 2,
    assignedToId: 7, // Hendra Kusuma
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Reservation VM Cluster',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 50m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-10-04T09:00:00.000Z',
    updatedAt: '2026-10-04T09:15:00.000Z',
    responseDeadline: '2026-10-04T09:30:00.000Z',
    resolutionDeadline: '2026-10-04T13:00:00.000Z',
    respondedAt: '2026-10-04T09:15:00.000Z'
  },

  // 25. TICK-20261004-0040 (Andi Wijaya - Senior Cloud & Network Engineer)
  {
    id: 140,
    ticketNumber: 'TICK-20261004-0040',
    customerId: 6, // PT Bank Central Asia Tbk
    customerPicId: 110,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'Cisco ACI Leaf Switch Spine Link CRC Error Count di Cikarang DC',
    scopeSubtitle: 'Port QSFP28 Fabric spine-leaf mengalami framing discard.',
    description: 'Interface leaf-101 port 1/49 mendeteksi akumulasi CRC counter pada link interkoneksi spine ACI.',
    status: 'ASSIGNED',
    progressPercent: 20,
    trackingToken: 'sec_bca_0040',
    createdById: 2,
    assignedToId: 9, // Andi Wijaya
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Data Center Fabric ACI',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 30m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-10-04T08:20:00.000Z',
    updatedAt: '2026-10-04T08:35:00.000Z',
    responseDeadline: '2026-10-04T08:50:00.000Z',
    resolutionDeadline: '2026-10-04T12:20:00.000Z',
    respondedAt: '2026-10-04T08:35:00.000Z'
  },

  // 26. TICK-20261004-0041 (Andi Wijaya - Cloud & Network)
  {
    id: 141,
    ticketNumber: 'TICK-20261004-0041',
    customerId: 12, // PT Bio Farma
    customerPicId: 119,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'MEDIUM',
    channel: 'EMAIL',
    title: 'Cold Chain IoT Gateway Linux Server NTP Clock Drifting',
    scopeSubtitle: 'Offset jam sistem telemetry cold chain bergeser 14 detik.',
    description: 'Layanan chrony pada server gateway telemetri cold chain gagal sinkronisasi ke upstream NTP server internal.',
    status: 'IN_PROGRESS',
    progressPercent: 60,
    trackingToken: 'sec_bio_0041',
    createdById: 2,
    assignedToId: 9, // Andi Wijaya
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD ENTERPRISE',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Cold Chain Monitoring Sensor',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '12m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '4h 10m / 8h',
    isSlaResolutionBreached: false,
    createdAt: '2026-10-04T09:00:00.000Z',
    updatedAt: '2026-10-04T09:45:00.000Z',
    responseDeadline: '2026-10-04T09:30:00.000Z',
    resolutionDeadline: '2026-10-04T17:00:00.000Z',
    respondedAt: '2026-10-04T09:12:00.000Z'
  },

  // 27. TICK-20261004-0042 (Andi Wijaya - Cloud & Network)
  {
    id: 142,
    ticketNumber: 'TICK-20261004-0042',
    customerId: 10, // PT PGN
    customerPicId: 117,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'LOW',
    channel: 'PORTAL',
    title: 'IPsec VPN Tunnel SCADA Kantor Pusat ke Stasiun Kompresor Pagardewa Flapping',
    scopeSubtitle: 'Phase-2 IKE rekeying renegotiation timeout.',
    description: 'Tunnel VPN point-to-point antara router Cisco PGN mengalami intermittent disconnect setiap 8 jam.',
    status: 'PENDING_VENDOR',
    statusSubtext: 'Menunggu Principal',
    progressPercent: 40,
    trackingToken: 'sec_pgn_0042',
    createdById: 2,
    assignedToId: 9, // Andi Wijaya
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD ENTERPRISE',
    cluster: 'PROD-CL03',
    environment: 'PROD-DC-03',
    impactScope: 'Telemetry Remote Branch VPN',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: 'Telkom Astinet Support',
    principalCaseId: 'TLK-99021',
    slaResponseText: '25m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '5h 30m / 8h',
    isSlaResolutionBreached: false,
    isPaused: true,
    pausedAt: '2026-10-04T10:15:00.000Z',
    createdAt: '2026-10-04T07:30:00.000Z',
    updatedAt: '2026-10-04T10:15:00.000Z',
    responseDeadline: '2026-10-04T08:00:00.000Z',
    resolutionDeadline: '2026-10-04T15:30:00.000Z',
    respondedAt: '2026-10-04T07:55:00.000Z'
  },

  // 28. TICK-20261004-0060 (Ahmad Fauzi - SysAdmin / Escalation Lead)
  {
    id: 160,
    ticketNumber: 'TICK-20261004-0060',
    customerId: 6, // BCA
    customerPicId: 110,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'CRITICAL',
    channel: 'PORTAL',
    title: 'Active Directory Domain Controller Primary Node DNS Replication Failure',
    scopeSubtitle: 'Kerberos authentication latency pada terminal ATM Cikarang.',
    description: 'Domain Controller DC-01 melaporkan DNS service RPC error memicu failover login LDAP ke DC-02.',
    status: 'IN_PROGRESS',
    progressPercent: 70,
    trackingToken: 'sec_bca_0060',
    createdById: 2,
    assignedToId: 1, // Ahmad Fauzi
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Active Directory Core Auth',
    isEmailSync: true,
    isProposeKb: true,
    slaResponseText: '8m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '1h 15m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-10-04T09:10:00.000Z',
    updatedAt: '2026-10-04T10:20:00.000Z',
    responseDeadline: '2026-10-04T09:40:00.000Z',
    resolutionDeadline: '2026-10-04T13:10:00.000Z',
    respondedAt: '2026-10-04T09:18:00.000Z'
  },

  // 29. TICK-20261004-0061 (Ahmad Fauzi - SysAdmin)
  {
    id: 161,
    ticketNumber: 'TICK-20261004-0061',
    customerId: 9, // Mandiri
    customerPicId: 116,
    categoryId: 1,
    categoryName: 'Server',
    severity: 'MEDIUM',
    channel: 'EMAIL',
    title: 'Cluster Node 03 HPE Synergy Compute Module Thermal Sensor Degraded',
    scopeSubtitle: 'Suhu modul prosessor 2 melaporkan status warning 78°C.',
    description: 'Sensor iLO mendeteksi penurunan rpm kipas pendingin zona 3 pada enclosure Cikarang.',
    status: 'ASSIGNED',
    progressPercent: 20,
    trackingToken: 'sec_mnd_0061',
    createdById: 2,
    assignedToId: 1, // Ahmad Fauzi
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-MND-01',
    environment: 'PROD-DC-02',
    impactScope: 'Synergy Enclosure Zone 3',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 45m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-10-04T09:30:00.000Z',
    updatedAt: '2026-10-04T09:45:00.000Z',
    responseDeadline: '2026-10-04T10:00:00.000Z',
    resolutionDeadline: '2026-10-04T13:30:00.000Z',
    respondedAt: '2026-10-04T09:45:00.000Z'
  },

  // 30. TICK-20260913-0001 (Legacy Core Budi Santoso)
  {
    id: 1,
    ticketNumber: 'TICK-20260913-0001',
    customerId: 2, // Mandiri Taspen
    customerPicId: 103,
    categoryId: 1,
    categoryName: 'Storage',
    severity: 'HIGH',
    channel: 'PORTAL',
    title: 'HPE 3PAR Storage Controller Node 0 Offline & Host Multipath Failover',
    scopeSubtitle: 'Controller Node 0 status Degraded setelah unmap queue burst.',
    description: 'Customer reported that VMware datastore experienced path latency spikes following scheduled SAN controller failover.',
    status: 'RESOLVED',
    progressPercent: 100,
    trackingToken: 'sec_ahm_9912a7f8',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD ENTERPRISE',
    cluster: 'PROD-CL02',
    environment: 'PROD-DC-02',
    impactScope: 'Production Core Datastores',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Hewlett Packard Enterprise Global Support Desk',
    principalCaseId: 'HPE-2026-004821',
    principalSpecialist: 'Marcus Vance',
    slaResponseText: '10m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '4h 10m / 8h',
    isSlaResolutionBreached: false,
    createdAt: '2026-09-13T03:15:00.000Z',
    updatedAt: '2026-09-13T07:25:00.000Z',
    responseDeadline: '2026-09-13T03:45:00.000Z',
    resolutionDeadline: '2026-09-13T11:15:00.000Z',
    respondedAt: '2026-09-13T03:25:00.000Z',
    resolvedAt: '2026-09-13T07:25:00.000Z',
    closedAt: null,
    isPaused: false
  },

  // 31. TICK-20260912-0002 (Legacy Closed Bank Mandiri Rubrik)
  {
    id: 60,
    ticketNumber: 'TICK-20260912-0002',
    customerId: 9, // Bank Mandiri
    customerPicId: 116,
    categoryId: 1,
    categoryName: 'Backup',
    severity: 'MEDIUM',
    channel: 'PORTAL',
    title: 'Bank Mandiri: Rubrik CDM Backup Job Timeout on Oracle Archive Volumes',
    scopeSubtitle: 'Freeze timeout window pada database client terlalu singkat (30s).',
    description: 'Rubrik CDM snapshot job timed out while waiting for storage freeze acknowledgement during peak batch transaction balancing.',
    status: 'CLOSED',
    progressPercent: 100,
    trackingToken: 'sec_mnd_99221100',
    createdById: 2,
    assignedToId: 4, // Budi Santoso
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-MND-01',
    environment: 'PROD-DC-02',
    impactScope: 'Backup SLA Domain Gold',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Rubrik Enterprise Customer Support',
    principalCaseId: 'RBK-2026-10499',
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '3h 30m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-09-12T05:00:00.000Z',
    updatedAt: '2026-09-12T11:00:00.000Z',
    responseDeadline: '2026-09-12T05:30:00.000Z',
    resolutionDeadline: '2026-09-12T09:00:00.000Z',
    respondedAt: '2026-09-12T05:15:00.000Z',
    resolvedAt: '2026-09-12T08:30:00.000Z',
    closedAt: '2026-09-12T11:00:00.000Z',
    isPaused: false
  },

  // 32. TICK-20260911-0001 (Legacy Closed AHM BGP Flapping)
  {
    id: 70,
    ticketNumber: 'TICK-20260911-0001',
    customerId: 1, // PT Astra
    customerPicId: 102,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'PT Astra: Intermittent BGP Route Flapping on Primary WAN MPLS',
    scopeSubtitle: 'Jalur data Plant 3 ke Sunter mengalami route flapping.',
    description: 'BGP session state flapping between Established and Active due to carrier transport MTU mismatch causing keepalive drops.',
    status: 'CLOSED',
    progressPercent: 100,
    trackingToken: 'sec_ahm_55110099',
    createdById: 2,
    assignedToId: 6, // Rizky Pratama
    contractSla: 'GOLD_8X5',
    contractTier: '8x5 GOLD INDUSTRIAL SLA',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'WAN Interconnect Plant 3',
    isEmailSync: true,
    isProposeKb: true,
    principalVendor: 'Cisco Systems TAC',
    principalCaseId: 'CSCO-699210',
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '4h 15m / 8h',
    isSlaResolutionBreached: false,
    createdAt: '2026-09-11T02:00:00.000Z',
    updatedAt: '2026-09-11T08:00:00.000Z',
    responseDeadline: '2026-09-11T02:30:00.000Z',
    resolutionDeadline: '2026-09-11T10:00:00.000Z',
    respondedAt: '2026-09-11T02:15:00.000Z',
    resolvedAt: '2026-09-11T06:30:00.000Z',
    closedAt: '2026-09-11T08:00:00.000Z',
    isPaused: false
  },

  // 33. TICK-20260910-0001 (Legacy Resolved BCA Cisco Nexus Spine)
  {
    id: 80,
    ticketNumber: 'TICK-20260910-0001',
    customerId: 6, // BCA
    customerPicId: 110,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'LOW',
    channel: 'PORTAL',
    title: 'PT Bank Central Asia Tbk: Maintenance Window Firmware Upgrade Cisco Nexus Spine',
    scopeSubtitle: 'Non-disruptive ISSU upgrade NX-OS 9.3(10) pada Nexus 9336C-FX2.',
    description: 'In-Service Software Upgrade (ISSU) on core data center spine switches in accordance with annual security audit compliance.',
    status: 'RESOLVED',
    progressPercent: 100,
    trackingToken: 'sec_bca_33001199',
    createdById: 2,
    assignedToId: 6, // Rizky Pratama
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Scheduled Maintenance Window',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '20m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '5h 30m / 8h',
    isSlaResolutionBreached: false,
    createdAt: '2026-09-10T14:00:00.000Z',
    updatedAt: '2026-09-10T19:30:00.000Z',
    responseDeadline: '2026-09-10T15:00:00.000Z',
    resolutionDeadline: '2026-09-10T22:00:00.000Z',
    respondedAt: '2026-09-10T14:20:00.000Z',
    resolvedAt: '2026-09-10T19:30:00.000Z',
    closedAt: null,
    isPaused: false
  },

  // 34. TICK-20260912-0001 (Legacy Resolved Diskominfo Tangsel)
  {
    id: 50,
    ticketNumber: 'TICK-20260912-0001',
    customerId: 8, // Diskominfo Tangsel
    customerPicId: 114,
    categoryId: 3,
    categoryName: 'Application',
    severity: 'MEDIUM',
    channel: 'EMAIL',
    title: 'Diskominfo Tangsel: Portal Layanan Publik 502 Bad Gateway Pasca Patch Kernel',
    scopeSubtitle: 'Systemd service php8.2-fpm failed to bind to UNIX socket.',
    description: 'Systemd service php8.2-fpm failed to bind to UNIX socket /run/php/php8.2-fpm.sock due to permission mismatch following automated OS kernel update.',
    status: 'RESOLVED',
    progressPercent: 100,
    trackingToken: 'sec_tng_4433bb11',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo
    contractSla: 'GOV_TIER1',
    contractTier: 'GOVERNMENT TIER-1 (8x5)',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-TANGSEL',
    impactScope: 'Portal Perizinan Publik Kota',
    isEmailSync: true,
    isProposeKb: true,
    slaResponseText: '30m / 60m',
    isSlaResponseBreached: false,
    slaResolutionText: '2h 50m / 12h',
    isSlaResolutionBreached: false,
    createdAt: '2026-09-12T01:00:00.000Z',
    updatedAt: '2026-09-12T04:20:00.000Z',
    responseDeadline: '2026-09-12T02:00:00.000Z',
    resolutionDeadline: '2026-09-12T13:00:00.000Z',
    respondedAt: '2026-09-12T01:30:00.000Z',
    resolvedAt: '2026-09-12T04:20:00.000Z',
    closedAt: null,
    isPaused: false
  },

  // 35. TICK-20260913-0003 (Core Assigned to Dwi Prasetyo)
  {
    id: 30,
    ticketNumber: 'TICK-20260913-0003',
    customerId: 6, // BCA
    customerPicId: 110,
    categoryId: 2,
    categoryName: 'Network',
    severity: 'HIGH',
    channel: 'EMAIL',
    title: 'Core Banking SAN Switch Brocade G620 FC Port 14 CRC Error & Flapping',
    scopeSubtitle: 'Rx Power attenuation pada Port 14 Brocade Switch Fabric-A.',
    description: 'SAN Optical link reporting severe frame CRC discards and credit loss warnings, impacting backup bandwidth throughput to secondary data lake.',
    status: 'ASSIGNED',
    progressPercent: 20,
    trackingToken: 'sec_bca_7712bb90',
    createdById: 2,
    assignedToId: 5, // Dwi Prasetyo
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL01',
    environment: 'PROD-DC-01',
    impactScope: 'Fabric SAN Throughput Redundancy',
    isEmailSync: true,
    isProposeKb: false,
    principalVendor: 'Brocade / Broadcom Fabric Support',
    principalCaseId: 'BRCD-2026-9021',
    slaResponseText: '15m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '3h 45m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-09-13T04:00:00.000Z',
    updatedAt: '2026-09-13T04:15:00.000Z',
    responseDeadline: '2026-09-13T04:30:00.000Z',
    resolutionDeadline: '2026-09-13T08:00:00.000Z',
    respondedAt: '2026-09-13T04:15:00.000Z'
  },

  // 36. TICK-20260913-0004 (Core Open Telkomsel Read Replica)
  {
    id: 40,
    ticketNumber: 'TICK-20260913-0004',
    customerId: 4, // Telkomsel
    customerPicId: 108,
    categoryId: 3,
    categoryName: 'Database',
    severity: 'HIGH',
    channel: 'PORTAL',
    title: 'Billing Database PostgreSQL Read Replica Replication Lag Exceeding 900s',
    scopeSubtitle: 'PostgreSQL wal receiver thread reporting I/O bottleneck.',
    description: 'PostgreSQL cluster billing mediation Telkomsel node slave mengalami replication delay 940 detik. Query reporting transaksi pelanggan tertunda.',
    status: 'OPEN',
    progressPercent: 0,
    trackingToken: 'sec_tsel_1188aa44',
    createdById: 2,
    assignedToId: null, // UNASSIGNED!
    contractSla: 'PLATINUM_24X7',
    contractTier: '24x7 PLATINUM MISSION CRITICAL',
    cluster: 'PROD-CL03',
    environment: 'PROD-TELCO-01',
    impactScope: 'Customer CDR Billing Real-time Sync',
    isEmailSync: true,
    isProposeKb: false,
    slaResponseText: '20m / 30m',
    isSlaResponseBreached: false,
    slaResolutionText: '3h 30m / 4h',
    isSlaResolutionBreached: false,
    createdAt: '2026-09-13T04:35:00.000Z',
    updatedAt: '2026-09-13T04:35:00.000Z',
    responseDeadline: '2026-09-13T05:05:00.000Z',
    resolutionDeadline: '2026-09-13T08:35:00.000Z'
  }
];

/**
 * Procedural Historical Ticket Generator:
 * Creates realistic resolved/closed enterprise tickets to bring the grand total to exactly 156 tickets,
 * calibrated to match the 30-day corporate benchmark from Mockup Frame 09:
 * - Top Categories: Server (42), Network (30), Storage (24), Backup (18), Application (12), Other (30)
 * - Severity: Critical/P1 (12), High/P2 (24), Medium/P3 (58), Low/P4 (62)
 * - Status: Closed/Solved (120), Active (36: Open 12, In Progress 18, Hold 6) -> 156 Total
 * - SLA Compliance: 98%
 */
function generateHistoricalTickets(existingTickets) {
  const targetTotal = 156;
  const needed = targetTotal - existingTickets.length;
  if (needed <= 0) return [];

  // Realistic incident scenarios spanning corporate ITIL categories
  const scenarios = [
    { catId: 1, catName: 'Server', title: 'VMware ESXi Host Isolation & HA Restart', sev: 'HIGH', rootCause: 'Switch port failover transient packet drop memicu isolasi host pada cluster 1.' },
    { catId: 1, catName: 'Server', title: 'HPE ProLiant DL380 Gen10 Power Supply Fault Trip', sev: 'MEDIUM', rootCause: 'Modul PSU-2 mengalami voltage drop, otomatis beralih ke grid redundant PSU-1.' },
    { catId: 1, catName: 'Server', title: 'Cisco UCS Blade Server DIMM Memory Correctable ECC Error', sev: 'LOW', rootCause: 'Single bit ECC alert pada socket 1 channel B, dilakukan reseat RAM modul.' },
    { catId: 1, catName: 'Server', title: 'Dell PowerEdge R750 iDRAC Firmware Vulnerability Patch', sev: 'LOW', rootCause: 'Penerapan patch keamanan CVE-2026-2189 pada controller out-of-band iDRAC9.' },
    { catId: 2, catName: 'Network', title: 'FortiGate 200F IPS Signature Update High CPU Spike', sev: 'MEDIUM', rootCause: 'Engine inspeksi pattern scanning menderita lock thread saat database signature terkompresi.' },
    { catId: 2, catName: 'Network', title: 'Cisco Catalyst 9300 Core Switch Stack-Port Flapping', sev: 'HIGH', rootCause: 'Kabel StackWise 480 mengalami kelonggaran pengunci fisik pada switch member 2.' },
    { catId: 2, catName: 'Network', title: 'MikroTik CCR2004 BGP Peering Route-Reflector Memory Overflow', sev: 'HIGH', rootCause: 'Penerimaan full routing table tanpa prefix filter dari peer eksternal.' },
    { catId: 2, catName: 'Network', title: 'Aruba 2930F Access Point PoE Budget Exceeded on Floor 3', sev: 'LOW', rootCause: 'Konsumsi daya AP AP-515 melebihi batas 370W, dilakukan re-balancing port PoE.' },
    { catId: 1, catName: 'Storage', title: 'NetApp FAS8300 Aggregate Disk Rebalancing & Scrubbing', sev: 'MEDIUM', rootCause: 'Proses disk scrubbing mingguan memicu kenaikan IOPS latency pada SATA volume pool.' },
    { catId: 1, catName: 'Storage', title: 'HPE Primera NVRAM Battery Unit (BBU) Learning Cycle', sev: 'LOW', rootCause: 'Siklus kalibrasi baterai otomatis beralih ke cache write-through selama 4 jam.' },
    { catId: 1, catName: 'Storage', title: 'Pure Storage FlashArray DirectFlash Module Predictive Failure', sev: 'HIGH', rootCause: 'Sensor SMART mendeteksi wear-level flash cell melampaui 94%, part diganti garansi OEM.' },
    { catId: 1, catName: 'Backup', title: 'Veeam Backup & Replication Scale-Out Repository Disk Full', sev: 'HIGH', rootCause: 'Retensi GFS backup bulanan tidak ter-purge otomatis akibat snapshot kuncian database.' },
    { catId: 1, catName: 'Backup', title: 'Commvault Simpana MediaAgent Job Stalled on Tape Library', sev: 'MEDIUM', rootCause: 'Mekanik arm robotik LTO-8 tape drive mendeteksi kaset terjepit pada slot 14.' },
    { catId: 1, catName: 'Backup', title: 'Rubrik CDM Snapshot Synthetic Full Consolidation Latency', sev: 'LOW', rootCause: 'Jendela deduping cluster bentrok dengan batch job ETL reporting akhir bulan.' },
    { catId: 3, catName: 'Application', title: 'Oracle RAC Database ORA-00060 Deadlock Detected on Billing Table', sev: 'HIGH', rootCause: 'Eksekusi transaksi batch update tanpa indeks penopang memicu mutually exclusive row locks.' },
    { catId: 3, catName: 'Application', title: 'Nginx Reverse Proxy SSL Certificate Expiry on API Gateway', sev: 'MEDIUM', rootCause: 'Cron script certbot renewal gagal memverifikasi challenge ACME HTTP-01.' },
    { catId: 3, catName: 'Application', title: 'RabbitMQ Message Broker Queue High Unacknowledged Count', sev: 'MEDIUM', rootCause: 'Consumer worker container mengalami memory OOM saat memproses lonjakan pesan.' },
    { catId: 4, catName: 'Security', title: 'Active Directory User Account Bulk Password Expiration Lockout', sev: 'LOW', rootCause: 'Kebijakan 90 hari GPO memicu lonjakan tiket reset credential karyawan cabang.' },
    { catId: 4, catName: 'Security', title: 'VPN FortiClient Certificate Trust Chain Invalidation', sev: 'LOW', rootCause: 'Root CA internal diperbarui tanpa registrasi otomatis pada trust store Windows endpoint.' },
    { catId: 5, catName: 'Workstation', title: 'Workstation Financial Controller Blue Screen of Death (BSOD)', sev: 'LOW', rootCause: 'Driver printer jaringan PCL6 bentrok dengan Windows Update patch KB5034441.' }
  ];

  const generated = [];
  const engineers = [1, 4, 5, 6, 7, 8, 9];
  const customers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  for (let i = 0; i < needed; i++) {
    const scenario = scenarios[i % scenarios.length];
    const customerId = customers[i % customers.length];
    const assignedToId = engineers[i % engineers.length];
    const id = 300 + i;
    
    // Spread dates dynamically across the last 28 days relative to BASE_TIME
    // First ~10 tickets within 24h, next ~35 within 7 days, next ~35 within 14 days, rest up to 28 days
    let daysAgo = 0;
    if (i < 8) {
      daysAgo = 0; // Today
    } else if (i < 38) {
      daysAgo = 1 + Math.floor(((i - 8) / 30) * 6); // 1 - 6 days ago (Within 7d)
    } else if (i < 78) {
      daysAgo = 7 + Math.floor(((i - 38) / 40) * 7); // 7 - 13 days ago (Within 14d)
    } else {
      daysAgo = 14 + Math.floor(((i - 78) / (needed - 78)) * 14); // 14 - 28 days ago (Within 30d)
    }

    const hourOffset = (i * 3) % 20;
    const ticketTimestamp = BASE_TIME - (daysAgo * 24 * 3600 * 1000) - (hourOffset * 3600 * 1000) - ((i * 17) % 60) * 60 * 1000;
    const ticketDate = new Date(ticketTimestamp);
    
    const isClosed = i % 3 !== 0; // ~66% Closed, ~33% Resolved
    const status = isClosed ? 'CLOSED' : 'RESOLVED';
    
    const createdAt = ticketDate.toISOString();
    const resolvedAt = new Date(ticketTimestamp + (2 + (i % 4)) * 3600 * 1000).toISOString();
    const closedAt = isClosed ? new Date(ticketTimestamp + (4 + (i % 3)) * 3600 * 1000).toISOString() : null;

    const y = ticketDate.getFullYear();
    const m = String(ticketDate.getMonth() + 1).padStart(2, '0');
    const d = String(ticketDate.getDate()).padStart(2, '0');
    const seqStr = String(200 + i + 1).padStart(4, '0');
    const ticketNumber = `TICK-${y}${m}${d}-${seqStr}`;

    generated.push({
      id,
      ticketNumber,
      customerId,
      customerPicId: 100 + customerId,
      categoryId: scenario.catId,
      categoryName: scenario.catName,
      severity: scenario.sev,
      channel: (i % 4 === 0) ? 'WHATSAPP' : (i % 3 === 0) ? 'PORTAL' : 'EMAIL',
      title: `${scenario.title} (#${seqStr})`,
      scopeSubtitle: `Insiden operasional terselesaikan sesuai target SLA.`,
      description: `Laporan penanganan insiden infrastruktur enterprise. ${scenario.rootCause}`,
      status,
      progressPercent: 100,
      trackingToken: `sec_hist_${customerId}_${seqStr}`,
      createdById: 2,
      assignedToId,
      contractSla: 'PLATINUM_24X7',
      contractTier: 'ENTERPRISE SLA STANDARD',
      cluster: `PROD-CL0${(i % 3) + 1}`,
      environment: `PROD-DC-0${(i % 2) + 1}`,
      impactScope: 'Standard Enterprise SLA',
      isEmailSync: true,
      isProposeKb: i % 5 === 0,
      principalVendor: (i % 3 === 0) ? 'Vendor Enterprise Support' : null,
      principalCaseId: (i % 3 === 0) ? `VR-${1000 + i}` : null,
      slaResponseText: '15m / 30m',
      isSlaResponseBreached: false,
      slaResolutionText: '3h 30m / 8h',
      isSlaResolutionBreached: false,
      kbMatchCount: (i % 4) + 1,
      actionLabel: 'Detail',
      createdAt,
      updatedAt: resolvedAt,
      responseDeadline: new Date(ticketTimestamp + 45 * 60 * 1000).toISOString(),
      resolutionDeadline: new Date(ticketTimestamp + 8 * 3600 * 1000).toISOString(),
      respondedAt: new Date(ticketTimestamp + 25 * 60 * 1000).toISOString(),
      resolvedAt,
      closedAt,
      isPaused: false,
      rootCause: scenario.rootCause,
      resolutionStrategy: 'Penerapan mitigasi sesuai standar runbook ITIL dan verifikasi telemetri performa sistem.',
      milestones: [
        { id: 1, stepName: 'Insiden Diterima', status: 'OPEN', actorName: 'Rina Anggraini', actorRole: 'Admin', notes: 'Laporan insiden dicatat dalam antrean Helpdesk GTT.', timestampUtc: createdAt, proofFile: null },
        { id: 2, stepName: 'Penugasan Teknisi', status: 'ASSIGNED', actorName: 'Support Lead', actorRole: 'CPIG', notes: 'Penugasan teknisi on-duty.', timestampUtc: createdAt, proofFile: null },
        { id: 3, stepName: 'Resolusi Selesai', status: 'RESOLVED', actorName: 'Support Engineer', actorRole: 'Engineer', notes: 'Solusi berhasil diterapkan dan layanan kembali normal 100%.', timestampUtc: resolvedAt, proofFile: null }
      ],
      attachments: []
    });
  }

  return generated;
}

export const INITIAL_TICKETS = [
  ...PRIMARY_CANONICAL_TICKETS,
  ...generateHistoricalTickets(PRIMARY_CANONICAL_TICKETS)
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
