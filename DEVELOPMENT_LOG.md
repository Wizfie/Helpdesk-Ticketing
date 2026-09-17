# Development Log - Sistem Helpdesk Ticketing PT Global Transformasi Teknologi (GTT)

Dokumen ini mencatat seluruh aktivitas, keputusan arsitektur, dan riwayat pembaruan (*changelog*) dalam pengembangan sistem Helpdesk Ticketing berbasis **Express.js**, **Vue.js**, dan **MySQL**.

---

## 📌 Informasi Proyek
* **Nama Proyek**: Implementasi Sistem Helpdesk Ticketing Berbasis Web pada PT Global Transformasi Teknologi
* **Brand / Perusahaan**: PT Global Transformasi Teknologi (Glotra Technology)
* **Tagline**: *"Think it, Solve it"*
* **Logo Asset**: `assets/gtt-logo.png` & `frontend/public/gtt-logo.png`
* **Demo Frontend URL**: `http://127.0.0.1:5173/` (Aktif)
* **Stakeholder**: CPIG (Helpdesk), Engineer Support, Management, System Administrator
* **Teknologi**:
  * **Frontend**: Vue.js 3 (Composition API), Vite, Tailwind CSS, Pinia, Vue Router
  * **Backend**: Express.js, Prisma ORM, JWT, Nodemailer, Winston + Morgan, Tesseract.js / Gemini API (Hybrid Ingestion)
  * **Database**: MySQL (Penyimpanan Waktu UTC+0, Tabel Audit Logs)
  * **Palet Warna**: Corporate Slate Blue (`#1E40AF` / `#2563EB`) & Soft Slate Off-White (`#F8FAFC` / `#F1F5F9`), dengan aksen warna logo (Merah `#EF4444` & Hijau `#84CC16`)

---

## 📅 Riwayat Pembaruan (Development Timeline)

### [2026-09-13] - Tahap 0: Analisis Proposal & Kesepakatan Desain Arsitektur
* Selesai dianalisis dan disahkan dalam `implementation_plan.md`.

---

### [2026-09-13] - Tahap 1: Implementasi Demo Frontend Interaktif
* Selesai dan terverifikasi.

---

### [2026-09-13] - Tahap 1.2: Pembersihan Emoticon, Perbaikan Layout Cetak PDF, RBAC Dinamis, dan Modul Admin
* Selesai dan terverifikasi.

---

### [2026-09-13] - Tahap 1.3: Mode Mobile Responsif Penuh & Collapsible Sidebar Drawer
* Selesai dan terverifikasi.

---

### [2026-09-13] - Tahap 1.4: Penyederhanaan Menu Management (Fokus Dashboard & Laporan Eksekutif)
* **Penyesuaian RBAC**:
  - Menu **Jejak Audit (Audit Logs)** kini **khusus untuk System Administrator**.
  - Untuk **Management**, menu audit logs disembunyikan agar tampilan bersih dan fokus pada:
    1. **Dashboard Tiket (Executive KPI & SLA 24/7)**
    2. **Laporan Eksekutif (PDF Cetak & CSV Export)**
    3. **Knowledge Base (Referensi Solusi)**

---

### [2026-09-13] - Tahap 1.5: Fitur Pratinjau Lampiran & Bukti Digital Interaktif (Lightbox & Terminal Log Viewer)
* **Latar Belakang**:
  - Pengguna menanyakan lokasi melihat berkas lampiran yang sebelumnya hanya berupa teks nama berkas.
* **Pembaruan Fitur**:
  1. **Panel Khusus Berkas Lampiran (`TicketDetailView.vue`)**:
     - Menambahkan card terdedikasi **"Berkas Lampiran & Bukti Digital"** di kolom kiri detail tiket.
     - Merangkum seluruh berkas yang terhubung: Lampiran awal pelapor (WhatsApp / Email), log diagnosa terminal KVM, bukti eskalasi vendor (Cisco TAC), dan hasil pengujian solusi (HTTP 200).
     - Menyediakan tombol aksi langsung: **"Lihat"** (membuka modal preview interaktif) dan **"Unduh"** (unduh berkas).
     - Tombol **"+ Unggah"** untuk teknisi / CPIG melampirkan berkas bukti tambahan secara langsung.
  2. **Modal Pratinjau Interaktif Terpadu (`AttachmentPreviewModal.vue`)**:
     - **Mode Gambar / Tangkapan Layar**: Menampilkan berkas tangkapan layar SVG/PNG/JPG secara visual dengan rasio proporsional, status verifikasi digital, dan tombol unduh.
     - **Mode Log Terminal Monospace**: Menampilkan log konsol KVM (format `.txt` / `.log`) dengan styling terminal gelap (`bg-slate-950 text-emerald-400 font-mono`), tombol **"Salin Isi Log"** ke clipboard, dan tombol unduh `.txt`.
     - Terintegrasi di halaman Detail Tiket dan di setiap langkah checkpoint **Tracking Milestones**.

