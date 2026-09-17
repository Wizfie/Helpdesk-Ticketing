import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

doc = docx.Document()

# Set standard A4 margins (top=3cm, left=3cm, right=2.5cm, bottom=2.5cm)
sections = doc.sections
for section in sections:
    section.page_width = Inches(8.27)
    section.page_height = Inches(11.69)
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

# Base font
style = doc.styles['Normal']
font = style.font
font.name = 'Times New Roman'
font.size = Pt(11)
font.color.rgb = RGBColor(0x1e, 0x29, 0x3b)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)

# --- JUDUL DOKUMEN ---
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_after = Pt(2)
run_title = p_title.add_run("RANCANGAN ARSITEKTUR, MATRIKS AKSES, DAN ALUR SISTEM HELPDESK TICKETING")
run_title.bold = True
run_title.font.size = Pt(14)
run_title.font.name = 'Times New Roman'

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_sub.paragraph_format.space_after = Pt(16)
run_sub = p_sub.add_run("Spesifikasi Desain Sistem: Arsitektur Full-Stack (Vue.js, Express.js, MySQL, SMTP Relay), RBAC Matrix, Flowchart Alur Penanganan Insiden, dan Formula Dual-SLA Engine")
run_sub.font.size = Pt(10)
run_sub.italic = True
run_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

# --- DAFTAR SINGKATAN & GLOSARIUM ---
p_h_glo = doc.add_paragraph()
p_h_glo.paragraph_format.space_before = Pt(12)
p_h_glo.paragraph_format.space_after = Pt(6)
r_glo = p_h_glo.add_run("DAFTAR ISTILAH DAN SINGKATAN")
r_glo.bold = True
r_glo.font.size = Pt(11)

t_glo = doc.add_table(rows=1, cols=3)
t_glo.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t_glo.rows[0].cells
hdr_cells[0].text = "Singkatan"
hdr_cells[1].text = "Kepanjangan / Istilah Lengkap"
hdr_cells[2].text = "Penjelasan Fungsi dalam Sistem"
for cell in hdr_cells:
    set_cell_shading(cell, "F1F5F9")
    set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
            r.font.size = Pt(9.5)

glo_data = [
    ("CPIG", "Customer Problem Incident Group", "Staf Helpdesk & Dispatcher yang menerima keluhan, menerbitkan tiket, mengalokasikan teknisi, dan berkomunikasi dengan klien."),
    ("SLA", "Service Level Agreement", "Kesepakatan batas waktu layanan penanganan insiden yang mengikat secara kontraktual."),
    ("MTTR", "Mean Time To Resolve", "Rata-rata durasi waktu yang dibutuhkan dari insiden tercatat hingga sistem normal kembali."),
    ("Net MTTR", "Net Mean Time To Resolve", "Durasi penyelesaian bersih setelah dikurangi seluruh akumulasi jeda waktu resmi (SLA Pause)."),
    ("RBAC", "Role-Based Access Control", "Metode pembatasan hak akses sistem berdasarkan peran kerja pengguna."),
    ("RCA", "Root Cause Analysis", "Investigasi penelusuran akar penyebab utama terjadinya gangguan teknis."),
    ("KCS", "Knowledge-Centered Service", "Metodologi standardisasi perbaikan insiden menjadi dokumen panduan teknis (SOP / Runbook)."),
    ("SMTP", "Simple Mail Transfer Protocol", "Protokol standar jaringan untuk pengiriman surat elektronik resmi."),
    ("SPA", "Single Page Application", "Arsitektur web yang memuat satu halaman dinamis tanpa memuat ulang seluruh halaman peramban."),
    ("PKS", "Perjanjian Kerja Sama", "Dokumen kontrak tingkat layanan antara penyedia layanan dengan mitra perusahaan.")
]

for row_idx, data in enumerate(glo_data):
    row = t_glo.add_row()
    for col_idx, text in enumerate(data):
        cell = row.cells[col_idx]
        cell.text = text
        if row_idx % 2 == 1:
            set_cell_shading(cell, "F8FAFC")
        set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(9.5)
                if col_idx == 0:
                    r.bold = True

