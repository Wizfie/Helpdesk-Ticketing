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

---

### [2026-09-30] - Tahap 2.0: Review MoM Evaluasi Lapangan PT Glotra & Kesepakatan Arsitektur Backend (Express + Prisma + MySQL)
* **Latar Belakang & Hasil Minutes of Meeting (MoM)**:
  - Dilakukan sesi review komprehensif alur (*flow*), fitur, dashboard, SLA, dan kesiapan deployment sistem Helpdesk Ticketing bersama pihak PT Glotra.
  - Dokumen MoM resmi tersusun pada [MOM_Review_Project_KP.md](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/docs/MOM_Review_Project_KP.md).
  - **Poin-poin Perubahan Kunci**:
    1. **Alur Eskalasi Diperluas**: Menyertakan entitas penanganan eskalasi ke **Project Manager (PM)**, **Mitra Rekanan (Partner)**, dan **Vendor Principal L3 TAC**.
    2. **Penyederhanaan Role Support Engineer**: Tampilan khusus teknisi difokuskan pada: *Tiket Saya*, *Customer yang Ditangani*, *Progress Troubleshooting*, dan *Knowledge Base*.
    3. **Fitur Countdown SLA Realtime**: Hitung mundur aktif dengan penanda *Near Breach Warning* (< 1 jam) dan *Breached Alert*.
    4. **Standarisasi Alasan SLA Hold/Freeze**: Pembekuan waktu resolusi resmi untuk kasus *Suku Cadang Inden (Part Indent)*, *Menunggu Konfirmasi Customer*, dan *Dependensi Vendor/Partner*, dengan perpanjangan deadline otomatis saat di-*resume*.
    5. **Redesain Dashboard Executive Summary**: Menyederhanakan tampilan beranda menjadi ringkasan KPI eksekutif (Total, Open, In Progress, Waiting/Hold, Solved, SLA Compliance) dan memindahkan grafik kompleks ke menu Laporan.
    6. **Penyempurnaan Audit Log**: Menambahkan pencatatan riwayat login pengguna dan modifikasi konfigurasi kebijakan SLA.
    7. **Knowledge Base Runbook PDF**: Dukungan unggah dan unduh berkas lampiran PDF SOP/Runbook penanganan kendala.
* **Keputusan Arsitektur Backend & Database**:
  - Backend dibangun menggunakan **Express.js** dengan **Prisma ORM** yang terhubung ke **MySQL 8.4 (via Laragon)**.
  - Penyimpanan berkas lampiran tiket dan berkas PDF Knowledge Base dikonfigurasi fleksibel menggunakan **Environment Variable (`.env`)** (`UPLOAD_DIR`, `MAX_FILE_SIZE_MB`, `ALLOWED_MIME_TYPES`) dengan proteksi Multer (UUID hashing, filter MIME type, dan folder masuk `.gitignore`) agar aman secara lokal dan siap dideploy ke server VPS/Cloud Glotra di masa mendatang.
* **Pembaruan Dokumen Acuan**:
  - [docs/arsitektur-dan-logical-flow.md](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/docs/arsitektur-dan-logical-flow.md) diperbarui secara penuh mencakup diagram sequence eskalasi Vendor/Partner/PM, matriks RBAC baru, dan tata kelola konfigurasi penyimpanan berkas via `.env`.

---

### [2026-09-30] - Tahap 2.1: Implementasi Penuh Backend (Express ES Module + Prisma + MySQL) & Refaktorisasi Frontend (Vue 3 Composition API + shadcn Style)
* **Teknologi & Standar Pemrograman**:
  - **Backend**: Express.js dikonfigurasi murni berbasis **ES Module (`"type": "module"`)** dengan sintaks `import`/`export` di seluruh controller, routes, middleware, dan lib Prisma.
  - **Frontend**: Seluruh komponen dan views mengadopsi standar **Vue 3 Composition API** (`<script setup>`, `ref`, `computed`, `onMounted`), tanpa Options API.
  - **Desain UI**: Menerapkan gaya komponen **shadcn/ui** dengan palet korporat **Clean Blue & Slate** (`border-slate-200`, `rounded-xl`, badge status terdefinisi, minimalis functional icons). Seluruh elemen gradasi gelap bernuansa AI telah dibersihkan dan digantikan dengan kartu panel korporat profesional.
