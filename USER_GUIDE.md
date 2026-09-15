# Panduan Pengguna (User Guide)
# Sistem Helpdesk & Ticketing SLA 24x7 — PT Global Transformasi Teknologi (GTT)

Dokumen ini berisi petunjuk operasional baku bagi seluruh pemangku kepentingan (stakeholder) sistem Helpdesk Ticketing PT Global Transformasi Teknologi. Panduan disusun berdasarkan alur kerja masing-masing peran secara berurutan, sistematis, dan terstandarisasi.

---

## Daftar Isi
1. [Matriks Pembagian Peran Pengguna](#1-matriks-pembagian-peran-pengguna)
2. [Alur Kerja Pelanggan (Customer Self-Service)](#2-alur-kerja-pelanggan-customer-self-service)
3. [Alur Kerja Petugas CPIG / Helpdesk](#3-alur-kerja-petugas-cpig--helpdesk)
4. [Alur Kerja Teknisi (Engineer / NOC)](#4-alur-kerja-teknisi-engineer--noc)
5. [Alur Kerja Manajemen dan Direksi](#5-alur-kerja-manajemen-dan-direksi)
6. [Alur Kerja Administrator Sistem](#6-alur-kerja-administrator-sistem)
7. [Pertanyaan Umum dan Ketentuan Keamanan (FAQ)](#7-pertanyaan-umum-dan-ketentuan-keamanan-faq)

---

## 1. Matriks Pembagian Peran Pengguna

Setiap pengguna sistem memiliki ruang lingkup wewenang operasional yang terisolasi sesuai prinsip pemisahan tugas (Separation of Duties):

| Peran | Klasifikasi | Hak Akses Utama | Tanggung Jawab Operasional |
| :--- | :--- | :--- | :--- |
| **Customer** | Mitra Eksternal | Portal Pelacakan Mandiri | Memantau perkembangan penanganan tiket melalui link token aman tanpa perlu login. |
| **CPIG / Helpdesk** | Petugas Gerbang Laporan | Manajemen Tiket & Penugasan Teknisi | Menerima laporan pelanggan, verifikasi duplikasi, penentuan alokasi penugasan teknisi (*assignment*), dan penerbitan tiket baru. |
| **Engineer** | Teknisi Lapangan / NOC | Pelaksana Penugasan & Solusi | Menerima instruksi penugasan resmi dari CPIG/Admin, mengeksekusi penanganan teknis, mencatat milestone, mengelola jeda SLA (Pause), dan menyelesaikan tiket. |
| **Management** | Direksi & Manajer Layanan | Dashboard Analitik Eksekutif | Mengawasi kepatuhan SLA korporat, tren beban insiden harian/mingguan, visualisasi MTTR, dan sebaran kendala mitra langsung dari dashboard tanpa distraksi operasional. |
| **Admin** | Administrator TI | Kontrol Konfigurasi Penuh & Laporan | Mengelola data pengguna internal, master mitra pelanggan, penugasan teknisi, audit logs, serta menghasilkan laporan berkala dengan filter periode fleksibel. |

---

## 2. Alur Kerja Pelanggan (Customer Self-Service)

Pelanggan mengakses sistem secara mandiri menggunakan mekanisme Tautan Token Terotentikasi tanpa memerlukan akun login.

Alur Proses Pelanggan:
Email Notifikasi Diterima -> Langkah 1: Buka Tautan Resmi Bertoken -> Langkah 2: Pantau Progres & Estimasi SLA -> Langkah 3: Bagikan ke Tim Internal (Opsional) -> Langkah 4: Konfirmasi Pemulihan Layanan (Masa Observasi 72 Jam)

### Langkah 1: Membuka Tautan Resmi dari Email Notifikasi
1. Buka kotak masuk email resmi instansi Anda.
2. Cari pesan masuk dari `support@glotra.co.id` dengan subjek:  
   `[GTT Support] Tiket Baru Diterbitkan: #TICK-XXXXXXXX-XXXX`.
3. Klik tombol **Lihat Status Pelayanan (Live Tracking)** di dalam email.
4. Peramban web akan otomatis membuka portal pelacakan mandiri dengan status **Token Terverifikasi**.

### Langkah 2: Memantau Kronologi Penanganan dan Target SLA
Pada halaman pelacakan, periksa parameter operasional berikut:
* **Target Pemulihan Layanan (SLA):** Batas waktu maksimal pemulihan sistem sesuai kontrak perjanjian kerja sama (PKS 24x7).
* **Alur Progres Penanganan (Live Tracker):** Tahapan kegiatan yang sedang atau telah dilakukan oleh teknisi, lengkap dengan tanggal, jam lokal (WIB), dan nama petugas penanggung jawab.
* **Akar Masalah (Root Cause):** Informasi penyebab kendala yang akan diisi oleh teknisi setelah perbaikan teknis selesai.

### Langkah 3: Membagikan Akses Pemantauan ke Rekan Satu Tim
1. Pada sudut kanan atas layar pelacakan, klik tombol **Bagikan ke Tim Anda**.
2. Sistem akan menyalin tautan resmi beserta token keamanan ke clipboard perangkat Anda.
3. Kirimkan tautan tersebut kepada atasan atau tim internal instansi Anda melalui pesan instan atau email. Rekan kerja Anda dapat langsung melihat progres tanpa perlu melakukan registrasi akun.

### Langkah 4: Melakukan Konfirmasi Pemulihan Layanan
1. Setelah teknisi menyelesaikan penanganan, status tiket berubah menjadi **RESOLVED** dan memasuki masa uji stabilitas selama **72 Jam (3x24 Jam)**.
2. Lakukan evaluasi pada sistem operasional instansi Anda:
   * **Jika koneksi dan sistem telah normal:** Klik tombol **Konfirmasi Layanan Normal & Selesai**. Tiket akan diarsipkan secara permanen.
   * **Jika kendala masih ditemukan:** Klik tombol **Laporkan Kendala Masih Ada**. Sistem akan menghubungkan Anda secara langsung ke petugas Hotline 24x7.

---

## 3. Alur Kerja Petugas CPIG / Helpdesk

Petugas CPIG (Customer Point of Ingestion & Gatekeeping) bertindak sebagai penyaring laporan pertama, penilai tingkat keparahan, dan pemegang wewenang utama penugasan teknisi (*dispatching*).

Alur Proses CPIG:
Laporan Masuk (Telepon/WA/Email) -> Langkah 1: Buka Menu Buat Tiket -> Langkah 2: Cek Duplikasi (Smart Ingestion) -> Langkah 3: Pilih Mitra & PIC -> Langkah 4: Tentukan Kategori & Severity -> Langkah 5: Alokasikan Penugasan Teknisi (Assignment) -> Langkah 6: Unggah Berkas & Terbitkan Tiket

### Langkah 1: Membuka Formulir Penerbitan Tiket
1. Buka menu navigasi utama pada bilah sisi kiri (sidebar).
2. Pilih menu **Buat Tiket**.

### Langkah 2: Menjalankan Pemeriksaan Duplikasi (Smart Ingestion Check)
1. Pada kolom **Deteksi Cerdas Insiden**, masukkan kata kunci kendala yang dilaporkan oleh pelanggan (contoh: Link BGP down, Koneksi Fiber Putus).
2. Periksa daftar peringatan insiden massal yang ditampilkan oleh sistem:
   * Jika insiden serupa sedang dalam penanganan pada pelanggan yang sama, gabungkan informasi pengaduan ke tiket yang sudah aktif guna mencegah tiket ganda (duplikasi).
   * Jika tidak ditemukan kesamaan kendala, lanjutkan ke langkah pembuatan tiket baru.

### Langkah 3: Mengisi Data Pelanggan dan PIC Pelapor
1. Pada kolom **Pelanggan**, pilih instansi pelapor dari daftar mitra terdaftar.
2. Pada kolom **PIC Pelapor**, pilih nama penanggung jawab yang menghubungi Helpdesk.
3. Pilih **Saluran Pelaporan** yang digunakan (Hotline Call Center, WhatsApp, atau Email).

### Langkah 4: Menentukan Klasifikasi Kategori dan Tingkat Keparahan (Severity Level)
1. **Pilih Kategori Masalah:** Pilih kategori domain kendala teknis dari menu dropdown (contoh: *Server & Infrastructure*, *Network & Connectivity*, *Database & Applications*).
2. **Penambahan Kategori Baru Sambil Buat Tiket (*On-the-Fly Category Creation*):**
   * Jika insiden yang dilaporkan merupakan kendala baru yang belum tercakup pada opsi kategori baku (misal: *VoIP Telephony*, *Storage SAN/NAS*, atau *IoT Gateway*), petugas dapat langsung mengklik tombol **+ Kategori Baru** di samping label atau memilih opsi paling bawah **+ Tambah Kategori Masalah Baru...** pada dropdown.
   * Lengkapi formulir cepat modal: Nama Kategori, Kode Singkat (3-5 huruf), dan deskripsi ruang lingkup.
   * Klik **Simpan & Pilih Kategori**. Sistem akan otomatis menyimpan kategori baru tersebut ke master data sistem, memilihnya langsung pada tiket yang sedang dibuat, dan mencatatkannya ke dalam rekam jejak audit (*Audit Logs*).
3. **Pilih Tingkat Keparahan Sesuai Baku Service Level Agreement (SLA):**

| Tingkat Severity | Target Respon | Target Solusi (SLA) | Kriteria Insiden |
| :--- | :--- | :--- | :--- |
| **P1 - Critical** | <= 15 Menit | **4 Jam** | Kegagalan total pada infrastruktur utama (Core Network Down, transaksi perbankan terhenti total). |
| **P2 - Major** | <= 30 Menit | **8 Jam** | Gangguan besar pada jalur utama, namun sistem transmisi cadangan (backup link) masih beroperasi. |
| **P3 - Medium** | <= 60 Menit | **24 Jam** | Penurunan performa kapasitas (latency tinggi / packet loss), operasional klien masih dapat berjalan terbatas. |
| **P4 - Low** | <= 120 Menit | **48 Jam** | Permintaan perubahan konfigurasi rutin, permohonan informasi teknis, atau kendala administratif non-kritis. |

### Langkah 5: Menentukan Alokasi Penugasan Teknisi (Engineer Assignment)
1. Wewenang penugasan teknisi berada **sepenuhnya pada petugas CPIG atau Administrator TI**.
2. Pada kolom **Penugasan Teknisi Bertugas (Opsional saat buat tiket)**, pilih nama teknisi yang berkompeten menangani domain masalah tersebut.
3. Tiket yang langsung ditugaskan akan otomatis berstatus **ASSIGNED**.
4. Jika saat pembuatan tiket teknisi belum ditentukan (status tiket **OPEN**), petugas CPIG atau Admin dapat sewaktu-waktu menugaskan teknisi atau mengalihkan teknisi penanggung jawab melalui tombol **Tugaskan Teknisi / Ganti Teknisi** pada bilah aksi halaman detail tiket.

### Langkah 6: Mengunggah Dokumen Pendukung dan Menerbitkan Tiket
1. Jika pelanggan menyertakan bukti screenshot error atau catatan berkas router, klik area **Lampiran Berkas** (format yang didukung: JPG, PNG, PDF, TXT, LOG, ZIP).
2. Klik tombol **Terbitkan Tiket & Kirim Notifikasi**.
3. Sistem secara otomatis membuat nomor tiket unik, mengkalkulasi tenggat waktu SLA (Resolution Deadline), dan mengirimkan email notifikasi ber-token ke alamat email PIC pelanggan.

---

## 4. Alur Kerja Teknisi (Engineer / NOC)

Teknisi bertugas mengeksekusi perbaikan lapangan dan bertanggung jawab atas pemenuhan target waktu penyelesaian teknis agar SLA tidak terlanggar.

Alur Proses Teknisi:
Menerima Penugasan Resmi dari CPIG / Admin -> Langkah 1: Periksa Tiket yang Ditugaskan (Assigned Tickets) -> Langkah 2: Mulai Penanganan Teknis (IN PROGRESS) -> Langkah 3: Eksekusi Perbaikan & Jeda Timer SLA (Pause / Resume) -> Langkah 4: Pengisian Akar Masalah & Selesaikan Tiket (RESOLVED)

### Langkah 1: Memeriksa Daftar Tiket yang Ditugaskan (Assigned Tickets)
1. Masuk ke sistem menggunakan akun teknisi.
2. Buka halaman **Dashboard** dan periksa tabel **Daftar Antrean Tiket**.
3. **Ketentuan Mutlak Penugasan (Tidak Ada Self-Assignment):** Sesuai standar operasional dan tata kelola pembagian beban kerja di PT Global Transformasi Teknologi, teknisi **tidak memiliki wewenang untuk mengambil sendiri (*self-assign*)** tiket yang belum memiliki teknisi maupun mengklaim tiket secara sepihak. Seluruh penugasan teknisi ditentukan dan didelegasikan secara terpusat oleh petugas **CPIG / Helpdesk** atau **Administrator TI**.
4. Teknisi hanya memiliki hak akses untuk membuka lembar kerja tiket yang telah secara resmi ditugaskan kepada nama dirinya. Tiket yang belum ditugaskan atau tiket milik rekan teknisi lain akan otomatis diblokir oleh sistem dengan layar pengaman **403 - Akses Penugasan Ditolak**.
5. Klik nomor tiket yang telah ditugaskan kepada Anda untuk membuka lembar kerja penanganan teknis.

### Langkah 2: Memulai Penanganan Teknis
1. Setelah siap melakukan pemeriksaan teknis pada perangkat atau konfigurasi jaringan, klik tombol **Mulai Penanganan (IN PROGRESS)**.
2. Sistem mencatat waktu mulai kerja secara presisi ke dalam audit trail dan menghentikan perhitungan waktu respon awal (Response SLA).

### Langkah 3: Prosedur Penahanan Timer SLA (Pause SLA)
Ketentuan Operasional Penahanan SLA: Jika pengerjaan terhenti karena faktor eksternal di luar kendali teknisi GTT, teknisi wajib membekukan perhitungan SLA agar penilaian kinerja (KPI) tidak terpotong:
1. Klik tombol **Tahan Timer SLA (Pause SLA)**.
2. Pilih salah satu kategori penyebab penahanan:
   * **Menunggu Pihak Ketiga / Principal:** Menunggu proses penggantian perangkat (RMA), izin akses vendor gedung, atau nomor tiket eskalasi principal (Cisco/Mikrotik/Fortinet).
   * **Menunggu Respon / Data Pelanggan:** Menunggu jadwal jendela pemeliharaan (maintenance window) dari klien atau menunggu kiriman log sistem tambahan.
3. Masukkan penjelasan detail pada kolom **Keterangan Tambahan**.
4. Masukkan nomor tiket principal pada kolom **Nomor Case Principal** jika ada.
5. Klik **Tahan SLA Sekarang**. Timer deadline SLA akan dibekukan sementara.

### Langkah 4: Prosedur Melanjutkan Penanganan (Resume SLA)
1. Segera setelah konfirmasi atau kiriman suku cadang dari pihak eksternal tiba, buka tiket kembali.
2. Klik tombol **Lanjutkan Penanganan (Resume SLA)**.
3. Sistem secara otomatis menghitung durasi waktu penahanan dan memundurkan batas tenggat waktu (Resolution Deadline) sejumlah waktu penahanan tersebut secara proporsional.

### Langkah 5: Menyelesaikan Tiket (RESOLVED)
1. Setelah perbaikan fisik atau konfigurasi tuntas dan koneksi pelanggan dinyatakan pulih, klik tombol **Selesaikan Tiket (RESOLVED)**.
2. Lengkapi formulir laporan akhir penyelesaian:
   * **Akar Masalah (Root Cause):** Tuliskan penyebab utama gangguan (contoh: Kerusakan modul SFP pada antarmuka port 3 Switch Core).
   * **Tindakan Perbaikan:** Uraikan rincian teknis penanganan yang telah dieksekusi.
3. Klik **Konfirmasi Tiket Selesai**.
4. Penghitungan waktu penyelesaian berhenti, sistem mencatat status kepatuhan SLA (Met atau Breached), dan notifikasi pembaruan dikirimkan ke portal pelanggan.

---

## 5. Alur Kerja Manajemen dan Direksi

Peran Manajemen difokuskan pada pengawasan tingkat tinggi (executive oversight) tanpa dibebani alur teknis operasional. Manajemen tidak memerlukan akses ke menu Knowledge Base maupun ekspor laporan teknis; seluruh tren analitik strategis disajikan secara terintegrasi langsung pada halaman Dashboard utama.

### Langkah 1: Memantau Indikator Utama Kinerja (KPI Summary Cards)
1. Buka halaman **Dashboard Tiket**.
2. Tinjau indikator ringkasan di baris atas:
   * **SLA Compliance Rate:** Persentase kepatuhan SLA korporat (standar GTT: >= 98,0%).
   * **Tiket Aktif:** Total volume tiket yang sedang ditangani oleh divisi NOC.
   * **Tiket Pending (SLA Paused):** Tiket yang sedang menunggu respon mitra atau suku cadang pihak ketiga.
   * **Tiket Selesai (Bulan Berjalan):** Akumulasi insiden yang berhasil dipulihkan dengan status kepatuhan SLA tercatat.

### Langkah 2: Meninjau Panel Tren Analitik & Kinerja Operasional Eksekutif
Tepat di bawah ringkasan KPI, periksa 4 komponen grafik analitik:
1. **Tren Volume Insiden & Kepatuhan SLA:**
   * Menampilkan grafik batang jumlah tiket per hari (Senin s.d. Minggu) atau per pekan dalam bulan berjalan.
   * Dilengkapi indikator warna hijau (SLA Met / Tepat Waktu) dan merah (Breached).
   * Gunakan tombol alih periode **Pekan Ini (W37)** atau **Bulan Ini (Sep 2026)** di sudut kanan atas panel untuk mengganti cakupan waktu.
2. **Waktu Rata-rata Pemulihan (MTTR) vs Batas Kontrak PKS:**
   * Mengukur realisasi durasi perbaikan rata-rata pada setiap level severity (P1 s.d. P4) dibandingkan batas toleransi kontrak.
   * Bilah progres menunjukkan persentase utilisasi toleransi SLA (rata-rata terkelola di bawah 65%).
3. **Distribusi Kategori Kendala Teknis:**
   * Mengidentifikasi konsentrasi sumber masalah (Jaringan & Konektivitas, Server Cloud, Aplikasi Database, atau Akses VPN) untuk mendukung perencanaan kapasitas perangkat.
4. **Konsentrasi Gangguan per Mitra Klien:**
   * Memetakan volume tiket berdasarkan mitra korporat (misal BCA, RS Siloam, Pemprov Banten) untuk evaluasi stabilitas layanan PKS 24x7.

---

## 6. Alur Kerja Administrator Sistem

Administrator bertanggung jawab atas tata kelola akun, data mitra korporat, pemeliharaan keamanan, serta penyediaan laporan berkala untuk kebutuhan audit.

### Langkah 1: Tata Kelola Akun Staf (Users Management)
1. Buka menu **Admin > Kelola Pengguna**.
2. **Tambah Staf Baru:** Klik **Tambah Pengguna Baru**, lengkapi data profil, dan tentukan peran (CPIG, ENGINEER, MANAGEMENT, atau ADMIN).
3. **Edit Profil Staf:** Klik tombol **Edit** pada baris pegawai untuk memperbarui nomor telepon, email, atau mengubah penugasan peran.
4. **Nonaktifkan Akun:** Ubah status menjadi nonaktif seketika bagi staf yang mutasi atau berakhir masa tugasnya. Seluruh perubahan tercatat pada Audit Logs.

### Langkah 2: Tata Kelola Master Data Pelanggan (Customers Management)
1. Buka menu **Admin > Kelola Pelanggan**.
2. **Pendaftaran Mitra Baru:** Klik **Tambah Pelanggan**, isi identitas badan usaha dan kontak PIC awal.
3. **Pembaruan Data Mitra (Edit Mitra):** Klik tombol **Edit Mitra** pada kartu profil perusahaan untuk memperbarui nama instansi, sektor bisnis, atau alamat kantor.
4. **Kelola Kontak PIC:** Klik **+ Tambah PIC** atau klik ikon pensil (**Edit**) pada baris PIC untuk memperbarui data narahubung.

### Langkah 3: Ekspor Laporan Eksekutif dengan Filter Periode Fleksibel
1. Buka menu **Laporan Eksekutif** (`/reports`).
2. Tentukan cakupan data pada bilah filter periode:
   * **Preset Waktu:** Klik tombol pintas **Bulan Ini (Sep 2026)**, **7 Hari Terakhir**, **Bulan Lalu (Agt 2026)**, **Kuartal 3 (Q3 2026)**, atau **Semua (YTD 2026)**.
   * **Rentang Kustom:** Klik opsi **Rentang Kustom...** untuk memunculkan pemilih tanggal bebas (`Tanggal Mulai` dan `Tanggal Akhir`).
   * **Filter Mitra Pelanggan:** Pilih mitra spesifik atau tampilkan seluruh mitra kerja sama.
3. Tinjau rangkuman metrik: Total Tiket Terdata, Kepatuhan SLA, Rata-rata Waktu Respon, dan Rata-rata Durasi Resolusi (MTTR).
4. **Unduh Berkas Ekspor:**
   * **Ekspor CSV:** Klik tombol hijau **Ekspor CSV** untuk menghasilkan berkas CSV standar UTF-8 BOM yang langsung tertata rapi di Microsoft Excel sesuai rentang periode yang dipilih.
   * **Cetak Laporan Resmi:** Klik tombol biru **Cetak Laporan Resmi** untuk mencetak format cetak fisik atau menyimpannya sebagai file PDF formal.

### Langkah 4: Peninjauan dan Ekspor Rekaman Audit Sistem (Audit Trail)
1. Buka menu **Audit Logs**.
2. Periksa riwayat aktivitas sistem meliputi penerbitan tiket, jeda SLA (Pause/Resume), penambahan dan pengubahan pengguna internal, serta pembaruan profil mitra klien.
3. **Ekspor Data Log:** Klik **Ekspor CSV** untuk audit internal atau **Ekspor JSON** untuk keperluan integrasi SIEM. Seluruh catatan audit terekam dengan timestamp waktu presisi tinggi standar ISO 27001.

---

## 7. Pertanyaan Umum dan Ketentuan Keamanan (FAQ)

### Pertanyaan 1: Apakah seorang teknisi dapat mengambil sendiri (self-assign) tiket dari antrean?
**Jawaban:** Tidak. Untuk menjamin pemerataan beban kerja teknisi (*workload balancing*), kepatuhan target respon, dan kesesuaian keahlian (*skill-set matching*), penentuan penugasan tiket sepenuhnya berada di bawah wewenang petugas gerbang laporan (**CPIG / Helpdesk**) dan **Administrator TI**. Teknisi yang mencoba membuka tiket yang belum ditugaskan atau tiket milik teknisi lain akan otomatis diblokir oleh sistem dengan layar pengaman *403 - Akses Penugasan Ditolak*. Supervisor CPIG dan Administrator memegang wewenang penuh untuk menugaskan teknisi baru maupun mengalihkan penugasan (*re-assign*) sewaktu-waktu.

### Pertanyaan 2: Bagaimana sistem mencegah orang luar melihat tiket instansi lain?
**Jawaban:** Sistem menerapkan mekanisme pertahanan Anti-IDOR dengan token kriptografis unik pada setiap tiket. Upaya memanipulasi nomor tiket pada URL secara manual tanpa menyertakan token yang sah akan otomatis ditolak dengan pesan Tautan Tidak Sah.

### Pertanyaan 3: Kapan tiket secara resmi dinyatakan ditutup permanen (CLOSED)?
**Jawaban:** Setelah tiket dinyatakan RESOLVED, tiket berada pada masa observasi stabilitas selama 72 Jam. Tiket akan berubah status menjadi CLOSED secara otomatis setelah masa 72 jam terlampaui tanpa adanya komplain berulang, atau secara instan jika PIC pelanggan menekan tombol konfirmasi kepuasan layanan normal.

---

*Dokumen Standar Operasional Prosedur — PT Global Transformasi Teknologi (Glotra Technology) (c) 2026.*
