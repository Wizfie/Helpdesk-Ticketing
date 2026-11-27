#!/bin/sh
set -e

echo "==> [Entrypoint] Menunggu database MySQL siap di port 3306..."
while ! nc -z db 3306; do
  sleep 1
done
echo "==> [Entrypoint] Database MySQL aktif dan siap menerima koneksi."

echo "==> [Entrypoint] Menyinkronkan skema Prisma terbaru ke MySQL (db push)..."
npx prisma db push --skip-generate

# Auto-seed aman: hanya berjalan jika database masih kosong (0 user) agar data produksi tidak tertimpa saat restart/rebuild
if [ "$SEED_ON_START" = "auto" ] || [ "$SEED_ON_START" = "true" ]; then
  if node -e "import('./src/lib/prisma.js').then(async ({default: p}) => { const c = await p.user.count(); await p.\$disconnect(); process.exit(c === 0 ? 0 : 1); }).catch(() => process.exit(1));"; then
    echo "==> [Entrypoint] Database masih kosong, menjalankan seeding data awal..."
    node prisma/seed.js || true
  else
    echo "==> [Entrypoint] Data user sudah ada, melewati seeding agar data eksisting tetap aman."
  fi
fi

echo "==> [Entrypoint] Menjalankan Backend Express Server..."
exec "$@"
