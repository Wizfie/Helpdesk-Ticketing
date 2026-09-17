import base64
import os
import subprocess

logo_path = r"d:\Unpam\Semester 6\KP\Ticketing-helpdesk\frontend\public\gtt-logo.png"
logo_base64 = ""
if os.path.exists(logo_path):
    with open(logo_path, "rb") as f:
        logo_base64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Spesifikasi Teknis: Arsitektur Sistem dan Alur Logika Operasional - PT Global Transformasi Teknologi</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    @page {{
      size: A4;
      margin: 18mm 18mm 20mm 18mm;
      @bottom-right {{
        content: "Halaman " counter(page);
        font-size: 8pt;
        color: #64748b;
        font-family: 'Inter', sans-serif;
      }}
      @bottom-left {{
        content: "PT Global Transformasi Teknologi • Dokumen Spesifikasi Teknis GTT-SPEC-ARCH-2026-01";
        font-size: 7.5pt;
        color: #94a3b8;
        font-family: 'Inter', sans-serif;
      }}
    }}

    * {{
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }}

    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #0f172a;
      line-height: 1.55;
      font-size: 9pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }}

    /* Kop Dokumen Resmi */
    .header-box {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }}

    .logo-container {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .logo-container img {{
      height: 44px;
      width: auto;
    }}

    .company-title h1 {{
      margin: 0;
      font-size: 13pt;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.2px;
    }}

    .company-title p {{
      margin: 2px 0 0 0;
      font-size: 8.5pt;
      color: #475569;
      font-weight: 500;
    }}

    .header-badge {{
      text-align: right;
    }}

    .doc-badge {{
      display: inline-block;
      font-size: 8pt;
      font-weight: 700;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }}

    .doc-meta {{
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 4px;
      font-family: 'JetBrains Mono', monospace;
    }}

    /* Judul Utama */
    .title-banner {{
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 18px;
    }}

    .title-banner h2 {{
      margin: 0 0 4px 0;
      font-size: 13pt;
      font-weight: 800;
      letter-spacing: -0.2px;
      color: #f8fafc;
    }}

    .title-banner p {{
      margin: 0;
      font-size: 8.5pt;
      color: #94a3b8;
      line-height: 1.4;
    }}

    /* Metadata Table */
    .meta-table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 8pt;
    }}

    .meta-table th, .meta-table td {{
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
    }}

    .meta-table th {{
      background: #f8fafc;
      font-weight: 700;
      color: #334155;
      width: 25%;
      text-align: left;
    }}

    .meta-table td {{
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
    }}

    /* Heading Sections */
    h2.section-title {{
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 5px;
      margin-top: 22px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    h3.sub-title {{
      font-size: 9.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 14px;
      margin-bottom: 6px;
    }}

    p {{
      margin: 0 0 8px 0;
      color: #334155;
      text-align: justify;
    }}

    /* List styling */
    ul, ol {{
      margin: 4px 0 10px 0;
      padding-left: 20px;
      color: #334155;
    }}

    li {{
      margin-bottom: 4px;
    }}

    /* Visual Box / Architecture Diagram Block */
    .diagram-container {{
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 14px;
      margin: 14px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      line-height: 1.35;
      color: #0f172a;
      white-space: pre;
      overflow-x: auto;
    }}

    .tier-box {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2563eb;
      padding: 10px 12px;
      border-radius: 4px;
      margin-bottom: 8px;
    }}

    .tier-box h4 {{
      margin: 0 0 3px 0;
      font-size: 8.5pt;
      font-weight: 700;
      color: #1e293b;
    }}

    .tier-box p {{
      margin: 0;
      font-size: 8pt;
      color: #64748b;
    }}

    /* Tables */
    table.data-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 8pt;
    }}

    table.data-table th {{
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 700;
      padding: 7px 8px;
      text-align: left;
      border: 1px solid #cbd5e1;
    }}

    table.data-table td {{
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }}

    table.data-table tr:nth-child(even) {{
      background: #f8fafc;
    }}

    .text-center {{
      text-align: center !important;
    }}

    .badge-admin {{
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7pt;
      display: inline-block;
    }}

    .badge-engineer {{
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7pt;
      display: inline-block;
    }}

    .badge-denied {{
      background: #fef2f2;
      color: #b91c1c;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7pt;
      display: inline-block;
    }}

    .formula-card {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3.5px solid #0284c7;
      padding: 10px 14px;
      border-radius: 6px;
      margin: 8px 0 12px 0;
    }}

    .formula-title {{
      font-weight: 700;
      color: #0369a1;
      font-size: 8.5pt;
      margin-bottom: 2px;
    }}

    .formula-math {{
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 9.5pt;
      color: #0f172a;
      margin: 4px 0;
    }}

    .formula-desc {{
      font-size: 8pt;
      color: #475569;
      margin: 0;
    }}

    /* Stage Steps */
    .stage-item {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 6px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }}

    .stage-num {{
      background: #1e293b;
      color: #ffffff;
      font-weight: 800;
      font-size: 8pt;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }}

    .stage-content h5 {{
      margin: 0 0 2px 0;
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
    }}

    .stage-content p {{
      margin: 0;
      font-size: 8pt;
      color: #475569;
    }}

    /* Signature Section */
    .sign-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      page-break-inside: avoid;
    }}

    .sign-table td {{
      width: 33.33%;
      text-align: center;
      vertical-align: top;
      padding: 0 10px;
      font-size: 8.5pt;
    }}

    .sign-space {{
      height: 50px;
    }}

    .sign-name {{
      font-weight: 700;
      color: #0f172a;
      text-decoration: underline;
    }}

    .sign-role {{
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 2px;
    }}

    .page-break {{
      page-break-before: always;
    }}
  </style>
