<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans">
    <!-- Public Header (Customer Portal) -->
    <header class="bg-slate-900 text-white border-b-4 border-blue-600 shadow-md">
      <div class="max-w-5xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center space-x-3">
          <img src="/gtt-logo.png" alt="GTT Logo" class="h-9 w-auto bg-white p-1 rounded" />
          <div>
            <span class="font-bold text-sm tracking-wide block">PT GLOBAL TRANSFORMASI TEKNOLOGI</span>
            <span class="text-[11px] text-blue-400 font-mono">Portal Pemantauan Tiket Mandiri (Customer Self-Service)</span>
          </div>
        </div>

        <div class="flex items-center space-x-3 text-xs">
          <a
            href="https://wa.me/6281200000000"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
          >
            <span>WhatsApp Helpdesk 24x7</span>
          </a>
          <span class="text-slate-400 text-[11px] flex items-center space-x-1">
            <svg class="w-3.5 h-3.5 text-emerald-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="text-slate-300 font-mono">Enkripsi 256-bit</span>
          </span>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6">
      <!-- State 1: Ticket Not Found in Database -->
      <div v-if="!ticket" class="max-w-lg mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-xl text-center space-y-4 animate-in fade-in">
        <div class="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-2xl font-bold">
          ?
        </div>
        <div class="space-y-1.5">
          <span class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
            404 - Tiket Tidak Terdaftar
          </span>
          <h2 class="font-bold text-slate-900 text-lg">Nomor Tiket Tidak Ditemukan</h2>
          <p class="text-xs text-slate-500 leading-relaxed">
            Nomor tiket <strong class="text-slate-700">#{{ ticketNumber }}</strong> tidak terdaftar dalam database sistem Helpdesk GTT.
          </p>
        </div>
        <div class="pt-2 text-xs text-slate-500">
          Periksa kembali format nomor tiket atau hubungi Hotline Support 24x7 di <strong class="text-blue-600">+62 21-555-GLOTRA</strong>.
        </div>
      </div>

      <!-- State 2: Ticket Found, but Token is Missing / Invalid (Anti-IDOR Security Guard) -->
      <div v-else-if="!isTokenValid" class="max-w-lg mx-auto my-16 p-8 bg-white border border-rose-200 rounded-3xl shadow-xl text-center space-y-4 animate-in fade-in duration-200">
        <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        
        <div class="space-y-2">
          <span class="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 uppercase">
            Tautan Tidak Sah (Security Check Failed)
          </span>
          <h2 class="font-bold text-slate-900 text-lg">Akses Pelacakan Memerlukan Token Resmi</h2>
          <p class="text-xs text-slate-600 leading-relaxed">
            Sistem keamanan GTT mendeteksi bahwa tautan ini tidak menyertakan <strong>Token Otentikasi Digital</strong> yang valid dari email resmi PT Global Transformasi Teknologi.
          </p>
          
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-600 space-y-2 mt-2">
            <span class="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">Kebijakan Perlindungan Data (Anti-IDOR):</span>
            <p class="text-[11px] leading-relaxed text-slate-500">
              Untuk mencegah pihak eksternal memanipulasi nomor tiket di URL dan mengintip data insiden perusahaan lain, halaman status pelanggan <strong>hanya dapat dibuka melalui tautan asli</strong> yang dikirimkan ke email PIC pelapor.
            </p>
            <p class="text-[11px] text-blue-700 font-semibold pt-2 border-t border-slate-200">
              Silakan klik tombol <em>"Lihat Status Penanganan Tiket"</em> langsung dari email notifikasi laporan Anda.
            </p>
          </div>
        </div>

        <div class="pt-2 text-xs text-slate-500">
          Butuh bantuan eskalasi? Hubungi Hotline Call Center 24x7 kami di <strong class="text-blue-600">+62 21-555-GLOTRA (4568)</strong>.
        </div>
      </div>

      <!-- State 3: Token Valid & Ticket Found -> Render Full Tracking View -->
      <div v-else class="space-y-6 animate-in fade-in duration-200">
        <!-- Top Alert Status Banner -->
        <div 
          class="rounded-2xl p-5 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          :class="statusBannerClass"
        >
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm" :class="statusBadgeClass">
                {{ humanReadableStatus }}
              </span>
              <span class="text-xs font-mono text-slate-500 font-bold">#{{ ticket.ticketNumber }}</span>
              <span class="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                ✓ Token Terverifikasi
              </span>
            </div>
            <h1 class="text-lg md:text-xl font-bold text-slate-900 mt-1">
              {{ ticket.title }}
            </h1>
            <p class="text-xs text-slate-600">
              Laporan dari <strong>{{ customer.name }}</strong> • Pelapor: <strong>{{ pic.name }}</strong>
            </p>
          </div>

          <!-- Right: SLA Safe/Timer Indicator & Share Button -->
          <div class="flex flex-col sm:items-end space-y-2 shrink-0">
            <div class="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 text-xs space-y-1 w-full sm:w-auto">
              <span class="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Target Pemulihan Layanan (SLA)</span>
              <p class="font-bold text-slate-900 text-sm">
                {{ formatTime(ticket.resolutionDeadline).local }}
              </p>
              <span class="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                <span>✓ Komitmen Layanan 24x7 Aktif</span>
              </span>
            </div>

            <!-- Share Link Button for Customer Team -->
            <button
              type="button"
              @click="copyShareLink"
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-all"
              title="Salin tautan resmi bertoken ini untuk dibagikan kepada rekan tim internal Anda"
            >
              <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              <span>{{ copiedLink ? '✓ Tautan Tim Tersalin!' : 'Bagikan ke Tim Anda' }}</span>
            </button>
          </div>
        </div>

        <!-- 2-Column Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: Milestone Step Tracker (Resi Tracking Pelanggan) -->
          <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 class="font-bold text-slate-900 text-sm">Alur Progres Penanganan (Live Tracking)</h2>
                <p class="text-xs text-slate-500">Tahapan penanganan langsung dari tim teknisi GTT</p>
              </div>
              <span class="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Live Update
              </span>
            </div>

            <!-- Stepper Timeline -->
            <div class="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              <div 
                v-for="(step, index) in ticket.milestones" 
                :key="step.id"
                class="relative flex items-start space-x-4 group"
              >
                <!-- Circle Node -->
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-sm"
                  :class="index === ticket.milestones.length - 1 ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-emerald-600 text-white'"
                >
                  <span v-if="index < ticket.milestones.length - 1">✓</span>
                  <span v-else>{{ index + 1 }}</span>
                </div>

                <!-- Step Info Box -->
                <div class="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 shadow-sm">
                  <div class="flex flex-wrap items-center justify-between gap-1">
                    <h3 class="font-bold text-xs text-slate-900">{{ step.stepName }}</h3>
                    <span class="text-[10px] font-mono text-slate-500">{{ formatTime(step.timestampUtc).local }}</span>
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed font-sans">
                    {{ step.notes }}
                  </p>
                  <div v-if="step.actorName" class="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                    Petugas: <span class="font-medium text-slate-600">{{ step.actorName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resolved / Auto-Close 72h Notice -->
            <div v-if="ticket.status === 'RESOLVED'" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
              <h4 class="font-bold flex items-center space-x-1.5 text-sm text-emerald-900">
                <span>✓ Perbaikan Teknis Selesai Dilaksanakan</span>
              </h4>
              <p class="leading-relaxed text-emerald-800">
                Layanan Anda telah dinyatakan pulih normal oleh tim teknisi GTT. Tiket saat ini memasuki masa pemantauan stabilitas selama <strong>72 Jam (3x24 Jam)</strong>.
              </p>
              <div class="pt-2 flex flex-wrap gap-2">
                <button 
                  @click="confirmCustomerSatisfaction"
                  class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all"
                >
                  Konfirmasi Layanan Normal & Selesai
                </button>
                <a 
                  href="https://wa.me/6281200000000?text=Halo%20Helpdesk%20GTT,%20kendala%20pada%20tiket%20masih%20berlanjut"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200 shadow-sm transition-all"
                >
                  Laporkan Kendala Masih Ada
                </a>
              </div>
            </div>
          </div>

          <!-- Right Column: Summary & Contact Helpdesk -->
          <div class="space-y-6">
            <!-- Information Card -->
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5 text-xs">
              <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Rincian Laporan</h3>
              
              <div class="space-y-2 text-slate-700">
                <div>
                  <span class="text-slate-400 block text-[11px]">Nomor Referensi:</span>
                  <span class="font-mono font-bold text-slate-900 text-sm">{{ ticket.ticketNumber }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px]">Waktu Pengaduan:</span>
                  <span class="font-medium">{{ formatTime(ticket.createdAt).local }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px]">Kategori Gangguan:</span>
                  <span class="font-semibold text-slate-800">{{ getCategoryName(ticket.categoryId) }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[11px]">Saluran Pelaporan:</span>
                  <span class="font-medium text-slate-800">{{ ticket.channel }} Hotline</span>
                </div>
                <div v-if="ticket.rootCause" class="pt-2 border-t border-slate-100">
                  <span class="text-emerald-700 font-bold block text-[11px]">Akar Masalah (Root Cause):</span>
                  <p class="text-slate-700 bg-emerald-50/50 p-2 rounded border border-emerald-100 mt-1">
                    {{ ticket.rootCause }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Customer Service Contact Card -->
            <div class="bg-blue-900 text-white rounded-2xl p-5 shadow-md space-y-3 text-xs">
              <h3 class="font-bold text-sm text-blue-200">Bantuan & Eskalasi 24x7</h3>
              <p class="text-blue-100 text-[11px] leading-relaxed">
                Jika membutuhkan bantuan cepat atau memiliki pertanyaan mengenai tiket ini, hubungi kontak resmi helpdesk GTT:
              </p>
              <div class="space-y-2 pt-1 font-mono text-[11px]">
                <div class="bg-blue-950/60 p-2.5 rounded-lg border border-blue-800">
                  <span class="text-blue-300 block text-[10px]">Call Center / Hotline:</span>
                  <span class="font-bold text-white text-xs">+62 21-555-GLOTRA (4568)</span>
                </div>
                <div class="bg-blue-950/60 p-2.5 rounded-lg border border-blue-800">
                  <span class="text-blue-300 block text-[10px]">Email Dispatch:</span>
                  <span class="font-bold text-white text-xs">support@glotra.co.id</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Public Footer -->
    <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
      <p>&copy; 2026 PT Global Transformasi Teknologi (Glotra Technology). All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTicketStore } from '../stores/ticketStore';
import { formatUtcToLocal } from '../utils/dateFormatter';

const route = useRoute();
const ticketStore = useTicketStore();

const ticketNumber = computed(() => route.params.ticketNumber);

const ticket = computed(() => {
  return ticketStore.tickets.find(t => t.ticketNumber === ticketNumber.value);
});

const routeToken = computed(() => route.query.token);

const isTokenValid = computed(() => {
  if (!ticket.value) return false;
  // Strictly check that token is provided in URL query and matches ticket's trackingToken
  return Boolean(routeToken.value && routeToken.value === ticket.value.trackingToken);
});

const customer = computed(() => {
  if (!ticket.value) return {};
  return ticketStore.customers.find(c => c.id === ticket.value.customerId) || {};
});

const pic = computed(() => {
  if (!customer.value || !customer.value.pics) return {};
  return customer.value.pics.find(p => p.id === ticket.value.customerPicId) || customer.value.pics[0] || {};
});

const formatTime = (t) => formatUtcToLocal(t);

const getCategoryName = (id) => {
  const cat = ticketStore.categories.find(c => c.id === id);
  return cat ? cat.name : 'Network & Infrastructure';
};

const humanReadableStatus = computed(() => {
  if (!ticket.value) return '';
  switch (ticket.value.status) {
    case 'OPEN': return 'Laporan Diterima (Menunggu Antrian)';
    case 'ASSIGNED': return 'Teknisi Ditugaskan';
    case 'IN_PROGRESS': return 'Sedang Dikerjakan oleh Teknisi';
    case 'PENDING_VENDOR': return 'Menunggu Konfirmasi / Sparepart Vendor';
    case 'PENDING_CUSTOMER': return 'Menunggu Data Tambahan dari Pelapor';
    case 'RESOLVED': return 'Perbaikan Selesai (Masa Pemantauan 72 Jam)';
    case 'CLOSED': return 'Tiket Ditutup Tuntas';
    default: return ticket.value.status;
  }
});

const statusBadgeClass = computed(() => {
  if (!ticket.value) return 'bg-slate-500 text-white';
  switch (ticket.value.status) {
    case 'OPEN': return 'bg-amber-500 text-white';
    case 'ASSIGNED': return 'bg-indigo-600 text-white';
    case 'IN_PROGRESS': return 'bg-blue-600 text-white';
    case 'PENDING_VENDOR':
    case 'PENDING_CUSTOMER': return 'bg-orange-500 text-white';
    case 'RESOLVED': return 'bg-emerald-600 text-white';
    case 'CLOSED': return 'bg-slate-600 text-white';
    default: return 'bg-slate-500 text-white';
  }
});

const statusBannerClass = computed(() => {
  if (!ticket.value) return 'bg-white border-slate-200';
  switch (ticket.value.status) {
    case 'RESOLVED': return 'bg-emerald-50/70 border-emerald-200';
    case 'IN_PROGRESS': return 'bg-blue-50/70 border-blue-200';
    default: return 'bg-white border-slate-200';
  }
});

const confirmCustomerSatisfaction = () => {
  alert('Terima kasih! Konfirmasi Anda telah dicatat. Tiket akan diarsipkan sebagai CLOSED.');
};

// Share Link to Customer Internal Team
const copiedLink = ref(false);

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copiedLink.value = true;
    setTimeout(() => { copiedLink.value = false; }, 2500);
  } catch (err) {
    console.error('Failed to copy share link:', err);
  }
};
</script>
