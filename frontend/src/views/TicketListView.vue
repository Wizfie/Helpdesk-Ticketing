<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- Header: Operational Breadcrumb & Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-slate-200">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-500 font-mono mb-1">
          <span class="text-blue-600 font-bold">GTT</span>
          <span>&gt;</span>
          <span class="text-slate-700 font-semibold">Operations</span>
          <span>&gt;</span>
          <span class="text-slate-400">Queue Management</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Antrean Tiket Insiden</span>
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
            {{ filteredTickets.length }} Aktif
          </span>
        </h1>
        <p class="text-xs text-slate-500 mt-0.5">
          Monitor, filter, dan eskalasi seluruh tiket insiden layanan pelanggan enterprise 24x7 secara real-time
        </p>
      </div>

      <div class="flex items-center space-x-2.5">
        <!-- Telemetry Status Indicator -->
        <div class="hidden md:flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-slate-700 font-medium">SLA Engine Active</span>
        </div>

        <!-- Create Ticket Action for ADMIN / CPIG -->
        <router-link
          v-if="authStore.currentUser.roleCode === 'ADMIN'"
          to="/tickets/create"
          class="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-sm transition-all transform active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>+ Buat Tiket Baru</span>
        </router-link>
      </div>
    </div>

    <!-- 4 Top KPI Summary Cards (Figma Spec) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <!-- 1. Active Queue Load -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Queue Load</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">{{ ticketStore.tickets.filter(t => t.status !== 'CLOSED').length }}</span>
            <span class="text-[11px] font-bold text-emerald-600">&uarr; 100% Monitored</span>
          </div>
          <span class="text-[11px] text-slate-500 mt-0.5 block">Di seluruh 4 mitra enterprise aktif</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
      </div>

      <!-- 2. SLA Near Breach (<2h) -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">SLA Near Breach (&lt;2H)</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-rose-600 font-mono">{{ nearBreachCount }}</span>
            <span class="text-[11px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Action req.</span>
          </div>
          <span class="text-[11px] text-slate-500 mt-0.5 block">Prioritas intervensi sebelum breach</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- 3. My Assigned Queue -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Antrean Saya (PIC)</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">{{ myAssignedCount }}</span>
            <span class="text-[11px] font-bold text-blue-600">{{ authStore.currentUser.initials }} Active</span>
          </div>
          <span class="text-[11px] text-slate-500 mt-0.5 block truncate max-w-[150px]">{{ authStore.currentUser.name }}</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
      </div>

      <!-- 4. Avg MTTR 24H -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg MTTR (24H)</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">1h 48m</span>
            <span class="text-[11px] font-bold text-emerald-600">&darr; -18m</span>
          </div>
          <span class="text-[11px] text-emerald-600 font-medium mt-0.5 block font-mono">97.8% SLA Target Met</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Main Ticket Monitor Section -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Tab Pills (Quick Filter Tabs - Figma Design) -->
      <div class="p-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5',
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            ]"
          >
            <span>{{ tab.label }}</span>
            <span 
              :class="[
                'text-[10px] px-1.5 py-0.2 rounded-full font-mono',
                activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Right Tools: Auto-refresh & Export -->
        <div class="flex items-center space-x-2">
          <!-- Auto Refresh 30s Toggle -->
          <button
            @click="isAutoRefresh = !isAutoRefresh"
            :class="[
              'inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              isAutoRefresh
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            ]"
            title="Otomatis muat ulang data setiap 30 detik"
          >
            <span class="w-2 h-2 rounded-full" :class="isAutoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'"></span>
            <span class="font-mono text-[11px]">Auto-refresh (30s)</span>
          </button>

          <!-- Export CSV Button -->
          <button
            @click="exportCsv"
            class="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all"
            title="Ekspor daftar tiket tersaring ke CSV"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Toolbar -->
      <div class="p-3.5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 bg-white text-xs">
        <!-- 1. Search Query -->
        <div class="lg:col-span-2 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari No. Tiket, Judul, Klien..."
            class="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- 2. Customer Filter -->
        <div>
          <select v-model="filterCustomer" class="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white">
            <option value="ALL">Semua Mitra Klien</option>
            <option v-for="c in ticketStore.customers" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <!-- 3. Severity Filter -->
        <div>
          <select v-model="filterSeverity" class="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white">
            <option value="ALL">Semua Severity</option>
            <option value="HIGH">HIGH (Sev 1 - 4h SLA)</option>
            <option value="MEDIUM">MEDIUM (Sev 2 - 8h SLA)</option>
            <option value="LOW">LOW (Sev 3 - 24h SLA)</option>
          </select>
        </div>

        <!-- 4. Category Filter -->
        <div>
          <select v-model="filterCategory" class="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white">
            <option value="ALL">Semua Kategori</option>
            <option v-for="cat in ticketStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <!-- 5. Channel/Source Filter -->
        <div>
          <select v-model="filterChannel" class="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-white">
            <option value="ALL">Semua Saluran</option>
            <option value="WHATSAPP">WhatsApp 24x7</option>
            <option value="EMAIL">Email Support</option>
            <option value="PHONE">Hotline Call</option>
            <option value="PORTAL">Portal Web</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Tag Strip -->
      <div v-if="isAnyFilterActive" class="px-4 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2 flex-wrap gap-y-1">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter Aktif:</span>
          <span v-if="searchQuery" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            Cari: "{{ searchQuery }}"
          </span>
          <span v-if="filterCustomer !== 'ALL'" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            Mitra: {{ getCustomerName(filterCustomer) }}
          </span>
          <span v-if="filterSeverity !== 'ALL'" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            Severity: {{ filterSeverity }}
          </span>
          <span v-if="filterCategory !== 'ALL'" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            Kategori: {{ getCategoryName(filterCategory) }}
          </span>
          <span v-if="filterChannel !== 'ALL'" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            Saluran: {{ filterChannel }}
          </span>
        </div>
        <button
          @click="resetAllFilters"
          class="text-blue-600 hover:text-blue-800 font-bold text-xs underline shrink-0"
        >
          Bersihkan Filter
        </button>
      </div>

      <!-- High-Density Ticket Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th class="py-3 px-3 w-10 text-center">
                <input type="checkbox" class="rounded text-blue-600 border-slate-300" />
              </th>
              <th class="py-3 px-3.5">No. Tiket</th>
              <th class="py-3 px-3.5">Pelanggan (Mitra)</th>
              <th class="py-3 px-4 min-w-[280px]">Judul Kendala & Ruang Lingkup</th>
              <th class="py-3 px-3">Kategori</th>
              <th class="py-3 px-3 text-center">Severity</th>
              <th class="py-3 px-3 text-center">Status</th>
              <th class="py-3 px-3">Saluran</th>
              <th class="py-3 px-3">Teknisi PIC</th>
              <th class="py-3 px-3.5 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              @click="$router.push(`/tickets/${ticket.id}`)"
              class="hover:bg-blue-50/60 transition-colors cursor-pointer group"
              :class="[
                ticket.isSlaResolutionBreached 
                  ? 'bg-rose-50/40' 
                  : isNearBreach(ticket) 
                    ? 'bg-amber-50/30' 
                    : ''
              ]"
            >
              <!-- Checkbox -->
              <td class="py-3 px-3 text-center" @click.stop>
                <input type="checkbox" class="rounded text-blue-600 border-slate-300" />
              </td>

              <!-- Ticket Number & Urgency Dot -->
              <td class="py-3 px-3.5 font-mono whitespace-nowrap">
                <div class="flex items-center space-x-1.5">
                  <span 
                    class="w-2 h-2 rounded-full shrink-0"
                    :class="[
                      ticket.isSlaResolutionBreached ? 'bg-rose-500 animate-pulse' :
                      isNearBreach(ticket) ? 'bg-amber-500' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-blue-500'
                    ]"
                  ></span>
                  <span class="font-bold text-blue-600 group-hover:text-blue-800 underline decoration-blue-200">
                    {{ ticket.ticketNumber }}
                  </span>
                </div>
              </td>

              <!-- Customer -->
              <td class="py-3 px-3.5 whitespace-nowrap">
                <span class="font-semibold text-slate-800">{{ getCustomerName(ticket.customerId) }}</span>
              </td>

              <!-- Title & Subtitle Scope -->
              <td class="py-3 px-4">
                <div class="font-medium text-slate-900 group-hover:text-blue-900 line-clamp-1">
                  {{ ticket.title }}
                </div>
                <div class="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
                  {{ ticket.description?.slice(0, 75) || 'Penanganan teknis operasional SLA 24x7' }}...
                </div>
              </td>

              <!-- Category Badge -->
              <td class="py-3 px-3 whitespace-nowrap">
                <span class="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[11px] border border-slate-200">
                  {{ getCategoryName(ticket.categoryId) }}
                </span>
              </td>

              <!-- Severity Badge -->
              <td class="py-3 px-3 text-center whitespace-nowrap">
                <span 
                  :class="[
                    'font-bold px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider',
                    ticket.severity === 'HIGH' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    ticket.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  ]"
                >
                  {{ ticket.severity }}
                </span>
              </td>

              <!-- Status Badge -->
              <td class="py-3 px-3 text-center whitespace-nowrap">
                <span 
                  :class="[
                    'font-bold px-2 py-0.5 rounded text-[10px] uppercase',
                    ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                    ticket.status === 'CLOSED' ? 'bg-slate-200 text-slate-700' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                    'bg-amber-100 text-amber-800'
                  ]"
                >
                  {{ ticket.status }}
                </span>
              </td>

              <!-- Source Channel -->
              <td class="py-3 px-3 whitespace-nowrap">
                <span class="text-[11px] font-medium text-slate-600 flex items-center space-x-1">
                  <span v-if="ticket.channel === 'WHATSAPP'">💬 WhatsApp</span>
                  <span v-else-if="ticket.channel === 'EMAIL'">✉️ Email</span>
                  <span v-else-if="ticket.channel === 'PHONE'">📞 Telepon</span>
                  <span v-else>🌐 Portal</span>
                </span>
              </td>

              <!-- Assigned Engineer PIC -->
              <td class="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                <span v-if="ticket.assignedToId" class="text-slate-700 font-medium">
                  {{ getEngineerName(ticket.assignedToId) }}
                </span>
                <span v-else class="text-rose-500 font-bold italic">
                  Belum Ditugaskan
                </span>
              </td>

              <!-- Action Button -->
              <td class="py-3 px-3.5 text-right whitespace-nowrap" @click.stop>
                <router-link
                  :to="`/tickets/${ticket.id}`"
                  class="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 rounded border border-blue-200 hover:border-blue-600 transition-all"
                >
                  <span>Detail</span>
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </router-link>
              </td>
            </tr>

            <tr v-if="filteredTickets.length === 0">
              <td colspan="10" class="py-12 text-center text-slate-400">
                <svg class="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="font-bold text-sm text-slate-600">Tidak ada tiket yang cocok dengan filter</p>
                <p class="text-xs text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian atau ubah filter status</p>
                <button @click="resetAllFilters" class="mt-3 px-3 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100">
                  Reset Semua Filter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination & Compliance Summary Footer (Figma Spec) -->
      <div class="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div class="flex items-center space-x-4">
          <span>
            Menampilkan <strong class="text-slate-800 font-mono">{{ startIndex + 1 }}</strong> s.d. <strong class="text-slate-800 font-mono">{{ Math.min(endIndex, filteredTickets.length) }}</strong> dari <strong class="text-slate-800 font-mono">{{ filteredTickets.length }}</strong> tiket
          </span>
          <div class="flex items-center space-x-1 font-mono">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-emerald-700 font-semibold">{{ ticketStore.slaComplianceRate }}% SLA Compliance</span>
          </div>
        </div>

        <!-- Page Controls -->
        <div class="flex items-center space-x-2 font-mono">
          <button
            @click="currentPage--"
            :disabled="currentPage <= 1"
            class="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            &larr; Prev
          </button>
          <span class="px-2 font-bold text-slate-800">Hal {{ currentPage }} dari {{ totalPages || 1 }}</span>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { useAuthStore } from '../stores/authStore';