---

### [2026-09-13] - Tahap 1.6: Standarisasi SLA Murni Berdasarkan Severity & Desain Arsitektur Notifikasi Email
* **Koreksi Logika Bisnis SLA**:
  - Menghapus konsep "Paket SLA Premium / Standar" pada customer. Seluruh customer GTT memiliki status kemitraan Perjanjian Kerjasama (PKS) 24x7 aktif yang setara.
  - Parameter Response SLA dan Resolution SLA **100% ditentukan oleh Tingkat Keparahan Kasus (Severity)**:
    * **HIGH (Critical / Sev 1)**: Response &le; 30 Menit, Resolution &le; 4 Jam.
    * **MEDIUM (Major / Sev 2)**: Response &le; 1 Jam, Resolution &le; 8 Jam.
    * **LOW (Minor / Change Request)**: Response &le; 2 Jam, Resolution &le; 24 Jam.
  - Memperbarui komponen `CustomersManagementView.vue`, `TicketDetailView.vue`, `CreateTicketView.vue`, dan `mockData.js`.
* **Arsitektur Notifikasi Email Otomatis**:
  - Menggunakan modul **Nodemailer** dengan koneksi SMTP Relay internal / transaksional secara asinkron di backend Express.js.
  - Titik pemicu:
    1. `TICKET_CREATED`: Konfirmasi tanda terima resmi ke email PIC Customer pelapor.
    2. `ASSIGN_ENGINEER`: Notifikasi penugasan tiket & batas waktu Response SLA ke teknisi terkait.
    3. `SLA_WARNING_75%`: Peringatan eskalasi dini ke Engineer & CPIG saat sisa waktu resolusi &le; 25%.
    4. `SLA_BREACHED`: Notifikasi eskalasi kritis ke Management & Admin.
    5. `RESOLVED`: Laporan penyelesaian teknis dan masa sanggah 72 jam ke customer.
    6. `CLOSED`: Berita acara penutupan tiket & link survei kepuasan (CSAT).

---

### [2026-09-13] - Tahap 1.7: Halaman Pelacakan Mandiri Pelanggan (Customer Self-Service Portal)
* **Latar Belakang**:
  - Menjawab alur ketika customer mengklik tombol *"Lihat Status Penanganan Tiket"* pada email notifikasi.
* **Fitur yang Diimplementasikan**:
  1. **Route Publik Tanpa Login (`/track/:ticketNumber`)**:
     - Customer tidak memerlukan akun/login untuk memantau status kendalanya.
     - Akses langsung via token/nomor tiket resmi ([`CustomerTrackingView.vue`](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/frontend/src/views/CustomerTrackingView.vue)).
  2. **Tampilan Khusus Pelanggan (*Customer-Facing View*)**:
     - Bersih dari menu navigasi internal staf (bebas sidebar internal / tanpa data teknis sensitif).
     - **Status Banner Ramah Awam**: Menggunakan bahasa operasional yang jelas (*"Sedang Dikerjakan oleh Teknisi"*, *"Perbaikan Selesai - Masa Pemantauan 72 Jam"*).
     - **Live Tracking Resi**: Checkpoint langkah penanganan bertahap yang transparan beserta tanggal waktu lokal WIB.
     - **Komitmen Target SLA 24x7**: Penghitungan batas pemulihan layanan secara transparan.
     - **Tombol Aksi Pelanggan**: Tombol konfirmasi kepuasan (*"Konfirmasi Layanan Normal & Selesai"*) dan tombol sanggahan kendala langsung terhubung ke WhatsApp Helpdesk 24x7.
     - **Hotline & Bantuan Resmi**: Kotak kontak darurat 24x7 call center dan email GTT.

---

### [2026-09-13] - Tahap 1.8: Reaktivitas Path Dinamis, 404 Guard, dan Pembatasan Hak Akses Penugasan Teknisi (Read-Only Guard)
* **Reaktivitas URL & Parameter `:id`**:
  - Mengubah path `/tickets/:id` secara otomatis memuat data tiket bersangkutan secara reaktif (mulai dari informasi klien, riwayat milestone, berkas lampiran, hingga teknisi yang ditugaskan).
  - Jika ID tidak terdaftar (contoh `/tickets/999`), sistem menampilkan state **404 - Tiket Tidak Ditemukan** dengan navigasi kembali ke dashboard.
