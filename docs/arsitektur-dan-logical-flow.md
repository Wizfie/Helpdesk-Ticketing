# Arsitektur Sistem & Logical Flow: Helpdesk Ticketing Enterprise PT Global Transformasi Teknologi (GTT)

Dokumen ini disusun sebagai materi presentasi, pengujian sistem, dan diskusi teknis lanjutan bersama stakeholder/penguji. Dokumen ini merangkum arsitektur menyeluruh, matriks kewenangan peran (RBAC), alur logika bisnis penanganan tiket, serta mekanisme *Dual SLA Engine*.

---

## 1. Ringkasan Eksekutif & Karakteristik Sistem

Aplikasi Helpdesk Ticketing PT Global Transformasi Teknologi (GTT) dirancang menggunakan standar tata kelola **ITIL v4 Service Operation** untuk mengelola infrastruktur data center multi-vendor *(HPE, VMware, Cisco, Brocade, Rubrik, Oracle)* pada 6 klien korporat tier-enterprise.

### Pilar Utama Solusi:
1. **Dynamic Contractual SLA Engine**: Target waktu *Response SLA* (First Touch) dan *Resolution SLA* (Net MTTR) dikalkulasi secara otomatis berdasarkan tier kontrak PKS klien (Platinum 24x7, Gold 8x5, Silver, Government Tier-1) tanpa input manual operator.
2. **Dual SLA Clock & Audit Pause**: Mendukung mekanisme penahanan jam kerja resmi (*SLA Clock Pause*) saat menunggu ketersediaan suku cadang principal vendor atau konfirmasi pelanggan.
3. **Strict Enterprise RBAC**: Pemisahan peran yang tegas antara **ADMIN / CPIG** (triage, penugasan, master data, customer liaison) dan **SUPPORT ENGINEER** (penanganan teknis, timeline diagnosa, RCA, resolusi).
4. **Email Relay Dispatcher**: Seluruh alert eskalasi tiket baru, milestone update, dan SLA breach warning dikirimkan melalui **Email Relay resmi korporat**.
5. **Integrated ITIL Runbook Knowledge Base**: Solusi dari tiket yang terselesaikan dapat langsung diajukan menjadi panduan SOP teknis terverifikasi.

---

## 2. Diagram Arsitektur Sistem (Multi-Tier Architecture)

```mermaid
graph TB
    subgraph Client_Tier["1. PRESENTATION & CLIENT TIER"]
        UI_Admin["Console Admin / CPIG<br/>(Dashboard, Triage, SLA Config, Reports)"]
        UI_Engineer["Console Support Engineer<br/>(Incident Workspace, Timeline, RCA)"]
        UI_Public["Public Tracking Portal<br/>(/track/:ticketNumber?token=...)"]
    end

    subgraph App_Tier["2. APPLICATION & LOGIC ENGINE (VUE 3 SPA)"]
        Router["Vue Router (RBAC Guard & Route Protection)"]
        Pinia_Store["State Management (Pinia Stores)"]
        
        subgraph Core_Engines["Core Business Engines"]
            SLA_Engine["Dual SLA Calculation & Timer Engine"]
            Escalation_Engine["3-Stage Automated Escalation Engine"]
            RBAC_Engine["Role-Based Security Policy Engine"]
            Ingestion_Engine["Quick Presets & Intake Processor"]
            KB_Engine["ITIL Knowledge Base & Runbooks Manager"]
        end
    end

    subgraph Integration_Tier["3. INTEGRATION & COMMUNICATION TIER"]
        Email_Dispatcher["SMTP Email Relay Dispatcher<br/>(helpdesk@glotratech.com)"]
        Principal_Bridge["Technology Principal Bridge L3<br/>(HPE InfoSight, Cisco TAC, VMware SR)"]
        Audit_Logger["Immutable Audit Trail Engine<br/>(RFC-4180 / ISO 20000 Compliant)"]
    end

    subgraph Data_Tier["4. DATA & PERSISTENCE TIER"]
        Local_Storage["Browser LocalStorage HA Cache<br/>(Auto Schema Migration v2.4)"]
        Rest_API["Backend REST API Services<br/>(Future Microservices Target)"]
    end

    UI_Admin --> Router
    UI_Engineer --> Router
    UI_Public --> Router

    Router --> Pinia_Store
    Pinia_Store --> Core_Engines

    SLA_Engine --> Email_Dispatcher
    SLA_Engine --> Escalation_Engine
    Core_Engines --> Principal_Bridge
    Core_Engines --> Audit_Logger

    Pinia_Store --> Local_Storage
    Pinia_Store -.-> Rest_API
```

