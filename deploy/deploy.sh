#!/bin/bash
# ==============================================================================
# Skrip Otomatisasi Deploy & Update Helpdesk Ticketing PT Glotra di VPS
#
# Penggunaan:
#   bash deploy/deploy.sh           -> Update & Rebuild Semua Layanan (Frontend & Backend)
#   bash deploy/deploy.sh frontend  -> Update & Rebuild Khusus Frontend Saja (Instan ~5s)
#   bash deploy/deploy.sh backend   -> Update & Rebuild Khusus Backend Saja (Instan ~5s)
# ==============================================================================
set -e

TARGET=${1:-all}

echo "🚀 [1/3] Menarik pembaruan kode terbaru dari Git..."
git pull origin main

if [ "$TARGET" = "frontend" ]; then
  echo "📦 [2/3] Melakukan build ulang KHUSUS FRONTEND (Backend & DB tetap hidup)..."
  docker compose up -d --no-deps --build frontend
elif [ "$TARGET" = "backend" ]; then
  echo "📦 [2/3] Melakukan build ulang KHUSUS BACKEND (Frontend & DB tetap hidup)..."
  docker compose up -d --no-deps --build backend
else
  echo "📦 [2/3] Melakukan build ulang SEMUA LAYANAN..."
  docker compose up -d --build
fi

echo "🧹 [3/3] Membersihkan Docker build cache lama..."
docker image prune -f

echo ""
echo "📊 Status Kontainer Aktif:"
docker compose ps
echo ""
echo "✅ UPDATE BERHASIL ($TARGET)! Sistem Helpdesk aktif dan aman."
