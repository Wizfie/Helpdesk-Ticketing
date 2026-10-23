<template>
  <div v-if="activeFile" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center space-x-2.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <svg v-if="isTextLog" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <svg v-else-if="isPdf" class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="min-w-0">
            <h4 class="font-bold text-sm text-slate-100 flex items-center space-x-2 truncate">
              <span class="truncate">{{ fileName }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                {{ fileCategory || (isTextLog ? 'Console Log' : (isPdf ? 'Dokumen PDF' : 'Image/Bukti')) }}
              </span>
            </h4>
            <p class="text-[11px] text-slate-400 truncate">
              {{ uploader ? `Diunggah oleh ${uploader}` : 'Bukti terverifikasi digital GTT' }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2 shrink-0 ml-3">
          <!-- Download Button in Header -->
          <button
            type="button"
            @click="handleDownload"
            class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            title="Unduh Berkas ke Komputer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Unduh</span>
          </button>

          <!-- Close Button -->
          <button 
            type="button"
            @click="$emit('close')" 
            class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-5 overflow-y-auto flex-1 bg-slate-50 space-y-4">
        <!-- Log Viewer (Monospace Console Box) -->
        <div v-if="isTextLog" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">Format: Text Monospace (Console Output / Telemetry Log)</span>
            <div class="flex items-center space-x-2">
              <button
                type="button"
                @click="copyLogContent"
                class="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>{{ copied ? '✓ Tersalin!' : 'Salin Isi Log' }}</span>
              </button>
              <button
                type="button"
                @click="handleDownload"
                class="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Unduh {{ fileName.endsWith('.log') ? '.log' : '.txt' }}</span>
              </button>
            </div>
          </div>
          <div class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
            <pre>{{ logContent }}</pre>
          </div>
        </div>

        <!-- PDF Document Viewer -->
        <div v-else-if="isPdf" class="space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">Format: Dokumen Resmi PDF (Principal Technical Case)</span>
            <button
              type="button"
              @click="handleDownload"
              class="px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:text-rose-900 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh Dokumen PDF</span>
            </button>
          </div>

          <div class="border border-slate-200 rounded-xl bg-white p-6 shadow-sm space-y-4">
            <div class="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span class="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  OFFICIAL TECHNICAL DISPATCH
                </span>
                <h3 class="font-bold text-slate-900 text-sm mt-1.5">{{ fileName }}</h3>
                <p class="text-xs text-slate-500 font-mono">Case ID Ref: #24325 &bull; Cisco TAC Global</p>
              </div>
              <span class="text-xs font-mono text-slate-400">Hal 1 dari 1</span>
            </div>

            <div class="text-xs text-slate-700 leading-relaxed font-sans space-y-2 bg-slate-50/70 p-4 rounded-lg border border-slate-100">
              <p><strong>Laporan Insiden:</strong> Analisis diagnostik menyeluruh terhadap status kegagalan controller bus PCIe dan host SAN multipath connection.</p>
              <p><strong>Status Investigasi:</strong> Ditemukan indikasi hardware bus assertion saat beban transfer dirty cache melampaui ambang batas 88%. Disarankan penyeimbangan FC path serta penataan ulang queue.</p>
              <p><strong>Rekomendasi Principal:</strong> Validasi kondisi NVRAM battery unit dan restart bertahap controller channel setelah proses failback diselesaikan.</p>
            </div>
          </div>
        </div>

        <!-- Image & Graphic Preview -->
        <div v-else class="space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">Format: Berkas Gambar Digital / Tangkapan Layar</span>
            <button
              type="button"
              @click="handleDownload"
              class="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh Berkas</span>
            </button>
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
            <strong>Penyimpanan Persisten GTT:</strong> Berkas bukti ini tersimpan dan terenkripsi aman dalam sistem pelaporan Helpdesk PT Global Transformasi Teknologi.
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <span class="text-slate-400 font-mono text-[11px]">
          Target: {{ ticketNumber || 'TICK-20261004-0005' }}
        </span>
        <div class="flex items-center space-x-2">
          <button
            type="button"
            @click="handleDownload"
            class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Unduh Berkas</span>
          </button>
          <button 
            type="button"
            @click="$emit('close')" 
            class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
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
  attachment: {
    type: Object,
    default: null
  },
  ticketNumber: {
    type: String,
    default: ''
  }
});

defineEmits(['close']);

const copied = ref(false);

const activeFile = computed(() => props.file || props.attachment);

const fileName = computed(() => {
  if (!activeFile.value) return '';
  if (typeof activeFile.value === 'string') return activeFile.value;
  return activeFile.value.name || activeFile.value.originalName || 'berkas';
});

