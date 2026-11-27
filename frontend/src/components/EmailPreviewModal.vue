<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl 2xl:max-w-6xl overflow-hidden flex flex-col h-[94vh] max-h-[94vh] transition-all">
      <!-- Header -->
      <div class="bg-slate-900 dark:bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <span>{{ headerTitle }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700">
                Trigger Manual
              </span>
            </h4>
            <p class="text-[11px] text-slate-400">
              Pratinjau tampilan email korporat PT Global Transformasi Teknologi
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation & Mode Bar -->
      <div class="bg-slate-100 dark:bg-slate-800/80 px-6 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between overflow-x-auto text-xs shrink-0">
        <!-- Target All: Show switcher tabs -->
        <div v-if="props.target === 'all'" class="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            @click="activeTab = 'customer_email'"
            class="px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
            :class="activeTab === 'customer_email' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'"
          >
            <span>1. Email Klien (Tiket & Tracking)</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'engineer_dispatch'"
            class="px-3.5 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
            :class="activeTab === 'engineer_dispatch' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'"
          >
            <span>2. Penugasan Kerja (Teknisi)</span>
          </button>
        </div>

        <!-- Target Specific: Show target label -->
        <div v-else class="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full" :class="activeTab === 'engineer_dispatch' ? 'bg-amber-500' : 'bg-blue-600'"></span>
          <span>{{ activeTab === 'engineer_dispatch' ? 'Email Notifikasi Penugasan Teknisi Lapangan / NOC' : 'Satu Email Resmi Klien (Tautan Tracking & Konfirmasi Mandiri)' }}</span>
        </div>

        <!-- Simulation Toggle for Customer Email View (Progress vs Resolved) -->
        <div v-if="activeTab === 'customer_email'" class="flex items-center space-x-1.5 shrink-0 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
          <span class="text-slate-400 font-medium">Mode Pratinjau:</span>
          <button 
            type="button" 
            @click="simulatedStatus = 'IN_PROGRESS'" 
            class="px-2.5 py-0.5 rounded font-semibold cursor-pointer transition-colors"
            :class="currentStatusMode === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
          >
            Saat Diproses
          </button>
          <span class="text-slate-300 dark:text-slate-600">|</span>
          <button 
            type="button" 
            @click="simulatedStatus = 'RESOLVED'" 
            class="px-2.5 py-0.5 rounded font-semibold cursor-pointer transition-colors"
            :class="currentStatusMode === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
          >
            Saat Selesai (BAP)
          </button>
        </div>
      </div>

      <!-- Modal Body (Email Envelope & Rendered HTML Box) -->
      <div class="p-5 md:p-6 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/80 space-y-4">
        <!-- Envelope Headers (To, From, Subject) -->
        <div class="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 text-xs space-y-2 shadow-xs max-w-4xl mx-auto">
          <div class="flex items-center text-slate-600 dark:text-slate-300">
            <span class="w-20 font-bold text-slate-400 text-[11px]">Pengirim:</span>
            <span class="font-mono text-slate-800 dark:text-slate-200 font-semibold">PT Global Transformasi Teknologi (No-Reply) &lt;noreply@gtteknologi.com&gt;</span>
          </div>
          <div class="flex items-center text-slate-600 dark:text-slate-300">
            <span class="w-20 font-bold text-slate-400 text-[11px]">Penerima:</span>
            <span class="font-mono text-blue-700 dark:text-blue-400 font-bold">{{ emailMeta.recipient }}</span>
          </div>
          <div class="flex items-center text-slate-600 dark:text-slate-300">
            <span class="w-20 font-bold text-slate-400 text-[11px]">Subjek:</span>
            <span class="font-bold text-slate-900 dark:text-slate-100">{{ emailMeta.subject }}</span>
          </div>
        </div>

        <!-- Rendered Corporate HTML Email Card -->
        <div class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden font-sans max-w-4xl mx-auto">
          <!-- Email Brand Header -->
          <div class="bg-slate-900 px-6 py-4 flex items-center justify-between border-b-4 border-blue-600">
            <div class="flex items-center space-x-3">
              <img src="/gtt-logo.png" alt="GTT Logo" class="h-9 w-auto bg-white p-1 rounded" />
              <div>
                <span class="font-bold text-sm text-white block tracking-wide">PT GLOBAL TRANSFORMASI TEKNOLOGI</span>
                <span class="text-[10px] text-blue-400 font-mono">Service Operations Center (SOC) • Hotline 24x7</span>
              </div>
            </div>
            <span class="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
              {{ ticket.ticketNumber }}
            </span>
          </div>

          <!-- Email Content Body -->
          <div class="p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
            <!-- Greeting -->
            <p class="text-sm font-semibold text-slate-900">
              {{ emailMeta.greeting }}
            </p>

            <p>
              {{ emailMeta.intro }}
            </p>

            <!-- Case Summary Highlight Box -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div class="flex items-center justify-between border-b border-slate-200 pb-2">
                <span class="font-bold text-slate-900 text-xs">Informasi Insiden / Permasalahan</span>
                <span 
                  class="font-bold text-[10px] px-2 py-0.5 rounded uppercase"
                  :class="ticket.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800 border border-amber-300'"
                >
                  Severity: {{ ticket.severity }} ({{ getSlaSummary(ticket.severity) }})
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span class="text-slate-400 block">Nomor Tiket:</span>
                  <span class="font-mono font-bold text-slate-800 text-xs">{{ ticket.ticketNumber }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Klien Perusahaan:</span>
                  <span class="font-bold text-slate-800">{{ customer.name }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Waktu Laporan Diterima:</span>
                  <span class="font-medium text-slate-700">{{ formatTime(ticket.createdAt).local }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Status Penanganan:</span>
                  <span class="font-bold" :class="isCurrentResolved ? 'text-emerald-700' : 'text-blue-700'">
                    {{ isCurrentResolved ? 'RESOLVED (Perbaikan Selesai)' : (ticket.status || 'IN_PROGRESS') }}
                  </span>
                </div>
              </div>

              <div class="pt-1">
                <span class="text-slate-400 block text-[11px]">Uraian Kendala:</span>
                <p class="font-medium text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                  {{ ticket.title }} - {{ ticket.description }}
                </p>
              </div>

              <!-- SLA Target Commitment (During in-progress) -->
              <div v-if="!isCurrentResolved" class="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-950 flex items-start space-x-2">
                <span class="font-bold shrink-0">Target Komitmen SLA:</span>
                <div>
                  <span>Batas Waktu Respon Teknisi: <strong>{{ formatTime(ticket.responseDeadline).local }}</strong></span>
                  <span class="mx-1.5">•</span>
                  <span>Batas Waktu Pemulihan (Resolution): <strong>{{ formatTime(ticket.resolutionDeadline).local }}</strong></span>
                </div>
              </div>

              <!-- Specific Section when Resolved (BAP Result - High-level & Aman dari Kebocoran Data Perusahaan) -->
              <div v-if="isCurrentResolved" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 space-y-1.5 text-emerald-900 mt-2">
                <span class="font-bold text-xs flex items-center space-x-1.5 text-emerald-800">
                  <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Berita Acara Pemulihan (BAP):</span>
                </span>
                <p class="text-[11px]"><strong>Status Pemulihan:</strong> Layanan operasional telah berhasil dipulihkan normal dan pengujian verifikasi telah tuntas dilaksanakan oleh tim teknisi GTT.</p>
                <p class="text-[11px]"><strong>Progres:</strong> 100% Selesai (Masa Verifikasi &amp; Pemantauan Stabilitas 72 Jam)</p>
                <p class="text-[10px] text-emerald-700 italic pt-1 border-t border-emerald-200">
                  * Penghitungan Resolution SLA resmi berhenti pada {{ formatTime(ticket.resolvedAt || ticket.updatedAt).local }}. Tiket memiliki masa verifikasi 72 jam sebelum ditutup permanen. Catatan teknis mendalam tersimpan aman di sistem helpdesk internal demi perlindungan kerahasiaan infrastruktur.
                </p>
              </div>
            </div>

            <!-- Action Button Khusus Email Klien (Tautan Portal Tracking Mandiri Anti-IDOR Tanpa Perlu Login) -->
            <div v-if="activeTab === 'customer_email'" class="py-3 text-center">
              <router-link
                :to="trackingUrl"
                target="_blank"
                class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-xs"
              >
                {{ emailMeta.buttonText }} &rarr;
              </router-link>
              <p class="text-[10px] text-slate-400 mt-1.5 font-mono">
                Tautan Asli Email: {{ trackingUrl }} (Anti-IDOR Secured Tanpa Perlu Login)
              </p>
            </div>

            <!-- Petunjuk Masuk untuk Teknisi (Email Murni Sebagai Alert Penugasan Cepat) -->
            <div v-else class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] leading-relaxed flex items-center gap-2.5">
              <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span><strong>Petunjuk Teknisi:</strong> Email ini merupakan notifikasi penugasan resmi (dispatch alert). Silakan login ke aplikasi Helpdesk GTT untuk mulai menangani tiket, menahan/melanjutkan SLA, dan mencatat milestone penanganan.</span>
            </div>

            <!-- Instructions -->
            <p class="text-[11px] text-slate-500 italic">
              {{ emailMeta.footerNote }}
            </p>

            <!-- No-Reply Warning Callout Box -->
            <div class="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center text-[11px] text-amber-900 leading-relaxed space-y-1 mt-3">
              <span class="font-bold flex items-center justify-center gap-1.5 text-amber-800">
                <svg class="w-3.5 h-3.5 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                Pemberitahuan Sistem (No-Reply)
              </span>
              <p>
                Email ini dikirim secara otomatis oleh sistem helpdesk GTT dan alamat ini <u>tidak dapat menerima pesan balasan</u>. Mohon untuk tidak membalas email ini secara langsung. Jika membutuhkan bantuan atau informasi lebih lanjut, silakan hubungi telepon kantor kami di <strong>(021) 2960-7307</strong> atau email resmi <strong>sales@gtteknologi.com</strong>.
              </p>
            </div>
          </div>

          <!-- Email Standard Footer -->
          <div class="bg-slate-100 px-6 py-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p class="font-bold text-slate-700">PT Global Transformasi Teknologi (Glotra Technology)</p>
            <p>Telepon Kantor: <strong class="text-slate-700">(021) 2960-7307</strong> • Email Resmi: <strong class="text-slate-700">sales@gtteknologi.com</strong></p>
            <p>Alamat Kantor: Prudential Center Kota Kasablanka Lt. 22 Unit A, Jl. Casablanca Kav. 88, Jakarta Selatan 12870</p>
            <p class="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
              Pemberitahuan: Alamat pengirim noreply@gtteknologi.com merupakan saluran satu arah (no-reply) khusus untuk distribusi notifikasi sistem dan tidak dipantau untuk email masuk.
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Modal -->
      <div class="bg-white dark:bg-slate-900 px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <span class="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          {{ activeTab === 'engineer_dispatch' ? 'Template Penugasan Kerja Teknisi' : 'Satu Email Customer Serbaguna (Tracking & Konfirmasi)' }}
        </span>
        <div class="flex items-center gap-2">
          <router-link
            v-if="activeTab === 'customer_email'"
            :to="trackingUrl"
            target="_blank"
            class="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-700/60 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
            title="Buka tampilan pemantauan mandiri pelanggan di tab baru"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            <span>Buka Portal Monitoring Mandiri</span>
          </router-link>
          <button 
            @click="$emit('close')" 
            class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold shadow-sm transition-all cursor-pointer dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatUtcToLocal } from '../utils/dateFormatter';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  target: {
    type: String,
    default: 'all' // 'customer' | 'engineer' | 'all'
  },
  ticket: {
    type: Object,
    required: true
  },
  customer: {
    type: Object,
    default: () => ({})
  },
  pic: {
    type: Object,
    default: () => ({})
  },
  engineer: {
    type: Object,
    default: () => ({})
  }
});