</head>
<body>

  <!-- KOP DOKUMEN -->
  <div class="header-box">
    <div class="logo-container">
      <img src="data:image/png;base64,{logo_base64}" alt="GTT Logo" />
      <div class="company-title">
        <h1>PT GLOBAL TRANSFORMASI TEKNOLOGI</h1>
        <p>Enterprise IT Infrastructure Managed Services & Data Center Operations</p>
      </div>
    </div>
    <div class="header-badge">
      <span class="doc-badge">DOKUMEN TEKNIS</span>
      <div class="doc-meta">REF: GTT-SPEC-ARCH-2026-01</div>
    </div>
  </div>

  <!-- TITLE BANNER -->
  <div class="title-banner">
    <h2>SPESIFIKASI TEKNIS: ARSITEKTUR SISTEM DAN ALUR LOGIKA OPERASIONAL</h2>
    <p>Dokumen Baku Standar Arsitektur Sistem Helpdesk Ticketing, Matriks Kontrol Akses Berbasis Peran (RBAC), Alur Penanganan Insiden, dan Formula Dual SLA Engine</p>
  </div>

  <!-- METADATA TABLE -->
  <table class="meta-table">
    <tr>
      <th>Identifikasi Dokumen</th>
      <td>GTT-SPEC-ARCH-2026-01</td>
      <th>Status Kepatuhan</th>
      <td>ITIL v4 Service Operation & ISO/IEC 20000</td>
    </tr>
    <tr>
      <th>Klasifikasi Akses</th>
      <td>Internal Confidential & Enforceable Standard</td>
      <th>Versi Rilis Arsitektur</th>
      <td>v2.4 Enterprise Production Release</td>
    </tr>
    <tr>
      <th>Tanggal Penerbitan</th>
      <td>18 September 2026</td>
      <th>Target Lingkungan</th>
      <td>Multi-Vendor Data Center (HPE, Cisco, VMware, Brocade)</td>
    </tr>
  </table>

  <!-- BAB I -->
  <h2 class="section-title">BAB I: PENDAHULUAN DAN IKHTISAR SISTEM</h2>
  <p>
    Sistem Helpdesk Ticketing PT Global Transformasi Teknologi (GTT) dirancang sebagai platform terpadu pengelolaan insiden teknologi informasi pada 6 mitra korporat skala besar. Sistem ini dirancang untuk memastikan bahwa setiap gangguan operasional perangkat keras, jaringan, sistem virtualisasi, dan basis data teridentifikasi, dialokasikan, dan dipulihkan dalam batas waktu kontrak tingkat layanan (<em>Service Level Agreement / SLA</em>) yang dapat dipertanggungjawabkan secara hukum.
  </p>

  <p><strong>Pilar Utama Arsitektur Sistem:</strong></p>
  <div class="tier-box">
    <h4>1. Otomasi Kalkulasi Kontrak Layanan (Dynamic SLA Engine)</h4>
    <p>Sistem secara otomatis menghitung batas waktu respon awal (<em>First Touch SLA</em>) dan batas waktu penyelesaian insiden (<em>Resolution SLA / Net MTTR</em>) berdasarkan tingkatan kontrak PKS klien (Platinum 24×7, Gold 8×5, Silver, dan Pemerintah Daerah) tanpa memerlukan pemilihan atau perhitungan manual dari operator.</p>
  </div>

  <div class="tier-box">
    <h4>2. Mekanisme Penahanan Waktu Resmi (SLA Clock Pause Engine)</h4>
    <p>Mendukung pembekuan sementara perhitungan waktu SLA yang sah saat perbaikan terhenti akibat menunggu kedatangan suku cadang vendor principal (<em>Pending Vendor</em>) atau menunggu jadwal pemeliharaan dari pihak pelanggan (<em>Pending Customer</em>).</p>
  </div>

  <div class="tier-box">
    <h4>3. Pemisahan Peran Tegas (Role-Based Access Control)</h4>
    <p>Menetapkan batasan fungsional yang ketat antara peran <strong>ADMIN / CPIG</strong> (manajemen antrean, penugasan, hubungan pelanggan, master data) dan <strong>SUPPORT ENGINEER</strong> (analisis teknis, rekam jejak diagnosa, penentuan akar masalah, dan pemulihan sistem).</p>
  </div>

  <div class="tier-box">
    <h4>4. Relai Surat Elektronik Otomatis (Enterprise Email Relay)</h4>
    <p>Seluruh transmisi pemberitahuan tiket baru, pembaruan langkah penanganan, dan peringatan eskalasi dialirkan melalui relai surat elektronik resmi korporat guna menjamin tersedianya bukti tanda terima digital yang sah secara audit hukum.</p>
  </div>

  <div class="tier-box">
    <h4>5. Daur Ulang Solusi Terintegrasi (ITIL Knowledge Base Runbooks)</h4>
    <p>Prosedur teknis dari tiket yang telah selesai dapat langsung diajukan untuk divalidasi oleh supervisor menjadi panduan operasional standar (<em>Standard Operating Procedure / SOP</em>) terverifikasi dengan sintaksis perintah CLI siap pakai.</p>
  </div>

  <div class="page-break"></div>

  <!-- BAB II -->
  <h2 class="section-title">BAB II: ARSITEKTUR SISTEM MULTI-LAPIS (MULTI-TIER ARCHITECTURE)</h2>
  <p>
    Sistem mengadopsi model arsitektur modular terpisah yang memisahkan lapisan antarmuka, pemrosesan logika bisnis, integrasi layanan eksternal, dan persistensi data guna menjamin keandalan sistem selama 24 jam sehari dan 7 hari seminggu:
  </p>

  <div class="diagram-container">
