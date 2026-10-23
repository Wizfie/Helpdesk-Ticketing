<template>
  <div class="space-y-6">
    <!-- Top Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link to="/tickets" class="hover:text-blue-600 transition-colors">Admin Settings</router-link>
          <span>/</span>
          <span class="text-slate-800">Enterprise Accounts</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <span>Enterprise Accounts Directory</span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Manajemen portofolio mitra, alokasi tier kontrak SLA, periode maintenance, dan kuota tiket tahunan.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="openAddCustomerModal"
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>+ Tambah Mitra Korporat</span>
        </button>
      </div>
    </div>

    <!-- 4 Account Portfolio KPI Cards (Aligned with CUSTOMER_PIC.png) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: TOTAL MITRA -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">TOTAL MITRA</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">{{ ticketStore.customers.length }}</span>
            <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded">
              &uarr; +1
            </span>
          </div>
          <span class="text-[11px] text-slate-500 font-medium mt-1 block">
            {{ activeCustomersCount }} Aktif • {{ inactiveCustomersCount }} Nonaktif
          </span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
      </div>

      <!-- Card 2: SLA COMPLIANCE -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">SLA COMPLIANCE</span>
          <div class="mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">
              {{ slaComplianceRate !== null ? `${slaComplianceRate}%` : '96.5%' }}
            </span>
          </div>
          <span class="text-[11px] text-emerald-600 font-medium mt-1 block">
            Di atas target 95.0%
          </span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- Card 3: TOTAL TIKET TAHUN INI (Progress Bar) -->
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div class="flex-1 pr-3">
          <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">TOTAL TIKET TAHUN INI</span>
          <div class="mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">
              {{ ticketStore.totalQuotaStats.totalUsed.toLocaleString() }} / {{ ticketStore.totalQuotaStats.totalQuota.toLocaleString() }}
            </span>
          </div>
          <!-- Progress bar -->
          <div class="mt-2 flex items-center gap-2">
            <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                class="h-full bg-blue-600 rounded-full transition-all duration-500"
                :style="{ width: `${ticketStore.totalQuotaStats.percentage}%` }"
              ></div>
            </div>
            <span class="text-[11px] text-slate-500 font-mono whitespace-nowrap">
              {{ ticketStore.totalQuotaStats.percentage }}% digunakan
            </span>
          </div>
        </div>
        <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
          </svg>
        </div>
      </div>

      <!-- Card 4: TIKET HAMPIR HABIS (Red Alert Card) -->
      <div class="bg-rose-50/60 border border-rose-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">TIKET HAMPIR HABIS</span>
          <div class="mt-1">
            <span class="text-2xl font-black text-rose-700 font-mono">
              {{ criticalQuotaCount }} Mitra
            </span>
          </div>
          <span class="text-[11px] text-rose-600 font-medium mt-1 block">
            Perlu perhatian
          </span>
        </div>
        <div class="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm shrink-0">
          <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama mitra, kode, atau industri..."
          class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <div class="flex items-center space-x-2">
        <select v-model="filterIndustry" class="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs text-slate-700">
          <option value="">Semua Sektor Industri</option>
          <option value="Otomotif">Otomotif</option>
          <option value="Keuangan">Keuangan / Perbankan</option>
          <option value="Energi">Energi &amp; Utilitas</option>
          <option value="Telekomunikasi">Telekomunikasi</option>
          <option value="Organisasi Internasional">Organisasi Internasional</option>
          <option value="Kesehatan">Kesehatan / Rumah Sakit</option>
          <option value="Pemerintahan">Pemerintahan / Publik</option>
          <option value="Transportasi">Transportasi</option>
          <option value="Farmasi">Farmasi &amp; Kimia</option>
        </select>

        <select v-model="filterStatus" class="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs text-slate-700">
          <option value="">Semua Status</option>
          <option value="active">Active (Aktif)</option>
          <option value="inactive">Nonaktif / Expired</option>
          <option value="critical">Tiket Hampir Habis (≤ 10%)</option>
        </select>

        <button 
          @click="handleExportExcel"
          :disabled="isExporting"
          class="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          title="Ekspor daftar mitra ke Microsoft Excel (.xlsx)"
        >
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>{{ isExporting ? 'Mengekspor...' : 'Export Excel' }}</span>
        </button>
      </div>
    </div>

    <!-- Enterprise Accounts Table (Aligned with CUSTOMER_PIC.png) -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[1050px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
            <tr>
              <th class="px-3 py-3 w-12 text-center">NO</th>
              <th class="px-4 py-3 min-w-[220px]">CLIENT ENTITY &amp; CODE</th>
              <th class="px-4 py-3 min-w-[140px]">INDUSTRI</th>
              <th class="px-4 py-3 min-w-[160px]">PERIODE MAINTENANCE</th>
              <th class="px-4 py-3 min-w-[110px]">
                <div class="flex items-center space-x-1">
                  <span>KUOTA TIKET</span>
                  <span class="text-slate-400 font-normal cursor-help" title="Alokasi kuota tiket insiden berbayar per siklus tahunan">(i)</span>
                </div>
              </th>
              <th class="px-4 py-3 min-w-[130px]">SISA TIKET</th>
              <th class="px-4 py-3 min-w-[140px]">PRODUCTION CLUSTER</th>
              <th class="px-4 py-3 min-w-[100px]">STATUS</th>
              <th class="px-4 py-3 min-w-[80px] text-center">AKSI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="(c, idx) in paginatedCustomers" 
              :key="c.id"
              :id="'customer-row-' + c.id"
              class="hover:bg-slate-50/80 transition-all duration-300"
              :class="[
                focusedCustomerId === c.id 
                  ? 'bg-blue-50/70 ring-2 ring-blue-400 ring-inset shadow-xs' 
                  : ''
              ]"
            >
              <!-- NO -->
              <td class="px-3 py-3.5 align-middle text-center text-slate-500 font-mono text-xs">
                {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
              </td>

              <!-- CLIENT ENTITY & CODE -->
              <td class="px-4 py-3.5 align-middle">
                <div class="font-bold text-slate-900 text-xs leading-snug">{{ c.name }}</div>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded text-[10px] font-mono border border-blue-200 shrink-0">
                    {{ c.code }}
                  </span>
                  <span class="text-slate-400 text-[11px] truncate max-w-[200px]" :title="c.address">
                    {{ c.address }}
                  </span>
                </div>
              </td>

              <!-- INDUSTRI -->
              <td class="px-4 py-3.5 align-middle text-slate-700 text-xs font-medium">
                {{ c.industry || 'Klien Korporat' }}
              </td>

              <!-- PERIODE MAINTENANCE -->
              <td class="px-4 py-3.5 align-middle font-mono text-[11px] text-slate-600 leading-tight">
                <div>{{ formatIndoDate(c.maintenanceStart) }}</div>
                <div class="text-slate-400">- {{ formatIndoDate(c.maintenanceEnd) }}</div>
              </td>

              <!-- KUOTA TIKET -->
              <td class="px-4 py-3.5 align-middle font-mono text-xs font-bold text-slate-800">
                {{ c.ticketQuota || 'Unlimited' }}
              </td>

              <!-- SISA TIKET -->
              <td class="px-4 py-3.5 align-middle">
                <template v-if="c.ticketQuota && c.ticketQuota !== 'Unlimited'">
                  <div class="flex items-center space-x-1.5">
                    <span class="font-mono text-xs font-black text-slate-900">
                      {{ getCustomerQuotaInfo(c).remaining }}
                    </span>
                    <span 
                      class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border"
                      :class="getRemainingBadgeClass(getCustomerQuotaInfo(c))"
                    >
                      {{ getCustomerQuotaInfo(c).percentage }}%
                    </span>
                  </div>
                </template>
                <template v-else>
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Unlimited
                  </span>
                </template>
              </td>

              <!-- PRODUCTION CLUSTER -->
              <td class="px-4 py-3.5 align-middle">
                <span class="font-mono font-semibold text-slate-700 text-xs">
                  {{ c.cluster || 'PROD-CL01' }}
                </span>
              </td>

              <!-- STATUS -->
              <td class="px-4 py-3.5 align-middle">
                <!-- Active Status -->
                <span 
                  v-if="c.isActive !== false"
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>

                <!-- Expired Status -->
                <span 
                  v-else-if="isCustomerMaintenanceExpired(c)"
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                  title="Periode maintenance telah berakhir"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Expired
                </span>

                <!-- Inactive Status -->
                <span 
                  v-else
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                  title="Dinonaktifkan secara manual"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Nonaktif
                </span>
              </td>

              <!-- AKSI -->
              <td class="px-4 py-3.5 align-middle text-center">
                <div class="relative inline-block text-left">
                  <button
                    @click="toggleActionMenu(c.id)"
                    class="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                    title="Menu Aksi"
                  >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </button>

                  <!-- Popover Action Menu -->
                  <div
                    v-if="openActionMenuId === c.id"
                    class="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-left"
                  >
                    <button
                      @click="openEditCustomerModal(c); openActionMenuId = null"
                      class="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      <span>Edit Data</span>
                    </button>
                    <button
                      @click="openPicListModal(c); openActionMenuId = null"
                      class="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                      <span>Kontak PIC</span>
                    </button>

                    <!-- Toggle Status Manual Action -->
                    <button
                      @click="handleToggleCustomerStatus(c); openActionMenuId = null"
                      class="w-full px-3 py-1.5 text-xs flex items-center space-x-2 cursor-pointer transition-colors"
                      :class="c.isActive !== false ? 'text-amber-700 hover:bg-amber-50' : 'text-emerald-700 hover:bg-emerald-50'"
                    >
                      <svg v-if="c.isActive !== false" class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                      </svg>
                      <svg v-else class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{{ c.isActive !== false ? 'Nonaktifkan Mitra' : 'Aktifkan Mitra' }}</span>
                    </button>

                    <div class="border-t border-slate-100 my-1"></div>
                    <button
                      @click="handleDeleteCustomer(c); openActionMenuId = null"
                      class="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      <span>Hapus Mitra</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Toolbar -->
      <div class="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span class="text-slate-500 font-medium">
          Menampilkan {{ filteredCustomers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} - {{ Math.min(currentPage * itemsPerPage, filteredCustomers.length) }} dari {{ filteredCustomers.length }} mitra
        </span>

        <div class="flex items-center space-x-1">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &lt;
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            @click="currentPage = p"
            class="px-2.5 py-1 border rounded font-mono text-xs cursor-pointer"
            :class="currentPage === p ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
          >
            {{ p }}
          </button>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-2 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>

    <!-- Floating Toast Alert: Peringatan Kuota Tiket Hampir Habis (Matching CUSTOMER_PIC.png) -->
    <div 
      v-if="criticalCustomer && showCriticalToast" 
      class="fixed bottom-6 right-6 z-40 max-w-md w-[calc(100%-3rem)] sm:w-full bg-white rounded-2xl shadow-2xl border border-rose-200 p-5 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
            <svg class="w-4.5 h-4.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-xs sm:text-sm leading-tight">Peringatan Kuota Tiket Hampir Habis</h4>
            <span class="text-[10px] text-slate-400 font-mono mt-0.5 block">04 Okt 2026, 10:15 WIB</span>
          </div>
        </div>
        <button 
          @click="showCriticalToast = false" 
          class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors cursor-pointer"
          title="Tutup Notifikasi"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed mb-4">
        Kuota tiket untuk <strong class="text-slate-900 font-bold">{{ criticalCustomer.name }}</strong> tersisa <span class="font-mono font-bold text-rose-600">{{ getCustomerQuotaInfo(criticalCustomer).remaining }}</span> dari {{ getCustomerQuotaInfo(criticalCustomer).quota }} tiket (<span class="font-bold text-rose-600">{{ getCustomerQuotaInfo(criticalCustomer).percentage }}%</span>). Silakan hubungi customer untuk konfirmasi perpanjangan kontrak atau penambahan kuota tiket.
      </p>

      <div class="flex items-center justify-end pt-1">
        <button 
          @click="focusAndEditCustomer(criticalCustomer)" 
          class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs hover:shadow transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <span>Lihat Detail Mitra</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal 1: Tambah Perusahaan Mitra Baru (Matching CUSTOMER_PIC.png left panel) -->
    <div v-if="showAddCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 space-y-5 text-xs animate-in fade-in zoom-in-95 duration-150 my-8">
        <!-- Modal Title -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 class="font-black text-slate-900 text-base">Tambah Perusahaan Mitra Baru</h4>
          <button @click="showAddCustomerModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitAddCustomer" class="space-y-4">
          <!-- Section 1: Informasi Perusahaan -->
          <div class="space-y-2.5">
            <div class="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <span>Informasi Perusahaan</span>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan *</label>
              <input 
                v-model="newCustomer.name" 
                required 
                type="text" 
                placeholder="Contoh: PT Telekomunikasi Selular" 
                class="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Kode Singkat *</label>
                <input 
                  v-model="newCustomer.code" 
                  required 
                  type="text" 
                  placeholder="TELKOMSEL" 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs uppercase font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Sektor Industri *</label>
                <select 
                  v-model="newCustomer.industry" 
                  required 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="" disabled>Pilih Sektor Industri</option>
                  <option value="Telekomunikasi">Telekomunikasi</option>
                  <option value="Otomotif">Otomotif</option>
                  <option value="Keuangan">Keuangan / Perbankan</option>
                  <option value="Energi">Energi &amp; Utilitas</option>
                  <option value="Organisasi Internasional">Organisasi Internasional</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pemerintahan">Pemerintahan / Publik</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Farmasi">Farmasi</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Kontrak & SLA -->
          <div class="space-y-2.5 pt-2 border-t border-slate-100">
            <div class="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Kontrak &amp; SLA</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block font-semibold text-slate-700">Paket Kontrak SLA *</label>
                  <router-link to="/sla-config" class="text-[10px] text-blue-600 hover:underline">Kelola SLA &rarr;</router-link>
                </div>
                <select 
                  v-model="newCustomer.contractSla" 
                  required 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option 
                    v-for="policy in availableSlaPolicies" 
                    :key="policy.tierCode" 
                    :value="policy.tierCode"
                  >
                    {{ policy.tierName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tier Kontrak *</label>
                <input 
                  type="text" 
                  disabled 
                  :value="newCustomer.contractSla || 'GOLD_8X5'" 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-600 font-mono" 
                />
              </div>
            </div>

            <!-- Periode Maintenance & Jumlah Tiket per Tahun Row -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Periode Maintenance *</label>
                <div class="grid grid-cols-2 gap-1.5">
                  <input 
                    v-model="newCustomer.maintenanceStart" 
                    type="date" 
                    required 
                    class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                  <input 
                    v-model="newCustomer.maintenanceEnd" 
                    type="date" 
                    required 
                    class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  />
                </div>
                <span class="text-[10px] text-slate-400 mt-1 block">
                  Format: {{ formatIndoDate(newCustomer.maintenanceStart) }} &rarr; {{ formatIndoDate(newCustomer.maintenanceEnd) }}
                </span>
              </div>

              <div>
                <div class="flex items-center space-x-1 mb-1">
                  <label class="block font-semibold text-slate-700">Jumlah Tiket per Tahun *</label>
                  <span class="text-slate-400 font-normal cursor-help" title="Alokasi kuota insiden tahunan">(i)</span>
                </div>
                <select 
                  v-model="newCustomer.ticketQuota" 
                  required 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold"
                >
                  <option :value="10">10 Tiket</option>
                  <option :value="25">25 Tiket</option>
                  <option :value="50">50 Tiket</option>
                  <option :value="100">100 Tiket</option>
                  <option :value="250">250 Tiket</option>
                  <option :value="500">500 Tiket</option>
                  <option value="Unlimited">Unlimited</option>
                </select>
              </div>
            </div>

            <!-- Informative Blue Helper Banner -->
            <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-2 text-[11px] text-blue-700 mt-2">
              <svg class="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <span>Notifikasi akan dikirim saat kuota tiket tersisa 10% dari total.</span>
            </div>
          </div>

          <!-- Section 3: Infrastruktur & Lokasi -->
          <div class="space-y-2.5 pt-2 border-t border-slate-100">
            <div class="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
              </svg>
              <span>Infrastruktur &amp; Lokasi</span>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Production Cluster</label>
              <select 
                v-model="newCustomer.cluster" 
                class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="PROD-CL01">PROD-CL01 (Tier-IV Cikarang)</option>
                <option value="PROD-CL02">PROD-CL02 (Tier-III Jakarta)</option>
                <option value="PROD-CL03">PROD-CL03 (Tier-III BSD City)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Alamat Gedung / Kantor *</label>
              <textarea 
                v-model="newCustomer.address" 
                rows="2" 
                required 
                placeholder="Alamat lengkap lokasi instalasi..." 
                class="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>
          </div>

          <!-- Section 4: Kontak PIC Pelapor Awal -->
          <div class="space-y-2.5 pt-2 border-t border-slate-100">
            <div class="flex items-center space-x-2 text-slate-900 font-bold text-xs">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Kontak PIC Pelapor Awal</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input 
                  v-model="newCustomer.picName" 
                  required 
                  type="text" 
                  placeholder="Nama PIC (Bpk. ...)" 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <input 
                  v-model="newCustomer.picPhone" 
                  required 
                  type="text" 
                  placeholder="No. HP WhatsApp PIC" 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input 
                  v-model="newCustomer.picDept" 
                  required 
                  type="text" 
                  placeholder="Departemen / Divisi" 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
              <div>
                <input 
                  v-model="newCustomer.picEmail" 
                  required 
                  type="email" 
                  placeholder="Email PIC" 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-2 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              @click="showAddCustomerModal = false" 
              class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Simpan Mitra
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Edit Data Mitra -->
    <div v-if="showEditCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl p-6 space-y-5 text-xs animate-in fade-in zoom-in-95 duration-150 my-8">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 class="font-black text-slate-900 text-base">Edit Data Mitra Korporat</h4>
          <button @click="showEditCustomerModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitEditCustomer" class="space-y-4">
          <!-- Info Perusahaan -->
          <div class="space-y-2.5">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan *</label>
              <input v-model="editCustomerForm.name" required type="text" class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Kode Singkat *</label>
                <input v-model="editCustomerForm.code" required type="text" class="w-full p-2.5 border border-slate-200 rounded-lg text-xs uppercase font-mono" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Sektor Industri *</label>
                <select v-model="editCustomerForm.industry" required class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white">
                  <option value="Otomotif">Otomotif</option>
                  <option value="Keuangan">Keuangan</option>
                  <option value="Energi">Energi</option>
                  <option value="Telekomunikasi">Telekomunikasi</option>
                  <option value="Organisasi Internasional">Organisasi Internasional</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Pemerintahan">Pemerintahan</option>
                  <option value="Transportasi">Transportasi</option>
                  <option value="Farmasi">Farmasi</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Kontrak & SLA & Kuota -->
          <div class="space-y-2.5 pt-2 border-t border-slate-100">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Paket Kontrak SLA *</label>
                <select v-model="editCustomerForm.contractSla" required class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white">
                  <option v-for="policy in availableSlaPolicies" :key="policy.tierCode" :value="policy.tierCode">
                    {{ policy.tierName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Production Cluster</label>
                <input v-model="editCustomerForm.cluster" type="text" class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono" />
              </div>
            </div>

            <!-- Maintenance & Quota -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Periode Maintenance *</label>
                <div class="grid grid-cols-2 gap-1.5">
                  <input v-model="editCustomerForm.maintenanceStart" type="date" required class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
                  <input v-model="editCustomerForm.maintenanceEnd" type="date" required class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
                </div>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Jumlah Tiket per Tahun *</label>
                <select v-model="editCustomerForm.ticketQuota" required class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold">
                  <option :value="10">10 Tiket</option>
                  <option :value="25">25 Tiket</option>
                  <option :value="50">50 Tiket</option>
                  <option :value="100">100 Tiket</option>
                  <option :value="250">250 Tiket</option>
                  <option :value="500">500 Tiket</option>
                  <option value="Unlimited">Unlimited</option>
                </select>
              </div>
            </div>
            <!-- Status Operasional Mitra -->
            <div class="pt-2 border-t border-slate-100">
              <label class="block font-semibold text-slate-700 mb-1">Status Operasional Mitra *</label>
              <select v-model="editCustomerForm.isActive" class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold">
                <option :value="true">Active (Aktif)</option>
                <option :value="false">Nonaktif (Inactive / Ditangguhkan)</option>
              </select>
            </div>
          </div>

          <!-- Alamat -->
          <div class="pt-2 border-t border-slate-100">
            <label class="block font-semibold text-slate-700 mb-1">Alamat Gedung / Kantor *</label>
            <textarea v-model="editCustomerForm.address" rows="2" class="w-full p-2.5 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showEditCustomerModal = false" class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer">Batal</button>
            <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer">Perbarui Data</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: View & Manage PICs -->
    <div v-if="showPicModal && activeCustomer" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Kontak PIC Terdaftar - {{ activeCustomer.name }}</h4>
            <p class="text-[11px] text-slate-500">Daftar PIC resmi yang berwenang melapor dan menerima update tiket</p>
          </div>
          <button @click="showPicModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <div class="space-y-2.5 max-h-72 overflow-y-auto">
          <div 
            v-for="pic in activeCustomer.pics" 
            :key="pic.id"
            class="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-slate-900">{{ pic.name }}</div>
              <div class="text-[11px] text-slate-500">{{ pic.dept }} &bull; {{ pic.email }}</div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-mono text-slate-700 font-semibold text-xs">{{ pic.phone }}</span>
              <button 
                @click="handleDeletePic(pic)"
                class="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                title="Hapus Kontak PIC"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
          <button
            @click="openAddPicModal(activeCustomer)"
            class="px-3.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold hover:bg-blue-100 transition-colors cursor-pointer"
          >
            + Tambah PIC Baru
          </button>
          <button @click="showPicModal = false" class="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold cursor-pointer">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Add PIC -->
    <div v-if="showAddPicModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tambah PIC Baru</h4>
          <button @click="showAddPicModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitAddPic" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap PIC *</label>
            <input v-model="newPic.name" required type="text" placeholder="Bpk. / Ibu ..." class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Departemen / Divisi *</label>
            <input v-model="newPic.dept" required type="text" placeholder="IT Ops / Infrastruktur" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">No. Handphone (WhatsApp) *</label>
            <input v-model="newPic.phone" required type="text" placeholder="0812-..." class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alamat Email PIC *</label>
            <input v-model="newPic.email" required type="email" placeholder="pic@perusahaan.com" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showAddPicModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm cursor-pointer">Simpan PIC</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTicketStore } from '../stores/ticketStore';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const filterIndustry = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

const showAddCustomerModal = ref(false);
const showEditCustomerModal = ref(false);
const showPicModal = ref(false);
const showAddPicModal = ref(false);
const showCriticalToast = ref(true);
const openActionMenuId = ref(null);
const focusedCustomerId = ref(null);
const activeCustomer = ref(null);
const isExporting = ref(false);

const availableSlaPolicies = computed(() => {
  if (ticketStore.slaPolicies && ticketStore.slaPolicies.length > 0) {
    return ticketStore.slaPolicies;
  }
  return [
    { id: 1, tierCode: 'PLATINUM_24X7', tierName: 'Platinum 24x7 Mission Critical', operatingHours: '24 Jam x 7 Hari (Non-Stop)', p1ResponseHours: 0.5, p1ResolutionHours: 4 },
    { id: 2, tierCode: 'GOLD_8X5', tierName: 'Enterprise 8x5 Gold Standard', operatingHours: 'Senin - Jumat (08:00 - 17:00 WIB)', p1ResponseHours: 1, p1ResolutionHours: 8 },
    { id: 3, tierCode: 'GOV_TIER1', tierName: 'Government 8x5 Tier-1 Dedicated', operatingHours: 'Senin - Jumat (07:30 - 16:30 WIB)', p1ResponseHours: 1, p1ResolutionHours: 12 },
    { id: 4, tierCode: 'SILVER_8X5', tierName: 'Standard Silver Managed Care', operatingHours: 'Senin - Jumat (08:00 - 17:00 WIB)', p1ResponseHours: 2, p1ResolutionHours: 24 }
  ];
});

const defaultSlaTierCode = computed(() => {
  return availableSlaPolicies.value[0]?.tierCode || 'GOLD_8X5';
});

const newCustomer = ref({
  name: '',
  code: '',
  industry: '',
  contractSla: 'GOLD_8X5',
  cluster: 'PROD-CL01',
  address: '',
  maintenanceStart: '2026-12-01',
  maintenanceEnd: '2027-11-30',
  ticketQuota: 100,
  picName: '',
  picPhone: '',
  picDept: '',
  picEmail: ''
});

const activeCustomersCount = computed(() => {
  return ticketStore.customers.filter(c => c.isActive !== false).length;
});

const inactiveCustomersCount = computed(() => {
  return ticketStore.customers.filter(c => c.isActive === false).length;
});

const isCustomerMaintenanceExpired = (customer) => {
  if (!customer?.maintenanceEnd) return false;
  const todayStr = new Date().toISOString().slice(0, 10);
  return customer.maintenanceEnd < todayStr;
};

const editCustomerForm = ref({
  id: null,
  name: '',
  code: '',
  industry: '',
  contractSla: '',
  cluster: '',
  address: '',
  maintenanceStart: '2026-12-01',
  maintenanceEnd: '2027-11-30',
  ticketQuota: 100,
  isActive: true
});

const newPic = ref({
  name: '',
  dept: '',
  phone: '',
  email: ''
});

const formatIndoDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const getCustomerQuotaInfo = (customer) => {
  return ticketStore.getCustomerQuotaInfo(customer);
};

const getRemainingBadgeClass = (qInfo) => {
  if (qInfo.isCritical) return 'bg-rose-50 text-rose-700 border-rose-200';
  if (qInfo.isNearLimit) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};

const slaComplianceRate = computed(() => {
  const total = ticketStore.tickets.length;
  if (!total) return null;
  const breaches = ticketStore.tickets.filter(t => t.isSlaResolutionBreached).length;
  return +((total - breaches) / total * 100).toFixed(1);
});

const criticalCustomer = computed(() => {
  return ticketStore.criticalQuotaCustomers[0] || null;
});

const criticalQuotaCount = computed(() => {
  return ticketStore.criticalQuotaCustomers.length;
});

const filteredCustomers = computed(() => {
  return ticketStore.customers.filter(c => {
    const q = searchQuery.value.toLowerCase();
    const matchQuery = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.cluster && c.cluster.toLowerCase().includes(q)) || (c.industry && c.industry.toLowerCase().includes(q));
    const matchIndustry = !filterIndustry.value || (c.industry && c.industry.toLowerCase().includes(filterIndustry.value.toLowerCase()));
    
    let matchStatus = true;
    if (filterStatus.value === 'critical') {
      const info = getCustomerQuotaInfo(c);
      matchStatus = info.isCritical;
    } else if (filterStatus.value === 'active') {
      matchStatus = c.isActive !== false;
    } else if (filterStatus.value === 'inactive') {
      matchStatus = c.isActive === false;
    }

    return matchQuery && matchIndustry && matchStatus;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage.value) || 1;
});

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredCustomers.value.slice(start, start + itemsPerPage.value);
});

const toggleActionMenu = (id) => {
  openActionMenuId.value = openActionMenuId.value === id ? null : id;
};

const openAddCustomerModal = () => {
  newCustomer.value = {
    name: '',
    code: '',
    industry: '',
    contractSla: defaultSlaTierCode.value,
    cluster: 'PROD-CL01',
    address: '',
    maintenanceStart: '2026-12-01',
    maintenanceEnd: '2027-11-30',
    ticketQuota: 100,
    picName: '',
    picPhone: '',
    picDept: '',
    picEmail: ''
  };
  showAddCustomerModal.value = true;
};

const openEditCustomerModal = (customer) => {
  editCustomerForm.value = {
    id: customer.id,
    name: customer.name,
    code: customer.code,
    industry: customer.industry || 'Klien Korporat',
    contractSla: customer.contractSla || defaultSlaTierCode.value,
    cluster: customer.cluster || 'PROD-CL01',
    address: customer.address || '',
    maintenanceStart: customer.maintenanceStart || '2026-12-01',
    maintenanceEnd: customer.maintenanceEnd || '2027-11-30',
    ticketQuota: customer.ticketQuota !== undefined ? customer.ticketQuota : 100,
    isActive: customer.isActive !== false
  };
  showEditCustomerModal.value = true;
};

const handleToggleCustomerStatus = (customer) => {
  const isCurrentlyActive = customer.isActive !== false;
  
  if (isCurrentlyActive) {
    const activeTickets = ticketStore.tickets.filter(t => t.customerId === customer.id && !['RESOLVED', 'CLOSED'].includes(t.status)).length;
    let msg = `Nonaktifkan mitra "${customer.name}"?`;
    if (activeTickets > 0) {
      msg += `\n\nPerhatian: Mitra ini masih memiliki ${activeTickets} tiket yang sedang berjalan.`;
    }
    if (!window.confirm(msg)) {
      return;
    }
  } else {
    if (isCustomerMaintenanceExpired(customer)) {
      if (!window.confirm(`Periode maintenance mitra "${customer.name}" telah berakhir pada ${formatIndoDate(customer.maintenanceEnd)}.\n\nTetap aktifkan akun mitra ini secara manual?`)) {
        return;
      }
    }
  }

  ticketStore.toggleCustomerStatus(customer.id, authStore.currentUser);
};

const submitAddCustomer = () => {
  ticketStore.addCustomer(newCustomer.value, authStore.currentUser);
  showAddCustomerModal.value = false;
};

const submitEditCustomer = () => {
  ticketStore.updateCustomer(editCustomerForm.value.id, editCustomerForm.value, authStore.currentUser);
  showEditCustomerModal.value = false;
};

const handleDeleteCustomer = (customer) => {
  const ticketCount = ticketStore.tickets.filter(t => t.customerId === customer.id && !['RESOLVED', 'CLOSED'].includes(t.status)).length;
  if (ticketCount > 0) {
    alert(`Tidak dapat menghapus mitra "${customer.name}" karena masih memiliki ${ticketCount} tiket aktif.`);
    return;
  }
  if (window.confirm(`Yakin ingin menghapus mitra "${customer.name}" (${customer.code}) dari database?`)) {
    ticketStore.deleteCustomer(customer.id, authStore.currentUser);
  }
};

const focusAndEditCustomer = (customer) => {
  focusedCustomerId.value = customer.id;
  // If customer is on another page, navigate to that page
  const cIndex = filteredCustomers.value.findIndex(c => c.id === customer.id);
  if (cIndex !== -1) {
    currentPage.value = Math.floor(cIndex / itemsPerPage.value) + 1;
  }
  setTimeout(() => {
    const el = document.getElementById('customer-row-' + customer.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);

  // Auto-hilangkan highlight setelah 2.5 detik
  setTimeout(() => {
    if (focusedCustomerId.value === customer.id) {
      focusedCustomerId.value = null;
    }
  }, 2500);

  openEditCustomerModal(customer);
};

const openPicListModal = (customer) => {
  activeCustomer.value = customer;
  showPicModal.value = true;
};

const openAddPicModal = (customer) => {
  activeCustomer.value = customer;
  newPic.value = { name: '', dept: '', phone: '', email: '' };
  showAddPicModal.value = true;
};

const submitAddPic = () => {
  if (!activeCustomer.value) return;
  ticketStore.addCustomerPic(activeCustomer.value.id, newPic.value, authStore.currentUser);
  showAddPicModal.value = false;
};

const handleDeletePic = (pic) => {
  if (!activeCustomer.value) return;
  if (window.confirm(`Hapus kontak PIC "${pic.name}" dari ${activeCustomer.value.name}?`)) {
    ticketStore.deleteCustomerPic(activeCustomer.value.id, pic.id, authStore.currentUser);
  }
};

const handleExportExcel = async () => {
  try {
    isExporting.value = true;
    const { default: ExcelJS } = await import('exceljs');
    const wb = new ExcelJS.Workbook();
    wb.creator = authStore.currentUser?.name || 'GTT Helpdesk Ticketing';
    wb.created = new Date();

    const ws = wb.addWorksheet('Direktori Mitra', {
      views: [{ state: 'frozen', ySplit: 4 }]
    });

    const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    const THIN = { style: 'thin', color: { argb: 'FFCBD5E1' } };
    const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };

    const columns = [
      { header: 'NO', width: 6, align: 'center' },
      { header: 'KODE', width: 10, align: 'center' },
      { header: 'NAMA PERUSAHAAN MITRA', width: 34, align: 'left' },
      { header: 'SEKTOR INDUSTRI', width: 22, align: 'left' },
      { header: 'PAKET KONTRAK SLA', width: 26, align: 'left' },
      { header: 'PERIODE MULAI', width: 15, align: 'center' },
      { header: 'PERIODE SELESAI', width: 16, align: 'center' },
      { header: 'KUOTA TAHUNAN', width: 18, align: 'center' },
      { header: 'TIKET TERPAKAI', width: 15, align: 'center' },
      { header: 'SISA TIKET', width: 14, align: 'center' },
      { header: 'SISA KUOTA (%)', width: 15, align: 'center' },
      { header: 'PRODUCTION CLUSTER', width: 20, align: 'center' },
      { header: 'STATUS OPERASIONAL', width: 20, align: 'center' },
      { header: 'KONTAK PIC TERDAFTAR', width: 38, align: 'left', wrap: true },
      { header: 'ALAMAT LENGKAP', width: 44, align: 'left', wrap: true }
    ];

    // Title Row
    ws.mergeCells(1, 1, 1, columns.length);
    const titleCell = ws.getCell(1, 1);
    titleCell.value = 'DIREKTORI PERUSAHAAN MITRA & MONITORING KUOTA TIKET';
    titleCell.font = { bold: true, size: 14, color: { argb: 'FF1E3A8A' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
    ws.getRow(1).height = 24;

    // Subtitle Row
    ws.mergeCells(2, 1, 2, columns.length);
    const subCell = ws.getCell(2, 1);
    const todayFormatted = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
    subCell.value = `PT Global Transformasi Teknologi  |  Tanggal Unduh: ${todayFormatted}  |  Total Data: ${filteredCustomers.value.length} Mitra`;
    subCell.font = { italic: true, size: 10, color: { argb: 'FF475569' } };
    subCell.alignment = { vertical: 'middle', horizontal: 'left' };
    ws.getRow(2).height = 18;

    // Blank row 3
    ws.getRow(3).height = 8;

    // Header Row 4
    const headerRow = ws.getRow(4);
    headerRow.height = 26;
    columns.forEach((col, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = col.header;
      cell.fill = HEADER_FILL;
      cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: col.align || 'center', wrapText: true };
      cell.border = BORDER;
      ws.getColumn(i + 1).width = col.width;
    });

    // Data Rows
    filteredCustomers.value.forEach((c, idx) => {
      const qInfo = getCustomerQuotaInfo(c);
      const isExpired = isCustomerMaintenanceExpired(c);
      let statusStr = 'Active';
      if (c.isActive === false) {
        statusStr = isExpired ? 'Expired (Selesai)' : 'Nonaktif (Manual)';
      }

      const picsStr = (c.pics && c.pics.length > 0)
        ? c.pics.map(p => `${p.name} (${p.phone || p.email})`).join('; ')
        : '-';

      const rowData = [
        idx + 1,
        c.code,
        c.name,
        c.industry || '-',
        c.slaTier || c.contractSla || '-',
        c.maintenanceStart || '-',
        c.maintenanceEnd || '-',
        c.ticketQuota || 'Unlimited',
        qInfo.used,
        qInfo.remaining,
        qInfo.percentage !== null ? `${qInfo.percentage}%` : 'Unlimited',
        c.cluster || 'PROD-CL01',
        statusStr,
        picsStr,
        c.address || '-'
      ];

      const row = ws.addRow(rowData);
      row.height = 22;

      row.eachCell({ includeEmpty: true }, (cell, ci) => {
        const colDef = columns[ci - 1] || {};
        cell.border = BORDER;
        cell.alignment = {
          vertical: 'middle',
          horizontal: colDef.align || 'left',
          wrapText: !!colDef.wrap
        };
        cell.font = { size: 9.5 };

        // Zebra striping
        if (idx % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }

        // Highlight status cell
        if (ci === 13) {
          if (statusStr.includes('Active')) {
            cell.font = { bold: true, size: 9.5, color: { argb: 'FF047857' } }; // emerald
          } else if (statusStr.includes('Expired')) {
            cell.font = { bold: true, size: 9.5, color: { argb: 'FFE11D48' } }; // rose
          } else {
            cell.font = { bold: true, size: 9.5, color: { argb: 'FF64748B' } }; // slate
          }
        }

        // Highlight quota remaining if critical
        if (ci === 10 && qInfo.isCritical) {
          cell.font = { bold: true, size: 9.5, color: { argb: 'FFE11D48' } };
        }
      });
    });

    if (filteredCustomers.value.length > 0) {
      ws.autoFilter = {
        from: { row: 4, column: 1 },
        to: { row: 4 + filteredCustomers.value.length, column: columns.length }
      };
    }

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    link.href = url;
    link.download = `Direktori_Mitra_Customer_Glotra_${dateStr}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Gagal export Excel customer:', err);
    alert('Terjadi kesalahan saat memproses ekspor Excel.');
  } finally {
    isExporting.value = false;
  }
};

const handleQueryFocus = () => {
  const targetId = Number(route.query.focus);
  if (targetId) {
    focusedCustomerId.value = targetId;
    const cIndex = filteredCustomers.value.findIndex(c => c.id === targetId);
    if (cIndex !== -1) {
      currentPage.value = Math.floor(cIndex / itemsPerPage.value) + 1;
    }
    setTimeout(() => {
      const el = document.getElementById('customer-row-' + targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    // Hilangkan highlight seleksi setelah 2.5 detik agar kembali seperti baris biasa
    setTimeout(() => {
      if (focusedCustomerId.value === targetId) {
        focusedCustomerId.value = null;
      }
      // Bersihkan param ?focus dari URL agar tidak terpilih terus menerus
      if (route.query.focus) {
        router.replace({ path: '/admin/customers' });
      }
    }, 2500);
  }
};

watch(() => route.query.focus, handleQueryFocus);

onMounted(async () => {
  await ticketStore.fetchSlaPolicies();
  handleQueryFocus();
});
</script>
