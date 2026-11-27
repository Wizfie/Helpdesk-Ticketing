# Panduan Ringkas Setup & Deploy ke VPS (Full sampai Running)
**Glotra ServiceDesk — PT Global Transformasi Teknologi**

Seluruh konfigurasi Docker Compose, sinkronisasi database, auto-seeding aman, batas upload Nginx (`20M`), dan Resend Email Gateway sudah disiapkan di repositori sehingga deploy ke VPS cukup mengikuti urutan langkah berikut tanpa perlu mengubah file `docker-compose.yml` lagi.

---

## Alur Singkat
```text
[1. Swap & Docker] -> [2. Folder Disk VPS] -> [3. Clone & .env] -> [4. Build & Run] -> [5. Domain & HTTPS] -> [Running]
```

> **Catatan Arsitektur Database & Upload di VPS:**
> * **MySQL 8.0** berjalan otomatis di dalam container Docker `helpdesk-db` di VPS Anda (**tidak perlu install MySQL manual di OS host**).
> * Data database dan file upload tersimpan persisten langsung di disk host VPS (`/srv/glotra-helpdesk/mysql` dan `/srv/glotra-helpdesk/uploads`), sehingga aman saat rebuild maupun restart.
> * Port `3306` MySQL hanya dibuka pada `127.0.0.1` VPS demi keamanan (jika ingin akses dari DBeaver/MySQL Workbench di laptop, gunakan SSH Tunnel).

---

### 1. Login SSH, Update OS & Buat Swap 2 GB
*(Swap 2 GB disarankan untuk VPS 2 GB RAM agar build Vite di Docker berjalan lancar).*

```bash
ssh root@IP_VPS_ANDA
sudo apt update && sudo apt upgrade -y
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

### 2. Install Docker, Docker Compose, Git & Buka Firewall
```bash
sudo apt install -y ca-certificates curl git ufw
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

---

### 3. Siapkan Folder Data Persisten di Disk Host VPS
Agar data MySQL dan file upload **tidak terhapus** saat rebuild maupun `docker compose down -v`:

```bash
sudo mkdir -p /srv/glotra-helpdesk/uploads /srv/glotra-helpdesk/mysql
sudo chown -R 1000:1000 /srv/glotra-helpdesk/uploads
```

---

### 4. Clone Repository & Isi `.env`
```bash
sudo mkdir -p /opt/apps && sudo chown -R $USER:$USER /opt/apps
cd /opt/apps
git clone https://github.com/Wizfie/Helpdesk-Ticketing.git
cd Helpdesk-Ticketing
cp .env.example .env
nano .env
```

Ubah baris berikut di `.env`:
```env
DB_ROOT_PASSWORD=GantiPasswordRootKuat2026!
DB_PASSWORD=GantiPasswordDbKuat2026!
JWT_SECRET=ganti_string_acak_panjang_minimal_32_karakter

# Aktifkan penyimpanan langsung di disk host VPS
MYSQL_STORAGE_PATH="/srv/glotra-helpdesk/mysql"
UPLOAD_STORAGE_PATH="/srv/glotra-helpdesk/uploads"

# URL publik untuk tautan tracking pada email
CLIENT_URL="https://domainanda.com"          # Atau http://IP_VPS_ANDA jika belum pakai domain

# Resend Email Gateway (Gratis 3.000 email/bulan)
EMAIL_FROM_ADDRESS="onboarding@resend.dev"   # Ganti domain Anda jika sudah terverifikasi
SMTP_PASS="re_API_KEY_RESEND_ANDA"
```

---

### 5. Build & Jalankan Aplikasi
*(Sinkronisasi skema Prisma `db push` dan seeding awal otomatis dijalankan hanya saat database masih kosong, dan aman saat rebuild berikutnya).*

```bash
docker compose up -d --build
docker compose logs -f backend
```
Tunggu hingga muncul log `Helpdesk REST API PT Glotra Aktif di Port 5000`, lalu tekan `Ctrl + C`.

---

### 6. Verifikasi Running & Setup Domain + HTTPS
```bash
docker compose ps
curl -I http://localhost
curl http://localhost/api/health
```

Akses sementara via IP: `http://IP_VPS_ANDA`

#### Menghubungkan Domain & Mengaktifkan HTTPS (Pilih Salah Satu)

* **Opsi A — Cloudflare DNS (Paling Cepat, Tanpa Setup Web Server Host):**
  1. Di dashboard **Cloudflare**, tambahkan **A Record** (misal `@` atau `helpdesk`) mengarah ke `IP_VPS_ANDA` dengan status **Proxied (Awan Oranye ON)**.
  2. Masuk ke menu **SSL/TLS → Overview**, pilih mode **Flexible** *(karena Docker frontend mendengarkan port `80`)*.
  3. Di `.env` VPS, pastikan `CLIENT_URL="https://domainanda.com"` lalu jalankan `docker compose up -d`.

