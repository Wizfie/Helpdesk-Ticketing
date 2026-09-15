import base64
import os
import subprocess

logo_path = r"d:\Unpam\Semester 6\KP\Ticketing-helpdesk\frontend\public\gtt-logo.png"
with open(logo_path, "rb") as f:
    logo_base64 = base64.b64encode(f.read()).decode("utf-8")

html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Panduan Pengguna (User Guide) - PT Global Transformasi Teknologi</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    @page {{
      size: A4;
      margin: 18mm 18mm 20mm 18mm;
      @bottom-right {{
        content: "Halaman " counter(page);
        font-size: 8pt;
        color: #64748b;
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
      font-size: 9.5pt;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }}

    /* Kop Surat Perusahaan */
    .header-box {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }}

    .logo-container {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .logo-container img {{
      height: 42px;
      width: auto;
    }}

    .company-title h1 {{
      margin: 0;
      font-size: 13pt;
      font-weight: 800;
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
      display: block;
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    .doc-date {{
      font-size: 7.5pt;
      color: #64748b;
      margin-top: 2px;
    }}

    /* Judul Dokumen Formal */
    .title-block {{
      margin-bottom: 22px;
      padding-bottom: 14px;
      border-bottom: 1px solid #e2e8f0;
    }}

    .title-block h2 {{
      margin: 0 0 6px 0;
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
    }}

    .title-block p {{
      margin: 0;
      font-size: 9.2pt;
      color: #475569;
      line-height: 1.5;
    }}

    /* Heading Sections */
    h3 {{
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      margin-top: 22px;
      margin-bottom: 10px;
      padding-bottom: 4px;
      border-bottom: 1px solid #cbd5e1;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}

    h4 {{
      font-size: 9.8pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 14px;
      margin-bottom: 4px;
    }}

    p {{
      margin: 0 0 8px 0;
      font-size: 9.2pt;
      color: #334155;
      text-align: justify;
    }}

    ul, ol {{
      margin: 4px 0 10px 18px;
      padding: 0;
    }}

    li {{
      font-size: 9.2pt;
      color: #334155;
      margin-bottom: 3px;
      text-align: justify;
    }}

    /* Process Flow Bar (Clean & Professional) */
    .process-bar {{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 7px 12px;
      margin: 8px 0 14px 0;
      font-size: 8.5pt;
      color: #334155;
    }}

    .process-step {{
      font-weight: 600;
      color: #0f172a;
    }}

    .process-arrow {{
      color: #94a3b8;
      font-weight: bold;
    }}

    /* Catatan Teknis / Kebijakan (Standar SOP, Tanpa AI Slop) */
    .policy-note {{
      margin: 8px 0 12px 0;
      padding: 6px 12px;
      border-left: 3px solid #334155;
      background: #f8fafc;
      font-size: 9pt;
      color: #1e293b;
    }}

    .policy-note strong {{
      color: #0f172a;
    }}

    /* Tabel Standar */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.8pt;
    }}

    th, td {{
      padding: 6px 9px;
      text-align: left;
      border: 1px solid #cbd5e1;
      vertical-align: top;
    }}

    th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }}

    tr:nth-child(even) td {{
      background: #fafafa;
    }}

    /* FAQ List */
    .faq-item {{
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
    }}

    .faq-q {{
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }}

    .faq-a {{
      color: #334155;
      margin: 0;
    }}

    /* Break utilities */
    .page-break {{
      page-break-before: always;
    }}

    .avoid-break {{
      page-break-inside: avoid;
    }}

    /* Footer Note */
    .footer-doc {{
      border-top: 1px solid #cbd5e1;
      padding-top: 10px;
      margin-top: 24px;
      text-align: center;
      font-size: 7.5pt;
      color: #94a3b8;
    }}
  </style>
</head>
<body>

  <!-- Kop Dokumen -->
  <div class="header-box">
    <div class="logo-container">
      <img src="data:image/png;base64,{logo_base64}" alt="GTT Logo">
      <div class="company-title">
        <h1>PT GLOBAL TRANSFORMASI TEKNOLOGI</h1>
        <p>Sistem Informasi Helpdesk & Manajemen Tiket SLA 24x7</p>
      </div>
    </div>
    <div class="header-badge">
      <span class="doc-badge">STANDAR OPERASIONAL PROSEDUR</span>
      <div class="doc-date">Dokumen No: SOP-GTT-IT-2026-01 • Rev 1.2</div>
    </div>
  </div>

  <!-- Judul Dokumen -->
  <div class="title-block">
    <h2>Panduan Pengguna Sistem Helpdesk dan Manajemen Tiket SLA 24x7</h2>
    <p>Petunjuk operasional baku bagi seluruh pihak terkait: Pelanggan Eksternal, Helpdesk (CPIG), Teknisi Lapangan/NOC, Manajemen Layanan, dan Administrator TI.</p>
  </div>

  <!-- Bagian 1 -->
  <div class="avoid-break">
    <h3>1. Matriks Pembagian Peran Pengguna</h3>
    <p>Sistem menerapkan pemisahan wewenang secara terstruktur guna menjamin akuntabilitas, keamanan data, dan kepatuhan terhadap Service Level Agreement (SLA):</p>
    
    <table>
      <thead>
        <tr>
          <th style="width: 18%;">Peran</th>
          <th style="width: 26%;">Klasifikasi</th>
          <th style="width: 24%;">Hak Akses Utama</th>
          <th>Tanggung Jawab Operasional</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Customer</strong></td>
          <td>Mitra Eksternal</td>
          <td>Portal Pelacakan Mandiri</td>
          <td>Memantau perkembangan tiket via link token aman tanpa perlu login atau password.</td>
        </tr>
        <tr>
          <td><strong>CPIG / Helpdesk</strong></td>
          <td>Petugas Gerbang Laporan</td>
          <td>Manajemen Tiket Masuk</td>
          <td>Menerima pengaduan via telepon, WhatsApp, atau email, memeriksa duplikasi, dan menerbitkan tiket.</td>
        </tr>
        <tr>
          <td><strong>Engineer</strong></td>
          <td>Teknisi Lapangan / NOC</td>
          <td>Pelaksana Penugasan</td>
          <td>Eksekusi perbaikan teknis, mencatat milestone, mengelola jeda SLA (Pause), dan menyelesaikan tiket.</td>
        </tr>
        <tr>
          <td><strong>Management</strong></td>
          <td>Direksi & Service Manager</td>
          <td>Dashboard & Laporan</td>
          <td>Mengawasi kepatuhan SLA korporat (target ≥ 98%), analisis tren, dan mengunduh laporan eksekutif.</td>
        </tr>
        <tr>
          <td><strong>Admin</strong></td>
          <td>Administrator TI</td>
          <td>Kontrol Konfigurasi Penuh</td>
          <td>Mengelola akun staf, profil mitra pelanggan, dan mengaudit rekaman keamanan sistem.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Bagian 2 -->
  <div class="avoid-break" style="margin-top: 10px;">
    <h3>2. Alur Kerja Pelanggan (Customer Self-Service)</h3>
    <p>Pelanggan mengakses sistem secara mandiri menggunakan tautan token terenkripsi tanpa memerlukan kredensial akun.</p>

    <div class="process-bar">
      <span class="process-step">Email Notifikasi</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 1: Buka Tautan Resmi</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 2: Pantau Progres & SLA</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 3: Bagikan ke Tim (Opsional)</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 4: Konfirmasi Pemulihan</span>
    </div>

    <h4>Langkah 1: Membuka Tautan Resmi dari Email Notifikasi</h4>
    <p>Buka email notifikasi resmi dari <strong>support@glotra.co.id</strong>, kemudian klik tombol <strong>Lihat Status Pelayanan (Live Tracking)</strong>. Peramban web akan otomatis menampilkan halaman pelacakan berstatus <strong>Token Terverifikasi</strong>.</p>

    <h4>Langkah 2: Memantau Kronologi Penanganan dan Target SLA</h4>
    <ul>
      <li><strong>Target Pemulihan Layanan (SLA):</strong> Batas waktu maksimal pemulihan sistem sesuai kontrak perjanjian kerja sama (PKS 24x7).</li>
      <li><strong>Alur Progres Penanganan (Live Tracker):</strong> Kronologi tahapan kerja teknisi lengkap dengan stempel waktu lokal WIB dan nama petugas penanggung jawab.</li>
      <li><strong>Akar Masalah (Root Cause):</strong> Penjelasan teknis penyebab kendala yang dicantumkan setelah pekerjaan selesai.</li>
    </ul>

    <h4>Langkah 3: Membagikan Akses Pemantauan ke Rekan Satu Tim</h4>
    <p>Klik tombol <strong>Bagikan ke Tim Anda</strong> pada sudut kanan atas layar pelacakan. Tautan lengkap beserta parameter token keamanan akan disalin ke clipboard untuk dibagikan kepada rekan kerja internal via WhatsApp atau email.</p>

    <h4>Langkah 4: Melakukan Konfirmasi Pemulihan Layanan</h4>
    <p>Saat tiket berstatus <strong>RESOLVED</strong>, tiket memasuki masa observasi stabilitas selama 72 jam:</p>
    <ul>
      <li>Jika layanan telah normal: Klik tombol <strong>Konfirmasi Layanan Normal & Selesai</strong> untuk mengarsipkan tiket.</li>
      <li>Jika kendala masih dirasakan: Klik tombol <strong>Laporkan Kendala Masih Ada</strong> untuk terhubung langsung ke Hotline 24x7.</li>
    </ul>
  </div>

  <div class="page-break"></div>

  <!-- Bagian 3 -->
  <div class="avoid-break">
    <h3>3. Alur Kerja Petugas CPIG / Helpdesk</h3>
    <p>Petugas CPIG bertindak sebagai garda terdepan dalam menyaring dan mengklasifikasikan setiap laporan yang masuk:</p>

    <div class="process-bar">
      <span class="process-step">Laporan Masuk</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 1: Buka Formulir</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 2: Cek Duplikasi (Smart Ingestion)</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 3: Pilih Mitra & PIC</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 4: Tentukan Severity</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 5: Terbitkan Tiket</span>
    </div>

    <h4>Langkah 1: Membuka Formulir Penerbitan Tiket</h4>
    <p>Buka menu utama pada bilah navigasi sisi kiri, kemudian pilih menu <strong>Buat Tiket</strong>.</p>

    <h4>Langkah 2: Menjalankan Pemeriksaan Duplikasi (Smart Ingestion Check)</h4>
    <p>Ketik kata kunci kendala pada kolom <strong>Deteksi Cerdas Insiden</strong>. Jika sistem menemukan insiden massal yang sama pada pelanggan bersangkutan, satukan informasi pengaduan ke tiket yang telah aktif guna menghindari duplikasi tiket.</p>

    <h4>Langkah 3: Mengisi Data Pelanggan dan PIC Pelapor</h4>
    <p>Pilih nama instansi pelanggan, nama PIC yang menghubungi, serta saluran pengaduan (Hotline Call Center, WhatsApp, atau Email).</p>

    <h4>Langkah 4: Menentukan Klasifikasi dan Tingkat Keparahan (Severity Level)</h4>
    <table>
      <thead>
        <tr>
          <th>Tingkat Severity</th>
          <th>Target Respon</th>
          <th>Target Solusi (SLA)</th>
          <th>Kriteria Insiden</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>P1 - Critical</strong></td>
          <td>≤ 15 Menit</td>
          <td><strong>4 Jam</strong></td>
          <td>Infrastruktur inti lumpuh total (Core network down, sistem transaksi perbankan terhenti).</td>
        </tr>
        <tr>
          <td><strong>P2 - Major</strong></td>
          <td>≤ 30 Menit</td>
          <td><strong>8 Jam</strong></td>
          <td>Gangguan signifikan pada sistem utama, namun jalur transmisi cadangan beroperasi normal.</td>
        </tr>
        <tr>
          <td><strong>P3 - Medium</strong></td>
          <td>≤ 60 Menit</td>
          <td><strong>24 Jam</strong></td>
          <td>Penurunan performa atau latensi tinggi, operasional mitra masih berjalan terbatas.</td>
        </tr>
        <tr>
          <td><strong>P4 - Low</strong></td>
          <td>≤ 120 Menit</td>
          <td><strong>48 Jam</strong></td>
          <td>Permintaan perubahan konfigurasi rutin, permohonan informasi teknis, kendala non-kritis.</td>
        </tr>
      </tbody>
    </table>

    <h4>Langkah 5: Mengunggah Dokumen Pendukung dan Menerbitkan Tiket</h4>
    <p>Unggah bukti tangkapan layar error atau berkas log perangkat (format file: JPG, PNG, PDF, TXT, LOG, ZIP). Kemudian klik tombol <strong>Terbitkan Tiket & Kirim Notifikasi</strong>. Email konfirmasi ber-token secara otomatis dikirimkan ke alamat email PIC pelanggan.</p>
  </div>

  <!-- Bagian 4 -->
  <div class="avoid-break" style="margin-top: 10px;">
    <h3>4. Alur Kerja Teknisi (Engineer / NOC)</h3>

    <div class="process-bar">
      <span class="process-step">Dashboard Tugas</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 1: Ambil Tiket</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 2: Status IN PROGRESS</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 3: Troubleshooting (Pause/Resume jika Perlu)</span>
      <span class="process-arrow">&rarr;</span>
      <span class="process-step">Langkah 4: Selesaikan (RESOLVED)</span>
    </div>

    <h4>Langkah 1: Memeriksa Antrean dan Mengambil Penugasan</h4>
    <p>Buka halaman <strong>Dashboard</strong> pada tab <strong>Tiket Aktif</strong>. Klik tombol <strong>Ambil Tiket Ini (Assign to Me)</strong> pada tiket yang belum memiliki penanggung jawab. Teknisi tidak diizinkan membuka tiket milik teknisi lain.</p>

    <h4>Langkah 2: Memulai Penanganan Teknis</h4>
    <p>Klik tombol <strong>Mulai Penanganan (IN PROGRESS)</strong>. Sistem mencatat stempel waktu respon awal teknisi ke dalam audit trail sistem.</p>

    <h4>Langkah 3: Prosedur Penahanan Timer SLA (Pause SLA)</h4>
    <div class="policy-note">
      <strong>Ketentuan Operasional Penahanan SLA:</strong> Jika proses penanganan terhenti akibat menunggu suku cadang principal (RMA) atau izin maintenance window dari pelanggan, teknisi wajib menekan tombol <strong>Tahan Timer SLA (Pause SLA)</strong> agar pencapaian target kinerja (KPI) tidak terpotong.
    </div>
    <ul>
      <li>Pilih kategori alasan penahanan: Menunggu Pihak Ketiga / Principal atau Menunggu Respon Pelanggan.</li>
      <li>Masukkan penjelasan rinci dan nomor case principal jika ada (contoh: TAC-2026-9921).</li>
      <li>Ketika respon eksternal telah diterima, klik tombol <strong>Lanjutkan Penanganan (Resume SLA)</strong>. Sistem secara otomatis menghitung durasi waktu penahanan dan memundurkan batas tenggat waktu SLA sejumlah durasi tersebut.</li>
    </ul>

    <h4>Langkah 4: Menyelesaikan Tiket (RESOLVED)</h4>
    <p>Setelah perbaikan berhasil diuji normal, klik tombol <strong>Selesaikan Tiket (RESOLVED)</strong>. Lengkapi kolom Akar Masalah (Root Cause) serta rincian tindakan perbaikan, lalu klik tombol <strong>Konfirmasi Tiket Selesai</strong>.</p>
  </div>

  <div class="page-break"></div>

  <!-- Bagian 5 -->
  <div class="avoid-break">
    <h3>5. Alur Kerja Manajemen dan Direksi</h3>
    <p>Manajemen berfokus pada pengawasan metrik operasional tingkat tinggi secara objektif tanpa dibebani catatan teknis mendetail:</p>

    <h4>Langkah 1: Pemantauan Kepatuhan SLA Korporat Secara Real-Time</h4>
    <p>Buka halaman <strong>Dashboard</strong> untuk memantau persentase kepatuhan SLA bulanan (standar target korporat GTT: ≥ 98,0%), proporsi persebaran insiden P1 sampai dengan P4, serta tiket yang mendekati batas waktu toleransi.</p>

    <h4>Langkah 2: Analisis Laporan Kinerja Bulanan</h4>
    <p>Buka menu <strong>Laporan</strong> untuk menganalisis metrik waktu rata-rata pemulihan (Mean Time to Resolve / MTTR), tren sebaran insiden per instansi mitra, serta produktivitas penyelesaian tiket per teknisi.</p>

    <h4>Langkah 3: Pengunduhan Dokumen Laporan Resmi</h4>
    <p>Klik tombol <strong>Cetak / Unduh Laporan PDF</strong> pada sudut kanan atas halaman laporan untuk menghasilkan berkas evaluasi formal dewan direksi.</p>
  </div>

  <!-- Bagian 6 -->
  <div class="avoid-break" style="margin-top: 14px;">
    <h3>6. Alur Kerja Administrator Sistem</h3>

    <h4>Langkah 1: Tata Kelola Akun Karyawan (Users Management)</h4>
    <p>Masuk ke menu <strong>Admin > Kelola Pengguna</strong> untuk mendaftarkan akun staf baru atau memperbarui profil staf melalui tombol <strong>Edit</strong> (nama, email resmi, nomor WhatsApp/HP, peran staf, dan status akun). Seluruh perubahan profil staf tercatat otomatis ke dalam audit trail (USER_UPDATED).</p>

    <h4>Langkah 2: Tata Kelola Master Data Pelanggan (Customers Management)</h4>
    <p>Masuk ke menu <strong>Admin > Kelola Pelanggan</strong> untuk mendaftarkan perusahaan mitra baru, memperbarui profil instansi melalui tombol <strong>Edit Mitra</strong>, serta mengelola kontak darurat perwakilan klien (tambah PIC baru atau ubah PIC terdaftar). Seluruh perubahan data mitra tercatat ke dalam audit trail (CUSTOMER_UPDATED).</p>

    <h4>Langkah 3: Peninjauan dan Ekspor Rekaman Audit Sistem (Audit Trail)</h4>
    <p>Buka menu <strong>Audit Logs</strong> untuk memeriksa rekaman forensik aktivitas sistem. Administrator dapat memanfaatkan fitur pencarian, penyaringan aksi, serta tombol <strong>Ekspor CSV</strong> (berkas spreadsheet berstandar UTF-8 BOM untuk Microsoft Excel), <strong>Ekspor JSON</strong>, atau <strong>Cetak</strong> laporan resmi untuk kepatuhan audit ISO 27001.</p>
  </div>

  <!-- Bagian 7 -->
  <div class="avoid-break" style="margin-top: 14px;">
    <h3>7. Pertanyaan Umum dan Ketentuan Keamanan (FAQ)</h3>

    <div class="faq-item">
      <p class="faq-q">Pertanyaan: Mengapa teknisi dilarang membuka tiket yang ditugaskan kepada teknisi lain?</p>
      <p class="faq-a">Jawaban: Demi menjaga integritas data dan akuntabilitas individu, sistem menerapkan aturan isolasi penugasan (Assignment Guard). Hanya teknisi yang ditugaskan yang berwenang memperbarui status tiket. Supervisor (CPIG) dan Administrator tetap memiliki wewenang membuka dan mengalihkan penugasan tiket.</p>
    </div>

    <div class="faq-item">
      <p class="faq-q">Pertanyaan: Bagaimana sistem menjamin kerahasiaan tautan pelacakan pelanggan?</p>
      <p class="faq-a">Jawaban: Sistem menerapkan proteksi Anti-IDOR dengan token kriptografis unik pada setiap tiket. Mengubah nomor tiket pada parameter URL tanpa menyertakan token yang sah akan langsung ditolak oleh sistem dengan status Tautan Tidak Sah.</p>
    </div>

    <div class="faq-item">
      <p class="faq-q">Pertanyaan: Kapan sebuah tiket resmi dinyatakan ditutup permanen (CLOSED)?</p>
      <p class="faq-a">Jawaban: Setelah status RESOLVED, tiket memasuki masa pemantauan stabilitas selama 72 jam. Tiket ditutup permanen secara otomatis setelah masa tersebut berakhir atau seketika saat perwakilan pelanggan menekan tombol konfirmasi penyelesaian.</p>
    </div>
  </div>

  <!-- Footer Dokumen -->
  <div class="footer-doc">
    Dokumen Resmi Standar Operasional Prosedur • PT Global Transformasi Teknologi (Glotra Technology) • Hak Cipta Dilindungi Undang-Undang © 2026
  </div>

</body>
</html>
"""

html_file = r"d:\Unpam\Semester 6\KP\Ticketing-helpdesk\Panduan_Pengguna_Helpdesk_GTT.html"
pdf_file = r"d:\Unpam\Semester 6\KP\Ticketing-helpdesk\Panduan_Pengguna_Helpdesk_GTT.pdf"

with open(html_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Enterprise HTML generated successfully.")

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_file}",
    html_file
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("PDF output code:", res.returncode)
if os.path.exists(pdf_file):
    print("Clean enterprise PDF generated! Size:", os.path.getsize(pdf_file), "bytes")
else:
    print("PDF generation failed:", res.stderr)