* **Fitur Utama yang Selesai Diimplementasikan**:
  1. **Database Relasional & Prisma 6 LTS**:
     - Database `db_helpdesk_glotra` terpasang di MySQL 8.4 (Laragon) dengan relasi lengkap: Role, User, Customer, CustomerPic, Category, SlaPolicy, Ticket, SlaHoldLog, TicketMilestone, Attachment, KnowledgeBase, dan AuditLog.
     - Database seed script berhasil memasukkan master data realistis dan sample tickets ITSM enterprise.
  2. **REST API RESTful Terpadu (`backend/src/`)**:
     - Endpoints: Auth (`/api/auth`), Tiket & Workflow (`/api/tickets`), Kebijakan SLA (`/api/sla`), Customer & PIC (`/api/customers`), Knowledge Base & Runbooks (`/api/kb`), dan Jejak Audit (`/api/audit-logs`).
     - Tata kelola berkas Multer aman terkonfigurasi dinamis via `.env` (`UPLOAD_DIR`).
  3. **Penyederhanaan Navigasi Support Engineer**:
     - Menu khusus role Engineer disederhanakan menjadi: **Tiket Saya**, **Progres Operasional**, dan **Knowledge Base (SOP)**.
  4. **Standarisasi 3 Preset Alasan Hold/Pause SLA**:
     - Ditambahkan modal Hold SLA dengan 3 preset sesuai MoM: *Part Indent* (suku cadang/hardware), *Menunggu Customer* (konfirmasi/akses remote), dan *Dependensi Vendor/Partner/PM*.
  5. **Alur Eskalasi Multi-Tier**:
     - Ditambahkan modal Eskalasi Tiket yang mendukung transfer/eskalasi ke **Project Manager (PM)**, **Mitra Partner**, **Vendor Principal TAC (L3 OEM)**, dan **Internal Lead L2**.
  6. **Knowledge Base dengan Unggah & Unduh PDF Runbook**:
     - Formulir pengajuan SOP kini mendukung unggah berkas PDF asli, dan modal detail artikel menyediakan tombol unduh langsung (*Download PDF Runbook*) dari backend endpoint.
  7. **Sinkronisasi Data Otomatis**:
     - Pinia store (`ticketStore.js`) dilengkapi sinkronisasi awal `fetchInitialDataFromApi()` saat aplikasi dimuat (`App.vue`), dengan mekanisme *graceful fallback* ke penyimpanan lokal jika server offline.
  8. **Registrasi Tiket & Sinkronisasi Jejak Audit**:
     - `CreateTicketView.vue` terhubung langsung untuk merekam tiket ke endpoint `POST /api/tickets` MySQL.
     - `AuditLogView.vue` memuat jejak audit realtime dari `GET /api/audit-logs`.
  9. **Verifikasi Lingkungan Berjalan Aktif**:
     - Backend daemon berjalan pada port 5000 (`http://localhost:5000/api/health`).
     - Frontend Vite berjalan pada port 5173 (`http://localhost:5173/`).
     - Build production Vite `npm run build` tervalidasi sukses (exit code 0).

---

### [2026-09-30] - Tahap 2.2: Pembersihan Jargon Teknis Backend & Eliminasi Tombol Redundan pada Dashboard
* **Penyesuaian UI & Layout Kepadatan (High Density)**:
  1. **Pembersihan Teks/Jargon Teknis**:
     - Menghapus label teknis implementasi internal seperti `(Laragon MySQL)` dan tag berlebih dari tampilan antarmuka pengguna (`DashboardView.vue`). Digantikan dengan status operasional bersih dan elegan: `Sistem Operasional Aktif`.
  2. **Eliminasi Tombol Redundan**:
     - Menghapus tombol-tombol duplikat pada header ringkasan eksekutif (`Buka Antrean Tiket`, `+ Buat Tiket`, dan `Laporan Lengkap →`) karena aksi tersebut sudah terpusat dan tersedia secara permanen di Sidebar (termasuk tombol utama `+ Buat Tiket Baru` dan navigasi menu).
     - Menghapus callout banner di bagian bawah dashboard (`Butuh Analitik Historis & Grafik Kinerja MTTR? Buka Modul Laporan`) untuk mengeliminasi ruang vertikal yang tidak perlu.
  3. **Hasil Layout**:
     - Tampilan Dashboard kini menjadi padat (*compact & high-density*), langsung memfokuskan pandangan pengguna pada 6 KPI metrik utama dan panel ganda: Antrean Insiden Berdampak Tinggi (kiri) bersanding sejajar dengan Hitung Mundur SLA Watch Real-Time (kanan) tanpa terdorong oleh elemen duplikat.

---

### [2026-09-30] - Tahap 2.3: Koreksi Nama Entitas (PT Glotra) & Audit Menyeluruh Elemen Redundan di Seluruh Halaman
* **Koreksi Resmi Nama Entitas Perusahaan**:
  - Memperbaiki seluruh penyebutan nama perusahaan menjadi **PT Glotra** (bukan *Glotrak*) di seluruh modul:
    - Frontend API service: `frontend/src/services/api.js`
    - Backend Server & Health Check: `backend/src/server.js`, `backend/package.json`, `backend/.env`
    - Prisma ORM & Seeding: `backend/prisma/schema.prisma`, `backend/prisma/seed.js`
    - Dokumen Spesifikasi & Panduan: `docs/arsitektur-dan-logical-flow.md`, `docs/MOM_Review_Project_KP.md`, `TASK_LIST_IMPLEMENTASI.md`, `docs/TASK_LIST_IMPLEMENTASI.md`
* **Audit & Eliminasi Elemen Redundan di Seluruh Halaman**:
  1. **Halaman Antrean Tiket (`TicketListView.vue`)**:
     - Menghapus tombol redundant `+ Buat Tiket Baru` dari header karena tombol utama sudah ada permanen di Sidebar.
     - Menghapus telemetry berbau teknis `SLA Engine Active` dan menggantikannya dengan badge status standar `Sistem Operasional Aktif`.
  2. **Halaman Knowledge Base (`KnowledgeBaseView.vue`)**:
     - Mengganti teks `Systems Normal • SLA Engine Active` menjadi badge standar `Sistem Operasional Aktif`.
  3. **Halaman Dashboard (`DashboardView.vue`)**:
     - Telah dipadatkan tanpa tombol redundant atau banner callout yang membuang ruang vertikal.

---

