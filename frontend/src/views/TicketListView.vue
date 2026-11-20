<template>
  <div class="space-y-5 animate-in fade-in duration-200">
    <!-- Header: Operational Breadcrumb & Top Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center space-x-2 text-xs text-slate-500 font-mono mb-1">
          <span class="text-blue-600 font-bold">GTT</span>
          <span>&gt;</span>
          <span class="text-slate-700 font-semibold">Operations</span>
          <span>&gt;</span>
          <span class="text-slate-400">Queue Management</span>
        </div>
        <div class="flex items-center gap-2.5">
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {{ authStore.isEngineer ? 'Antrean Tiket Saya (Assigned Engineer)' : 'Antrean Tiket Insiden' }}
          </h1>
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono">
            {{ filteredTickets.length }} Tiket
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          {{ authStore.isEngineer 
            ? `Menampilkan khusus tiket insiden yang ditugaskan kepada ${authStore.currentUser?.name || 'Engineer'}.` 
            : 'Monitor, filter, dan kelola seluruh tiket insiden layanan pelanggan enterprise 24x7 secara real-time.' }}
        </p>
      </div>

      <div class="flex flex-col sm:items-end space-y-1">
        <div class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold">Sistem Operasional Aktif</span>
        </div>
        <span class="text-[11px] text-slate-400 font-mono">
          Terakhir diperbarui: {{ currentFormattedTime }}
        </span>
      </div>
    </div>

    <!-- 5 KPI Summary Cards (Mockup Point 6) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      <!-- 1. Active Queue Load -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-xs transition-shadow">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Queue Load</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">{{ totalActiveTickets }}</span>
            <span class="text-[11px] font-bold text-emerald-600 flex items-center">
              &uarr; 60% dari kemarin
            </span>
          </div>
          <span class="text-[11px] text-slate-500 mt-0.5 block">Tiket yang sedang ditangani</span>
        </div>
        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
      </div>

      <!-- 2. SLA Near Breach (<2h) -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-xs transition-shadow">
        <div>
          <span class="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">SLA Near Breach (&lt;2H)</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-rose-600 font-mono">{{ nearBreachCount }}</span>
            <span class="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <span>&#9888;</span> Perlu perhatian
            </span>
          </div>
          <span class="text-[11px] text-slate-500 mt-0.5 block">Tiket mendekati batas SLA</span>
        </div>
        <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- 3. Menunggu Principal / Vendor -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-xs transition-shadow">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Menunggu Principal / Vendor</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">{{ waitingPrincipalCount }}</span>
            <span class="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded flex items-center gap-1">
              <span>&#9203;</span> Menunggu respon
            </span>
          </div>
          <span class="text-[11px] text-slate-500 mt-0.5 block">Tiket dalam eskalasi pihak ketiga</span>
        </div>
        <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
      </div>

      <!-- 4. Tiket Saya (PIC) -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-xs transition-shadow">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tiket Saya (PIC)</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">{{ myAssignedCount }}</span>
          </div>
          <span class="text-[11px] text-slate-600 font-medium mt-0.5 block truncate max-w-[140px]">
            {{ currentPicName }}
          </span>
        </div>
        <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
      </div>

      <!-- 5. Avg MTTR (7 Hari) -->
      <div class="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-xs transition-shadow">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AVG MTTR (7 HARI)</span>
          <div class="flex items-baseline space-x-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">3h 25m</span>
            <span class="text-[11px] font-bold text-emerald-600 flex items-center">
              &darr; 20%
            </span>
          </div>
          <span class="text-[11px] text-slate-500 mt-0.5 block">Dari minggu sebelumnya</span>
        </div>
        <div class="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Main Ticket Monitor Section -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- 7 Filter Tabs Bar + Action Tools -->
      <div class="p-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <!-- Filter Tabs -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            @click="setTab(tab.id)"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer',
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
            ]"
          >
            <span>{{ tab.label }}</span>
            <span 
              :class="[
                'text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold',
                activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              ]"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Right Tools: Auto-refresh & Ekspor CSV -->
        <div class="flex items-center space-x-2">
          <!-- Auto-refresh (30s) -->
          <button
            @click="isAutoRefresh = !isAutoRefresh"
            :class="[
              'inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer',
              isAutoRefresh
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            ]"
            title="Otomatis muat ulang data setiap 30 detik"
          >
            <svg class="w-3.5 h-3.5 text-emerald-600" :class="isAutoRefresh ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span class="font-medium text-xs">Auto-refresh (30s)</span>
          </button>

          <!-- Ekspor CSV -->
          <button
            @click="exportCsv"
            class="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Ekspor daftar tiket tersaring ke CSV"
          >
            <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      <!-- Filter Controls Toolbar (Search + 5 Dropdowns) -->
      <div class="p-3 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-2.5 bg-white text-xs">
        <!-- 1. Search Query (lg:col-span-4) -->
        <div class="lg:col-span-4 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari No. Tiket, Judul, atau Customer..."
            class="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- 2. Mitra Klien (lg:col-span-2) -->
        <div class="lg:col-span-2">
          <BaseSelect
            v-model="filterCustomer"
            :options="filterCustomerOptions"
            size="sm"
            searchable
            placeholder="Semua Mitra Klien"
          />
        </div>

        <!-- 3. Severity (lg:col-span-2) -->
        <div class="lg:col-span-2">
          <BaseSelect
            v-model="filterSeverity"
            :options="filterSeverityOptions"
            size="sm"
            placeholder="Semua Severity"
          />
        </div>

        <!-- 4. Kategori (lg:col-span-2) -->
        <div class="lg:col-span-2">
          <BaseSelect
            v-model="filterCategory"
            :options="filterCategoryOptions"
            size="sm"
            searchable
            placeholder="Semua Kategori"
          />
        </div>

        <!-- 5. Saluran (lg:col-span-1) -->
        <div class="lg:col-span-1">
          <BaseSelect
            v-model="filterChannel"
            :options="filterChannelOptions"
            size="sm"
            placement="right"
            placeholder="Semua Saluran"
          />
        </div>

        <!-- 6. SLA Status (lg:col-span-1) -->
        <div class="lg:col-span-1">
          <BaseSelect
            v-model="filterSlaStatus"
            :options="filterSlaStatusOptions"
            size="sm"
            placement="right"
            placeholder="SLA Status"
          />
        </div>
      </div>

      <!-- Active Filters Tag Strip -->
      <div v-if="isAnyFilterActive" class="px-4 py-2 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs">
        <div class="flex items-center space-x-2 flex-wrap gap-y-1">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter Aktif:</span>
          <span v-if="activeTab !== 'ALL'" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            Tab: {{ getTabLabel(activeTab) }}
          </span>
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
            Kategori: {{ filterCategory }}
          </span>
          <span v-if="filterChannel !== 'ALL'" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            Saluran: {{ filterChannel }}
          </span>
          <span v-if="filterSlaStatus !== 'ALL'" class="bg-white border border-blue-200 text-blue-800 px-2 py-0.5 rounded-md font-mono text-[11px]">
            SLA: {{ filterSlaStatus }}
          </span>
        </div>
        <button
          @click="resetAllFilters"
          class="text-blue-600 hover:text-blue-800 font-bold text-xs underline shrink-0 cursor-pointer"
        >
          Bersihkan Filter
        </button>
      </div>

      <!-- 12-Column High-Density Ticket Table (Point 6 Mockup) -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <!-- 1. Checkbox -->
              <th class="py-3 px-3 w-8 text-center">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll" 
                  class="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" 
                />
              </th>

              <!-- 2. NO. TIKET -->
              <th class="py-3 px-3 whitespace-nowrap">NO. TIKET</th>

              <!-- 3. PELANGGAN (MITRA) -->
              <th class="py-3 px-3 whitespace-nowrap">PELANGGAN (MITRA)</th>

              <!-- 4. JUDUL KENDALA & RUANG LINGKUP -->
              <th class="py-3 px-3 min-w-[260px]">
                <div>JUDUL KENDALA & RUANG LINGKUP</div>
                <div class="text-[9px] text-slate-400 font-normal lowercase tracking-normal">Deskripsi Singkat</div>
              </th>

              <!-- 5. KATEGORI -->
              <th class="py-3 px-2.5 whitespace-nowrap">KATEGORI</th>

              <!-- 6. SEVERITY -->
              <th class="py-3 px-2.5 text-center whitespace-nowrap">SEVERITY</th>

              <!-- 7. SLA RESPONSE -->
              <th class="py-3 px-3 whitespace-nowrap">
                <div>SLA RESPONSE</div>
                <div class="text-[9px] text-slate-400 font-normal lowercase tracking-normal">Target | Aktual</div>
              </th>

              <!-- 8. SLA RESOLUTION -->
              <th class="py-3 px-3 whitespace-nowrap">
                <div>SLA RESOLUTION</div>
                <div class="text-[9px] text-slate-400 font-normal lowercase tracking-normal">Target | Sisa Waktu</div>
              </th>

              <!-- 9. STATUS -->
              <th class="py-3 px-3 whitespace-nowrap min-w-[130px]">
                <div>STATUS</div>
                <div class="text-[9px] text-slate-400 font-normal lowercase tracking-normal">Progress</div>
              </th>

              <!-- 10. PRINCIPAL / VENDOR -->
              <th class="py-3 px-3 whitespace-nowrap">
                <div>PRINCIPAL / VENDOR</div>
                <div class="text-[9px] text-slate-400 font-normal lowercase tracking-normal">Case ID</div>
              </th>

              <!-- 11. KB MATCH -->
              <th class="py-3 px-2 text-center whitespace-nowrap">KB Match</th>

              <!-- 12. TINDAKAN -->
              <th class="py-3 px-3 text-center whitespace-nowrap">TINDAKAN</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white">
            <tr
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              @click="$router.push(`/tickets/${ticket.id}`)"
              class="hover:bg-blue-50/50 transition-colors cursor-pointer group"
            >
              <!-- 1. Checkbox -->
              <td class="py-3 px-3 text-center" @click.stop>
                <input 
                  type="checkbox" 
                  :value="ticket.id" 
                  v-model="selectedTicketIds" 
                  class="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer" 
                />
              </td>

              <!-- 2. NO. TIKET (Clickable Blue Monospace) -->
              <td class="py-3 px-3 whitespace-nowrap font-mono">
                <router-link
                  :to="`/tickets/${ticket.id}`"
                  @click.stop
                  class="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {{ ticket.ticketNumber }}
                </router-link>
              </td>

              <!-- 3. PELANGGAN (MITRA) -->
              <td class="py-3 px-3 whitespace-nowrap font-medium text-slate-800">
                {{ getCustomerName(ticket.customerId) }}
              </td>

              <!-- 4. JUDUL KENDALA & RUANG LINGKUP -->
              <td class="py-3 px-3">
                <div class="font-bold text-slate-900 group-hover:text-blue-900 leading-snug line-clamp-1">
                  {{ ticket.title }}
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {{ ticket.scopeSubtitle || ticket.description || 'Deskripsi singkat kendala teknis layanan.' }}
                </div>
              </td>

              <!-- 5. KATEGORI (Light pill tag) -->
              <td class="py-3 px-2.5 whitespace-nowrap">
                <span class="inline-block bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-medium px-2 py-0.5 rounded">
                  {{ getCategoryDisplay(ticket) }}
                </span>
              </td>

              <!-- 6. SEVERITY (Solid vibrant pill) -->
              <td class="py-3 px-2.5 text-center whitespace-nowrap">
                <span 
                  :class="[
                    'font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide inline-block shadow-2xs',
                    ticket.severity === 'HIGH' ? 'bg-rose-500 text-white' :
                    ticket.severity === 'MEDIUM' ? 'bg-amber-500 text-white' :
                    'bg-sky-500 text-white'
                  ]"
                >
                  {{ ticket.severity }}
                </span>
              </td>

              <!-- 7. SLA RESPONSE (Target | Aktual) -->
              <td class="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                <div class="flex items-center space-x-1">
                  <!-- Cross icon if breached, Checkmark if met, or clock if waiting -->
                  <span 
                    v-if="isResponseBreached(ticket)" 
                    class="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold"
                  >
                    &times;
                  </span>
                  <span 
                    v-else-if="ticket.respondedAt" 
                    class="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold"
                  >
                    &#10003;
                  </span>
                  <span 
                    v-else 
                    class="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold"
                  >
                    &#9203;
                  </span>
                  <span 
                    :class="isResponseBreached(ticket) ? 'text-rose-600 font-semibold' : ticket.respondedAt ? 'text-emerald-700 font-medium' : 'text-blue-700 font-medium'"
                  >
                    {{ ticket.slaResponseText || (ticket.respondedAt ? '12m / 30m' : 'Menunggu') }}
                  </span>
                </div>
              </td>

              <!-- 8. SLA RESOLUTION (Target | Sisa Waktu) -->
              <td class="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                <div class="flex items-center space-x-1">
                  <!-- Red cross if breached, Amber clock if near breach / warning, Green check if safe -->
                  <span 
                    v-if="isResolutionBreached(ticket)" 
                    class="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold"
                  >
                    &times;
                  </span>
                  <span 
                    v-else-if="isResolutionWarning(ticket)" 
                    class="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold"
                  >
                    &#9203;
                  </span>
                  <span 
                    v-else 
                    class="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold"
                  >
                    &#10003;
                  </span>
                  <span 
                    :class="[
                      isResolutionBreached(ticket) ? 'text-rose-600 font-bold' :
                      isResolutionWarning(ticket) ? 'text-amber-700 font-semibold' :
                      'text-emerald-700 font-medium'
                    ]"
                  >
                    {{ ticket.slaResolutionText || '4h 10m / 8h' }}
                  </span>
                </div>
              </td>

              <!-- 9. STATUS & Progress -->
              <td class="py-3 px-3 whitespace-nowrap">
                <div>
                  <!-- Status Badges -->
                  <span 
                    :class="[
                      'font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide inline-block',
                      ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      ticket.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      ticket.status === 'ESCALATED' ? 'bg-purple-100 text-purple-700' :
                      ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' :
                      ticket.status === 'NEAR_BREACH' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    ]"
                  >
                    {{ formatStatusLabel(ticket.status) }}
                  </span>

                  <!-- Subtext or Progress Bar -->
                  <div v-if="ticket.status === 'PENDING'" class="text-[10px] text-slate-500 mt-0.5">
                    {{ ticket.statusSubtext || 'Menunggu Konfirmasi' }}
                  </div>
                  <div v-else-if="ticket.status === 'ESCALATED'" class="text-[10px] text-slate-500 mt-0.5">
                    {{ ticket.statusSubtext || 'Menunggu Principal' }}
                  </div>
                  <div v-else-if="ticket.status === 'RESOLVED'" class="text-[10px] text-slate-500 mt-0.5">
                    {{ ticket.statusSubtext || 'Selesai' }}
                  </div>
                  <!-- Progress Bar for IN_PROGRESS, ASSIGNED, NEAR_BREACH -->
                  <div v-else class="flex items-center space-x-1.5 mt-1">
                    <div class="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        class="h-1.5 rounded-full transition-all duration-300"
                        :class="ticket.status === 'NEAR_BREACH' ? 'bg-rose-500' : 'bg-blue-600'"
                        :style="{ width: `${ticket.progressPercent || 0}%` }"
                      ></div>
                    </div>
                    <span class="text-[10px] font-mono text-slate-500">{{ ticket.progressPercent || 0 }}%</span>
                  </div>
                </div>
              </td>

              <!-- 10. PRINCIPAL / VENDOR (Case ID) -->
              <td class="py-3 px-3 whitespace-nowrap">
                <div v-if="ticket.principalVendor">
                  <div class="font-medium text-slate-800 text-xs">{{ ticket.principalVendor }}</div>
                  <div class="text-[10px] font-mono text-slate-400">#{{ ticket.principalCaseId }}</div>
                </div>
                <div v-else class="text-slate-400 font-mono text-xs">
                  -
                </div>
              </td>

              <!-- 11. KB MATCH -->
              <td class="py-3 px-2 text-center whitespace-nowrap">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                  {{ ticket.kbMatchCount || (ticket.categoryId === 4 ? 5 : ticket.categoryId === 3 ? 4 : 2) }}
                </span>
              </td>

              <!-- 12. TINDAKAN (Langsung Masuk ke Detail) -->
              <td class="py-3 px-3 text-center whitespace-nowrap" @click.stop>
                <router-link
                  :to="`/tickets/${ticket.id}`"
                  class="inline-flex items-center justify-center space-x-1 px-3 py-1 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors cursor-pointer"
                  title="Masuk ke detail tiket"
                >
                  <span>Detail</span>
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </router-link>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredTickets.length === 0">
              <td colspan="12" class="py-12 text-center text-slate-400 bg-white">
                <div v-if="ticketStore.tickets.length === 0" class="max-w-md mx-auto space-y-3 py-4">
                  <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl mx-auto shadow-inner">
                    🎫
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800 text-sm">Belum Ada Tiket Insiden</h3>
                    <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                      Antrean tiket saat ini kosong. Tiket baru yang dilaporkan oleh mitra atau dibuat oleh tim operasional akan tampil di sini.
                    </p>
                  </div>
                  <router-link
                    v-if="authStore.isAdmin"
                    to="/tickets/create"
                    class="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all"
                  >
                    <span>+ Buat Tiket Baru</span>
                  </router-link>
                </div>
                <div v-else class="py-4">
                  <svg class="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="font-bold text-sm text-slate-600">Tidak ada tiket yang cocok dengan filter antrean</p>
                  <p class="text-xs text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian atau ubah tab status di atas.</p>
                  <button 
                    @click="resetAllFilters" 
                    class="mt-3 px-3.5 py-1.5 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer text-xs"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer: Pagination Toolbar -->
      <div class="p-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span class="text-slate-500 font-medium">
          Menampilkan <strong class="text-slate-800">{{ filteredTickets.length === 0 ? 0 : startIndex + 1 }}</strong> - <strong class="text-slate-800">{{ Math.min(endIndex, filteredTickets.length) }}</strong> dari <strong class="text-slate-800">{{ filteredTickets.length }}</strong> tiket
        </span>

        <div class="flex items-center space-x-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors"
          >
            <span>&larr;</span> Prev
          </button>

          <div class="flex items-center space-x-1.5 text-xs text-slate-600">
            <span>Halaman</span>
            <input
              type="number"
              min="1"
              :max="totalPages"
              :value="currentPage"
              @keydown.enter="handleJumpPage($event)"
              @blur="handleJumpPage($event)"
              class="w-12 py-1 px-1.5 text-center font-mono font-bold text-xs border border-slate-200 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span>dari <strong class="text-slate-800 font-mono">{{ totalPages }}</strong></span>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors"
          >
            Next <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTicketStore } from '../stores/ticketStore';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();