* **Keamanan & Otorisasi Penugasan Teknisi (*Assignment RBAC*)**:
  - Penugasan teknisi (`assignedToId`) melekat secara spesifik pada masing-masing data tiket.
  - **Mode Hanya Baca (Read-Only Guard)**: Jika seorang Engineer (misal Budi Santoso) membuka tiket yang ditugaskan kepada teknisi lain (misal Dwi Prasetyo), sistem memunculkan banner peringatan kuning *"Mode Hanya Baca"* dan menyembunyikan tombol eksekusi (`Tahan SLA`, `RESOLVED`, `Tambah Checkpoint`).
  - Tindakan perubahan teknis hanya dapat dieksekusi oleh: **Teknisi Penanggung Jawab**, **CPIG (Lead)**, atau **System Administrator**.

---

### [2026-09-13] - Tahap 1.9: Pengetatan Keamanan: 403 Total Blokir Akses Teknisi Non-Penugasan & Validasi Token Asli Email (Anti-IDOR)
* **Latar Belakang**:
  - Pengguna meminta agar sistem memblokir akses secara total jika seorang teknisi mencoba membuka tiket yang bukan penugasannya, serta mencegah manipulasi URL pelacakan customer jika bukan berasal dari link resmi email.
* **Pembaruan Keamanan Sistem**:
  1. **Blokir Total Akses Teknisi (403 Forbidden Screen)**:
     - Jika role pengguna adalah **ENGINEER**, dan tiket telah ditugaskan ke teknisi lain, sistem tidak menampilkan data apapun (informasi klien, kronologi kendala, milestones, dan berkas lampiran disembunyikan total).
     - Menampilkan layar resmi **"403 - Akses Penugasan Ditolak: Anda Tidak Memiliki Izin Membuka Tiket Ini"** dengan tombol navigasi kembali ke antrean tiket pribadi.
     - Role **CPIG**, **ADMIN**, dan **MANAGEMENT** tetap dapat membuka tiket untuk keperluan eskalasi dan pengawasan manajerial.
  2. **Validasi Token Digital Pelanggan (*Anti-IDOR Security Guard*)**:
     - Setiap tiket dilengkapi parameter token keamanan rahasia (`trackingToken: sec_xxxx`).
     - Tautan email resmi diwajibkan menyertakan parameter token: `/track/:ticketNumber?token=sec_xxxx`.
     - Jika customer mencoba memanipulasi nomor tiket di URL tanpa token atau dengan token yang tidak cocok, sistem langsung memblokir akses dan menampilkan layar **"Tautan Tidak Sah (Security Check Failed): Akses Pelacakan Memerlukan Token Resmi"**.
     - Hanya link bertoken valid yang diizinkan membuka portal pelacakan mandiri (disertai badge hijau *"✓ Token Terverifikasi"*).

---

### [2026-09-13] - Tahap 1.10: Penguatan Keamanan Tautan Publik & Penyusunan Panduan Pengguna (User Guide)
* **Pengerasan Keamanan Tautan Publik (*Public Links Hardening*)**:
  - Menghapus tautan internal dari header portal publik pelanggan guna mencegah akses yang tidak diinginkan ke sistem internal staf.
  - Memasang atribut keamanan `rel="noopener noreferrer"` pada semua tautan eksternal (WhatsApp Hotline 24x7) untuk mencegah kerentanan *Reverse Tabnabbing*.
  - Menambahkan kebijakan perujuk `<meta name="referrer" content="strict-origin-when-cross-origin" />` pada `index.html` agar token rahasia URL tidak bocor ke server pihak ketiga.
* **Penyusunan Panduan Pengguna Komprehensif (*User Guide*)**:
  - Membuat berkas dokumentasi [USER_GUIDE.md](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/USER_GUIDE.md) yang terstruktur, ramah pembaca, dan to-the-point.
  - Mencakup petunjuk penggunaan lengkap untuk 5 peran:
    1. **Customer**: Panduan pemantauan mandiri via link bertoken, cara membagikan link ke rekan tim, dan konfirmasi penyelesaian layanan normal.
    2. **CPIG / Helpdesk**: Alur penerimaan pengaduan, pemeriksaan duplikasi (Smart Ingestion), klasifikasi Severity P1-P4, dan pengiriman notifikasi.
    3. **Engineer / Teknisi**: Pengambilan tiket, pelaksanaan perbaikan, prosedur jeda waktu (*Pause SLA*), dan pengisian solusi tuntas (*Resolved*).
    4. **Management**: Pemantauan KPI kepatuhan SLA dan unduh laporan eksekutif.
    5. **Admin**: Tata kelola staf pengguna, data pelanggan, dan audit log keamanan.
  - Disertai tabel matriks peran, diagram alur, dan FAQ jawaban atas pertanyaan umum seputar keamanan token dan penahanan SLA.