const ticketStore = useTicketStore();
const authStore = useAuthStore();

// Filter States
const activeTab = ref('ALL');
const searchQuery = ref('');
const filterCustomer = ref('ALL');
const filterSeverity = ref('ALL');
const filterCategory = ref('ALL');
const filterChannel = ref('ALL');
const isAutoRefresh = ref(true);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Helper methods
const getCustomerName = (customerId) => {
  const c = ticketStore.customers.find(item => item.id === Number(customerId));
  return c ? c.name : `Customer #${customerId}`;
};

const getCategoryName = (categoryId) => {
  const cat = ticketStore.categories.find(item => item.id === Number(categoryId));
  return cat ? cat.name : `Category #${categoryId}`;
};

const getEngineerName = (engineerId) => {
  const user = authStore.users.find(u => u.id === Number(engineerId));
  return user ? user.name : `Engineer #${engineerId}`;
};

const isNearBreach = (ticket) => {
  // Ticket is open/in progress and approaching deadline within 2 hours
  if (['RESOLVED', 'CLOSED'].includes(ticket.status)) return false;
  if (!ticket.resolutionDeadline) return false;
  const remainingMs = new Date(ticket.resolutionDeadline).getTime() - Date.now();
  return remainingMs > 0 && remainingMs < 2 * 3600 * 1000;
};