### [2026-09-30] - Tahap 2.4: Eliminasi Badge Non-Notifikasi pada Sidebar Navigasi
* **Pembersihan Badge Sidebar (`Sidebar.vue`)**:
  - Menghapus seluruh badge dekoratif/informasional statis pada item menu:
    - Menghapus badge `Live` pada menu *Ringkasan Eksekutif* dan *Progres Operasional*.
    - Menghapus badge `Admin` pada menu *Kelola Staf & Teknisi* dan *Customer & PIC*.
    - Menghapus badge `Policy` pada menu *Konfigurasi Kebijakan SLA*.
    - Menghapus badge `PDF/XLS` pada menu *Laporan & Analitik*.
    - Menghapus badge `Live` pada menu *Jejak Audit Sistem*.
  - **Hanya Mempertahankan Badge Notifikasi Hitungan Angka (*Count Badges*)**:
    - Badge jumlah tiket aktif (`totalTickets`, misal `8`) pada *Antrean Tiket Global* dan *Tiket Saya*.
    - Badge jumlah artikel SOP (`knowledgeBase.length`, misal `5`) pada *Knowledge Base & SOP*.
  - Hasil tampilan Sidebar kini jauh lebih bersih, rapi, dan berstandar enterprise *shadcn/ui*.

---

### [2026-09-30] - Tahap 2.5: Migrasi Nama Basis Data MySQL ke db_helpdesk_glotra
* **Pembaruan Basis Data MySQL**:
  - Membuat basis data baru bernama **`db_helpdesk_glotra`** di MySQL 8.4 (Laragon).
  - Melakukan migrasi dan kloning skema relasi beserta seluruh data operasional (Users, Customers, SLA Policies, Tickets, Milestones, Attachments, KB, Audit Logs) ke `db_helpdesk_glotra`.
  - Menghapus database lama `db_helpdesk_glotrak` dari MySQL server.
  - Memperbarui `DATABASE_URL` di `backend/.env` menjadi `mysql://root:@localhost:3306/db_helpdesk_glotra`.
  - Me-restart backend daemon Express.js dan memvalidasi koneksi endpoint REST API aktif terhubung ke database `db_helpdesk_glotra`.

---

### [2026-10-01] - Tahap 2.6: Perapihan Layout & Spacing Tabel Data Customer & PIC
* **Refaktorisasi Tabel Data (`CustomersManagementView.vue`)**:
  - **Penyebab Masalah**: Sebelumnya tabel tidak memiliki batas lebar minimum (`min-w`), sehingga 8 kolom data terpaksa berdesakan pada layar standar, menyebabkan pembungkusan kata (*word-wrap*) ekstrem di mana teks terpotong menjadi 4–5 baris bertumpuk vertikal.
  - **Solusi yang Diterapkan**:
    1. Menambahkan batas lebar minimum `min-w-[1150px]` pada kontainer tabel responsif sehingga setiap kolom memiliki ruang horizontal yang proporsional.
    2. Menetapkan lebar minimum per kolom:
       - *Client Entity & Code*: `min-w-[220px]` (Nama mitra, badge kode instansi, dan alamat ringkas).
       - *Industry Sector*: `min-w-[140px]`.
       - *Contract Tier & SLA*: `min-w-[170px]` (Badge kontrak dan rincian respon/resolusi rapi dengan `whitespace-nowrap`).
       - *Production Cluster*: `min-w-[160px]`.
       - *Primary Contacts (PICs)*: `min-w-[180px]` (Nama PIC, nomor telepon, divisi, dan tautan modal).
       - *Active Tickets*: `min-w-[95px]` (Badge count terpusat).
       - *Account Status*: `min-w-[100px]` (Badge pill status aktif).
       - *Actions*: `min-w-[110px]` (Tombol aksi *Edit* dan *Tiket* bergaya shadcn).
    3. Mengubah penyelarasan vertikal seluruh baris menjadi `align-top` dengan `leading-snug` agar teks tidak saling tumpang tindih dan tampak lapang serta terstruktur.
    4. Menerapkan pengamanan `min-w` serupa pada tabel staf (`UsersManagementView.vue`) dan tabel jejak audit (`AuditLogView.vue`).

---

### [2026-10-01] - Tahap 2.7: Normalisasi Lebar Penuh (Full-Width) Halaman Customer & PIC, Konfigurasi SLA, dan Laporan
* **Penyelarasan Layout Kontainer Induk**:
  - **Penyebab Masalah**: Halaman *Customer & PIC* (`CustomersManagementView.vue`), *Konfigurasi Kebijakan SLA* (`SlaConfigView.vue`), *Laporan & Analitik* (`ReportsView.vue`), dan *Pusat Registrasi Tiket* (`CreateTicketView.vue`) sebelumnya menggunakan pembatas lebar `max-w-7xl mx-auto pb-12`, sehingga pada layar desktop lebar tampak menyempit (*boxed*) di tengah dengan ruang kosong lebar di kiri-kanan, tidak serasi dengan halaman *Dashboard*, *Antrean Tiket*, *Knowledge Base*, dan *Jejak Audit* yang memenuhi lebar layar (*full-width*).
  - **Solusi yang Diterapkan**:
    - Menghapus batasan `max-w-7xl mx-auto pb-12` pada elemen root pembungkus di seluruh view terkait dan menyelaraskannya menjadi standar `<div class="space-y-6">`.
    - Seluruh halaman kini memanfaatkan 100% lebar kontainer utama `<main>` secara konsisten, memberikan ruang optimal bagi visualisasi data dan tabel enterprise.

---

### [2026-10-01] - Tahap 2.8: Eliminasi Kartu Bar Ringkasan SLA Dashboard & Teks Kerja Praktik Sidebar
* **Pembersihan Kartu Bar Ringkasan SLA (`DashboardView.vue`)**:
  - Menghapus kartu *Ringkasan Kepatuhan Kontrak SLA* (beserta bar progres *Response SLA* dan *Resolution SLA*) pada kolom kanan Dashboard.
  - Alasan: Informasi SLA compliance sudah terwakili secara resmi pada salah satu dari 6 kartu KPI utama di bagian atas (`SLA Compliance %`), sehingga kartu bar di bawah bersifat duplikat.
  - Dampak: Kolom kanan kini sepenuhnya difokuskan pada kartu real-time *SLA Watch Ticker*, sejajar rapi dengan tabel insiden berdampak tinggi di kolom kiri.
