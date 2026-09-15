<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b border-slate-200 pb-3">
      <div>
        <h3 class="font-bold text-slate-800 text-base flex items-center space-x-2">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span>Alur Penanganan Bertahap (Tracking Milestones)</span>
          <span class="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Model Resi Ekspedisi</span>
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">Seluruh pembaruan dicatat kronologis dengan timestamp standar UTC+0</p>
      </div>

      <!-- Add Milestone Button (Visible to Engineers / CPIG / Admin) -->
      <button
        v-if="canAddMilestone && ticket.status !== 'CLOSED'"
        @click="showAddModal = true"
        class="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
      >
        <span>+ Update Checkpoint</span>
      </button>
    </div>

    <!-- Stepper Timeline List -->
    <div class="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
      <div 
        v-for="(step, index) in ticket.milestones" 
        :key="step.id || index"
        class="relative group"
      >
        <!-- Circle Node Indicator -->
        <div 
          class="absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm transition-transform group-hover:scale-110"
          :class="getNodeColor(step.status, index === ticket.milestones.length - 1)"
        >
          <span v-if="index === ticket.milestones.length - 1" class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="getPingColor(step.status)"></span>
          <span>{{ index + 1 }}</span>
        </div>

        <!-- Step Content Card -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-slate-900 text-sm">{{ step.stepName }}</span>
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-md" :class="getStatusBadgeClass(step.status)">
                {{ step.status }}
              </span>
            </div>
            <!-- Time Badge (WIB with UTC tooltip) -->
            <div class="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center space-x-1">
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ formatTime(step.timestampUtc).local }}</span>
              <span class="text-slate-400">({{ formatTime(step.timestampUtc).utc }})</span>
            </div>
          </div>

          <!-- Actor & Role -->
          <div class="flex items-center space-x-2 text-xs text-slate-600 mb-2">
            <span class="font-semibold text-slate-800">{{ step.actorName }}</span>
            <span class="text-slate-300">•</span>
            <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium">{{ step.actorRole }}</span>
          </div>

          <!-- Notes -->
          <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-sans">
            {{ step.notes }}
          </p>

          <!-- Proof Attachment (Interactive Clickable Preview) -->
          <div v-if="step.proofFile" class="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              type="button"
              @click="openProofPreview(step.proofFile)"
              class="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg font-semibold transition-all group"
            >
              <svg class="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>Lihat Bukti Berkas: {{ step.proofFile }}</span>
            </button>
            <span class="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono">Persistent Storage</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form: Add Milestone Checkpoint -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div class="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Tambah Checkpoint Pengerjaan</h4>
            <p class="text-xs text-slate-500">Mencatat tahapan troubleshooting bertahap</p>
          </div>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitMilestone" class="p-5 space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Judul Tahapan / Checkpoint *</label>
            <input 
              v-model="newStep.stepName" 
              type="text" 
              required
              placeholder="Contoh: Penggantian Optic SFP / Reboot Switch / Isolasi Port"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Catatan Tindakan / Temuan Lapangan *</label>
            <textarea 
              v-model="newStep.notes" 
              rows="3" 
              required
              placeholder="Jelaskan tindakan teknis yang dilakukan, nilai dBm, hasil command line, atau respon pengujian..."
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Status Progres Setelah Tindakan Ini</label>
            <select v-model="newStep.nextStatus" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white">
              <option value="IN_PROGRESS">Tetap Dalam Pengerjaan (IN_PROGRESS)</option>
              <option value="PENDING_VENDOR">Tahan SLA (Menunggu Pihak Ketiga / Vendor)</option>
              <option value="PENDING_CUSTOMER">Tahan SLA (Menunggu Respon Customer)</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Unggah Bukti / Screenshot (Opsional)</label>
            <input 
              @change="handleFileUpload" 
              type="file" 
              class="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div class="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button 
              type="button" 
              @click="showAddModal = false" 
              class="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 font-medium"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
            >
              Simpan Checkpoint
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Proof File Lightbox / Viewer -->
    <AttachmentPreviewModal 
      v-if="activePreviewFile" 
      :file="activePreviewFile" 
      :ticket-number="ticket.ticketNumber" 
      @close="activePreviewFile = null" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatUtcToLocal } from '../utils/dateFormatter';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import AttachmentPreviewModal from './AttachmentPreviewModal.vue';

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
});

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const showAddModal = ref(false);
const activePreviewFile = ref(null);

