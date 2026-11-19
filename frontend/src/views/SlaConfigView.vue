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

          placeholder="Cari nama, kode, atau deskripsi SLA..."

          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"

        />

      </div>



      <!-- Filter Status -->

      <div class="w-full md:w-48">

        <select

          v-model="filterStatus"

          class="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"

        >

          <option value="">Semua Status</option>

          <option value="Active">Active</option>

          <option value="Inactive">Inactive</option>

        </select>

      </div>



      <!-- Filter Operating Window -->

      <div class="w-full md:w-60">

        <select

          v-model="filterOperatingWindow"

          class="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"

        >

          <option value="">Semua Operating Window</option>

          <option value="24 Jam x 7 Hari">24 Jam x 7 Hari</option>

          <option value="Senin - Jumat">Senin - Jumat</option>

          <option value="Senin - Sabtu">Senin - Sabtu</option>

          <option value="Custom">Custom</option>

        </select>

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

          <thead>

            <tr class="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-600">

              <th class="py-3.5 px-4 w-12 text-center">No</th>

              <th class="py-3.5 px-4">Nama Kebijakan SLA</th>

              <th class="py-3.5 px-4 w-36">Kode</th>

              <th class="py-3.5 px-4">Operating Window</th>

              <th class="py-3.5 px-4 w-28 text-center">Status</th>

              <th class="py-3.5 px-4 text-center w-36">Aksi</th>

            </tr>

          </thead>

          <tbody class="divide-y divide-slate-100">

            <tr 

              v-for="(policy, index) in paginatedPolicies" 

              :key="policy.id"

              class="hover:bg-blue-50/25 transition-colors cursor-pointer"

              @click="openDetailModal(policy)"

            >

              <!-- No -->

              <td class="py-3.5 px-4 text-center font-mono text-slate-500">

                {{ (currentPage - 1) * itemsPerPage + index + 1 }}

              </td>



              <!-- Nama Kebijakan SLA -->

              <td class="py-3.5 px-4">

                <span class="font-bold text-slate-900 hover:text-blue-600 transition-colors">

                  {{ policy.tierName }}

                </span>

              </td>



              <!-- Kode -->

              <td class="py-3.5 px-4">

                <span class="font-mono text-[11px] text-slate-600 uppercase">

                  {{ policy.tierCode }}

                </span>

              </td>



              <!-- Operating Window -->

              <td class="py-3.5 px-4">

                <span class="text-slate-700">

                  {{ policy.operatingHours }}

                </span>

              </td>



              <!-- Status -->

              <td class="py-3.5 px-4">

                <span 

                  v-if="getPolicyStatus(policy) === 'Active'"

                  class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"

                >

                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>

                  <span>Active</span>

                </span>

                <span 

                  v-else

                  class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200"

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

                    class="p-1.5 text-slate-500 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"

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

                    class="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"

                  >

                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>

                    </svg>

                  </button>

                  <!-- Delete Button -->

                  <button

                    @click="confirmDelete(policy)"

                    title="Hapus Kebijakan SLA"

                    class="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"

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



          <!-- Right Card: Operating Window (5 cols) -->

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

          </div>

        </div>



        <!-- TAB CONTENT 2: Matriks SLA -->

        <div v-else-if="activeDetailTab === 'matriks'" class="space-y-4 pt-2">

          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">

            <table class="w-full text-left text-xs">

              <thead class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600">

                <tr>

                  <th class="py-2.5 px-4 w-44">Priority</th>

                  <th class="py-2.5 px-4 w-40">Batas Response</th>

                  <th class="py-2.5 px-4 w-40">Batas Resolusi</th>

                  <th class="py-2.5 px-4">Keterangan</th>

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

                  <td class="py-3 px-4 text-slate-600">{{ getPolicyMeta(selectedPolicy).p1Notes || 'Layanan kritikal produksi' }}</td>

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

                  <td class="py-3 px-4 text-slate-600">{{ getPolicyMeta(selectedPolicy).p2Notes || 'Gangguan mayor' }}</td>

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

                  <td class="py-3 px-4 text-slate-600">{{ getPolicyMeta(selectedPolicy).p3Notes || 'Service degradation' }}</td>

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

                  <td class="py-3 px-4 text-slate-600">{{ getPolicyMeta(selectedPolicy).p4Notes || 'Permintaan informasi / minor' }}</td>

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

      <div class="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-4 my-auto animate-in fade-in zoom-in-95 duration-150">

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

          <!-- Horizontal 2-Column Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <!-- Kolom Kiri: Informasi Kebijakan SLA (5 cols) -->
            <div class="lg:col-span-5 space-y-3">

            <div class="flex items-center space-x-2.5">

              <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>

              <h4 class="font-bold text-slate-900 text-sm">Informasi Kebijakan SLA</h4>

            </div>



            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- Nama Kebijakan SLA -->
              <div>

                <label class="block font-semibold text-slate-700 mb-1">Nama Kebijakan SLA *</label>

                <input 

                  v-model="formPolicy.tierName" 

                  required 

                  type="text" 

                  placeholder="Contoh: GOLD 24x7 Production Support" 

                  class="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

                />

              </div>

              <!-- Operating Window di samping Nama SLA -->
              <div>

                <label class="block font-semibold text-slate-700 mb-1">Operating Window *</label>

                <select 

                  v-model="formPolicy.operatingHours" 

                  class="w-full p-2.5 border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"

                >

                  <option value="24 Jam x 7 Hari (Non-Stop)">24 Jam x 7 Hari (Non-Stop)</option>

                  <option value="Senin - Jumat (08:00 - 17:00 WIB)">Senin - Jumat (08:00 - 17:00 WIB)</option>

                  <option value="Senin - Sabtu (07:00 - 18:00 WIB)">Senin - Sabtu (07:00 - 18:00 WIB)</option>

                  <option value="Senin - Jumat (07:30 - 16:30 WIB)">Senin - Jumat (07:30 - 16:30 WIB)</option>

                  <option value="custom">Custom...</option>

                </select>

                <!-- Input custom muncul jika pilih Custom -->
                <input
                  v-if="formPolicy.operatingHours === 'custom'"
                  v-model="formPolicy.customOperatingHours"
                  type="text"
                  placeholder="Contoh: Senin - Rabu (06:00 - 14:00 WIB)"
                  class="mt-2 w-full p-2.5 border border-blue-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                />

              </div>

              <!-- Deskripsi lebih panjang (span 2 kolom) -->
              <div class="col-span-1 md:col-span-2">

                <label class="block font-semibold text-slate-700 mb-1">Deskripsi</label>

                <textarea 

                  v-model="formPolicy.description" 

                  rows="3" 

                  placeholder="Deskripsi cakupan layanan, komitmen tingkat layanan, dan ketentuan SLA ini..." 

                  class="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"

                ></textarea>

              </div>

            </div>

            </div>

            <!-- Kolom Kanan: Matriks Batas Waktu SLA (7 cols) -->
            <div class="lg:col-span-7 space-y-3">

              <div class="flex items-center space-x-2.5">

                <span class="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>

                <h4 class="font-bold text-slate-900 text-sm">Matriks Batas Waktu SLA (dalam jam)</h4>

              </div>

            <div class="border border-slate-200 rounded-xl overflow-hidden shadow-xs">

              <table class="w-full text-left border-collapse">

                <thead>

                  <tr class="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600">

                    <th class="py-2.5 px-4 w-40">Priority</th>

                    <th class="py-2.5 px-4 w-36">Batas Response (jam)</th>

                    <th class="py-2.5 px-4 w-36">Batas Resolusi (jam)</th>

                    <th class="py-2.5 px-4">Keterangan (Opsional)</th>

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

                    <td class="py-2.5 px-4">

                      <input 

                        v-model="formPolicy.p1Notes" 

                        type="text" 

                        placeholder="Contoh: Layanan kritikal produksi" 

                        class="w-full p-2 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

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

                    <td class="py-2.5 px-4">

                      <input 

                        v-model="formPolicy.p2Notes" 

                        type="text" 

                        placeholder="Contoh: Gangguan mayor" 

                        class="w-full p-2 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

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

                    <td class="py-2.5 px-4">

                      <input 

                        v-model="formPolicy.p3Notes" 

                        type="text" 

                        placeholder="Contoh: Service degradation" 

                        class="w-full p-2 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

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

                    <td class="py-2.5 px-4">

                      <input 

                        v-model="formPolicy.p4Notes" 

                        type="text" 

                        placeholder="Contoh: Permintaan informasi / minor" 

                        class="w-full p-2 border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 

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



    <!-- Confirm Delete Modal -->

    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">

      <div class="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">

        <div class="flex items-start space-x-3">

          <div class="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">

            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>

            </svg>

          </div>

          <div>

            <h4 class="font-bold text-slate-900 text-sm">Hapus Kebijakan SLA?</h4>

            <p class="text-xs text-slate-500 mt-1">Kebijakan <strong>{{ policyToDelete?.tierName }}</strong> akan dihapus secara permanen dari database.</p>

          </div>

        </div>

        <div v-if="deleteError" class="bg-rose-50 border border-rose-200 rounded-lg p-2 text-xs text-rose-700">{{ deleteError }}</div>

        <div class="flex justify-end space-x-2">

          <button @click="showDeleteConfirm = false" class="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600">Batal</button>

          <button @click="doDelete" :disabled="isDeleting" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-xs font-bold rounded-lg flex items-center space-x-2">

            <span v-if="isDeleting" class="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

            <span>{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}</span>

          </button>

        </div>

      </div>

    </div>

  </div>