* **Pembersihan Teks Kerja Praktik (`Sidebar.vue`)**:
  - Menghapus teks akademik `Kerja Praktik Sistem Helpdesk 2026` dari footer bawah sidebar, hanya menyisakan identitas resmi `PT Global Transformasi Teknologi`.

### [2026-10-01] - Tahap 2.9: Penyeimbangan Antrean Tiket Dashboard Sejajar Rata dengan Pantauan SLA
* **Penyelarasan Tata Letak Dashboard Dual-Panel (`DashboardView.vue`)**:
  - **Latar Belakang**: Sebelumnya tabel *Antrean Insiden Berdampak Tinggi* di kolom kiri hanya menampilkan maksimal 5 tiket (`.slice(0, 5)`), menyebabkan tinggi fisik kartu tabel jauh lebih pendek (~330px) dibandingkan kartu *Pantauan Waktu SLA Aktif (SLA Watch)* di kolom kanan (~500px), sehingga menyisakan ruang kosong vertikal yang tidak seimbang.
  - **Solusi yang Diterapkan**:
    1. Memperbanyak kuota antrean tiket yang ditampilkan di tabel menjadi maksimal **8 tiket** (mengutamakan tiket aktif, dan memadukan dengan tiket terbaru jika tiket aktif kurang dari 8).
    2. Menyelaraskan struktur grid pembungkus menggunakan `items-stretch` dengan anak kontainer `flex-1 flex flex-col h-full`.
    3. Menambahkan pengamanan `whitespace-nowrap` pada kolom-kolom pendek tabel (*No. Tiket*, *Mitra Pelanggan*, *Status*, *Aksi*) untuk menjaga kerapian saat tabel merentang penuh.
  - **Hasil**: Ketinggian visual kartu antrean tiket kiri dan kartu pemantauan SLA kanan kini sejajar rata (*flush & balanced*), menciptakan visualisasi eksekutif yang padat, proporsional, dan elegan.

### [2026-10-01] - Tahap 2.10: Dinamisasi Master Principal, Eskalasi Vendor, dan Metrik Knowledge Base
* **Dinamisasi Daftar Principal & Eskalasi Vendor**:
  1. *Penyimpanan Terpusat di Store (`ticketStore.js`)*:
     - Menambahkan state `principals` yang persisten ke localStorage dengan daftar vendor enterprise awal (HPE, Cisco, VMware/Broadcom, Rubrik, Brocade, Fortinet, Oracle, MikroTik).
     - Menambahkan getter `allPrincipals` yang menggabungkan seluruh nama principal dari store, artikel knowledge base, dan data tiket aktif secara otomatis (`unique Set`).
     - Menambahkan action `addPrincipal(name)` sehingga jika teknisi memasukkan vendor baru saat eskalasi atau penulisan runbook, vendor tersebut otomatis terdaftar ke dalam katalog sistem.
  2. *Dinamisasi Kartu Eskalasi Detail Tiket (`TicketDetailView.vue`)*:
     - Menghilangkan *fallback* teks dummy statis (seperti contoh HPE `HPE-2026-004821` dan teknisi `Marcus Vance`).
     - Jika tiket belum pernah dieskalasi, status kini secara jujur menampilkan `PENANGANAN INTERNAL` lengkap dengan tombol cepat `+ Eskalasi ke Principal / PM`.
     - Jika tiket telah dieskalasi, kartu menampilkan data real: nama vendor principal, case ID, spesialis penanggung jawab, dan catatan teknis terkini.
     - Modal eskalasi dilengkapi dengan input pemilihan principal vendor dinamis berbasis `<datalist>`.
  3. *Dinamisasi Halaman Knowledge Base (`KnowledgeBaseView.vue`)*:
     - Dropdown filter *All Principals* kini diekstrak secara dinamis dari `availablePrincipals`.
     - Penghitung pada 3 kartu playbook unggulan (*Storage & SAN*, *VMware*, *Backup & DR*) dan tab kategori teknologi kini dihitung secara dinamis dari artikel runbook yang sebenarnya (`computed`).
     - Metrik *Incident Reusability Rate* kini dihitung secara dinamis dari rasio tiket terselesaikan yang memanfaatkan playbook referensi.
     - Modal tambah runbook baru dilengkapi saran vendor dinamis melalui `<datalist>`.

### [2026-10-01] - Tahap 2.11: Arsitektur Master Data Terpusat di Database MySQL (`db_helpdesk_glotra`)
* **Eliminasi Ketergantungan Data Lokal / LocalStorage**:
  - Seluruh data yang berpotensi menjadi acuan master kini resmi dipindahkan dan dikelola pada database MySQL (`db_helpdesk_glotra`) melalui Prisma ORM, bukan sekadar di-cache lokal.