doc.add_paragraph().paragraph_format.space_after = Pt(10)

# --- 1. ARSITEKTUR SISTEM FULL-STACK ---
p_sec1 = doc.add_paragraph()
p_sec1.paragraph_format.space_before = Pt(14)
p_sec1.paragraph_format.space_after = Pt(4)
r_sec1 = p_sec1.add_run("1. ARSITEKTUR SISTEM FULL-STACK")
r_sec1.bold = True
r_sec1.font.size = Pt(12)

p_arch_desc = doc.add_paragraph()
p_arch_desc.paragraph_format.space_after = Pt(8)
p_arch_desc.add_run(
    "Sistem dirancang menggunakan arsitektur berlapis (multi-tier) yang memisahkan lapisan presentasi antarmuka "
    "berbasis Vue.js 3, lapisan pemrosesan logika bisnis berbasis Express.js (Node.js), lapisan persistensi basis data "
    "relasional MySQL, dan lapisan integrasi komunikasi surel resmi melalui SMTP Relay."
)

t_arch = doc.add_table(rows=1, cols=3)
t_arch.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t_arch.rows[0].cells
hdr_cells[0].text = "Lapisan Sistem"
hdr_cells[1].text = "Teknologi Terpilih"
hdr_cells[2].text = "Peran & Fungsi dalam Rancangan"
for cell in hdr_cells:
    set_cell_shading(cell, "F1F5F9")
    set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
            r.font.size = Pt(9.5)

arch_data = [
    ("1. Lapisan Antarmuka Pengguna (Frontend)", "Vue 3, Vite, Pinia, Vue Router", "Menyediakan antarmuka interaktif bagi Helpdesk, ruang kerja diagnosa teknisi, dan portal tracking pelanggan berbasis URL token."),
    ("2. Layanan Backend (API Tier)", "Express.js, Node-Cron, Nodemailer", "Menyediakan endpoint REST API, menjalankan validasi RBAC, menghitung batas waktu SLA, menangani jeda SLA, dan mengeksekusi cron monitoring berkala."),
    ("3. Basis Data Relasional (Data Tier)", "MySQL (Engine InnoDB)", "Menyimpan seluruh tabel operasional tiket, relasi pelanggan, kebijakan SLA, riwayat jeda, dan catatan rekam audit dengan dukungan transaksi ACID."),
    ("4. Layanan Notifikasi (Integration)", "SMTP Relay Server", "Mengirimkan pembaruan status tiket dan surat peringatan eskalasi resmi langsung ke kotak masuk surel teknisi dan klien.")
]

for row_idx, data in enumerate(arch_data):
    row = t_arch.add_row()
    for col_idx, text in enumerate(data):
        cell = row.cells[col_idx]
        cell.text = text
        if row_idx % 2 == 1:
            set_cell_shading(cell, "F8FAFC")
        set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(9.5)
                if col_idx == 0:
                    r.bold = True

doc.add_page_break()

# --- 2. MATRIKS HAK AKSES PENGGUNA (RBAC MATRIX) ---
p_sec2 = doc.add_paragraph()
p_sec2.paragraph_format.space_before = Pt(10)
p_sec2.paragraph_format.space_after = Pt(4)
r_sec2 = p_sec2.add_run("2. MATRIKS HAK AKSES PENGGUNA (RBAC MATRIX)")
r_sec2.bold = True
r_sec2.font.size = Pt(12)

p_rbac_desc = doc.add_paragraph()
p_rbac_desc.paragraph_format.space_after = Pt(8)
p_rbac_desc.add_run(
    "Matriks ini mendefinisikan pembatasan kewenangan operasional antara Admin / CPIG (sebagai Helpdesk Dispatcher) "
    "dengan Support Engineer (staf teknis pelaksana penanganan), serta akses terbatas pada Portal Klien:"
)

