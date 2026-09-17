<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Top Header Bar -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link to="/tickets" class="hover:text-blue-600 transition-colors">Audit &amp; Intelligence</router-link>
          <span>/</span>
          <span class="text-slate-800">Executive SLA Reports</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <span>Executive SLA Intelligence &amp; Reporting</span>
          <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            AUDIT COMPLIANCE
          </span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Analisis kepatuhan SLA multi-klien, komposisi saluran intake, kecepatan penanganan teknisi, dan ekspor berkas audit.
        </p>
      </div>

      <!-- Export Action Buttons -->
      <div class="flex items-center space-x-2.5">
        <button
          @click="exportCsv"
          class="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Ekspor CSV (Excel)</span>
        </button>

        <button
          @click="triggerPrint"
          class="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          <span>Cetak / Cetak PDF</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar: Periode & Customer -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 text-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Preset Periode Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-slate-700">Filter Periode:</span>
          <button
            v-for="p in periodOptions"
            :key="p.id"
            @click="selectedPeriod = p.id"
            class="px-3 py-1.5 rounded-lg font-medium transition-all text-xs"
            :class="selectedPeriod === p.id ? 'bg-blue-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ p.label }}
          </button>
        </div>

        <!-- Filter Customer Dropdown -->
        <div class="flex items-center space-x-2">
          <label class="font-semibold text-slate-600 whitespace-nowrap">Filter Mitra:</label>
          <select v-model="selectedCustomer" class="border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-xs">
            <option value="">Semua Mitra Korporat</option>
            <option v-for="c in ticketStore.customers" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.code }})
            </option>
          </select>
        </div>
      </div>

      <!-- Custom Date Range Row -->
      <div v-if="selectedPeriod === 'CUSTOM'" class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg animate-in fade-in duration-150">
        <span class="font-semibold text-slate-700">Rentang Tanggal Spesifik:</span>
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
      </div>
    </div>

    <!-- Printable Executive Report Document Preview -->
    <div id="printable-report" class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6 max-w-6xl mx-auto print:max-w-none print:p-0 print:border-none print:shadow-none">
      
      <!-- Formal GTT Header Banner -->
      <div class="flex items-center justify-between border-b-2 border-slate-800 pb-4">
        <div class="flex items-center space-x-3.5">
          <img src="/gtt-logo.png" alt="Glotra Technology" class="h-12 w-auto object-contain" />
          <div>
            <h2 class="text-base font-black text-slate-900 tracking-tight leading-tight">PT GLOBAL TRANSFORMASI TEKNOLOGI</h2>
            <p class="text-[11px] text-slate-600 font-medium italic">"Think it, Solve it" &bull; IT Enterprise Managed Services &amp; Infrastructure Support</p>
            <p class="text-[10px] text-slate-400">Cyber 2 Tower Lt. 15, Jl. H.R. Rasuna Said, Jakarta Selatan &bull; helpdesk@glotratech.com</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-[11px] font-mono font-bold text-blue-700 block bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            REPORT-SLA-{{ currentMonthYear }}
          </span>
          <span class="text-[9px] text-slate-400 block mt-1">Generated: {{ reportPrintDate.local }}</span>
        </div>
      </div>

      <!-- Report Title -->
      <div class="text-center py-1 space-y-0.5">
        <h3 class="text-base md:text-lg font-black text-slate-900 uppercase tracking-wide">
          LAPORAN EKSEKUTIF KINERJA HELPDESK &amp; KEPATUHAN KONTRAK SLA
        </h3>
        <p class="text-[11px] text-slate-600 font-medium">
          Periode Evaluasi: <strong class="text-blue-700">{{ activePeriodLabel }}</strong> &bull; 
          Standar Operasional: <strong class="text-emerald-700">Managed Service 24x7 Hybrid SLA</strong>
        </p>
      </div>

      <!-- 4 Core Executive Metric Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div class="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl text-center">
          <span class="text-[10px] font-bold text-emerald-800 uppercase block">SLA Compliance Rate</span>
          <div class="text-2xl font-black text-emerald-700 font-mono mt-0.5">{{ reportStats.slaRate }}%</div>
          <span class="text-[10px] text-emerald-600 font-medium block">Target Kontrak: &ge; 98.0%</span>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-center">
          <span class="text-[10px] font-bold text-slate-500 uppercase block">Total Insiden Diproses</span>
          <div class="text-2xl font-black text-slate-900 font-mono mt-0.5">{{ reportStats.total }}</div>
          <span class="text-[10px] text-slate-500 block">100% Tercatat Terverifikasi</span>
        </div>

        <div class="bg-blue-50/70 border border-blue-200 p-3.5 rounded-xl text-center">
          <span class="text-[10px] font-bold text-blue-800 uppercase block">Mean Time to Restore (MTTR)</span>
          <div class="text-2xl font-black text-blue-700 font-mono mt-0.5">1h 48m</div>
          <span class="text-[10px] text-blue-600 block">Net Resolution Velocity</span>
        </div>

        <div class="bg-purple-50/70 border border-purple-200 p-3.5 rounded-xl text-center">
          <span class="text-[10px] font-bold text-purple-800 uppercase block">Pelanggaran SLA Mayor</span>
          <div class="text-2xl font-black text-purple-700 font-mono mt-0.5">0 Breaches</div>
          <span class="text-[10px] text-purple-600 block">Nol Pinalti Finansial</span>
        </div>
      </div>

      <!-- Account SLA Performance Breakdown Table (Figma Spec) -->
      <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Account SLA Performance Breakdown (Performa per Mitra)
            </h4>
            <p class="text-[10px] text-slate-500 mt-0.5">
              Evaluasi kinerja pemenuhan waktu respon awal dan resolusi per instansi klien
            </p>
          </div>
          <span class="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            PORTFOLIO BREAKDOWN
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">
              <tr>
                <th class="px-4 py-2.5">Customer Entity</th>
                <th class="px-4 py-2.5">Contract Tier</th>
                <th class="px-4 py-2.5 text-center">Handled</th>
                <th class="px-4 py-2.5 text-center">Response SLA %</th>
                <th class="px-4 py-2.5 text-center">Resolution SLA %</th>
                <th class="px-4 py-2.5 text-center">Avg MTTR</th>
                <th class="px-4 py-2.5 text-center">Breaches</th>
                <th class="px-4 py-2.5 text-right">Health Trend</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="acc in customerPerformance" 
                :key="acc.code"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="px-4 py-2.5 font-bold text-slate-900">
                  <div>{{ acc.name }}</div>
                  <span class="text-[10px] font-mono text-blue-700 bg-blue-50 px-1 rounded">{{ acc.code }}</span>
                </td>
                <td class="px-4 py-2.5 font-mono text-[11px] text-slate-600 font-semibold">
                  {{ acc.tier }}
                </td>
                <td class="px-4 py-2.5 text-center font-bold font-mono">
                  {{ acc.handled }}
                </td>
                <td class="px-4 py-2.5 text-center font-bold font-mono text-emerald-700">
                  {{ acc.responseRate }}%
                </td>
                <td class="px-4 py-2.5 text-center font-bold font-mono text-emerald-700">
                  {{ acc.resolutionRate }}%
                </td>
                <td class="px-4 py-2.5 text-center font-mono text-slate-700">
                  {{ acc.mttr }}
                </td>
                <td class="px-4 py-2.5 text-center font-mono font-bold" :class="acc.breaches > 0 ? 'text-rose-600' : 'text-slate-400'">
                  {{ acc.breaches }}
                </td>
                <td class="px-4 py-2.5 text-right">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded font-mono" :class="acc.trendBadge">
                    {{ acc.trend }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Side-by-Side Analytics: Source Channel & Priority Distribution -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <!-- Card 1: Intake Channel -->
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Incident Intake by Source Channel
            </h4>
            <span class="text-[10px] font-mono text-slate-400">Total: 100%</span>
          </div>

          <div class="space-y-2 text-[11px]">
            <div>
              <div class="flex items-center justify-between font-medium mb-1">
                <span class="text-emerald-700 font-bold">WhatsApp Support</span>
                <span class="font-mono text-slate-700">58% (34 Tiket)</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-emerald-500 h-2 rounded-full" style="width: 58%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between font-medium mb-1">
                <span class="text-blue-700 font-bold">Email Support</span>
                <span class="font-mono text-slate-700">24% (14 Tiket)</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 24%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between font-medium mb-1">
                <span class="text-purple-700 font-bold">Telepon Hotline Urgent</span>
                <span class="font-mono text-slate-700">12% (7 Tiket)</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-purple-500 h-2 rounded-full" style="width: 12%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between font-medium mb-1">
                <span class="text-slate-700 font-bold">Direct NOC Telemetry</span>
                <span class="font-mono text-slate-700">6% (3 Tiket)</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-slate-600 h-2 rounded-full" style="width: 6%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2: Priority Distribution -->
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Incident Priority Distribution
            </h4>
            <span class="text-[10px] font-mono text-slate-400">ITIL Matrix</span>
          </div>

          <div class="space-y-2 text-[11px]">
            <div>
              <div class="flex items-center justify-between font-medium mb-1">
                <span class="text-rose-700 font-bold">P1 - High Severity (Critical Service Down)</span>
                <span class="font-mono text-slate-700">35% (20 Tiket)</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-rose-500 h-2 rounded-full" style="width: 35%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between font-medium mb-1">
                <span class="text-amber-700 font-bold">P2 - Medium Severity (Intermittent / Degradation)</span>
                <span class="font-mono text-slate-700">45% (26 Tiket)</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-amber-500 h-2 rounded-full" style="width: 45%"></div>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between font-medium mb-1">
                <span class="text-sky-700 font-bold">P3 - Low Severity (Minor &amp; Account Request)</span>
                <span class="font-mono text-slate-700">20% (12 Tiket)</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div class="bg-sky-500 h-2 rounded-full" style="width: 20%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Engineer Velocity & Workload Roster -->
      <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Engineer Workload &amp; Resolution Velocity Roster
          </h4>
          <span class="text-[10px] font-mono text-slate-500">Resource Productivity</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-wider font-mono">
              <tr>
                <th class="px-4 py-2.5">Engineer Name &amp; Role</th>
                <th class="px-4 py-2.5 text-center">Active Load</th>
                <th class="px-4 py-2.5 text-center">Resolved Tickets</th>
                <th class="px-4 py-2.5 text-center">Average MTTR</th>
                <th class="px-4 py-2.5 text-center">SLA Compliance</th>
                <th class="px-4 py-2.5 text-right">KB Runbooks Authored</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="eng in engineerRoster" 
                :key="eng.name"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="px-4 py-2.5 font-bold text-slate-900">
                  <div>{{ eng.name }}</div>
                  <span class="text-[10px] text-slate-500 font-normal">{{ eng.role }}</span>
                </td>
                <td class="px-4 py-2.5 text-center font-mono font-bold text-blue-700">
                  {{ eng.activeCount }} Tiket
                </td>
                <td class="px-4 py-2.5 text-center font-mono font-bold text-emerald-700">
                  {{ eng.resolvedCount }} Tuntas
                </td>
                <td class="px-4 py-2.5 text-center font-mono text-slate-700">
                  {{ eng.avgMttr }}
                </td>
                <td class="px-4 py-2.5 text-center font-mono font-bold text-emerald-700">
                  {{ eng.compliance }}%
                </td>
                <td class="px-4 py-2.5 text-right font-mono font-semibold text-slate-800">
                  {{ eng.runbooks }} Dokumen
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Formal Signature Approval Block (Compliance Sign-off) -->
      <div class="grid grid-cols-2 gap-8 pt-6 text-center text-xs break-inside-avoid border-t border-slate-200">
        <div class="space-y-12">
          <p class="text-slate-600 text-[11px] font-semibold">Disiapkan Oleh (CPIG Helpdesk Lead):</p>
          <div>
            <p class="font-bold text-slate-900 underline text-xs">Rina Anggraini, S.Kom</p>
            <p class="text-[10px] text-slate-500">Helpdesk Operations &amp; Incident Triage</p>
          </div>
        </div>

        <div class="space-y-12">
          <p class="text-slate-600 text-[11px] font-semibold">Disetujui Oleh (Management GTT):</p>
          <div>
            <p class="font-bold text-slate-900 underline text-xs">Ir. Hendra Gunawan, M.T.</p>
            <p class="text-[10px] text-slate-500">Service Operations Manager &bull; NIK. 201804-099</p>
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
    if (selectedCustomer.value && t.customerId !== Number(selectedCustomer.value)) {
      return false;
    }
    return true;
  });
});

