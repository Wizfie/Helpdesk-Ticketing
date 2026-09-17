<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Top Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link to="/tickets" class="hover:text-blue-600 transition-colors">Admin Settings</router-link>
          <span>/</span>
          <span class="text-slate-800">SLA Policy &amp; Escalations</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <span>Konfigurasi Matriks SLA &amp; Jalur Eskalasi</span>
          <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            POLICY ENGINE
          </span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Kelola parameter batas waktu kontrak PKS klien, logika dual engine (Response &amp; Resolution), serta aturan eskalasi otomatis.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="openAddPolicyModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Tambah Kebijakan SLA Baru</span>
        </button>
      </div>
    </div>

    <!-- 3 Policy KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ACTIVE SLA POLICIES</span>
          <span class="text-2xl font-black text-slate-900 font-mono mt-0.5 block">{{ policies.length }} Tier Kontrak</span>
          <span class="text-[11px] text-emerald-600 font-medium">Semua kebijakan terikat PKS aktif</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">OPERATING COVERAGE</span>
          <span class="text-2xl font-black text-slate-900 font-mono mt-0.5 block">24x7 &amp; 8x5 Hybrid</span>
          <span class="text-[11px] text-blue-600 font-medium">Kalender kerja &amp; hari libur nasional tersinkron</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ESCALATION TRIGGERS</span>
          <span class="text-2xl font-black text-slate-900 font-mono mt-0.5 block">3-Stage Active</span>
          <span class="text-[11px] text-purple-600 font-medium">Email Dispatch &amp; L3 Bridge siaga</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Contractual Threshold Matrix Table -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 class="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <span>Contractual Threshold Matrix (Matriks Batas Waktu Kontrak)</span>
            <span class="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
              ENFORCEABLE MSA
            </span>
          </h2>
          <p class="text-[11px] text-slate-500 mt-0.5">
            Parameter kepatuhan garansi waktu respon dan penyelesaian berdasarkan kesepakatan tingkat layanan (SLA)
          </p>
        </div>

        <div class="text-[11px] text-slate-400 font-mono">
          Last updated: Today, 08:00 WIB
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
            <tr>
              <th class="px-5 py-3">Policy Name &amp; Code</th>
              <th class="px-5 py-3">Operating Window</th>
              <th class="px-5 py-3">First Touch Response</th>
              <th class="px-5 py-3">Full Resolution Target</th>
              <th class="px-5 py-3">Pause Allowance</th>
              <th class="px-5 py-3">Penalty / Rebate Clause</th>
              <th class="px-5 py-3 text-center">Status</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="policy in policies" 
              :key="policy.id"
              class="hover:bg-blue-50/20 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="font-bold text-slate-900 text-xs">{{ policy.name }}</div>
                <div class="flex items-center space-x-1.5 mt-0.5 text-[10px] font-mono">
                  <span class="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">{{ policy.code }}</span>
                  <span class="text-slate-400">&bull;</span>
                  <span class="text-slate-500">{{ policy.customerCount }} Klien Terikat</span>
                </div>
              </td>

              <td class="px-5 py-3.5">
                <span 
                  class="font-mono font-bold text-[11px] px-2 py-0.5 rounded"
                  :class="policy.operatingHours.includes('24x7') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ policy.operatingHours }}
                </span>
                <span class="block text-[10px] text-slate-400 mt-0.5 font-mono">{{ policy.scheduleDesc }}</span>
              </td>

              <td class="px-5 py-3.5">
                <div class="font-black text-slate-900 font-mono text-sm">&le; {{ policy.responseMinutes }}m</div>
                <span class="text-[10px] text-slate-400 font-mono">First Engineering Action</span>
              </td>

              <td class="px-5 py-3.5">
                <div class="font-black font-mono text-sm" :class="policy.severityColor">
                  &le; {{ policy.resolutionHours }}h
                </div>
                <span class="text-[10px] text-slate-400 font-mono">Service Restored MTTR</span>
              </td>

              <td class="px-5 py-3.5">
                <span class="text-[11px] text-slate-700 font-medium block">{{ policy.pauseRule }}</span>
                <span class="text-[10px] text-slate-400">Persetujuan Lead NOC</span>
              </td>

              <td class="px-5 py-3.5">
                <div class="font-semibold text-rose-700 text-[11px]">{{ policy.penaltyClause }}</div>
                <span class="text-[10px] text-slate-400 font-mono">Audit Invoice Bulanan</span>
              </td>

              <td class="px-5 py-3.5 text-center">
                <span class="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  ENFORCED
                </span>
              </td>

              <td class="px-5 py-3.5 text-right">
                <button
                  @click="editPolicy(policy)"
                  class="text-blue-600 hover:text-blue-800 font-bold text-xs p-1 rounded hover:bg-blue-50 transition-colors"
                >
                  Edit Policy
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2 Cards: Dual SLA Engine Execution Logic & Multi-Stage Automated Escalations -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <!-- Card 1: Dual SLA Engine Logic -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h3 class="font-bold text-slate-900 text-sm">Dual SLA Engine Execution Logic</h3>
          </div>
          <span class="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
            STANDAR ITIL v4
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <!-- Engine 1 -->
          <div class="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-blue-900 uppercase font-mono text-[11px]">01. Response SLA Engine (First Touch)</span>
              <span class="text-[10px] bg-blue-200 text-blue-800 font-bold px-1.5 py-0.5 rounded">AUTO-START</span>
            </div>
            <p class="text-[11px] text-blue-800 leading-relaxed">
              Dihitung sejak tiket diterbitkan di sistem intake hingga adanya intervensi awal berupa penugasan teknisi atau pencatatan diagnosa pertama.
            </p>
            <div class="text-[10px] font-mono text-blue-700 font-semibold pt-1 border-t border-blue-200/60 flex items-center justify-between">
              <span>Status: Active Non-Stop</span>
              <span>Target Maksimal: 30 Mins (P1)</span>
            </div>
          </div>

          <!-- Engine 2 -->
          <div class="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-indigo-900 uppercase font-mono text-[11px]">02. Resolution SLA Engine (Net MTTR)</span>
              <span class="text-[10px] bg-indigo-200 text-indigo-800 font-bold px-1.5 py-0.5 rounded">PAUSEABLE</span>
            </div>
            <p class="text-[11px] text-indigo-800 leading-relaxed">
              Menghitung total durasi pemulihan layanan secara netto. Jam kerja dibekukan (*Clock Paused*) jika tiket menunggu suku cadang principal atau konfirmasi customer.
            </p>
            <div class="text-[10px] font-mono text-indigo-700 font-semibold pt-1 border-t border-indigo-200/60 flex items-center justify-between">
              <span>Status: Clock Runs dynamically</span>
              <span>Target Maksimal: 4 - 8 Hours</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card 2: Multi-Stage Automated Escalation Triggers -->
      <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <h3 class="font-bold text-slate-900 text-sm">Multi-Stage Automated Escalation Triggers</h3>
          </div>
          <span class="text-[10px] font-mono font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
            AUTO DISPATCH
          </span>
        </div>

        <div class="space-y-3 text-xs">
          <!-- Stage 1 -->
          <div class="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start space-x-3">
            <span class="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900">Stage 1 (50% SLA Elapse Warning)</span>
                <span class="text-[10px] font-mono text-amber-700 font-bold">INFO LEVEL</span>
              </div>
              <p class="text-[11px] text-slate-600 mt-0.5">
                Mengirimkan notifikasi pengingat via Email Relay ke Teknisi Penanggung Jawab dan Lead SysOps.
              </p>
            </div>
          </div>

          <!-- Stage 2 -->
          <div class="p-3 rounded-lg border border-rose-200 bg-rose-50/50 flex items-start space-x-3">
            <span class="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-rose-900">Stage 2 (80% SLA Imminent Breach)</span>
                <span class="text-[10px] font-mono text-rose-700 font-bold">URGENT ALERT</span>
              </div>
              <p class="text-[11px] text-rose-800 mt-0.5">
                Mengirimkan Email Alert Prioritas Tinggi, eskalasi otomatis ke Service Operations Manager, dan aktivasi L3 Principal Bridge.
              </p>
            </div>
          </div>

          <!-- Stage 3 -->
          <div class="p-3 rounded-lg border border-purple-200 bg-purple-50/50 flex items-start space-x-3">
            <span class="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-purple-900">Stage 3 (100% SLA Breach Audit)</span>
                <span class="text-[10px] font-mono text-purple-700 font-bold">CRITICAL PENALTY</span>
              </div>
              <p class="text-[11px] text-purple-800 mt-0.5">
                Pencatatan pelanggaran ke dalam Audit Log permanen, notifikasi ke Komite Direksi, dan kewajiban investigasi RCA formal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Edit / Tambah Kebijakan SLA -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div class="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-bold text-slate-900 text-sm">
            {{ isEditing ? 'Edit Parameter Kebijakan SLA' : 'Tambah Kebijakan SLA Baru' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="savePolicy" class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Kebijakan SLA *</label>
            <input v-model="formPolicy.name" required type="text" placeholder="Contoh: Platinum 24x7 Mission Critical" class="w-full p-2 border border-slate-200 rounded-lg" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Singkat *</label>
              <input v-model="formPolicy.code" required type="text" placeholder="Contoh: SLA-PLATINUM" class="w-full p-2 border border-slate-200 rounded-lg font-mono uppercase" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Operating Window *</label>
              <select v-model="formPolicy.operatingHours" class="w-full p-2 border border-slate-200 rounded-lg bg-white">
                <option value="24x7 Full Calendar">24x7 Full Calendar</option>
                <option value="08:00 - 17:00 WIB (Mon-Fri)">08:00 - 17:00 WIB (Mon-Fri)</option>
                <option value="07:00 - 18:00 WIB (Mon-Sat)">07:00 - 18:00 WIB (Mon-Sat)</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Batas Respon (Menit) *</label>
              <input v-model.number="formPolicy.responseMinutes" required type="number" min="5" placeholder="15" class="w-full p-2 border border-slate-200 rounded-lg font-mono" />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Batas Resolusi (Jam) *</label>
              <input v-model.number="formPolicy.resolutionHours" required type="number" min="1" placeholder="4" class="w-full p-2 border border-slate-200 rounded-lg font-mono" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Klausul Penalti / Rebate Keterlambatan</label>
            <input v-model="formPolicy.penaltyClause" type="text" placeholder="Contoh: 2.5% Rebate / 1h Breach (Maksimal 15%)" class="w-full p-2 border border-slate-200 rounded-lg" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showModal = false" class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs">Simpan Kebijakan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
const isEditing = ref(false);

const policies = ref([
  {
    id: 1,
    name: 'Platinum 24x7 Mission Critical',
    code: 'SLA-PLATINUM',
    customerCount: 2,
    operatingHours: '24x7 Full Calendar',
    scheduleDesc: 'Termasuk Akhir Pekan & Hari Libur',
    responseMinutes: 15,
    resolutionHours: 4,
    severityColor: 'text-rose-600',
    pauseRule: 'Vendor Wait / Emergency Maint.',
    penaltyClause: '2.5% Rebate / 1h Breach'
  },
  {
    id: 2,
    name: 'Enterprise 8x5 Gold Standard',
    code: 'SLA-GOLD',
    customerCount: 1,
    operatingHours: '08:00 - 17:00 WIB (Mon-Fri)',
    scheduleDesc: 'Hari Kerja Normal',
    responseMinutes: 30,
    resolutionHours: 8,
    severityColor: 'text-amber-600',
    pauseRule: 'Customer Verification Allowed',
    penaltyClause: '1.5% Service Credit / Breach'
  },
  {
    id: 3,
    name: 'Government 8x5 Tier-1 Dedicated',
    code: 'SLA-GOV-T1',
    customerCount: 1,
    operatingHours: '07:30 - 16:30 WIB (Mon-Fri)',
    scheduleDesc: 'Hari Kerja Dinas & Pemda',
    responseMinutes: 60,
    resolutionHours: 12,
    severityColor: 'text-blue-600',
    pauseRule: 'Official BAST / Onsite Confirmation',
    penaltyClause: 'Pinalti Keterlambatan SP-1'
  },
  {
    id: 4,
    name: 'Standard Silver Managed Care',
    code: 'SLA-SILVER',
    customerCount: 1,
    operatingHours: '08:00 - 17:00 WIB (Mon-Fri)',
    scheduleDesc: 'Hari Kerja Non-Kritis',
    responseMinutes: 120,
    resolutionHours: 24,
    severityColor: 'text-slate-600',
    pauseRule: 'General Awaiting Parts',
    penaltyClause: 'Tinjauan Kontrak Triwulan'
  }
]);

const formPolicy = ref({
  id: null,
  name: '',
  code: '',
  operatingHours: '24x7 Full Calendar',
  responseMinutes: 30,
  resolutionHours: 8,
  penaltyClause: ''
});

const openAddPolicyModal = () => {
  isEditing.value = false;
  formPolicy.value = {
    id: null,
    name: '',
    code: '',
    operatingHours: '24x7 Full Calendar',
    responseMinutes: 30,
    resolutionHours: 8,
    penaltyClause: '2.0% Rebate / Breach'
  };
  showModal.value = true;
};

const editPolicy = (policy) => {
  isEditing.value = true;
  formPolicy.value = { ...policy };
  showModal.value = true;
};

const savePolicy = () => {
  if (isEditing.value) {
    const idx = policies.value.findIndex(p => p.id === formPolicy.value.id);
    if (idx !== -1) {
      policies.value[idx] = { ...policies.value[idx], ...formPolicy.value };
    }
  } else {
    policies.value.push({
      id: Date.now(),
      customerCount: 0,
      scheduleDesc: 'Konfigurasi Kustom',
      severityColor: 'text-blue-600',
      pauseRule: 'Standard Approval Required',
      ...formPolicy.value
    });
  }
  showModal.value = false;
};
</script>