* **Ekspor Dokumen Panduan Resmi Format PDF**:
  - Telah diekspor ke dalam dokumen PDF standar cetak korporat: [Panduan_Pengguna_Helpdesk_GTT.pdf](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/Panduan_Pengguna_Helpdesk_GTT.pdf) (format layout A4 siap cetak).
  - Dilengkapi kop logo resmi PT Global Transformasi Teknologi, tabel matriks peran yang rapi, bagan alur proses, dan format bebas elemen artifisial.

---

### [2026-09-13] - Tahap 1.11: Penambahan Fitur Edit Pengguna, Edit Mitra & PIC, Pencatatan Jejak Audit, dan Fitur Ekspor Logs
* **Fitur Edit Pengguna (*Users Management*)**:
  - Menambahkan tombol **Edit** pada setiap baris tabel pengguna staf di `UsersManagementView.vue`.
  - Admin dapat memperbarui nama staf, email resmi, peran operasional (*Role: ADMIN, CPIG, ENGINEER, MANAGEMENT*), nomor telepon/WhatsApp, dan status keaktifan akun.
  - Setiap perubahan data staf maupun perubahan status keaktifan akun secara otomatis mencatatkan entri ke dalam jejak audit (`USER_UPDATED` dan `USER_STATUS_TOGGLED`) lengkap dengan nama admin pelaksana dan rincian perubahan.
* **Fitur Edit Mitra Customer & PIC (*Customers Management*)**:
  - Menambahkan tombol **Edit Mitra** pada setiap kartu profil perusahaan pelanggan di `CustomersManagementView.vue` untuk memperbarui nama instansi, kode singkat, sektor industri, dan alamat kantor.
  - Menambahkan tombol/ikon **Edit PIC** pada setiap baris kontak darurat pelanggan untuk memperbarui nama lengkap, divisi/posisi, nomor telepon, dan email resmi.
  - Setiap penambahan maupun perubahan data mitra dan PIC tercatat secara otomatis ke dalam jejak audit (`CUSTOMER_CREATED`, `CUSTOMER_UPDATED`, `CUSTOMER_PIC_ADDED`, `CUSTOMER_PIC_UPDATED`).
* **Fitur Ekspor Jejak Audit (*Export Logs*)**:
  - Menambahkan tombol **Ekspor CSV** pada `AuditLogView.vue` yang menghasilkan berkas CSV standar RFC-4180 ber-BOM UTF-8 (kompatibel penuh dengan Microsoft Excel) memuat kolom waktu UTC, waktu lokal WIB, nama aktor, peran, aksi, entitas, dan alamat IP.
  - Menambahkan tombol **Ekspor JSON** untuk keperluan integrasi SIEM / alat analisis keamanan TI.
  - Menambahkan tombol **Cetak** untuk mencetak laporan rekam jejak audit secara fisik/PDF.
  - Menambahkan filter dan badge visual khusus untuk seluruh aksi baru pengguna (`USER_*` berwarna ungu) dan mitra pelanggan (`CUSTOMER_*` berwarna toska/teal).

---

### [2026-09-13] - Tahap 1.12: Refinement Menu Management (Dashboard Analitik Eksekutif) & Filter Periode Ekspor Laporan Admin
* **Pembersihan Menu & Hak Akses Management**:
  - Menghapus menu **Laporan Eksekutif** (`/reports`) dan **Knowledge Base** (`/knowledge-base`) dari bilah navigasi (Sidebar) peran **MANAGEMENT**.
  - Menyesuaikan *route navigation guard* di `router/index.js` agar rute `/reports` hanya dapat diakses oleh **ADMIN**, dan `/knowledge-base` hanya dapat diakses oleh **ADMIN**, **CPIG**, dan **ENGINEER**. Percobaan navigasi langsung oleh role Management akan otomatis dialihkan ke Dashboard.
