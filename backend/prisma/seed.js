import { seedCompleteEnterpriseData } from '../src/services/systemService.js';
import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('🚀 Menjalankan Inisialisasi Master Data Helpdesk PT Glotra (Roles, Users, Categories, Customers, SLA)...');
  await seedCompleteEnterpriseData();
  console.log('🎉 Inisialisasi master data database via CLI berhasil!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Gagal menjalankan inisialisasi master data:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
