<template>
  <div v-if="file" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <svg v-if="isTextLog" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <span>{{ fileName }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {{ fileCategory || (isTextLog ? 'Console Log' : 'Image/Bukti') }}
              </span>
            </h4>
            <p class="text-[11px] text-slate-400">
              {{ uploader ? `Diunggah oleh ${uploader}` : 'Bukti terverifikasi digital GTT' }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')" 
          class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          title="Tutup (Esc)"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-5 overflow-y-auto flex-1 bg-slate-50 space-y-4">
        <!-- Log Viewer (Monospace Console Box) -->
        <div v-if="isTextLog" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">Format: Text Monospace (Console Output)</span>
            <div class="flex items-center space-x-2">
              <button
                @click="copyLogContent"
                class="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-all flex items-center space-x-1"
              >
                <span>{{ copied ? '✓ Tersalin!' : 'Salin Isi Log' }}</span>
              </button>
              <a
                :href="fileSrc"
                download
                class="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-all"
              >
                Unduh .txt
              </a>
            </div>
          </div>
          <div class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
            <pre>{{ logContent }}</pre>
          </div>
        </div>

        <!-- Image & Graphic Preview -->
        <div v-else class="space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">Format: Berkas Gambar Digital / Tangkapan Layar</span>
            <a
              :href="fileSrc"
              download
              class="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-all flex items-center space-x-1"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh Berkas</span>
            </a>
          </div>
          
          <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center p-3 shadow-inner min-h-[220px]">
            <img 
              :src="fileSrc" 
              :alt="fileName" 
              class="max-h-[380px] w-auto max-w-full object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>

        <!-- Storage & Security Notice -->
        <div class="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-blue-900">
          <svg class="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-[11px] leading-relaxed">
            <strong>Penyimpanan Persisten GTT:</strong> Berkas ini tersimpan aman di direktori 
            <code class="bg-blue-100/80 px-1 py-0.5 rounded text-blue-800 font-mono">backend/uploads/tickets/</code> 
            dan tidak akan terhapus saat server direstart atau dibuild ulang.
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <span class="text-slate-400 font-mono text-[11px]">
          Target: {{ ticketNumber || 'GTT Helpdesk' }}
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
import { computed, ref } from 'vue';

const props = defineProps({
  file: {
    type: [String, Object],
    default: null
  },
  ticketNumber: {
    type: String,
    default: ''
  }
});

defineEmits(['close']);

const copied = ref(false);

const fileName = computed(() => {
  if (!props.file) return '';
  if (typeof props.file === 'string') return props.file;
  return props.file.name || props.file.originalName || 'berkas';
});

const uploader = computed(() => {
  if (typeof props.file === 'object' && props.file) {
    return props.file.uploadedBy;
  }
  return null;
});

const fileCategory = computed(() => {
  if (typeof props.file === 'object' && props.file) {
    return props.file.source;
  }
  return null;
});

const isTextLog = computed(() => {
  const name = fileName.value.toLowerCase();
  return name.endsWith('.txt') || name.endsWith('.log') || name.endsWith('.rsc') || name.includes('log');
});

const fileSrc = computed(() => {
  const name = fileName.value.toLowerCase();
  if (name.includes('whatsapp') || name.includes('chat')) {
    return '/mock-attachments/whatsapp-chat-kendala.svg';
  }
  if (name.includes('502') || name.includes('gateway') || name.includes('siloam')) {
    return '/mock-attachments/error-502-bad-gateway.svg';
  }
  if (name.includes('cisco') || name.includes('tac')) {
    return '/mock-attachments/cisco-tac-ticket-confirmation.svg';
  }
  if (name.includes('ping') || name.includes('http')) {
    return '/mock-attachments/ping-http200-proof.svg';
  }
  if (name.endsWith('.txt') || name.endsWith('.log')) {
    return '/mock-attachments/kvm-console-error-log.txt';
  }
  return '/gtt-logo.png';
});

const logContent = computed(() => {
  return `[2026-09-13 03:35:12 UTC] CONSOLE KVM SESSION OPENED by Engineer: Budi Santoso
[2026-09-13 03:35:18 UTC] Interface TenGigabitEthernet1/0/10 link status: DOWN (carrier lost)
[2026-09-13 03:35:22 UTC] Interface TenGigabitEthernet1/0/10 link status: UP (10000 Mb/s Full Duplex)
[2026-09-13 03:35:29 UTC] Interface TenGigabitEthernet1/0/10 link status: DOWN (carrier lost)
[2026-09-13 03:35:40 UTC] %LINK-3-UPDOWN: Interface TenGigabitEthernet1/0/10, changed state to down
[2026-09-13 03:36:01 UTC] DIAGNOSTIC: show int transceiver detail
  - Optical Rx Power: -28.4 dBm (Threshold Low Alarm: -18.0 dBm) [CRITICAL]
  - Optical Tx Power: -2.1 dBm [NORMAL]
  - SFP Model: SFP-10G-LR Cisco Systems
  - Fault: Optic transceiver diode degradation. Hardware replacement required.`;
});

const copyLogContent = async () => {
  try {
    await navigator.clipboard.writeText(logContent.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error(err);
  }
};
</script>
