import { cleanAllTransactionalData } from '../src/services/systemService.js';
import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('🧹 Menjalankan Pembersihan Penuh Database Helpdesk (0 Tiket, 0 SOP, 1 Akun Admin)...');
  const result = await cleanAllTransactionalData();
  console.log('🎉 Pembersihan database berhasil!');
  console.log(`ℹ️ Status: ${result.message}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Gagal membersihkan database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