* **Tabel Master Baru yang Diimplementasikan**:
  1. `principals`: Tabel master untuk vendor principal OEM dan mitra L3 (HPE, Cisco, VMware, Rubrik, Brocade, Fortinet, Oracle, MikroTik). Dilengkapi endpoint `GET /api/principals` dan `POST /api/principals`.
  2. `quick_presets`: Tabel master untuk templat tiket cepat insiden (Server Down, Jaringan Lambat, Akses VPN, Database CPU Timeout). Dilengkapi relasi ke `categories` dan endpoint `GET /api/presets`.
  3. `sla_hold_reasons`: Tabel master untuk klausul dan preset alasan penahanan SLA resmi (Part Indent RMA, Akses Customer, Dependensi Vendor, Maintenance Window) dengan endpoint `GET /api/hold-reasons`.
  4. `categories`: Mengaktifkan endpoint REST penuh `GET /api/categories` dan `POST /api/categories` sehingga penambahan kategori baru langsung tersimpan persisten ke tabel `categories` MySQL.
* **Sinkronisasi Frontend & REST API (`ticketStore.js` & `api.js`)**:
  - `fetchInitialDataFromApi()` kini secara paralel memuat seluruh master data (`categories`, `principals`, `quickPresets`, `holdReasons`) dari backend database saat inisialisasi aplikasi.
  - Action `addCategory` dan `addPrincipal` otomatis melakukan panggilan API POST ke database server, menjamin integritas data antar sesi dan antar pengguna.

### [2026-10-01] - Tahap 2.12: Normalisasi Lebar Penuh (Full-Width) Preview Dokumen Laporan Eksekutif
* **Pembersihan Batasan Lebar pada Preview Laporan (`ReportsView.vue`)**:
  - **Penyebab Masalah**: Elemen preview lembar kerja dokumen cetak laporan eksekutif (`#printable-report`) sebelumnya masih memiliki atribut pembatas lebar `max-w-6xl mx-auto`, sehingga pada layar monitor desktop lebar dokumen terlihat terkotak di tengah dengan sisa ruang putih lebar di sisi kiri dan kanan.
  - **Solusi yang Diterapkan**: Menghapus `max-w-6xl mx-auto` dan menggantinya dengan `w-full` agar kontainer dokumen memanfaatkan 100% lebar area kerja utama (`<main>`), sejajar serasi dengan kartu filter periode dan bilah tajuk di atasnya.

### [2026-10-01] - Tahap 2.13: Penghapusan Tampilan Jam Server pada Header Navbar (`Navbar.vue`)
* **Latar Belakang & Permintaan**:
  - Jam server (format WIB | UTC) yang berada di header navbar atas dinilai tidak diperlukan karena membebani tampilan navigasi dan sudah ada jam sistem operasi pengguna serta stempel waktu presisi pada masing-masing tiket dan jejak audit.
* **Tindakan yang Diterapkan**:
  - Menghapus komponen badge jam waktu server di template bilah navigasi header (`Navbar.vue`).
  - Menghilangkan *interval timer* berkala (`setInterval` 1000ms), fungsi `updateClock()`, serta variabel penampung `currentWibTime` dan `currentUtcTime` untuk menghemat siklus pemrosesan CPU dan memori peramban web.
  - Memastikan header navbar kini lebih bersih (*clean*), fokus pada identitas merek, tombol navigasi responsif, pemilih peran (*role switcher*), dan profil pengguna.

### [2026-10-01] - Tahap 2.15: Konfigurasi Port Forwarding Cloudflare Tunnel & Pintasan NPM
* **Latar Belakang Permintaan**:
  - Proyek Helpdesk Ticketing disiapkan agar dapat diakses dari internet publik untuk demonstrasi, review klien, atau presentasi KP menggunakan Cloudflare Tunnel tanpa perlu IP publik statis atau port forwarding router.
* **Arsitektur & Konfigurasi yang Diterapkan**:
  1. **Konfigurasi Proxy Terpadu Vite (`frontend/vite.config.js`)**:
     - Mengatur `server.host: '0.0.0.0'`, `port: 5173`, dan `allowedHosts: true` agar Vite menerima Host header dari domain Cloudflare (`*.trycloudflare.com`).
     - Menambahkan konfigurasi reverse-proxy bawaan Vite untuk `/api` dan `/uploads` yang meneruskan traffic langsung ke backend Express (`http://localhost:5000`). Dengan demikian, hanya diperlukan **satu (1) terowongan Cloudflare** untuk melayani antarmuka SPA frontend sekaligus API backend tanpa kendala CORS atau Mixed Content (HTTPS/HTTP).
  2. **Penyesuaian Service API (`frontend/src/services/api.js`)**:
     - Mengubah default `API_BASE_URL` dari `http://localhost:5000/api` menjadi relatif `/api`, sehingga otomatis mengikuti host aktif (baik saat berjalan di localhost maupun melalui domain publik Cloudflare).
  3. **Pintasan Eksekusi Proyek (`package.json` & `start-tunnel.bat`)**:
     - Menambahkan script `"tunnel": "cloudflared tunnel --url http://localhost:5173"` pada `frontend/package.json`.
     - Menambahkan script `"tunnel": "cloudflared tunnel --url http://localhost:5000"` pada `backend/package.json`.
     - Menyediakan root `package.json` dengan perintah terpadu: `npm run tunnel`.
     - Membuat skrip instan Windows [start-tunnel.bat](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/start-tunnel.bat) agar pengembang dapat mengaktifkan forwarding tunnel cukup dengan klik dua kali.

### [2026-10-01] - Tahap 2.16: Integrasi CRUD Penuh Master Customer & PIC ke Database MySQL
* **Latar Belakang Permintaan**:
  - Pengguna menanyakan apakah data Customer dan PIC masih hardcoded, dan meminta agar seluruh pengelolaan Mitra Pelanggan (Customer) dan Kontak PIC (Person in Charge) sepenuhnya berbasis database MySQL (`db_helpdesk_glotra`), bukan sekadar array statis atau cache browser.
