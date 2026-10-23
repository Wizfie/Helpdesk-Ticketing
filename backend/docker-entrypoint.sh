#!/bin/sh
set -e

echo "==> [Entrypoint] Menunggu database MySQL siap di port 3306..."
while ! nc -z db 3306; do
  sleep 1
done
echo "==> [Entrypoint] Database MySQL aktif dan siap menerima koneksi."

echo "==> [Entrypoint] Menjalankan Prisma Safe Migration (deploy)..."
npx prisma migrate deploy

# Jalankan seeder otomatis saat inisialisasi jika diizinkan
if [ "$SEED_ON_START" = "true" ]; then
  echo "==> [Entrypoint] Menjalankan seeding data awal..."
  node prisma/seed.js || true
fi

echo "==> [Entrypoint] Menjalankan Backend Express Server..."
exec "$@"