t_rbac = doc.add_table(rows=1, cols=4)
t_rbac.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t_rbac.rows[0].cells
hdr_cells[0].text = "Fungsi / Modul Sistem"
hdr_cells[1].text = "ADMIN / CPIG\n(Helpdesk Dispatcher)"
hdr_cells[2].text = "SUPPORT ENGINEER\n(Teknisi Penanganan)"
hdr_cells[3].text = "PORTAL KLIEN\n(Pelacakan Mandiri)"
for cell in hdr_cells:
    set_cell_shading(cell, "F1F5F9")
    set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
    for p in cell.paragraphs:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if cell != hdr_cells[0] else WD_ALIGN_PARAGRAPH.LEFT
        for r in p.runs:
            r.bold = True
            r.font.size = Pt(9)

rbac_data = [
    ("Monitoring Dashboard & Antrean Global Tiket", "Akses Penuh", "Tiket Ditugaskan", "Ditolak", True, False, False),
    ("Penerbitan Tiket Baru & Pengisian Data Awal", "Akses Penuh", "Input Lapangan", "Ditolak", True, False, False),
    ("Penugasan & Pergantian Teknisi Penanggung Jawab", "Kontrol Penuh", "Hanya Baca", "Ditolak", True, False, False),
    ("Penyalinan Tautan Pelacakan Klien (Token URL)", "Akses Khusus", "Disembunyikan", "Ditolak", True, False, False),
    ("Pratinjau & Pengiriman Surel Notifikasi Manual", "Akses Khusus", "Disembunyikan", "Ditolak", True, False, False),
    ("Pencatatan Milestone & Log Perintah Perbaikan", "Bisa Menambah", "Pelaksana Utama", "Ditolak", False, True, False),
    ("Pengajuan & Pencabutan Jeda SLA (Pause)", "Validasi Otoritas", "Pelaksana Utama", "Ditolak", False, True, False),
    ("Penyelesaian Tiket & Analisis Akar Masalah (RCA)", "Verifikasi Akhir", "Pelaksana Utama", "Ditolak", False, True, False),
    ("Pengaturan Matriks SLA & Data Klien", "Akses Penuh", "Ditolak", "Ditolak", True, False, False),
    ("Laporan SLA & Ekspor Berkas Laporan", "Akses Penuh", "Ditolak", "Ditolak", True, False, False),
    ("Basis Pengetahuan (Knowledge Base)", "Persetujuan SOP", "Ajukan & Membaca", "Hanya Baca", True, False, False)
]

for row_idx, data in enumerate(rbac_data):
    row = t_rbac.add_row()
    # data: (modul, admin, tech, client, bold_admin, bold_tech, bold_client)
    modul, admin_txt, tech_txt, client_txt, b_admin, b_tech, b_client = data
    
    cell0 = row.cells[0]
    cell0.text = modul
    
    cell1 = row.cells[1]
    cell1.text = admin_txt
    
    cell2 = row.cells[2]
    cell2.text = tech_txt
    
    cell3 = row.cells[3]
    cell3.text = client_txt

    if row_idx % 2 == 1:
        for c in row.cells:
            set_cell_shading(c, "F8FAFC")

    for idx, cell in enumerate(row.cells):
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        for p in cell.paragraphs:
            if idx > 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.size = Pt(9)
                if idx == 1 and b_admin:
                    r.bold = True
                elif idx == 2 and b_tech:
                    r.bold = True
                elif idx == 3 and b_client:
                    r.bold = True

doc.add_paragraph().paragraph_format.space_after = Pt(10)

# --- 3. ALUR PROSES PENANGANAN TIKET (FLOWCHART) ---
p_sec3 = doc.add_paragraph()
p_sec3.paragraph_format.space_before = Pt(14)
p_sec3.paragraph_format.space_after = Pt(4)
r_sec3 = p_sec3.add_run("3. ALUR PROSES PENANGANAN TIKET (FLOWCHART)")
r_sec3.bold = True
r_sec3.font.size = Pt(12)