defineEmits(['close']);

const activeTab = ref(props.target === 'engineer' ? 'engineer_dispatch' : 'customer_email');
const simulatedStatus = ref(null);

watch(() => props.target, (val) => {
  if (val === 'engineer') {
    activeTab.value = 'engineer_dispatch';
  } else {
    activeTab.value = 'customer_email';
  }
}, { immediate: true });

const headerTitle = computed(() => {
  if (props.target === 'engineer') return 'Pratinjau Format Email Penugasan Teknisi';
  if (props.target === 'customer') return 'Pratinjau Format Email Resmi Klien';
  return 'Format & Template Email Notifikasi Resmi';
});

const isCurrentResolved = computed(() => {
  if (simulatedStatus.value) return simulatedStatus.value === 'RESOLVED';
  return ['RESOLVED', 'CLOSED'].includes(props.ticket?.status);
});

const trackingToken = computed(() => {
  return props.ticket?.trackingToken || 'token_pelacakan';
});

const trackingUrl = computed(() => {
  const num = props.ticket?.ticketNumber || 'TK-26000';
  return `/track/${num}?token=${trackingToken.value}`;
});

const currentStatusMode = computed(() => {
  return isCurrentResolved.value ? 'RESOLVED' : 'IN_PROGRESS';
});

const formatTime = (t) => formatUtcToLocal(t);

