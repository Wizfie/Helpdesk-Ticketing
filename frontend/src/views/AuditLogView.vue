<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <h1 class="text-xl font-bold text-slate-900">Jejak Audit Aktivitas Sistem (Audit Logs)</h1>
          <span class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded">Compliance & Transparansi</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Mencatat seluruh tindakan kritis pada tiket, penugasan teknisi, pembekuan SLA, dan perubahan status dengan presisi waktu UTC+0.
        </p>
      </div>

      <!-- Header Right: Export Buttons & Log Counter -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-slate-700">{{ ticketStore.auditLogs.length }} Aktivitas</span>
        </div>

        <button
          @click="exportCsv"
          class="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
          title="Unduh rekaman jejak audit dalam format CSV (Excel)"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Ekspor CSV</span>
        </button>

        <button
          @click="exportJson"
          class="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
          title="Unduh data audit format JSON untuk analisis keamanan"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          <span>Ekspor JSON</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari aktor, nomor tiket, staf, customer, atau rincian aktivitas..."
          class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <!-- Action Type Filter -->
      <select v-model="filterAction" class="border border-slate-200 rounded-lg px-3 py-2 bg-white text-xs">
        <option value="">Semua Jenis Aksi ({{ filteredLogs.length }})</option>
        <optgroup label="Aktivitas Tiket & SLA">
          <option value="TICKET_CREATED">Tiket Dibuat (TICKET_CREATED)</option>
          <option value="ASSIGN_ENGINEER">Penugasan Teknisi (ASSIGN_ENGINEER)</option>
          <option value="STATUS_CHANGED">Perubahan Status (STATUS_CHANGED)</option>
          <option value="SLA_PAUSED">SLA Ditahan (SLA_PAUSED)</option>
          <option value="SLA_RESUMED">SLA Dilanjutkan (SLA_RESUMED)</option>
          <option value="TICKET_RESOLVED">Tiket Selesai (TICKET_RESOLVED)</option>
          <option value="TICKET_CLOSED">Tiket Ditutup (TICKET_CLOSED)</option>
          <option value="KB_SUBMITTED">Pengajuan KB (KB_SUBMITTED)</option>
        </optgroup>
        <optgroup label="Aktivitas Manajemen Pengguna">
          <option value="USER_CREATED">Staf Didaftarkan (USER_CREATED)</option>
          <option value="USER_UPDATED">Data Staf Diubah (USER_UPDATED)</option>
          <option value="USER_STATUS_TOGGLED">Status Staf Diubah (USER_STATUS_TOGGLED)</option>
        </optgroup>
        <optgroup label="Aktivitas Mitra & PIC Customer">
          <option value="CUSTOMER_CREATED">Mitra Didaftarkan (CUSTOMER_CREATED)</option>
          <option value="CUSTOMER_UPDATED">Data Mitra Diubah (CUSTOMER_UPDATED)</option>
          <option value="CUSTOMER_PIC_ADDED">PIC Ditambahkan (CUSTOMER_PIC_ADDED)</option>
          <option value="CUSTOMER_PIC_UPDATED">PIC Diubah (CUSTOMER_PIC_UPDATED)</option>
        </optgroup>
      </select>
    </div>

    <!-- Audit Logs Table -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3 px-4">Waktu (WIB / UTC)</th>
              <th class="py-3 px-4">Aktor / Pengguna</th>
              <th class="py-3 px-4">Jenis Tindakan</th>
              <th class="py-3 px-4">Entitas Terkait</th>
              <th class="py-3 px-4">Rincian Perubahan</th>
              <th class="py-3 px-4">IP Address</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-slate-50/70 transition-colors">
              <!-- Timestamp -->
              <td class="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                <span class="font-semibold text-slate-800">{{ formatTime(log.timestampUtc).local }}</span>
                <span class="block text-slate-400 text-[10px]">{{ formatTime(log.timestampUtc).utc }}</span>
              </td>

              <!-- Actor -->
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900">{{ log.userName }}</div>
                <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                  {{ log.role }}
                </span>
              </td>

              <!-- Action Badge -->
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono" :class="getActionBadgeClass(log.action)">
                  {{ log.action }}
                </span>
              </td>

              <!-- Entity -->
              <td class="py-3 px-4 font-mono text-blue-700 font-semibold">
                {{ log.entityId }}
              </td>

              <!-- Description -->
              <td class="py-3 px-4 text-slate-700 max-w-md">
                {{ log.description }}
              </td>

              <!-- IP -->
              <td class="py-3 px-4 font-mono text-slate-400 text-[11px]">
                {{ log.ipAddress }}
              </td>
            </tr>

            <tr v-if="filteredLogs.length === 0">
              <td colspan="6" class="text-center py-8 text-slate-400">
                Tidak ada riwayat aktivitas yang cocok dengan filter.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { formatUtcToLocal } from '../utils/dateFormatter';

const ticketStore = useTicketStore();
const searchQuery = ref('');
const filterAction = ref('');

const formatTime = (utc) => formatUtcToLocal(utc);

const getActionBadgeClass = (action) => {
  if (action.includes('RESOLVED')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  if (action.includes('PAUSED')) return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (action.includes('USER_')) return 'bg-purple-50 text-purple-700 border border-purple-200';
  if (action.includes('CUSTOMER_')) return 'bg-teal-50 text-teal-700 border border-teal-200';
  if (action.includes('CREATED')) return 'bg-blue-50 text-blue-700 border border-blue-200';
  if (action.includes('CLOSED')) return 'bg-slate-100 text-slate-700 border border-slate-200';
  return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
};

const filteredLogs = computed(() => {
  return ticketStore.auditLogs.filter(log => {
    if (filterAction.value && log.action !== filterAction.value) return false;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchUser = log.userName.toLowerCase().includes(q);
      const matchEntity = log.entityId.toLowerCase().includes(q);
      const matchDesc = log.description.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      if (!matchUser && !matchEntity && !matchDesc && !matchAction) return false;
    }
    return true;
  });
});

// Export CSV Feature (RFC-4180 with UTF-8 BOM for Microsoft Excel compatibility)
const exportCsv = () => {
  const logsToExport = filteredLogs.value;
  const headers = [
    'ID Log',
    'Waktu UTC',
    'Waktu Lokal (WIB)',
    'Aktor / Pengguna',
    'Peran (Role)',
    'Jenis Tindakan (Action)',
    'Entitas Terkait',
    'Rincian Perubahan (Deskripsi)',
    'Alamat IP'
  ];

  const rows = logsToExport.map(log => {
    const timeFormatted = formatUtcToLocal(log.timestampUtc);
    return [
      log.id,
      `"${(timeFormatted.utc || '').replace(/"/g, '""')}"`,
      `"${(timeFormatted.local || '').replace(/"/g, '""')}"`,
      `"${(log.userName || '').replace(/"/g, '""')}"`,
      `"${(log.role || '').replace(/"/g, '""')}"`,
      `"${(log.action || '').replace(/"/g, '""')}"`,
      `"${(log.entityId || '').replace(/"/g, '""')}"`,
      `"${(log.description || '').replace(/"/g, '""')}"`,
      `"${(log.ipAddress || '').replace(/"/g, '""')}"`
    ];
  });

  const csvString = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  link.setAttribute('href', url);
  link.setAttribute('download', `GTT_Audit_Logs_${dateStr}_${timeStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Export JSON Feature
const exportJson = () => {
  const logsToExport = filteredLogs.value;
  const jsonString = JSON.stringify(logsToExport, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  link.setAttribute('href', url);
  link.setAttribute('download', `GTT_Audit_Logs_${dateStr}_${timeStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>
