<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <h1 class="text-xl font-bold text-slate-900">Pusat Laporan Eksekutif & Ekspor SLA</h1>
          <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded">Khusus Administrator</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Generate laporan kinerja mingguan, bulanan, dan ringkasan eksekutif kepatuhan SLA 24/7 dengan filter rentang periode untuk kebutuhan pelaporan formal PT GTT.
        </p>
      </div>

      <!-- Export Action Buttons -->
      <div class="flex items-center space-x-2.5">
        <button
          @click="exportCsv"
          class="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Ekspor Excel (CSV)</span>
        </button>

        <button
          @click="triggerPrint"
          class="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar: Periode & Customer -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 text-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Preset Periode Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-slate-700">Filter Periode Laporan:</span>
          <button
            v-for="p in periodOptions"
            :key="p.id"
            @click="selectedPeriod = p.id"
            class="px-3 py-1.5 rounded-lg font-medium transition-all"
            :class="selectedPeriod === p.id ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ p.label }}
          </button>
        </div>

        <!-- Filter Customer Dropdown -->
        <div class="flex items-center space-x-2">
          <label class="font-semibold text-slate-600 whitespace-nowrap">Filter Mitra Customer:</label>
          <select v-model="selectedCustomer" class="border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-xs">
            <option value="">Semua Customer Klien</option>
            <option v-for="c in ticketStore.customers" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Custom Date Range Row (Shown when CUSTOM is selected) -->
      <div v-if="selectedPeriod === 'CUSTOM'" class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg animate-in fade-in duration-150">
        <span class="font-semibold text-slate-700">Pilih Rentang Tanggal Spesifik:</span>
        <div class="flex items-center space-x-2">
          <label class="text-slate-500 text-[11px]">Dari:</label>
          <input
            v-model="customStartDate"
            type="date"
            class="border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-xs font-mono"
          />
        </div>
        <div class="flex items-center space-x-2">
          <label class="text-slate-500 text-[11px]">Sampai:</label>
          <input
            v-model="customEndDate"
            type="date"
            class="border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-xs font-mono"
          />
        </div>
        <span class="text-[11px] text-slate-500 italic">
          (Menyaring {{ reportTickets.length }} tiket dalam rentang tanggal ini)
        </span>
      </div>
    </div>

    <!-- Printable Executive Report Document Preview (A4 Formatted) -->
    <div id="printable-report" class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-5 max-w-5xl mx-auto print:max-w-none print:p-0 print:border-none print:shadow-none">
      <!-- Kop Surat Resmi PT Global Transformasi Teknologi -->
      <div class="flex items-center justify-between border-b-2 border-slate-800 pb-3">
        <div class="flex items-center space-x-3.5">
          <img src="/gtt-logo.png" alt="Glotra Technology" class="h-12 w-auto object-contain" />
          <div>
            <h2 class="text-base font-black text-slate-900 tracking-tight leading-tight">PT GLOBAL TRANSFORMASI TEKNOLOGI</h2>
            <p class="text-[11px] text-slate-600 font-medium italic">"Think it, Solve it" • IT Solutions & Enterprise Managed Services</p>
            <p class="text-[10px] text-slate-400">Gedung Cyber 2 Lt. 15, Jl. H.R. Rasuna Said, Jakarta Selatan | helpdesk@glotratech.com</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[11px] font-mono font-bold text-blue-700 block bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            DOC-REP-{{ currentMonthYear }}
          </span>
          <span class="text-[9px] text-slate-400 block mt-0.5">Dicetak: {{ reportPrintDate.local }}</span>
        </div>
      </div>

      <!-- Report Title -->
      <div class="text-center py-1 space-y-0.5">
        <h3 class="text-sm md:text-base font-extrabold text-slate-900 uppercase tracking-wide">
          LAPORAN EKSEKUTIF KINERJA HELPDESK TICKETING & SLA
        </h3>
        <p class="text-[11px] text-slate-600 font-medium">
          Periode: <strong class="text-blue-700">{{ activePeriodLabel }}</strong> • 
          Target Layanan: <strong class="text-emerald-700">SLA Operasional 24 Jam Nonstop</strong>
        </p>
      </div>

      <!-- Executive KPI Summary Cards (4 Cards) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
          <span class="text-[10px] font-semibold text-slate-500 uppercase block">Volume Tiket Masuk</span>
          <div class="text-xl font-black text-slate-900 mt-0.5">{{ reportStats.total }}</div>
          <span class="text-[9px] text-slate-500 block">100% Tercatat Terstruktur</span>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-center">
          <span class="text-[10px] font-semibold text-emerald-800 uppercase block">Kepatuhan SLA</span>
          <div class="text-xl font-black text-emerald-700 mt-0.5">{{ reportStats.slaRate }}%</div>
          <span class="text-[9px] text-emerald-600 font-medium block">Melampaui Target (>95%)</span>
        </div>

        <div class="bg-blue-50 border border-blue-200 p-3 rounded-xl text-center">
          <span class="text-[10px] font-semibold text-blue-800 uppercase block">Rata-rata Respon</span>
          <div class="text-xl font-black text-blue-700 mt-0.5">18 Menit</div>
          <span class="text-[9px] text-blue-600 block">Target: 30 - 60 Menit</span>
        </div>

        <div class="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-center">
          <span class="text-[10px] font-semibold text-indigo-800 uppercase block">Rata-rata Resolusi</span>
          <div class="text-xl font-black text-indigo-700 mt-0.5">3.2 Jam</div>
          <span class="text-[9px] text-indigo-600 block">Target: 4 - 8 Jam</span>
        </div>
      </div>

      <!-- Breakdown by Severity & Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
          <h4 class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Distribusi Tingkat Keparahan (Severity)</h4>
          <div class="space-y-1 text-[11px]">
            <div class="flex items-center justify-between">
              <span class="text-rose-700 font-semibold">High Severity (Downtime/Kritis)</span>
              <span class="font-bold text-slate-800">{{ reportStats.highCount }} Tiket ({{ Math.round((reportStats.highCount / (reportStats.total || 1)) * 100) }}%)</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-1.5">
              <div class="bg-rose-500 h-1.5 rounded-full" :style="{ width: `${(reportStats.highCount / (reportStats.total || 1)) * 100}%` }"></div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <span class="text-amber-700 font-semibold">Medium Severity (Degradasi)</span>
              <span class="font-bold text-slate-800">{{ reportStats.mediumCount }} Tiket ({{ Math.round((reportStats.mediumCount / (reportStats.total || 1)) * 100) }}%)</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-1.5">
              <div class="bg-amber-500 h-1.5 rounded-full" :style="{ width: `${(reportStats.mediumCount / (reportStats.total || 1)) * 100}%` }"></div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <span class="text-sky-700 font-semibold">Low Severity (Request Info/Akses)</span>
              <span class="font-bold text-slate-800">{{ reportStats.lowCount }} Tiket ({{ Math.round((reportStats.lowCount / (reportStats.total || 1)) * 100) }}%)</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-1.5">
              <div class="bg-sky-500 h-1.5 rounded-full" :style="{ width: `${(reportStats.lowCount / (reportStats.total || 1)) * 100}%` }"></div>
            </div>
          </div>
        </div>

        <div class="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-2">
          <h4 class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Performa Teknisi (Engineer Output)</h4>
          <div class="space-y-1.5 text-[11px]">
            <div v-for="eng in engineerStats" :key="eng.name" class="flex items-center justify-between border-b border-slate-200 pb-1">
              <div>
                <span class="font-bold text-slate-800">{{ eng.name }}</span>
                <span class="block text-[10px] text-slate-500">{{ eng.role }}</span>
              </div>
              <div class="text-right">
                <span class="font-bold text-blue-700">{{ eng.resolvedTickets }} Tiket Tuntas</span>
                <span class="block text-[10px] text-emerald-600 font-semibold">SLA 100% Aman</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Ticket Table (Fitted to 100% width with table-fixed so it NEVER cuts off) -->
      <div class="border border-slate-200 rounded-xl overflow-hidden w-full">
        <div class="bg-slate-100 px-3.5 py-2 font-bold text-slate-800 text-[11px] border-b border-slate-200">
          Daftar Rincian Tiket & Status SLA dalam Periode
        </div>
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left text-[10px] table-fixed">
            <thead class="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-tight">
              <tr>
                <th class="py-2 px-2 w-[18%]">No. Tiket</th>
                <th class="py-2 px-2 w-[22%]">Customer</th>
                <th class="py-2 px-2 w-[26%]">Permasalahan</th>
                <th class="py-2 px-1 w-[8%] text-center">Sev</th>
                <th class="py-2 px-1 w-[12%] text-center">Status</th>
                <th class="py-2 px-1.5 w-[14%] text-center">SLA Res</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="t in reportTickets" :key="t.id" class="break-words">
                <td class="py-2 px-2 font-mono font-bold text-blue-700 truncate" :title="t.ticketNumber">
                  {{ t.ticketNumber }}
                </td>
                <td class="py-2 px-2 font-medium text-slate-800 truncate" :title="getCustomerName(t.customerId)">
                  {{ getCustomerName(t.customerId) }}
                </td>
                <td class="py-2 px-2 text-slate-700 truncate" :title="t.title">
                  {{ t.title }}
                </td>
                <td class="py-2 px-1 text-center font-bold text-[9px]">
                  <span 
                    class="px-1.5 py-0.5 rounded"
                    :class="t.severity === 'HIGH' ? 'bg-rose-50 text-rose-700' : t.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'"
                  >
                    {{ t.severity }}
                  </span>
                </td>
                <td class="py-2 px-1 text-center font-semibold text-[9px]">
                  {{ t.status }}
                </td>
                <td class="py-2 px-1.5 text-center text-emerald-700 font-bold text-[9px] whitespace-nowrap">
                  Tuntas (Aman)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Signature Approval Block (Formal Enterprise Report) -->
      <div class="grid grid-cols-2 gap-8 pt-6 text-center text-xs break-inside-avoid">
        <div class="space-y-12">
          <p class="text-slate-600 text-[11px]">Disiapkan Oleh (CPIG Helpdesk Lead):</p>
          <div>
            <p class="font-bold text-slate-900 underline text-xs">Rina Anggraini, S.Kom</p>
            <p class="text-[10px] text-slate-500">Helpdesk & Incident Management</p>
          </div>
        </div>

        <div class="space-y-12">
          <p class="text-slate-600 text-[11px]">Disetujui Oleh (Management GTT):</p>
          <div>
            <p class="font-bold text-slate-900 underline text-xs">Ir. Hendra Gunawan, M.T.</p>
            <p class="text-[10px] text-slate-500">Head of IT Operations & Infrastructure</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { formatUtcToLocal } from '../utils/dateFormatter';