p_flow_desc = doc.add_paragraph()
p_flow_desc.paragraph_format.space_after = Pt(6)
p_flow_desc.add_run(
    "Setiap insiden ditangani melalui 6 tahapan kerja berurutan dengan alur kendali logika sebagai berikut:"
)

flow_steps = [
    ("Tahap 1: Laporan Masuk & Pencatatan Tiket", "Petugas Helpdesk/CPIG mencatat tiket baru ke sistem Express.js. Sistem mengunci target respon dan resolusi SLA secara otomatis dari tabel master SLA sesuai kontrak pelanggan. Email konfirmasi dan tautan token dibuat dan dikirimkan via SMTP."),
    ("Tahap 2: Respon Awal Teknisi (First Touch SLA)", "Teknisi mengubah status tiket menjadi IN_PROGRESS. Sistem menghentikan timer perhitungan Response SLA dan mencatat waktu respon pertama secara permanen di database."),
    ("Tahap 3: Investigasi Diagnostik & Milestone", "Teknisi melakukan penelusuran masalah dan mencatatkan setiap tindakan teknis, hasil observasi, serta riwayat eksekusi perintah terminal ke dalam tabel ticket_milestones."),
    ("Tahap 4: Penanganan Jeda Waktu SLA (Clock Pause)", "Jika perbaikan terhenti akibat menunggu komponen suku cadang dari vendor principal atau menunggu jendela pemeliharaan klien, teknisi mengaktifkan status Pause. Timer resolusi SLA dibekukan sementara sehingga sisa waktu SLA tidak terpotong."),
    ("Tahap 5: Pemulihan Sistem & Pengisian RCA", "Setelah infrastruktur kembali normal, teknisi mengisi formulir penyelesaian yang memuat penyebab gangguan (Root Cause), langkah pemulihan, dan saran preventif. Tiket diubah ke status RESOLVED dan waktu resolusi bersih (Net MTTR) dikunci."),
    ("Tahap 6: Verifikasi Klien & Penutupan Tiket (Closed)", "Prosedur perbaikan yang efektif dapat diajukan ke antrean persetujuan Knowledge Base (KCS). Tiket ditutup permanen (CLOSED) setelah adanya konfirmasi dari pelanggan atau melewati masa evaluasi.")
]

for title, desc in flow_steps:
    p_step = doc.add_paragraph()
    p_step.paragraph_format.space_before = Pt(2)
    p_step.paragraph_format.space_after = Pt(3)
    p_step.paragraph_format.left_indent = Inches(0.2)
    r_t = p_step.add_run(f"• {title}: ")
    r_t.bold = True
    r_t.font.size = Pt(9.5)
    r_d = p_step.add_run(desc)
    r_d.font.size = Pt(9.5)

doc.add_page_break()

# --- 4. FORMULA & MATRIKS PERHITUNGAN SLA ---
p_sec4 = doc.add_paragraph()
p_sec4.paragraph_format.space_before = Pt(10)
p_sec4.paragraph_format.space_after = Pt(4)
r_sec4 = p_sec4.add_run("4. FORMULA & MATRIKS PERHITUNGAN SLA (SERVICE LEVEL AGREEMENT)")
r_sec4.bold = True
r_sec4.font.size = Pt(12)

p_sla_intro = doc.add_paragraph()
p_sla_intro.paragraph_format.space_after = Pt(6)
p_sla_intro.add_run(
    "Evaluasi kepatuhan tingkat layanan memisahkan dua parameter utama secara independen pada backend Express.js:"
)

# Formula Cards Table
t_form = doc.add_table(rows=1, cols=2)
t_form.alignment = WD_TABLE_ALIGNMENT.CENTER
f_cell1 = t_form.rows[0].cells[0]
f_cell2 = t_form.rows[0].cells[1]

set_cell_shading(f_cell1, "F8FAFC")
set_cell_shading(f_cell2, "F8FAFC")
set_cell_margins(f_cell1, top=100, bottom=100, left=150, right=150)
set_cell_margins(f_cell2, top=100, bottom=100, left=150, right=150)