const getSlaSummary = (sev) => {
  if (sev === 'HIGH') return 'Target Respon 30m / Resolusi 4j';
  if (sev === 'MEDIUM') return 'Target Respon 1j / Resolusi 8j';
  return 'Target Respon 2j / Resolusi 24j';
};

const emailMeta = computed(() => {
  if (activeTab.value === 'customer_email') {
    if (isCurrentResolved.value) {
      return {
        recipient: `${props.pic.name || 'PIC Pelanggan'} <${props.pic.email || 'pic@perusahaan.com'}>`,
        subject: `[TICKET #${props.ticket.ticketNumber}] Pemulihan Selesai: ${props.ticket.title || 'Laporan Gangguan'}`,
        greeting: `Yth. ${props.pic.name || 'PIC Pelanggan'} (${props.customer.name || 'Mitra Pelanggan'}),`,
        intro: `Dengan hormat kami informasikan bahwa perbaikan teknis terkait laporan Anda telah berhasil diselesaikan oleh tim engineer GTT. Layanan Anda saat ini telah pulih normal.`,
        buttonText: `Verifikasi Hasil & Konfirmasi Selesai`,
        footerNote: `Tiket berstatus RESOLVED dan memiliki masa pemantauan 72 jam. Anda dapat memverifikasi operasional dan mengonfirmasi penyelesaian tuntas secara mandiri melalui tombol di atas.`
      };
    } else {
      return {
        recipient: `${props.pic.name || 'PIC Pelanggan'} <${props.pic.email || 'pic@perusahaan.com'}>`,
        subject: `[TICKET #${props.ticket.ticketNumber}] Konfirmasi Penerimaan Laporan Gangguan - PT GTT`,
        greeting: `Yth. ${props.pic.name || 'PIC Pelanggan'} (${props.customer.name || 'Mitra Pelanggan'}),`,
        intro: `Terima kasih telah menghubungi Helpdesk PT Global Transformasi Teknologi. Laporan kendala Anda telah kami terima dan dicatat ke dalam sistem dengan rincian berikut:`,
        buttonText: `Buka Portal Tracking Mandiri`,
        footerNote: `Simpan tautan di atas untuk memantau progres langsung teknisi kami. Ketika perbaikan selesai, Anda dapat langsung mengonfirmasi penutupan tiket di portal tersebut.`
      };
    }
  } else {
    return {
      recipient: `${props.engineer.name || 'Teknisi Helpdesk'} <engineer@perusahaan.com>`,
      subject: `[DISPATCH ALERT] Penugasan Tiket Baru: #${props.ticket.ticketNumber} (${props.ticket.severity})`,
      greeting: `Halo ${props.engineer.name || 'Teknisi Helpdesk'},`,
      intro: `Anda telah ditugaskan untuk menangani insiden teknis baru dari klien ${props.customer.name || 'Mitra Pelanggan'}. Harap segera melakukan respon dan membuka investigasi sebelum batas Response SLA berakhir.`,
      buttonText: ``,
      footerNote: `Pastikan setiap tindakan pemeriksaan dicatat pada Checkpoint Milestones dan melampirkan berkas bukti (KVM log / screenshot).`
    };
  }
});
</script>