---

## 3. Matriks Hak Akses Peran (Role-Based Access Control)

Sistem menerapkan prinsip *Least Privilege* dengan 2 peran internal dan 1 mode akses publik klien:

| Fitur / Modul Sistem | ADMIN / CPIG | SUPPORT ENGINEER | CUSTOMER (Tokenized) |
|---|:---:|:---:|:---:|
| **Mission Control Dashboard** (`/dashboard`) | Full Telemetry & All Roster | Personal Shift Telemetry | Tidak Ada Akses |
| **Penerbitan Tiket Baru** (`/tickets/create`) | Full Form & Quick Presets | Create on Incident | Tidak Ada Akses |
| **Alokasi / Reassign Teknisi** | Full Control | Read-Only | Tidak Ada Akses |
| **Bagikan Link Customer** | **Akses Penuh** | Disembunyikan | Tidak Ada Akses |
| **Pratinjau Email Notifikasi** | **Akses Penuh** | Disembunyikan | Tidak Ada Akses |
| **Toggle Email Dispatch Sync** | **Bisa Ubah ON/OFF** | Status Read-Only | Tidak Ada Akses |
| **Tambah Milestone Diagnosa** | Boleh Menambah | **Aktor Utama** | Tidak Ada Akses |
| **Request / Resume SLA Pause** | Validasi & Eksekusi | **Aktor Utama** | Tidak Ada Akses |
| **Resolve & Form RCA / Solusi** | Verifikasi & Resolve | **Aktor Utama** | Tidak Ada Akses |
| **Konfigurasi Matriks SLA** (`/admin/sla-configuration`) | **Akses Penuh (Edit/Add)** | Akses Ditolak (403) | Tidak Ada Akses |
| **Manajemen Klien & PIC** (`/admin/customers`) | **Akses Penuh** | Akses Ditolak (403) | Tidak Ada Akses |
| **Manajemen Staf** (`/admin/users`) | **Akses Penuh** | Akses Ditolak (403) | Tidak Ada Akses |
| **Ekspor Laporan Eksekutif** (`/reports`) | **Akses Penuh (Cetak/Excel)** | Akses Ditolak (403) | Tidak Ada Akses |
| **Knowledge Base Runbooks** (`/knowledge-base`) | Approve & Publish | Propose & Read | Read-Only SOP Terkait |
| **Portal Pelacakan Tiket** (`/track/:ticketNumber`) | Monitoring View | Monitoring View | **Akses Penuh Mandiri** |

---

