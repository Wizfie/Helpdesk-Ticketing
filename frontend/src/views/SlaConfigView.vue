<template>

  <div class="space-y-6">

    <!-- Breadcrumb & Top Header Bar -->

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">

      <div>

        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">

          <span class="text-slate-400">SLA Policy</span>

          <span>/</span>

          <span class="text-slate-800">Daftar Kebijakan SLA</span>

        </div>

        <h1 class="text-2xl font-black text-slate-900 tracking-tight">

          Daftar Kebijakan SLA

        </h1>

        <p class="text-xs text-slate-500 mt-1">

          Kelola kebijakan SLA untuk digunakan pada kontrak customer.

        </p>

      </div>



      <div class="flex items-center space-x-3">

        <button

          @click="openAddPolicyModal"

          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-2"

        >

          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>

          </svg>

          <span>Tambah Kebijakan SLA</span>

        </button>

      </div>

    </div>



    <!-- 3 Summary Metric KPI Cards -->

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <!-- Card 1: Total Kebijakan SLA -->

      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">

        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>

          </svg>

        </div>

        <div>

          <span class="text-2xl font-black text-slate-900 leading-none block font-mono">{{ policies.length }}</span>

          <span class="text-xs text-slate-500 font-medium mt-1 block">Total Kebijakan SLA</span>

        </div>

      </div>



      <!-- Card 2: Active -->

      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">

        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">

          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>

          </svg>

        </div>

        <div>

          <span class="text-2xl font-black text-slate-900 leading-none block font-mono">{{ activeCount }}</span>

          <span class="text-xs text-emerald-600 font-bold mt-1 block">Active</span>

        </div>

      </div>



      <!-- Card 3: Inactive -->

      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center space-x-3.5">

        <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">

          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>

          </svg>

        </div>

        <div>

          <span class="text-2xl font-black text-slate-900 leading-none block font-mono">{{ inactiveCount }}</span>

          <span class="text-xs text-slate-500 font-medium mt-1 block">Inactive</span>

        </div>

      </div>

    </div>



    <!-- Search & Filter Controls -->

    <div class="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">

      <!-- Search Input -->

      <div class="relative flex-1">

        <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">

          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>

        </svg>

        <input

          v-model="searchQuery"

          type="text"

          placeholder="Cari nama atau deskripsi SLA..."

          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"

        />

      </div>



      <!-- Filter Status -->
      <div class="w-full md:w-48">
        <BaseSelect
          v-model="filterStatus"
          :options="filterStatusOptions"
          size="sm"
          placeholder="Semua Status"
        />
      </div>

      <!-- Filter Operating Window -->
      <div class="w-full md:w-64">
        <BaseSelect
          v-model="filterOperatingWindow"
          :options="filterOperatingWindowOptions"
          size="sm"
          placement="right"
          placeholder="Semua Operating Window"
        />
      </div>

    </div>



    <!-- Loading State -->

    <div v-if="isLoading" class="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">

      <div class="inline-block w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>

      <p class="text-xs text-slate-500">Memuat kebijakan SLA dari database...</p>

    </div>



    <!-- Error State -->

    <div v-else-if="loadError" class="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-xs text-rose-700 flex items-start space-x-2 shadow-xs">

      <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>

      </svg>

      <span>{{ loadError }}</span>

    </div>



    <!-- SLA Policies Table Card -->

    <div v-else class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">

      <!-- Empty state -->

      <div v-if="filteredPolicies.length === 0" class="p-12 text-center">

        <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">

          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>

        </svg>

        <p class="text-sm font-bold text-slate-600">Tidak ada kebijakan SLA yang sesuai</p>

        <p class="text-xs text-slate-400 mt-1">Coba sesuaikan pencarian atau filter yang dipilih.</p>

      </div>



      <div v-else class="overflow-x-auto">

        <table class="w-full text-left text-xs border-collapse">

          <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">

            <tr class="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">

              <th class="py-3.5 px-4 w-12 text-center">No</th>

              <th class="py-3.5 px-4">Nama Kebijakan SLA</th>

              <th class="py-3.5 px-4">Operating Window</th>

              <th class="py-3.5 px-4 w-28 text-center">Status</th>

              <th class="py-3.5 px-4 text-center w-36">Aksi</th>

            </tr>

          </thead>

          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/40">

            <tr 

              v-for="(policy, index) in paginatedPolicies" 

              :key="policy.id"

              class="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"

              @click="openDetailModal(policy)"

            >

              <!-- No -->

              <td class="py-3.5 px-4 text-center font-mono text-slate-500 dark:text-slate-400">

                {{ (currentPage - 1) * itemsPerPage + index + 1 }}

              </td>



              <!-- Nama Kebijakan SLA -->

              <td class="py-3.5 px-4">

                <span class="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">

                  {{ policy.tierName }}

                </span>

              </td>



              <!-- Operating Window -->

              <td class="py-3.5 px-4">

                <span class="text-slate-700 dark:text-slate-300">

                  {{ policy.operatingHours }}

                </span>

              </td>



              <!-- Status -->

              <td class="py-3.5 px-4">

                <span 

                  v-if="getPolicyStatus(policy) === 'Active'"

                  class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-600/60"

                >

                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>

                  <span>Active</span>

                </span>

                <span 

                  v-else

                  class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-600/60"

                >

                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>

                  <span>Inactive</span>

                </span>

              </td>



              <!-- Aksi -->

              <td class="py-3.5 px-4 text-center" @click.stop>

                <div class="flex items-center justify-center space-x-1.5">

                  <!-- Detail Button -->

                  <button

                    @click="openDetailModal(policy)"

                    title="Lihat Detail"

                    class="p-1.5 text-slate-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-300 rounded-lg transition-colors cursor-pointer"

                  >

                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>

                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>

                    </svg>

                  </button>

                  <!-- Edit Button -->

                  <button

                    @click="editPolicy(policy)"

                    title="Edit Kebijakan SLA"

                    class="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:text-blue-300 dark:hover:bg-blue-900/80 rounded-lg transition-colors cursor-pointer"

                  >

                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>

                    </svg>

                  </button>

                  <!-- Delete Button -->

                  <button

                    @click="confirmDelete(policy)"

                    title="Hapus Kebijakan SLA"

                    class="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300 dark:hover:bg-rose-900/80 rounded-lg transition-colors cursor-pointer"

                  >

                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>

                    </svg>

                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>



      <!-- Pagination Footer -->
      <div class="px-5 py-3.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Menampilkan <span class="font-bold text-slate-800">{{ paginationStart }}</span> - 
          <span class="font-bold text-slate-800">{{ paginationEnd }}</span> dari 
          <span class="font-bold text-slate-800">{{ filteredPolicies.length }}</span> kebijakan SLA
        </div>

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



    <!-- MODAL 1: Detail Kebijakan SLA (Refactored matching Screenshot 1) -->

    <div 

      v-if="showDetailModal && selectedPolicy" 

      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"

    >

      <div class="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">

        <!-- Header -->

        <div class="flex items-center justify-between border-b border-slate-100 pb-3">

          <h3 class="font-bold text-slate-900 text-base">Detail Kebijakan SLA</h3>

          <button @click="showDetailModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>

        </div>



        <!-- Policy Banner Card -->

        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">

          <div class="space-y-1">

            <div class="flex items-center space-x-2">

              <span 

                v-if="getPolicyStatus(selectedPolicy) === 'Active'"

                class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-200"

              >

                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>

                <span>Active</span>

              </span>

              <span 

                v-else

                class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100/70 text-rose-800 border border-rose-200"

              >

                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>

                <span>Inactive</span>

              </span>

            </div>

            <h2 class="text-xl font-black text-slate-900 tracking-tight">{{ selectedPolicy.tierName }}</h2>

            <p class="text-xs text-slate-600 pt-1 leading-relaxed max-w-xl">

              {{ getPolicyDescription(selectedPolicy) }}

            </p>

          </div>



          <!-- Top Right Action Buttons -->

          <div class="flex items-center space-x-2 shrink-0 self-start">

            <button

              @click="openEditFromDetail(selectedPolicy)"

              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"

            >

              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>

              </svg>

              <span>Edit</span>

            </button>

            <button

              @click="togglePolicyStatus(selectedPolicy)"

              class="px-4 py-2 border font-bold text-xs rounded-xl transition-colors"

              :class="getPolicyStatus(selectedPolicy) === 'Active' 

                ? 'border-rose-200 bg-rose-50/70 text-rose-600 hover:bg-rose-100' 

                : 'border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100'"

            >

              {{ getPolicyStatus(selectedPolicy) === 'Active' ? 'Nonaktifkan' : 'Aktifkan' }}

            </button>

          </div>

        </div>



        <!-- Horizontal Tabs -->

        <div class="border-b border-slate-200 flex space-x-6 text-xs font-semibold overflow-x-auto">

          <button 

            @click="activeDetailTab = 'umum'"

            class="pb-2.5 transition-colors shrink-0"

            :class="activeDetailTab === 'umum' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'"

          >

            Informasi Kebijakan SLA

          </button>

          <button 

            @click="activeDetailTab = 'matriks'"

            class="pb-2.5 transition-colors shrink-0"

            :class="activeDetailTab === 'matriks' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'"

          >

            Matriks Batas Waktu SLA

          </button>

        </div>



        <!-- TAB CONTENT 1: Informasi Kebijakan SLA -->

        <div v-if="activeDetailTab === 'umum'" class="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">

          <!-- Left Details (7 cols) -->

          <div class="md:col-span-7 space-y-3 text-xs">

            <div class="grid grid-cols-3 gap-2 py-1">

              <span class="text-slate-500 font-medium">Nama Kebijakan</span>

              <span class="col-span-2 text-slate-800 font-bold">: {{ selectedPolicy.tierName }}</span>

            </div>

            <div class="grid grid-cols-3 gap-2 py-1">

              <span class="text-slate-500 font-medium">Deskripsi</span>

              <span class="col-span-2 text-slate-700 leading-relaxed">: {{ getPolicyDescription(selectedPolicy) }}</span>

            </div>

            <div class="grid grid-cols-3 gap-2 py-1 items-center">

              <span class="text-slate-500 font-medium">Status</span>

              <div class="col-span-2 flex items-center space-x-1">

                <span>:</span>

                <span 

                  class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold"

                  :class="getPolicyStatus(selectedPolicy) === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'"

                >

                  <span class="w-1.5 h-1.5 rounded-full" :class="getPolicyStatus(selectedPolicy) === 'Active' ? 'bg-emerald-600' : 'bg-rose-500'"></span>

                  <span>{{ getPolicyStatus(selectedPolicy) }}</span>

                </span>

              </div>

            </div>

            <div class="grid grid-cols-3 gap-2 py-1">

              <span class="text-slate-500 font-medium">Dibuat Oleh</span>

              <span class="col-span-2 text-slate-800 font-semibold">: {{ getPolicyCreator(selectedPolicy) }}</span>

            </div>

            <div class="grid grid-cols-3 gap-2 py-1">

              <span class="text-slate-500 font-medium">Tanggal Dibuat</span>

              <span class="col-span-2 text-slate-800 font-mono">: {{ formatDateTime(selectedPolicy.createdAt) }}</span>

            </div>

            <div class="grid grid-cols-3 gap-2 py-1">

              <span class="text-slate-500 font-medium">Terakhir Diperbarui</span>

              <span class="col-span-2 text-slate-800 font-mono">: {{ formatDateTime(selectedPolicy.updatedAt) }}</span>

            </div>

          </div>



          <!-- Right Card: Operating Window & Assigned Customers (5 cols) -->

          <div class="md:col-span-5 space-y-4">

            <!-- Operating Window Card -->

            <div class="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2">

              <div class="flex items-center space-x-2 text-blue-700">

                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>

                </svg>

                <span class="font-bold text-xs text-slate-800">Operating Window</span>

              </div>

              <div class="text-sm font-black text-slate-900 font-sans pl-7">

                {{ selectedPolicy.operatingHours }}

              </div>

            </div>

            <!-- Assigned Customers Card -->

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">

              <div class="flex items-center justify-between text-slate-700">

                <div class="flex items-center space-x-2">

                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>

                  </svg>

                  <span class="font-bold text-xs text-slate-800">Pelanggan Terikat</span>

                </div>

                <span class="text-[11px] font-bold px-2 py-0.5 rounded-full" :class="getPolicyMitra(selectedPolicy).length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'">

                  {{ getPolicyMitra(selectedPolicy).length }} Mitra

                </span>

              </div>

              <div v-if="getPolicyMitra(selectedPolicy).length > 0" class="flex flex-wrap gap-1.5 pt-1">

                <span 

                  v-for="cName in getPolicyMitra(selectedPolicy)" 

                  :key="cName" 

                  class="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"

                >

                  {{ cName }}

                </span>

              </div>

              <p v-else class="text-xs text-slate-400 italic pt-1">

                Belum ada mitra pelanggan yang terikat ke kebijakan SLA ini.

              </p>

            </div>

          </div>

        </div>



        <!-- TAB CONTENT 2: Matriks SLA -->

        <div v-else-if="activeDetailTab === 'matriks'" class="space-y-4 pt-2">

          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">

            <table class="w-full text-left text-xs">

              <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">

                <tr>

                  <th class="py-2.5 px-4 w-44">Priority</th>

                  <th class="py-2.5 px-4">Batas Response</th>

                  <th class="py-2.5 px-4">Batas Resolusi</th>

                </tr>

              </thead>

              <tbody class="divide-y divide-slate-100">

                <tr>

                  <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="#ef4444"><circle cx="6" cy="6" r="6"/></svg>
                    <span class="font-bold text-rose-600 font-mono text-[11px]">P1 — CRITICAL</span>
                  </div>
                </td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p1ResponseHours }} Jam</td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p1ResolutionHours }} Jam</td>

                </tr>

                <tr>

                  <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="#f59e0b"><circle cx="6" cy="6" r="6"/></svg>
                    <span class="font-bold text-amber-600 font-mono text-[11px]">P2 — MAJOR</span>
                  </div>
                </td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p2ResponseHours }} Jam</td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p2ResolutionHours }} Jam</td>

                </tr>

                <tr>

                  <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="#3b82f6"><circle cx="6" cy="6" r="6"/></svg>
                    <span class="font-bold text-blue-600 font-mono text-[11px]">P3 — MEDIUM</span>
                  </div>
                </td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p3ResponseHours }} Jam</td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p3ResolutionHours }} Jam</td>

                </tr>

                <tr>

                  <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none" stroke="#94a3b8" stroke-width="1.5"><circle cx="6" cy="6" r="4.5"/></svg>
                    <span class="font-bold text-slate-500 font-mono text-[11px]">P4 — LOW</span>
                  </div>
                </td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p4ResponseHours }} Jam</td>

                  <td class="py-3 px-4 font-mono font-bold">{{ selectedPolicy.p4ResolutionHours }} Jam</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>







        <!-- Footer -->

        <div class="flex justify-end pt-4 border-t border-slate-100">

          <button 

            type="button" 

            @click="showDetailModal = false" 

            class="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"

          >

            Tutup

          </button>

        </div>

      </div>

    </div>



    <!-- MODAL 2: Form Edit / Tambah Kebijakan SLA (From docs/FORM_SLA.png) -->

    <div 

      v-if="showModal" 

      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"

    >

      <div class="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">

        <!-- Header -->

        <div class="flex items-center justify-between border-b border-slate-100 pb-3">

          <div>
            <h3 class="font-bold text-slate-900 text-base">

              {{ isEditing ? 'Edit Parameter Kebijakan SLA' : 'Tambah Kebijakan SLA Baru' }}

            </h3>
            <p class="text-[11px] text-slate-500 mt-0.5">
              Konfigurasi jam operasional dan batas waktu respon serta resolusi insiden secara horizontal.
            </p>
          </div>

          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none cursor-pointer">&times;</button>

        </div>



        <form @submit.prevent="savePolicy" class="space-y-4 text-xs">

          <!-- Horizontal 2-Column Grid (Balanced 6-6 Split without Overlap) -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            <!-- Kolom Kiri: Informasi Kebijakan SLA (6 cols) -->
            <div class="lg:col-span-6 space-y-4">

              <div class="flex items-center space-x-2.5 border-b border-slate-100 pb-2">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <h4 class="font-bold text-slate-900 text-sm">Informasi Kebijakan SLA</h4>
              </div>

              <div class="space-y-3.5">

              <!-- Nama Kebijakan SLA -->
              <div>
                <label class="block font-semibold text-slate-700 text-sm mb-1">Nama Kebijakan SLA *</label>
                <input 
                  v-model="formPolicy.tierName" 
                  required 
                  type="text" 
                  placeholder="Contoh: GOLD 24x7 Production Support" 
                  class="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm min-h-[42px]" 
                />
              </div>

              <!-- Operating Window -->
              <div>
                <BaseSelect
                  v-model="formPolicy.operatingHours"
                  :options="operatingWindowOptions"
                  label="Operating Window"
                  required
                  placeholder="Pilih operating window..."
                  menu-width-class="w-full"
                />

                <!-- Form Standar Pengisian Custom Operating Window -->
                <div
                  v-if="formPolicy.operatingHours === 'custom'"
                  class="mt-3 p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3 shadow-2xs"
                >
                  <div class="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-blue-100 pb-2">
                    <span class="flex items-center gap-1.5">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Pengaturan Jadwal Kerja Baku
                    </span>
                    <span class="text-[10px] text-blue-700 font-mono font-semibold bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs">Zona Waktu: WIB</span>
                  </div>

                  <!-- Baris 1: Rentang Hari -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Rentang Hari Operasional</label>
                    <div class="grid grid-cols-2 gap-3 items-center">
                      <div>
                        <span class="block text-[11px] text-slate-500 mb-1">Dari Hari</span>
                        <select
                          v-model="customSchedule.startDay"
                          class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                        >
                          <option v-for="d in daysList" :key="'s-' + d" :value="d">{{ d }}</option>
                        </select>
                      </div>
                      <div>
                        <span class="block text-[11px] text-slate-500 mb-1">Sampai Hari</span>
                        <select
                          v-model="customSchedule.endDay"
                          class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                        >
                          <option v-for="d in daysList" :key="'e-' + d" :value="d">{{ d }}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Baris 2: Rentang Jam Kerja -->
                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1.5">Jam Kerja Harian</label>
                    <div class="grid grid-cols-2 gap-3 items-center">
                      <div>
                        <span class="block text-[11px] text-slate-500 mb-1">Jam Mulai</span>
                        <input
                          v-model="customSchedule.startTime"
                          type="time"
                          required
                          class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <span class="block text-[11px] text-slate-500 mb-1">Jam Selesai</span>
                        <input
                          v-model="customSchedule.endTime"
                          type="time"
                          required
                          class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Format Baku yang Dihasilkan -->
                  <div class="pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
                    <span class="text-slate-500 font-medium">Format Tersimpan:</span>
                    <span class="font-bold text-blue-700 font-mono text-xs bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                      {{ computedCustomOperatingHours }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="block font-semibold text-slate-700 text-sm mb-1">Deskripsi</label>
                <textarea 
                  v-model="formPolicy.description" 
                  rows="3" 
                  placeholder="Deskripsi cakupan layanan, komitmen tingkat layanan, dan ketentuan SLA ini..." 
                  class="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                ></textarea>
              </div>

            </div>

            </div>

            <!-- Kolom Kanan: Matriks Batas Waktu SLA (6 cols) -->
            <div class="lg:col-span-6 space-y-4">

              <div class="flex items-center space-x-2.5 border-b border-slate-100 pb-2">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <h4 class="font-bold text-slate-900 text-sm">Matriks Batas Waktu SLA (dalam jam)</h4>
              </div>

            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">

              <table class="w-full text-left border-collapse">

                <thead>

                  <tr class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">

                    <th class="py-2.5 px-4 w-40">Priority</th>

                    <th class="py-2.5 px-4">Batas Response (jam)</th>

                    <th class="py-2.5 px-4">Batas Resolusi (jam)</th>

                  </tr>

                </thead>

                <tbody class="divide-y divide-slate-100 text-xs">

                  <!-- P1 -->

                  <tr class="hover:bg-slate-50/40">

                    <td class="py-2.5 px-4">

                      <div class="flex items-center space-x-2">

                        <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>

                        <span class="font-bold text-rose-600 font-mono text-[11px]">P1 — CRITICAL</span>

                      </div>

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p1ResponseHours" 

                        required 

                        type="number" 

                        min="0.1" 

                        step="0.1" 

                        placeholder="0.5" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p1ResolutionHours" 

                        required 

                        type="number" 

                        min="0.5" 

                        step="0.5" 

                        placeholder="4" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                  </tr>



                  <!-- P2 -->

                  <tr class="hover:bg-slate-50/40">

                    <td class="py-2.5 px-4">

                      <div class="flex items-center space-x-2">

                        <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>

                        <span class="font-bold text-amber-600 font-mono text-[11px]">P2 — MAJOR</span>

                      </div>

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p2ResponseHours" 

                        required 

                        type="number" 

                        min="0.1" 

                        step="0.1" 

                        placeholder="1" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p2ResolutionHours" 

                        required 

                        type="number" 

                        min="0.5" 

                        step="0.5" 

                        placeholder="8" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                  </tr>



                  <!-- P3 -->

                  <tr class="hover:bg-slate-50/40">

                    <td class="py-2.5 px-4">

                      <div class="flex items-center space-x-2">

                        <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>

                        <span class="font-bold text-blue-600 font-mono text-[11px]">P3 — MEDIUM</span>

                      </div>

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p3ResponseHours" 

                        required 

                        type="number" 

                        min="0.1" 

                        step="0.1" 

                        placeholder="2" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p3ResolutionHours" 

                        required 

                        type="number" 

                        min="0.5" 

                        step="0.5" 

                        placeholder="24" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                  </tr>



                  <!-- P4 -->

                  <tr class="hover:bg-slate-50/40">

                    <td class="py-2.5 px-4">

                      <div class="flex items-center space-x-2">

                        <span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span>

                        <span class="font-bold text-slate-500 font-mono text-[11px]">P4 — LOW</span>

                      </div>

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p4ResponseHours" 

                        required 

                        type="number" 

                        min="0.1" 

                        step="0.1" 

                        placeholder="4" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                    <td class="py-2.5 px-4">

                      <input 

                        v-model.number="formPolicy.p4ResolutionHours" 

                        required 

                        type="number" 

                        min="0.5" 

                        step="0.5" 

                        placeholder="48" 

                        class="w-full p-2 border border-slate-200 rounded-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                      />

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            </div>

          </div>

          <!-- Error Message -->

          <div v-if="saveError" class="bg-rose-50 border border-rose-200 rounded-xl p-3 text-rose-700 font-medium">

            {{ saveError }}

          </div>



          <!-- Footer Buttons -->

          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">

            <button 

              type="button" 

              @click="showModal = false" 

              class="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors"

            >

              Batal

            </button>

            <button 

              type="submit" 

              :disabled="isSaving" 

              class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-2"

            >

              <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

              <span>{{ isSaving ? 'Menyimpan...' : 'Simpan SLA' }}</span>

            </button>

          </div>

        </form>

      </div>

    </div>



    <!-- Confirm Delete Modal (Restrict Guard) -->

    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">

      <div class="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">

        <!-- Case 1: SLA Sedang Digunakan oleh Customer (Penghapusan Ditolak) -->

        <div v-if="customersUsingPolicyToDelete.length > 0" class="space-y-4">

          <div class="flex items-start space-x-3">

            <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">

              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>

              </svg>

            </div>

            <div>

              <h4 class="font-bold text-slate-900 text-sm">Kebijakan SLA Sedang Digunakan</h4>

              <p class="text-xs text-slate-600 mt-1">

                Kebijakan <strong>{{ policyToDelete?.tierName }}</strong> tidak dapat dihapus karena masih aktif digunakan oleh <strong>{{ customersUsingPolicyToDelete.length }} mitra pelanggan</strong>:

              </p>

            </div>

          </div>



          <!-- List of Attached Customers -->

          <div class="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 space-y-2">

            <span class="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">Daftar Pelanggan Terikat:</span>

            <div class="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">

              <span 

                v-for="c in customersUsingPolicyToDelete" 

                :key="c.id"

                class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-amber-300 text-amber-950 shadow-2xs"

              >

                {{ c.name }}

              </span>

            </div>

            <p class="text-[11px] text-amber-800 pt-1 leading-normal flex items-start gap-1.5">

              <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>

              </svg>

              <em>Sesuai aturan integritas data, silakan alihkan paket kontrak pelanggan di menu <strong>Enterprise Accounts</strong> sebelum menghapus kebijakan ini.</em>

            </p>

          </div>



          <div v-if="deleteError" class="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-700">{{ deleteError }}</div>



          <div class="flex justify-end space-x-2 pt-1">

            <button @click="showDeleteConfirm = false" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs">

              Mengerti & Tutup

            </button>

          </div>

        </div>



        <!-- Case 2: SLA Tidak Digunakan oleh Siapapun (Aman Dihapus) -->

        <div v-else class="space-y-4">

          <div class="flex items-start space-x-3">

            <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">

              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>

              </svg>

            </div>

            <div>

              <h4 class="font-bold text-slate-900 text-sm">Hapus Kebijakan SLA?</h4>

              <p class="text-xs text-slate-500 mt-1">

                Kebijakan <strong>{{ policyToDelete?.tierName }}</strong> akan dihapus secara permanen dari database.

              </p>

              <p class="text-[11px] text-emerald-600 font-semibold mt-1">

                ✓ Aman: Tidak ada mitra pelanggan yang menggunakan kebijakan ini.

              </p>

            </div>

          </div>



          <div v-if="deleteError" class="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-700">{{ deleteError }}</div>



          <div class="flex justify-end space-x-2 pt-1">

            <button @click="showDeleteConfirm = false" class="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-600 font-semibold transition-colors">

              Batal

            </button>

            <button @click="doDelete" :disabled="isDeleting" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-colors shadow-xs">

              <span v-if="isDeleting" class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

              <span>{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</span>

            </button>

          </div>

        </div>



      </div>

    </div>

  </div>

</template>



<script setup>

import { ref, reactive, computed, onMounted } from 'vue';
import { api } from '../services/api.js';
import { useTicketStore } from '../stores/ticketStore.js';
import { useAuthStore } from '../stores/authStore.js';
import { useUiStore } from '../stores/uiStore.js';

const ticketStore = useTicketStore();
const authStore = useAuthStore();
const uiStore = useUiStore();



const showModal = ref(false);

const showDetailModal = ref(false);

const selectedPolicy = ref(null);

const activeDetailTab = ref('umum');

const openMenuId = ref(null);



const isEditing = ref(false);

const isLoading = ref(false);

const isSaving = ref(false);

const isDeleting = ref(false);

const loadError = ref(null);

const saveError = ref(null);

const deleteError = ref(null);

const showDeleteConfirm = ref(false);

const policyToDelete = ref(null);



const policies = ref([]);

const customers = ref([]);



// Filter & Search states
const searchQuery = ref('');
const filterStatus = ref('');
const filterOperatingWindow = ref('');

// Dropdown options
const filterStatusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'Active', label: 'Active', badge: 'Aktif', badgeClass: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200' },
  { value: 'Inactive', label: 'Inactive', badge: 'Non-aktif', badgeClass: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500' }
];

const filterOperatingWindowOptions = [
  { value: '', label: 'Semua Operating Window' },
  { value: '24 Jam x 7 Hari', label: '24 Jam x 7 Hari (Non-Stop)', subtext: 'Operasional 24 jam nonstop (24/7)' },
  { value: 'Custom', label: 'Jadwal Khusus (Custom)', subtext: 'Jadwal yang dikonfigurasi manual' }
];

const operatingWindowOptions = [
  { value: '24 Jam x 7 Hari (Non-Stop)', label: '24 Jam x 7 Hari (Non-Stop)', subtext: 'Layanan operasional tanpa henti 24 jam x 7 hari' },
  { value: 'custom', label: 'Custom (Tentukan Jadwal Baku)...', subtext: 'Tambah jadwal operasional khusus secara manual' }
];

// Opsi Hari & Jadwal Kustom Terstandarisasi
const daysList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const customSchedule = reactive({
  startDay: 'Senin',
  endDay: 'Jumat',
  startTime: '08:00',
  endTime: '17:00'
});

const computedCustomOperatingHours = computed(() => {
  return `${customSchedule.startDay} - ${customSchedule.endDay} (${customSchedule.startTime} - ${customSchedule.endTime} WIB)`;
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const defaultForm = () => ({
  id: null,
  tierName: '',
  description: '',
  status: 'Active',
  operatingHours: '24 Jam x 7 Hari (Non-Stop)',

  customOperatingHours: '',

  p1ResponseHours: 0.5,

  p1ResolutionHours: 4,

  p2ResponseHours: 1,

  p2ResolutionHours: 8,

  p3ResponseHours: 2,

  p3ResolutionHours: 24,

  p4ResponseHours: 4,

  p4ResolutionHours: 48,

  responseStartCondition: 'Ticket Created',

  resolutionEndCondition: 'Ticket Resolved / Closed',

  pauseConditions: {

    waitingCustomer: true,

    waitingVendor: true,

    waitingSparePart: true,

    waitingSiteAccess: true,

    other: false,

    otherText: ''

  },

  warningThresholds: {

    pct50: true,

    pct75: true,

    pct90: true

  },

  escalationRules: {

    level1: 'Engineer',

    level2: 'Team Lead',

    level3: 'Management / Principal'

  }

});



const formPolicy = ref(defaultForm());



// Helper to parse policy JSON notes

const getPolicyMeta = (policy) => {

  if (!policy || !policy.notes) return {};

  if (typeof policy.notes === 'string' && policy.notes.trim().startsWith('{')) {

    try {

      return JSON.parse(policy.notes);

    } catch {

      return { description: policy.notes };

    }

  }

  return { description: policy.notes };

};



const getPolicyStatus = (policy) => {
  if (!policy) return 'Active';
  if (policy.isActive !== undefined && policy.isActive !== null) {
    return policy.isActive ? 'Active' : 'Inactive';
  }
  const meta = getPolicyMeta(policy);
  return meta.status || 'Active';
};

const getPolicyDescription = (policy) => {
  if (!policy || !policy.notes) return '-';
  if (typeof policy.notes === 'string' && policy.notes.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(policy.notes);
      return parsed.description || '-';
    } catch {
      return policy.notes;
    }
  }
  return policy.notes;
};



const getPolicyCreator = (policy) => {
  const meta = getPolicyMeta(policy);
  return meta.createdBy || authStore.currentUser?.name || 'Ahmad Fauzi';
};



const getCustomersUsingPolicy = (policy) => {
  if (!policy || !policy.tierName) return [];
  const tierName = policy.tierName.trim().toUpperCase();
  return (customers.value || []).filter(c => {
    if (!c.slaTier) return false;
    const cTier = c.slaTier.trim().toUpperCase();
    return cTier === tierName || cTier.includes(tierName) || tierName.includes(cTier);
  });
};

const getPolicyMitra = (policy) => {
  if (!policy) return [];
  return getCustomersUsingPolicy(policy).map(c => c.name);
};

const customersUsingPolicyToDelete = computed(() => {
  return getCustomersUsingPolicy(policyToDelete.value);
});



// Summary KPI counts

const activeCount = computed(() => {

  return policies.value.filter(p => getPolicyStatus(p) === 'Active').length;

});



const inactiveCount = computed(() => {

  return policies.value.filter(p => getPolicyStatus(p) === 'Inactive').length;

});







// Filtered & Paginated list

const filteredPolicies = computed(() => {

  return policies.value.filter(p => {

    const q = searchQuery.value.trim().toLowerCase();

    const status = getPolicyStatus(p);
    const desc = (getPolicyDescription(p) || '').toLowerCase();



    // Match Search

    if (q) {

      const matchName = p.tierName?.toLowerCase().includes(q);

      const matchCode = p.tierCode?.toLowerCase().includes(q);

      const matchDesc = desc.includes(q);

      if (!matchName && !matchCode && !matchDesc) return false;

    }



    // Match Status Filter

    if (filterStatus.value && status !== filterStatus.value) {

      return false;

    }



    // Match Operating Window Filter

    if (filterOperatingWindow.value) {
      const w = p.operatingHours || '';
      if (filterOperatingWindow.value === '24 Jam x 7 Hari') {
        if (!w.includes('24 Jam x 7 Hari')) return false;
      } else if (filterOperatingWindow.value === 'Custom') {
        if (w.includes('24 Jam x 7 Hari')) return false;
      } else if (!w.toLowerCase().includes(filterOperatingWindow.value.toLowerCase())) {
        return false;
      }
    }



    return true;

  });

});



const totalPages = computed(() => {

  return Math.ceil(filteredPolicies.value.length / itemsPerPage) || 1;

});



const paginatedPolicies = computed(() => {

  const start = (currentPage.value - 1) * itemsPerPage;

  return filteredPolicies.value.slice(start, start + itemsPerPage);

});



const paginationStart = computed(() => {

  if (filteredPolicies.value.length === 0) return 0;

  return (currentPage.value - 1) * itemsPerPage + 1;

});



const paginationEnd = computed(() => {
  const end = currentPage.value * itemsPerPage;
  return Math.min(end, filteredPolicies.value.length);
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



const formatDateTime = (dateStr) => {

  if (!dateStr) return '-';

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) return dateStr;

  const day = d.getDate();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const month = months[d.getMonth()];

  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, '0');

  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;

};



const MOCK_CODES = ['PLATINUM_24X7', 'GOLD_8X5', 'GOV_TIER1', 'SILVER_8X5'];
const filterClean = (list) => (list || []).filter(p => p && !MOCK_CODES.includes(p.tierCode) && !(p.id >= 1 && p.id <= 4));

async function loadData() {

  isLoading.value = true;

  loadError.value = null;

  try {

    const [pols, custs] = await Promise.all([

      api.getSlaPolicies(),

      api.getCustomers().catch(() => [])

    ]);

    policies.value = filterClean(pols);

    customers.value = custs || [];

    ticketStore.setSlaPolicies(policies.value);

  } catch (err) {

    console.warn('[SlaConfigView] Gagal mengambil data live dari backend:', err.message);

    loadError.value = err.message || 'Gagal memuat data dari database.';

    policies.value = [];

    customers.value = [];

    ticketStore.setSlaPolicies([]);

  } finally {

    isLoading.value = false;

  }

}



const toggleActionMenu = (id) => {

  openMenuId.value = openMenuId.value === id ? null : id;

};



// Modal Details

const openDetailModal = (policy) => {

  selectedPolicy.value = policy;

  activeDetailTab.value = 'umum';

  showDetailModal.value = true;

};



const openEditFromDetail = (policy) => {

  showDetailModal.value = false;

  editPolicy(policy);

};



const openAddPolicyModal = () => {

  isEditing.value = false;

  saveError.value = null;

  formPolicy.value = defaultForm();

  customSchedule.startDay = 'Senin';
  customSchedule.endDay = 'Jumat';
  customSchedule.startTime = '08:00';
  customSchedule.endTime = '17:00';

  showModal.value = true;

};



const editPolicy = (policy) => {

  isEditing.value = true;

  saveError.value = null;

  const base = defaultForm();

  base.id = policy.id;

  base.tierCode = policy.tierCode;

  base.tierName = policy.tierName;

  base.operatingHours = policy.operatingHours || '24 Jam x 7 Hari (Non-Stop)';

  // Jika nilai bukan 24/7 (Non-Stop), perlakukan sebagai custom
  if (base.operatingHours && base.operatingHours !== '24 Jam x 7 Hari (Non-Stop)') {
    const raw = base.operatingHours;
    base.customOperatingHours = raw;
    base.operatingHours = 'custom';
    const m = raw.match(/([a-zA-Z]+)\s*-\s*([a-zA-Z]+)\s*\(([\d]{1,2}:[\d]{2})\s*-\s*([\d]{1,2}:[\d]{2})/i);
    if (m) {
      customSchedule.startDay = daysList.find(d => d.toLowerCase() === m[1].toLowerCase()) || 'Senin';
      customSchedule.endDay = daysList.find(d => d.toLowerCase() === m[2].toLowerCase()) || 'Jumat';
      customSchedule.startTime = m[3];
      customSchedule.endTime = m[4];
    } else {
      customSchedule.startDay = 'Senin';
      customSchedule.endDay = 'Jumat';
      customSchedule.startTime = '08:00';
      customSchedule.endTime = '17:00';
    }
  }

  base.p1ResponseHours = policy.p1ResponseHours ?? 0.5;

  base.p1ResolutionHours = policy.p1ResolutionHours ?? 4;

  base.p2ResponseHours = policy.p2ResponseHours ?? 1;

  base.p2ResolutionHours = policy.p2ResolutionHours ?? 8;

  base.p3ResponseHours = policy.p3ResponseHours ?? 2;

  base.p3ResolutionHours = policy.p3ResolutionHours ?? 24;

  base.p4ResponseHours = policy.p4ResponseHours ?? 4;

  base.p4ResolutionHours = policy.p4ResolutionHours ?? 48;



  const desc = getPolicyDescription(policy);
  base.description = desc === '-' ? '' : desc;
  base.status = getPolicyStatus(policy);



  formPolicy.value = base;

  showModal.value = true;

};



const savePolicy = async () => {

  isSaving.value = true;

  saveError.value = null;

  try {

    // Auto-generate tierCode jika kosong (misal saat tambah baru)
    let finalTierCode = formPolicy.value.tierCode;
    if (!finalTierCode || !finalTierCode.trim()) {
      finalTierCode = formPolicy.value.tierName
        ? formPolicy.value.tierName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30)
        : `SLA_${Date.now()}`;
    }

    const payload = {
      tierCode: finalTierCode,
      tierName: formPolicy.value.tierName,
      operatingHours: formPolicy.value.operatingHours === 'custom'
        ? computedCustomOperatingHours.value
        : formPolicy.value.operatingHours,
      p1ResponseHours: Number(formPolicy.value.p1ResponseHours),
      p1ResolutionHours: Number(formPolicy.value.p1ResolutionHours),
      p2ResponseHours: Number(formPolicy.value.p2ResponseHours),
      p2ResolutionHours: Number(formPolicy.value.p2ResolutionHours),
      p3ResponseHours: Number(formPolicy.value.p3ResponseHours),
      p3ResolutionHours: Number(formPolicy.value.p3ResolutionHours),
      p4ResponseHours: Number(formPolicy.value.p4ResponseHours),
      p4ResolutionHours: Number(formPolicy.value.p4ResolutionHours),
      notes: formPolicy.value.description ? formPolicy.value.description.trim() : null,
      isActive: formPolicy.value.status ? formPolicy.value.status === 'Active' : true
    };



    if (isEditing.value) {

      let updated;
      try {
        updated = await api.updateSlaPolicy(formPolicy.value.id, payload);
      } catch {
        updated = {
          ...payload,
          id: formPolicy.value.id,
          updatedAt: new Date().toISOString()
        };
      }

      const idx = policies.value.findIndex(p => p.id === formPolicy.value.id);

      if (idx !== -1) policies.value[idx] = updated;

      if (selectedPolicy.value && selectedPolicy.value.id === formPolicy.value.id) {

        selectedPolicy.value = updated;

      }

      ticketStore.setSlaPolicies([...policies.value]);

    } else {

      let created;
      try {
        created = await api.createSlaPolicy(payload);
      } catch {
        created = {
          ...payload,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }

      policies.value.push(created);

      ticketStore.setSlaPolicies([...policies.value]);

    }

    showModal.value = false;
    uiStore.toastSuccess(`Kebijakan SLA "${formPolicy.value.tierName}" berhasil disimpan!`);

  } catch (err) {

    saveError.value = err.message || 'Gagal menyimpan kebijakan SLA.';

  } finally {

    isSaving.value = false;

  }

};



const togglePolicyStatus = async (policy) => {
  if (!policy) return;

  const currentStatus = getPolicyStatus(policy);
  const nextStatus = (currentStatus === 'Active') ? 'Inactive' : 'Active';
  const nextIsActive = nextStatus === 'Active';
  const desc = getPolicyDescription(policy);

  const payload = {
    tierCode: policy.tierCode,
    tierName: policy.tierName,
    operatingHours: policy.operatingHours,
    p1ResponseHours: policy.p1ResponseHours,
    p1ResolutionHours: policy.p1ResolutionHours,
    p2ResponseHours: policy.p2ResponseHours,
    p2ResolutionHours: policy.p2ResolutionHours,
    p3ResponseHours: policy.p3ResponseHours,
    p3ResolutionHours: policy.p3ResolutionHours,
    p4ResponseHours: policy.p4ResponseHours,
    p4ResolutionHours: policy.p4ResolutionHours,
    notes: (desc && desc !== '-') ? desc : null,
    isActive: nextIsActive
  };



  try {

    const updated = await api.updateSlaPolicy(policy.id, payload);

    const idx = policies.value.findIndex(p => p.id === policy.id);

    if (idx !== -1) policies.value[idx] = updated;

    if (selectedPolicy.value && selectedPolicy.value.id === policy.id) {

      selectedPolicy.value = updated;

    }

    ticketStore.setSlaPolicies([...policies.value]);
    uiStore.toastSuccess(`Status kebijakan SLA "${policy.tierName}" berhasil diubah menjadi ${nextStatus}.`);

  } catch (err) {

    console.error('Gagal memperbarui status SLA:', err);

  }

};



const confirmDelete = (policy) => {

  policyToDelete.value = policy;

  deleteError.value = null;

  showDeleteConfirm.value = true;

};



const doDelete = async () => {
  if (customersUsingPolicyToDelete.value.length > 0) {
    deleteError.value = `Kebijakan SLA "${policyToDelete.value?.tierName}" masih digunakan oleh ${customersUsingPolicyToDelete.value.length} pelanggan.`;
    return;
  }

  isDeleting.value = true;
  deleteError.value = null;

  try {
    await api.deleteSlaPolicy(policyToDelete.value.id);

    policies.value = policies.value.filter(p => p.id !== policyToDelete.value.id);
    ticketStore.setSlaPolicies([...policies.value]);

    const deletedName = policyToDelete.value?.tierName || 'Kebijakan SLA';
    showDeleteConfirm.value = false;
    policyToDelete.value = null;

    if (selectedPolicy.value && selectedPolicy.value.id === policyToDelete.value?.id) {
      showDetailModal.value = false;
    }

    uiStore.toastSuccess(`Kebijakan SLA "${deletedName}" berhasil dihapus.`);
  } catch (err) {
    deleteError.value = err.message || 'Gagal menghapus kebijakan SLA.';
  } finally {
    isDeleting.value = false;
  }
};



onMounted(() => {

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('gtt_sla_policies_data');
    localStorage.removeItem('helpdesk_sla_policies');
  }

  loadData();

  // Close menu on outside click

  window.addEventListener('click', () => {

    openMenuId.value = null;

  });

});

</script>