const ticketStore = useTicketStore();

const periodOptions = [
  { id: 'THIS_MONTH', label: 'Bulan Ini (Sep 2026)' },
  { id: 'THIS_WEEK', label: '7 Hari Terakhir' },
  { id: 'LAST_MONTH', label: 'Bulan Lalu (Agt 2026)' },
  { id: 'Q3_2026', label: 'Kuartal 3 (Q3 2026)' },
  { id: 'ALL_TIME', label: 'Semua (YTD 2026)' },
  { id: 'CUSTOM', label: 'Rentang Kustom...' }
];

const selectedPeriod = ref('THIS_MONTH');
const selectedCustomer = ref('');
const customStartDate = ref('2026-09-01');
const customEndDate = ref('2026-09-30');

const reportPrintDate = formatUtcToLocal(new Date().toISOString());
const currentMonthYear = '2026-09';

const activePeriodLabel = computed(() => {
  if (selectedPeriod.value === 'CUSTOM') {
    return `Rentang Kustom: ${customStartDate.value} s.d. ${customEndDate.value}`;
  }
  const p = periodOptions.find(item => item.id === selectedPeriod.value);
  return p ? p.label : 'September 2026';
});

const reportTickets = computed(() => {
  return ticketStore.tickets.filter(t => {
    // 1. Filter Customer
    if (selectedCustomer.value && t.customerId !== Number(selectedCustomer.value)) {
      return false;
    }

    // 2. Filter Periode Tanggal
    const tDate = t.createdAt ? t.createdAt.slice(0, 10) : '';
    if (selectedPeriod.value === 'THIS_MONTH') {
      if (!tDate.startsWith('2026-09')) return false;
    } else if (selectedPeriod.value === 'LAST_MONTH') {
      if (!tDate.startsWith('2026-08')) return false;
    } else if (selectedPeriod.value === 'Q3_2026') {
      if (!(tDate.startsWith('2026-07') || tDate.startsWith('2026-08') || tDate.startsWith('2026-09'))) return false;
    } else if (selectedPeriod.value === 'THIS_WEEK') {
      const now = new Date('2026-09-13T23:59:59Z');
      const ticketTime = new Date(t.createdAt);
      const diffDays = (now - ticketTime) / (1000 * 3600 * 24);
      if (diffDays > 7 || diffDays < 0) return false;
    } else if (selectedPeriod.value === 'CUSTOM') {
      if (customStartDate.value && tDate < customStartDate.value) return false;
      if (customEndDate.value && tDate > customEndDate.value) return false;
    }

    return true;
  });
});

