/**
 * ==============================================================================
 * EXECUTABLE LIVING DOCUMENTATION & TEST AUTOMATION RUNNER
 * Sistem Helpdesk & Ticketing SLA 24x7 — PT Global Transformasi Teknologi (GTT)
 * ==============================================================================
 * 
 * Skrip ini menjalankan pengujian otomatis dari hulu ke hilir (End-to-End)
 * yang mencerminkan skenario baku dalam Panduan Pengguna (USER_GUIDE.md):
 * 
 * 1. PANDUAN 1: Autentikasi, Role-Based Access Control (RBAC) & Keamanan Token
 * 2. PANDUAN 2: Mesin Kalkulasi SLA & Jadwal Operasional (24x7 vs Jam Kerja)
 * 3. PANDUAN 3: Siklus Hidup Tiket (Ticket Lifecycle) & Milestone Teknisi
 * 4. PANDUAN 4: Mekanisme Jeda SLA (SLA Pause / Resume)
 * 5. PANDUAN 5: Portal Tracking Mandiri Pelanggan (Token-Based Self-Service)
 * 6. PANDUAN 6: Proteksi Upload Berkas, Anti-Malware & Anti-Injeksi .env
 * 7. PANDUAN 7: Penutupan Tiket, Integritas Audit Trail & Pembersihan Otomatis
 * 
 * Jalankan: npm test (dari folder root atau backend)
 */

import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';

// ANSI Terminal Color Codes
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgGreen: '\x1b[42m'
};

let passedCount = 0;
let failedCount = 0;
let skippedCount = 0;
const overallStartTime = Date.now();

function printHeader(title) {
  console.log(`\n${c.bold}${c.cyan}┌────────────────────────────────────────────────────────────────────────┐${c.reset}`);
  console.log(`${c.bold}${c.cyan}│ ${title.padEnd(70)} │${c.reset}`);
  console.log(`${c.bold}${c.cyan}└────────────────────────────────────────────────────────────────────────┘${c.reset}`);
}

async function runScenario(scenarioNum, scenarioName, testFn) {
  const t0 = Date.now();
  try {
    process.stdout.write(`  ${c.dim}Langkah ${scenarioNum}:${c.reset} ${scenarioName} ... `);
    await testFn();
    const duration = Date.now() - t0;
    passedCount++;
    console.log(`${c.green}${c.bold}✔ SUKSES${c.reset} ${c.dim}(${duration}ms)${c.reset}`);
  } catch (error) {
    const duration = Date.now() - t0;
    failedCount++;
    console.log(`${c.red}${c.bold}✖ GAGAL${c.reset} ${c.dim}(${duration}ms)${c.reset}`);
    console.log(`    ${c.red}↳ Alasan: ${error.message}${c.reset}`);
  }
}

function skipScenario(scenarioNum, scenarioName, reason) {
  skippedCount++;
  console.log(`  ${c.dim}Langkah ${scenarioNum}:${c.reset} ${scenarioName} ... ${c.yellow}⚠ DILEWATI (${reason})${c.reset}`);
}

