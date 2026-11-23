/**
 * reset-for-demo.js
 * Hapus semua data transaksional & master (kecuali users & roles)
 * Jalankan: node prisma/reset-for-demo.js
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetForDemo() {
  console.log('🔄 Memulai reset database untuk demo...\n');

  // Urutan hapus harus mengikuti foreign key dependency
  // (tabel yang punya FK dihapus duluan)

  // 1. Audit Logs (tidak ada FK ke tabel lain)
  const auditCount = await prisma.auditLog.deleteMany({});
  console.log(`✅ AuditLog      : ${auditCount.count} baris dihapus`);

  // 2. Ticket Milestones (FK ke Ticket & User)
  const msCount = await prisma.ticketMilestone.deleteMany({});
  console.log(`✅ TicketMilestone: ${msCount.count} baris dihapus`);

  // 3. Tickets (FK ke Customer, CustomerPic, KbOption, User)
  const ticketCount = await prisma.ticket.deleteMany({});
  console.log(`✅ Ticket        : ${ticketCount.count} baris dihapus`);

  // 4. Customer PICs (FK ke Customer)
  const picCount = await prisma.customerPic.deleteMany({});
  console.log(`✅ CustomerPic   : ${picCount.count} baris dihapus`);

  // 5. Customers
  const custCount = await prisma.customer.deleteMany({});
  console.log(`✅ Customer      : ${custCount.count} baris dihapus`);

  // 6. Knowledge Base
  const kbCount = await prisma.knowledgeBase.deleteMany({});
  console.log(`✅ KnowledgeBase : ${kbCount.count} baris dihapus`);

  // 7. Master KB Options
  const kbOptionCount = await prisma.kbOption.deleteMany({});
  console.log(`✅ KbOption      : ${kbOptionCount.count} baris dihapus`);

  // 12. SLA Policies
  const slaCount = await prisma.slaPolicy.deleteMany({});
  console.log(`✅ SlaPolicy     : ${slaCount.count} baris dihapus`);

  // ❌ Users & Roles TIDAK dihapus
  const userCount = await prisma.user.count();
  const roleCount = await prisma.role.count();
  console.log(`\n⚠️  Users (dipertahankan) : ${userCount} akun`);
  console.log(`⚠️  Roles (dipertahankan) : ${roleCount} role`);

  console.log('\n✅ Reset selesai! Database siap untuk demo.\n');
  console.log('📝 Langkah selanjutnya:');
  console.log('   1. Login ke aplikasi');
  console.log('   2. Isi master data: Customer, SLA Policy, Kategori, dll.');
  console.log('   3. Buat tiket perdana untuk demo');
}

resetForDemo()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('\n❌ Error saat reset:', e.message);
    prisma.$disconnect();
    process.exit(1);
  });