p1 = f_cell1.paragraphs[0]
r = p1.add_run("A. Formula Waktu Respon Awal (First Touch SLA)\n")
r.bold = True
r.font.size = Pt(9.5)
r2 = p1.add_run("ΔT_respon = T_respon - T_dibuat\n")
r2.bold = True
r2.font.name = 'Consolas'
r2.font.size = Pt(10)
r3 = p1.add_run("Kriteria Terpenuhi: ΔT_respon ≤ Batas Respon Kontrak PKS")
r3.font.size = Pt(8.5)
r3.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

p2 = f_cell2.paragraphs[0]
r = p2.add_run("B. Formula Waktu Resolusi Bersih (Net MTTR SLA)\n")
r.bold = True
r.font.size = Pt(9.5)
r2 = p2.add_run("Net MTTR = (T_selesai - T_dibuat) - Σ T_pause\n")
r2.bold = True
r2.font.name = 'Consolas'
r2.font.size = Pt(10)
r3 = p2.add_run("Kriteria Terpenuhi: Net MTTR ≤ Batas Resolusi Kontrak PKS")
r3.font.size = Pt(8.5)
r3.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# Matriks PKS
p_sub_pks = doc.add_paragraph()
p_sub_pks.paragraph_format.space_before = Pt(8)
p_sub_pks.paragraph_format.space_after = Pt(4)
r_pks = p_sub_pks.add_run("A. Matriks Standar Kontrak Tingkat Layanan (PKS)")
r_pks.bold = True
r_pks.font.size = Pt(10.5)

t_pks = doc.add_table(rows=1, cols=4)
t_pks.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t_pks.rows[0].cells
hdr_cells[0].text = "Tingkatan Kontrak"
hdr_cells[1].text = "Jadwal Jam Operasional"
hdr_cells[2].text = "Target Waktu Respon"
hdr_cells[3].text = "Target Resolusi Net MTTR"
for cell in hdr_cells:
    set_cell_shading(cell, "F1F5F9")
    set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
    for p in cell.paragraphs:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if cell != hdr_cells[0] else WD_ALIGN_PARAGRAPH.LEFT
        for r in p.runs:
            r.bold = True
            r.font.size = Pt(9)

pks_data = [
    ("Platinum 24×7", "24 Jam × 7 Hari (Non-Stop)", "≤ 30 Menit", "≤ 4 Jam"),
    ("Gold 8×5", "Senin – Jumat (08:00 – 17:00 WIB)", "≤ 30 Menit", "≤ 8 Jam"),
    ("Silver 8×5", "Senin – Jumat (08:30 – 17:30 WIB)", "≤ 1 Jam", "≤ 12 Jam"),
    ("Pemerintah Tier-1", "Jam Kantor Dinas Pemerintah (8×5)", "≤ 1 Jam", "≤ 12 Jam")
]

for row_idx, data in enumerate(pks_data):
    row = t_pks.add_row()
    for col_idx, text in enumerate(data):
        cell = row.cells[col_idx]
        cell.text = text
        if row_idx % 2 == 1:
            set_cell_shading(cell, "F8FAFC")
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        for p in cell.paragraphs:
            if col_idx >= 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for r in p.runs:
                r.font.size = Pt(9)
                if col_idx == 0:
                    r.bold = True

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# Matriks Eskalasi
p_sub_esk = doc.add_paragraph()
p_sub_esk.paragraph_format.space_before = Pt(8)
p_sub_esk.paragraph_format.space_after = Pt(4)
r_esk = p_sub_esk.add_run("B. Matriks Ambang Batas Pemicu Eskalasi Otomatis (Node-Cron Service)")
r_esk.bold = True
r_esk.font.size = Pt(10.5)

