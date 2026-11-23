<template>
  <div class="space-y-6">
    <!-- Top Header Bar -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5"
    >
      <div>
        <div
          class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1"
        >
          <router-link
            to="/tickets"
            class="hover:text-blue-600 transition-colors"
            >Admin Settings</router-link
          >
          <span>/</span>
          <span class="text-slate-800">Enterprise Accounts</span>
        </div>
        <h1
          class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5"
        >
          <span>Enterprise Accounts Directory</span>
        </h1>
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="openAddCustomerModal"
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          <span> Tambah Mitra Korporat</span>
        </button>
      </div>
    </div>

    <!-- 2 Account Portfolio KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Card 1: TOTAL MITRA -->
      <div
        class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between"
      >
        <div>
          <span
            class="text-[11px] font-bold text-slate-500 uppercase tracking-wider block"
            >TOTAL MITRA</span
          >
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-black text-slate-900 font-mono">{{
              ticketStore.customers.length
            }}</span>
            <span
              v-if="ticketStore.customers.length > 0"
              class="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded"
            >
              &uarr; {{ ticketStore.customers.length }} Mitra
            </span>
          </div>
          <span class="text-[11px] text-slate-500 font-medium mt-1 block">
            {{ activeCustomersCount }} Aktif •
            {{ inactiveCustomersCount }} Nonaktif
          </span>
        </div>
        <div
          class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Card 2: TIKET HAMPIR HABIS -->
      <div
        class="border rounded-xl p-4 shadow-xs flex items-center justify-between transition-colors"
        :class="
          criticalQuotaCount > 0
            ? 'bg-rose-50/60 border-rose-200'
            : 'bg-white border-slate-200'
        "
      >
        <div>
          <span
            class="text-[11px] font-bold uppercase tracking-wider block"
            :class="criticalQuotaCount > 0 ? 'text-rose-600' : 'text-slate-500'"
            >TIKET HAMPIR HABIS</span
          >
          <div class="mt-1">
            <span
              class="text-2xl font-black font-mono"
              :class="
                criticalQuotaCount > 0 ? 'text-rose-700' : 'text-slate-900'
              "
            >
              {{ criticalQuotaCount }} Mitra
            </span>
          </div>
          <span
            class="text-[11px] font-medium mt-1 block"
            :class="criticalQuotaCount > 0 ? 'text-rose-600' : 'text-slate-400'"
          >
            {{
              criticalQuotaCount > 0 ? "Perlu perhatian" : "Semua kuota aman"
            }}
          </span>
        </div>
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
          :class="
            criticalQuotaCount > 0
              ? 'bg-rose-100 text-rose-600'
              : 'bg-slate-100 text-slate-400'
          "
        >
          <svg
            class="w-6 h-6"
            :class="{ 'animate-pulse': criticalQuotaCount > 0 }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div
      class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
    >
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama mitra atau industri..."
          class="w-full pl-9 pr-3 h-[34px] border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <svg
          class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <div class="flex items-center space-x-2 shrink-0">
        <BaseSelect
          v-model="filterIndustry"
          :options="filterIndustryOptions"
          size="sm"
          searchable
          placeholder="Semua Sektor Industri"
          containerClass="w-48"
          rounded="rounded-lg"
          inputClass="h-[34px]"
        />

        <BaseSelect
          v-model="filterStatus"
          :options="filterStatusOptions"
          size="sm"
          placement="right"
          placeholder="Semua Status"
          containerClass="w-40"
          rounded="rounded-lg"
          inputClass="h-[34px]"
        />

        <button
          @click="handleExportExcel"
          :disabled="isExporting"
          class="h-[34px] px-3.5 border border-slate-200 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer shadow-2xs disabled:opacity-50 select-none"
          title="Ekspor daftar mitra ke Microsoft Excel (.xlsx)"
        >
          <svg
            class="w-3.5 h-3.5 text-emerald-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          <span class="whitespace-nowrap">{{ isExporting ? "Mengekspor..." : "Export Excel" }}</span>
        </button>
      </div>
    </div>

    <!-- Enterprise Accounts Table (Aligned with CUSTOMER_PIC.png) -->
    <div
      class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead
            class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono"
          >
            <tr>
              <th class="px-3 py-3 w-10 text-center whitespace-nowrap">NO</th>
              <th class="px-3 py-3 min-w-[160px] whitespace-nowrap">NAMA CUSTOMER</th>
              <th class="px-3 py-3 whitespace-nowrap">INDUSTRI</th>
              <th class="px-3 py-3 whitespace-nowrap">PERIODE MAINTENANCE</th>
              <th class="px-3 py-3 text-center whitespace-nowrap">
                <div class="flex items-center justify-center space-x-1">
                  <span>SISA KUOTA TIKET</span>
                  <span
                    class="text-slate-400 font-normal cursor-help"
                    title="Saldo kuota tiket insiden yang saat ini tersedia untuk digunakan"
                    >(i)</span
                  >
                </div>
              </th>
              <th class="px-3 py-3 whitespace-nowrap">PAKET KONTRAK SLA</th>
              <th class="px-3 py-3 text-center whitespace-nowrap">STATUS</th>
              <th class="px-3 py-3 w-16 text-center whitespace-nowrap">AKSI</th>
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
                  : '',
              ]"
            >
              <!-- NO -->
              <td
                class="px-3 py-3 align-middle text-center text-slate-500 font-mono text-xs"
              >
                {{ (currentPage - 1) * itemsPerPage + idx + 1 }}
              </td>

              <!-- NAMA CUSTOMER -->
              <td class="px-3 py-3 align-middle">
                <div class="font-bold text-slate-900 text-xs leading-snug">
                  {{ c.name }}
                </div>
                <div
                  v-if="c.address"
                  class="text-slate-400 text-[11px] truncate max-w-[220px] mt-0.5"
                  :title="c.address"
                >
                  {{ c.address }}
                </div>
              </td>

              <!-- INDUSTRI -->
              <td
                class="px-3 py-3 align-middle text-slate-700 text-xs font-medium whitespace-nowrap"
              >
                {{ c.industry || "Klien Korporat" }}
              </td>

              <!-- PERIODE MAINTENANCE -->
              <td
                class="px-3 py-3 align-middle font-mono text-[11px] text-slate-600 leading-tight whitespace-nowrap"
              >
                <div class="font-semibold text-slate-800">
                  {{ getMaintenancePeriod(c).start }}
                </div>
                <div class="text-slate-400">
                  s/d {{ getMaintenancePeriod(c).end }}
                </div>
              </td>

              <!-- SISA KUOTA TIKET (Direct Balance Model) -->
              <td class="px-3 py-3 align-middle text-center whitespace-nowrap">
                <template v-if="c.ticketQuota && String(c.ticketQuota).toLowerCase() !== 'unlimited'">
                  <div class="flex items-center justify-center">
                    <span
                      class="font-mono text-xs font-black"
                      :class="[
                        getCustomerQuotaInfo(c).isCritical ? 'text-rose-600' :
                        getCustomerQuotaInfo(c).isNearLimit ? 'text-amber-600' :
                        'text-emerald-700'
                      ]"
                    >
                      {{ c.ticketQuota }} Tiket
                    </span>
                  </div>
                </template>
                <template v-else>
                  <span
                    class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                  >
                    Unlimited
                  </span>
                </template>
              </td>

              <!-- PAKET KONTRAK SLA -->
              <td class="px-3 py-3 align-middle whitespace-nowrap">
                <span
                  class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {{ getSlaTierName(c.slaTier || c.contractSla) }}
                </span>
              </td>

              <!-- STATUS -->
              <td class="px-3 py-3 align-middle text-center whitespace-nowrap">
                <!-- Active Status -->
                <span
                  v-if="c.isActive !== false"
                  class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  ></span>
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
              <td class="px-3 py-3 align-middle text-center whitespace-nowrap">
                <button
                  @click.stop="toggleActionMenu(c.id, $event)"
                  class="action-menu-btn w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                  title="Menu Aksi"
                >
                  <svg
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"
                    />
                  </svg>
                </button>
              </td>
            </tr>

            <!-- Empty State Row -->
            <tr v-if="paginatedCustomers.length === 0">
              <td colspan="9" class="px-6 py-12 text-center text-slate-500">
                <div
                  class="flex flex-col items-center justify-center space-y-2"
                >
                  <div
                    class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span class="font-bold text-slate-700 text-sm"
                    >Belum Ada Data Mitra Pelanggan</span
                  >
                  <p class="text-xs text-slate-400 max-w-sm">
                    Data mitra korporat saat ini kosong. Anda dapat menambahkan
                    mitra baru melalui tombol Tambah Mitra di atas.
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Toolbar -->
      <div
        class="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <span class="text-slate-500 font-medium">
          Menampilkan
          <strong class="text-slate-800">
            {{
              filteredCustomers.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0
            }}
          </strong>
          -
          <strong class="text-slate-800">
            {{ Math.min(currentPage * itemsPerPage, filteredCustomers.length) }}
          </strong>
          dari <strong class="text-slate-800">{{ filteredCustomers.length }}</strong> mitra
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

    <!-- Action Menu Teleport Dropdown (Fixed to body to eliminate table overflow & scrolling) -->
    <Teleport to="body">
      <div v-if="openActionMenuId && activeMenuCustomer">
        <!-- Invisible backdrop to catch outside clicks and close menu instantly -->
        <div
          class="fixed inset-0 z-40"
          @click="openActionMenuId = null"
        ></div>

        <!-- Floating Action Menu -->
        <div
          class="action-menu-popover fixed z-50 w-40 bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-left animate-in fade-in zoom-in-95 duration-100"
          :style="{
            top: `${actionMenuPosition.top}px`,
            left: `${actionMenuPosition.left}px`,
          }"
        >
          <button
            @click="
              openEditCustomerModal(activeMenuCustomer);
              openActionMenuId = null;
            "
            class="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
          >
            <svg
              class="w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
            <span>Edit Data</span>
          </button>
          <button
            @click="
              openPicListModal(activeMenuCustomer);
              openActionMenuId = null;
            "
            class="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
          >
            <svg
              class="w-3.5 h-3.5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <span>Kontak PIC</span>
          </button>

          <!-- Tambah Kuota Tiket Action -->
          <button
            @click="
              openAddQuotaModal(activeMenuCustomer);
              openActionMenuId = null;
            "
            class="w-full px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50 flex items-center space-x-2 cursor-pointer font-medium"
          >
            <svg
              class="w-3.5 h-3.5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Tambah Kuota</span>
          </button>

          <!-- Toggle Status Manual Action -->
          <button
            @click="
              handleToggleCustomerStatus(activeMenuCustomer);
              openActionMenuId = null;
            "
            class="w-full px-3 py-1.5 text-xs flex items-center space-x-2 cursor-pointer transition-colors"
            :class="
              activeMenuCustomer.isActive !== false
                ? 'text-amber-700 hover:bg-amber-50'
                : 'text-emerald-700 hover:bg-emerald-50'
            "
          >
            <svg
              v-if="activeMenuCustomer.isActive !== false"
              class="w-3.5 h-3.5 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              ></path>
            </svg>
            <svg
              v-else
              class="w-3.5 h-3.5 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{{
              activeMenuCustomer.isActive !== false
                ? "Nonaktifkan Mitra"
                : "Aktifkan Mitra"
            }}</span>
          </button>

          <div class="border-t border-slate-100 my-1"></div>
          <button
            @click="
              handleDeleteCustomer(activeMenuCustomer);
              openActionMenuId = null;
            "
            class="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 cursor-pointer"
          >
            <svg
              class="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            <span>Hapus Mitra</span>
          </button>
        </div>
      </div>
    </Teleport>

    <!-- Floating Toast Alert: Peringatan Kuota Tiket Hampir Habis (Matching CUSTOMER_PIC.png) -->
    <div
      v-if="criticalCustomer && showCriticalToast"
      class="fixed bottom-6 right-6 z-40 max-w-md w-[calc(100%-3rem)] sm:w-full bg-white rounded-2xl shadow-2xl border border-rose-200 p-5 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center space-x-3">
          <div
            class="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs"
          >
            <svg
              class="w-4.5 h-4.5 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </div>
          <div>
            <h4
              class="font-bold text-slate-900 text-xs sm:text-sm leading-tight"
            >
              Peringatan Kuota Tiket Hampir Habis
            </h4>
            <span class="text-[10px] text-slate-400 font-mono mt-0.5 block"
              >04 Okt 2026, 10:15 WIB</span
            >
          </div>
        </div>
        <button
          @click="showCriticalToast = false"
          class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors cursor-pointer"
          title="Tutup Notifikasi"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed mb-4">
        Kuota tiket untuk
        <strong class="text-slate-900 font-bold">{{
          criticalCustomer.name
        }}</strong>
        tersisa
        <span class="font-mono font-bold text-rose-600">{{
          criticalCustomer.ticketQuota || '0'
        }} tiket</span>
        ({{ getCustomerQuotaInfo(criticalCustomer).used }} riwayat insiden tercatat). Silakan hubungi customer untuk konfirmasi penambahan kuota tiket.
      </p>

      <div class="flex items-center justify-end pt-1 gap-2">
        <button
          @click="openAddQuotaModal(criticalCustomer)"
          class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs hover:shadow transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          <span>Tambah Kuota</span>
        </button>
        <button
          @click="focusAndEditCustomer(criticalCustomer)"
          class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs hover:shadow transition-all cursor-pointer flex items-center space-x-1.5"
        >
          <span>Lihat Detail Mitra</span>
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal 1: Tambah Perusahaan Mitra Baru (Horizontal Multi-Column Layout) -->
    <div
      v-if="showAddCustomerModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150 my-auto"
      >
        <!-- Modal Title -->
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-3"
        >
          <div>
            <h4 class="font-black text-slate-900 text-base">
              Tambah Perusahaan Mitra Baru
            </h4>
          </div>
          <button
            @click="showAddCustomerModal = false"
            class="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitAddCustomer" class="space-y-4">
          <!-- Horizontal 2-Column Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kolom Kiri: Profil Perusahaan & Kontak PIC -->
            <div class="space-y-4">
              <!-- Sub-section: Informasi Perusahaan -->
              <div class="space-y-2.5">
                <div
                  class="flex items-center space-x-1.5 text-slate-900 font-bold text-xs"
                >
                  <svg
                    class="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                  <span>Informasi Perusahaan &amp; Lokasi</span>
                </div>

                <div>
                  <label class="block font-semibold text-slate-700 mb-1"
                    >Nama Perusahaan *</label
                  >
                  <input
                    v-model="newCustomer.name"
                    required
                    type="text"
                    placeholder="Contoh: PT Telekomunikasi Selular"
                    class="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <!-- Sektor Industri -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block font-semibold text-slate-700"
                      >Sektor Industri</label
                    >
                    <button
                      type="button"
                      @click="showSectorManager = !showSectorManager"
                      class="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <svg
                        class="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      <span>{{
                        showSectorManager ? "Selesai" : "Kelola Sektor"
                      }}</span>
                    </button>
                  </div>

                  <BaseSelect
                    v-model="newCustomer.industry"
                    :options="industrySelectOptions"
                    size="sm"
                    searchable
                    placeholder="-- Pilih Sektor --"
                  />

                  <!-- Panel Kelola Sektor -->
                  <div
                    v-if="showSectorManager"
                    class="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in duration-150"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[11px] font-bold text-slate-700"
                        >Daftar Sektor</span
                      >
                      <span class="text-[10px] text-slate-400"
                        >Klik (×) untuk menghapus</span
                      >
                    </div>

                    <div class="flex items-center space-x-1.5">
                      <input
                        v-model="newSectorInput"
                        @keydown.enter.prevent="handleAddSector"
                        type="text"
                        placeholder="Nama sektor baru..."
                        class="flex-1 p-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        @click="handleAddSector"
                        class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        + Tambah
                      </button>
                    </div>

                    <div
                      class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1"
                    >
                      <span
                        v-for="sec in industryList"
                        :key="sec"
                        class="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-700"
                      >
                        <span>{{ sec }}</span>
                        <button
                          type="button"
                          @click="handleDeleteSector(sec)"
                          class="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Alamat Kantor -->
                <div>
                  <label class="block font-semibold text-slate-700 mb-1"
                    >Alamat Gedung / Kantor *</label
                  >
                  <textarea
                    v-model="newCustomer.address"
                    rows="2"
                    required
                    placeholder="Alamat lengkap lokasi instalasi / kantor mitra..."
                    class="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <!-- Sub-section: Kontak PIC Pelapor Awal -->
              <div class="pt-3 border-t border-slate-100 space-y-2">
                <div
                  class="flex items-center space-x-1.5 text-slate-900 font-bold text-xs"
                >
                  <svg
                    class="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span>Kontak PIC Pelapor Awal</span>
                </div>

                <div>
                  <input
                    v-model="newCustomer.picName"
                    required
                    type="text"
                    placeholder="Nama PIC (Bpk. / Ibu ...)"
                    class="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    v-model="newCustomer.picPhone"
                    required
                    type="text"
                    placeholder="No. HP / WhatsApp"
                    class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    v-model="newCustomer.picEmail"
                    required
                    type="email"
                    placeholder="Email PIC"
                    class="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <!-- Kolom Kanan: Kontrak & Paket SLA & Kuota Tiket -->
            <div class="space-y-4">
              <div class="space-y-2.5">
                <div
                  class="flex items-center space-x-1.5 text-slate-900 font-bold text-xs"
                >
                  <svg
                    class="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <span>Kontrak SLA &amp; Kuota Tiket</span>
                </div>

                <!-- Dropdown Paket SLA -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block font-semibold text-slate-700"
                      >Paket Kontrak SLA *</label
                    >
                    <router-link
                      to="/admin/sla-configuration"
                      class="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                    >
                      <span>Kelola SLA &rarr;</span>
                    </router-link>
                  </div>
                  <BaseSelect
                    v-model="newCustomer.contractSla"
                    :options="slaPolicySelectOptions"
                    required
                    placeholder="-- Pilih Paket Kontrak SLA --"
                  />
                </div>

                <!-- Periode Maintenance -->
                <div>
                  <label class="block font-semibold text-slate-700 mb-1"
                    >Periode Maintenance *</label
                  >
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <span class="text-[10px] text-slate-400 block mb-0.5"
                        >Tanggal Mulai:</span
                      >
                      <input
                        v-model="newCustomer.maintenanceStart"
                        type="date"
                        required
                        class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span class="text-[10px] text-slate-400 block mb-0.5"
                        >Tanggal Berakhir:</span
                      >
                      <input
                        v-model="newCustomer.maintenanceEnd"
                        type="date"
                        required
                        class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <!-- Jumlah Kuota Tiket -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block font-semibold text-slate-700"
                      >Jumlah Kuota Tiket *</label
                    >
                    <button
                      type="button"
                      @click="newCustomer.ticketQuota = 'Unlimited'"
                      class="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer underline"
                    >
                      Set Unlimited
                    </button>
                  </div>
                  <input
                    v-model="newCustomer.ticketQuota"
                    type="text"
                    required
                    placeholder="Contoh: 50, 150, atau Unlimited"
                    class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                  <span class="text-[10px] text-slate-400 mt-1 block">
                    Ketik angka kuota bebas atau gunakan "Unlimited"
                  </span>
                </div>

                <!-- Informative Helper Banner -->
                <div
                  class="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center space-x-2 text-[11px] text-blue-700 mt-2"
                >
                  <svg
                    class="w-4 h-4 text-blue-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span
                    >Peringatan otomatis aktif saat kuota tiket tersisa 10% dari
                    total.</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div
            class="flex justify-end space-x-2 pt-3 border-t border-slate-100"
          >
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

    <!-- Modal 2: Edit Data Mitra (Horizontal Multi-Column Layout) -->
    <div
      v-if="showEditCustomerModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150 my-auto"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-3"
        >
          <div>
            <h4 class="font-black text-slate-900 text-base">
              Edit Data Mitra Korporat
            </h4>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Perbarui profil mitra, alokasi paket SLA, dan masa aktif kontrak
              layanan.
            </p>
          </div>
          <button
            @click="showEditCustomerModal = false"
            class="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitEditCustomer" class="space-y-4">
          <!-- Horizontal 2-Column Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kolom Kiri: Profil Perusahaan, Alamat & Status -->
            <div class="space-y-3">
              <div
                class="flex items-center space-x-1.5 text-slate-900 font-bold text-xs"
              >
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                <span>Profil Perusahaan &amp; Status</span>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1"
                  >Nama Perusahaan *</label
                >
                <input
                  v-model="editCustomerForm.name"
                  required
                  type="text"
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>

              <!-- Sektor Industri (Opsional dengan Tambah/Hapus Sektor) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block font-semibold text-slate-700"
                    >Sektor Industri (Opsional)</label
                  >
                  <button
                    type="button"
                    @click="showSectorManager = !showSectorManager"
                    class="text-[10px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <span>{{
                      showSectorManager ? "Selesai" : "Kelola Sektor"
                    }}</span>
                  </button>
                </div>

                <BaseSelect
                  v-model="editCustomerForm.industry"
                  :options="industrySelectOptions"
                  size="sm"
                  searchable
                  placeholder="-- Pilih Sektor (Opsional) --"
                />

                <!-- Panel Kelola Sektor (Add & Delete) -->
                <div
                  v-if="showSectorManager"
                  class="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in duration-150"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-bold text-slate-700"
                      >Daftar Sektor</span
                    >
                    <span class="text-[10px] text-slate-400"
                      >Klik (×) untuk menghapus</span
                    >
                  </div>

                  <div class="flex items-center space-x-1.5">
                    <input
                      v-model="newSectorInput"
                      @keydown.enter.prevent="handleAddSector"
                      type="text"
                      placeholder="Nama sektor baru..."
                      class="flex-1 p-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      @click="handleAddSector"
                      class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      + Tambah
                    </button>
                  </div>

                  <div
                    class="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1"
                  >
                    <span
                      v-for="sec in industryList"
                      :key="sec"
                      class="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-700"
                    >
                      <span>{{ sec }}</span>
                      <button
                        type="button"
                        @click="handleDeleteSector(sec)"
                        class="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Alamat -->
              <div>
                <label class="block font-semibold text-slate-700 mb-1"
                  >Alamat Gedung / Kantor *</label
                >
                <textarea
                  v-model="editCustomerForm.address"
                  rows="2"
                  class="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <!-- Status Operasional Mitra -->
              <div>
                <BaseSelect
                  v-model="editCustomerForm.isActive"
                  :options="customerStatusOptions"
                  label="Status Operasional Mitra"
                  required
                />
              </div>
            </div>

            <!-- Kolom Kanan: Kontrak & Paket SLA & Kuota Tiket -->
            <div class="space-y-3">
              <div
                class="flex items-center space-x-1.5 text-slate-900 font-bold text-xs"
              >
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span>Kontrak SLA &amp; Kuota Tiket</span>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block font-semibold text-slate-700"
                    >Paket Kontrak SLA *</label
                  >
                  <router-link
                    to="/admin/sla-configuration"
                    class="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>Kelola SLA &rarr;</span>
                  </router-link>
                </div>
                <BaseSelect
                  v-model="editCustomerForm.contractSla"
                  :options="slaPolicySelectOptions"
                  required
                  placeholder="-- Pilih Paket Kontrak SLA --"
                />
              </div>

              <!-- Maintenance (Mulai & Selesai) -->
              <div>
                <label class="block font-semibold text-slate-700 mb-1"
                  >Periode Maintenance *</label
                >
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <span class="text-[10px] text-slate-400 block mb-0.5"
                      >Mulai:</span
                    >
                    <input
                      v-model="editCustomerForm.maintenanceStart"
                      type="date"
                      required
                      class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block mb-0.5"
                      >Selesai:</span
                    >
                    <input
                      v-model="editCustomerForm.maintenanceEnd"
                      type="date"
                      required
                      class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <!-- Jumlah Kuota Tiket -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block font-semibold text-slate-700"
                    >Jumlah Kuota Tiket *</label
                  >
                  <div class="flex items-center space-x-2">
                    <button
                      type="button"
                      @click="openAddQuotaModal(ticketStore.customers.find(c => c.id === editCustomerForm.id)); showEditCustomerModal = false;"
                      class="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer hover:underline"
                    >
                      + Tambah Kuota
                    </button>
                    <span class="text-slate-300">|</span>
                    <button
                      type="button"
                      @click="editCustomerForm.ticketQuota = 'Unlimited'"
                      class="text-[10px] text-slate-500 hover:text-slate-700 font-semibold cursor-pointer underline"
                    >
                      Set Unlimited
                    </button>
                  </div>
                </div>
                <input
                  v-model="editCustomerForm.ticketQuota"
                  type="text"
                  required
                  placeholder="Contoh: 50, 150, atau Unlimited"
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span class="text-[10px] text-slate-400 mt-1 block">
                  Pagu kuota kontrak total. Sisa tiket = Total kuota - tiket terpakai. Gunakan <strong>+ Tambah Kuota</strong> untuk menambah secara akumulatif.
                </span>
              </div>

              <!-- Info Box -->
              <div
                class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-[11px] text-slate-600 mt-2"
              >
                <svg
                  class="w-4 h-4 text-slate-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span
                  >Perubahan paket SLA atau kuota langsung berlaku pada tiket
                  berjalan berikutnya.</span
                >
              </div>
            </div>
          </div>

          <div
            class="flex justify-end space-x-2 pt-3 border-t border-slate-100"
          >
            <button
              type="button"
              @click="showEditCustomerModal = false"
              class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Perbarui Data
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: View & Manage PICs -->
    <div
      v-if="showPicModal && activeCustomer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs animate-in fade-in duration-150"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-2.5"
        >
          <div>
            <h4 class="font-bold text-slate-900 text-sm">
              Kontak PIC Terdaftar - {{ activeCustomer.name }}
            </h4>
            <p class="text-[11px] text-slate-500">
              Daftar PIC resmi yang berwenang melapor dan menerima update tiket
            </p>
          </div>
          <button
            @click="showPicModal = false"
            class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div class="space-y-2.5 max-h-72 overflow-y-auto">
          <div
            v-for="pic in activeCustomer.pics"
            :key="pic.id"
            class="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-slate-900">{{ pic.name }}</div>
              <div class="text-[11px] text-slate-500">
                <span>{{ pic.email }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span class="font-mono text-slate-700 font-semibold text-xs">{{
                pic.phone
              }}</span>
              <button
                @click="handleDeletePic(pic)"
                class="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                title="Hapus Kontak PIC"
              >
                <svg
                  class="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          class="pt-3 border-t border-slate-100 flex justify-between items-center"
        >
          <button
            @click="openAddPicModal(activeCustomer)"
            class="px-3.5 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Tambah PIC Baru
          </button>
          <button
            @click="showPicModal = false"
            class="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Add PIC -->
    <div
      v-if="showAddPicModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-2.5"
        >
          <h4 class="font-bold text-slate-900 text-sm">Tambah PIC Baru</h4>
          <button
            @click="showAddPicModal = false"
            class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitAddPic" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Nama Lengkap PIC *</label
            >
            <input
              v-model="newPic.name"
              required
              type="text"
              placeholder="Bpk. / Ibu ..."
              class="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >No. Handphone (WhatsApp) *</label
            >
            <input
              v-model="newPic.phone"
              required
              type="text"
              placeholder="0812-..."
              class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Alamat Email PIC *</label
            >
            <input
              v-model="newPic.email"
              required
              type="email"
              placeholder="pic@perusahaan.com"
              class="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div
            class="flex justify-end space-x-2 pt-3 border-t border-slate-100"
          >
            <button
              type="button"
              :disabled="isSubmittingPic"
              @click="showAddPicModal = false"
              class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmittingPic"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
            >
              <svg
                v-if="isSubmittingPic"
                class="w-3.5 h-3.5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span>{{ isSubmittingPic ? "Menyimpan..." : "Simpan PIC" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 5: Tambah Kuota Tiket (Free Open Input - No Quick Buttons) -->
    <div
      v-if="showAddQuotaModal && quotaCustomer"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150 my-auto"
      >
        <!-- Modal Title -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 class="font-black text-slate-900 text-sm">
                Tambah Kuota Tiket Mitra
              </h4>
              <p class="text-[11px] text-slate-500">
                Alokasi tiket insiden tambahan untuk <strong class="text-slate-800">{{ quotaCustomer.name }}</strong>
              </p>
            </div>
          </div>
          <button
            @click="showAddQuotaModal = false"
            class="text-slate-400 hover:text-slate-600 text-xl font-bold leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <!-- Quota Status Current Cards -->
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            <span>Status Saldo Kuota Tiket</span>
            <span v-if="quotaCustomerInfo?.isCritical" class="text-rose-600 flex items-center gap-1 font-mono font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              Perlu Top-Up
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-center">
            <div class="p-2 bg-white rounded-lg border border-slate-200">
              <span class="text-[10px] text-slate-500 block">Sisa Saldo Kuota</span>
              <span
                class="font-mono font-black text-xs sm:text-sm"
                :class="quotaCustomerInfo?.isCritical ? 'text-rose-600' : 'text-emerald-700'"
              >
                {{ quotaCustomerInfo?.remaining }} Tiket
              </span>
            </div>
            <div class="p-2 bg-white rounded-lg border border-slate-200">
              <span class="text-[10px] text-slate-500 block">Total Riwayat Insiden</span>
              <span class="font-mono font-bold text-slate-700 text-xs sm:text-sm">
                {{ quotaCustomerInfo?.used }} Tiket
              </span>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitAddQuota" class="space-y-4">
          <!-- Free Input Field (Strictly no quick buttons as requested) -->
          <div>
            <label class="block font-bold text-slate-800 mb-1">
              Jumlah Tiket Tambahan *
            </label>
            <div class="relative">
              <input
                v-model.number="addQuotaAmount"
                type="number"
                min="1"
                step="1"
                required
                placeholder="Masukkan jumlah tiket, misal: 5, 10, 20..."
                class="w-full p-2.5 pl-3 pr-16 border border-slate-200 rounded-lg text-sm font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                autofocus
              />
              <div class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs text-slate-400 font-semibold font-mono">
                Tiket
              </div>
            </div>
          </div>

          <!-- Live Preview / Simulasi Real-Time -->
          <div
            v-if="addQuotaAmount && addQuotaAmount > 0"
            class="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-in fade-in duration-150"
          >
            <div class="text-[11px] font-bold text-blue-900 flex items-center justify-between">
              <span>Hasil Simulasi Tambahan:</span>
              <span class="font-mono font-black text-blue-700 text-xs">
                +{{ addQuotaAmount }} Tiket
              </span>
            </div>
            <div class="p-2.5 bg-white rounded-lg border border-blue-100 flex items-center justify-between">
              <span class="text-xs text-slate-600 font-medium">Saldo Kuota Tiket Baru</span>
              <span class="font-mono font-black text-emerald-700 text-sm">
                {{ calculatedNewQuota }} Tiket
              </span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              :disabled="isSubmittingQuota"
              @click="showAddQuotaModal = false"
              class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSubmittingQuota || !addQuotaAmount || addQuotaAmount <= 0"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
            >
              <svg
                v-if="isSubmittingQuota"
                class="w-3.5 h-3.5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>{{ isSubmittingQuota ? "Menyimpan..." : "Simpan & Tambah Kuota" }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTicketStore, filterCleanSlaPolicies } from "../stores/ticketStore";
import { useAuthStore } from "../stores/authStore";
import { useUiStore } from "../stores/uiStore";

const route = useRoute();
const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const uiStore = useUiStore();

const searchQuery = ref("");
const filterIndustry = ref("");
const filterStatus = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

const showAddCustomerModal = ref(false);
const showEditCustomerModal = ref(false);
const showPicModal = ref(false);
const showAddPicModal = ref(false);
const showCriticalToast = ref(true);
const openActionMenuId = ref(null);
const actionMenuPosition = ref({ top: 0, left: 0 });
const focusedCustomerId = ref(null);
const activeCustomer = ref(null);
const isExporting = ref(false);
const isSubmittingPic = ref(false);

const showAddQuotaModal = ref(false);
const quotaCustomer = ref(null);
const addQuotaAmount = ref(null);
const isSubmittingQuota = ref(false);

const activeMenuCustomer = computed(() => {
  return (
    ticketStore.customers.find((c) => c.id === openActionMenuId.value) || null
  );
});

const defaultIndustries = [
  "Telekomunikasi",
  "Perbankan & Finansial",
  "Transportasi & Logistik",
  "Keuangan / Perbankan",
  "Otomotif",
  "Energi & Utilitas",
  "Kesehatan",
  "Pemerintahan / Publik",
  "Farmasi",
  "Teknologi & Media",
];

const industryList = ref([...defaultIndustries]);
const showSectorManager = ref(false);
const newSectorInput = ref("");

const fetchIndustrySectors = async () => {
  try {
    const data = await api.getIndustrySectors();
    if (Array.isArray(data) && data.length > 0) {
      industryList.value = data.map((item) => (typeof item === 'string' ? item : item.name));
    }
  } catch (err) {
    console.warn('[CustomersManagementView] Fallback ke daftar sektor default:', err.message);
  }
};

const handleAddSector = async () => {
  const trimmed = newSectorInput.value.trim();
  if (!trimmed) return;

  if (industryList.value.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
    uiStore.toastWarning(`Sektor "${trimmed}" sudah ada di daftar.`);
    return;
  }

  try {
    const created = await api.createIndustrySector({ name: trimmed });
    const sectorName = created?.name || trimmed;
    industryList.value.push(sectorName);
    industryList.value.sort();

    if (showAddCustomerModal.value) {
      newCustomer.value.industry = sectorName;
    } else if (showEditCustomerModal.value) {
      editCustomerForm.value.industry = sectorName;
    }
    newSectorInput.value = "";
    uiStore.toastSuccess(`Sektor "${sectorName}" berhasil ditambahkan ke database.`);
  } catch (err) {
    uiStore.toastError(err.message || 'Gagal menambahkan sektor industri.');
  }
};

const handleDeleteSector = async (sector) => {
  const ok = await uiStore.confirm({
    title: "Hapus Sektor Industri?",
    message: `Apakah Anda yakin ingin menghapus sektor "${sector}" dari database master?`,
    confirmText: "Ya, Hapus",
    type: "danger",
  });
  if (!ok) return;

  try {
    await api.deleteIndustrySector(sector);
    industryList.value = industryList.value.filter((i) => i !== sector);
    if (newCustomer.value.industry === sector) {
      newCustomer.value.industry = "";
    }
    if (editCustomerForm.value.industry === sector) {
      editCustomerForm.value.industry = "";
    }
    uiStore.toastSuccess(`Sektor "${sector}" berhasil dihapus dari database.`);
  } catch (err) {
    uiStore.toastError(err.message || 'Gagal menghapus sektor industri.');
  }
};

const availableSlaPolicies = computed(() => {
  return filterCleanSlaPolicies(ticketStore.slaPolicies || []);
});

const getSlaTierName = (tier) => {
  if (!tier) return "-";
  const policy = (availableSlaPolicies.value || []).find(
    (p) => p.tierName === tier || p.tierCode === tier,
  );
  return policy ? policy.tierName : tier;
};

const defaultSlaTierCode = computed(() => {
  return availableSlaPolicies.value[0]?.tierName || "";
});

// Dropdown options
const filterIndustryOptions = computed(() => [
  { value: "", label: "Semua Sektor Industri" },
  ...industryList.value.map(sec => ({ value: sec, label: sec }))
]);

const filterStatusOptions = [
  { value: "", label: "Semua Status" },
  { value: "active", label: "Active (Aktif)", badge: "Aktif", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  { value: "inactive", label: "Nonaktif / Expired", badge: "Nonaktif", badgeClass: "bg-slate-100 text-slate-500" },
  { value: "critical", label: "Tiket Hampir Habis (≤ 10%)", badge: "Kritis", badgeClass: "bg-rose-50 text-rose-700 border border-rose-200" }
];

const industrySelectOptions = computed(() => [
  { value: "", label: "-- Pilih Sektor Industri --" },
  ...industryList.value.map(sec => ({ value: sec, label: sec }))
]);

const customerStatusOptions = [
  { value: true, label: "Active (Aktif Melayani)", subtext: "Mitra berhak menerbitkan tiket layanan", badge: "Aktif", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  { value: false, label: "Nonaktif (Inactive / Ditangguhkan)", subtext: "Layanan ditangguhkan sementara", badge: "Nonaktif", badgeClass: "bg-rose-50 text-rose-700 border border-rose-200" }
];

const slaPolicySelectOptions = computed(() => {
  return availableSlaPolicies.value.map(p => ({
    value: p.tierName || p.id,
    label: p.tierName,
    subtext: p.operatingHours || '24 Jam x 7 Hari (Non-Stop)',
    badge: 'SLA'
  }));
});

const newCustomer = ref({
  name: "",
  industry: "",
  contractSla: "",
  address: "",
  maintenanceStart: new Date().toISOString().slice(0, 10),
  maintenanceEnd: new Date(Date.now() + 365 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10),
  ticketQuota: "Unlimited",
  picName: "",
  picPhone: "",
  picEmail: "",
});

const activeCustomersCount = computed(() => {
  return ticketStore.customers.filter((c) => c.isActive !== false).length;
});

const inactiveCustomersCount = computed(() => {
  return ticketStore.customers.filter((c) => c.isActive === false).length;
});

const isCustomerMaintenanceExpired = (customer) => {
  if (!customer?.maintenanceEnd) return false;
  const todayStr = new Date().toISOString().slice(0, 10);
  return customer.maintenanceEnd < todayStr;
};

const editCustomerForm = ref({
  id: null,
  name: "",
  industry: "",
  contractSla: "",
  address: "",
  maintenanceStart: "2026-12-01",
  maintenanceEnd: "2027-11-30",
  ticketQuota: 100,
  isActive: true,
});

const newPic = ref({
  name: "",
  phone: "",
  email: "",
});

const formatIndoDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const getMaintenancePeriod = (customer) => {
  if (!customer) return { start: "-", end: "-" };
  let start = customer.maintenanceStart;
  let end = customer.maintenanceEnd;
  if (!start) {
    start = customer.createdAt
      ? new Date(customer.createdAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
  }
  if (!end) {
    const s = new Date(start);
    const e = isNaN(s.getTime()) ? new Date() : new Date(s);
    e.setFullYear(e.getFullYear() + 1);
    end = e.toISOString().slice(0, 10);
  }
  return {
    start: formatIndoDate(start),
    end: formatIndoDate(end),
  };
};

const getCustomerQuotaInfo = (customer) => {
  return ticketStore.getCustomerQuotaInfo(customer);
};

const getRemainingBadgeClass = (qInfo) => {
  if (qInfo.isCritical) return "bg-rose-50 text-rose-700 border-rose-200";
  if (qInfo.isNearLimit) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
};

const criticalCustomer = computed(() => {
  return ticketStore.criticalQuotaCustomers[0] || null;
});

const criticalQuotaCount = computed(() => {
  return ticketStore.criticalQuotaCustomers.length;
});

const filteredCustomers = computed(() => {
  return ticketStore.customers.filter((c) => {
    const q = searchQuery.value.toLowerCase();
    const matchQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      (c.industry && c.industry.toLowerCase().includes(q));
    const matchIndustry =
      !filterIndustry.value ||
      (c.industry &&
        c.industry.toLowerCase().includes(filterIndustry.value.toLowerCase()));

    let matchStatus = true;
    if (filterStatus.value === "critical") {
      const info = getCustomerQuotaInfo(c);
      matchStatus = info.isCritical;
    } else if (filterStatus.value === "active") {
      matchStatus = c.isActive !== false;
    } else if (filterStatus.value === "inactive") {
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

const toggleActionMenu = (id, event) => {
  if (openActionMenuId.value === id) {
    openActionMenuId.value = null;
    return;
  }

  if (event && event.currentTarget) {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 160;
    const menuHeight = 175;

    let left = rect.right - menuWidth;
    if (left < 10) left = 10;

    let top = rect.bottom + 4;
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < menuHeight && rect.top > menuHeight) {
      top = rect.top - menuHeight - 4;
    }

    actionMenuPosition.value = { top, left };
  }

  openActionMenuId.value = id;
};

const handleWindowScroll = () => {
  if (openActionMenuId.value) {
    openActionMenuId.value = null;
  }
};

const openAddCustomerModal = () => {
  newCustomer.value = {
    name: "",
    industry: "",
    contractSla: defaultSlaTierCode.value,
    address: "",
    maintenanceStart: new Date().toISOString().slice(0, 10),
    maintenanceEnd: new Date(Date.now() + 365 * 24 * 3600 * 1000)
      .toISOString()
      .slice(0, 10),
    ticketQuota: "Unlimited",
    picName: "",
    picPhone: "",
    picEmail: "",
  };
  showSectorManager.value = false;
  showAddCustomerModal.value = true;
};

const openEditCustomerModal = (customer) => {
  editCustomerForm.value = {
    id: customer.id,
    name: customer.name,
    industry: customer.industry || "",
    contractSla: customer.slaTier || customer.contractSla || defaultSlaTierCode.value,
    address: customer.address || "",
    maintenanceStart:
      customer.maintenanceStart || new Date().toISOString().slice(0, 10),
    maintenanceEnd:
      customer.maintenanceEnd ||
      new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    ticketQuota:
      customer.ticketQuota !== undefined ? customer.ticketQuota : "Unlimited",
    isActive: customer.isActive !== false,
  };
  showSectorManager.value = false;
  showEditCustomerModal.value = true;
};

const handleToggleCustomerStatus = async (customer) => {
  const isCurrentlyActive = customer.isActive !== false;

  if (isCurrentlyActive) {
    const activeTickets = ticketStore.tickets.filter(
      (t) =>
        t.customerId === customer.id &&
        !["RESOLVED", "CLOSED"].includes(t.status),
    ).length;
    let msg = `Apakah Anda yakin ingin menonaktifkan status operasional mitra "${customer.name}"?`;
    if (activeTickets > 0) {
      msg += `\n\nPerhatian: Mitra ini masih memiliki ${activeTickets} tiket yang sedang berjalan di helpdesk.`;
    }
    const ok = await uiStore.confirm({
      title: "Nonaktifkan Kemitraan?",
      message: msg,
      confirmText: "Ya, Nonaktifkan",
      type: "warning",
    });
    if (!ok) return;
  } else {
    if (isCustomerMaintenanceExpired(customer)) {
      const ok = await uiStore.confirm({
        title: "Masa Maintenance Selesai",
        message: `Periode maintenance mitra "${customer.name}" telah berakhir pada ${formatIndoDate(customer.maintenanceEnd)}.\n\nTetap aktifkan akun mitra ini secara manual?`,
        confirmText: "Tetap Aktifkan",
        type: "warning",
      });
      if (!ok) return;
    }
  }

  ticketStore.toggleCustomerStatus(customer.id, authStore.currentUser);
  uiStore.toastSuccess(
    `Status mitra "${customer.name}" berhasil ${!isCurrentlyActive ? "diaktifkan" : "dinonaktifkan"}.`,
  );
};

const submitAddCustomer = async () => {
  try {
    await ticketStore.addCustomer(newCustomer.value, authStore.currentUser);
    await ticketStore.fetchCustomers();
    showAddCustomerModal.value = false;
    uiStore.toastSuccess(`Berhasil mendaftarkan perusahaan mitra "${newCustomer.value.name}"!`);
  } catch (err) {
    console.error("Gagal mendaftarkan mitra:", err);
    uiStore.toastError("Gagal mendaftarkan mitra: " + (err.message || "Terjadi kesalahan sistem"));
  }
};

const submitEditCustomer = async () => {
  try {
    await ticketStore.updateCustomer(
      editCustomerForm.value.id,
      editCustomerForm.value,
      authStore.currentUser,
    );
    await ticketStore.fetchCustomers();
    showEditCustomerModal.value = false;
    uiStore.toastSuccess(`Berhasil memperbarui data profil mitra "${editCustomerForm.value.name}"!`);
  } catch (err) {
    console.error("Gagal memperbarui profil mitra:", err);
    uiStore.toastError("Gagal memperbarui profil mitra: " + (err.message || "Terjadi kesalahan sistem"));
  }
};

const handleDeleteCustomer = async (customer) => {
  const ticketCount = ticketStore.tickets.filter(
    (t) =>
      t.customerId === customer.id &&
      !["RESOLVED", "CLOSED"].includes(t.status),
  ).length;
  if (ticketCount > 0) {
    await uiStore.alert({
      title: "Tidak Dapat Menghapus Mitra",
      message: `Tidak dapat menghapus mitra "${customer.name}" karena masih memiliki ${ticketCount} tiket aktif yang sedang ditangani.`,
      type: "warning",
    });
    return;
  }
  const ok = await uiStore.confirm({
    title: "Hapus Mitra Pelanggan?",
    message: `Apakah Anda yakin ingin menghapus mitra "${customer.name}" secara permanen dari database? Seluruh data riwayat terkait akan terhapus.`,
    confirmText: "Ya, Hapus Mitra",
    type: "danger",
  });
  if (!ok) return;

  ticketStore.deleteCustomer(customer.id, authStore.currentUser);
  uiStore.toastSuccess(`Mitra pelanggan "${customer.name}" berhasil dihapus.`);
};

const focusAndEditCustomer = (customer) => {
  focusedCustomerId.value = customer.id;
  // If customer is on another page, navigate to that page
  const cIndex = filteredCustomers.value.findIndex((c) => c.id === customer.id);
  if (cIndex !== -1) {
    currentPage.value = Math.floor(cIndex / itemsPerPage.value) + 1;
  }
  setTimeout(() => {
    const el = document.getElementById("customer-row-" + customer.id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
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
  newPic.value = { name: "", phone: "", email: "" };
  showAddPicModal.value = true;
};

const submitAddPic = async () => {
  if (!activeCustomer.value || isSubmittingPic.value) return;
  if (!newPic.value.name || !newPic.value.name.trim()) {
    uiStore.toastWarning("Nama lengkap PIC wajib diisi.");
    return;
  }

  isSubmittingPic.value = true;
  try {
    const picName = newPic.value.name.trim();
    const customerName = activeCustomer.value.name;
    const customerId = activeCustomer.value.id;

    await ticketStore.addCustomerPic(
      customerId,
      newPic.value,
      authStore.currentUser,
    );

    // Refresh data pelanggan dari MySQL backend
    await ticketStore.fetchCustomers();

    // Perbarui activeCustomer agar sinkron dengan data terbaru dari store
    const updatedCustomer = ticketStore.customers.find((c) => c.id === customerId);
    if (updatedCustomer) {
      activeCustomer.value = updatedCustomer;
    }

    // Reset form dan tutup form/modal Tambah PIC serta modal daftar PIC
    newPic.value = { name: "", phone: "", email: "" };
    showAddPicModal.value = false;
    showPicModal.value = false;

    // Tampilkan Toast Alert Berhasil
    uiStore.toastSuccess(`Berhasil menambahkan kontak PIC "${picName}" untuk mitra ${customerName}!`);
  } catch (err) {
    console.error("Gagal menambahkan PIC:", err);
    uiStore.toastError("Gagal menambahkan PIC: " + (err.message || "Terjadi kesalahan sistem"));
  } finally {
    isSubmittingPic.value = false;
  }
};

const handleDeletePic = async (pic) => {
  if (!activeCustomer.value) return;
  const ok = await uiStore.confirm({
    title: "Hapus Kontak PIC?",
    message: `Hapus kontak PIC "${pic.name}" dari ${activeCustomer.value.name}?`,
    confirmText: "Ya, Hapus",
    type: "danger",
  });
  if (!ok) return;

  const customerId = activeCustomer.value.id;
  const customerName = activeCustomer.value.name;
  try {
    await ticketStore.deleteCustomerPic(
      customerId,
      pic.id,
      authStore.currentUser,
    );

    // Refresh data pelanggan dari MySQL backend
    await ticketStore.fetchCustomers();

    const updatedCustomer = ticketStore.customers.find((c) => c.id === customerId);
    if (updatedCustomer) {
      activeCustomer.value = updatedCustomer;
    }

    // Tutup modal form PIC setelah delete berhasil
    showPicModal.value = false;
    showAddPicModal.value = false;

    uiStore.toastSuccess(`Kontak PIC "${pic.name}" berhasil dihapus dari ${customerName}.`);
  } catch (err) {
    console.error("Gagal menghapus PIC:", err);
    uiStore.toastError("Gagal menghapus PIC: " + (err.message || "Terjadi kesalahan sistem"));
  }
};

const openAddQuotaModal = (customer) => {
  if (!customer) return;
  quotaCustomer.value = customer;
  addQuotaAmount.value = null;
  showAddQuotaModal.value = true;
};

const quotaCustomerInfo = computed(() => {
  if (!quotaCustomer.value) return null;
  const current = ticketStore.customers.find((c) => String(c.id) === String(quotaCustomer.value.id)) || quotaCustomer.value;
  return ticketStore.getCustomerQuotaInfo(current);
});

const calculatedNewQuota = computed(() => {
  if (!quotaCustomer.value) return 0;
  const current = ticketStore.customers.find((c) => String(c.id) === String(quotaCustomer.value.id)) || quotaCustomer.value;
  const currentStr = String(current.ticketQuota || '').trim().toLowerCase();
  const amt = parseInt(addQuotaAmount.value, 10) || 0;
  if (!currentStr || currentStr === 'unlimited') {
    return amt > 0 ? amt : 'Unlimited';
  }
  const cur = parseInt(currentStr, 10) || 0;
  return cur + amt;
});

const calculatedNewRemaining = computed(() => {
  if (!quotaCustomer.value) return 0;
  const info = quotaCustomerInfo.value;
  if (!info || info.quota === 'Unlimited') return 'Unlimited';
  const amt = parseInt(addQuotaAmount.value, 10) || 0;
  return (info.remaining || 0) + amt;
});

const submitAddQuota = async () => {
  if (!quotaCustomer.value || isSubmittingQuota.value) return;
  const amt = parseInt(addQuotaAmount.value, 10);
  if (isNaN(amt) || amt <= 0) {
    uiStore.toastWarning("Silakan masukkan jumlah tambahan kuota minimal 1 tiket.");
    return;
  }

  isSubmittingQuota.value = true;
  try {
    const custId = quotaCustomer.value.id;
    const custName = quotaCustomer.value.name;

    await ticketStore.topUpCustomerQuota(
      custId,
      amt,
      "",
      authStore.currentUser
    );

    // Refresh customers from backend if available
    try {
      await ticketStore.fetchCustomers();
    } catch (e) {}

    const updated = ticketStore.customers.find((c) => String(c.id) === String(custId));
    if (updated) {
      quotaCustomer.value = updated;
    }

    showAddQuotaModal.value = false;
    uiStore.toastSuccess(`Berhasil menambahkan ${amt} tiket untuk mitra "${custName}"!`);
  } catch (err) {
    console.error("Gagal top-up kuota:", err);
    uiStore.toastError("Gagal menambahkan kuota: " + (err.message || "Terjadi kesalahan sistem"));
  } finally {
    isSubmittingQuota.value = false;
  }
};

const handleExportExcel = async () => {
  try {
    isExporting.value = true;
    const { default: ExcelJS } = await import("exceljs");
    const wb = new ExcelJS.Workbook();
    wb.creator = authStore.currentUser?.name || "GTT Helpdesk Ticketing";
    wb.created = new Date();

    const ws = wb.addWorksheet("Direktori Mitra", {
      views: [{ state: "frozen", ySplit: 4 }],
    });

    const HEADER_FILL = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E3A8A" },
    };
    const THIN = { style: "thin", color: { argb: "FFCBD5E1" } };
    const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };

    const columns = [
      { header: "NO", width: 6, align: "center" },
      { header: "ID MITRA", width: 12, align: "center" },
      { header: "NAMA PERUSAHAAN MITRA", width: 34, align: "left" },
      { header: "SEKTOR INDUSTRI", width: 22, align: "left" },
      { header: "PAKET KONTRAK SLA", width: 24, align: "center" },
      { header: "PERIODE MULAI", width: 15, align: "center" },
      { header: "PERIODE SELESAI", width: 16, align: "center" },
      { header: "SISA KUOTA TIKET", width: 18, align: "center" },
      { header: "STATUS OPERASIONAL", width: 20, align: "center" },
      { header: "KONTAK PIC TERDAFTAR", width: 42, align: "left", wrap: true },
      { header: "ALAMAT LENGKAP", width: 44, align: "left", wrap: true },
    ];

    // Title Row
    ws.mergeCells(1, 1, 1, columns.length);
    const titleCell = ws.getCell(1, 1);
    titleCell.value = "DIREKTORI PERUSAHAAN MITRA & MONITORING KUOTA TIKET";
    titleCell.font = { bold: true, size: 14, color: { argb: "FF1E3A8A" } };
    titleCell.alignment = { vertical: "middle", horizontal: "left" };
    ws.getRow(1).height = 24;

    // Subtitle Row
    ws.mergeCells(2, 1, 2, columns.length);
    const subCell = ws.getCell(2, 1);
    const todayFormatted = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    subCell.value = `PT Global Transformasi Teknologi  |  Tanggal Unduh: ${todayFormatted}  |  Total Data: ${filteredCustomers.value.length} Mitra Korporat`;
    subCell.font = { italic: true, size: 10, color: { argb: "FF475569" } };
    subCell.alignment = { vertical: "middle", horizontal: "left" };
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
      cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: col.align || "center",
        wrapText: true,
      };
      cell.border = BORDER;
      ws.getColumn(i + 1).width = col.width;
    });

    // Data Rows
    filteredCustomers.value.forEach((c, idx) => {
      const qInfo = getCustomerQuotaInfo(c);
      const isExpired = isCustomerMaintenanceExpired(c);
      let statusStr = "Active";
      if (c.isActive === false) {
        statusStr = isExpired ? "Expired (Selesai)" : "Nonaktif (Manual)";
      }

      const picsStr =
        c.pics && c.pics.length > 0
          ? c.pics
              .map((p) => {
                const parts = [];
                if (p.phone) parts.push(`HP: ${p.phone}`);
                if (p.email) parts.push(p.email);
                return `${p.name}${parts.length ? ` (${parts.join(" • ")})` : ""}`;
              })
              .join("; ")
          : "-";

      const rowData = [
        idx + 1,
        c.id,
        c.name,
        c.industry || "-",
        c.slaTier || "-",
        c.maintenanceStart || "-",
        c.maintenanceEnd || "-",
        c.ticketQuota || "Unlimited",
        statusStr,
        picsStr,
        c.address || "-",
      ];

      const row = ws.addRow(rowData);
      row.height = 24;

      row.eachCell({ includeEmpty: true }, (cell, ci) => {
        const colDef = columns[ci - 1] || {};
        cell.border = BORDER;
        cell.alignment = {
          vertical: "middle",
          horizontal: colDef.align || "left",
          wrapText: !!colDef.wrap,
        };
        cell.font = { size: 9.5 };

        // Zebra striping
        if (idx % 2 === 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
        }

        // Highlight status cell (Column 12: STATUS OPERASIONAL)
        if (ci === 12) {
          if (statusStr.includes("Active")) {
            cell.font = { bold: true, size: 9.5, color: { argb: "FF047857" } }; // emerald
          } else if (statusStr.includes("Expired")) {
            cell.font = { bold: true, size: 9.5, color: { argb: "FFE11D48" } }; // rose
          } else {
            cell.font = { bold: true, size: 9.5, color: { argb: "FF64748B" } }; // slate
          }
        }

        // Highlight quota remaining if critical (Column 10: SISA TIKET, Column 11: % SISA KUOTA)
        if ((ci === 10 || ci === 11) && qInfo.isCritical) {
          cell.font = { bold: true, size: 9.5, color: { argb: "FFE11D48" } };
        }
      });
    });

    if (filteredCustomers.value.length > 0) {
      ws.autoFilter = {
        from: { row: 4, column: 1 },
        to: { row: 4 + filteredCustomers.value.length, column: columns.length },
      };
    }

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    link.href = url;
    link.download = `Direktori_Mitra_Customer_Glotra_${dateStr}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    uiStore.toastSuccess("Direktori mitra berhasil diekspor ke Microsoft Excel.");
  } catch (err) {
    console.error("Gagal export Excel customer:", err);
    uiStore.toastError("Terjadi kesalahan saat memproses ekspor Excel.");
  } finally {
    isExporting.value = false;
  }
};

const handleQueryFocus = () => {
  const targetId = Number(route.query.focus);
  if (targetId) {
    focusedCustomerId.value = targetId;
    const cIndex = filteredCustomers.value.findIndex((c) => c.id === targetId);
    if (cIndex !== -1) {
      currentPage.value = Math.floor(cIndex / itemsPerPage.value) + 1;
    }
    setTimeout(() => {
      const el = document.getElementById("customer-row-" + targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);

    // Hilangkan highlight seleksi setelah 2.5 detik agar kembali seperti baris biasa
    setTimeout(() => {
      if (focusedCustomerId.value === targetId) {
        focusedCustomerId.value = null;
      }
      // Bersihkan param ?focus dari URL agar tidak terpilih terus menerus
      if (route.query.focus) {
        router.replace({ path: "/admin/customers" });
      }
    }, 2500);
  }
};

watch(() => route.query.focus, handleQueryFocus);

onMounted(async () => {
  await Promise.all([
    ticketStore.fetchCustomers(),
    ticketStore.fetchSlaPolicies(),
    fetchIndustrySectors()
  ]);
  ticketStore.checkAndSyncCustomerMaintenanceStatus();
  handleQueryFocus();
  window.addEventListener("scroll", handleWindowScroll, true);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleWindowScroll, true);
});
</script>