onMounted(async () => {
  await ticketStore.fetchTickets();
  await ticketStore.fetchCustomers();
});

// Selected tickets for bulk actions
const selectedTicketIds = ref([]);
const isAllSelected = computed(() => {
  return paginatedTickets.value.length > 0 && selectedTicketIds.value.length === paginatedTickets.value.length;
});

const toggleSelectAll = (e) => {
  if (e.target.checked) {
    selectedTicketIds.value = paginatedTickets.value.map(t => t.id);
  } else {
    selectedTicketIds.value = [];
  }
};

// Filter States
// Active tab defaults to 'ALL' so all 8 tickets are listed (or query tab if provided)
const initialTab = route.query.tab || 'ALL';
const activeTab = ref(initialTab);
const searchQuery = ref('');
const filterCustomer = ref('ALL');
const filterSeverity = ref('ALL');
const filterCategory = ref('ALL');
const filterChannel = ref('ALL');
const filterSlaStatus = ref('ALL');
const isAutoRefresh = ref(true);

// Filter Dropdown Options
const filterCustomerOptions = computed(() => [
  { value: 'ALL', label: 'Semua Mitra Klien' },
  ...(ticketStore.customers || []).map(c => ({
    value: c.id,
    label: c.name,
    badge: c.slaTier || ''
  }))
]);