* **Tindakan & Solusi Arsitektur yang Diterapkan**:
  1. **Backend REST API (`customerController.js` & `customerRoutes.js`)**:
     - Memastikan seluruh operasi terhubung langsung ke tabel `customers` dan `customer_pics` melalui Prisma ORM.
     - Menambahkan handler baru:
       - `DELETE /api/customers/:id` (`deleteCustomer`): Menghapus mitra korporat dari database dengan validasi proteksi integritas relasi (menolak hapus jika masih terdapat tiket aktif).
       - `POST /api/customers/:id/pics` (`addCustomerPic`): Menyimpan kontak PIC baru langsung ke tabel `customer_pics`.
       - `PUT /api/customers/:id/pics/:picId` (`updateCustomerPic`): Memperbarui data PIC di tabel `customer_pics`.
       - `DELETE /api/customers/:id/pics/:picId` (`deleteCustomerPic`): Menghapus kontak PIC dari tabel `customer_pics`.
     - Setiap aksi CRUD otomatis mencatat jejak audit (`logAuditEvent`).
  2. **Frontend Service & Store (`api.js` & `ticketStore.js`)**:
     - Menambahkan method klien `deleteCustomer`, `updateCustomerPic`, dan `deleteCustomerPic` pada `api.js`.
     - Memperbarui action `addCustomer`, `updateCustomer`, `deleteCustomer`, `addCustomerPic`, dan `deleteCustomerPic` pada `ticketStore.js` agar secara asynchronous melakukan sinkronisasi dua arah ke API backend MySQL.
  3. **Antarmuka Pengguna (`CustomersManagementView.vue`)**:
     - Menambahkan tombol aksi **Hapus** pada tabel daftar mitra pelanggan dengan dialog konfirmasi aman.
     - Menambahkan tombol hapus kontak PIC pada masing-masing baris daftar PIC di modal detail PIC.
     - Menghubungkan form edit mitra dan form tambah PIC langsung ke action store database.

### [2026-10-01] - Tahap 2.17: Penanganan Zero-State & Perhitungan SLA Murni Dinamis Saat Database Tiket Kosong
* **Latar Belakang Permintaan**:
  - Pada halaman **Customer & PIC** (`CustomersManagementView.vue`) dan **Laporan Analitik** (`ReportsView.vue`), kartu SLA Compliance sebelumnya menampilkan nilai `100%` / `100.0%` dan teks *"Melampaui target korporat 98.0%"* meskipun database tiket masih kosong. Hal ini disebabkan nilai fallback hardcoded `100` pada logika computed ketika total tiket adalah 0.
* **Perbaikan yang Diterapkan**:
  1. **Halaman Customer & PIC (`CustomersManagementView.vue`)**:
     - `slaComplianceRate` kini mengembalikan `null` jika tidak ada tiket di database.
     - Tampilan kartu metrik SLA Compliance menampilkan `-` dengan keterangan *"Belum ada data tiket"* dan latar ikon abu-abu netral (`bg-slate-100 text-slate-400`).
  2. **Halaman Laporan & Analitik Eksekutif (`ReportsView.vue`)**:
     - `reportStats.slaRate` mengembalikan `null` saat tiket pada filter periode terpilih kosong.
     - Kartu metrik SLA menampilkan `-` dan teks *"Belum ada data tiket"* dengan warna kontainer netral `bg-slate-50 border-slate-200`.
     - Tabel **Account SLA Performance Breakdown**: Mitra yang belum memiliki tiket (`handled === 0`) menampilkan nilai respon & resolusi `-`, MTTR `-`, dan tren status *"NO DATA"* (badge abu-abu), bukan klaim 100% atau *"EXCELLENT"*.
     - Tabel **Engineer Workload Roster**: Menampilkan `-` untuk compliance teknisi jika belum ada tiket yang ditugaskan.
  3. **Penyelarasan Komponen Lainnya (`DashboardView.vue`, `Sidebar.vue`, `TicketListView.vue`)**:
     - Memastikan seluruh indikator dan widget SLA di sistem menangani status `null` secara seragam dengan menampilkan `-` dan deskripsi data belum tersedia, bukan angka default 100%.