const newStep = ref({
  stepName: '',
  notes: '',
  nextStatus: 'IN_PROGRESS',
  proofFile: null
});

const sampleLogContent = `[2026-09-13 03:35:12 UTC] CONSOLE KVM SESSION OPENED by Engineer: Budi Santoso
[2026-09-13 03:35:18 UTC] Interface TenGigabitEthernet1/0/10 link status: DOWN (carrier lost)
[2026-09-13 03:35:22 UTC] Interface TenGigabitEthernet1/0/10 link status: UP (10000 Mb/s Full Duplex)
[2026-09-13 03:35:29 UTC] Interface TenGigabitEthernet1/0/10 link status: DOWN (carrier lost)
[2026-09-13 03:35:40 UTC] %LINK-3-UPDOWN: Interface TenGigabitEthernet1/0/10, changed state to down
[2026-09-13 03:36:01 UTC] DIAGNOSTIC: show int transceiver detail
  - Optical Rx Power: -28.4 dBm (Threshold Low Alarm: -18.0 dBm) [CRITICAL]
  - Optical Tx Power: -2.1 dBm [NORMAL]
  - SFP Model: SFP-10G-LR Cisco Systems
  - Fault: Optic transceiver diode degradation. Hardware replacement required.`;

const canAddMilestone = computed(() => {
  const role = authStore.currentUser.roleCode;
  if (['ADMIN', 'CPIG'].includes(role)) return true;
  if (role === 'ENGINEER') {
    return props.ticket.assignedToId === authStore.currentUser.id;
  }
  return false;
});

const formatTime = (utcTime) => formatUtcToLocal(utcTime);

const getNodeColor = (status, isLatest) => {
  if (status === 'RESOLVED') return 'bg-emerald-600 text-white';
  if (status === 'CLOSED') return 'bg-slate-600 text-white';
  if (status.includes('PENDING')) return 'bg-amber-500 text-white';
  if (isLatest) return 'bg-blue-600 text-white ring-4 ring-blue-100';
  return 'bg-slate-400 text-white';
};

const getPingColor = (status) => {
  if (status === 'RESOLVED') return 'bg-emerald-400';
  if (status.includes('PENDING')) return 'bg-amber-400';
  return 'bg-blue-400';
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'OPEN': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'ASSIGNED': return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'IN_PROGRESS': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'PENDING_VENDOR':
    case 'PENDING_CUSTOMER': return 'bg-orange-50 text-orange-800 border border-orange-200';
    case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold';
    case 'CLOSED': return 'bg-slate-100 text-slate-700 border border-slate-200';
    default: return 'bg-slate-50 text-slate-700';
  }
};

const openProofPreview = (fileName) => {
  activePreviewFile.value = fileName;
};

const getImagePreviewSrc = (fileName) => {
  if (fileName.includes('cisco')) {
    return '/mock-attachments/cisco-tac-ticket-confirmation.svg';
  }
  if (fileName.includes('ping') || fileName.includes('http')) {
    return '/mock-attachments/ping-http200-proof.svg';
  }
  return '/gtt-logo.png';
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    newStep.value.proofFile = file.name;
  }
};

const submitMilestone = () => {
  ticketStore.addProgressMilestone(
    props.ticket.id, 
    {
      stepName: newStep.value.stepName,
      notes: newStep.value.notes,
      proofFile: newStep.value.proofFile,
      nextStatus: newStep.value.nextStatus
    },
    authStore.currentUser
  );

  newStep.value = { stepName: '', notes: '', nextStatus: 'IN_PROGRESS', proofFile: null };
  showAddModal.value = false;
};
</script>