+===================================================================================+
|                          1. LAPISAN ANTARMUKA PENGGUNA                            |
|  +---------------------------+  +---------------------------+  +---------------+  |
|  | Konsol Administrator/CPIG |  | Konsol Teknisi Lapangan   |  | Portal Klien  |  |
|  | (Ikhtisar, SLA, Kontrak)  |  | (Diagnosa, Log, Resolusi) |  | (Token Publik)|  |
|  +---------------------------+  +---------------------------+  +---------------+  |
+=========================================+=========================================+
                                          |
+=========================================v=========================================+
|                    2. LAPISAN MESIN LOGIKA BISNIS APLIKASI                        |
|  +-----------------------------------------------------------------------------+  |
|  | Pengatur Navigasi Berpelindung RBAC & Manajemen State Aplikasi Terpusat     |  |
|  +-----------------------------------------------------------------------------+  |
|  | • Mesin Kalkulasi Batas Waktu SLA Ganda (Response SLA & Resolution SLA)     |  |
|  | • Mesin Pengawasan & Pemicu Eskalasi Otomatis 3 Tahap (50%, 80%, 100%)       |  |
|  | • Pengolah Asupan Cepat & Klasifikasi Kategori Masalah Multi-Vendor        |  |
|  | • Pengelola Pustaka Prosedur Standar & SOP Terverifikasi (ITIL Runbooks)   |  |
|  +-----------------------------------------------------------------------------+  |
+=========================================+=========================================+
                                          |
