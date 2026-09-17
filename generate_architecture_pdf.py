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
  <title>Spesifikasi Arsitektur Sistem Full-Stack Helpdesk - PT Global Transformasi Teknologi</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    @page {{
      size: A4 portrait;
      margin: 14mm 16mm 15mm 16mm;
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
      line-height: 1.42;
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
      margin-bottom: 10px;
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
      padding: 8px 12px;
      border-radius: 4px;
      margin-bottom: 10px;
    }}

    .title-block h2 {{
      margin: 0 0 2px 0;
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f172a;
    }}

    .title-block p {{
      margin: 0;
      font-size: 7.5pt;
      color: #475569;
    }}

    /* Metadata Table */
    .meta-table {{
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 7.5pt;
    }}

    .meta-table th, .meta-table td {{
      padding: 4px 7px;
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
      font-size: 9pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
      margin-top: 12px;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}

    h3.sub-title {{
      font-size: 8pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 8px;
      margin-bottom: 3px;
    }}

    p {{
      margin: 0 0 5px 0;
      color: #334155;
      text-align: justify;
    }}

    ul, ol {{
      margin: 2px 0 6px 0;
      padding-left: 18px;
      color: #334155;
    }}

    li {{
      margin-bottom: 2px;
    }}

    /* SVG Architecture Diagram Container */
    .arch-svg-container {{
      width: 100%;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 8px;
      margin: 6px 0 10px 0;
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
      margin: 6px 0 10px 0;
      font-size: 7.5pt;
    }}

    table.data-table th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 4px 6px;
      text-align: left;
      border: 1px solid #cbd5e1;
    }}

    table.data-table td {{
      padding: 4px 6px;
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
      margin: 6px 0 10px 0;
    }}

    .formula-card {{
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #0284c7;
      padding: 6px 9px;
      border-radius: 4px;
    }}

    .formula-title {{
      font-weight: 700;
      color: #0369a1;
      font-size: 7pt;
      margin-bottom: 2px;
      text-transform: uppercase;
    }}

    .formula-math {{
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 8pt;
      color: #0f172a;
      margin: 2px 0;
    }}

    .formula-desc {{
      font-size: 7pt;
      color: #475569;
      margin: 0;
      line-height: 1.3;
    }}

    /* Workflow Stage Cards */
    .flow-list {{
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 6px 0 10px 0;
    }}

    .flow-item {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #3b82f6;
      border-radius: 4px;
      padding: 5px 8px;
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }}

    .flow-num {{
      background: #1e293b;
      color: #ffffff;
      font-weight: 800;
      font-size: 7pt;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 1px;
    }}

    .flow-content h5 {{
      margin: 0 0 1px 0;
      font-size: 7.5pt;
      font-weight: 700;
      color: #0f172a;
    }}

    .flow-content p {{
      margin: 0;
      font-size: 7pt;
      color: #475569;
      line-height: 1.3;
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
    <h2>SPESIFIKASI ARSITEKTUR SISTEM FULL-STACK HELPDESK</h2>
    <p>Spesifikasi Teknis Integrasi Vue.js, Express.js REST API, MySQL Database, dan Layanan Notifikasi Email SMTP</p>
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
      <th>Tech Stack</th>
      <td>Vue 3 (Vite + Pinia) | Express.js (Node.js) | MySQL | SMTP Relay</td>
    </tr>
    <tr>
      <th>Tanggal Rilis</th>
      <td>18 September 2026</td>
      <th>Target Lingkup</th>
      <td>Sistem Helpdesk Ticketing Enterprise (Multi-Client)</td>
    </tr>
  </table>

  <!-- BAB I -->
  <h2 class="section-title">BAB I: RINGKASAN SISTEM & TEKNOLOGI</h2>
  <p>
    Sistem Helpdesk Ticketing PT Global Transformasi Teknologi dirancang sebagai aplikasi full-stack terintegrasi untuk mengelola insiden infrastruktur teknologi informasi pada 6 mitra korporat skala besar (BCA, PT Astra Honda Motor, Siloam Hospitals Group, Diskominfo Jawa Barat, Telkomsel Enterprise, dan Bank Mandiri).
  </p>
  <p>
    <strong>Komposisi Teknologi (Tech Stack):</strong>
  </p>
  <ul>
    <li><strong>Frontend Client (Vue.js 3)</strong>: Single Page Application (SPA) berbasis Vue 3, Vite, Pinia state management, dan Vue Router untuk konsol Admin, konsol Teknisi, dan Portal Pelacakan Klien.</li>
    <li><strong>Backend REST API (Express.js / Node.js)</strong>: Menyediakan endpoint API modular, otentikasi JWT, middleware otorisasi RBAC, pengatur logika SLA ganda, dan penjadwal cron berkala (<em>node-cron</em>).</li>
    <li><strong>Basis Data Relasional (MySQL)</strong>: Menyimpan data entitas tiket, milestone diagnosa, histori perubahan status, master data SLA dan pelanggan dengan integritas relasi referensial (InnoDB ACID).</li>
    <li><strong>Layanan Notifikasi Email (SMTP Relay)</strong>: Mengirimkan surat elektronik resmi korporat untuk notifikasi penerimaan tiket, eskalasi insiden, dan pembaruan teknis ke pihak klien.</li>
  </ul>

  <!-- BAB II -->
  <h2 class="section-title">BAB II: DIAGRAM ARSITEKTUR SISTEM FULL-STACK</h2>
  <p>
    Arsitektur sistem dibangun secara berlapis (<em>multi-tier</em>) yang memisahkan lapisan presentasi antarmuka, pemrosesan logika bisnis, integrasi layanan eksternal, dan lapisan basis data:
  </p>

  <!-- SVG VECTOR ARCHITECTURE DIAGRAM -->
  <div class="arch-svg-container">
    <svg viewBox="0 0 680 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background Bounds -->
      <rect width="680" height="260" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>

      <!-- LAYER 1: CLIENT TIER (VUE.JS 3) -->
      <rect x="15" y="10" width="650" height="48" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="1.2"/>
      <rect x="15" y="10" width="165" height="17" rx="3" fill="#2563eb"/>
      <text x="22" y="22" fill="#ffffff" font-family="Inter, sans-serif" font-size="8" font-weight="700">1. CLIENT TIER (VUE 3 SPA)</text>
      
      <rect x="25" y="30" width="195" height="22" rx="3" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="35" y="44" fill="#1e40af" font-family="Inter, sans-serif" font-size="7" font-weight="600">Konsol Admin / CPIG (Management)</text>
      
      <rect x="240" y="30" width="200" height="22" rx="3" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
      <text x="250" y="44" fill="#166534" font-family="Inter, sans-serif" font-size="7" font-weight="600">Konsol Teknisi (Workspace Diagnosa)</text>
      
      <rect x="460" y="30" width="195" height="22" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
      <text x="475" y="44" fill="#334155" font-family="Inter, sans-serif" font-size="7" font-weight="600">Portal Klien (Tokenized URL Track)</text>

      <!-- Arrow 1 to 2 (HTTPS / REST API) -->
      <path d="M340 58 L340 70" stroke="#0f172a" stroke-width="1.5" marker-end="url(#arrow)"/>
      <text x="350" y="66" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="6.5">HTTPS / JSON REST API</text>

      <!-- LAYER 2: API & BACKEND TIER (EXPRESS.JS) -->
      <rect x="15" y="70" width="650" height="74" rx="4" fill="#ffffff" stroke="#0f172a" stroke-width="1.2"/>
      <rect x="15" y="70" width="185" height="17" rx="3" fill="#0f172a"/>
      <text x="22" y="82" fill="#ffffff" font-family="Inter, sans-serif" font-size="8" font-weight="700">2. BACKEND API (EXPRESS.JS)</text>

      <rect x="25" y="91" width="115" height="46" rx="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1"/>
      <text x="31" y="104" fill="#0f172a" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">API Gateway</text>
      <text x="31" y="115" fill="#475569" font-family="Inter, sans-serif" font-size="6">JWT Auth Middleware</text>
      <text x="31" y="125" fill="#475569" font-family="Inter, sans-serif" font-size="6">RBAC Role Shield</text>

      <rect x="148" y="91" width="125" height="46" rx="3" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="154" y="104" fill="#1e40af" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">Dual-SLA Engine</text>
      <text x="154" y="115" fill="#2563eb" font-family="Inter, sans-serif" font-size="6">First Touch SLA Calc</text>
      <text x="154" y="125" fill="#2563eb" font-family="Inter, sans-serif" font-size="6">Net MTTR Resolution</text>

      <rect x="281" y="91" width="120" height="46" rx="3" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
      <text x="287" y="104" fill="#1e40af" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">Pause & Hold Handler</text>
      <text x="287" y="115" fill="#2563eb" font-family="Inter, sans-serif" font-size="6">Pending Vendor / Cust</text>
      <text x="287" y="125" fill="#2563eb" font-family="Inter, sans-serif" font-size="6">Timer State Lock</text>

      <rect x="409" y="91" width="120" height="46" rx="3" fill="#fff7ed" stroke="#fed7aa" stroke-width="1"/>
      <text x="415" y="104" fill="#c2410c" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">Node-Cron Scheduler</text>
      <text x="415" y="115" fill="#ea580c" font-family="Inter, sans-serif" font-size="6">Interval 1 Menit Polling</text>
      <text x="415" y="125" fill="#ea580c" font-family="Inter, sans-serif" font-size="6">Eskalasi 50%/80%/100%</text>

      <rect x="537" y="91" width="118" height="46" rx="3" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="1"/>
      <text x="543" y="104" fill="#6d28d9" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">KCS Knowledge Base</text>
      <text x="543" y="115" fill="#7c3aed" font-family="Inter, sans-serif" font-size="6">Review & Approval SOP</text>
      <text x="543" y="125" fill="#7c3aed" font-family="Inter, sans-serif" font-size="6">CLI Runbook Catalog</text>

      <!-- Arrows from Backend down -->
      <path d="M210 144 L210 160" stroke="#0f172a" stroke-width="1.5"/>
      <path d="M470 144 L470 160" stroke="#0f172a" stroke-width="1.5"/>

      <!-- LAYER 3: PERSISTENCE & SERVICES (MYSQL & SMTP) -->
      <!-- Left Box: MySQL Database -->
      <rect x="15" y="160" width="385" height="90" rx="4" fill="#ffffff" stroke="#059669" stroke-width="1.2"/>
      <rect x="15" y="160" width="190" height="17" rx="3" fill="#059669"/>
      <text x="22" y="172" fill="#ffffff" font-family="Inter, sans-serif" font-size="8" font-weight="700">3A. DATABASE TIER (MYSQL RELASIONAL)</text>
      
      <g transform="translate(25, 184)">
        <rect x="0" y="0" width="112" height="56" rx="3" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
        <text x="6" y="12" fill="#166534" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">Entitas Tiket & SLA</text>
        <text x="6" y="23" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• tickets</text>
        <text x="6" y="33" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• sla_policies</text>
        <text x="6" y="43" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• sla_pause_logs</text>

        <rect x="122" y="0" width="115" height="56" rx="3" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
        <text x="128" y="12" fill="#166534" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">Diagnosa & Knowledge</text>
        <text x="128" y="23" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• ticket_milestones</text>
        <text x="128" y="33" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• knowledge_base</text>
        <text x="128" y="43" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• kb_approvals</text>

        <rect x="247" y="0" width="118" height="56" rx="3" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1"/>
        <text x="253" y="12" fill="#166534" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">Akun & Jejak Audit</text>
        <text x="253" y="23" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• users & roles</text>
        <text x="253" y="33" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• customers & pic</text>
        <text x="253" y="43" fill="#475569" font-family="JetBrains Mono, monospace" font-size="5.5">• audit_event_logs</text>
      </g>

      <!-- Right Box: External Communications (SMTP Relay) -->
      <rect x="410" y="160" width="255" height="90" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="1.2"/>
      <rect x="410" y="160" width="175" height="17" rx="3" fill="#475569"/>
      <text x="417" y="172" fill="#ffffff" font-family="Inter, sans-serif" font-size="8" font-weight="700">3B. NOTIFIKASI EMAIL (SMTP)</text>

      <g transform="translate(420, 184)">
        <rect x="0" y="0" width="235" height="26" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
        <text x="8" y="12" fill="#0f172a" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">SMTP Relay Service (Nodemailer)</text>
        <text x="8" y="21" fill="#475569" font-family="Inter, sans-serif" font-size="6">helpdesk@glotratech.com (Notifikasi Resmi)</text>

        <rect x="0" y="30" width="235" height="26" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
        <text x="8" y="42" fill="#0f172a" font-family="Inter, sans-serif" font-size="6.5" font-weight="700">Jembatan Dukungan OEM L3</text>
        <text x="8" y="51" fill="#475569" font-family="Inter, sans-serif" font-size="6">Referensi Kasus Principal (HPE / Cisco TAC)</text>
      </g>
    </svg>
  </div>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Lapisan Arsitektur</th>
        <th style="width: 35%;">Spesifikasi Teknologi</th>
        <th style="width: 40%;">Tanggung Jawab Operasional</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. Frontend Tier</strong></td>
        <td>Vue 3, Vite, Pinia, Vue Router, Tailwind CSS</td>
        <td>Konsol operasional Admin/CPIG, lembar kerja teknisi, dan portal pelacakan status pelanggan berbasis tokenized URL.</td>
      </tr>
      <tr>
        <td><strong>2. Backend API Tier</strong></td>
        <td>Express.js (Node.js), JWT, Node-Cron, Nodemailer</td>
        <td>Penyedia REST API endpoint, validasi hak akses RBAC, kalkulasi SLA di server, penanganan jeda SLA, dan cron scheduler.</td>
      </tr>
      <tr>
        <td><strong>3. Database Tier</strong></td>
        <td>MySQL (InnoDB Engine, ACID Transaksi)</td>
        <td>Penyimpanan permanen tiket, riwayat status, audit trail, relasi pelanggan & PKS, serta pustaka knowledge base.</td>
      </tr>
      <tr>
        <td><strong>4. Integrasi Surel</strong></td>
        <td>Corporate SMTP Relay Server</td>
        <td>Pengiriman otomatis surat konfirmasi tiket, pemberitahuan penugasan teknisi, dan peringatan eskalasi bertingkat.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- BAB III -->
  <h2 class="section-title">BAB III: MATRIKS AKSES BERBASIS PERAN (RBAC)</h2>
  <p>
    Sistem menerapkan pembatasan hak akses tegas antara peran <strong>ADMIN / CPIG</strong> dan <strong>SUPPORT ENGINEER</strong> untuk memisahkan wewenang tata kelola dengan tindakan eksekusi perbaikan teknis:
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
    Setiap tiket insiden ditangani melalui 6 tahap standar operasional dari penerimaan hingga penutupan resmi:
  </p>

  <div class="flow-list">
    <div class="flow-item">
      <div class="flow-num">1</div>
      <div class="flow-content">
        <h5>Pencatatan Insiden & Penguncian Batas Waktu SLA</h5>
        <p>Laporan insiden dicatat di sistem Express.js oleh Admin/CPIG. Sistem mengunci target respon dan resolusi secara otomatis dari tabel MySQL sesuai kontrak pelanggan. Email notifikasi dan link token dikirim ke pihak terkait via SMTP.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">2</div>
      <div class="flow-content">
        <h5>Respon Awal Teknisi (Response SLA Handshake)</h5>
        <p>Teknisi mengubah status tiket menjadi IN_PROGRESS. Endpoint API menghentikan timer waktu respon awal (<em>First Touch SLA</em>) dan menyimpan timestamp ke database MySQL.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">3</div>
      <div class="flow-content">
        <h5>Investigasi Diagnostik & Pencatatan Milestone</h5>
        <p>Teknisi melakukan isolasi gangguan. Setiap langkah teknis, catatan observasi, dan riwayat perintah CLI dicatat ke tabel <code>ticket_milestones</code> pada basis data.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">4</div>
      <div class="flow-content">
        <h5>Penahanan Jam SLA Resmi (SLA Clock Pause)</h5>
        <p>Jika perbaikan terhenti akibat menunggu komponen vendor atau jadwal pemeliharaan klien, teknisi mengaktifkan Pause dengan nomor kasus vendor. Backend membekukan penghitungan durasi resolusi.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">5</div>
      <div class="flow-content">
        <h5>Penyelesaian Masalah & Analisis Akar Masalah (RCA)</h5>
        <p>Setelah sistem normal, teknisi mengisi formulir penyelesaian (Akar Masalah, Tindakan Korektif, dan Rekomendasi). Tiket diubah ke status RESOLVED dan waktu resolusi bersih (Net MTTR) dikunci.</p>
      </div>
    </div>

    <div class="flow-item">
      <div class="flow-num">6</div>
      <div class="flow-content">
        <h5>Standardisasi Prosedur (Knowledge Base Runbook)</h5>
        <p>Prosedur teknis yang berhasil diajukan ke antrean persetujuan Knowledge Base. Setelah disetujui Administrator, artikel diterbitkan sebagai SOP referensi pada sistem.</p>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- BAB V -->
  <h2 class="section-title">BAB V: LOGIKA PERHITUNGAN SLA & ESKALASI</h2>
  <p>
    Sistem mengevaluasi dua dimensi kepatuhan layanan secara independen pada backend Express.js:
  </p>

  <div class="formula-grid">
    <div class="formula-card">
      <div class="formula-title">1. WAKTU RESPON AWAL (FIRST TOUCH SLA)</div>
      <div class="formula-math">&Delta;T_respon = T_respon - T_dibuat</div>
      <p class="formula-desc">
        Durasi dari pembuatan tiket hingga status diubah menjadi IN_PROGRESS oleh teknisi.<br/>
        <strong>Kepatuhan:</strong> &Delta;T_respon &le; Target Respon Kontrak PKS.
      </p>
    </div>

    <div class="formula-card">
      <div class="formula-title">2. WAKTU RESOLUSI BERSIH (NET MTTR SLA)</div>
      <div class="formula-math">Net MTTR = (T_selesai - T_dibuat) - &Sigma; T_pause</div>
      <p class="formula-desc">
        Total durasi penanganan dikurangi seluruh akumulasi durasi penahanan resmi (&Sigma; T_pause).<br/>
        <strong>Kepatuhan:</strong> Net MTTR &le; Target Resolusi Kontrak PKS.
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

  <h3 class="sub-title">2. Mekanisme Pemicu Eskalasi Otomatis (Node-Cron Service)</h3>
  <p>
    Layanan background scheduler di Express.js mengevaluasi persentase sisa waktu SLA setiap interval 1 menit secara terotomasi:
  </p>
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
        <td>Kirim email pengingat status pengerjaan via SMTP</td>
        <td>Teknisi Bertugas & Lead SysOps</td>
      </tr>
      <tr>
        <td><strong>Tahap 2: Kritis</strong></td>
        <td>80% dari Target MTTR</td>
        <td>Kirim email alert prioritas tinggi via SMTP</td>
        <td>Service Operations Manager</td>
      </tr>
      <tr>
        <td><strong>Tahap 3: Pelanggaran</strong></td>
        <td>100% Target MTTR Terlampaui</td>
        <td>Tandai status Breached di database & catat audit log</td>
        <td>Manajemen & Komite Operasional</td>
      </tr>
    </tbody>
  </table>

  <!-- BAB VI -->
  <h2 class="section-title">BAB VI: SKEMA BASIS DATA RELASIONAL (MYSQL SCHEMA)</h2>
  <p>
    Penyimpanan data pada MySQL menerapkan normalisasi relasional dengan engine InnoDB untuk mendukung transaksi ACID:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Nama Tabel</th>
        <th style="width: 35%;">Atribut Kunci Utama</th>
        <th style="width: 40%;">Deskripsi & Relasi Data</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>tickets</code></td>
        <td>id, ticket_number, customer_id, assigned_to, status, priority, sla_policy_id</td>
        <td>Menyimpan entitas tiket utama, status alur kerja, dan foreign key ke pelanggan serta teknisi penanggung jawab.</td>
      </tr>
      <tr>
        <td><code>sla_policies</code></td>
        <td>id, tier_name, response_time_minutes, resolution_time_minutes, operating_hours</td>
        <td>Katalog master SLA kontraktual yang mengatur batas waktu respon dan resolusi sesuai tingkatan PKS.</td>
      </tr>
      <tr>
        <td><code>sla_pause_logs</code></td>
        <td>id, ticket_id, reason_type, vendor_case_id, paused_at, resumed_at, total_paused_seconds</td>
        <td>Merekam histori pembekuan waktu SLA resmi saat menunggu suku cadang principal vendor atau verifikasi klien.</td>
      </tr>
      <tr>
        <td><code>ticket_milestones</code></td>
        <td>id, ticket_id, title, description, command_executed, created_by, created_at</td>
        <td>Catatan kronologis langkah perbaikan teknis dan cuplikan eksekusi perintah terminal selama penanganan.</td>
      </tr>
      <tr>
        <td><code>knowledge_base</code></td>
        <td>id, kb_number, title, category, target_vendor, runbook_steps, status, approved_by</td>
        <td>Repositori artikel panduan teknis (Runbook SOP) yang telah diverifikasi untuk penggunaan berulang.</td>
      </tr>
      <tr>
        <td><code>audit_event_logs</code></td>
        <td>id, ticket_id, user_id, action_type, old_value, new_value, timestamp</td>
        <td>Rekam jejak audit tidak terhapus (immutable) untuk kepatuhan tata kelola standar ISO/IEC 20000.</td>
      </tr>
    </tbody>
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
