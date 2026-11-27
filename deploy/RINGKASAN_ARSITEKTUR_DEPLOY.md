# Ringkasan Arsitektur & Komponen Deployment
**Glotra ServiceDesk — PT Global Transformasi Teknologi**

Dokumen ini merangkum seluruh infrastruktur, teknologi, layanan pihak ketiga, alur jaringan, dan aspek keamanan yang digunakan pada deployment produksi **`https://glotraservicedesk.my.id`** sebagai referensi presentasi, tanya jawab, maupun serah terima operasional.

---

## 1. Gambaran Umum Infrastruktur

| Komponen | Teknologi / Layanan | Keterangan |
| :--- | :--- | :--- |
| **Domain Produksi** | `glotraservicedesk.my.id` | Portal utama aplikasi helpdesk & pelacakan tiket |
| **DNS & SSL/TLS** | **Cloudflare** (Proxy ON / *Flexible SSL*) | Mengatur DNS ke IP VPS & menyediakan enkripsi HTTPS untuk browser pengguna |
| **Cloud Server (VPS)** | **Tencent Cloud** (`43.173.49.146`) | VPS Linux (`ubuntu`) dengan firewall `ufw` aktif hanya untuk port `22`, `80`, dan `443` |
| **Orkestrasi Container** | **Docker & Docker Compose** | Menjalankan 3 layanan terisolasi dalam satu bridge network (`helpdesk-net`) |
| **Web Server & Reverse Proxy** | **Nginx Alpine** | Menyajikan aset statis Vue SPA & meneruskan trafik `/api/` dan `/uploads/` ke backend |
| **Frontend** | **Vue 3 (`^3.5`) + Vite (`^8.3`) + Pinia + Tailwind CSS** | Dikompilasi dengan multi-stage build (`node:24-alpine` $\rightarrow$ `nginx:alpine`) |
| **Backend API** | **Node.js 24 Alpine + Express.js (`^5.2`) + Prisma ORM (`^6.19`)** | REST API port internal `5000`, autentikasi JWT, upload Multer, penjadwalan `node-cron` |
| **Database** | **MySQL 8.0** (`mysql:8.0`) | Database `helpdesk_glotra`, hanya terbuka pada `127.0.0.1:3306` (localhost VPS) |
| **Email Gateway** | **Resend** (`smtp.resend.com:465`) | Mengirim notifikasi tiket & link tracking resmi dari `noreply@glotraservicedesk.my.id` |
| **Source Control & Deploy** | **GitHub (`Wizfie/Helpdesk-Ticketing`) + `deploy/deploy.sh`** | Update kode & rebuild container parsial/penuh tanpa kehilangan data |

---

## 2. Alur Trafik & Arsitektur Container

