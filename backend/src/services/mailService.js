import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Runtime in-memory email configuration (initialized from process.env)
export const emailConfig = {
  driver: process.env.EMAIL_DRIVER || 'gmail',
  fromName: process.env.EMAIL_FROM_NAME || 'PT Global Transformasi Teknologi Helpdesk',
  fromAddress: process.env.EMAIL_FROM_ADDRESS || process.env.GMAIL_USER || 'wiz.fie@gmail.com',
  gmail: {
    user: process.env.GMAIL_USER || 'wiz.fie@gmail.com',
    pass: (process.env.GMAIL_APP_PASS || '').replace(/\s+/g, ''),
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
 * Buat transporter Nodemailer berdasarkan driver yang dipilih
 */
function createTransporter(driver = emailConfig.driver) {
  if (driver === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.gmail.user,
        pass: emailConfig.gmail.pass.replace(/\s+/g, '')
      }
    });
  }

  if (driver === 'sumopod') {
    return nodemailer.createTransport({
      host: emailConfig.sumopod.host,
      port: emailConfig.sumopod.port,
      secure: emailConfig.sumopod.port === 465,
      auth: {
        user: emailConfig.sumopod.user,
        pass: emailConfig.sumopod.pass
      }
    });
  }

  return null;
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
 * Eksekusi pengiriman email utama dengan dukungan Single Driver & Failover
 */
export async function sendMail({ to, subject, html, text, driverOverride = null }) {
  const activeDriver = driverOverride || emailConfig.driver;
  const from = `"${emailConfig.fromName}" <${emailConfig.fromAddress}>`;

  // 1. Mode Mock / Simulator (Development tanpa internet)
  if (activeDriver === 'mock') {
    console.log(`📨 [Mail Mock] To: ${to} | Subject: ${subject}`);
    return {
      success: true,
      provider: 'mock',
      messageId: `mock-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }

  // 2. Mode Failover (Coba Resend -> Sumopod -> Gmail)
  if (activeDriver === 'failover') {
    const candidateDrivers = [];
    if (emailConfig.resend.apiKey) candidateDrivers.push('resend');
    if (emailConfig.sumopod.user && emailConfig.sumopod.pass) candidateDrivers.push('sumopod');
    if (emailConfig.gmail.user && emailConfig.gmail.pass) candidateDrivers.push('gmail');

    if (candidateDrivers.length === 0) {
      candidateDrivers.push('gmail'); // fallback default
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

  // 3. Pengiriman spesifik Resend
  if (activeDriver === 'resend') {
    const res = await sendViaResend({ to, subject, html, text });
    return { success: true, provider: 'resend', messageId: res.messageId, timestamp: new Date().toISOString() };
  }

  // 4. Pengiriman via SMTP (Gmail, Sumopod)
  const transporter = createTransporter(activeDriver);
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
    provider: activeDriver,
    messageId: info.messageId,
    timestamp: new Date().toISOString()
  };
}

/**
 * Uji coba koneksi dan kirim email test
 */
export async function testEmailConnection(targetEmail, driver = null) {
  const chosenDriver = driver || emailConfig.driver;
  const subject = `[Glotra Helpdesk] Uji Coba Pengiriman Email Gateway (${chosenDriver.toUpperCase()})`;
  
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 24px; color: #ffffff; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">PT Global Transformasi Teknologi</h2>
        <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">ITSM Enterprise Helpdesk & SLA Ticketing Platform</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 6px; color: #166534; font-size: 15px; font-weight: 700;">✅ Tes Koneksi Email Berhasil!</h4>
          <p style="margin: 0; font-size: 13px; color: #15803d;">
            Email ini mengonfirmasi bahwa integrasi sistem notifikasi tiket helpdesk menggunakan driver <strong>${chosenDriver.toUpperCase()}</strong> telah berhasil terhubung dan siap digunakan.
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 8px 0; color: #64748b; width: 140px;">Driver Aktif:</td>
            <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${chosenDriver.toUpperCase()}</td>
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
          Pesan ini dikirim secara otomatis oleh modul Dynamic Email Gateway Helpdesk Glotra.
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
  return {
    driver: emailConfig.driver,
    fromName: emailConfig.fromName,
    fromAddress: emailConfig.fromAddress,
    gmail: {
      user: emailConfig.gmail.user,
      isConfigured: !!(emailConfig.gmail.user && emailConfig.gmail.pass),
      passMasked: emailConfig.gmail.pass ? '••••••••••••••••' : ''
    },
    resend: {
      isConfigured: !!emailConfig.resend.apiKey,
      apiKeyMasked: emailConfig.resend.apiKey ? `${emailConfig.resend.apiKey.slice(0, 5)}••••••••` : ''
    },
    sumopod: {
      host: emailConfig.sumopod.host,
      port: emailConfig.sumopod.port,
      user: emailConfig.sumopod.user,
      isConfigured: !!(emailConfig.sumopod.user && emailConfig.sumopod.pass),
      passMasked: emailConfig.sumopod.pass ? '••••••••' : ''
    }
  };
}

/**
 * Perbarui konfigurasi email runtime dan simpan perubahan ke backend/.env
 */
export function updateRuntimeAndEnvConfig(newConfig) {
  if (newConfig.driver) emailConfig.driver = newConfig.driver;
  if (newConfig.fromName) emailConfig.fromName = newConfig.fromName;
  if (newConfig.fromAddress) emailConfig.fromAddress = newConfig.fromAddress;

  if (newConfig.gmail) {
    if (newConfig.gmail.user) emailConfig.gmail.user = newConfig.gmail.user;
    if (newConfig.gmail.pass) emailConfig.gmail.pass = newConfig.gmail.pass.replace(/\s+/g, '');
  }

  if (newConfig.resend) {
    if (newConfig.resend.apiKey) emailConfig.resend.apiKey = newConfig.resend.apiKey;
  }

  if (newConfig.sumopod) {
    if (newConfig.sumopod.host) emailConfig.sumopod.host = newConfig.sumopod.host;
    if (newConfig.sumopod.port) emailConfig.sumopod.port = Number(newConfig.sumopod.port);
    if (newConfig.sumopod.user) emailConfig.sumopod.user = newConfig.sumopod.user;
    if (newConfig.sumopod.pass) emailConfig.sumopod.pass = newConfig.sumopod.pass;
  }

  // Simpan ke file .env
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');

      const updateKey = (key, value) => {
        if (value !== undefined && value !== null) {
          const regex = new RegExp(`^${key}=.*$`, 'm');
          if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}="${value}"`);
          } else {
            envContent += `\n${key}="${value}"`;
          }
        }
      };

      updateKey('EMAIL_DRIVER', emailConfig.driver);
      updateKey('EMAIL_FROM_NAME', emailConfig.fromName);
      updateKey('EMAIL_FROM_ADDRESS', emailConfig.fromAddress);
      updateKey('GMAIL_USER', emailConfig.gmail.user);
      updateKey('GMAIL_APP_PASS', emailConfig.gmail.pass);
      updateKey('RESEND_API_KEY', emailConfig.resend.apiKey);
      updateKey('SUMOPOD_SMTP_HOST', emailConfig.sumopod.host);
      updateKey('SUMOPOD_SMTP_PORT', emailConfig.sumopod.port);
      updateKey('SUMOPOD_SMTP_USER', emailConfig.sumopod.user);
      updateKey('SUMOPOD_SMTP_PASS', emailConfig.sumopod.pass);

      fs.writeFileSync(envPath, envContent, 'utf8');
    }
  } catch (err) {
    console.error('Gagal menulis .env:', err.message);
  }

  return getMaskedConfig();
}