* **Grafik Tren Analitik & Kinerja Operasional Eksekutif Terpadu pada Dashboard**:
  - Menambahkan panel visual analitik eksekutif langsung pada `DashboardView.vue` khusus untuk role **MANAGEMENT** dan **ADMIN**:
    1. **Grafik Batang Tren Volume Insiden & Kepatuhan SLA Harian**: visualisasi volume tiket harian (Senin s.d. Minggu) dengan indikator kepatuhan SLA (Hijau: SLA Met, Merah: Breached), dilengkapi tombol alih periode **Pekan Ini (W37)** dan **Bulan Ini (Sep 2026)**.
    2. **Waktu Rata-rata Pemulihan (MTTR) vs Batas Toleransi SLA Kontrak**: perbandingan realisasi penyelesaian vs batas toleransi kontrak (P1 2.4j vs 4j; P2 5.1j vs 8j; P3 13.8j vs 24j; P4 22j vs 48j) beserta persentase utilisasi batas toleransi.
    3. **Distribusi Kategori Insiden Teknis**: visualisasi proporsi kendala jaringan (42%), server cloud (28%), aplikasi database (18%), dan keamanan VPN (12%).
    4. **Konsentrasi Gangguan per Mitra Klien**: pemetaan volume insiden aktif berdasarkan mitra kerja sama PKS 24x7 (BCA, Siloam, Pemprov Banten, Astra).
* **Filter Periode Lengkap pada Ekspor Laporan Admin (`ReportsView.vue`)**:
  - Menambahkan tombol pintas preset periode pelaporan: **Bulan Ini (Sep 2026)**, **7 Hari Terakhir**, **Bulan Lalu (Agt 2026)**, **Kuartal 3 (Q3 2026)**, **Semua (YTD 2026)**, dan opsi **Rentang Kustom**.
  - Opsi **Rentang Kustom** memunculkan input pemilih tanggal awal (`customStartDate`) dan tanggal akhir (`customEndDate`).
  - Rangkuman metrik KPI (Total Tiket, Kepatuhan SLA, Respon Rata-rata, MTTR) dan tabel pratinjau tiket otomatis tersaring secara dinamis mengikuti filter periode yang aktif.
  - Ekspor **CSV** (`exportCsv`) secara otomatis menyertakan metadata periode aktif pada baris awal berkas serta menghasilkan nama berkas yang spesifik sesuai periode yang dipilih (misal `Laporan_SLA_GTT_THIS_WEEK_*.csv`).
* **Pembaruan Panduan Pengguna & Dokumen PDF**:
  - Memperbarui matriks peran dan alur kerja di [USER_GUIDE.md](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/USER_GUIDE.md).
  - Melakukan kompilasi ulang berkas PDF [Panduan_Pengguna_Helpdesk_GTT.pdf](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/Panduan_Pengguna_Helpdesk_GTT.pdf).

---

### [2026-09-13] - Tahap 1.13: Redesain & Diferensiasi Semantik Visual 4 Grafik Dashboard Management
* **Latar Belakang Permintaan**:
  - Grafik sebelumnya menggunakan styling progress bar yang repetitif (3 dari 4 grafik identik berupa bar horizontal).
  - Pengguna meminta perbaikan styling agar setiap grafik menggunakan tipe visualisasi yang paling sesuai (*tailored chart type*) dengan karakteristik datanya.