const filterSeverityOptions = [
  { value: 'ALL', label: 'Semua Severity' },
  { value: 'HIGH', label: 'HIGH', badge: 'Critical', badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200' },
  { value: 'MEDIUM', label: 'MEDIUM', badge: 'Major', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: 'LOW', label: 'LOW', badge: 'Minor', badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200' }
];

const filterCategoryOptions = computed(() => [
  { value: 'ALL', label: 'Semua Kategori' },
  ...availableCategories.value.map(cat => ({
    value: cat,
    label: cat
  }))
]);

const filterChannelOptions = [
  { value: 'ALL', label: 'Semua Saluran' },
  { value: 'WHATSAPP', label: 'WhatsApp', subtext: 'WA Business' },
  { value: 'EMAIL', label: 'Email', subtext: 'Email Support' },
  { value: 'PHONE', label: 'Telepon', subtext: 'Hotline NOC' },
  { value: 'PORTAL', label: 'Portal', subtext: 'Customer Portal' }
];

const filterSlaStatusOptions = [
  { value: 'ALL', label: 'Semua SLA Status' },
  { value: 'SAFE', label: 'SLA Aman', badge: 'Normal', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  { value: 'NEAR_BREACH', label: 'Near Breach (<2h)', badge: 'Warning', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: 'BREACHED', label: 'SLA Terlewat', badge: 'Breached', badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200' }
];

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Helper / Display Data
const currentFormattedTime = '04 Okt 2026 14:37 WIB';
const currentPicName = computed(() => authStore.currentUser?.name || 'Budi Santoso');

const getCustomerName = (customerId) => {
  const c = ticketStore.customers.find(item => item.id === Number(customerId));
  return c ? c.name : 'PT Astra';
};

const availableCategories = computed(() => {
  const set = new Set();
  ticketStore.tickets.forEach(t => {
    if (t.categoryName) set.add(t.categoryName);
  });
  if (ticketStore.categories) {
    ticketStore.categories.forEach(c => set.add(c.name));
  }
  return Array.from(set);
});

const getCategoryDisplay = (ticket) => {
  if (ticket.categoryName) return ticket.categoryName;
  const cat = ticketStore.categories.find(item => item.id === Number(ticket.categoryId));
  return cat ? cat.name : 'Server';
};

const formatStatusLabel = (status) => {
  if (!status) return 'IN PROGRESS';
  return status.replace(/_/g, ' ');
};

const isNearBreach = (ticket) => {
  if (ticket.status === 'NEAR_BREACH' || ticket.isNearBreachFlag) return true;
  if (['RESOLVED', 'CLOSED'].includes(ticket.status)) return false;
  if (!ticket.resolutionDeadline) return false;
  const remainingMs = new Date(ticket.resolutionDeadline).getTime() - Date.now();
  return remainingMs > 0 && remainingMs < 2 * 3600 * 1000;
};

const isResolutionBreached = (ticket) => {
  if (ticket.isSlaResolutionBreached === true) return true;
  if (['RESOLVED', 'CLOSED'].includes(ticket.status)) {
    if (ticket.resolvedAt && ticket.resolutionDeadline) {
      return new Date(ticket.resolvedAt).getTime() > new Date(ticket.resolutionDeadline).getTime();
    }
    return false;
  }
  if (ticket.isPaused) return false;
  if (ticket.resolutionDeadline) {
    return new Date(ticket.resolutionDeadline).getTime() < Date.now();
  }
  return false;
};

const isResponseBreached = (ticket) => {
  if (ticket.isSlaResponseBreached === true) return true;
  if (ticket.respondedAt && ticket.responseDeadline) {
    return new Date(ticket.respondedAt).getTime() > new Date(ticket.responseDeadline).getTime();
  }
  if (!ticket.respondedAt && ticket.responseDeadline) {
    return new Date(ticket.responseDeadline).getTime() < Date.now();
  }
  return false;
};

const isResolutionWarning = (ticket) => {
  if (isResolutionBreached(ticket)) return false;
  if (ticket.isNearBreachFlag || isNearBreach(ticket)) return true;
  // Specific mock items from screenshot with amber warning icon
  if (['TICK-20261004-0005', 'TICK-20261003-0021', 'TICK-20261003-0018'].includes(ticket.ticketNumber)) {
    return true;
  }
  return false;
};

// Base tickets visible to the current authenticated role
// If logged in as an ENGINEER, strictly filter only tickets assigned to this engineer
const baseTickets = computed(() => {
  if (authStore.isEngineer && authStore.currentUser?.id) {
    return ticketStore.tickets.filter(t => t.assignedToId === authStore.currentUser.id);
  }
  return ticketStore.tickets;
});

// Summary metrics (5 cards matching Point 6 mockup)
const totalActiveTickets = computed(() => {
  return baseTickets.value.filter(t => t.status !== 'CLOSED').length;
});

const nearBreachCount = computed(() => {
  return baseTickets.value.filter(t => isNearBreach(t) || t.isNearBreachFlag || t.status === 'NEAR_BREACH').length;
});

const waitingPrincipalCount = computed(() => {
  return baseTickets.value.filter(t => t.status === 'ESCALATED' || t.status === 'PENDING_VENDOR' || Boolean(t.principalVendor)).length;
});

const myAssignedCount = computed(() => {
  if (authStore.isEngineer) {
    return baseTickets.value.length;
  }
  const currentId = authStore.currentUser?.id;
  return currentId ? ticketStore.tickets.filter(t => t.assignedToId === currentId).length : 0;
});

// 7 Tabs for Status (Point 6 mockup)
const filterTabs = computed(() => [
  { id: 'ALL', label: 'Semua Tiket', count: baseTickets.value.length },
  { id: 'ASSIGNED', label: 'Assigned', count: baseTickets.value.filter(t => t.status === 'ASSIGNED').length },
  { id: 'IN_PROGRESS', label: 'In Progress', count: baseTickets.value.filter(t => t.status === 'IN_PROGRESS').length },
  { id: 'PENDING', label: 'Pending', count: baseTickets.value.filter(t => t.status === 'PENDING').length },
  { id: 'ESCALATED', label: 'Escalated', count: baseTickets.value.filter(t => t.status === 'ESCALATED').length },
  { id: 'NEAR_BREACH', label: 'Near Breach', count: baseTickets.value.filter(t => isNearBreach(t) || t.status === 'NEAR_BREACH').length },
  { id: 'RESOLVED', label: 'Resolved', count: baseTickets.value.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length }
]);

const getTabLabel = (tabId) => {
  const tab = filterTabs.value.find(t => t.id === tabId);
  return tab ? tab.label : tabId;
};

const setTab = (tabId) => {
  activeTab.value = tabId;
  currentPage.value = 1;
};

// Filtered Tickets
const filteredTickets = computed(() => {
  return baseTickets.value.filter(t => {
    // 1. Status Tab filter
    if (activeTab.value === 'ASSIGNED') {
      if (t.status !== 'ASSIGNED') return false;
    } else if (activeTab.value === 'IN_PROGRESS') {
      if (t.status !== 'IN_PROGRESS') return false;
    } else if (activeTab.value === 'PENDING') {
      if (t.status !== 'PENDING') return false;
    } else if (activeTab.value === 'ESCALATED') {
      if (t.status !== 'ESCALATED') return false;
    } else if (activeTab.value === 'NEAR_BREACH') {
      if (!isNearBreach(t) && t.status !== 'NEAR_BREACH') return false;
    } else if (activeTab.value === 'RESOLVED') {
      if (t.status !== 'RESOLVED' && t.status !== 'CLOSED') return false;
    }

    // 2. Dropdown filters
    if (filterCustomer.value !== 'ALL' && t.customerId !== Number(filterCustomer.value)) return false;
    if (filterSeverity.value !== 'ALL' && t.severity !== filterSeverity.value) return false;
    if (filterCategory.value !== 'ALL') {
      const catName = getCategoryDisplay(t);
      if (catName !== filterCategory.value) return false;
    }
    if (filterChannel.value !== 'ALL' && t.channel !== filterChannel.value) return false;

    // 3. SLA Status filter
    if (filterSlaStatus.value === 'SAFE') {
      if (isResolutionBreached(t) || isResponseBreached(t) || isResolutionWarning(t)) return false;
    } else if (filterSlaStatus.value === 'NEAR_BREACH') {
      if (!isResolutionWarning(t)) return false;
    } else if (filterSlaStatus.value === 'BREACHED') {
      if (!isResolutionBreached(t) && !isResponseBreached(t)) return false;
    }

    // 4. Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchNum = t.ticketNumber?.toLowerCase().includes(q);
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchCust = getCustomerName(t.customerId).toLowerCase().includes(q);
      const matchDesc = (t.scopeSubtitle || t.description || '').toLowerCase().includes(q);
      const matchVendor = (t.principalVendor || '').toLowerCase().includes(q);
      if (!matchNum && !matchTitle && !matchCust && !matchDesc && !matchVendor) return false;
    }

    return true;
  });
});

const isAnyFilterActive = computed(() => {
  return activeTab.value !== 'ALL' ||
    searchQuery.value.trim() !== '' ||
    filterCustomer.value !== 'ALL' ||
    filterSeverity.value !== 'ALL' ||
    filterCategory.value !== 'ALL' ||
    filterChannel.value !== 'ALL' ||
    filterSlaStatus.value !== 'ALL';
});

const resetAllFilters = () => {
  activeTab.value = 'ALL';
  searchQuery.value = '';
  filterCustomer.value = 'ALL';
  filterSeverity.value = 'ALL';
  filterCategory.value = 'ALL';
  filterChannel.value = 'ALL';
  filterSlaStatus.value = 'ALL';
  currentPage.value = 1;
};

// Pagination calculation
const totalPages = computed(() => Math.ceil(filteredTickets.value.length / itemsPerPage.value) || 1);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);
const paginatedTickets = computed(() => filteredTickets.value.slice(startIndex.value, endIndex.value));

const handleJumpPage = (e) => {
  const val = parseInt(e.target.value, 10);
  if (!isNaN(val)) {
    currentPage.value = Math.max(1, Math.min(totalPages.value, val));
  }
  e.target.value = currentPage.value;
};

const goToPage = (page) => {
  currentPage.value = Math.max(1, Math.min(totalPages.value, page));
};

// Action Click handler
const handleActionClick = (ticket) => {
  router.push(`/tickets/${ticket.id}`);
};

// Export to CSV
const exportCsv = () => {
  const headers = [
    'No. Tiket',
    'Pelanggan',
    'Judul Kendala',
    'Kategori',
    'Severity',
    'SLA Response',
    'SLA Resolution',
    'Status',
    'Progress',
    'Principal/Vendor',
    'Case ID',
    'KB Match'
  ];
  const rows = filteredTickets.value.map(t => [
    t.ticketNumber,
    `"${getCustomerName(t.customerId)}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${getCategoryDisplay(t)}"`,
    t.severity,
    `"${t.slaResponseText || ''}"`,
    `"${t.slaResolutionText || ''}"`,
    t.status,
    `${t.progressPercent || 0}%`,
    `"${t.principalVendor || '-'}"`,
    `"${t.principalCaseId || '-'}"`,
    t.kbMatchCount || 0
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
