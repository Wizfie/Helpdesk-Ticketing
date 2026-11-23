import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Runtime in-memory email configuration (initialized from process.env)
export const emailConfig = {
  platform: process.env.EMAIL_PLATFORM || 'gmail',
  driver: process.env.EMAIL_DRIVER || 'smtp',
  fromName: process.env.EMAIL_FROM_NAME || 'PT Global Transformasi Teknologi (No-Reply)',
  fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@gtteknologi.com',
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'false' ? false : true,
    user: process.env.SMTP_USER || process.env.GMAIL_USER || 'wiz.fie@gmail.com',
    pass: (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || 'lirh vxnb xnda panw').replace(/\s+/g, ''),
  },
  gmail: {
    user: process.env.GMAIL_USER || 'wiz.fie@gmail.com',
    pass: (process.env.GMAIL_APP_PASS || 'lirh vxnb xnda panw').replace(/\s+/g, ''),
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  },
  sumopod: {
    host: process.env.SUMOPOD_SMTP_HOST || 'smtp.sumopod.com',
    port: Number(process.env.SUMOPOD_SMTP_PORT) || 465,
    user: process.env.SUMOPOD_SMTP_USER || '',
    pass: process.env.SUMOPOD_SMTP_PASS || '',
  }
};

/**
 * Buat transporter Nodemailer berdasarkan konfigurasi Universal SMTP
 */
async function createTransporter(driver = emailConfig.driver) {
  let nodemailer;
  try {
    const imported = await import('nodemailer');
    nodemailer = imported.default || imported;
  } catch (err) {
    throw new Error('Modul nodemailer belum terpasang di backend. Silakan jalankan: npm install nodemailer di folder backend, atau gunakan Mode Simulator untuk pengujian.');
  }

  // Jika platform Gmail atau host smtp.gmail.com
  const isGmail = emailConfig.platform === 'gmail' || emailConfig.smtp.host === 'smtp.gmail.com' || driver === 'gmail';
  if (isGmail) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.smtp.user || emailConfig.gmail?.user,
        pass: (emailConfig.smtp.pass || emailConfig.gmail?.pass || '').replace(/\s+/g, '')
      }
    });
  }

  // Universal SMTP untuk platform apapun (Sumopod, SendGrid, Office 365, Brevo, Corporate GTT, cPanel, dll)
  return nodemailer.createTransport({
    host: emailConfig.smtp.host,
    port: Number(emailConfig.smtp.port) || 587,
    secure: emailConfig.smtp.secure === true || Number(emailConfig.smtp.port) === 465,
    auth: {
      user: emailConfig.smtp.user,
      pass: emailConfig.smtp.pass
    },
    tls: {
      rejectUnauthorized: false // Memastikan kompatibel dengan seluruh mail server publik maupun server internal korporat
    }
  });
}

/**
 * Kirim email via Resend REST API (Native Fetch, tidak butuh SDK tambahan)
 */
async function sendViaResend({ to, subject, html, text }) {
  if (!emailConfig.resend.apiKey) {
    throw new Error('API Key Resend belum dikonfigurasi di pengaturan.');
  }

  const from = `${emailConfig.fromName} <${emailConfig.fromAddress}>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${emailConfig.resend.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Resend error status ${response.status}`);
  }

  return { messageId: data.id, provider: 'resend' };
}

/**
 * Eksekusi pengiriman email utama dengan dukungan Universal SMTP Gateway
 */