```text
[Browser Pengguna]
       │ HTTPS (443)
       ▼
[Cloudflare DNS + Proxy + Flexible SSL]
       │ HTTP (80) -> IP VPS 43.173.49.146
       ▼
┌─────────────────── VPS Host (Docker Network: helpdesk-net) ───────────────────┐
│                                                                                │
│  1. Container: helpdesk-frontend (Nginx Alpine - Port 80)                      │
│     ├── /            ──► Statis Vue 3 SPA (/usr/share/nginx/html)              │
│     ├── /api/*       ──► Reverse Proxy ke http://backend:5000/api/             │
│     └── /uploads/*   ──► Reverse Proxy ke http://backend:5000/uploads/         │
│                          (Batas upload Nginx: client_max_body_size 20M)        │
│                                                                                │
│  2. Container: helpdesk-backend (Node 24 + Express + Prisma - Port 5000)       │
│     ├── Entrypoint   ──► Tunggu MySQL -> prisma db push -> auto-seed jika kosong│
│     ├── Volume       ──► /srv/glotra-helpdesk/uploads  <-> /app/uploads        │
│     └── Config       ──► ./.env host                  <-> /app/.env           │
│                                                                                │
│  3. Container: helpdesk-db (MySQL 8.0 - Port 127.0.0.1:3306)                   │
│     └── Volume       ──► /srv/glotra-helpdesk/mysql    <-> /var/lib/mysql      │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Peran Tiap Container (`docker-compose.yml`)
1. **`helpdesk-frontend` (`frontend/Dockerfile` & `frontend/nginx.conf`)**
   * Dibangun dengan *multi-stage build*: `node:24-alpine` hanya dipakai saat kompilasi aset `vite build`, sehingga image produksi hanya berisi **Nginx Alpine** yang ringan.
   * **Single-Origin Reverse Proxy:** Semua request `/api/` dan `/uploads/` diproksi ke `backend:5000` di dalam jaringan Docker internal. Frontend dan backend berada pada satu domain (`https://glotraservicedesk.my.id`), sehingga terbebas dari masalah CORS dan port backend tidak perlu dibuka ke publik.
   * Mendukung rute Vue History Mode (`try_files $uri $uri/ /index.html`), kompresi Gzip, caching aset statis 1 tahun, dan batas unggahan `20M` (mencukupi lampiran tiket 5 MB dan dokumen Knowledge Base 15 MB).

2. **`helpdesk-backend` (`backend/Dockerfile` & `backend/docker-entrypoint.sh`)**
   * Berjalan di atas `node:24-alpine` dengan **Express.js 5**, **Prisma Client**, **JWT (`jsonwebtoken`)**, **bcryptjs**, **Multer**, dan **node-cron**.
   * Saat container menyala, `docker-entrypoint.sh` menunggu socket `db:3306` aktif, menjalankan `npx prisma db push --skip-generate` untuk menyamakan struktur tabel, dan melakukan **auto-seeding aman** (`SEED_ON_START=auto`): data awal hanya diisi jika tabel `user` masih kosong (`count === 0`), agar data produksi tidak tertimpa saat restart atau rebuild.

3. **`helpdesk-db` (`mysql:8.0`)**
   * Menjalankan MySQL 8.0 langsung dalam container tanpa perlu instalasi MySQL di OS host VPS.
   * Dilengkapi *healthcheck* (`mysqladmin ping`) sehingga container `backend` baru akan start setelah database benar-benar siap menerima koneksi.

---

## 3. Persistensi Data, Keamanan & Akses Remote

* **Data Aman Saat Rebuild / Restart:**
  * Data database MySQL disimpan di disk host VPS: `/srv/glotra-helpdesk/mysql`.
  * Berkas lampiran bukti tiket & dokumen Knowledge Base disimpan di disk host VPS: `/srv/glotra-helpdesk/uploads`.
  * File `.env` host di-mount langsung ke `/app/.env`, sehingga perubahan pengaturan Email Gateway dari menu Admin tetap tersimpan permanen.
* **Isolasi Port Database:**
  * Port `3306` hanya di-bind ke `127.0.0.1:3306` di VPS (tidak dibuka ke publik).
  * Untuk mengakses database dari laptop menggunakan **DBeaver / HeidiSQL / MySQL Workbench**, digunakan **SSH Tunnel** ke `43.173.49.146` port `22` (user `ubuntu`) lalu mengarah ke `127.0.0.1:3306`.
* **Akses SSH Server:**
  * Karena proxy Cloudflare hanya meneruskan trafik web HTTP/HTTPS, remote terminal SSH dilakukan langsung ke IP VPS (`ssh ubuntu@43.173.49.146`).
* **Keamanan Jaringan & Aplikasi:**
  * Firewall VPS (`ufw`) hanya mengizinkan port `22` (SSH), `80` (HTTP), dan `443` (HTTPS).
  * Validasi ekstensi dan ukuran file upload pada backend & Nginx, proteksi injeksi CRLF pada penyimpanan `.env`, serta halaman login produksi tanpa *Quick Login* demo.

