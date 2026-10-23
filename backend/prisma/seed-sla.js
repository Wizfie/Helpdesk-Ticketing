import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedSla() {
  const count = await prisma.slaPolicy.count();
  if (count > 0) {
    console.log(`SLA policies already exist (${count}). Skipping seed.`);
    return;
  }

  const policies = [
    {
      tierCode: 'PLATINUM_24X7',
      tierName: 'Platinum 24x7 Mission Critical',
      operatingHours: '24 Jam x 7 Hari (Non-Stop)',
      p1ResponseHours: 0.5,
      p1ResolutionHours: 4,
      p2ResponseHours: 1,
      p2ResolutionHours: 8,
      p3ResponseHours: 2,
      p3ResolutionHours: 24,
      p4ResponseHours: 4,
      p4ResolutionHours: 72,
      notes: '2.5% Rebate / 1h Breach (Maksimal 15%)'
    },
    {
      tierCode: 'GOLD_8X5',
      tierName: 'Enterprise 8x5 Gold Standard',
      operatingHours: 'Senin - Jumat (08:00 - 17:00 WIB)',
      p1ResponseHours: 1,
      p1ResolutionHours: 8,
      p2ResponseHours: 2,
      p2ResolutionHours: 16,
      p3ResponseHours: 4,
      p3ResolutionHours: 48,
      p4ResponseHours: 8,
      p4ResolutionHours: 120,
      notes: '1.5% Service Credit / Breach'
    },
    {
      tierCode: 'GOV_TIER1',
      tierName: 'Government 8x5 Tier-1 Dedicated',
      operatingHours: 'Senin - Jumat (07:30 - 16:30 WIB)',
      p1ResponseHours: 1,
      p1ResolutionHours: 12,
      p2ResponseHours: 2,
      p2ResolutionHours: 24,
      p3ResponseHours: 4,
      p3ResolutionHours: 72,
      p4ResponseHours: 8,
      p4ResolutionHours: 168,
      notes: 'Pinalti Keterlambatan SP-1 sesuai regulasi BAST'
    },
    {
      tierCode: 'SILVER_8X5',
      tierName: 'Standard Silver Managed Care',
      operatingHours: 'Senin - Jumat (08:00 - 17:00 WIB)',
      p1ResponseHours: 2,
      p1ResolutionHours: 24,
      p2ResponseHours: 4,
      p2ResolutionHours: 48,
      p3ResponseHours: 8,
      p3ResolutionHours: 120,
      p4ResponseHours: 16,
      p4ResolutionHours: 240,
      notes: 'Tinjauan Kontrak Triwulan'
    }
  ];

  for (const p of policies) {
    await prisma.slaPolicy.create({ data: p });
  }
  console.log(`Berhasil menyimpan ${policies.length} kebijakan SLA ke database.`);
}

seedSla()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