export async function sendMail({ to, subject, html, text, driverOverride = null }) {
  const activeDriver = driverOverride || (emailConfig.platform === 'mock' ? 'mock' : emailConfig.driver);
  const from = `"${emailConfig.fromName}" <${emailConfig.fromAddress}>`;

  // 1. Mode Mock / Simulator (Development tanpa internet)
  if (activeDriver === 'mock' || emailConfig.platform === 'mock' || activeDriver === 'simulator') {
    console.log(`📨 [Mail Simulator / Mock] To: ${to} | Subject: ${subject}`);
    return {
      success: true,
      provider: 'mock',
      platform: 'Mode Simulator (Pengujian Lokal)',
      messageId: `mock-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }

  // 2. Mode Failover (Coba Resend -> Sumopod -> SMTP)
  if (activeDriver === 'failover') {
    const candidateDrivers = [];
    if (emailConfig.resend?.apiKey) candidateDrivers.push('resend');
    if (emailConfig.sumopod?.user && emailConfig.sumopod?.pass) candidateDrivers.push('sumopod');
    if (emailConfig.smtp?.user && emailConfig.smtp?.pass) candidateDrivers.push('smtp');

    if (candidateDrivers.length === 0) {
      candidateDrivers.push('smtp');
    }

    const errors = [];
    for (const driver of candidateDrivers) {
      try {
        console.log(`🔄 [Mail Failover] Mencoba mengirim via ${driver}...`);
        const result = await sendMail({ to, subject, html, text, driverOverride: driver });
        return { ...result, failoverHistory: errors };
      } catch (err) {
        console.warn(`⚠️ [Mail Failover] Gagal via ${driver}: ${err.message}. Mencoba provider berikutnya...`);
        errors.push({ driver, error: err.message });
      }
    }

    throw new Error(`Semua provider failover gagal mengirim email: ${errors.map(e => `${e.driver} (${e.error})`).join(', ')}`);
  }

  // 3. Pengiriman spesifik Resend (REST API jika diperlukan)
  if (activeDriver === 'resend' && emailConfig.resend?.apiKey) {
    const res = await sendViaResend({ to, subject, html, text });
    return { success: true, provider: 'resend', messageId: res.messageId, timestamp: new Date().toISOString() };
  }

  // 4. Pengiriman via Universal SMTP (Standar untuk seluruh platform: Gmail, M365, Cloud, Custom SMTP)
  const transporter = await createTransporter(activeDriver);
  if (!transporter) {
    throw new Error(`Driver email tidak valid: ${activeDriver}`);
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text: text || html.replace(/<[^>]+>/g, ''),
    html
  });

  return {
    success: true,
    provider: emailConfig.platform || activeDriver,
    messageId: info.messageId,
    timestamp: new Date().toISOString()
  };
}

/**
 * Uji coba koneksi dan kirim email test
 */
export async function testEmailConnection(targetEmail, driver = null) {
  const chosenDriver = driver || (emailConfig.platform === 'mock' ? 'mock' : emailConfig.driver);
  const platformLabel = {
    gmail: 'Google Workspace / Gmail',
    office365: 'Microsoft 365 / Outlook',
    cloud: 'Cloud Relay (SendGrid / Brevo / Resend)',
    custom: 'Server SMTP Korporat GTT',
    mock: 'Simulator (Pengujian Lokal)'
  }[emailConfig.platform] || (emailConfig.platform ? emailConfig.platform.toUpperCase() : 'UNIVERSAL SMTP');

  const subject = `[Glotra Helpdesk] Uji Coba Pengiriman Universal Email Gateway (${platformLabel})`;
  
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 24px; color: #ffffff; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">PT Global Transformasi Teknologi</h2>
        <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">ITSM Enterprise Helpdesk & SLA Ticketing Platform</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px; color: #166534; font-size: 15px; font-weight: 700;">✅ Tes Koneksi Email Gateway Berhasil!</h4>
          <p style="margin: 0; font-size: 13px; color: #15803d;">
            Email ini mengonfirmasi bahwa integrasi sistem notifikasi tiket helpdesk menggunakan <strong>Universal Mail Gateway (${platformLabel})</strong> telah berhasil terhubung dan siap beroperasi.
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; width: 140px;">Platform Aktif:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${platformLabel}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Host & Port Server:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${emailConfig.smtp.host}:${emailConfig.smtp.port} (${emailConfig.smtp.secure ? 'SSL' : 'TLS/STARTTLS'})</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Pengirim Resmi:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${emailConfig.fromName} (${emailConfig.fromAddress})</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b;">Waktu Pengujian:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</td>
          </tr>
        </table>
        <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
          Pesan ini dikirim secara otomatis oleh modul Universal Email Gateway Helpdesk Glotra Technology.
        </p>
      </div>
    </div>
  `;

  return await sendMail({
    to: targetEmail,
    subject,
    html,
    driverOverride: chosenDriver
  });
}

/**
 * Ambil konfigurasi publik (password/API key disembunyikan untuk keamanan)
 */
export function getMaskedConfig() {
  const isConfigured = !!((emailConfig.smtp?.user || emailConfig.gmail?.user) && (emailConfig.smtp?.pass || emailConfig.gmail?.pass));
  return {
    platform: emailConfig.platform || 'gmail',
    driver: emailConfig.driver || 'smtp',
    fromName: emailConfig.fromName,
    fromAddress: emailConfig.fromAddress,
    host: emailConfig.smtp.host || 'smtp.gmail.com',
    port: Number(emailConfig.smtp.port) || 465,
    secure: emailConfig.smtp.secure !== false,
    user: emailConfig.smtp.user || emailConfig.gmail?.user || '',
    isConfigured,
    passMasked: (emailConfig.smtp.pass || emailConfig.gmail?.pass) ? '••••••••••••••••' : '',
    // Objek kompatibilitas mundur
    smtp: {
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      user: emailConfig.smtp.user,
      isConfigured,
      passMasked: emailConfig.smtp.pass ? '••••••••••••••••' : ''
    },
    gmail: {
      user: emailConfig.smtp.user || emailConfig.gmail?.user,
      isConfigured,
      passMasked: emailConfig.smtp.pass ? '••••••••••••••••' : ''
    },
    resend: {
      isConfigured: !!emailConfig.resend?.apiKey,
      apiKeyMasked: emailConfig.resend?.apiKey ? `${emailConfig.resend.apiKey.slice(0, 5)}••••••••` : ''
    },
    sumopod: {
      host: emailConfig.sumopod?.host,
      port: emailConfig.sumopod?.port,
      user: emailConfig.sumopod?.user,
      isConfigured: !!(emailConfig.sumopod?.user && emailConfig.sumopod?.pass),
      passMasked: emailConfig.sumopod?.pass ? '••••••••' : ''
    }
  };
}

// Strict whitelist of environment keys allowed to be modified from UI
const ALLOWED_ENV_KEYS = new Set([
  'EMAIL_FROM_NAME',
  'EMAIL_FROM_ADDRESS',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASS'
]);

/**
 * Sanitize environment variable values to prevent:
 * 1. CRLF / Newline Injection (\r, \n)
 * 2. Unescaped quote breakouts (")
 * 3. Null byte injection (\0)
 * 4. Dangerous length bloat
 */
function sanitizeEnvValue(val, maxLen = 200) {
  if (val === undefined || val === null) return '';
  let clean = String(val)
    .replace(/[\r\n\0]/g, '')   // Anti-CRLF: strip all carriage returns, newlines, null bytes
    .replace(/"/g, '\\"')        // Escape double quotes
    .trim();
  
  if (clean.length > maxLen) {
    clean = clean.substring(0, maxLen);
  }
  return clean;
}

/**
 * Perbarui konfigurasi email runtime dan simpan perubahan ke backend/.env
 */
export function updateRuntimeAndEnvConfig(newConfig) {
  if (newConfig.platform) emailConfig.platform = newConfig.platform;
  if (newConfig.driver) emailConfig.driver = newConfig.driver;
  if (newConfig.fromName) emailConfig.fromName = newConfig.fromName;
  if (newConfig.fromAddress) emailConfig.fromAddress = newConfig.fromAddress;

  // Single form values (Host, Port, Secure, User, Pass)
  if (newConfig.host) emailConfig.smtp.host = newConfig.host;
  if (newConfig.port) emailConfig.smtp.port = Number(newConfig.port);
  if (newConfig.secure !== undefined) {
    emailConfig.smtp.secure = newConfig.secure === true || newConfig.secure === 'true';
  }
  if (newConfig.user) {
    emailConfig.smtp.user = newConfig.user;
    emailConfig.gmail.user = newConfig.user;
  }
  if (newConfig.pass) {
    const cleanPass = newConfig.pass.replace(/\s+/g, '');
    emailConfig.smtp.pass = cleanPass;
    emailConfig.gmail.pass = cleanPass;
  }

  // Nested form fallback
  if (newConfig.smtp) {
    if (newConfig.smtp.host) emailConfig.smtp.host = newConfig.smtp.host;
    if (newConfig.smtp.port) emailConfig.smtp.port = Number(newConfig.smtp.port);
    if (newConfig.smtp.secure !== undefined) emailConfig.smtp.secure = newConfig.smtp.secure === true || newConfig.smtp.secure === 'true';
    if (newConfig.smtp.user) emailConfig.smtp.user = newConfig.smtp.user;
    if (newConfig.smtp.pass) emailConfig.smtp.pass = newConfig.smtp.pass.replace(/\s+/g, '');
  }
  if (newConfig.gmail) {
    if (newConfig.gmail.user) emailConfig.smtp.user = newConfig.gmail.user;
    if (newConfig.gmail.pass) emailConfig.smtp.pass = newConfig.gmail.pass.replace(/\s+/g, '');
  }

  // Simpan ke file .env (baik di folder backend maupun root jika ada)
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'backend', '.env')
  ];

  for (const envPath of envPaths) {
    try {
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');

        const updateKey = (key, value) => {
          // Whitelist validation: only permitted keys can be written
          if (!ALLOWED_ENV_KEYS.has(key)) return;
          if (value === undefined || value === null) return;

          // Value sanitization: prevent CRLF injection, quotes, and control chars
          const cleanVal = sanitizeEnvValue(value);

          const regex = new RegExp(`^${key}=.*$`, 'm');
          if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}="${cleanVal}"`);
          } else {
            envContent += `\n${key}="${cleanVal}"`;
          }
        };

        // Clean universal SMTP gateway configuration keys
        updateKey('EMAIL_FROM_NAME', emailConfig.fromName);
        updateKey('EMAIL_FROM_ADDRESS', emailConfig.fromAddress);
        updateKey('SMTP_HOST', emailConfig.smtp.host);
        updateKey('SMTP_PORT', emailConfig.smtp.port);
        updateKey('SMTP_SECURE', emailConfig.smtp.secure);
        updateKey('SMTP_USER', emailConfig.smtp.user);
        if (newConfig.pass || (newConfig.smtp && newConfig.smtp.pass)) {
          updateKey('SMTP_PASS', emailConfig.smtp.pass);
        }

        fs.writeFileSync(envPath, envContent, 'utf8');
      }
    } catch (err) {
      console.error(`Gagal menulis ${envPath}:`, err.message);
    }
  }

  return getMaskedConfig();
}

/**
 * Kirim email penugasan teknisi (Engineer Dispatch) secara manual oleh Admin
 */
export async function sendEngineerDispatchNotification(ticket, engineer, customer) {
  if (!engineer?.email) {
    throw new Error('Alamat email teknisi tidak terdaftar dalam profil.');
  }

  const subject = `[GTT Penugasan] Tiket #${ticket.ticketNumber}: ${ticket.title} (Severity: ${ticket.severity})`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; color: #ffffff; border-bottom: 4px solid #2563eb;">
        <h3 style="margin: 0; font-size: 18px; color: #38bdf8;">PT Global Transformasi Teknologi</h3>
        <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Notifikasi Penugasan Kerja Teknisi (Field / NOC Dispatch)</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 13px;">
        <p style="margin-top: 0; font-weight: 600; font-size: 14px;">Halo ${engineer.name || 'Rekan Teknisi'},</p>
        <p>Anda telah ditugaskan secara resmi untuk menangani tiket insiden operasional berikut:</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr><td style="padding: 4px 0; color: #64748b; width: 140px;">Nomor Tiket:</td><td style="padding: 4px 0; font-weight: 700; font-family: monospace; color: #0f172a;">${ticket.ticketNumber}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Klien Mitra:</td><td style="padding: 4px 0; font-weight: 600;">${customer?.name || '-'}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Tingkat Keparahan:</td><td style="padding: 4px 0; font-weight: 700; color: #dc2626;">${ticket.severity}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Perangkat / Serial:</td><td style="padding: 4px 0; font-family: monospace;">${ticket.serialNumber || '-'}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Judul Insiden:</td><td style="padding: 4px 0; font-weight: 600;">${ticket.title}</td></tr>
          </table>
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
            <span style="color: #64748b; font-size: 11px; display: block; margin-bottom: 4px;">Uraian Gejala:</span>
            <div style="background: #ffffff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px;">${ticket.description}</div>
          </div>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 14px; font-size: 12px; color: #334155; line-height: 1.5;">
          📌 <strong>Petunjuk Penanganan:</strong> Silakan login ke aplikasi Helpdesk GTT untuk memperbarui status penanganan, mengelola jam SLA, dan mencatat checkpoint milestones perbaikan.
        </div>
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 10px; margin-top: 14px; font-size: 11px; color: #92400e; text-align: center;">
          <strong>Pemberitahuan Sistem (No-Reply):</strong> Email ini dikirim otomatis oleh Dispatcher Helpdesk GTT. Mohon tidak membalas langsung ke alamat noreply@gtteknologi.com ini.
        </div>
      </div>
      <div style="background: #f1f5f9; padding: 12px 24px; font-size: 11px; color: #94a3b8; text-align: center;">
        Sistem Dispatch Helpdesk PT Global Transformasi Teknologi
      </div>
    </div>
  `;

  return await sendMail({
    to: engineer.email,
    subject,
    html
  });
}

/**
 * Kirim 1 email resmi terpadu ke PIC klien: memuat rincian tiket & akses tracking mandiri,
 * serta otomatis menyajikan ringkasan pemulihan (BAP) jika tiket sudah dalam status RESOLVED/CLOSED.
 */
export async function sendTicketCustomerTrackingNotification(ticket, customer, pic, trackingUrl) {
  const targetEmail = pic?.email || customer?.email;
  if (!targetEmail) {
    throw new Error('Alamat email PIC mitra pelanggan tidak tersedia.');
  }

  const isResolved = ['RESOLVED', 'CLOSED'].includes(ticket.status);
  const subject = isResolved
    ? `[GTT Update Tiket #${ticket.ticketNumber}] Pemulihan Selesai: ${ticket.title}`
    : `[GTT Tiket #${ticket.ticketNumber}] Laporan Gangguan: ${ticket.title}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; color: #ffffff; border-bottom: 4px solid #2563eb;">
        <h3 style="margin: 0; font-size: 18px; color: #38bdf8;">PT Global Transformasi Teknologi</h3>
        <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Portal Layanan Helpdesk & Tracking Mandiri</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 13px;">
        <p style="margin-top: 0; font-weight: 600; font-size: 14px;">Yth. Bapak/Ibu ${pic?.name || 'PIC Mitra'} (${customer?.name || 'Mitra Korporat'}),</p>
        <p>
          ${isResolved 
            ? `Pekerjaan perbaikan teknis terkait tiket <strong>#${ticket.ticketNumber}</strong> telah berhasil diselesaikan oleh tim teknisi GTT. Layanan Anda saat ini telah pulih normal.`
            : `Laporan penanganan gangguan Anda telah tercatat ke dalam sistem helpdesk GTT dengan rincian operasional sebagai berikut:`
          }
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr><td style="padding: 4px 0; color: #64748b; width: 140px;">Nomor Tiket:</td><td style="padding: 4px 0; font-weight: 700; font-family: monospace; color: #0f172a;">${ticket.ticketNumber}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Klien Mitra:</td><td style="padding: 4px 0; font-weight: 600;">${customer?.name || '-'}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Status Saat Ini:</td><td style="padding: 4px 0; font-weight: 700; color: ${isResolved ? '#16a34a' : '#2563eb'};">${ticket.status}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Perangkat / Serial:</td><td style="padding: 4px 0; font-family: monospace;">${ticket.serialNumber || '-'}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Uraian Gejala:</td><td style="padding: 4px 0; font-weight: 600;">${ticket.title}</td></tr>
          </table>
          ${isResolved ? `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #bbf7d0; background: #f0fdf4; padding: 12px; border-radius: 6px;">
              <div style="font-weight: 700; color: #166534; font-size: 12px; margin-bottom: 4px;">✓ Status Pemulihan &amp; Verifikasi:</div>
              <div style="font-size: 12px; color: #15803d; line-height: 1.5;">
                Seluruh perbaikan teknis pada perangkat terkait telah berhasil diselesaikan oleh tim teknisi GTT. Layanan operasional Anda telah dipastikan pulih normal dan siap digunakan kembali.
              </div>
            </div>
          ` : `
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
              <span style="color: #64748b; font-size: 11px; display: block; margin-bottom: 4px;">Deskripsi Kendala:</span>
              <div style="background: #ffffff; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 12px;">${ticket.description || ticket.title}</div>
            </div>
          `}
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${trackingUrl || '#'}" target="_blank" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
            ${isResolved ? 'Verifikasi & Konfirmasi Penyelesaian &rarr;' : 'Buka Portal Tracking Mandiri &rarr;'}
          </a>
          <p style="margin: 8px 0 0; font-size: 11px; color: #64748b;">
            Tautan di atas diamankan dengan token Anti-IDOR. Melalui portal ini, Anda dapat memantau progres live serta mengonfirmasi hasil pekerjaan.
          </p>
        </div>

        <!-- Kotak Peringatan No-Reply -->
        <div style="background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px; margin-top: 20px; font-size: 11px; color: #92400e; text-align: center; line-height: 1.5;">
          <strong>Pemberitahuan Sistem (No-Reply):</strong> Email ini dikirim secara otomatis oleh sistem notifikasi Helpdesk GTT dan alamat ini <u>tidak dapat menerima pesan balasan</u>. Mohon untuk tidak membalas email ini secara langsung. Jika membutuhkan bantuan, hubungi telepon kantor di <strong>(021) 2960-7307</strong> atau email resmi <strong>sales@gtteknologi.com</strong>.
        </div>

        <p style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 14px; margin-bottom: 0;">
          * Layanan bantuan operasional PT Global Transformasi Teknologi. Alamat pengirim noreply@gtteknologi.com bersifat satu arah.
        </p>
      </div>
      <div style="background: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; text-align: center; line-height: 1.5;">
        <strong style="color: #334155;">PT Global Transformasi Teknologi (Glotra Technology)</strong><br />
        Telepon: (021) 2960-7307 • Email Resmi: sales@gtteknologi.com<br />
        Prudential Center Kota Kasablanka Lt. 22 Unit A, Jl. Casablanca Kav. 88, Jakarta Selatan 12870
      </div>
    </div>
  `;

  return await sendMail({
    to: targetEmail,
    subject,
    html
  });
}

/**
 * Kirim email Berita Acara Penyelesaian (Customer Resolved) secara manual oleh Admin
 */
export async function sendTicketResolutionNotification(ticket, customer, pic, trackingUrl) {
  const targetEmail = pic?.email || customer?.email;
  if (!targetEmail) {
    throw new Error('Alamat email PIC mitra pelanggan tidak tersedia.');
  }

  const subject = `[GTT Berita Acara] Penyelesaian Tiket #${ticket.ticketNumber} - ${ticket.title}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; color: #ffffff; border-bottom: 4px solid #10b981;">
        <h3 style="margin: 0; font-size: 18px; color: #38bdf8;">PT Global Transformasi Teknologi</h3>
        <p style="margin: 4px 0 0; font-size: 12px; color: #94a3b8;">Berita Acara Pemulihan & Penyelesaian Insiden (BAP)</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6; font-size: 13px;">
        <p style="margin-top: 0; font-weight: 600; font-size: 14px;">Yth. Bapak/Ibu ${pic?.name || 'PIC Mitra'},</p>
        <p>Bersama ini kami sampaikan bahwa tiket penanganan insiden operasional <strong>#${ticket.ticketNumber}</strong> telah berhasil dipulihkan oleh tim teknis kami dengan status <strong>RESOLVED</strong>.</p>
        
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h4 style="margin: 0 0 10px; color: #166534; font-size: 13px;">Ringkasan Hasil Perbaikan:</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr><td style="padding: 4px 0; color: #64748b; width: 140px;">Nomor Tiket:</td><td style="padding: 4px 0; font-weight: 700; font-family: monospace;">${ticket.ticketNumber}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Mitra Perusahaan:</td><td style="padding: 4px 0; font-weight: 600;">${customer?.name || '-'}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Akar Masalah (Root Cause):</td><td style="padding: 4px 0;">${ticket.rootCause || 'Pemulihan anomali jaringan & restart service normal.'}</td></tr>
            <tr><td style="padding: 4px 0; color: #64748b;">Tindakan Perbaikan:</td><td style="padding: 4px 0;">${ticket.actionTaken || ticket.resolutionStrategy || 'Perbaikan konfigurasi dan pengujian trafik kembali stabil.'}</td></tr>
          </table>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${trackingUrl || '#'}" target="_blank" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px;">
            Lihat Laporan Lengkap Tiket &rarr;
          </a>
        </div>

        <p style="font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          * Berdasarkan Service Level Agreement (SLA), tiket ini memiliki masa sanggah selama 72 jam sebelum diarsipkan secara permanen. Jika kendala masih berulang, Anda dapat menghubungi kami di (021) 2960-7307 atau email sales@gtteknologi.com.
        </p>
      </div>
      <div style="background: #f1f5f9; padding: 14px 24px; font-size: 11px; color: #64748b; text-align: center; line-height: 1.5;">
        <strong style="color: #334155;">PT Global Transformasi Teknologi (Glotra Technology)</strong><br />
        Telepon: (021) 2960-7307 • Email Resmi: sales@gtteknologi.com<br />
        Prudential Center Kota Kasablanka Lt. 22 Unit A, Jl. Casablanca Kav. 88, Jakarta Selatan 12870
      </div>
    </div>
  `;

  return await sendMail({
    to: targetEmail,
    subject,
    html
  });
}