* **Pembaruan 4 Tipe Visualisasi Data**:
  1. **Tren Beban Insiden & Kepatuhan SLA (*Time-Series*)**:
     - Diubah menjadi **Curved Area Line Chart (SVG)** dengan gradien warna biru (*soft blue gradient fill*).
     - Dilengkapi garis pemandu (*dashed guidelines*) pada level 5, 10, 15 insiden, sumbu Y numerik, dan sumbu X interaktif.
     - Penanda titik insiden dibedakan warna: **Hijau (SLA Met)** dan **Merah berdenyut (Breached)**, lengkap dengan tooltip interaktif saat di-hover.
     - Sakelar periode **Pekan Ini (W37)** dan **Bulan Ini (Sep 2026)** yang mentransformasi kurva secara dinamis.
  2. **Efisiensi Pemulihan (MTTR) vs Batas Toleransi SLA (*Benchmark / Target vs Actual*)**:
     - Diubah menjadi **2x2 Executive Bullet Benchmark Cards Grid** (P1 Critical, P2 Major, P3 Medium, P4 Low).
     - Setiap kartu menyajikan durasi riil vs target kontrak, persentase efisiensi pengerjaan (misal: *40% Lebih Cepat*), bullet gauge dengan garis batas toleransi SLA 100%, serta lencana margin keselamatan kerja (*Safety Margin*).
  3. **Distribusi Kategori Insiden Teknis (*Part-to-Whole Composition*)**:
     - Diubah menjadi **Interactive SVG Donut Chart** 4-sektor dengan lubang cutout di bagian tengah menampilkan ringkasan **61 Total Insiden**.
     - Sisi kanan dilengkapi daftar legenda interaktif warna-warni (*Jaringan 42%*, *Server Cloud 28%*, *Aplikasi 18%*, *Keamanan VPN 12%*) yang bereaksi saat kursor didekatkan.
  4. **Konsentrasi Gangguan per Mitra Klien (*Comparative Ranking / Pareto*)**:
     - Diubah menjadi **Ranked Partner Leaderboard** (#1 s.d. #4) lengkap dengan lencana inisial avatar korporat (*BCA*, *RSH*, *DKB*, *AST*), label sektor industri klien, pangsa insiden, volume tiket aktif, serta bar proporsi bergradasi.
* **Hasil Pengujian**:
  - Telah diverifikasi langsung melalui browser subagent dan dicatat ke dalam rekaman demo: [executive_charts_redesign.webp](file:///C:/Users/wizfi/.gemini/antigravity-ide/brain/22dc162e-ae86-4ff2-8b23-14415e8d301f/executive_charts_redesign_1789291723581.webp).

---

### [2026-09-13] - Tahap 1.14: Fitur Penambahan Kategori Masalah Baru Saat Menerbitkan Tiket (On-The-Fly Category Creation)
* **Latar Belakang Permintaan**:
  - Pengguna meminta agar pada kolom *Kategori Masalah*, petugas/CPIG dapat langsung mendaftarkan dan menambahkan kategori baru secara instan jika terdapat jenis permasalahan baru yang belum terdaftar.
* **Pembaruan Fitur**:
  1. **Tombol Cepat & Opsi Dropdown (`CreateTicketView.vue`)**:
     - Menambahkan tombol **+ Kategori Baru** tepat di samping label kolom *Kategori Masalah*.
     - Menambahkan opsi khusus **+ Tambah Kategori Masalah Baru...** di bagian paling bawah dropdown pilihan kategori, sehingga ketika dipilih formulir modal penambahan akan langsung terbuka otomatis.
  2. **Modal Dialog Tambah Kategori Cepat**:
     - Formulir modal responsif memuat:
       - **Nama Kategori Masalah** (Wajib): misal *VoIP & SIP Trunk PBX*.
       - **Kode Singkat Kategori** (Opsional 3-5 huruf): dibuat otomatis dari inisial nama jika dikosongkan.
       - **Deskripsi Ruang Lingkup Masalah** (Opsional): rincian kendala teknis yang tercakup.
  3. **Auto-Select & Notifikasi**:
     - Begitu tombol *Simpan & Pilih Kategori* ditekan, kategori baru langsung tersimpan ke master `categories` di `ticketStore.js`, otomatis terpilih pada tiket yang sedang dibuat, memunculkan keterangan deskripsi di bawah dropdown, dan menampilkan notifikasi toast sukses berwarna hijau.
  4. **Pencatatan Audit Trail Otomatis**:
     - Aksi penambahan kategori baru tercatat otomatis ke dalam `Audit Logs` dengan jenis aksi `CATEGORY_CREATED` (`Menambahkan kategori masalah baru: [Nama] ([Kode])`) lengkap dengan nama petugas dan stempel waktu UTC.
* **Hasil Pengujian**:
  - Telah diuji secara *end-to-end* melalui browser subagent: pendaftaran kategori baru `VoIP & SIP Trunk PBX (VOIP)`, penerbitan tiket baru `#TICK-...`, verifikasi tampilan kategori baru pada detail tiket (`/tickets/4`), dan pencatatan riwayat di audit log. Rekaman demo tersimpan pada [add_category_flow_test.webp](file:///C:/Users/wizfi/.gemini/antigravity-ide/brain/22dc162e-ae86-4ff2-8b23-14415e8d301f/add_category_flow_test_1789292592403.webp).

---

### [2026-09-13] - Tahap 1.15: Penegasan Standar Operasional Penugasan Tiket (Hak Mutlak CPIG & Admin)
* **Koreksi Tata Kelola Bisnis (*Business Workflow Alignment*)**:
  - Mengoreksi klausul panduan pengguna yang sebelumnya menyebutkan bahwa teknisi dapat mengambil sendiri (*self-assign*) tiket antrean baru.
  - Berdasarkan standar operasional PT Global Transformasi Teknologi, penentuan penugasan tiket dan alokasi teknisi **sepenuhnya berada di bawah wewenang petugas CPIG / Helpdesk dan Administrator TI**. Teknisi tidak memiliki wewenang untuk memilih atau mengklaim tiket secara sepihak.
* **Penyesuaian Sistem & Proteksi Akses (RBAC & Assignment Guard)**:
  - Pada `TicketDetailView.vue` dan `MilestoneStepper.vue`, aturan isolasi penugasan diperketat: akun **ENGINEER** hanya dapat membuka dan mengintervensi tiket yang telah didelegasikan secara resmi kepada dirinya (`assignedToId === authStore.currentUser.id`).
  - Tiket yang berstatus *unassigned* (belum ditugaskan) atau tiket milik teknisi lain otomatis menampilkan layar pengaman **403 - Akses Penugasan Ditolak**.
  - Tombol penugasan (*Tugaskan Teknisi* / *Ganti Teknisi*) tetap eksklusif hanya untuk peran **CPIG** dan **ADMIN**.
* **Pembaruan Dokumen Panduan & PDF**:
  - Memperbarui [USER_GUIDE.md](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/USER_GUIDE.md) pada Bab 1 (Matriks Peran), Bab 3 (Langkah 5 Alokasi Teknisi oleh CPIG), Bab 4 (Langkah 1 Pemeriksaan Tiket Ditugaskan bagi Teknisi), dan Bab 7 (FAQ Penegasan Wewenang Penugasan).
  - Melakukan kompilasi ulang berkas PDF [Panduan_Pengguna_Helpdesk_GTT.pdf](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/Panduan_Pengguna_Helpdesk_GTT.pdf).

---

### [2026-09-13] - Tahap 1.16: Persistensi State Pergantian Peran & Pengguna (Role Switching Persistence via LocalStorage)
* **Latar Belakang Permintaan**:
  - Pada demo aplikasi web ini, status pergantian peran (*role switcher*) yang sebelumnya hanya tersimpan di memori sementara kini dipertahankan (*persistent*) agar saat peramban web di-refresh atau dimuat ulang (*F5/reload*), peran dan akun pengguna aktif tidak kembali ke nilai default.
* **Pembaruan Fitur & Arsitektur**:
  1. **Integrasi LocalStorage pada `authStore.js`**:
     - Menambahkan konstanta penyimpanan: `gtt_current_user_id`, `gtt_current_role`, dan `gtt_mock_users`.
     - Fungsi inisialisasi state pintar `getStoredCurrentUser(users)` yang membaca ID pengguna dan kode peran tersimpan dari `localStorage` sebelum router mengeksekusi *navigation guard*.
     - Fungsi `saveCurrentAuthState(user)` dan `saveUsersState(users)` yang secara otomatis memperbarui `localStorage` saat aksi `switchRole()`, `switchUser()`, `createUser()`, `updateUser()`, maupun `toggleUserStatus()` dijalankan.
  2. **Proteksi & Sinkronisasi Rute pada `Navbar.vue`**:
     - Memperbarui fungsi `switchRole(code)` di `Navbar.vue` agar secara otomatis memeriksa izin rute aktif (`router.currentRoute.value.meta?.roles`). Apabila pengguna sedang berada di halaman terproteksi khusus (misal `/admin/users` yang hanya mengizinkan `ADMIN`) lalu beralih ke peran `MANAGEMENT` atau `ENGINEER`, sistem langsung mengalihkan rute secara aman ke Dashboard (`/`).
     - Sebaliknya, jika pengguna beralih ke peran `ADMIN` dan membuka `/admin/users`, me-refresh halaman (*full page reload*) akan tetap mempertahankan peran `ADMIN` dan halaman tetap berada di `/admin/users` tanpa terlempar keluar.
* **Hasil Pengujian & Verifikasi**:
  - Telah diverifikasi langsung melalui browser subagent:
    - Beralih ke peran **ADMIN** (Ahmad Fauzi) -> membuka `/admin/users` -> refresh halaman -> tetap berada di `/admin/users` dengan peran aktif ADMIN.
    - Beralih ke peran **MANAGEMENT** (Ir. Hendra Gunawan) -> dialihkan otomatis ke `/` -> refresh halaman -> peran tetap MANAGEMENT dan analitik eksekutif tetap tampil.
    - Mengembalikan peran ke **CPIG** (Rina Anggraini).
  - Rekaman demo tersimpan pada [test_role_persistence.webp](file:///C:/Users/wizfi/.gemini/antigravity-ide/brain/22dc162e-ae86-4ff2-8b23-14415e8d301f/test_role_persistence_1789293082093.webp).

---

### [2026-09-13] - Tahap 1.17: Penghapusan Opsi Cetak pada Jejak Audit (Audit Logs)
* **Latar Belakang Permintaan**:
  - Pengguna meminta agar tombol dan fungsi **Cetak** pada halaman Jejak Audit (*Audit Logs*) ditiadakan karena ekspor berkas data digital (**Ekspor CSV** dan **Ekspor JSON**) sudah lebih dari cukup dan tepat untuk kebutuhan arsip kepatuhan serta analisis keamanan log IT.
* **Pembaruan Sistem**:
  1. **Penghapusan Elemen UI & Fungsi (`AuditLogView.vue`)**:
     - Menghapus tombol *Cetak* dari deretan tombol aksi di sudut kanan atas header *Jejak Audit Aktivitas Sistem*.
     - Menghapus fungsi *event handler* `printLogs` (`window.print()`) dari blok `<script setup>`.
     - Mempertahankan tombol **Ekspor CSV** (untuk audit spreadsheet tabular) dan **Ekspor JSON** (untuk integrasi SIEM / parser log terstruktur).
* **Hasil Pengujian & Verifikasi**:
  - Telah diverifikasi melalui browser subagent: tombol pada header Audit Logs kini tersisa **Ekspor CSV** dan **Ekspor JSON** secara rapi dan presisi tanpa tombol cetak.
  - Tangkapan layar tersimpan pada: [audit_logs_buttons.png](file:///C:/Users/wizfi/.gemini/antigravity-ide/brain/22dc162e-ae86-4ff2-8b23-14415e8d301f/audit_logs_buttons_1789295078747.png).

---

### [2026-09-17] - Tahap 1.18: Analisis Desain Prototype Figma ITSM Enterprise & Pengarsipan Media Aset
* **Latar Belakang**:
  - Pengguna membagikan tautan prototype Figma sistem Helpdesk GTT (`https://www.figma.com/design/InsNYRwz7PYJ3Ue4hXpSKs/Untitled?node-id=0-1`) untuk dianalisis, dikomparasikan dengan sistem saat ini, serta diarsipkan seluruh media desainnya ke dalam repositori proyek.
* **Aktivitas yang Dilakukan**:
  1. **Inspeksi & Ekstraksi Visual 8 Layar Utama Prototype Figma**:
     - `01_operational_dashboard.png`: Operational Dashboard (Mission Control Console, Core Telemetry Uptime 99.98%, Dual Intake/Resolved Trend Chart, Active SLA Timers, On-Duty Roster).
     - `02_ticket_detail.png`: Ticket Detail (Dual Live SLA Counters Response & Resolution, Technology Principal L3 OEM Integration, Diagnostic Timeline, Root Cause vs Resolution Strategy, Customer Dispatch Sync WhatsApp).
     - `03_create_ticket.png`: Create Support Ticket (3-Step Guided Stepper, Live SLA Contract Badge, Rich Artifacts drag-and-drop, Principal Escalation switch).
     - `04_reports_and_sla.png`: Reports & SLA Analytics (Matriks SLA per Mitra Klien, Incident Intake by Channel, Priority Breakdown, Engineer Workload Velocity Roster).
     - `05_sla_configuration.png`: SLA Configuration (Contractual Threshold Matrix Platinum/Gold/Gov, Dual SLA Engine Logic, Automated Multi-stage Escalation Rules 50% & 80%).
     - `06_ticket_list.png`: Ticket List (Dedicated Queue Monitor terpisah dari Dashboard, 4 KPI antrean, tab filter cepat SLA Near Breach, Waiting Principal, My Assigned).
     - `07_customers.png`: Customer Master & Contracts (Direktori Akun Korporat, matriks MSA, jam operasional, penugasan supervisor).
     - `08_knowledge_base.png`: Knowledge Base (Validated Engineering Runbooks ITIL, Reusability Rate 64%, Pending Approvals, Authoring Standards).
  2. **Pengarsipan Media & Penyusunan Dokumen Komparasi**:
     - Menyimpan ke-8 berkas tangkapan layar resolusi tinggi ke direktori:
       - `docs/figma-analysis/screenshots/`
       - `frontend/public/figma-reference/`
     - Menyusun dokumen analisis komprehensif: [FIGMA_ANALYSIS_AND_COMPARISON.md](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/docs/figma-analysis/FIGMA_ANALYSIS_AND_COMPARISON.md).
     - Merumuskan rekomendasi roadmap implementasi bertahap (Fase 1 s.d. 3) serta memastikan fitur-fitur unggulan sistem saat ini (Portal Tracking Publik Pelanggan anti-IDOR, Jejak Audit Keamanan, Smart Ingestion) tetap dipertahankan.