---

## 4. Domain, HTTPS & Email Gateway

* **Domain & Cloudflare:**
  * A Record domain `glotraservicedesk.my.id` diarahkan ke `43.173.49.146` dengan proxy Cloudflare aktif (*Proxied*) dan mode SSL/TLS **Flexible** (browser terhubung via HTTPS ke Cloudflare, lalu Cloudflare meneruskan HTTP ke port `80` Nginx VPS).
  * *(Tersedia juga opsi alternatif Direct HTTPS langsung di VPS menggunakan **Caddy** pada `deploy/PANDUAN_DEPLOY_VPS.md` apabila tidak memakai proxy Cloudflare).*
* **Email Gateway (Resend):**
  * Menggunakan layanan **Resend** melalui SMTP SSL (`smtp.resend.com` port `465`) dengan API Key Resend.
  * Domain `glotraservicedesk.my.id` telah diverifikasi melalui DNS record di Cloudflare, sehingga email notifikasi tiket & tautan pelacakan pelanggan terkirim resmi menggunakan alamat pengirim **`noreply@glotraservicedesk.my.id`**.

---

## 5. Alur Pembaruan Kode (*Deployment Update*)

Pembaruan kode dari laptop ke VPS dilakukan melalui GitHub (`Wizfie/Helpdesk-Ticketing`, branch `main`) dan skrip otomasi `deploy/deploy.sh`:

```bash
cd /opt/apps/Helpdesk-Ticketing
bash deploy/deploy.sh            # Tarik kode terbaru & rebuild semua layanan
bash deploy/deploy.sh frontend   # Khusus update tampilan frontend (~cepat, backend & DB tetap hidup)
bash deploy/deploy.sh backend    # Khusus update API backend (frontend & DB tetap hidup)
```

---

## 6. Tanya Jawab Singkat (Pegangan Presentasi / Sidang)

* **Mengapa memilih deployment menggunakan Docker Compose?**
  Agar seluruh layanan (Nginx, Node.js/Express, MySQL 8.0) berjalan dalam environment yang konsisten dan terisolasi, tidak bentrok dengan paket OS server, serta mudah direplikasi atau dipindahkan ke server lain.
* **Apakah data tiket dan file lampiran hilang jika kode di-update atau container di-rebuild?**
  Tidak. Database dan file upload di-mount ke direktori persisten di disk host VPS (`/srv/glotra-helpdesk/mysql` dan `/srv/glotra-helpdesk/uploads`), dan proses seeding hanya berjalan ketika tabel user masih kosong.
* **Mengapa MySQL tidak langsung dibuka port `3306`-nya ke publik?**
  Untuk mencegah serangan brute-force atau akses database langsung dari internet. Port `3306` dikunci hanya pada `127.0.0.1` VPS dan hanya dapat diakses dari luar melalui jalur terenkripsi **SSH Tunnel**.
* **Bagaimana frontend Vue bisa memanggil backend Express tanpa error CORS di server produksi?**
  Nginx di container frontend bertindak sebagai *reverse proxy* yang meneruskan path `/api/` dan `/uploads/` ke container `backend:5000`, sehingga di browser seluruh komunikasi tetap berada dalam satu origin domain (`https://glotraservicedesk.my.id`).
* **Bagaimana sistem mengirimkan notifikasi email ke pelanggan dan teknisi?**
  Backend (`mailService.js`) terhubung ke layanan **Resend** (`smtp.resend.com:465`) dengan domain pengirim terverifikasi `noreply@glotraservicedesk.my.id` dan link pelacakan yang mengacu pada `CLIENT_URL`.

> Untuk panduan perintah teknis langkah demi langkah (setup awal VPS, SSH tunnel HeidiSQL/DBeaver, import/backup SQL, dan monitoring container), lihat **[PANDUAN_DEPLOY_VPS.md](./PANDUAN_DEPLOY_VPS.md)**.