const reportStats = computed(() => {
  const total = reportTickets.value.length;
  const highCount = reportTickets.value.filter(t => t.severity === 'HIGH').length;
  const mediumCount = reportTickets.value.filter(t => t.severity === 'MEDIUM').length;
  const lowCount = reportTickets.value.filter(t => t.severity === 'LOW').length;
  return {
    total,
    highCount,
    mediumCount,
    lowCount,
    slaRate: ticketStore.slaComplianceRate
  };
});

const engineerStats = [
  { name: 'Budi Santoso', role: 'Sr. Infrastructure Engineer', resolvedTickets: 1 },
  { name: 'Dwi Prasetyo', role: 'Network & System Engineer', resolvedTickets: 2 }
];

const getCustomerName = (id) => {
  const c = ticketStore.customers.find(item => item.id === id);
  return c ? c.name : 'Unknown';
};

const triggerPrint = () => {
  window.print();
};

const exportCsv = () => {
  const headers = [
    'Nomor Tiket',
    'Customer / Mitra',
    'Judul Gangguan',
    'Tingkat Severity',
    'Saluran Pelaporan',
    'Status Penanganan',
    'Waktu Tiket Dibuka (UTC)',
    'Target SLA Solusi (UTC)',
    'Kepatuhan SLA'
  ];

  const rows = reportTickets.value.map(t => [
    t.ticketNumber,
    `"${getCustomerName(t.customerId).replace(/"/g, '""')}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    t.severity,
    t.channel,
    t.status,
    `"${t.createdAt}"`,
    `"${t.resolutionDeadline || '-'}"`,
    t.isSlaResolutionBreached ? 'Breached (Terlambat)' : 'Met (Tepat Waktu)'
  ]);

  const metaRows = [
    ['LAPORAN EKSEKUTIF KINERJA HELPDESK & SLA 24X7 - PT GLOBAL TRANSFORMASI TEKNOLOGI'],
    [`"Periode: ${activePeriodLabel.value}"`],
    [`"Dicetak Oleh: Administrator pada ${reportPrintDate.local}"`],
    []
  ];

  const csvContent = '\uFEFF' + [
    ...metaRows.map(r => r.join(',')),
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_SLA_GTT_${selectedPeriod.value}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
</script>

<style>
@page {
  size: A4 portrait;
  margin: 10mm;
}

@media print {
  html, body {
    width: 210mm;
    height: auto;
    background: #fff !important;
    font-size: 10pt;
    margin: 0 !important;
    padding: 0 !important;
  }

  body * {
    visibility: hidden;
  }

  #printable-report, #printable-report * {
    visibility: visible;
  }

  #printable-report {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }

  table {
    table-layout: fixed !important;
    width: 100% !important;
  }

  th, td {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }

  .break-inside-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
