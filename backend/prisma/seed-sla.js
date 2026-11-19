import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanSla() {
  const result = await prisma.slaPolicy.deleteMany({});
  console.log(`🧹 Berhasil membersihkan ${result.count} data kebijakan SLA dari database.`);
  console.log('✅ Database SLA kini bersih (0 policies), siap untuk pengujian input manual.');
}

cleanSla()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Gagal membersihkan SLA:', e);
    prisma.$disconnect();
    process.exit(1);
  });
