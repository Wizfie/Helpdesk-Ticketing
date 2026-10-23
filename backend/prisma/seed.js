import { seedCompleteEnterpriseData } from '../src/services/systemService.js';
import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('🚀 Menjalankan Seeding Lengkap Helpdesk PT Glotra (156 Tiket Realistis)...');
  await seedCompleteEnterpriseData();
  console.log('🎉 Seeding database via CLI berhasil!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Gagal menjalankan seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
