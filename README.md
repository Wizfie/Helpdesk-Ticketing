# Sistem Helpdesk & SLA Ticketing Platform
**PT Global Transformasi Teknologi (Glotra Technology)**

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Vue.js 3](https://img.shields.io/badge/vue-v3.5-emerald.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/vite-v8.3-purple.svg)](https://vitejs.dev/)
[![Express.js](https://img.shields.io/badge/express-v4.19-blue.svg)](https://expressjs.com/)
[![Prisma ORM](https://img.shields.io/badge/prisma-v5.x-teal.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/database-MySQL-orange.svg)](https://www.mysql.com/)

Aplikasi sistem operasional helpdesk dan ticketing berbasis web dengan kepatuhan Service Level Agreement (SLA) 24x7, pelacakan tiket bertahap (*milestone tracking*), isolasi penugasan teknisi (*Role-Based Access Control*), repositori Knowledge Base ITIL 12 bagian, serta portal pelacakan mandiri bagi pelanggan.

---

## 🏗️ Arsitektur Teknologi

* **Frontend**:
  - **Framework**: Vue.js 3 (Composition API, `<script setup>`)
  - **Bundler**: Vite
  - **State Management**: Pinia
  - **Routing**: Vue Router (dengan Navigation Guards RBAC)
  - **Styling**: Tailwind CSS & Lucide Icons
* **Backend**:
  - **Runtime**: Node.js & Express.js REST API
  - **Database ORM**: Prisma ORM
  - **Database Engine**: MySQL
  - **Autentikasi & Keamanan**: JWT (JSON Web Token), BCrypt, Middleware RBAC
  - **Manajemen Lampiran**: Multer (Digital Evidence & Log Attachment)

---

## 📁 Struktur Basis Kode (Clean Codebase)

```
├── .github/workflows/       # Workflow CI/CD deployment
├── backend/                 # Layanan Backend Express.js & Prisma
│   ├── prisma/              # Skema database & seeder
│   │   ├── schema.prisma    # Skema relasional MySQL
│   │   ├── seed.js          # Seeder master data & tiket
│   │   └── migrations/      # Riwayat migrasi database
│   ├── src/
│   │   ├── controllers/     # Handler REST API
│   │   ├── middlewares/     # Otorisasi JWT & penanganan upload
│   │   ├── routes/          # Definisi endpoint API
│   │   ├── services/        # Logika bisnis SLA & audit log
│   │   └── server.js        # Entry point server Express
│   └── uploads/             # Direktori penyimpanan bukti berkas
├── frontend/                # Layanan Frontend Vue.js 3
│   ├── public/              # Aset statis & template resmi SOP docx
│   ├── src/
│   │   ├── components/      # Komponen modal, navbar, sidebar, preview
│   │   ├── data/            # Mock data & state fallback
│   │   ├── router/          # Konfigurasi rute dan otorisasi
│   │   ├── services/        # Klien HTTP API (Axios/Fetch)
│   │   ├── stores/          # Pinia store (Auth, Ticket, SLA)
│   │   └── views/           # Halaman utama (Dashboard, Tiket, KB, SLA, dll.)
│   ├── package.json
│   └── vite.config.js
├── DEVELOPMENT_LOG.md       # Catatan riwayat tahapan pengembangan
├── package.json             # Root runner scripts
└── README.md
```

---

## ⚡ Panduan Menjalankan Aplikasi

### Opsi A: Menggunakan Docker Compose (Sangat Direkomendasikan di VPS / Server)
Cukup satu perintah untuk menjalankan seluruh stack (Database MySQL, Backend Express, dan Frontend Nginx):
```bash
# Jalankan seluruh kontainer di latar belakang
docker compose up -d --build
```
* **Frontend Web**: Buka `http://localhost` (Port 80)
* **Backend API**: `http://localhost/api` atau `http://localhost:5000/api`
* **MySQL Database**: `localhost:3306` (volume data tersimpan persisten di `helpdesk_mysql_data`)
* **Hentikan Sistem**: `docker compose down`

---

### Opsi B: Menjalankan Manual (Mode Development Lokal)

#### 1. Prasyarat Sistem
* [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
* [MySQL](https://www.mysql.com/) (versi 8.x atau MariaDB 10.4+)
* Git

### 2. Konfigurasi Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   npm install
   ```
2. Buat berkas konfigurasi `.env` di dalam folder `backend/`:
   ```env
   PORT=5000
   DATABASE_URL="mysql://root:password@localhost:3306/helpdesk_glotra"
   JWT_SECRET="glotra_secret_key_2026"
   ```
3. Jalankan migrasi database dan pengisian data awal (*seeding*):
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
4. Jalankan backend server:
   ```bash
   npm run dev
   ```
   *Server backend akan aktif di `http://localhost:5000`.*

### 3. Konfigurasi Frontend
1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   npm install
   ```
2. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
   *Frontend akan aktif di `http://localhost:5173`.*

---

## 👥 Akun Akses Demo (RBAC)

Aplikasi dilengkapi dengan tombol **Quick Demo Login** pada halaman masuk ([`/login`](http://localhost:5173/login)) untuk mempermudah pengujian hak akses:

| Peran (Role) | Email | Akses Fitur Utama |
|---|---|---|
| **System Administrator** | `admin@glotratech.com` | Kontrol penuh sistem, SLA Policy, Users Management, Jejak Audit, Persetujuan Runbook KB. |
| **CPIG (Helpdesk Dispatcher)** | `helpdesk@glotratech.com` | Pembuatan tiket baru, eskalasi tiket, mitigasi SLA, komunikasi pelanggan. |
| **IT Support Engineer** | `budi.santoso@glotratech.com` | Antrean tugas teknisi personal, diagnosis terminal, unggah bukti uji hasil, formulir Runbook KB. |
| **Management** | `management@glotratech.com` | Dashboard Eksekutif KPI, Laporan SLA MTTR & kepatuhan, ekspor laporan. |

---

## 🔒 Portal Pelacakan Mandiri Pelanggan (Customer Self-Service)
Pelanggan dapat memantau progres perbaikan tanpa perlu membuat akun login internal:
* Format rute: `/track/:ticketNumber`
* Contoh akses: `/track/TICK-20261001-0002`

---

## 📄 Lisensi & Hak Cipta
Hak Cipta &copy; 2026 PT Global Transformasi Teknologi (Glotra Technology) & Tim Pengembang Mahasiswa Kerja Praktek Teknik Informatika Universitas Pamulang.
