import prisma from '../src/lib/prisma.js';

async function executeMigration() {
  console.log('🔄 Memulai eksekusi normalisasi database & pencatatan audit log...');

  try {
    // 1. Drop unused principals table
    console.log('📌 1. Menghapus tabel usang `principals` jika ada...');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS principals;');
    console.log('✅ Tabel `principals` berhasil dihapus.');

    // 2. Normalize ticket_milestones (Drop redundant actorName & actorRole)
    console.log('📌 2. Memeriksa kolom `ticket_milestones`...');
    const columns = await prisma.$queryRawUnsafe('DESCRIBE ticket_milestones;');
    const colNames = columns.map(c => c.Field);

    if (colNames.includes('actorName') || colNames.includes('actorRole')) {
      console.log('⚙️ Menghapus kolom redundant `actorName` dan `actorRole` dari `ticket_milestones`...');
      const dropQueries = [];
      if (colNames.includes('actorName')) dropQueries.push('DROP COLUMN actorName');
      if (colNames.includes('actorRole')) dropQueries.push('DROP COLUMN actorRole');
      
      const sql = `ALTER TABLE ticket_milestones ${dropQueries.join(', ')};`;
      await prisma.$executeRawUnsafe(sql);
      console.log('✅ Kolom redundant berhasil dihapus dari `ticket_milestones`.');
    } else {
      console.log('ℹ️ Kolom `actorName` dan `actorRole` sudah tidak ada di `ticket_milestones`.');
    }

    // 3. Catat ke tabel audit_logs
    console.log('📌 3. Mencatat riwayat perubahan ke tabel `audit_logs`...');
    const auditRecord = await prisma.auditLog.create({
      data: {
        userName: 'Ahmad Fauzi (System Admin)',
        role: 'ADMIN',
        action: 'SCHEMA_NORMALIZATION',
        entityType: 'DATABASE_TABLE',
        entityId: 'ticket_milestones',
        description: 'Menghapus tabel usang `principals` dan menormalkan tabel `ticket_milestones` (menghapus kolom denormalisasi actorName & actorRole, beralih penuh ke relasi foreign key actorId -> users.id).',
        ipAddress: '127.0.0.1',
        timestampUtc: new Date()
      }
    });
    console.log('✅ Audit log berhasil dicatat dengan ID:', auditRecord.id);

    // 4. Verifikasi status akhir DB
    const finalCols = await prisma.$queryRawUnsafe('DESCRIBE ticket_milestones;');
    console.log('📋 Kolom terbaru ticket_milestones:', finalCols.map(c => c.Field));

    const finalTables = await prisma.$queryRawUnsafe('SHOW TABLES;');
    console.log('📋 Daftar tabel terbaru:', finalTables.map(t => Object.values(t)[0]));

    console.log('🎉 Eksekusi normalisasi database dan audit log berhasil 100%!');
  } catch (error) {
    console.error('❌ Gagal menjalankan migrasi:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

executeMigration();