// Computed Counts for Filter Tabs
const nearBreachCount = computed(() => {
  return ticketStore.tickets.filter(t => isNearBreach(t)).length;
});

const myAssignedCount = computed(() => {
  return ticketStore.tickets.filter(t => t.assignedToId === authStore.currentUser.id && t.status !== 'CLOSED').length;
});

const highPriorityCount = computed(() => {
  return ticketStore.tickets.filter(t => t.severity === 'HIGH' && t.status !== 'CLOSED').length;
});

const waitingPrincipalCount = computed(() => {
  return ticketStore.tickets.filter(t => t.status === 'PENDING_VENDOR' || !!t.principalCaseId).length;
});

const resolvedTodayCount = computed(() => {
  return ticketStore.tickets.filter(t => t.status === 'RESOLVED').length;
});

const filterTabs = computed(() => [
  { id: 'ALL', label: 'Semua Tiket', count: ticketStore.tickets.length },
  { id: 'MY_ASSIGNED', label: 'Antrean Saya', count: myAssignedCount.value },
  { id: 'HIGH_PRIORITY', label: 'Prioritas Tinggi', count: highPriorityCount.value },
  { id: 'SLA_NEAR_BREACH', label: 'SLA Near Breach', count: nearBreachCount.value },
  { id: 'WAITING_PRINCIPAL', label: 'Menunggu Principal', count: waitingPrincipalCount.value },
  { id: 'RESOLVED_TODAY', label: 'Selesai', count: resolvedTodayCount.value }
]);