const uploader = computed(() => {
  if (typeof activeFile.value === 'object' && activeFile.value) {
    return activeFile.value.uploadedBy;
  }
  return null;
});

const fileCategory = computed(() => {
  if (typeof activeFile.value === 'object' && activeFile.value) {
    return activeFile.value.source;
  }
  return null;
});

const isTextLog = computed(() => {
  const name = fileName.value.toLowerCase();
  return name.endsWith('.txt') || name.endsWith('.log') || name.endsWith('.rsc') || name.includes('log') || name.includes('ping') || name.includes('resolution');
});

const isPdf = computed(() => {
  const name = fileName.value.toLowerCase();
  return name.endsWith('.pdf');
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
  const name = fileName.value.toLowerCase();
  if (name.includes('ping')) {
    return `=== PING TEST DIAGNOSTIC RESULT ===
Target Host: 10.200.4.15 (PROD-STORAGE-NODE0)
Incident Ref: TICK-20261004-0005
Timestamp: 2026-10-04 14:50:33 WIB
Tested by: Budi Santoso (Senior Storage & Infrastructure Engineer)

PING 10.200.4.15 (10.200.4.15): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
Request timeout for icmp_seq 3

--- 10.200.4.15 ping statistics ---
4 packets transmitted, 0 packets received, 100.0% packet loss
Fault classification: Host port offline (Controller unmap queue stalled)`;
  }
  if (name.includes('resolution')) {
    return `=== RESOLUTION IMPLEMENTATION STEPS ===
Incident Ref: TICK-20261004-0005
Engineer: Budi Santoso (Senior Storage & Infrastructure Engineer)
Timestamp: 2026-10-04 18:00:05 WIB
Assisted by: Cisco TAC Global

1. Rebalance FC host paths across Fabric 1 switches.
2. Execute clear stalled cache unmap operations via HPE CLI command line:
   # servicenode start 0
   # statcmp -iter 5
   # setnode online 0
3. Trigger targeted rescan on ESXi host storage adapters:
   # esxcli storage core adapter rescan --all
4. Datastore LUN PROD-CL01 successfully remounted.
5. Production VM health check: All services verified NORMAL (0 packet loss, latency 1.2ms).`;
  }
  return `[2026-10-04 14:25:12 WIB] CONSOLE KVM SESSION OPENED by Engineer: Budi Santoso
[2026-10-04 14:25:18 WIB] Interface TenGigabitEthernet1/0/10 link status: DOWN (carrier lost)
[2026-10-04 14:25:22 WIB] Interface TenGigabitEthernet1/0/10 link status: UP (10000 Mb/s Full Duplex)
[2026-10-04 14:25:29 WIB] Interface TenGigabitEthernet1/0/10 link status: DOWN (carrier lost)
[2026-10-04 14:25:40 WIB] %LINK-3-UPDOWN: Interface TenGigabitEthernet1/0/10, changed state to down
[2026-10-04 14:26:01 WIB] DIAGNOSTIC: show int transceiver detail
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

const handleDownload = () => {
  const name = fileName.value || 'lampiran.txt';
  let content = '';
  let mimeType = 'text/plain';

  if (isTextLog.value) {
    content = logContent.value;
    mimeType = 'text/plain';
  } else if (isPdf.value) {
    content = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n5 0 obj<</Length 220>>stream\nBT\n/F1 16 Tf\n50 780 Td\n(GTT Helpdesk Incident Telemetry - ${name}) Tj\n/F1 11 Tf\n0 -30 Td\n(Ticket: TICK-20261004-0005 | Case ID: 24325) Tj\n0 -20 Td\n(Principal Escalation: Cisco TAC Global) Tj\n0 -20 Td\n(Diagnostic analysis: Transient PCIe bus stall confirmed.) Tj\n0 -20 Td\n(Status: Technical resolution steps applied and verified.) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000212 00000 n \n0000000281 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n550\n%%EOF`;
    mimeType = 'application/pdf';
  } else {
    content = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#1e293b"/><text x="30" y="50" fill="#38bdf8" font-family="monospace" font-size="20" font-weight="bold">GTT HELPDESK ATTACHMENT</text><text x="30" y="90" fill="#94a3b8" font-family="monospace" font-size="14">File: ${name}</text><text x="30" y="120" fill="#94a3b8" font-family="monospace" font-size="14">Ticket: TICK-20261004-0005</text><text x="30" y="180" fill="#4ade80" font-family="monospace" font-size="16">VERIFIED DIGITAL EVIDENCE</text></svg>`;
    mimeType = 'image/svg+xml';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
</script>
