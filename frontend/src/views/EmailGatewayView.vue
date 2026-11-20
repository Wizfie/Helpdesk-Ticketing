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
          <div class="flex items-center space-x-2">
            <h1 class="text-xl font-bold text-slate-900">Email Gateway & Notification Engine</h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase"
              :class="getStatusBadgeClass(config.driver)">
              ● {{ config.driver?.toUpperCase() || 'MOCK' }} ACTIVE
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-0.5">
            Manajemen multi-driver pengiriman email notifikasi tiket helpdesk & kepatuhan SLA 24x7
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-3">
        <button 
          @click="fetchConfig" 
          :disabled="isLoading"
          class="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center space-x-1.5"
        >
          <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span>Refresh Status</span>
        </button>

        <button 
          @click="saveConfig" 
          :disabled="isSaving"
          class="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition flex items-center space-x-1.5"
        >
          <svg v-if="!isSaving" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span v-if="isSaving" class="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}</span>
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
      <button @click="alertMessage = ''" class="text-slate-400 hover:text-slate-600 text-xs">✕</button>
    </div>

    <!-- Active Driver Selection Grid -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <h2 class="text-sm font-bold text-slate-900">1. Pilih Driver Pengiriman Utama</h2>
        <p class="text-xs text-slate-500">Pilih provider yang akan digunakan secara aktif untuk seluruh notifikasi tiket helpdesk.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <!-- Option: Gmail -->
        <div 
          @click="config.driver = 'gmail'"
          class="p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between"
          :class="config.driver === 'gmail' ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-900">Gmail SMTP</span>
              <span class="w-2.5 h-2.5 rounded-full" :class="config.gmail?.isConfigured ? 'bg-emerald-500' : 'bg-slate-300'"></span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-2">Sandi Aplikasi Google. Maksimal ~500 email/hari.</p>
          </div>
          <span class="mt-3 text-[10px] font-bold px-2 py-0.5 rounded w-fit"
            :class="config.driver === 'gmail' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'">
            {{ config.driver === 'gmail' ? '✓ AKTIF' : 'Pilih' }}
          </span>
        </div>

        <!-- Option: Resend -->
        <div 
          @click="config.driver = 'resend'"
          class="p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between"
          :class="config.driver === 'resend' ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-900">Resend API</span>
              <span class="w-2.5 h-2.5 rounded-full" :class="config.resend?.isConfigured ? 'bg-emerald-500' : 'bg-slate-300'"></span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-2">REST API Modern. Gratis 3.000/bln (100/hari). Cepat & Anti-Spam.</p>
          </div>
          <span class="mt-3 text-[10px] font-bold px-2 py-0.5 rounded w-fit"
            :class="config.driver === 'resend' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'">
            {{ config.driver === 'resend' ? '✓ AKTIF' : 'Pilih' }}
          </span>
        </div>

        <!-- Option: Sumopod -->
        <div 
          @click="config.driver = 'sumopod'"
          class="p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between"
          :class="config.driver === 'sumopod' ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-900">Sumopod SMTP</span>
              <span class="w-2.5 h-2.5 rounded-full" :class="config.sumopod?.isConfigured ? 'bg-emerald-500' : 'bg-slate-300'"></span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-2">Cloud lokal Indonesia. Pay-as-you-go saldo Rupiah.</p>
          </div>
          <span class="mt-3 text-[10px] font-bold px-2 py-0.5 rounded w-fit"
            :class="config.driver === 'sumopod' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'">
            {{ config.driver === 'sumopod' ? '✓ AKTIF' : 'Pilih' }}
          </span>
        </div>

        <!-- Option: Smart Failover -->
        <div 
          @click="config.driver = 'failover'"
          class="p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between"
          :class="config.driver === 'failover' ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-indigo-900">Smart Failover</span>
              <span class="px-1.5 py-0.2 text-[9px] bg-indigo-100 text-indigo-700 font-bold rounded">Auto</span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-2">Coba Resend ➔ Sumopod ➔ Gmail otomatis jika error.</p>
          </div>
          <span class="mt-3 text-[10px] font-bold px-2 py-0.5 rounded w-fit"
            :class="config.driver === 'failover' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'">
            {{ config.driver === 'failover' ? '✓ AKTIF' : 'Pilih' }}
          </span>
        </div>

        <!-- Option: Mock / Simulator -->
        <div 
          @click="config.driver = 'mock'"
          class="p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between"
          :class="config.driver === 'mock' ? 'border-amber-600 bg-amber-50/50 shadow-sm ring-1 ring-amber-600' : 'border-slate-200 hover:border-slate-300 bg-white'"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-900">Simulator (Mock)</span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            </div>
            <p class="text-[11px] text-slate-500 line-clamp-2">Mode pengujian lokal tanpa kirim email nyata.</p>
          </div>
          <span class="mt-3 text-[10px] font-bold px-2 py-0.5 rounded w-fit"
            :class="config.driver === 'mock' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'">
            {{ config.driver === 'mock' ? '✓ AKTIF' : 'Pilih' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Grid: Configuration Form & Live Test Card -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left: Provider Credentials Configuration (7 Cols) -->
      <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <h2 class="text-sm font-bold text-slate-900">2. Konfigurasi Identitas & Kredensial Driver</h2>
          <p class="text-xs text-slate-500">Kredensial disimpan secara aman di backend dan file .env server.</p>
        </div>

        <!-- Identity Sender Settings -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Identitas Pengirim Resmi (From)</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Nama Pengirim</label>
              <input 
                v-model="config.fromName" 
                type="text" 
                placeholder="PT Global Transformasi Teknologi Helpdesk" 
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">Alamat Email Pengirim</label>
              <input 
                v-model="config.fromAddress" 
                type="email" 
                placeholder="wiz.fie@gmail.com" 
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- Driver-Specific Settings (Tabs/Cards) -->
        <div class="space-y-4">
          <!-- Gmail Configuration Box -->
          <div class="p-4 rounded-xl border transition-all"
            :class="config.driver === 'gmail' ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200 bg-white'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-bold text-slate-900">Google Gmail SMTP</span>
                <span v-if="config.gmail?.isConfigured" class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  ✓ Siap Digunakan
                </span>
              </div>
              <span class="text-[11px] text-slate-400">Port 465 (SSL)</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Email Akun Google</label>
                <input 
                  v-model="config.gmail.user" 
                  type="email" 
                  placeholder="wiz.fie@gmail.com"
                  class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Sandi Aplikasi Google (16 Karakter)</label>
                <input 
                  v-model="inputPass.gmail" 
                  type="password" 
                  :placeholder="config.gmail?.passMasked || 'lirh vxnb xnda panw'"
                  class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
            <p class="text-[10px] text-slate-400 mt-2">
              * Sandi aplikasi didapatkan dari: 
              <a href="https://myaccount.google.com/apppasswords" target="_blank" class="text-blue-600 underline font-semibold">myaccount.google.com/apppasswords</a>
            </p>
          </div>

          <!-- Resend Configuration Box -->
          <div class="p-4 rounded-xl border transition-all"
            :class="config.driver === 'resend' ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200 bg-white'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-bold text-slate-900">Resend Cloud API</span>
                <span v-if="config.resend?.isConfigured" class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  ✓ Terkonfigurasi
                </span>
                <span v-else class="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                  Belum Diisi
                </span>
              </div>
              <span class="text-[11px] text-slate-400">Gratis 3.000 / bln</span>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-slate-600 mb-1">Resend API Key</label>
              <input 
                v-model="inputPass.resend" 
                type="password" 
                :placeholder="config.resend?.apiKeyMasked || 're_123456789_abcdefg'"
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>
            <p class="text-[10px] text-slate-400 mt-2">
              * Dapatkan gratis tanpa kartu kredit di: 
              <a href="https://resend.com" target="_blank" class="text-blue-600 underline font-semibold">resend.com</a>
            </p>
          </div>

          <!-- Sumopod Configuration Box -->
          <div class="p-4 rounded-xl border transition-all"
            :class="config.driver === 'sumopod' ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200 bg-white'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-bold text-slate-900">Sumopod SMTP Cloud</span>
                <span v-if="config.sumopod?.isConfigured" class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  ✓ Terkonfigurasi
                </span>
                <span v-else class="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                  Belum Diisi
                </span>
              </div>
              <span class="text-[11px] text-slate-400">Pay-as-you-go</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">SMTP Username</label>
                <input 
                  v-model="config.sumopod.user" 
                  type="text" 
                  placeholder="Username Sumopod"
                  class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">SMTP Password</label>
                <input 
                  v-model="inputPass.sumopod" 
                  type="password" 
                  :placeholder="config.sumopod?.passMasked || 'Password SMTP Sumopod'"
                  class="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
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
                <h3 class="text-sm font-bold text-white">Live Test Email Gateway</h3>
                <p class="text-[11px] text-slate-400">Kirim email uji coba langsung ke kotak masuk nyata</p>
              </div>
            </div>
          </div>

          <div class="space-y-3.5">
            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Kirim Ke Alamat Email:</label>
              <input 
                v-model="testEmailTarget" 
                type="email" 
                placeholder="nama@email.com"
                class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label class="block text-[11px] font-medium text-slate-300 mb-1">Uji Coba Menggunakan Driver:</label>
              <BaseSelect 
                v-model="testDriverOverride"
                :options="driverOverrideOptions"
                placeholder="Pilih driver uji coba..."
              />
            </div>

            <button 
              @click="executeTestEmail" 
              :disabled="isTesting || !testEmailTarget"
              class="w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-lg"
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
                {{ testResult.data?.provider?.toUpperCase() || testDriverOverride || config.driver }}
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

        <!-- System Architecture Highlights -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <span>🛡️</span>
            <span>Standar Kepatuhan Enterprise</span>
          </h4>
          <ul class="text-xs text-slate-600 space-y-2">
            <li class="flex items-start space-x-2">
              <span class="text-emerald-500 font-bold">✓</span>
              <span><strong>Asynchronous Non-Blocking:</strong> Pengiriman email dilakukan di latar belakang tanpa membuat antrean tiket lambat.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald-500 font-bold">✓</span>
              <span><strong>Audit Logging:</strong> Setiap email yang keluar tercatat di jejak audit database untuk bukti kepatuhan SLA.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald-500 font-bold">✓</span>
              <span><strong>Failover Redundansi:</strong> Jika provider utama mengalami kegagalan, sistem secara mulus beralih ke jalur cadangan.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const isLoading = ref(false);
const isSaving = ref(false);
const isTesting = ref(false);

const alertMessage = ref('');
const alertType = ref('success');

const config = ref({
  driver: 'gmail',
  fromName: 'PT Global Transformasi Teknologi Helpdesk',
  fromAddress: 'wiz.fie@gmail.com',
  gmail: { user: 'wiz.fie@gmail.com', isConfigured: true },
  resend: { isConfigured: false },
  sumopod: { user: '', isConfigured: false }
});

const inputPass = ref({
  gmail: '',
  resend: '',
  sumopod: ''
});

const testEmailTarget = ref('wiz.fie@gmail.com');
const testDriverOverride = ref('');
const testResult = ref(null);

const driverOverrideOptions = computed(() => [
  { value: '', label: `Sesuai Driver Aktif Sekarang (${config.value.driver?.toUpperCase() || 'GMAIL'})`, badge: 'Default' },
  { value: 'gmail', label: 'Paksa Pakai: Gmail SMTP', subtext: 'Google OAuth/App Password', badge: 'Gmail' },
  { value: 'resend', label: 'Paksa Pakai: Resend API', subtext: 'Resend transactional HTTP API', badge: 'Resend' },
  { value: 'sumopod', label: 'Paksa Pakai: Sumopod SMTP', subtext: 'Private dedicated SMTP server', badge: 'Sumopod' },
  { value: 'mock', label: 'Paksa Pakai: Simulator (Mock)', subtext: 'Uji coba lokal tanpa kirim internet', badge: 'Mock' }
]);

function getStatusBadgeClass(driver) {
  switch (driver) {
    case 'gmail': return 'bg-blue-100 text-blue-700 border border-blue-200';
    case 'resend': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'sumopod': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'failover': return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    default: return 'bg-amber-100 text-amber-700 border border-amber-200';
  }
}

async function fetchConfig() {
  isLoading.value = true;
  try {
    const res = await api.getEmailConfig();
    if (res?.success) {
      config.value = res.data;
      if (config.value.fromAddress && !testEmailTarget.value) {
        testEmailTarget.value = config.value.fromAddress;
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
      driver: config.value.driver,
      fromName: config.value.fromName,
      fromAddress: config.value.fromAddress,
      gmail: {
        user: config.value.gmail?.user,
        pass: inputPass.value.gmail || undefined
      },
      resend: {
        apiKey: inputPass.value.resend || undefined
      },
      sumopod: {
        user: config.value.sumopod?.user,
        pass: inputPass.value.sumopod || undefined
      }
    };

    const res = await api.updateEmailConfig(payload);
    if (res?.success) {
      alertType.value = 'success';
      alertMessage.value = res.message || 'Konfigurasi gateway email berhasil diperbarui!';
      config.value = res.data;
      inputPass.value = { gmail: '', resend: '', sumopod: '' };
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
      driver: testDriverOverride.value || undefined
    });

    testResult.value = {
      success: true,
      message: res?.message || 'Email uji coba berhasil dikirim!',
      data: res?.data
    };
  } catch (err) {
    testResult.value = {
      success: false,
      message: err.message || 'Terjadi kesalahan saat pengiriman email uji coba.'
    };
  } finally {
    isTesting.value = false;
  }
}

onMounted(() => {
  fetchConfig();
});
</script>