const reportStats = computed(() => {
  return {
    total: 58,
    slaRate: 99.4,
    highCount: 20,
    mediumCount: 26,
    lowCount: 12
  };
});

const customerPerformance = [
  {
    name: 'PT Bank Central Asia Tbk',
    code: 'BCA',
    tier: '24x7 Platinum Mission Critical',
    handled: 24,
    responseRate: 100.0,
    resolutionRate: 99.2,
    mttr: '1h 12m',
    breaches: 0,
    trend: 'EXCELLENT',
    trendBadge: 'bg-emerald-100 text-emerald-800'
  },
  {
    name: 'Dinas Komunikasi Prov. Banten',
    code: 'DISKOMINFO',
    tier: '24x7 Gold Public Sector',
    handled: 14,
    responseRate: 98.8,
    resolutionRate: 98.5,
    mttr: '2h 45m',
    breaches: 0,
    trend: 'STABLE',
    trendBadge: 'bg-blue-100 text-blue-800'
  },
  {
    name: 'RS Siloam Hospital Group',
    code: 'SILOAM',
    tier: '24x7 Healthcare Critical',
    handled: 12,
    responseRate: 100.0,
    resolutionRate: 100.0,
    mttr: '1h 30m',
    breaches: 0,
    trend: 'EXCELLENT',
    trendBadge: 'bg-emerald-100 text-emerald-800'
  },
  {
    name: 'PT Astra International Tbk',
    code: 'ASTRA',
    tier: '8x5 Silver Enterprise',
    handled: 8,
    responseRate: 99.1,
    resolutionRate: 99.4,
    mttr: '3h 10m',
    breaches: 0,
    trend: 'STABLE',
    trendBadge: 'bg-blue-100 text-blue-800'
  }
];