* **Opsi B — Direct HTTPS di VPS dengan Caddy (SSL Let's Encrypt Otomatis, Tanpa Proxy Cloudflare):**
  1. Tambahkan `FRONTEND_PORT=127.0.0.1:8080` di `.env` lalu jalankan `docker compose up -d` (agar port `80` & `443` bebas dipakai Caddy untuk SSL, tanpa mengubah `docker-compose.yml`).
  2. Install Caddy dan arahkan A Record DNS domain Anda ke `IP_VPS_ANDA` (Proxy OFF):
     ```bash
     sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
     curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
     curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
     sudo apt update && sudo apt install -y caddy
     ```
  3. Edit `/etc/caddy/Caddyfile` (`sudo nano /etc/caddy/Caddyfile`):
     ```caddyfile
     domainanda.com {
         request_body {
             max_size 25MB
         }
         reverse_proxy localhost:8080
     }
     ```
  4. Reload Caddy (`sudo systemctl reload caddy`), otomatis HTTPS aktif dan diperbarui berkala.

---

### 7. Login & Uji Awal Setelah Running
Buka browser ke `https://domainanda.com`:
* **Login Default Admin:** `admin@glotratech.com` / `password123` *(segera ganti kata sandi di menu **Profil**)*.
* **Uji Email Resend:** Masuk ke menu **Gateway Email** $\rightarrow$ kirim tes email ke email yang terdaftar di Resend (atau email mana saja setelah domain diverifikasi di Resend).
* **Opsional (Import Data Lokal `sql.sql` ke MySQL VPS):**
  ```bash
  docker compose exec -T db mysql -u root -p"PASSWORD_ROOT_DB" helpdesk_glotra < sql.sql
  ```

---

## Update & Maintenance Rutin

### Akses SSH Saat Proxy Cloudflare Aktif
Karena Proxy Cloudflare hanya meneruskan trafik web HTTP/HTTPS (bukan port 22 SSH), gunakan **IP publik VPS secara langsung** untuk remote SSH:
```bash
ssh ubuntu@IP_VPS_ANDA
```

### Update Kode Terbaru (Data Upload & DB Tetap Aman)
```bash
cd /opt/apps/Helpdesk-Ticketing
bash deploy/deploy.sh            # Update & rebuild semuanya
# atau parsial:
bash deploy/deploy.sh frontend   # Khusus frontend saja
bash deploy/deploy.sh backend    # Khusus backend saja
```

### Akses Database VPS dari Laptop (DBeaver / HeidiSQL / MySQL Workbench)
Port `3306` MySQL terikat khusus ke `127.0.0.1` VPS demi keamanan. Untuk mengakses dari laptop lokal, gunakan fitur **SSH Tunnel** pada client database Anda:
* **Tab SSH Tunnel:** Host `IP_VPS_ANDA` | Port `22` | Username `ubuntu` | Password VPS
* **Tab Main / MySQL:** Host `127.0.0.1` | Port `3306` | Database `helpdesk_glotra` | Username `glotra_user` *(atau `root`)* | Password sesuai `DB_PASSWORD` / `DB_ROOT_PASSWORD` di `.env` VPS

### Migrasi / Import Database Lokal (`sql.sql`) ke MySQL VPS
```bash
# 1. Jalankan dari CMD/PowerShell di komputer lokal (folder proyek):
scp sql.sql ubuntu@IP_VPS_ANDA:/opt/apps/Helpdesk-Ticketing/

# 2. Jalankan di SSH VPS:
cd /opt/apps/Helpdesk-Ticketing
docker compose exec -T db mysql -u root -p"PASSWORD_ROOT_DB" helpdesk_glotra < sql.sql
docker compose exec backend npx prisma db push
```

### Backup & Restore Database
```bash
# Backup
docker compose exec -T db mysqldump -u root -p"PASSWORD_ROOT_DB" helpdesk_glotra | gzip > backup_$(date +%F).sql.gz

# Restore
gunzip < backup_YYYY-MM-DD.sql.gz | docker compose exec -T db mysql -u root -p"PASSWORD_ROOT_DB" helpdesk_glotra
```

### Backup Folder Upload
```bash
tar -czvf backup_uploads_$(date +%F).tar.gz /srv/glotra-helpdesk/uploads
```

### Perintah Monitoring Cepat
| Kebutuhan | Perintah |
| :--- | :--- |
| Cek status semua container | `docker compose ps` |
| Lihat log backend / database | `docker compose logs -f backend` |
| Restart layanan | `docker compose restart` |
| Hentikan sementara (data aman) | `docker compose down` |
| Nyalakan kembali | `docker compose up -d` |
