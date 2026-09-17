# SPESIFIKASI TEKNIS: ARSITEKTUR SISTEM DAN ALUR LOGIKA OPERASIONAL
## SISTEM HELPDESK TICKETING ENTERPRISE
### PT GLOBAL TRANSFORMASI TEKNOLOGI

---

| Parameter Dokumen | Keterangan |
|---|---|
| **Nomor Dokumen** | GTT-SPEC-ARCH-2026-01 |
| **Klasifikasi** | Internal Confidential & Enforceable Technical Standard |
| **Kepatuhan Standar** | ITIL v4 Service Operation & ISO/IEC 20000 |
| **Versi Sistem** | 2.4 Enterprise Architecture Release |
| **Tanggal Efektif** | September 2026 |

---

## BAB I: PENDAHULUAN DAN IKHTISAR SISTEM

Sistem Helpdesk Ticketing PT Global Transformasi Teknologi (GTT) merupakan platform tata kelola penanganan insiden infrastruktur pusat data (*data center*) multi-vendor yang mencakup server fisik, jaringan pita lebar, media penyimpanan terpusat (*Storage Area Network*), kluster virtualisasi, dan basis data transaksi perbankan maupun instansi publik.

### Pilar Kunci Arsitektur:
1. **Kalkulasi Kontraktual SLA Otomatis**: Penentuan batas waktu respon awal (*First Touch*) dan penyelesaian insiden (*Net MTTR*) dikalkulasi otomatis oleh sistem berdasarkan tingkatan kontrak Perjanjian Kerja Sama (PKS) klien, tanpa bergantung pada penentuan manual operator.
2. **Mesin Penahanan Jam Layanan Resmi (*SLA Clock Pause*)**: Mendukung penangguhan perhitungan durasi layanan saat teknisi menunggu pengiriman suku cadang principal vendor (*Pending Vendor*) atau verifikasi pengujian oleh pengguna (*Pending Customer*).
3. **Pemisahan Peran Tegas (*Role-Based Access Control*)**: Pemisahan tugas dan wewenang yang mutlak antara **Administrator / CPIG** (fungsi *helpdesk*, penugasan, master data, hubungan pelanggan) dan **Teknisi Dukungan / Support Engineer** (analisis teknis, rekam jejak diagnosa, analisis akar masalah, dan pemulihan sistem).
4. **Relai Pengiriman Surat Elektronik Korporat**: Seluruh peringatan insiden, penugasan teknisi, dan eskalasi terkirim otomatis melalui protokol relai surat elektronik resmi perusahaan guna menjamin keabsahan rekam audit hukum.
5. **Katalog Prosedur Standar Terintegrasi (*ITIL Runbook Catalog*)**: Solusi dari penanganan tiket nyata dapat diajukan secara terstruktur menjadi dokumen panduan teknis terverifikasi untuk digunakan berulang pada insiden serupa.

---

## BAB II: ARSITEKTUR SISTEM MULTI-LAPIS

Arsitektur aplikasi mengadopsi model multi-lapis (*multi-tier architecture*) terdistribusi yang memisahkan lapisan antarmuka, logika pemrosesan, integrasi eksternal, dan penyimpanan data:

