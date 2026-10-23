// Date and Time Helper Functions (Ensuring UTC+0 standard with Local WIB display)

export function formatUtcToLocal(utcDateString) {
  const fallback = {
    local: '-',
    utc: '-',
    full: '-',
    iso: ''
  };
  if (!utcDateString) return fallback;

  const date = new Date(utcDateString);
  if (isNaN(date.getTime())) {
    const str = String(utcDateString);
    return {
      local: str,
      utc: str,
      full: str,
      iso: ''
    };
  }

  try {
    // Format as Indonesian standard (WIB: GMT+7)
    const localFormatted = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date);

    // Format the exact UTC string for tooltip or reference
    const utcHours = String(date.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(date.getUTCMinutes()).padStart(2, '0');
    const utcFormatted = `${utcHours}:${utcMinutes} UTC`;

    return {
      local: `${localFormatted} WIB`,
      utc: utcFormatted,
      full: `${localFormatted} WIB (${utcFormatted})`,
      iso: date.toISOString()
    };
  } catch (err) {
    return fallback;
  }
}

export function calculateSlaCountdown(deadlineUtc, isPaused = false, resolvedAtUtc = null) {
  if (!deadlineUtc) return { label: '-', status: 'NORMAL', percentage: 0, isBreached: false };

  const deadline = new Date(deadlineUtc);
  if (isNaN(deadline.getTime())) {
    return { label: '-', status: 'NORMAL', percentage: 0, isBreached: false };
  }

  const now = new Date();
  
  // If resolved, calculate using resolvedAt time
  const targetTime = resolvedAtUtc ? new Date(resolvedAtUtc) : now;
  const diffMs = deadline - targetTime;
  const isBreached = diffMs < 0;

  const totalMinutes = Math.abs(Math.floor(diffMs / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let label = '';
  if (resolvedAtUtc) {
    label = isBreached 
      ? `Terlambat ${hours}j ${minutes}m saat selesai` 
      : `Tuntas (${hours}j ${minutes}m sisa waktu)`;
  } else if (isPaused) {
    label = `DITAHAN (Sisa ${hours}j ${minutes}m)`;
  } else {
    label = isBreached 
      ? `Lewat SLA (${hours}j ${minutes}m)` 
      : `${hours}j ${minutes}m tersisa`;
  }

  let status = 'SAFE';
  if (isBreached) {
    status = 'BREACHED';
  } else if (isPaused) {
    status = 'PAUSED';
  } else if (totalMinutes < 60) {
    status = 'WARNING'; // Kurang dari 1 jam
  }

  return {
    label,
    hours,
    minutes,
    status,
    isBreached,
    isPaused
  };
}