t_esk = doc.add_table(rows=1, cols=4)
t_esk.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t_esk.rows[0].cells
hdr_cells[0].text = "Tahap Eskalasi"
hdr_cells[1].text = "Ambang Batas Waktu"
hdr_cells[2].text = "Aksi Sistem Otomatis"
hdr_cells[3].text = "Tujuan Notifikasi Surel"
for cell in hdr_cells:
    set_cell_shading(cell, "F1F5F9")
    set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
            r.font.size = Pt(9)

esk_data = [
    ("1. Peringatan Dini", "Durasi Mencapai 50% Target MTTR", "Kirim surel pengingat status pengerjaan", "Teknisi Penanggung Jawab & Lead CPIG"),
    ("2. Peringatan Kritis", "Durasi Mencapai 80% Target MTTR", "Kirim surel alert darurat (High Priority)", "Service Delivery Lead / Supervisor"),
    ("3. Pelanggaran SLA", "100% Target MTTR Terlampaui", "Ubah status menjadi Breached & catat audit log", "Manajemen Operasional Helpdesk")
]

for row_idx, data in enumerate(esk_data):
    row = t_esk.add_row()
    for col_idx, text in enumerate(data):
        cell = row.cells[col_idx]
        cell.text = text
        if row_idx % 2 == 1:
            set_cell_shading(cell, "F8FAFC")
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(9)
                if col_idx == 0:
                    r.bold = True

doc.add_paragraph().paragraph_format.space_after = Pt(6)

# Skema Database
p_sub_db = doc.add_paragraph()
p_sub_db.paragraph_format.space_before = Pt(8)
p_sub_db.paragraph_format.space_after = Pt(4)
r_db = p_sub_db.add_run("C. Rincian Entitas Skema Basis Data (MySQL)")
r_db.bold = True
r_db.font.size = Pt(10.5)

t_db = doc.add_table(rows=1, cols=3)
t_db.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr_cells = t_db.rows[0].cells
hdr_cells[0].text = "Tabel Basis Data"
hdr_cells[1].text = "Kolom Utama"
hdr_cells[2].text = "Fungsi Penyimpanan"
for cell in hdr_cells:
    set_cell_shading(cell, "F1F5F9")
    set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
    for p in cell.paragraphs:
        for r in p.runs:
            r.bold = True
            r.font.size = Pt(9)

db_data = [
    ("tickets", "id, ticket_number, customer_id, assigned_to, status, priority, sla_policy_id", "Menyimpan data tiket insiden dan relasi ke pelanggan serta teknisi penanggung jawab."),
    ("sla_pause_logs", "id, ticket_id, reason_type, vendor_case_id, paused_at, resumed_at, total_seconds", "Mencatat histori jeda waktu resmi (menunggu suku cadang vendor atau izin jadwal klien)."),
    ("ticket_milestones", "id, ticket_id, title, description, command_executed, created_by, created_at", "Rekam jejak kronologis langkah diagnosa teknis dan eksekusi perintah terminal oleh teknisi."),
    ("knowledge_base", "id, kb_number, title, category, target_vendor, runbook_steps, status, approved_by", "Katalog dokumen SOP terverifikasi yang dihasilkan dari daur ulang solusi insiden nyata."),
    ("audit_event_logs", "id, ticket_id, user_id, action_type, old_value, new_value, timestamp", "Catatan jejak audit permanen untuk menjamin integritas data dan riwayat penanganan.")
]

for row_idx, data in enumerate(db_data):
    row = t_db.add_row()
    for col_idx, text in enumerate(data):
        cell = row.cells[col_idx]
        cell.text = text
        if row_idx % 2 == 1:
            set_cell_shading(cell, "F8FAFC")
        set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.size = Pt(9)
                if col_idx == 0:
                    r.bold = True
                    r.font.name = 'Consolas'

docx_path = r"d:\Unpam\Semester 6\KP\Ticketing-helpdesk\Rancangan_Arsitektur_dan_Alur_Helpdesk_Ticketing.docx"
doc.save(docx_path)
print(f"Clean Word document generated successfully at: {docx_path}")