## 4. Logical Flow: Siklus Hidup Penanganan Tiket (End-to-End)

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Klien / PIC Pelanggan
    actor Admin as Admin / CPIG (Helpdesk)
    actor Engineer as Support Engineer
    actor Principal as OEM Principal (HPE/Cisco/VMware)
    participant System as Sistem Helpdesk GTT (Dual SLA Engine)

    %% 1. INTAKE & CREATION
    Customer->>Admin: Laporkan insiden (Email / Portal / WhatsApp)
    Admin->>System: Input tiket (Pilih Customer & Severity)
    activate System
    System->>System: Hitung batas waktu SLA otomatis<br/>(Response Deadline & Resolution Deadline)
    System->>System: Terbitkan Nomor Tiket & Token Tracking
    System-->>Engineer: Dispatch Email Alert Penugasan (Prioritas Tinggi)
    System-->>Customer: Dispatch Email Konfirmasi Tiket & Link Pelacakan
    deactivate System

    %% 2. FIRST TOUCH ACKNOWLEDGEMENT
    Engineer->>System: Acknowledge tiket & ubah status ke IN_PROGRESS
    activate System
    System->>System: Hentikan timer Response SLA (First Touch SLA Terpenuhi)
    System->>System: Catat audit trail respon awal teknisi
    deactivate System

    %% 3. DIAGNOSIS & MILESTONES
    Engineer->>System: Input milestone diagnosa teknis (Log trace CLI, screenshot)
    opt Jika Email Dispatch Sync Aktif
        System-->>Customer: Forward update milestone ke email PIC
    end

    %% 4. SLA PAUSE (PENDING VENDOR / CUSTOMER)
    alt Butuh Suku Cadang Principal / Konfirmasi Klien
        Engineer->>System: Request SLA Clock Pause (Alasan & Principal Case ID)
        activate System
        System->>System: Bekukan (FREEZE) timer Resolution SLA
        System->>System: Status tiket berubah: PENDING_VENDOR / PENDING_CUSTOMER
        deactivate System
        Engineer->>Principal: Koordinasi penggantian part / analisa dump L3
        Principal-->>Engineer: Part terpasang / patch driver dirilis
        Engineer->>System: Resume SLA Clock
        activate System
        System->>System: Lanjutkan penghitungan sisa durasi SLA bersih (Net MTTR)
        deactivate System
    end

    %% 5. RESOLUTION & RCA
    Engineer->>System: Input Root Cause (RCA), Resolution Strategy & Rekomendasi
    Engineer->>System: Submit Resolve Ticket
    activate System
    System->>System: Hentikan permanen timer Resolution SLA (Stop Clock)
    System->>System: Evaluasi kepatuhan: SLA MET vs SLA BREACHED
    System-->>Customer: Notifikasi Email Resolusi & Permintaan Konfirmasi
    deactivate System

    %% 6. KB RUNBOOK PROPOSAL
    opt Jika Solusi Berpotensi Berulang
        Engineer->>System: Propose solusi ke Knowledge Base Runbook
        Admin->>System: Review & Approve artikel SOP
        System->>System: Terbitkan sebagai Validated ITIL Runbook (KB-XXXX)
    end

    %% 7. TICKET CLOSING
    Customer->>System: Konfirmasi via tracking link / auto-close 3 hari
    System->>System: Status tiket ditutup permanen (CLOSED)