### [2026-10-05] - Tahap 2.18: Refactoring Halaman Knowledge Base & Integrasi Template Runbook Resmi 12 Bagian
* **Latar Belakang Permintaan**:
  - Halaman Knowledge Base diselaraskan dengan dokumen acuan resmi [GTT_Knowledge_Base_Engineering_Runbook_Template.docx](file:///d:/Unpam/Semester%206/KP/Ticketing-helpdesk/docs/GTT_Knowledge_Base_Engineering_Runbook_Template.docx).
  - Formulir dan alur pengajuan Knowledge Base (`/knowledge-base/propose`) dipisahkan menjadi halaman mandiri berstruktur penuh (mendukung metode Upload PDF dengan auto-ekstraksi metadata atau input manual berstruktur).
  - Filter dan isolasi tiket bagi Support Engineer diterapkan pada pemilihan tiket rujukan kasus.
* **Perbaikan & Fitur yang Diterapkan**:
  1. **Halaman Utama Knowledge Base (`KnowledgeBaseView.vue`)**:
     - Penyelarasan desain berbasis **Shadcn/UI & Corporate Clean Blue** (menghapus dekorasi gradasi neon/AI).
     - Tombol **+ Buat Runbook Baru** kini mengarahkan langsung ke halaman pengajuan `/knowledge-base/propose`.
     - Tombol **Unduh Template (.docx)** langsung mengunduh template resmi dari `/templates/GTT_Knowledge_Base_Engineering_Runbook_Template.docx`.
     - Drawer/Modal Detail Runbook menyajikan **12 Bagian Standar ITIL GTT**:
       1. Document Information (Platform, Firmware, Case Type)
       2. Problem Description (Symptom, Error Code, Environment, Scope)
       3. Pre-Check / Prerequisite
       4. Troubleshooting / Diagnostic Steps
       5. Root Cause Analysis (RCA)
       6. Resolution Procedure & CLI Commands (dengan copy snippet)
       7. Verification & Expected Result
       8. Rollback Procedure (Protokol Keselamatan)
       9. Risk / Potential Impact
       10. Related Case / Ticket (terhubung ke ID Tiket insiden)
       11. Supporting Document & Evidence (dengan tombol unduh berkas bukti/telemetri)
       12. Review & Approval (Prepared By, Approver, Status, Version)
     - Tombol **Cetak SOP** yang menghasilkan dokumen cetak (*print-ready*) terformat rapi sesuai formulir resmi runbook GTT.
     - Bagi peran Admin, modal detail dan panel Governance kini dilengkapi tombol instan **Setujui & Publikasikan (Approve & Publish)** untuk runbook yang berstatus `PENDING_APPROVAL`.
     - Banner notifikasi otomatis muncul ketika engineer dialihkan kembali dari pengajuan runbook baru (`?created=ID`).
  2. **Navigasi Sidebar (`Sidebar.vue`)**:
     - Memperbarui status tautan aktif menu Knowledge Base menggunakan `$route.path.startsWith('/knowledge-base')` agar tetap aktif saat membuka sub-rute `/knowledge-base/propose`.
  3. **Penyempurnaan Alur Step Form & Lampiran Tiket (`TicketDetailView.vue`)**:
     - Memastikan milestone step teknisi memiliki form upload bukti diagnostik serta tautan silang (*cross-link*) langsung antara berkas lampiran dan langkah milestone.

### [2026-10-05] - Tahap 2.19: Refactoring Dashboard Eksekutif Sesuai Mockup Resmi (9. Dashboard)
* **Latar Belakang Permintaan**:
  - Halaman Dashboard Eksekutif (`DashboardView.vue`) diselaraskan 100% dengan rancangan visual mockup acuan **"9. Dashboard"**.
* **Pembaruan Elemen & Komponen Antarmuka**:
  1. **Executive Welcome Header**:
     - Salam dinamis: `Selamat Bertugas, [Nama Pengguna]` dengan subjudul operasional.
     - Dropdown rentang waktu `Last 30 Days` dengan ikon kalender.
     - Status telemetri korporat: `● Sistem Operasional Aktif` (lampu hijau berdenyut).
  2. **6 Kartu Metrik KPI (6-Column Metric Grid)**:
     - **TOTAL TIKET (30 Hari)**: 156 (dengan lencana tren `↑ 12%`).
     - **OPEN (BARU)**: 12 (angka merah tua dengan lencana tren `↑ 20%`).
     - **IN PROGRESS**: 18 (angka biru dengan lencana tren `↓ 10%`).
     - **MENUNGGU (HOLD)**: 6 (angka amber dengan lencana netral `→ 0%`).
     - **CLOSED / SOLVED**: 120 (angka hijau dengan lencana tren `↑ 18%`).
     - **SLA COMPLIANCE**: 98% (dengan keterangan *Target 100% Terlaksana*).
  3. **Baris Visualisasi 1 (Grafik Tren & Distribusi Keparahan)**:
     - **Trend Tiket & Penyelesaian &ndash; 30 Hari Terakhir**: Grafik multi-garis SVG interaktif dengan area bayangan biru, membandingkan *Tiket Baru* (biru), *Tiket Selesai* (hijau), dan *Open / Backlog* (amber) di sumbu X (01 Sep s.d. 29 Sep) dan Y (0 s.d. 40).
     - **Distribusi Tiket berdasarkan Severity**: Donut chart SVG 4 warna dengan lencana tengah `156 Tiket` dan daftar rincian di sisi kanan: *Critical P1 (12)*, *High P2 (24)*, *Medium P3 (58)*, dan *Low P4 (62)*.
  4. **Baris Visualisasi 2 (Pantauan SLA Watch & SLA Performance)**:
     - **Pantauan Waktu SLA Aktif (SLA Watch)**: Tabel interaktif 5 tiket prioritas dengan hitung mundur detik real-time (*00:45:12 SLA RISK*, *02:10:33 WARNING*, *03:25:18 IN PROGRESS*, *05:12:10 ASSIGNED*, *07:31:50 OPEN*), tautan nomor tiket, nama mitra pelanggan, serta tombol *Lihat Semua &rarr;*.
     - **SLA Performance**: Donut gauge 98% hijau dengan status rincian: *Within SLA (153)*, *Near Breach (2)*, *SLA Risk (1)*, dan *SLA Breached (0)*.
  5. **Baris Visualisasi 3 (Beban Teknisi & Top 5 Kategori)**:
     - **Ticket Aktif per Engineer**: Tabel distribusi penugasan 4 teknisi (*Ahmad Fauzi*, *Budi Santoso*, *Andi Wijaya*, *Rizky Pratama*) dengan bar proporsional per kolom (*Assigned*, *In Progress*, *Hold*, *SLA Risk*) dan total tiket aktif.
     - **Top 5 Kategori Tiket**: Tabel 5 kategori insiden teratas (*Server / Infrastructure (42 &bull; 26.9%)*, *Jaringan / Network (30 &bull; 19.2%)*, *Storage (24 &bull; 15.4%)*, *Backup (18 &bull; 11.5%)*, *Aplikasi / System (12 &bull; 7.7%)*) dengan bar persentase horizontal berwarna.
---

### [2026-10-11] - Tahap 3.0: Sinkronisasi Laporan Bab 3, Model Enterprise Architect, & Pembersihan Repositori
* **Penyelarasan Bab 3 Dokumen Laporan Kerja Praktek (BAB_3_Laporan_KP_Helpdesk_Ticketing_GTT.docx)**:
  1. **Integrasi 13 Gambar Tangkapan Layar Asli (docs/WEB VIEW/)**:
     - Gambar 3.16: Halaman Login Pengguna & Portal RBAC (dengan fitur Quick Demo Login untuk verifikasi peran).
     - Gambar 3.17: Dashboard Operasional Admin & SLA Monitor (277 tiket, 99% SLA Compliance, grafik tren & donut severity).
     - Gambar 3.18: Manajemen Antrean Tiket Global / Admin View (Active Queue Load 115, Avg MTTR 3h 25m, filter multi-dimensi).
     - Gambar 3.19: Pembuatan Tiket Baru (PT Astra, PIC Bpk. Bambang Sutrisno, SLA Target otomatis, rekomendasi Knowledge Base).
     - Gambar 3.20: Detail Penanganan Tiket & Timeline Diagnostik (TICK-20261001-0002, countdown Near Breach, Pause SLA, eskalasi Cisco TAC).
     - Gambar 3.21: Antrean Tugas Teknisi / Engineer View (isolasi antrean tugas personal Budi Santoso, 46 tiket).
     - Gambar 3.22: Portal Pelacakan Tiket Mandiri Pelanggan (Customer Self-Service via token aman anti-IDOR 128-bit, Live Tracking).
     - Gambar 3.23: Konfigurasi Master Kebijakan SLA Policy (4 tier: Platinum 24x7, Enterprise 8x5 Gold, Government, Standard Silver).
     - Gambar 3.24: Manajemen Pelanggan Korporat & Kuota PKS (16 mitra, peringatan kuota kritis sisa 10% PT PJB).
     - Gambar 3.25: Manajemen Pengguna & Hak Akses Staf RBAC (9 staf: 3 Admin/CPIG dan 6 IT Support Engineer).
     - Gambar 3.26: ITIL Knowledge Base & Runbook Repositori (99% reusability rate, runbook HPE 3PAR & Brocade FC).
     - Gambar 3.27: Laporan Eksekutif & Analitik SLA Helpdesk (REPORT-SLA-2026-10, MTTR 3h 31m, grafik kepatuhan SLA per mitra).
     - Gambar 3.28: Profil Pengguna & Preferensi Keamanan Akun (biodata Rina Anggraini, ganti sandi mandiri).
  2. **Penyempurnaan Manual Program (Subbab 3.3.4)**:
     - Panduan operasional langkah demi langkah bagi Administrator / CPIG, IT Support Engineer, dan Mitra Pelanggan (Customer Self-Service).
  3. **Penyelarasan Uji Coba Black Box Testing (Subbab 3.3.5 - Tabel 3.3)**:
     - Memperbarui 13 skenario kasus uji (TC-01 s/d TC-13) yang menggunakan data riil dari sistem (login valid/invalid, demo RBAC, kuota PT PJB, tiket PT Astra, pembekuan waktu Pause SLA, dan token anti-IDOR).

* **Sinkronisasi Model Enterprise Architect (EA XML & XMI 2.1)**:
  1. Regenerasi berkas Enterprise_Architect_Helpdesk_GTT.xml dan .xmi via scripts/generate_ea_xmi.py.
  2. Sinkronisasi 2 Aktor Utama (Admin / CPIG Helpdesk & IT Support Engineer) dan 6 Core Use Cases (UC-01 s/d UC-06).
  3. Pembaruan seluruh lifeline Sequence Diagram menjadi :Database (MySQL).
  4. Penerbitan panduan standar dan cetak biru pemodelan UML di docs/enterprise-architect/PANDUAN_STANDAR_UML_ENTERPRISE_ARCHITECT.md.

* **Pembersihan Berkas Bantuan & Artefak Usang (Repository Cleanup)**:
  - Menghapus 12 berkas bantuan/sementara yang sudah usang dan digantikan oleh modul resmi:
    1. docs/dokumen/BAB_3_Laporan_KP_Helpdesk_Ticketing_GTT_Updated.docx (duplikat lama cadangan).
    2. scripts/organize_docs.py (skrip migrasi folder sekali pakai).
    3. scripts/generate_architecture_docx.py (skrip lama rusak).
    4. scripts/generate_architecture_pdf.py (skrip lama rancangan awal).
    5. scripts/generate_drawio_and_render.py (skrip lama Draw.io).
    6. scripts/generate_flowchart_image.py (skrip lama flowchart terpisah).
    7. generate_pdf.py (skrip root converter PDF lama).
    8. Panduan_Pengguna_Helpdesk_GTT.html & .pdf (dokumen user guide versi awal).
    9. Rancangan_Arsitektur_dan_Alur_Helpdesk_Ticketing.docx (dokumen perancangan awal di root).
    10. TASK_LIST_IMPLEMENTASI.md (to-do list fase awal yang sudah selesai seluruhnya).
    11. start-tunnel.bat (utilitas tunnel testing sementara).
    12. Berkas *temporary lock* Word (~$...docx).
  - Struktur repositori kini rapi, bersih, dan hanya memuat berkas-berkas aktif dan mutakhir.