```
+-----------------------------------------------------------------------------------+
|                        1. LAPISAN PENGGUNA & ANTARMUKA                            |
|  +---------------------------+  +---------------------------+  +---------------+  |
|  | Konsol Administrator/CPIG |  | Konsol Teknisi Dukungan   |  | Portal Klien  |  |
|  | (Ikhtisar, SLA, Kontrak)  |  | (Diagnosa, Log, Resolusi) |  | (Token Publik)|  |
|  +---------------------------+  +---------------------------+  +---------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                    2. LAPISAN MESIN APLIKASI & LOGIKA BISNIS                      |
|  +-----------------------------------------------------------------------------+  |
|  | Pelindung Navigasi Peran (RBAC Route Guard) & Manajemen State Terpusat      |  |
|  +-----------------------------------------------------------------------------+  |
|  | • Mesin Kalkulasi Batas Waktu SLA Ganda (Response SLA & Resolution SLA)     |  |
|  | • Mesin Pemantauan & Pemicu Eskalasi Bertingkat 3 Tahap                      |  |
|  | • Pengolah Asupan Cepat & Klasifikasi Kategori Masalah Terintegrasi          |  |
|  | • Repositori Dokumen Solusi Standar & Prosedur Operasional (ITIL Runbooks) |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                  3. LAPISAN INTEGRASI & KOMUNIKASI EKSTERNAL                      |
|  +-----------------------+  +----------------------------+  +------------------+  |
|  | Relai Surat Elektronik|  | Jembatan OEM Principal L3  |  | Pencatat Rekam   |  |
|  | (SMTP Dispatch Relay) |  | (HPE, Cisco TAC, VMware SR)|  | Jejak Audit ISO  |  |
|  +-----------------------+  +----------------------------+  +------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
|                       4. LAPISAN PENYIMPANAN & PERSISTENSI                        |
|  +---------------------------------------+  +----------------------------------+  |
|  | Penyimpanan Lokal Peramban (Cache HA) |  | Kesiapan Layanan Mikro Basis     |  |
|  | Skema Migrasi Mandiri Versi 2.4       |  | Data Transaksional Terpusat      |  |
|  +---------------------------------------+  +----------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### Penjelasan Rincian Lapis Sistem:
1. **Lapisan Antarmuka Pengguna (*Presentation Tier*)**:
   - Menggunakan kerangka kerja berbasis komponen web (*Single Page Application*) yang responsif dengan waktu muat cepat dan tampilan telemetri visual terpadu.
2. **Lapisan Logika Aplikasi (*Application Tier*)**:
   - Menjalankan *state machine* tiket insiden (*OPEN -> ASSIGNED -> IN_PROGRESS -> PENDING_VENDOR / PENDING_CUSTOMER -> RESOLVED -> CLOSED*).
   - Menghitung waktu mundur kepatuhan kontrak layanan secara *real-time*.
3. **Lapisan Integrasi Eksternal (*Integration Tier*)**:
   - Menangani pengiriman pesan surat elektronik formal ke alamat pelanggan dan teknisi.
   - Menghubungkan nomor insiden lokal dengan ID kasus dukungan principal global (HPE Case, Cisco TAC, VMware SR).
4. **Lapisan Persistensi (*Data Tier*)**:
   - Memastikan integritas data tetap bertahan terhadap muat ulang peramban (*page reload*) dan menyediakan fungsi ekspor laporan standar RFC-4180 / PDF.

---

## BAB III: MATRIKS WEWENANG DAN HAK AKSES PERAN (RBAC)

Sistem memberlakukan pembagian hak akses berdasarkan prinsip pembatasan wewenang minimum (*Least Privilege*):

| Modul / Fungsi Operasional | Administrator / CPIG | Teknisi Dukungan (Engineer) | Pelanggan / Klien (Token) |
|---|:---:|:---:|:---:|
| **Pusat Kendali Operasional (`/dashboard`)** | Pantauan Penuh & Seluruh Staf | Pantauan Beban Tugas Pribadi | Akses Ditolak |
| **Penerbitan Tiket Baru (`/tickets/create`)** | Akses Penuh (Manual & Cepat) | Input Insiden Baru | Akses Ditolak |
| **Penugasan & Alokasi Ulang Teknisi** | **Kontrol Penuh** | Hanya Baca (*Read-Only*) | Akses Ditolak |
| **Penyalinan Tautan Pelacakan Pelanggan** | **Khusus Administrator** | Disembunyikan | Akses Ditolak |
| **Pratinjau Surat Elektronik Notifikasi** | **Khusus Administrator** | Disembunyikan | Akses Ditolak |
| **Saklar Sinkronisasi Surel Klien** | **Bisa Mengubah (ON/OFF)** | Indikator Status (*Read-Only*) | Akses Ditolak |
| **Pencatatan Rekam Jejak Diagnosa** | Dapat Menambahkan | **Pelaksana Utama** | Akses Ditolak |
| **Pengajuan / Lanjutan Penahanan SLA** | Validasi Penahanan | **Pelaksana Utama** | Akses Ditolak |
| **Penyelesaian & Formulir Analisis Akar Masalah** | Verifikasi Akhir | **Pelaksana Utama** | Akses Ditolak |
| **Konfigurasi Matriks Kontrak SLA (`/admin/sla-configuration`)** | **Akses Penuh (Tambah/Ubah)** | Akses Ditolak (Kode 403) | Akses Ditolak |
| **Direktori Akun Klien & PIC (`/admin/customers`)** | **Akses Penuh (Kelola)** | Akses Ditolak (Kode 403) | Akses Ditolak |
| **Manajemen Daftar Staf (`/admin/users`)** | **Akses Penuh (Kelola)** | Akses Ditolak (Kode 403) | Akses Ditolak |
| **Laporan Eksekutif SLA & Audit (`/reports`)** | **Akses Penuh (Cetak/Ekspor)** | Akses Ditolak (Kode 403) | Akses Ditolak |
| **Pustaka Panduan Solusi (`/knowledge-base`)** | Validasi & Publikasi Resmi | Pengajuan Draft & Membaca | Baca Solusi Terkait |
| **Portal Pelacakan Status Mandiri (`/track/...`)** | Mode Pemantauan | Mode Pemantauan | **Akses Mandiri Khusus** |

---

## BAB IV: ALUR LOGIKA OPERASIONAL PENANGANAN INSIDEN

Alur penanganan insiden mengikuti tujuh tahapan standar siklus hidup layanan:

### 1. Tahap Penerimaan Insiden (*Incident Intake & SLA Binding*)
- Laporan diterima melalui surel pengaduan, portal bantuan, atau saluran siaga.
- Operator Helpdesk/CPIG mencatat tiket ke sistem dengan memilih entitas klien dan tingkat keparahan (*Severity*).
- Mesin SLA secara langsung mengunci target waktu respon dan target resolusi berdasarkan klausul kontrak klien yang berlaku.
- Sistem menerbitkan Nomor Tiket resmi dan tautan pelacakan terenkripsi.
- Surat elektronik notifikasi penugasan terkirim otomatis ke teknisi yang dialokasikan, dan surat konfirmasi penerimaan terkirim ke alamat surel penanggung jawab klien.

### 2. Tahap Respon Awal (*First Touch SLA Acknowledgement*)
- Teknisi yang bertugas membuka tiket dan mengubah status menjadi **IN_PROGRESS**.
- Jam hitung *Response SLA* seketika dihentikan. Sistem mencatat bahwa respon awal telah terpenuhi (*SLA Response Met*).
- Riwayat respon awal tercatat di dalam rekam jejak audit (*audit log*).

### 3. Tahap Investigasi dan Diagnosa Lapangan (*Technical Milestone Tracking*)
- Teknisi melakukan pemeriksaan perangkat keras, analisis berkas log (*log trace*), dan pengujian jaringan.
- Setiap temuan dicatatkan ke dalam *Diagnostic & Troubleshooting Timeline* dengan menyertakan perintah terminal (*CLI sequence*), status pengujian, dan berkas lampiran pendukung.
- Jika fitur sinkronisasi surel aktif, pembaruan langkah penanganan akan terkirim sebagai pemberitahuan berkala ke pihak pelanggan.

### 4. Tahap Penahanan Waktu Resmi (*SLA Clock Pause*)
- Apabila perbaikan membutuhkan suku cadang pengganti dari vendor (*Pending Vendor*) atau memerlukan jendela pemeliharaan dari pelanggan (*Pending Customer*), teknisi mengajukan *Request SLA Clock Pause*.
- Jam hitung resolusi dibekukan (*Freeze*). Durasi selama status penahanan tidak dihitung sebagai keterlambatan penyedia layanan.
- Begitu suku cadang tiba atau izin pemeliharaan diberikan, teknisi menekan tombol *Lanjutkan SLA*, dan perhitungan waktu resolusi bersih (*Net MTTR*) dilanjutkan kembali secara mulus.

### 5. Tahap Penyelesaian Insiden dan Analisis Akar Masalah (*Resolution & Root Cause Analysis*)
- Setelah sistem kembali normal, teknisi mengisi formulir formal:
  - **Akar Masalah Teknis (*Root Cause Analysis*)**: Penyebab dasar timbulnya kerusakan.
  - **Strategi Pemulihan (*Resolution Strategy*)**: Langkah korektif yang berhasil menormalkan sistem.
  - **Rekomendasi Preventif (*Preventive Recommendation*)**: Saran perbaikan arsitektur atau konfigurasi guna mencegah insiden terulang.
- Tiket dinyatakan selesai (**RESOLVED**), dan jam hitung resolusi resmi dihentikan permanen.

### 6. Tahap Daur Ulang Pengetahuan (*Knowledge-Centered Service*)
- Teknisi menandai opsi *Propose for Knowledge Base*.
- Rincian penanganan, sintaksis perintah CLI, dan verifikasi perbaikan masuk ke dalam antrean persetujuan supervisor (*Approvals Queue*).
- Administrator/Lead memvalidasi kelayakan prosedur tersebut sebelum menerbitkannya sebagai dokumen *Validated Engineering Runbook* (dengan kode referensi unik seperti KB-8821).

### 7. Tahap Konfirmasi dan Penutupan Tiket (*Closure Verification*)
- Pelanggan meninjau laporan perbaikan melalui portal pelacakan mandiri.
- Tiket dinyatakan ditutup permanen (**CLOSED**) melalui konfirmasi pelanggan atau melalui penutupan otomatis sistem setelah masa tenggang 3×24 jam tanpa keluhan lanjutan.

---

## BAB V: FORMULA PERHITUNGAN MESIN SLA GANDA (DUAL SLA ENGINE)

Untuk memastikan akurasi audit kinerja layanan, sistem memisahkan dua parameter SLA secara independen:

### 1. Formula Waktu Respon Awal (*Response SLA*)
Mengukur selang waktu sejak pencatatan tiket ($T_{\text{dibuat}}$) hingga adanya tindakan konfirmasi pertama oleh staf teknis ($T_{\text{respon}}$):
$$\Delta T_{\text{respon}} = T_{\text{respon}} - T_{\text{dibuat}}$$

**Kriteria Kepatuhan**:
$$\Delta T_{\text{respon}} \le \text{Batas Target Respon Kontrak}$$

### 2. Formula Waktu Resolusi Bersih (*Net MTTR Resolution SLA*)
Mengukur total waktu penanganan sejak insiden tercatat ($T_{\text{selesai}} - T_{\text{dibuat}}$) dengan mengurangkan seluruh akumulasi waktu penahanan resmi ($\sum T_{\text{tahan}}$):
$$\text{Net MTTR} = (T_{\text{selesai}} - T_{\text{dibuat}}) - \sum T_{\text{tahan}}$$

**Kriteria Kepatuhan**:
$$\text{Net MTTR} \le \text{Batas Target Resolusi Kontrak}$$

---

## BAB VI: MATRIKS KONTRAK DAN ESKALASI OTOMATIS

### 1. Matriks Batas Waktu Berdasarkan Tingkat Kontrak PKS
| Tingkat Kontrak | Jam Operasional Layanan | Target Respon Awal | Target Resolusi Maksimal | Kompensasi / Konsekuensi |
|---|---|:---:|:---:|---|
| **Platinum 24×7** | 24 Jam × 7 Hari Non-Stop | $\le$ 30 Menit | $\le$ 4 Jam | *Penalty Credit* 5% / jam keterlambatan |
| **Gold 8×5** | Senin – Jumat (08:00 – 17:00 WIB) | $\le$ 30 Menit | $\le$ 8 Jam | *Penalty Credit* 3% / jam keterlambatan |
| **Silver 8×5** | Senin – Jumat (08:30 – 17:30 WIB) | $\le$ 1 Jam | $\le$ 12 Jam | Potongan biaya pemeliharaan berkala |
| **Pemerintah Tier-1** | Jam Dinas Resmi Pemerintah Daerah | $\le$ 1 Jam | $\le$ 12 Jam | Berita Acara Evaluasi Kinerja BPKP |

### 2. Mekanisme Eskalasi Bertingkat 3 Tahap (*Automated Escalation Triggers*)
Sistem secara otomatis mengevaluasi persentase berjalannya waktu resolusi terhadap target kontrak:
- **Tingkat 1 (Peringatan Awal - 50% Waktu Berjalan)**:
  - Mengirimkan surat elektronik pengingat (*reminder*) ke teknisi yang bertugas dan Lead SysOps agar segera memvalidasi progres penanganan.
- **Tingkat 2 (Peringatan Kritis - 80% Waktu Berjalan)**:
  - Mengirimkan surat elektronik siaga darurat (*high priority alert*) ke Manajer Operasional Layanan (*Service Operations Manager*) dan menyiagakan jalur komunikasi principal vendor level 3.
- **Tingkat 3 (Pelanggaran Kontrak - 100% Waktu Berjalan Tanpa Resolusi)**:
  - Sistem secara otomatis menandai tiket berstatus *SLA Breached*.
  - Peristiwa pelanggaran dicatatkan secara permanen ke dalam rekam audit (*audit trail*), notifikasi diteruskan ke Direksi, dan mewajibkan investigasi formal (*RCA Defense Meeting*).

---

## BAB VII: PENGESAHAN DOKUMEN SPESIFIKASI TEKNIS

Dokumen spesifikasi arsitektur dan alur logika sistem ini telah ditinjau dan disahkan sebagai acuan operasional resmi pada PT Global Transformasi Teknologi:

<br/><br/>
<table style="width: 100%; border: none; text-align: center; font-size: 10pt;">
  <tr>
    <td style="width: 33%; border: none;">
      Disusun Oleh,<br/><br/><br/><br/>
      <strong>Rina Anggraini</strong><br/>
      Lead Helpdesk & CPIG Operations
    </td>
    <td style="width: 33%; border: none;">
      Ditinjau Oleh,<br/><br/><br/><br/>
      <strong>Ir. Hendra Gunawan</strong><br/>
      Service Operations Manager
    </td>
    <td style="width: 33%; border: none;">
      Disahkan Oleh,<br/><br/><br/><br/>
      <strong>Ahmad Fauzi</strong><br/>
      Head of IT & Infrastructure
    </td>
  </tr>
</table>
