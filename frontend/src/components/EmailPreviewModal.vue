<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <span>Format & Template Email Notifikasi Otomatis</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700">
                SMTP Relay Engine (Nodemailer)
              </span>
            </h4>
            <p class="text-[11px] text-slate-400">
              Pratinjau tampilan email HTML standar korporat PT Global Transformasi Teknologi
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation Tabs for Email Templates -->
      <div class="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs">
        <button
          type="button"
          @click="activeTab = 'customer_created'"
          class="px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center space-x-1.5"
          :class="activeTab === 'customer_created' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'"
        >
          <span>1. Konfirmasi Tiket (Customer)</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'engineer_dispatch'"
          class="px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center space-x-1.5"
          :class="activeTab === 'engineer_dispatch' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'"
        >
          <span>2. Penugasan Kerja (Teknisi)</span>
        </button>

        <button
          type="button"
          @click="activeTab = 'customer_resolved'"
          class="px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center space-x-1.5"
          :class="activeTab === 'customer_resolved' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'"
        >
          <span>3. Berita Acara Selesai (Customer)</span>
        </button>
      </div>

      <!-- Modal Body (Email Envelope & Rendered HTML Box) -->
      <div class="p-5 overflow-y-auto flex-1 bg-slate-200/60 space-y-3">
        <!-- Envelope Headers (To, From, Subject) -->
        <div class="bg-white border border-slate-200 rounded-xl p-3 text-xs space-y-1.5 shadow-sm">
          <div class="flex items-center text-slate-600">
            <span class="w-20 font-bold text-slate-400 text-[11px]">Pengirim:</span>
            <span class="font-mono text-slate-800 font-semibold">GTT Helpdesk Dispatch &lt;helpdesk-noreply@glotra.co.id&gt;</span>
          </div>
          <div class="flex items-center text-slate-600">
            <span class="w-20 font-bold text-slate-400 text-[11px]">Penerima:</span>
            <span class="font-mono text-blue-700 font-bold">{{ emailMeta.recipient }}</span>
          </div>
          <div class="flex items-center text-slate-600">
            <span class="w-20 font-bold text-slate-400 text-[11px]">Subjek:</span>
            <span class="font-bold text-slate-900">{{ emailMeta.subject }}</span>
          </div>
        </div>

        <!-- Rendered Corporate HTML Email Card -->
        <div class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden font-sans">
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
                  <span class="text-slate-400 block">Petugas CPIG:</span>
                  <span class="font-medium text-slate-700">Rina Anggraini (Helpdesk Staff)</span>
                </div>
              </div>

              <div class="pt-1">
                <span class="text-slate-400 block text-[11px]">Rincian Gejala:</span>
                <p class="font-medium text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                  {{ ticket.title }} - {{ ticket.description }}
                </p>
              </div>

              <!-- SLA Target Commitment -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-950 flex items-start space-x-2">
                <span class="font-bold">Target Komitmen SLA:</span>
                <div>
                  <span>Batas Waktu Respon Teknisi: <strong>{{ formatTime(ticket.responseDeadline).local }}</strong></span>
                  <span class="mx-1.5">•</span>
                  <span>Batas Waktu Pemulihan (Resolution): <strong>{{ formatTime(ticket.resolutionDeadline).local }}</strong></span>
                </div>
              </div>

              <!-- Specific Section for Resolved Email -->
              <div v-if="activeTab === 'customer_resolved'" class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1.5 text-emerald-900 mt-2">
                <span class="font-bold text-xs flex items-center space-x-1">
                  <span>✓ Rangkuman Solusi Perbaikan Teknis:</span>
                </span>
                <p class="text-[11px]"><strong>Akar Masalah (Root Cause):</strong> {{ ticket.rootCause || 'Kerusakan hardware transceiver optik SFP port 10.' }}</p>
                <p class="text-[11px]"><strong>Tindakan Perbaikan (Action Taken):</strong> {{ ticket.actionTaken || 'Penggantian module optik baru dan pengujian uplink stabil.' }}</p>
                <p class="text-[10px] text-emerald-700 italic pt-1 border-t border-emerald-200">
                  * Penghitungan Resolution SLA resmi berhenti pada {{ formatTime(ticket.resolvedAt || ticket.updatedAt).local }}. Tiket memiliki masa sanggah 72 jam sebelum ditutup permanen.
                </p>
              </div>
            </div>

            <!-- Action Button Mockup (Clickable Link to Customer Tracking Portal) -->
            <div class="py-2 text-center">
              <router-link
                :to="`/track/${ticket.ticketNumber}?token=${ticket.trackingToken}`"
                target="_blank"
                class="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all"
              >
                {{ emailMeta.buttonText }} &rarr;
              </router-link>
              <p class="text-[10px] text-slate-400 mt-1 font-mono">
                Tautan Asli Email: /track/{{ ticket.ticketNumber }}?token={{ ticket.trackingToken }} (Anti-IDOR Secured)
              </p>
            </div>

            <!-- Instructions -->
            <p class="text-[11px] text-slate-500 italic">
              {{ emailMeta.footerNote }}
            </p>
          </div>

          <!-- Email Standard Footer -->
          <div class="bg-slate-100 px-6 py-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p class="font-bold text-slate-700">PT Global Transformasi Teknologi (Glotra Technology)</p>
            <p>Enterprise IT Support & Managed Network Services • <em>"Think it, Solve it"</em></p>
            <p>Hotline Call Center / WA Darurat 24x7: +62 21-555-GLOTRA (4568) • Email: support@glotra.co.id</p>
            <p class="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
              Email ini dikirim secara otomatis oleh sistem GTT Helpdesk Ticketing. Mohon tidak membalas langsung ke alamat noreply ini.
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Modal -->
      <div class="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <span class="text-slate-500 font-mono text-[11px]">
          Engine Template: HTML Responsive Inline CSS (Nodemailer Transporter)
        </span>
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold shadow-sm transition-all"
        >
          Tutup Pratinjau
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatUtcToLocal } from '../utils/dateFormatter';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
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