```

---

## 5. Logika Mesin SLA (*Dual SLA Engine*) & Formula Kalkulasi

Sistem menggunakan **Dual SLA Engine** terpisah untuk mengukur performa secara objektif:

### A. Response SLA Engine (Kecepatan Kontak Pertama)
* Mengukur durasi sejak tiket dibuat ($T_{\text{created}}$) hingga teknisi merespon pertama kali ($T_{\text{responded}}$).
$$\Delta T_{\text{response}} = T_{\text{responded}} - T_{\text{created}}$$
* **Kriteria Sukses**: $\Delta T_{\text{response}} \le \text{Target Response SLA}$ (misal 30 menit).

### B. Resolution SLA Engine (Durasi Pemulihan Bersih / Net MTTR)
* Mengukur total waktu penyelesaian bersih dengan mengecualikan durasi penahanan yang sah (*Legitimate Pause Duration*):
$$\text{Net MTTR} = (T_{\text{resolved}} - T_{\text{created}}) - \sum T_{\text{paused}}$$
* **Kriteria Sukses**: $\text{Net MTTR} \le \text{Target Resolution SLA}$ (misal 4 jam).

### C. Matriks Batas Waktu Berdasarkan Tier Kontrak (Enforceable MSA)
| Tier Kontrak | Jendela Operasional | Target Response | Target Resolution | Penalti Keterlambatan |
|---|---|:---:|:---:|---|
| **Platinum 24x7** | 24 Jam × 7 Hari (Non-Stop) | $\le$ 30 Menit | $\le$ 4 Jam | 5% Service Credit / jam |
| **Gold 8x5** | Senin – Jumat (08:00 – 17:00 WIB) | $\le$ 30 Menit | $\le$ 8 Jam | 3% Service Credit / jam |
| **Silver 8x5** | Senin – Jumat (08:30 – 17:30 WIB) | $\le$ 1 Jam | $\le$ 12 Jam | Standard SLA Credit |
| **Government Tier-1** | Jam Kerja Kantor Pemda (8x5) | $\le$ 1 Jam | $\le$ 12 Jam | Laporan Audit BPKP |

---

## 6. Alur Eskalasi Otomatis 3 Tahap (Automated Escalation Triggers)

```mermaid
flowchart TD
    Start([Tiket Terbit & SLA Clock Berjalan]) --> Watch{Monitoring Waktu SLA}
    
    Watch -- Durasi Capai 50% Target --o Stage1[Stage 1: Warning Level]
    Stage1 --> Act1["Kirim Email Reminder ke Teknisi Penanggung Jawab & Lead SysOps"]
    Act1 --> Watch
    
    Watch -- Durasi Capai 80% Target --o Stage2[Stage 2: Imminent Breach Alert]
    Stage2 --> Act2["Kirim Email Alert Prioritas Tinggi ke Service Operations Manager & Siagakan L3 Principal Bridge"]
    Act2 --> Watch
    
    Watch -- Durasi Capai 100% Target Tanpa Resolusi --o Stage3[Stage 3: Critical SLA Breach]
    Stage3 --> Act3["Catat Pelanggaran ke Audit Log Permanen, Notifikasi Komite Direksi, & Wajib Investigasi RCA Formal"]
    
    Watch -- Tiket Terselesaikan Sebelum 100% --o Success([SLA Compliance Met - Timer Berhenti])
```

---

## 7. Poin Diskusi & Tanya Jawab Lanjutan (Q&A Cheatsheet)

Saat mempresentasikan sistem ini kepada penguji/stakeholder, gunakan poin-poin berikut:

1. **Mengapa tidak menggunakan notifikasi WhatsApp otomatis?**
   - *Jawaban*: Mengikuti standar kepatuhan korporat dan audit enterprise, media komunikasi resmi untuk eskalasi kontrak PKS dan SLA enforceable adalah **Email Relay korporat** (*helpdesk@glotratech.com*). Email menyediakan *tamper-proof delivery receipts*, lampiran log formal, dan kepatuhan arsip legal. WhatsApp tetap dapat difungsikan sebagai saluran penerima keluhan awal (*Customer Intake*).

2. **Bagaimana sistem menjamin keamanan pelacakan customer tanpa login?**
   - *Jawaban*: Sistem menggunakan arsitektur **Tokenized URL** (contoh: `/track/TICK-20260913-0001?token=sec_ahm_9912a7f8`). Token di-generate secara kriptografis dan terikat dengan ID tiket serta PIC terdaftar, mencegah enumerasi URL oleh pihak luar tanpa membebani klien dengan keharusan menghafal akun/kata sandi.

3. **Bagaimana penanganan pause SLA agar tidak disalahgunakan oleh teknisi?**
   - *Jawaban*: Penahanan waktu SLA wajib memilih klasifikasi (*Pending Vendor Principal* atau *Pending Customer Verification*), mencantumkan nomor tiket principal resmi (contoh: *HPE Case ID / Cisco TAC Case*), dan setiap aksi pause/resume tercatat permanen di dalam **Audit Trail Log** yang tidak dapat diedit atau dihapus.

4. **Bagaimana hubungan antara tiket insiden dan modul Knowledge Base?**
   - *Jawaban*: Sistem menerapkan siklus *Knowledge-Centered Service (KCS)*. Saat tiket insiden selesai, teknisi dapat menandai *"Propose for Knowledge Base"*. Supervisor/Admin kemudian memvalidasi langkah kerja dan CLI syntax tersebut sebelum dipublikasikan menjadi **ITIL Runbook SOP resmi** yang dapat dipakai berulang oleh teknisi lain.
