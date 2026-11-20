import prisma from '../lib/prisma.js';

const DAY_INDEX = {
  'minggu': 0, 'sun': 0, 'sunday': 0,
  'senin': 1, 'mon': 1, 'monday': 1,
  'selasa': 2, 'tue': 2, 'tuesday': 2,
  'rabu': 3, 'wed': 3, 'wednesday': 3,
  'kamis': 4, 'thu': 4, 'thursday': 4,
  'jumat': 5, "jum'at": 5, 'fri': 5, 'friday': 5,
  'sabtu': 6, 'sat': 6, 'saturday': 6
};

/**
 * Parse human-readable operating window string into structured configuration
 * Format baku: "Senin - Jumat (08:00 - 17:00 WIB)" atau "24 Jam x 7 Hari (Non-Stop)"
 */
export function parseOperatingWindow(str) {
  if (!str) return { is24x7: true };
  const lower = str.toLowerCase();
  if (lower.includes('24') || lower.includes('non-stop') || lower.includes('nonstop') || lower.includes('7 hari')) {
    return { is24x7: true };
  }

  // Regex matches: "Senin - Jumat (08:00 - 17:00 WIB)"
  const match = str.match(/([a-zA-Z]+)\s*-\s*([a-zA-Z]+)\s*\(([\d]{1,2})[:.]([\d]{2})\s*-\s*([\d]{1,2})[:.]([\d]{2})/i);
  if (!match) {
    return { is24x7: true };
  }

  const startDayName = match[1].toLowerCase();
  const endDayName = match[2].toLowerCase();
  const startH = parseInt(match[3], 10);
  const startM = parseInt(match[4], 10);
  const endH = parseInt(match[5], 10);
  const endM = parseInt(match[6], 10);

  const startDayIdx = DAY_INDEX[startDayName] ?? 1;
  const endDayIdx = DAY_INDEX[endDayName] ?? 5;

  const workDays = [];
  if (startDayIdx <= endDayIdx) {
    for (let d = startDayIdx; d <= endDayIdx; d++) workDays.push(d);
  } else {
    for (let d = startDayIdx; d <= 6; d++) workDays.push(d);
    for (let d = 0; d <= endDayIdx; d++) workDays.push(d);
  }

  return {
    is24x7: false,
    workDays,
    startH,
    startM,
    endH,
    endM,
    startMinutes: startH * 60 + startM,
    endMinutes: endH * 60 + endM,
    dailyMinutes: (endH * 60 + endM) - (startH * 60 + startM)
  };
}

/**
 * Majukan waktu ke awal jam operasional berikutnya jika waktu saat ini berada di luar operating window
 */
export function advanceToNextWindow(date, config) {
  if (config.is24x7) return new Date(date);

  let current = new Date(date);

  for (let i = 0; i < 14; i++) { // search up to 2 weeks ahead
    const day = current.getDay();
    const curMinutes = current.getHours() * 60 + current.getMinutes();
    const isWorkDay = config.workDays.includes(day);

    if (isWorkDay) {
      if (curMinutes < config.startMinutes) {
        // Sebelum jam buka hari ini -> mulai tepat saat jam buka hari ini
        current.setHours(config.startH, config.startM, 0, 0);
        return current;
      }
      if (curMinutes >= config.startMinutes && curMinutes < config.endMinutes) {
        // Sedang berada di dalam jam operasional aktif
        return current;
      }
    }

    // Jika sudah lewat jam tutup atau hari libur -> majukan ke hari berikutnya
    current.setDate(current.getDate() + 1);
    current.setHours(config.startH, config.startM, 0, 0);
  }

  return current;
}

/**
 * Menambahkan jam SLA hanya pada jam operasional kerja aktif (melompati malam hari dan hari libur)
 */
export function addBusinessHours(startDate, hoursToAdd, config) {
  if (config.is24x7) {
    return new Date(startDate.getTime() + hoursToAdd * 3600 * 1000);
  }

  let current = advanceToNextWindow(startDate, config);
  let remainingMinutes = Math.round(hoursToAdd * 60);

  while (remainingMinutes > 0) {
    const curMinutes = current.getHours() * 60 + current.getMinutes();
    const availableToday = config.endMinutes - curMinutes;

    if (remainingMinutes <= availableToday) {
      current = new Date(current.getTime() + remainingMinutes * 60000);
      remainingMinutes = 0;
    } else {
      remainingMinutes -= availableToday;
      // Pindah ke awal jam kerja hari kerja berikutnya
      current.setDate(current.getDate() + 1);
      current.setHours(config.startH, config.startM, 0, 0);
      current = advanceToNextWindow(current, config);
    }
  }

  return current;
}

export async function calculateSlaDeadlines({ customerId, severity = 'MEDIUM', createdAt = new Date() }) {
  // 1. Fetch customer with SLA tier
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) }
  });

  const slaTier = customer?.slaTier || '8x5 GOLD ENTERPRISE';
  
  // 2. Fetch or match corresponding SLA policy
  let policy = await prisma.slaPolicy.findFirst({
    where: {
      OR: [
        { tierName: slaTier },
        { tierName: { contains: slaTier } }
      ]
    }
  });

  if (!policy) {
    const upper = slaTier.toUpperCase();
    let keyword = 'GOLD';
    if (upper.includes('PLATINUM')) keyword = 'PLATINUM';
    else if (upper.includes('SILVER')) keyword = 'SILVER';
    else if (upper.includes('GOV')) keyword = 'GOV';

    policy = await prisma.slaPolicy.findFirst({
      where: {
        tierName: { contains: keyword }
      }
    });
  }

  let respHours = 1.0;
  let resHours = 8.0;

  if (policy) {
    if (severity === 'HIGH') {
      respHours = policy.p1ResponseHours;
      resHours = policy.p1ResolutionHours;
    } else if (severity === 'MEDIUM') {
      respHours = policy.p2ResponseHours;
      resHours = policy.p2ResolutionHours;
    } else if (severity === 'LOW') {
      respHours = policy.p3ResponseHours || policy.p4ResponseHours || 4.0;
      resHours = policy.p3ResolutionHours || policy.p4ResolutionHours || 24.0;
    } else {
      respHours = policy.p4ResponseHours || 4.0;
      resHours = policy.p4ResolutionHours || 72.0;
    }
  } else {
    // Default fallback
    respHours = severity === 'HIGH' ? 0.5 : severity === 'MEDIUM' ? 1.0 : 2.0;
    resHours = severity === 'HIGH' ? 4.0 : severity === 'MEDIUM' ? 8.0 : 16.0;
  }

  const operatingHoursStr = policy?.operatingHours || '24 Jam x 7 Hari (Non-Stop)';
  const windowConfig = parseOperatingWindow(operatingHoursStr);

  const effectiveStart = advanceToNextWindow(createdAt, windowConfig);
  const isOutsideOperatingWindow = effectiveStart.getTime() > createdAt.getTime();

  // Hitung deadline respon dan resolusi berbasis jam operasional aktif
  const responseDeadline = addBusinessHours(createdAt, respHours, windowConfig);
  const resolutionDeadline = addBusinessHours(createdAt, resHours, windowConfig);

  return {
    contractTier: customer?.slaTier || '8x5 GOLD ENTERPRISE',
    operatingHours: operatingHoursStr,
    isOutsideOperatingWindow,
    effectiveStartTime: effectiveStart,
    responseDeadline,
    resolutionDeadline,
    respHours,
    resHours
  };
}

export function evaluateSlaBreach(ticket) {
  const now = new Date();
  let isResponseBreached = ticket.isSlaResponseBreached;
  let isResolutionBreached = ticket.isSlaResolutionBreached;

  if (!ticket.respondedAt && ticket.responseDeadline) {
    isResponseBreached = now > new Date(ticket.responseDeadline);
  }

  if (!ticket.resolvedAt && ticket.resolutionDeadline && !ticket.isPaused) {
    isResolutionBreached = now > new Date(ticket.resolutionDeadline);
  }

  return {
    isResponseBreached,
    isResolutionBreached
  };
}
