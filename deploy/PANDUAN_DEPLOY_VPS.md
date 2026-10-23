# 🚀 Panduan Ringkas Deploy ke VPS (Docker)
**Sistem Helpdesk Ticketing PT Global Transformasi Teknologi**

Panduan ini dibuat seringkas dan sejelas mungkin untuk mendeploy sistem ke VPS (Tencent Cloud / Ubuntu 22.04 atau 24.04 LTS).

---

## ⏱️ Ringkasan Cepat (Hanya 3 Langkah)

```
[1. Siapkan VPS] ──> [2. Install Docker 1-Baris] ──> [3. Clone & Jalankan] ──> Selesai! 🎉
```

---

### Langkah 1: Akses VPS via Terminal / SSH

Buka terminal di komputer Anda (atau Git Bash / PuTTY) dan login ke VPS:
```bash
ssh root@IP_VPS_ANDA
```
*(Ganti `IP_VPS_ANDA` dengan alamat IP publik VPS Tencent Anda).*

---

### Langkah 2: Install Docker di VPS (Cukup 1 Baris)

Jalankan perintah resmi berikut untuk menginstal Docker & Docker Compose secara otomatis di Ubuntu:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
```

---

### Langkah 3: Unduh Repositori & Jalankan Aplikasi

1. Clone repositori ke server:
   ```bash
   git clone https://github.com/Wizfie/Helpdesk-Ticketing.git /var/www/helpdesk
   cd /var/www/helpdesk
   ```

2. Jalankan sistem Helpdesk (Database MySQL, Backend, Frontend langsung aktif):
   ```bash
   docker compose up -d --build
   ```

3. **SELESAI!** 
   Buka browser dan akses alamat IP VPS Anda:
   * **URL Web**: `http://IP_VPS_ANDA`
   * **Login Demo**: 
     - Admin: `admin@glotratech.com` | Password: `Password123!`
     - Helpdesk: `helpdesk@glotratech.com` | Password: `Password123!`
     - Teknisi: `budi.santoso@glotratech.com` | Password: `Password123!`

---

## 🔄 Cara Melakukan Update Kode di Masa Mendatang

Anda bisa meng-update **seluruh aplikasi** atau **salah satu sisi saja (Frontend / Backend)** secara terpisah dan instan:

### Opsi 1: Menggunakan Skrip Cepat (Direkomendasikan)
Masuk ke folder proyek di VPS dan jalankan:
```bash
cd /var/www/helpdesk

# Update & Rebuild SEMUANYA:
bash deploy/deploy.sh

# ATAU Update KHUSUS FRONTEND saja (Backend & DB tetap online tanpa jeda):
bash deploy/deploy.sh frontend

# ATAU Update KHUSUS BACKEND saja (Frontend & DB tetap online):
bash deploy/deploy.sh backend
```

---

### Opsi 2: Perintah Manual Docker Compose

| Skenario Pembaruan | Perintah Terminal di VPS | Waktu & Keterangan |
|---|---|:---:|
| **Hanya Frontend** (Ubah UI/Vue/CSS) | `docker compose up -d --no-deps --build frontend` | ~5–10 detik (Backend & DB aman) |
| **Hanya Backend** (Ubah API/Express) | `docker compose up -d --no-deps --build backend` | ~5–10 detik (Frontend & DB aman) |
| **Keduanya Sekaligus** | `docker compose up -d --build` | ~15–25 detik |

> **🛡️ Jaminan Keamanan Data:**  
> Seluruh file yang diunggah pengguna (lampiran bukti/log) tersimpan aman di Docker Named Volume `helpdesk_uploads_data`. Rebuild parsial maupun rebuild penuh **dijamin tidak akan pernah menghapus file upload atau data database**.

---

## 💾 Cara Backup Database Manual (Kapan Saja)

Untuk menyimpan cadangan database ke file `.sql.gz`:
```bash
docker exec -i helpdesk-db mysqldump -u glotra_user -pglotra_password_2026 helpdesk_glotra | gzip > backup_$(date +%F).sql.gz
```

Untuk me-restore cadangan jika dibutuhkan:
```bash
gunzip < backup_2026-10-23.sql.gz | docker exec -i helpdesk-db mysql -u glotra_user -pglotra_password_2026 helpdesk_glotra
```

---

## ❓ Perintah Bermanfaat Sehari-hari

| Kebutuhan | Perintah |
|---|---|
| **Cek status semua layanan** | `docker compose ps` |
| **Lihat log aktivitas backend/database** | `docker compose logs -f` |
| **Restart aplikasi** | `docker compose restart` |
| **Matikan aplikasi sementara** | `docker compose down` |
| **Nyalakan kembali** | `docker compose up -d` |