const activeTab = ref('customer_created');

const formatTime = (t) => formatUtcToLocal(t);

const getSlaSummary = (sev) => {
  if (sev === 'HIGH') return 'Target Respon 30m / Resolusi 4j';
  if (sev === 'MEDIUM') return 'Target Respon 1j / Resolusi 8j';
  return 'Target Respon 2j / Resolusi 24j';
};

const emailMeta = computed(() => {
  if (activeTab.value === 'customer_created') {
    return {
      recipient: `${props.pic.name || 'Bpk. Kevin Pratama'} <${props.pic.email || 'kevin.p@bca.co.id'}>`,
      subject: `[TICKET #${props.ticket.ticketNumber}] Konfirmasi Penerimaan Laporan Gangguan - PT GTT`,
      greeting: `Yth. ${props.pic.name || 'Bpk. Kevin Pratama'} (${props.customer.name || 'PT Bank Central Asia Tbk'}),`,
      intro: `Terima kasih telah menghubungi Helpdesk PT Global Transformasi Teknologi. Laporan kendala Anda telah kami terima dan dicatat ke dalam sistem dengan rincian berikut:`,
      buttonText: `Lihat Status Penanganan Tiket`,
      footerNote: `Teknisi kami segera merespon tiket Anda sesuai komitmen SLA. Untuk eskalasi mendesak, Anda dapat menghubungi hotline 24x7 kami.`
    };
  } else if (activeTab.value === 'engineer_dispatch') {
    return {
      recipient: `${props.engineer.name || 'Budi Santoso'} <budi.santoso@glotra.co.id>`,
      subject: `[DISPATCH ALERT] Penugasan Tiket Baru: #${props.ticket.ticketNumber} (${props.ticket.severity})`,
      greeting: `Halo ${props.engineer.name || 'Budi Santoso'},`,
      intro: `Anda telah ditugaskan untuk menangani insiden teknis baru dari klien ${props.customer.name || 'BCA'}. Harap segera melakukan respon dan membuka investigasi sebelum batas Response SLA berakhir.`,
      buttonText: `Buka Lembar Kerja Tiket`,
      footerNote: `Pastikan setiap tindakan pemeriksaan dicatat pada Checkpoint Milestones dan melampirkan berkas bukti (KVM log / screenshot).`
    };
  } else {
    return {
      recipient: `${props.pic.name || 'Bpk. Kevin Pratama'} <${props.pic.email || 'kevin.p@bca.co.id'}>`,
      subject: `[RESOLVED] Pemberitahuan Penyelesaian Kendala: #${props.ticket.ticketNumber} - PT GTT`,
      greeting: `Yth. ${props.pic.name || 'Bpk. Kevin Pratama'} (${props.customer.name || 'PT Bank Central Asia Tbk'}),`,
      intro: `Dengan hormat kami informasikan bahwa perbaikan teknis terkait laporan Anda telah selesai dilaksanakan oleh tim engineer GTT. Layanan Anda saat ini telah pulih normal.`,
      buttonText: `Konfirmasi Kepuasan Layanan`,
      footerNote: `Tiket ini berstatus RESOLVED dan memiliki masa validasi 72 jam (3x24 jam). Jika tidak ada kendala lanjutan, tiket otomatis ditutup (CLOSED).`
    };
  }
});
</script>
