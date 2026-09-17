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
  <title>Spesifikasi Teknis: Arsitektur Sistem & Alur Operasional Helpdesk - PT Global Transformasi Teknologi</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    @page {{
      size: A4 portrait;
      margin: 15mm 16mm 16mm 16mm;
      @bottom-right {{
        content: "Halaman " counter(page);
        font-size: 8pt;
        color: #64748b;
        font-family: 'Inter', sans-serif;
      }}
      @bottom-left {{
        content: "PT Global Transformasi Teknologi • Dokumen Standar Teknis GTT-SPEC-ARCH-2026-01";
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
      line-height: 1.45;
      font-size: 8.5pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }}

    /* Kop Dokumen Resmi */
    .header-box {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }}

    .logo-container {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .logo-container img {{
      height: 38px;
      width: auto;
    }}

    .company-title h1 {{
      margin: 0;
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.2px;
    }}

    .company-title p {{
      margin: 1px 0 0 0;
      font-size: 8pt;
      color: #475569;
      font-weight: 500;
    }}

    .header-badge {{
      text-align: right;
    }}

    .doc-badge {{
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      background: #0f172a;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
    }}

    .doc-meta {{
      font-size: 7pt;
      color: #64748b;
      margin-top: 3px;
      font-family: 'JetBrains Mono', monospace;
    }}

    /* Title Block */
    .title-block {{
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 4px solid #0f172a;
      padding: 10px 14px;
      border-radius: 4px;
      margin-bottom: 12px;
    }}

    .title-block h2 {{
      margin: 0 0 3px 0;
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
    }}

    .title-block p {{
      margin: 0;
      font-size: 8pt;
      color: #475569;
    }}

    /* Metadata Table */
    .meta-table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 7.5pt;
    }}

    .meta-table th, .meta-table td {{
      padding: 4px 8px;
      border: 1px solid #e2e8f0;
    }}

    .meta-table th {{
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
      width: 22%;
      text-align: left;
    }}

    .meta-table td {{
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
    }}

    /* Headings */
    h2.section-title {{
      font-size: 9.5pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 14px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}

    h3.sub-title {{
      font-size: 8.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 10px;
      margin-bottom: 4px;
    }}

    p {{
      margin: 0 0 6px 0;
      color: #334155;
      text-align: justify;
    }}

    ul, ol {{
      margin: 3px 0 8px 0;
      padding-left: 18px;
      color: #334155;
    }}

    li {{
      margin-bottom: 3px;
    }}

    /* SVG Architecture Diagram Container */
    .arch-svg-container {{
      width: 100%;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px;
      margin: 8px 0 12px 0;
      display: flex;
      justify-content: center;
    }}

    .arch-svg-container svg {{
      width: 100%;
      height: auto;
      max-height: 250px;
    }}

    /* Tables */
    table.data-table {{
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 12px 0;
      font-size: 7.5pt;
    }}

    table.data-table th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 5px 6px;
      text-align: left;
      border: 1px solid #cbd5e1;
    }}

    table.data-table td {{
      padding: 5px 6px;
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
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 6.5pt;
      display: inline-block;
    }}

    .badge-engineer {{
      background: #f0fdf4;
      color: #15803d;
      border: 1px solid #bbf7d0;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 6.5pt;
      display: inline-block;
    }}

    .badge-denied {{
      background: #fef2f2;
      color: #b91c1c;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 6.5pt;
      display: inline-block;
    }}

    /* Formula Cards */
    .formula-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 8px 0 12px 0;
    }}

    .formula-card {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #0284c7;
      padding: 8px 10px;
      border-radius: 4px;
    }}

    .formula-title {{
      font-weight: 700;
      color: #0369a1;
      font-size: 7.5pt;
      margin-bottom: 2px;
      text-transform: uppercase;
    }}

    .formula-math {{
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 8.5pt;
      color: #0f172a;
      margin: 4px 0;
    }}

    .formula-desc {{
      font-size: 7pt;
      color: #475569;
      margin: 0;
      line-height: 1.35;
    }}

    /* Workflow Stage Cards */
    .flow-list {{
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin: 8px 0 12px 0;
    }}

    .flow-item {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #3b82f6;
      border-radius: 4px;
      padding: 6px 10px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }}

    .flow-num {{
      background: #1e293b;
      color: #ffffff;
      font-weight: 800;
      font-size: 7.5pt;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }}

    .flow-content h5 {{
      margin: 0 0 2px 0;
      font-size: 8pt;
      font-weight: 700;
      color: #0f172a;
    }}

    .flow-content p {{
      margin: 0;
      font-size: 7.5pt;
      color: #475569;
      line-height: 1.35;
    }}

    /* Signature Section */
    .sign-table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
      page-break-inside: avoid;
    }}

    .sign-table td {{
      width: 33.33%;
      text-align: center;
      vertical-align: top;
      padding: 0 8px;
      font-size: 8pt;
    }}

    .sign-space {{
      height: 48px;
    }}

    .sign-name {{
      font-weight: 700;
      color: #0f172a;
      text-decoration: underline;
    }}

    .sign-role {{
      font-size: 7pt;
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
        <p>Divisi Layanan Terkelola Infrastruktur IT & Operasional Data Center</p>
      </div>
    </div>
    <div class="header-badge">
      <span class="doc-badge">STANDAR TEKNIS</span>
      <div class="doc-meta">GTT-SPEC-ARCH-2026-01</div>
    </div>
  </div>

  <!-- TITLE BLOCK -->
  <div class="title-block">
    <h2>SPESIFIKASI ARSITEKTUR SISTEM & ALUR OPERASIONAL HELPDESK</h2>
    <p>Dokumen Teknis Struktur Multi-Tier, Matriks Hak Akses (RBAC), Siklus Hidup Penanganan Tiket, dan Logika Mesin SLA</p>
  </div>

  <!-- METADATA TABLE -->
  <table class="meta-table">
    <tr>
      <th>Nomor Dokumen</th>
      <td>GTT-SPEC-ARCH-2026-01</td>
      <th>Standar Rujukan</th>
      <td>ITIL v4 Service Operation & ISO/IEC 20000</td>
    </tr>
    <tr>
      <th>Klasifikasi</th>
      <td>Internal Teknis - Terbatas</td>
      <th>Versi Rilis</th>
      <td>v2.4 Enterprise Architecture</td>
    </tr>
    <tr>
      <th>Tanggal Efektif</th>
      <td>18 September 2026</td>
      <th>Lingkup Infrastruktur</th>
      <td>Server, Storage SAN, Jaringan Enterprise, Virtualisasi & Database</td>
    </tr>
  </table>

  <!-- BAB I -->
  <h2 class="section-title">BAB I: RINGKASAN SISTEM</h2>
  <p>
    Sistem Helpdesk Ticketing PT Global Transformasi Teknologi dirancang untuk mengelola dan memantau penanganan insiden infrastruktur IT pada 6 klien enterprise (BCA, PT Astra Honda Motor, Siloam Hospitals Group, Diskominfo Jawa Barat, Telkomsel Enterprise, dan Bank Mandiri).
  </p>
  <p>
    Sistem mengotomatisasi penegakan kontrak tingkat layanan (<em>Service Level Agreement / SLA</em>), pencatatan rekam jejak diagnostik, koordinasi eskalasi teknis, dan standardisasi prosedur perbaikan ke dalam pustaka operasional terverifikasi.
  </p>

  <!-- BAB II -->
  <h2 class="section-title">BAB II: DIAGRAM ARSITEKTUR SISTEM</h2>
  <p>
    Sistem menerapkan arsitektur 4 lapisan modular yang memisahkan antara antarmuka pengguna, pemrosesan logika bisnis, integrasi layanan eksternal, dan manajemen persistensi data:
  </p>

  <!-- SVG VECTOR ARCHITECTURE DIAGRAM -->
  <div class="arch-svg-container">
    <svg viewBox="0 0 680 270" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background Grid / Bounds -->
      <rect width="680" height="270" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>

      <!-- LAYER 1: LAPISAN ANTARMUKA -->
      <rect x="15" y="12" width="650" height="52" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
      <rect x="15" y="12" width="160" height="18" rx="3" fill="#1e293b"/>
      <text x="22" y="24" fill="#ffffff" font-family="Inter, sans-serif" font-size="8.5" font-weight="700">1. LAPISAN ANTARMUKA PENGGUNA</text>
      
      <!-- L1 Sub-boxes -->
      <rect x="25" y="34" width="195" height="24" rx="3" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="35" y="49" fill="#1e40af" font-family="Inter, sans-serif" font-size="7.5" font-weight="600">Konsol Admin / CPIG (Full Control)</text>
      
      <rect x="240" y="34" width="200" height="24" rx="3" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
      <text x="250" y="49" fill="#166534" font-family="Inter, sans-serif" font-size="7.5" font-weight="600">Konsol Teknisi (Diagnosa & MTTR)</text>
      
      <rect x="460" y="34" width="195" height="24" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="475" y="49" fill="#334155" font-family="Inter, sans-serif" font-size="7.5" font-weight="600">Portal Klien (Tokenized URL Track)</text>

      <!-- Connectors 1 to 2 -->
      <path d="M122 64 L122 75 M340 64 L340 75 M557 64 L557 75" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2"/>

      <!-- LAYER 2: LOGIKA BISNIS & MESIN SLA -->
      <rect x="15" y="75" width="650" height="64" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <rect x="15" y="75" width="170" height="18" rx="3" fill="#2563eb"/>
      <text x="22" y="87" fill="#ffffff" font-family="Inter, sans-serif" font-size="8.5" font-weight="700">2. LOGIKA BISNIS & MESIN SLA</text>

      <!-- L2 Sub-boxes -->
      <rect x="25" y="99" width="120" height="32" rx="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
      <text x="33" y="112" fill="#0f172a" font-family="Inter, sans-serif" font-size="7" font-weight="700">RBAC Guard</text>
      <text x="33" y="123" fill="#64748b" font-family="Inter, sans-serif" font-size="6.5">Route & Action Shield</text>

      <rect x="155" y="99" width="150" height="32" rx="3" fill="#eff6ff" stroke="#93c5fd" stroke-width="1"/>
      <text x="163" y="112" fill="#1d4ed8" font-family="Inter, sans-serif" font-size="7" font-weight="700">Dual-SLA Calculator</text>
      <text x="163" y="123" fill="#3b82f6" font-family="Inter, sans-serif" font-size="6.5">Response & Net MTTR</text>

      <rect x="315" y="99" width="140" height="32" rx="3" fill="#eff6ff" stroke="#93c5fd" stroke-width="1"/>
      <text x="323" y="112" fill="#1d4ed8" font-family="Inter, sans-serif" font-size="7" font-weight="700">SLA Pause Engine</text>
      <text x="323" y="123" fill="#3b82f6" font-family="Inter, sans-serif" font-size="6.5">Vendor & Cust Hold</text>

      <rect x="465" y="99" width="95" height="32" rx="3" fill="#fff7ed" stroke="#fdba74" stroke-width="1"/>
      <text x="472" y="112" fill="#c2410c" font-family="Inter, sans-serif" font-size="7" font-weight="700">Auto Escalation</text>
      <text x="472" y="123" fill="#ea580c" font-family="Inter, sans-serif" font-size="6.5">50% / 80% / 100%</text>

      <rect x="570" y="99" width="85" height="32" rx="3" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1"/>
      <text x="576" y="112" fill="#6d28d9" font-family="Inter, sans-serif" font-size="7" font-weight="700">KCS Runbook</text>
      <text x="576" y="123" fill="#8b5cf6" font-family="Inter, sans-serif" font-size="6.5">Approved SOPs</text>

      <!-- Connectors 2 to 3 -->
      <path d="M230 139 L230 150 M450 139 L450 150" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2"/>

      <!-- LAYER 3: INTEGRASI & KOMUNIKASI -->
      <rect x="15" y="150" width="650" height="48" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
      <rect x="15" y="150" width="160" height="17" rx="3" fill="#475569"/>
      <text x="22" y="162" fill="#ffffff" font-family="Inter, sans-serif" font-size="8" font-weight="700">3. INTEGRASI & KOMUNIKASI</text>

      <rect x="25" y="171" width="195" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="35" y="185" fill="#334155" font-family="Inter, sans-serif" font-size="7" font-weight="600">SMTP Relay (Notifikasi Email Resmi)</text>

      <rect x="240" y="171" width="200" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="250" y="185" fill="#334155" font-family="Inter, sans-serif" font-size="7" font-weight="600">Jembatan OEM L3 (HPE / Cisco / VMware)</text>

      <rect x="460" y="171" width="195" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="470" y="185" fill="#334155" font-family="Inter, sans-serif" font-size="7" font-weight="600">Pencatat Jejak Audit (Event Log)</text>

      <!-- Connectors 3 to 4 -->
      <path d="M340 198 L340 209" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2"/>

      <!-- LAYER 4: DATA & PERSISTENSI -->
      <rect x="15" y="209" width="650" height="48" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.2"/>
      <rect x="15" y="209" width="150" height="17" rx="3" fill="#0f172a"/>
      <text x="22" y="221" fill="#ffffff" font-family="Inter, sans-serif" font-size="8" font-weight="700">4. DATA & PERSISTENSI</text>

      <rect x="25" y="230" width="195" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="35" y="244" fill="#334155" font-family="Inter, sans-serif" font-size="7" font-weight="600">Pinia Reactive Store & Local Cache</text>

      <rect x="240" y="230" width="200" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="250" y="244" fill="#334155" font-family="Inter, sans-serif" font-size="7" font-weight="600">Skema Migrasi Mandiri (v2.4 Engine)</text>

      <rect x="460" y="230" width="195" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="470" y="244" fill="#334155" font-family="Inter, sans-serif" font-size="7" font-weight="600">Kesiapan REST API / Basis Data Pusat</text>
    </svg>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Komponen Arsitektur</th>
        <th style="width: 35%;">Deskripsi Teknis</th>
        <th style="width: 40%;">Implementasi pada Sistem Helpdesk</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Lapisan Antarmuka</strong></td>
        <td>Aplikasi SPA responsif dengan pemisahan tampilan berdasarkan profil kerja pengguna.</td>
        <td>Dashboard metrik SLA, ruang kerja diagnosa tiket teknisi, serta portal status publik via URL terenkripsi token.</td>
      </tr>
      <tr>
        <td><strong>Mesin Logika Bisnis</strong></td>
        <td>Pemrosesan state terpusat, validasi alur tiket, kalkulasi otomatis SLA, dan penanganan pause.</td>
        <td>Pinia stores, RBAC Route Guard, Dual SLA Engine, timer countdown berkala, dan evaluasi threshold eskalasi.</td>
      </tr>
      <tr>
        <td><strong>Integrasi Layanan</strong></td>
        <td>Saluran komunikasi resmi dan pencatatan riwayat operasional yang dapat diaudit.</td>
        <td>Relai surel (SMTP) untuk notifikasi penugasan/update ke klien, referensi nomor kasus vendor L3, dan audit log.</td>
      </tr>
      <tr>
        <td><strong>Persistensi Data</strong></td>
        <td>Manajemen state lokal dan sinkronisasi struktur data runtime.</td>
        <td>Penyimpanan reaktif dengan migrasi skema data otomatis (v2.4) untuk menjaga konsistensi state penanganan tiket.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- BAB III -->
  <h2 class="section-title">BAB III: MATRIKS AKSES BERBASIS PERAN (RBAC)</h2>
  <p>
    Sistem membatasi wewenang operasional antara peran <strong>ADMIN / CPIG</strong> dan <strong>SUPPORT ENGINEER</strong> untuk menjaga tata kelola insiden, integritas data, dan pemisahan fungsi penugasan dengan fungsi eksekusi perbaikan:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 42%;">Modul / Tindakan Operasional</th>
        <th style="width: 20%;" class="text-center">ADMIN / CPIG</th>
        <th style="width: 20%;" class="text-center">SUPPORT ENGINEER</th>
        <th style="width: 18%;" class="text-center">PORTAL KLIEN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Monitoring Dashboard SLA & Antrean Global</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-engineer">Pantauan Personal</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pembuatan Tiket Baru & Pemilihan Preset</td>
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
        <td><strong>Salin Tautan Pelacakan Klien (Tokenized URL)</strong></td>
        <td class="text-center"><span class="badge-admin">Akses Khusus</span></td>
        <td class="text-center"><span class="badge-denied">Disembunyikan</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td><strong>Pratinjau & Pengiriman Surel Notifikasi</strong></td>
        <td class="text-center"><span class="badge-admin">Akses Khusus</span></td>
        <td class="text-center"><span class="badge-denied">Disembunyikan</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pencatatan Milestone & Command Execution Log</td>
        <td class="text-center"><span class="badge-admin">Bisa Menambah</span></td>
        <td class="text-center"><span class="badge-engineer">Pelaksana Utama</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pengajuan & Pencabutan Penahanan SLA (Pause)</td>
        <td class="text-center"><span class="badge-admin">Validasi / Cabut</span></td>
        <td class="text-center"><span class="badge-engineer">Pelaksana Utama</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pengisian Analisis Akar Masalah (RCA) & Resolusi</td>
        <td class="text-center"><span class="badge-admin">Verifikasi</span></td>
        <td class="text-center"><span class="badge-engineer">Pelaksana Utama</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Konfigurasi Matriks SLA & Master Data Pelanggan</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak (403)</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Laporan SLA Eksekutif & Ekspor Laporan</td>
        <td class="text-center"><span class="badge-admin">Akses Penuh</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak (403)</span></td>
        <td class="text-center"><span class="badge-denied">Ditolak</span></td>
      </tr>
      <tr>
        <td>Pustaka Runbook Pengetahuan (Knowledge Base)</td>
        <td class="text-center"><span class="badge-admin">Persetujuan SOP</span></td>
        <td class="text-center"><span class="badge-engineer">Ajukan & Membaca</span></td>
        <td class="text-center"><span class="badge-engineer">Hanya Baca</span></td>
      </tr>
    </tbody>
  </table>

  <!-- BAB IV -->
  <h2 class="section-title">BAB IV: ALUR OPERASIONAL SIKLUS HIDUP TIKET</h2>
  <p>
    Setiap insiden ditangani melalui 6 tahap operasional terstandarisasi untuk menjamin kecepatan pemulihan layanan:
  </p>

  <div class="flow-list">
    <div class="flow-item">
      <div class="flow-num">1</div>
      <div class="flow-content">
        <h5>Pencatatan Insiden & Penguncian Batas Waktu SLA</h5>
        <p>Laporan insiden dicatat oleh Helpdesk/CPIG. Sistem mengunci target waktu respon dan target resolusi secara otomatis sesuai klausul kontrak PKS klien (Platinum, Gold, Silver, atau Pemerintah). Tautan pelacakan dan notifikasi email dibuat secara otomatis.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">2</div>
      <div class="flow-content">
        <h5>Respon Awal Teknisi (Response SLA Handshake)</h5>
        <p>Teknisi bertugas mengonfirmasi penanganan dengan mengubah status tiket menjadi IN_PROGRESS. Tindakan ini menghentikan perhitungan <em>Response SLA</em> dan mencatat timestamp respon awal di dalam audit trail.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">3</div>
      <div class="flow-content">
        <h5>Investigasi Diagnostik & Pencatatan Milestone</h5>
        <p>Teknisi melakukan penelusuran masalah, pengujian teknis, dan perbaikan perangkat. Setiap tindakan teknis, sintaks perintah CLI, dan bukti tangkapan layar dicatat secara kronologis pada log milestone.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">4</div>
      <div class="flow-content">
        <h5>Penahanan Jam SLA Resmi (SLA Clock Pause)</h5>
        <p>Bila perbaikan tertunda akibat menunggu suku cadang vendor principal (<em>Pending Vendor</em>) atau menunggu izin jendela pemeliharaan dari pelanggan (<em>Pending Customer</em>), teknisi mengaktifkan status Pause dengan melampirkan nomor kasus vendor. Timer resolusi SLA dibekukan sementara.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">5</div>
      <div class="flow-content">
        <h5>Penyelesaian Masalah & Analisis Akar Masalah (RCA)</h5>
        <p>Setelah perangkat normal, teknisi mengisi formulir penyelesaian yang mencakup penyebab gangguan (<em>Root Cause</em>), langkah perbaikan (<em>Resolution</em>), dan rekomendasi pencegahan. Jam hitung resolusi SLA resmi dihentikan permanen.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">6</div>
      <div class="flow-content">
        <h5>Standardisasi Prosedur (Knowledge Base Runbook)</h5>
        <p>Solusi teknis yang efektif diajukan oleh teknisi ke modul Knowledge Base. Setelah diverifikasi dan disetujui oleh Administrator/Lead, prosedur tersebut dipublikasikan menjadi SOP resmi untuk penanganan insiden sejenis.</p>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- BAB V -->
  <h2 class="section-title">BAB V: LOGIKA PERHITUNGAN SLA & ESKALASI</h2>
  <p>
    Kepatuhan tingkat layanan dihitung menggunakan parameter SLA Ganda (*Dual SLA Engine*) yang memisahkan waktu respon awal dan waktu resolusi bersih:
  </p>

  <div class="formula-grid">
    <div class="formula-card">
      <div class="formula-title">1. WAKTU RESPON AWAL (FIRST TOUCH SLA)</div>
      <div class="formula-math">&Delta;T_respon = T_respon - T_dibuat</div>
      <p class="formula-desc">
        Durasi dari pembuatan tiket hingga status diubah menjadi IN_PROGRESS oleh teknisi.<br/>
        <strong>Kepatuhan:</strong> &Delta;T_respon &le; Target Respon Kontrak.
      </p>
    </div>

    <div class="formula-card">
      <div class="formula-title">2. WAKTU RESOLUSI BERSIH (NET MTTR SLA)</div>
      <div class="formula-math">Net MTTR = (T_selesai - T_dibuat) - &Sigma; T_pause</div>
      <p class="formula-desc">
        Total durasi penanganan dikurangi seluruh akumulasi waktu penahanan resmi (&Sigma; T_pause).<br/>
        <strong>Kepatuhan:</strong> Net MTTR &le; Target Resolusi Kontrak.
      </p>
    </div>
  </div>

  <h3 class="sub-title">1. Matriks Standar Kontrak Layanan (PKS)</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Tingkat Kontrak</th>
        <th style="width: 30%;">Cakupan Waktu Layanan</th>
        <th style="width: 20%;" class="text-center">Target Respon</th>
        <th style="width: 25%;" class="text-center">Target Resolusi MTTR</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Platinum 24×7</strong></td>
        <td>24 Jam × 7 Hari Non-Stop</td>
        <td class="text-center">&le; 30 Menit</td>
        <td class="text-center">&le; 4 Jam</td>
      </tr>
      <tr>
        <td><strong>Gold 8×5</strong></td>
        <td>Senin – Jumat (08:00 – 17:00 WIB)</td>
        <td class="text-center">&le; 30 Menit</td>
        <td class="text-center">&le; 8 Jam</td>
      </tr>
      <tr>
        <td><strong>Silver 8×5</strong></td>
        <td>Senin – Jumat (08:30 – 17:30 WIB)</td>
        <td class="text-center">&le; 1 Jam</td>
        <td class="text-center">&le; 12 Jam</td>
      </tr>
      <tr>
        <td><strong>Pemerintah Tier-1</strong></td>
        <td>Jam Kerja Kantor Dinas Pemerintah</td>
        <td class="text-center">&le; 1 Jam</td>
        <td class="text-center">&le; 12 Jam</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sub-title">2. Ambang Batas Pemicu Eskalasi Otomatis</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 22%;">Tahapan Eskalasi</th>
        <th style="width: 23%;">Ambang Batas Waktu</th>
        <th style="width: 30%;">Tindakan Sistem Otomatis</th>
        <th style="width: 25%;">Penerima Notifikasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Tahap 1: Peringatan</strong></td>
        <td>50% dari Target MTTR</td>
        <td>Kirim email pengingat status pengerjaan tiket</td>
        <td>Teknisi Bertugas & Lead SysOps</td>
      </tr>
      <tr>
        <td><strong>Tahap 2: Kritis</strong></td>
        <td>80% dari Target MTTR</td>
        <td>Kirim email prioritas tinggi & siagakan eskalasi principal L3</td>
        <td>Service Operations Manager</td>
      </tr>
      <tr>
        <td><strong>Tahap 3: Pelanggaran</strong></td>
        <td>100% Target MTTR Terlampaui</td>
        <td>Tandai status Breached, catat ke audit log, dan jadwalkan evaluasi</td>
        <td>Manajemen & Komite Operasional</td>
      </tr>
    </tbody>
  </table>

  <!-- BAB VI: PENGESAHAN DOKUMEN -->
  <h2 class="section-title" style="margin-top: 20px;">BAB VI: LEMBAR PENGESAHAN DOKUMEN</h2>
  <p>Dokumen spesifikasi teknis arsitektur sistem dan alur operasional helpdesk ini dinyatakan sah sebagai acuan teknis operasional:</p>

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
    print(f"Clean professional PDF generated! Size: {os.path.getsize(pdf_file)} bytes at {pdf_file}")
else:
    print("PDF generation failed:", res.stderr)