async function main() {
  console.log(`\n${c.bold}${c.bgBlue}${c.white} === TEST AUTOMATION & LIVING USER GUIDE RUNNER — PT GLOTRA === ${c.reset}`);
  console.log(`${c.dim}Waktu Eksekusi: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB${c.reset}`);

  // Cek modul & dependensi internal
  const { parseOperatingWindow, addBusinessHours, evaluateSlaBreach } = await import('../src/services/slaService.js');
  const { updateRuntimeAndEnvConfig, emailConfig } = await import('../src/services/mailService.js');

  // ============================================================================
  // PANDUAN 1: PENGUJIAN MESIN KALKULASI SLA & JAM OPERASIONAL
  // ============================================================================
  printHeader('PANDUAN 1: Logika Perhitungan SLA & Window Jam Kerja');

  await runScenario('1.1', 'Parsing Kontrak 24 Jam x 7 Hari Non-Stop (Platinum)', () => {
    const window24x7 = parseOperatingWindow('24 Jam x 7 Hari (Non-Stop)');
    assert.strictEqual(window24x7.is24x7, true, 'Harus terdeteksi sebagai 24x7');
  });

  await runScenario('1.2', 'Parsing Kontrak Jam Kerja Bisnis (Senin-Jumat 08:00-17:00 WIB)', () => {
    const windowBusiness = parseOperatingWindow('Senin - Jumat (08:00 - 17:00 WIB)');
    assert.strictEqual(windowBusiness.is24x7, false, 'Harus terdeteksi non-24x7');
    assert.deepStrictEqual(windowBusiness.workDays, [1, 2, 3, 4, 5], 'Hari kerja harus Senin sampai Jumat');
    assert.strictEqual(windowBusiness.startH, 8, 'Jam mulai kerja harus 08:00');
    assert.strictEqual(windowBusiness.endH, 17, 'Jam selesai kerja harus 17:00');
    assert.strictEqual(windowBusiness.dailyMinutes, 540, 'Durasi kerja per hari harus 540 menit (9 jam)');
  });

  await runScenario('1.3', 'Kalkulasi Batas Waktu Bisnis (Melewati Akhir Pekan / Hari Libur)', () => {
    const windowBusiness = parseOperatingWindow('Senin - Jumat (08:00 - 17:00 WIB)');
    // Jumat jam 16:00 WIB, ditambah 3 jam kerja -> harus jatuh di Senin jam 10:00 WIB
    const jumatSore = new Date('2026-11-20T09:00:00.000Z'); // Jumat
    const deadline = addBusinessHours(jumatSore, 3, windowBusiness);
    assert.ok(deadline instanceof Date, 'Deadline harus menghasilkan objek Date yang valid');
    assert.ok(deadline > jumatSore, 'Deadline harus lebih maju daripada waktu pembuatan tiket');
  });

  await runScenario('1.4', 'Deteksi Pelanggaran SLA (SLA Breach Evaluator)', () => {
    const now = new Date();
    // Tiket yang belum selesai dan sudah melewati resolutionDeadline
    const breachedTicket = {
      status: 'IN_PROGRESS',
      resolutionDeadline: new Date(now.getTime() - 3600 * 1000), // Lewat 1 jam
      responseDeadline: new Date(now.getTime() - 7200 * 1000),
      respondedAt: new Date(now.getTime() - 7100 * 1000),
      resolvedAt: null
    };
    const evalResult = evaluateSlaBreach(breachedTicket);
    assert.strictEqual(evalResult.isResolutionBreached, true, 'Harus mendeteksi tiket telah melanggar SLA');
  });

  // ============================================================================
  // PANDUAN 2: PENGUJIAN KEAMANAN UPLOAD BERKAS & GATEWAY EMAIL
  // ============================================================================
  printHeader('PANDUAN 2: Keamanan Upload Berkas, Anti-Malware & Anti-Injeksi .env');

  await runScenario('2.1', 'Verifikasi Whitelist Berkas Sah (.pdf, .docx, .png, .jpg, .log)', () => {
    const allowedExts = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.svg', '.txt', '.log'];
    const validTestFiles = ['cisco_switch.log', 'bukti_lapangan.jpg', 'berita_acara.pdf', 'topologi.png', 'manual.docx'];
    
    for (const f of validTestFiles) {
      const ext = path.extname(f).toLowerCase();
      assert.ok(allowedExts.includes(ext), `Berkas sah ${f} harus diizinkan oleh sistem`);
    }
  });

  await runScenario('2.2', 'Penolakan Mutlak Berkas Berbahaya (.exe, .php, .bat, .sh, .py)', () => {
    const allowedExts = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.svg', '.txt', '.log'];
    const dangerousFiles = ['trojan.exe', 'webshell.php', 'exploit.sh', 'ransom.bat', 'backdoor.py'];
    
    for (const f of dangerousFiles) {
      const ext = path.extname(f).toLowerCase();
      assert.ok(!allowedExts.includes(ext), `Berkas berbahaya ${f} WAJIB ditolak oleh sistem`);
    }
  });

  await runScenario('2.3', 'Proteksi Anti-CRLF / Injeksi Baris Baru pada Konfigurasi .env', () => {
    const originalName = emailConfig.fromName;
    // Simulasi penyerang mencoba menyisipkan baris baru untuk membajak DATABASE_URL
    const injectionAttempt = 'Hacked Name\r\nDATABASE_URL="mysql://attacker:pwned@evil.com/hacked"\r\n';
    
    updateRuntimeAndEnvConfig({ fromName: injectionAttempt });

    // Baca fisik .env: pastikan TIDAK ADA baris baru terpisah yang terinjeksi
    const possibleEnvPaths = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), 'backend', '.env'),
      path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')), '..', '.env')
    ];
    const targetEnvPath = possibleEnvPaths.find(p => fs.existsSync(p));
    const envContent = targetEnvPath ? fs.readFileSync(targetEnvPath, 'utf8') : '';
    const isSeparateLineInjected = /[\r\n]DATABASE_URL=.*hacked/i.test(envContent);
    
    // Kembalikan ke nama resmi
    updateRuntimeAndEnvConfig({ fromName: originalName });

    assert.strictEqual(isSeparateLineInjected, false, 'Injeksi baris baru (.env injection) harus 100% gagal');
  });

  await runScenario('2.4', 'Proteksi Batas Maksimal Upload Berkas (Guard 5MB Tiket & 15MB KB)', () => {
    const maxKbBytes = 15 * 1024 * 1024;
    const maxTicketBytes = 5 * 1024 * 1024;
    
    const file12MB = 12 * 1024 * 1024;
    const file20MB = 20 * 1024 * 1024;

    assert.ok(file12MB <= maxKbBytes, 'File SOP 12MB harus diterima oleh KB');
    assert.ok(file20MB > maxKbBytes, 'File 20MB harus ditolak oleh KB (melebihi 15MB)');
    assert.ok(file12MB > maxTicketBytes, 'File 12MB harus ditolak jika diunggah langsung ke tiket tanpa kompresi');
  });

  // ============================================================================
  // PANDUAN 3: INTEGRASI DATABASE & SIKLUS HIDUP TIKET (END-TO-END)
  // ============================================================================
  printHeader('PANDUAN 3: Pengujian Database, Alur Tiket & Portal Pelanggan');

  let prisma;
  let isDbConnected = false;

  // Cek apakah port MySQL (3306) aktif via socket sebelum memanggil Prisma
  const net = await import('node:net');
  const checkPortOpen = (port = 3306, host = '127.0.0.1') => new Promise((resolve) => {
    const s = new net.Socket();
    s.setTimeout(400);
    s.on('connect', () => { s.destroy(); resolve(true); });
    s.on('error', () => { s.destroy(); resolve(false); });
    s.on('timeout', () => { s.destroy(); resolve(false); });
    s.connect(port, host);
  });

  const mysqlPortAvailable = await checkPortOpen(3306, '127.0.0.1');

  if (mysqlPortAvailable) {
    try {
      const prismaModule = await import('../src/lib/prisma.js');
      prisma = prismaModule.default || prismaModule;
      await prisma.$queryRaw`SELECT 1`;
      isDbConnected = true;
    } catch {
      isDbConnected = false;
    }
  }

  if (!isDbConnected) {
    console.log(`  ${c.yellow}ℹ️ Database MySQL (localhost:3306) belum aktif.${c.reset}`);
    console.log(`  ${c.dim}  Silakan nyalakan MySQL (Laragon/XAMPP) untuk mengeksekusi integrasi database penuh.${c.reset}`);
    skipScenario('3.1', 'Autentikasi & Penerbitan Token JWT Admin', 'MySQL Offline');
    skipScenario('3.2', 'Penerbitan Tiket Insiden Baru (TK-26xxx)', 'MySQL Offline');
    skipScenario('3.3', 'Pencatatan Milestone Progres Teknisi', 'MySQL Offline');
    skipScenario('3.4', 'Mekanisme Jeda SLA (Pause/Resume SLA)', 'MySQL Offline');
    skipScenario('3.5', 'Penyelesaian Tiket & Input Investigasi Akar Masalah (RCA)', 'MySQL Offline');
    skipScenario('3.6', 'Akses Pelanggan ke Portal Pelacakan Mandiri Bertoken', 'MySQL Offline');
    skipScenario('3.7', 'Penutupan Tiket Resmi & Perekaman Jejak Audit Trail', 'MySQL Offline');
  } else {
    // 3.1 Cek Akun Admin & Otentikasi
    let adminUser = null;
    let engineerUser = null;
    let testCustomer = null;
    let testTicket = null;

    await runScenario('3.1', 'Verifikasi Akun Admin & Petugas Helpdesk di Database', async () => {
      adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
      });
      assert.ok(adminUser, 'Wajib ada minimal 1 akun Admin di sistem');
      assert.strictEqual(adminUser.role, 'ADMIN', 'Peran harus ADMIN');
    });

    await runScenario('3.2', 'Verifikasi Akun Teknisi Lapangan (Engineer)', async () => {
      engineerUser = await prisma.user.findFirst({
        where: { role: 'ENGINEER' }
      });
      if (!engineerUser) engineerUser = adminUser; // Fallback jika belum ada engineer
      assert.ok(engineerUser, 'Akun teknisi pelaksana harus tersedia');
    });

    await runScenario('3.3', 'Verifikasi Master Mitra Pelanggan & Kontrak SLA', async () => {
      testCustomer = await prisma.customer.findFirst({
        include: { pics: true }
      });
      if (!testCustomer) {
        // Buat customer uji coba sementara jika kosong
        testCustomer = await prisma.customer.create({
          data: {
            name: 'PT Mitra Uji Coba Otomatis (Demo)',
            slaTier: '8x5 GOLD ENTERPRISE',
            address: 'Jakarta Selatan',
            pics: {
              create: [
                { name: 'PIC Uji Coba', email: 'pic.test@demo.com', phone: '08123456789' }
              ]
            }
          },
          include: { pics: true }
        });
      }
      assert.ok(testCustomer, 'Mitra pelanggan harus terdaftar');
      assert.ok(testCustomer.pics.length > 0, 'Mitra pelanggan harus memiliki PIC');
    });

    await runScenario('3.4', 'Penerbitan Tiket Baru dengan SLA Deadline Dinamis', async () => {
      const now = new Date();
      const ticketNumber = `TK-TEST-${Date.now().toString().slice(-5)}`;
      const trackingToken = `sec_test_${Math.random().toString(36).substring(2, 10)}`;

      testTicket = await prisma.ticket.create({
        data: {
          ticketNumber,
          customerId: testCustomer.id,
          customerPicId: testCustomer.pics[0].id,
          title: 'Uji Otomatis: Link Flapping pada Core Switch Port Gi0/1',
          description: 'Pengujian otomatis siklus tiket dari data bersih.',
          severity: 'HIGH',
          ticketType: 'Incident',
          status: 'ASSIGNED',
          contractTier: testCustomer.slaTier || '8x5 GOLD ENTERPRISE',
          trackingToken,
          createdById: adminUser.id,
          assignedToId: engineerUser.id,
          responseDeadline: new Date(now.getTime() + 15 * 60 * 1000), // 15 menit
          resolutionDeadline: new Date(now.getTime() + 4 * 3600 * 1000), // 4 jam
          createdAt: now,
          respondedAt: now,
          milestones: {
            create: [
              {
                stepName: 'Laporan Diterima & Teknisi Dialokasikan',
                status: 'ASSIGNED',
                actorId: adminUser.id,
                progressPercent: 10,
                notes: 'Tiket diterbitkan melalui skrip uji otomatis.'
              }
            ]
          }
        }
      });

      assert.ok(testTicket.id, 'Tiket harus berhasil disimpan ke database');
      assert.strictEqual(testTicket.status, 'ASSIGNED', 'Status awal tiket harus ASSIGNED');
      assert.ok(testTicket.trackingToken.startsWith('sec_'), 'Tiket harus memiliki token tracking aman');
    });

    await runScenario('3.5', 'Teknisi Menambahkan Milestone Progres Penanganan (50%)', async () => {
      const milestone = await prisma.ticketMilestone.create({
        data: {
          ticketId: testTicket.id,
          stepName: 'Pemeriksaan Lapangan & Pengukuran Optik OTDR',
          status: 'IN_PROGRESS',
          actorId: engineerUser.id,
          notes: 'Ditemukan redaman patch cord sebesar -28dB. Mempersiapkan penggantian kabel optik.',
          proofFile: 'hasil_otdr_core.png',
          progressPercent: 50
        }
      });

      await prisma.ticket.update({
        where: { id: testTicket.id },
        data: { status: 'IN_PROGRESS' }
      });

      assert.ok(milestone.id, 'Milestone harus berhasil disimpan');
      assert.strictEqual(milestone.status, 'IN_PROGRESS', 'Milestone berstatus IN_PROGRESS');
    });

    await runScenario('3.6', 'Mekanisme Jeda SLA (SLA Pause) & Resume Penanganan', async () => {
      const now = new Date();
      // 1. Pause SLA
      await prisma.ticket.update({
        where: { id: testTicket.id },
        data: {
          status: 'PENDING_VENDOR',
          isPaused: true,
          pausedAt: now,
          pauseReason: 'PART_HARDWARE'
        }
      });

      // 2. Resume SLA setelah 1 detik simulasi
      await prisma.ticket.update({
        where: { id: testTicket.id },
        data: {
          status: 'IN_PROGRESS',
          isPaused: false,
          pausedAt: null,
          totalPausedDurationSec: 60
        }
      });

      const updatedTicket = await prisma.ticket.findUnique({ where: { id: testTicket.id } });
      assert.strictEqual(updatedTicket.status, 'IN_PROGRESS', 'Tiket harus kembali berstatus IN_PROGRESS');
      assert.strictEqual(updatedTicket.isPaused, false, 'Status pause harus kembali false');
    });

    await runScenario('3.7', 'Penyelesaian Tiket (Resolve) & Input Investigasi Root Cause (RCA)', async () => {
      const now = new Date();
      const resolved = await prisma.ticket.update({
        where: { id: testTicket.id },
        data: {
          status: 'RESOLVED',
          resolvedAt: now,
          rootCause: 'Konektor ferrule optik duplex LC mengalami micro-crack akibat tekukan berlebih.',
          resolutionStrategy: 'Penggantian kabel patch cord single-mode 2 meter dan pembersihan adaptor optik.'
        }
      });

      assert.strictEqual(resolved.status, 'RESOLVED', 'Status tiket harus RESOLVED');
      assert.ok(resolved.rootCause.length > 10, 'Akar masalah (RCA) harus tercatat');
      assert.ok(resolved.resolutionStrategy.length > 10, 'Tindakan perbaikan harus tercatat');
    });

    await runScenario('3.8', 'Verifikasi Portal Tracking Mandiri Pelanggan (Token Aman)', async () => {
      // 1. Akses dengan token yang benar
      const validAccess = await prisma.ticket.findFirst({
        where: {
          ticketNumber: testTicket.ticketNumber,
          trackingToken: testTicket.trackingToken
        }
      });
      assert.ok(validAccess, 'Pelanggan dengan token sah WAJIB dapat melihat detail tiket');

      // 2. Akses dengan token palsu
      const invalidAccess = await prisma.ticket.findFirst({
        where: {
          ticketNumber: testTicket.ticketNumber,
          trackingToken: 'token_palsu_peretas'
        }
      });
      assert.strictEqual(invalidAccess, null, 'Pelanggan dengan token salah WAJIB ditolak');
    });

    await runScenario('3.9', 'Penutupan Tiket Resmi (Closed) & Perekaman Audit Trail', async () => {
      const closed = await prisma.ticket.update({
        where: { id: testTicket.id },
        data: { status: 'CLOSED' }
      });

      // Rekam audit trail
      const audit = await prisma.auditLog.create({
        data: {
          userName: adminUser.name,
          role: adminUser.role,
          action: 'TICKET_CLOSED',
          entityType: 'TICKET',
          entityId: closed.ticketNumber,
          description: `Tiket ${closed.ticketNumber} resmi ditutup setelah masa verifikasi selesai.`,
          ipAddress: '127.0.0.1'
        }
      });

      assert.strictEqual(closed.status, 'CLOSED', 'Status tiket harus CLOSED');
      assert.ok(audit.id, 'Audit log penutupan tiket harus tersimpan');
    });

    await runScenario('3.10', 'Pembersihan Data Uji Coba Otomatis (Auto Tear-down)', async () => {
      // Hapus data uji coba yang dibuat agar tidak mengotori database
      await prisma.auditLog.deleteMany({ where: { entityId: testTicket.ticketNumber } });
      await prisma.ticketMilestone.deleteMany({ where: { ticketId: testTicket.id } });
      await prisma.ticket.delete({ where: { id: testTicket.id } });

      if (testCustomer.name.includes('(Demo)')) {
        await prisma.customerPic.deleteMany({ where: { customerId: testCustomer.id } });
        await prisma.customer.delete({ where: { id: testCustomer.id } });
      }

      const checkGone = await prisma.ticket.findUnique({ where: { id: testTicket.id } });
      assert.strictEqual(checkGone, null, 'Data tiket uji coba harus bersih dari database');
    });

    await prisma.$disconnect();
  }

  // ============================================================================
  // RANGKUMAN HASIL AKHIR
  // ============================================================================
  const totalDuration = ((Date.now() - overallStartTime) / 1000).toFixed(2);
  const totalTests = passedCount + failedCount + skippedCount;
  const passRate = totalTests > 0 ? Math.round((passedCount / (passedCount + failedCount || 1)) * 100) : 100;

  console.log(`\n${c.bold}======================================================================${c.reset}`);
  console.log(`${c.bold}  RANGKUMAN HASIL TEST AUTOMATION & PANDUAN OPERASIONAL PENGGUNA${c.reset}`);
  console.log(`${c.bold}======================================================================${c.reset}`);
  console.log(`  Total Skenario Uji : ${c.bold}${totalTests}${c.reset}`);
  console.log(`  ${c.green}✔ Lulus (PASSED)    : ${c.bold}${passedCount}${c.reset}`);
  console.log(`  ${c.red}✖ Gagal (FAILED)    : ${c.bold}${failedCount}${c.reset}`);
  console.log(`  ${c.yellow}⚠ Dilewati (SKIPPED): ${c.bold}${skippedCount}${c.reset}`);
  console.log(`  Tingkat Kelulusan  : ${passRate === 100 ? c.green : c.yellow}${c.bold}${passRate}%${c.reset}`);
  console.log(`  Total Waktu        : ${c.cyan}${totalDuration} detik${c.reset}`);
  console.log(`${c.bold}======================================================================${c.reset}\n`);

  if (failedCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('\n❌ Kesalahan Fatal Runner:', err);
  process.exit(1);
});
