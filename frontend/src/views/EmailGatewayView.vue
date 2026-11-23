<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div class="flex items-center space-x-3.5">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h1 class="text-xl font-bold text-slate-900">Pengaturan Gateway Email (SMTP)</h1>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Konfigurasi server SMTP tunggal untuk seluruh pengiriman email notifikasi tiket helpdesk.
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button 
          type="button"
          @click="showTemplatePreview = true" 
          class="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
          title="Lihat contoh format tampilan email notifikasi korporat"
        >
          <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <span>Format Template Email</span>
        </button>
      </div>
    </div>

    <!-- Feedback Alerts -->
    <div v-if="alertMessage" class="p-4 rounded-xl border flex items-start justify-between animate-in fade-in"
      :class="alertType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'">
      <div class="flex items-center space-x-2.5">
        <span class="text-base">{{ alertType === 'success' ? '✅' : '❌' }}</span>
        <span class="text-xs font-semibold">{{ alertMessage }}</span>
      </div>
      <button @click="alertMessage = ''" class="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">✕</button>
    </div>

    <!-- Main Grid: Input Form & Test Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left: Form Konfigurasi Input Server SMTP (7 Cols) -->
      <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-sm font-bold text-slate-900">Konfigurasi Server & Kredensial SMTP</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Cukup masukkan data koneksi server SMTP yang Anda gunakan. Kapan pun instansi ingin mengganti penyedia email (seperti Sumopod, SendGrid, hosting internal, dsb), cukup ubah form di bawah ini tanpa perlu merubah kodingan.
          </p>
        </div>

        <!-- 1. Identitas Pengirim (From Header) -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>✉️</span>
            <span>1. Identitas Pengirim Resmi (From Header)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Nama Pengirim Resmi</label>
              <input 
                v-model="form.fromName" 
                type="text" 
                placeholder="PT Global Transformasi Teknologi (No-Reply)" 
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Alamat Email Pengirim</label>
              <input 
                v-model="form.fromAddress" 
                type="email" 
                placeholder="noreply@gtteknologi.com" 
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- 2. Parameter Koneksi Server SMTP -->
        <div class="p-4 rounded-xl border border-slate-200 space-y-4 bg-white">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span>🌐</span>
              <span>2. Parameter Server SMTP</span>
            </span>
            <span v-if="form.isConfigured" class="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded">
              ✓ Kredensial Tersimpan
            </span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div class="sm:col-span-8">
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Host Server SMTP</label>
              <input 
                v-model="form.host" 
                type="text" 
                placeholder="Contoh: smtp.sumopod.com / smtp.sendgrid.net"
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div class="sm:col-span-4">
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Port Server</label>
              <input 
                v-model.number="form.port" 
                type="number" 
                placeholder="465 atau 587"
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
              <span class="text-[10px] text-slate-400 mt-1 block font-sans">
                {{ Number(form.port) === 465 ? '🔒 Enkripsi: SSL/TLS (Otomatis)' : '🛡️ Enkripsi: STARTTLS (Otomatis)' }}
              </span>
            </div>
          </div>

          <!-- Username & Password -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Username / Akun SMTP</label>
              <input 
                v-model="form.user" 
                type="text" 
                placeholder="Username akun atau 'apikey'"
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Password / API Key</label>
              <div class="relative">
                <input 
                  v-model="inputPass" 
                  :type="showPassword ? 'text' : 'password'" 
                  :placeholder="form.passMasked || 'Masukkan password SMTP / API Key'"
                  class="w-full text-xs px-3 py-2 pr-9 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Tampilkan / Sembunyikan Password"
                >
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tombol Simpan Pengaturan di Bawah Form -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button 
            type="button"
            @click="saveConfig" 
            :disabled="isSaving"
            class="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!isSaving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
          </button>
        </div>

      </div>

      <!-- Right: Live Test & Diagnostics Panel (5 Cols) -->
      <div class="lg:col-span-5 space-y-6">
        
        <!-- Live Email Test Form -->
        <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-xl space-y-5 border border-slate-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Live Test Gateway Email</h3>
                <p class="text-[11px] text-slate-400">Uji langsung koneksi pengiriman ke kotak masuk nyata</p>
              </div>
            </div>
          </div>

          <div class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Kirim Ke Alamat Email Tujuan:</label>
              <input 
                v-model="testEmailTarget" 
                type="email" 
                placeholder="nama@email.com"
                class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <!-- Active Target Info -->
            <div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-[11px]">
              <span class="text-slate-400">Target Server:</span>
              <span class="font-bold text-blue-400 font-mono">
                {{ form.host || 'Belum Dikonfigurasi' }}:{{ form.port || 465 }}
              </span>
            </div>

            <button 
              type="button"
              @click="executeTestEmail" 
              :disabled="isTesting || !testEmailTarget"
              class="w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              :class="isTesting || !testEmailTarget ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20'"
            >
              <span v-if="isTesting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <span>{{ isTesting ? 'Menghubungkan ke Server SMTP...' : '🚀 Kirim Email Uji Coba Sekarang' }}</span>
            </button>
          </div>

          <!-- Real-Time Diagnostic Result -->
          <div v-if="testResult" class="p-4 rounded-xl border bg-slate-900/90 text-xs space-y-2"
            :class="testResult.success ? 'border-emerald-500/40 text-emerald-200' : 'border-rose-500/40 text-rose-200'">
            <div class="flex items-center justify-between font-bold">
              <span>{{ testResult.success ? '🎉 PENGIRIMAN BERHASIL!' : '❌ PENGIRIMAN GAGAL' }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40">
                {{ testResult.data?.provider?.toUpperCase() || 'SMTP' }}
              </span>
            </div>
            <p class="text-[11px] leading-relaxed text-slate-300">
              {{ testResult.message }}
            </p>
            <div v-if="testResult.data?.messageId" class="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 truncate">
              Message-ID: {{ testResult.data.messageId }}
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Email Notification Preview Modal -->
    <EmailPreviewModal
      :is-open="showTemplatePreview"
      :target="'all'"
      :ticket="sampleTicket"
      :customer="sampleCustomer"
      :pic="samplePic"
      :engineer="{ name: 'Budi Santoso' }"
      @close="showTemplatePreview = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import EmailPreviewModal from '../components/EmailPreviewModal.vue';

const showTemplatePreview = ref(false);
const showPassword = ref(false);

const sampleTicket = {
  id: 1,
  ticketNumber: 'TK-26001',
  severity: 'HIGH',
  status: 'ASSIGNED',
  title: 'Network Switch Core Flapping & Packet Loss',
  description: 'Terjadi degradasi link trunk core switch pada port Gi0/1 menuju Distribution Switch.',
  createdAt: new Date().toISOString(),
  responseDeadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  resolutionDeadline: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  trackingToken: 'sec_demo_token_123',
  rootCause: 'Kabel fiber optic patch cord mengalami micro-loss di rack server B.',
  actionTaken: 'Penggantian patch cord duplex LC-LC dan pembersihan konektor ferrule optik.'
};
const sampleCustomer = { name: 'PT Astra Graphia Information Technology (AGIT)', slaTier: 'PLATINUM 24x7' };
const samplePic = { name: 'Bambang Trihatmodjo', email: 'bambang.t@agit.astra.co.id' };

const isLoading = ref(false);
const isSaving = ref(false);
const isTesting = ref(false);

const alertMessage = ref('');
const alertType = ref('success');

// Universal single configuration state
const form = ref({
  driver: 'smtp',
  fromName: 'PT Global Transformasi Teknologi (No-Reply)',
  fromAddress: 'noreply@gtteknologi.com',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  user: 'wiz.fie@gmail.com',
  isConfigured: true,
  passMasked: '••••••••••••••••'
});

const inputPass = ref('');
const testEmailTarget = ref('wiz.fie@gmail.com');
const testResult = ref(null);

async function fetchConfig() {
  isLoading.value = true;
  try {
    const res = await api.getEmailConfig();
    if (res?.success && res.data) {
      const d = res.data;
      form.value.driver = 'smtp';
      form.value.fromName = d.fromName || 'PT Global Transformasi Teknologi (No-Reply)';
      form.value.fromAddress = d.fromAddress || 'noreply@gtteknologi.com';
      form.value.host = d.host || d.smtp?.host || 'smtp.gmail.com';
      form.value.port = Number(d.port || d.smtp?.port) || 465;
      form.value.secure = d.secure !== undefined ? d.secure : (form.value.port === 465);
      form.value.user = d.user || d.gmail?.user || d.smtp?.user || '';
      form.value.isConfigured = d.isConfigured ?? true;
      form.value.passMasked = d.passMasked || (form.value.isConfigured ? '••••••••••••••••' : '');

      if (form.value.user && !testEmailTarget.value) {
        testEmailTarget.value = form.value.user;
      }
    }
  } catch (err) {
    console.error('Gagal mengambil konfigurasi email:', err);
  } finally {
    isLoading.value = false;
  }
}

async function saveConfig() {
  isSaving.value = true;
  alertMessage.value = '';
  try {
    const payload = {
      driver: 'smtp',
      platform: 'smtp',
      fromName: form.value.fromName,
      fromAddress: form.value.fromAddress,
      host: form.value.host,
      port: Number(form.value.port) || 465,
      secure: Number(form.value.port) === 465,
      user: form.value.user,
      pass: inputPass.value || undefined
    };

    const res = await api.updateEmailConfig(payload);
    if (res?.success) {
      alertType.value = 'success';
      alertMessage.value = res.message || 'Konfigurasi SMTP Email Gateway berhasil disimpan!';
      if (res.data) {
        const d = res.data;
        form.value.isConfigured = d.isConfigured ?? true;
        form.value.passMasked = d.passMasked || (form.value.isConfigured ? '••••••••••••••••' : '');
      }
      inputPass.value = '';
    }
  } catch (err) {
    alertType.value = 'error';
    alertMessage.value = err.message || 'Gagal menyimpan konfigurasi email.';
  } finally {
    isSaving.value = false;
  }
}

async function executeTestEmail() {
  if (!testEmailTarget.value) return;
  isTesting.value = true;
  testResult.value = null;
  alertMessage.value = '';

  try {
    const res = await api.sendTestEmail({
      targetEmail: testEmailTarget.value,
      driver: 'smtp'
    });

    testResult.value = {
      success: true,
      message: res?.message || 'Email uji coba berhasil dikirim ke kotak masuk!',
      data: res?.data
    };
  } catch (err) {
    testResult.value = {
      success: false,
      message: err.message || 'Terjadi kendala saat menghubungkan ke server email.'
    };
  } finally {
    isTesting.value = false;
  }
}

onMounted(() => {
  fetchConfig();
});
</script>