</template>



<script setup>

import { ref, computed, onMounted } from 'vue';

import { api } from '../services/api.js';

import { useTicketStore } from '../stores/ticketStore.js';

import { useAuthStore } from '../stores/authStore.js';

const ticketStore = useTicketStore();

const authStore = useAuthStore();



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



// Pagination

const currentPage = ref(1);

const itemsPerPage = 10;



const defaultForm = () => ({

  id: null,

  tierCode: '',

  tierName: '',

  description: '',

  status: 'Active',

  operatingHours: '24 Jam x 7 Hari (Non-Stop)',

  customOperatingHours: '',

  p1ResponseHours: 0.5,

  p1ResolutionHours: 4,

  p1Notes: '',

  p2ResponseHours: 1,

  p2ResolutionHours: 8,

  p2Notes: '',

  p3ResponseHours: 2,

  p3ResolutionHours: 24,

  p3Notes: '',

  p4ResponseHours: 4,

  p4ResolutionHours: 48,

  p4Notes: '',

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

  const meta = getPolicyMeta(policy);

  return meta.status || 'Active';

};



const getPolicyDescription = (policy) => {

  const meta = getPolicyMeta(policy);

  return meta.description || 'SLA untuk cakupan layanan operasional dan pemeliharaan sistem terpadu.';

};



const getPolicyCreator = (policy) => {

  const meta = getPolicyMeta(policy);

  if (!meta.createdBy || meta.createdBy === 'Ahmad Fauzi') {

    return authStore.currentUser?.name || 'Rina Agustina';

  }

  return meta.createdBy;

};



const getPolicyMitra = (policy) => {

  if (!policy) return [];

  const meta = getPolicyMeta(policy);

  if (meta.assignedCustomers && Array.isArray(meta.assignedCustomers)) {

    return meta.assignedCustomers;

  }

  return [];

};



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

    const meta = getPolicyMeta(p);

    const desc = (meta.description || '').toLowerCase();



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

      if (!w.toLowerCase().includes(filterOperatingWindow.value.toLowerCase())) {

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

    // Jika backend belum aktif atau error, gunakan store lokal (bersihkan dari mock)
    policies.value = filterClean(ticketStore.slaPolicies);

    customers.value = ticketStore.customers || [];

    ticketStore.setSlaPolicies(policies.value);

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

  // Jika nilai tidak ada di daftar opsi baku, perlakukan sebagai custom
  const standardOptions = [
    '24 Jam x 7 Hari (Non-Stop)',
    'Senin - Jumat (08:00 - 17:00 WIB)',
    'Senin - Sabtu (07:00 - 18:00 WIB)',
    'Senin - Jumat (07:30 - 16:30 WIB)',
  ];
  if (base.operatingHours && !standardOptions.includes(base.operatingHours)) {
    base.customOperatingHours = base.operatingHours;
    base.operatingHours = 'custom';
  }

  base.p1ResponseHours = policy.p1ResponseHours ?? 0.5;

  base.p1ResolutionHours = policy.p1ResolutionHours ?? 4;

  base.p2ResponseHours = policy.p2ResponseHours ?? 1;

  base.p2ResolutionHours = policy.p2ResolutionHours ?? 8;

  base.p3ResponseHours = policy.p3ResponseHours ?? 2;

  base.p3ResolutionHours = policy.p3ResolutionHours ?? 24;

  base.p4ResponseHours = policy.p4ResponseHours ?? 4;

  base.p4ResolutionHours = policy.p4ResolutionHours ?? 48;



  if (policy.notes) {

    try {

      if (typeof policy.notes === 'string' && policy.notes.trim().startsWith('{')) {

        const extra = JSON.parse(policy.notes);

        base.description = extra.description || '';

        base.status = extra.status || 'Active';

        base.p1Notes = extra.p1Notes || '';

        base.p2Notes = extra.p2Notes || '';

        base.p3Notes = extra.p3Notes || '';

        base.p4Notes = extra.p4Notes || '';

        base.responseStartCondition = extra.responseStartCondition || 'Ticket Created';

        base.resolutionEndCondition = extra.resolutionEndCondition || 'Ticket Resolved / Closed';

        if (extra.pauseConditions) {

          base.pauseConditions = { ...base.pauseConditions, ...extra.pauseConditions };

        }

        if (extra.warningThresholds) {

          base.warningThresholds = { ...base.warningThresholds, ...extra.warningThresholds };

        }

        if (extra.escalationRules) {

          base.escalationRules = { ...base.escalationRules, ...extra.escalationRules };

        }

      } else {

        base.description = policy.notes;

      }

    } catch {

      base.description = policy.notes;

    }

  }



  formPolicy.value = base;

  showModal.value = true;

};



const savePolicy = async () => {

  isSaving.value = true;

  saveError.value = null;

  try {

    const existingMeta = isEditing.value ? getPolicyMeta(policies.value.find(p => p.id === formPolicy.value.id)) : {};

    const notesPayload = JSON.stringify({

      description: formPolicy.value.description || '',

      status: 'Active',

      p1Notes: formPolicy.value.p1Notes || '',

      p2Notes: formPolicy.value.p2Notes || '',

      p3Notes: formPolicy.value.p3Notes || '',

      p4Notes: formPolicy.value.p4Notes || '',

      createdBy: isEditing.value 

        ? (existingMeta.createdBy && existingMeta.createdBy !== 'Ahmad Fauzi' ? existingMeta.createdBy : (authStore.currentUser?.name || 'Rina Agustina'))

        : (authStore.currentUser?.name || 'Rina Agustina')

    });



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
        ? (formPolicy.value.customOperatingHours || 'Custom')
        : formPolicy.value.operatingHours,

      p1ResponseHours: Number(formPolicy.value.p1ResponseHours),

      p1ResolutionHours: Number(formPolicy.value.p1ResolutionHours),

      p2ResponseHours: Number(formPolicy.value.p2ResponseHours),

      p2ResolutionHours: Number(formPolicy.value.p2ResolutionHours),

      p3ResponseHours: Number(formPolicy.value.p3ResponseHours),

      p3ResolutionHours: Number(formPolicy.value.p3ResolutionHours),

      p4ResponseHours: Number(formPolicy.value.p4ResponseHours),

      p4ResolutionHours: Number(formPolicy.value.p4ResolutionHours),

      notes: notesPayload

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

  } catch (err) {

    saveError.value = err.message || 'Gagal menyimpan kebijakan SLA.';

  } finally {

    isSaving.value = false;

  }

};



const togglePolicyStatus = async (policy) => {

  if (!policy) return;

  const currentMeta = getPolicyMeta(policy);

  const nextStatus = (currentMeta.status === 'Active') ? 'Inactive' : 'Active';

  currentMeta.status = nextStatus;



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

    notes: JSON.stringify(currentMeta)

  };



  try {

    const updated = await api.updateSlaPolicy(policy.id, payload);

    const idx = policies.value.findIndex(p => p.id === policy.id);

    if (idx !== -1) policies.value[idx] = updated;

    if (selectedPolicy.value && selectedPolicy.value.id === policy.id) {

      selectedPolicy.value = updated;

    }

    ticketStore.setSlaPolicies([...policies.value]);

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

  isDeleting.value = true;

  deleteError.value = null;

  try {

    try {

      await api.deleteSlaPolicy(policyToDelete.value.id);

    } catch {
      // Local delete jika offline
    }

    policies.value = policies.value.filter(p => p.id !== policyToDelete.value.id);

    ticketStore.setSlaPolicies([...policies.value]);

    showDeleteConfirm.value = false;

    policyToDelete.value = null;

    if (selectedPolicy.value && selectedPolicy.value.id === policyToDelete.value?.id) {

      showDetailModal.value = false;

    }

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