const engineerRoster = [
  {
    name: 'Budi Santoso',
    role: 'Lead SysOps Engineer',
    activeCount: 6,
    resolvedCount: 28,
    avgMttr: '1h 22m',
    compliance: 100.0,
    runbooks: 6
  },
  {
    name: 'Dwi Prasetyo',
    role: 'Storage & Backup Specialist',
    activeCount: 5,
    resolvedCount: 22,
    avgMttr: '1h 45m',
    compliance: 99.1,
    runbooks: 4
  },
  {
    name: 'Rizky Pratama',
    role: 'Network Infrastructure NOC',
    activeCount: 4,
    resolvedCount: 18,
    avgMttr: '2h 05m',
    compliance: 98.8,
    runbooks: 3
  },
  {
    name: 'Hendra Kusuma',
    role: 'Virtualization Escalation',
    activeCount: 7,
    resolvedCount: 20,
    avgMttr: '1h 50m',
    compliance: 99.5,
    runbooks: 5
  }
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

  const rows = ticketStore.tickets.map(t => [
    t.ticketNumber,
    `"${getCustomerName(t.customerId).replace(/"/g, '""')}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    t.severity,
    t.channel,
    t.status,
    `"${t.createdAt}"`,
    `"${t.resolutionDeadline || '-'}"`,
    t.isSlaResolutionBreached ? 'Breached' : 'Met'
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