+=========================================v=========================================+
|                  3. LAPISAN INTEGRASI & KOMUNIKASI EKSTERNAL                      |
|  +-----------------------+  +----------------------------+  +------------------+  |
|  | Relai Surat Elektronik|  | Jembatan OEM Principal L3  |  | Mesin Jejak Rekam|  |
|  | (SMTP Dispatch Relay) |  | (HPE, Cisco TAC, VMware SR)|  | Audit ISO 20000  |  |
|  +-----------------------+  +----------------------------+  +------------------+  |
+=========================================+=========================================+
                                          |
+=========================================v=========================================+
|                       4. LAPISAN PENYIMPANAN & PERSISTENSI                        |
|  +---------------------------------------+  +----------------------------------+  |
|  | Penyimpanan Lokal Peramban (Cache HA) |  | Kesiapan Layanan Mikro Basis     |  |
|  | Skema Migrasi Mandiri Terenkripsi     |  | Data Terdistribusi Terpusat      |  |
|  +---------------------------------------+  +----------------------------------+  |
+===================================================================================+
  </div>

  <h3 class="sub-title">Uraian Tanggung Jawab Tiap Lapisan:</h3>
  <ul>
    <li><strong>Lapisan 1 (Antarmuka Pengguna)</strong>: Memisahkan tampilan sesuai profil tugas staf. Admin mendapatkan visualisasi analitik SLA dan kontrol klien, teknisi mendapatkan ruang kerja diagnosa insiden, dan pelanggan mengakses status melalui tautan token publik tanpa beban autentikasi akun.</li>
    <li><strong>Lapisan 2 (Mesin Logika Bisnis)</strong>: Berfungsi sebagai otak komputasi yang memvalidasi transisi status tiket, mengoperasikan timer waktu mundur SLA, menghitung penangguhan durasi kerja, dan mengarahkan eskalasi berkala.</li>
    <li><strong>Lapisan 3 (Integrasi & Komunikasi)</strong>: Berkomunikasi dengan peladen SMTP relai untuk menerbitkan surat konfirmasi resmi, menghubungkan tiket dengan API telemetri vendor principal (HPE InfoSight, Cisco TAC), dan mencatat setiap perubahan data ke dalam audit trail yang tidak dapat dimanipulasi.</li>
    <li><strong>Lapisan 4 (Penyimpanan Data)</strong>: Menjaga persistensi status operasional tetap utuh saat terjadi penyegaran halaman peramban melalui mekanisme verifikasi versi skema data (<em>Auto-Migration Engine v2.4</em>).</li>
  </ul>

  <!-- BAB III -->
  <h2 class="section-title">BAB III: MATRIKS WEWENANG DAN HAK AKSES PERAN (RBAC)</h2>
  <p>
    Penerapan pembagian hak akses bertujuan untuk meminimalisasi risiko kesalahan operasional, mencegah penyebaran data rahasia internal ke pelanggan, dan menjaga integritas audit penanganan tiket:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 42%;">Fitur & Modul Operasional</th>
        <th style="width: 20%;" class="text-center">ADMIN / CPIG</th>
        <th style="width: 20%;" class="text-center">SUPPORT ENGINEER</th>
        <th style="width: 18%;" class="text-center">KLIEN (TOKEN)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Pusat Kendali Operasional (<code>/dashboard</code>)</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-engineer">Pantauan Personal</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Penerbitan Tiket Baru & Penggunaan Preset Cepat</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-engineer">Input Lapangan</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Penugasan & Alokasi Ulang Staf Teknisi</td>
        <td class="text-center"><span class="badge-admin">Kontrol Penuh</span></td>
        <td class="text-center"><span class="badge-engineer">Hanya Baca</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td><strong>Penyalinan Tautan Pelacakan Pelanggan</strong></td>
        <td class="text-center"><span class="badge-admin">Akses Khusus</span></td>
        <td class="text-center"><span class="badge-denied">Disembunyikan</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td><strong>Pratinjau Surat Elektronik Notifikasi</strong></td>
        <td class="text-center"><span class="badge-admin">Akses Khusus</span></td>
        <td class="text-center"><span class="badge-denied">Disembunyikan</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td><strong>Saklar Sinkronisasi Surel Klien (Dispatch Sync)</strong></td>
        <td class="text-center"><span class="badge-admin">Bisa Mengubah</span></td>
        <td class="text-center"><span class="badge-engineer">Indikator Status</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pencatatan Rekam Jejak Diagnosa (Milestone & Log)</td>
        <td class="text-center"><span class="badge-admin">Boleh Menambah</span></td>
        <td class="text-center"><span class="badge-engineer">Pelaksana Utama</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pengajuan & Lanjutan Penahanan Waktu (SLA Pause)</td>
        <td class="text-center"><span class="badge-admin">Validasi Otoritas</span></td>
        <td class="text-center"><span class="badge-engineer">Pelaksana Utama</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Penyelesaian Tiket & Analisis Akar Masalah (RCA)</td>
        <td class="text-center"><span class="badge-admin">Verifikasi Akhir</span></td>
        <td class="text-center"><span class="badge-engineer">Pelaksana Utama</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Konfigurasi Matriks Kebijakan SLA (<code>/admin/sla-config</code>)</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak (403)</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Direktori Akun Pelanggan & PIC (<code>/admin/customers</code>)</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak (403)</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Laporan Eksekutif SLA & Audit Ekspor (<code>/reports</code>)</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak (403)</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pustaka Panduan Solusi ITIL (<code>/knowledge-base</code>)</td>
        <td class="text-center"><span class="badge-admin">Persetujuan SOP</span></td>
        <td class="text-center"><span class="badge-engineer">Ajukan & Membaca</span></td>
        <td class="text-center"><span class="badge-engineer">Lihat SOP Terkait</span></td>
      </tr>
      <tr>
        <td>Portal Pelacakan Status Publik (<code>/track/:token</code>)</td>
        <td class="text-center"><span class="badge-admin">Monitoring View</span></td>
        <td class="text-center"><span class="badge-engineer">Monitoring View</span></td>
        <td class="text-center"><span class="badge-admin">Akses Mandiri</span></td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- BAB IV -->
  <h2 class="section-title">BAB IV: ALUR LOGIKA OPERASIONAL PENANGANAN INSIDEN</h2>
  <p>
    Alur penanganan insiden pada sistem Helpdesk GTT mengikuti tujuh tahapan standar siklus operasional yang tertata:
  </p>

  <div class="stage-item">
    <div class="stage-num">1</div>
    <div class="stage-content">
      <h5>Penerimaan Insiden & Penguncian Batas Waktu SLA Otomatis</h5>
      <p>Laporan insiden diterima melalui surat elektronik, portal klien, atau kontak darurat. Petugas CPIG menginput tiket ke dalam sistem dengan memilih entitas pelanggan dan tingkat keparahan. Mesin SLA secara instan mengunci target waktu respon dan target resolusi sesuai klausul kontrak PKS klien. Surat elektronik pemberitahuan penugasan terkirim ke teknisi, dan surat konfirmasi penerimaan tiket beserta tautan pelacakan terkirim ke pelanggan.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num">2</div>
    <div class="stage-content">
      <h5>Respon Awal Teknisi (First Touch SLA Handshake)</h5>
      <p>Teknisi bertugas membuka detail tiket dan mengubah status menjadi IN_PROGRESS. Tindakan ini secara resmi memicu berhentinya penghitungan Response SLA. Sistem mencatat waktu konfirmasi awal dan memastikan batas waktu respon terpenuhi di dalam audit log.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num">3</div>
    <div class="stage-content">
      <h5>Investigasi Diagnostik & Pencatatan Rekam Jejak (Milestone Tracking)</h5>
      <p>Teknisi melakukan isolasi gangguan, pemeriksaan log, dan mitigasi perangkat. Setiap langkah kerja dicatatkan secara kronologis pada Diagnostic Timeline disertai cuplikan perintah terminal CLI dan berkas lampiran pendukung. Bila opsi sinkronisasi surel aktif, pembaruan langkah penanganan terdistribusi ke pihak klien.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num">4</div>
    <div class="stage-content">
      <h5>Penahanan Waktu Layanan Resmi (SLA Clock Pause)</h5>
      <p>Jika perbaikan terhambat akibat menunggu pengiriman suku cadang dari vendor principal atau menunggu izin pemeliharaan dari klien, teknisi mengeksekusi Request SLA Clock Pause dengan menyertakan alasan resmi serta nomor kasus vendor. Timer resolusi dibekukan sementara sehingga sisa waktu SLA kontrak tidak terpotong selama masa penahanan yang sah.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num">5</div>
    <div class="stage-content">
      <h5>Penyelesaian Insiden & Pengisian Analisis Akar Masalah (RCA)</h5>
      <p>Setelah infrastruktur beroperasi normal kembali, teknisi mengisi formulir penyelesaian formal yang memuat Analisis Akar Masalah (Root Cause), Strategi Pemulihan (Resolution Strategy), dan Rekomendasi Preventif jangka panjang. Tiket diubah ke status RESOLVED dan jam hitung resolusi berhenti permanen.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num">6</div>
    <div class="stage-content">
      <h5>Daur Ulang Solusi Menjadi Standar Prosedur (ITIL Runbook Catalog)</h5>
      <p>Teknisi menandai opsi pengajuan ke Knowledge Base. Rincian diagnosa dan urutan perintah CLI masuk ke antrean persetujuan supervisor (Approvals Queue). Setelah ditinjau dan divalidasi oleh Administrator/Lead, prosedur tersebut dipublikasikan menjadi katalog SOP terverifikasi.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num">7</div>
    <div class="stage-content">
      <h5>Verifikasi Klien & Penutupan Tiket Permanen (Closure)</h5>
      <p>Klien memeriksa kestabilan layanan melalui portal pelacakan mandiri. Tiket dinyatakan CLOSED setelah adanya tanda tangan digital konfirmasi klien atau melalui penutupan otomatis sistem setelah melewati masa observasi 3×24 jam tanpa keluhan susulan.</p>
    </div>
  </div>

  <!-- BAB V -->
  <h2 class="section-title">BAB V: FORMULA PERHITUNGAN MESIN SLA GANDA (DUAL SLA ENGINE)</h2>
  <p>
    Sistem mengevaluasi dua dimensi kepatuhan layanan secara terpisah untuk menghasilkan metrik audit performa yang adil dan akurat:
  </p>

  <div class="formula-card">
    <div class="formula-title">1. FORMULA WAKTU RESPON AWAL (FIRST TOUCH RESPONSE SLA)</div>
    <div class="formula-math">&Delta;T_respon = T_respon - T_dibuat</div>
    <p class="formula-desc">
      Mengukur durasi sejak pencatatan tiket (T_dibuat) hingga konfirmasi pertama staf teknis (T_respon). Kepatuhan tercapai bila &Delta;T_respon &le; Target Kontrak PKS (contoh: &le; 30 menit).
    </p>
  </div>

  <div class="formula-card">
    <div class="formula-title">2. FORMULA WAKTU RESOLUSI BERSIH (NET MTTR RESOLUTION SLA)</div>
    <div class="formula-math">Net MTTR = (T_selesai - T_dibuat) - &Sigma; T_tahan</div>
    <p class="formula-desc">
      Mengukur total waktu penanganan sejak pembuatan tiket hingga pemulihan sistem dengan mengecualikan total akumulasi waktu penahanan resmi (&Sigma; T_tahan). Kepatuhan tercapai bila Net MTTR &le; Target Resolusi Kontrak (contoh: &le; 4 jam).
    </p>
  </div>

  <!-- BAB VI -->
  <h2 class="section-title">BAB VI: MATRIKS KONTRAK DAN MEKANISME ESKALASI OTOMATIS</h2>

  <h3 class="sub-title">1. Matriks Batas Waktu Berdasarkan Tingkat Kontrak Layanan (PKS)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>Tingkatan Kontrak</th>
        <th>Jendela Kerja Layanan</th>
        <th class="text-center">Target Respon</th>
        <th class="text-center">Target Resolusi</th>
        <th>Klausul Penalti / Kompensasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Platinum 24×7</strong></td>
        <td>24 Jam × 7 Hari (Non-Stop)</td>
        <td class="text-center">&le; 30 Menit</td>
        <td class="text-center">&le; 4 Jam</td>
        <td>Kredit Layanan 5% / jam keterlambatan</td>
      </tr>
      <tr>
        <td><strong>Gold 8×5</strong></td>
        <td>Senin – Jumat (08:00 – 17:00 WIB)</td>
        <td class="text-center">&le; 30 Menit</td>
        <td class="text-center">&le; 8 Jam</td>
        <td>Kredit Layanan 3% / jam keterlambatan</td>
      </tr>
      <tr>
        <td><strong>Silver 8×5</strong></td>
        <td>Senin – Jumat (08:30 – 17:30 WIB)</td>
        <td class="text-center">&le; 1 Jam</td>
        <td class="text-center">&le; 12 Jam</td>
        <td>Potongan berkala tagihan pemeliharaan</td>
      </tr>
      <tr>
        <td><strong>Pemerintah Tier-1</strong></td>
        <td>Jam Dinas Resmi Pemerintah Daerah</td>
        <td class="text-center">&le; 1 Jam</td>
        <td class="text-center">&le; 12 Jam</td>
        <td>Berita Acara Rekomendasi Audit BPKP</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sub-title">2. Mekanisme Pemicu Eskalasi Otomatis 3 Tahap</h3>
  <div class="stage-item">
    <div class="stage-num" style="background: #f59e0b;">1</div>
    <div class="stage-content">
      <h5>Tahap 1: Peringatan Dini (Waktu Berjalan 50% dari Batas Target)</h5>
      <p>Sistem mengirimkan surat elektronik pengingat resmi ke Teknisi Penanggung Jawab dan Lead SysOps guna memvalidasi tahapan penanganan insiden sebelum mendekati batas kritis.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num" style="background: #e11d48;">2</div>
    <div class="stage-content">
      <h5>Tahap 2: Peringatan Kritis (Waktu Berjalan 80% dari Batas Target)</h5>
      <p>Sistem mengirimkan surat elektronik prioritas tinggi ke Manajer Operasional Layanan (Service Operations Manager) dan menyiagakan jalur komunikasi dukungan principal vendor level 3.</p>
    </div>
  </div>

  <div class="stage-item">
    <div class="stage-num" style="background: #7c3aed;">3</div>
    <div class="stage-content">
      <h5>Tahap 3: Pelanggaran Kontrak (Waktu Berjalan 100% Tanpa Resolusi)</h5>
      <p>Tiket secara otomatis ditandai berstatus SLA Breached. Sistem mencatat pelanggaran ke dalam buku audit permanen, menerbitkan notifikasi ke jajaran Direksi, dan mewajibkan investigasi formal.</p>
    </div>
  </div>

  <!-- BAB VII: PENGESAHAN DOKUMEN -->
  <h2 class="section-title" style="margin-top: 24px;">BAB VII: PENGESAHAN DOKUMEN SPESIFIKASI TEKNIS</h2>
  <p>Dokumen spesifikasi arsitektur dan alur logika sistem ini telah ditinjau dan disahkan sebagai standar operasional baku pada PT Global Transformasi Teknologi:</p>

  <table class="sign-table">
    <tr>
      <td>
        Disusun Oleh,<br/>
        <div class="sign-space"></div>
        <div class="sign-name">Rina Anggraini</div>
        <div class="sign-role">Lead Helpdesk & CPIG Operations</div>
      </td>
      <td>
        Ditinjau Oleh,<br/>
        <div class="sign-space"></div>
        <div class="sign-name">Ir. Hendra Gunawan</div>
        <div class="sign-role">Service Operations Manager</div>
      </td>
      <td>
        Disahkan Oleh,<br/>
        <div class="sign-space"></div>
        <div class="sign-name">Ahmad Fauzi</div>
        <div class="sign-role">Head of IT & Infrastructure</div>
      </td>
    </tr>
  </table>

</body>
</html>
"""

html_file = r"d:\Unpam\Semester 6\KP\Ticketing-helpdesk\Spesifikasi_Teknis_Arsitektur_dan_Alur_Logika_Helpdesk_GTT.html"
pdf_file = r"d:\Unpam\Semester 6\KP\Ticketing-helpdesk\Spesifikasi_Teknis_Arsitektur_dan_Alur_Logika_Helpdesk_GTT.pdf"

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML generated successfully: {html_file}")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if not os.path.exists(edge_path):
    edge_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

cmd = [
    edge_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_file}",
    html_file
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("PDF output code:", res.returncode)
if os.path.exists(pdf_file):
    print(f"Clean enterprise PDF generated! Size: {os.path.getsize(pdf_file)} bytes at {pdf_file}")
else:
    print("PDF generation failed:", res.stderr)