// Main Filter Logic
const filteredTickets = computed(() => {
  return ticketStore.tickets.filter(t => {
    // 1. Tab filter
    if (activeTab.value === 'MY_ASSIGNED' && t.assignedToId !== authStore.currentUser.id) return false;
    if (activeTab.value === 'HIGH_PRIORITY' && t.severity !== 'HIGH') return false;
    if (activeTab.value === 'SLA_NEAR_BREACH' && !isNearBreach(t)) return false;
    if (activeTab.value === 'WAITING_PRINCIPAL' && t.status !== 'PENDING_VENDOR' && !t.principalCaseId) return false;
    if (activeTab.value === 'RESOLVED_TODAY' && t.status !== 'RESOLVED') return false;

    // 2. Dropdown filters
    if (filterCustomer.value !== 'ALL' && t.customerId !== Number(filterCustomer.value)) return false;
    if (filterSeverity.value !== 'ALL' && t.severity !== filterSeverity.value) return false;
    if (filterCategory.value !== 'ALL' && t.categoryId !== Number(filterCategory.value)) return false;
    if (filterChannel.value !== 'ALL' && t.channel !== filterChannel.value) return false;

    // 3. Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchNum = t.ticketNumber?.toLowerCase().includes(q);
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchCust = getCustomerName(t.customerId).toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q);
      if (!matchNum && !matchTitle && !matchCust && !matchDesc) return false;
    }

    return true;
  });
});

const isAnyFilterActive = computed(() => {
  return searchQuery.value.trim() !== '' ||
    filterCustomer.value !== 'ALL' ||
    filterSeverity.value !== 'ALL' ||
    filterCategory.value !== 'ALL' ||
    filterChannel.value !== 'ALL';
});

const resetAllFilters = () => {
  searchQuery.value = '';
  filterCustomer.value = 'ALL';
  filterSeverity.value = 'ALL';
  filterCategory.value = 'ALL';
  filterChannel.value = 'ALL';
  activeTab.value = 'ALL';
  currentPage.value = 1;
};

// Pagination calculation
const totalPages = computed(() => Math.ceil(filteredTickets.value.length / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedTickets = computed(() => filteredTickets.value.slice(startIndex.value, endIndex.value));

// Export to CSV
const exportCsv = () => {
  const headers = ['No. Tiket', 'Pelanggan', 'Judul', 'Severity', 'Kategori', 'Status', 'Saluran', 'Teknisi PIC'];
  const rows = filteredTickets.value.map(t => [
    t.ticketNumber,
    `"${getCustomerName(t.customerId)}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.severity,
    `"${getCategoryName(t.categoryId)}"`,
    t.status,
    t.channel,
    `"${getEngineerName(t.assignedToId)}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GTT_Antrean_Tiket_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
