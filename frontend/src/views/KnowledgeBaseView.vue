<template>
  <div class="space-y-4 pb-12 animate-in fade-in duration-200">
    <!-- Top Bar / Breadcrumb & Status Telemetry -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
      <div class="flex items-center space-x-2 text-xs text-slate-500 font-mono">
        <span class="text-blue-600 font-bold">GTT</span>
        <span>&gt;</span>
        <span class="text-slate-800 font-semibold">Knowledge Base</span>
        <span>&gt;</span>
        <span class="text-slate-500">Repositori Dokumen</span>
      </div>
      <div class="flex items-center space-x-3 text-xs">
        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Repositori Dokumen Aktif
        </span>
      </div>
    </div>

    <!-- Alert Banner when document was recently uploaded -->
    <div 
      v-if="createdAlertMessage" 
      class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div class="flex items-center space-x-2.5">
        <div class="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
          ✓
        </div>
        <div>
          <strong class="font-bold text-emerald-950">Dokumen Berhasil Diunggah:</strong>
          <span class="text-emerald-800 ml-1.5">{{ createdAlertMessage }}</span>
        </div>
      </div>
      <button 
        @click="createdAlertMessage = ''" 
        class="text-emerald-700 hover:text-emerald-900 font-bold px-1.5 py-0.5 text-xs rounded hover:bg-emerald-100 cursor-pointer"
      >
        &times;
      </button>
    </div>

    <!-- Header Banner (Compact & Crisp) -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="text-[9px] font-mono font-bold tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded uppercase border border-blue-200/60">
            DOCUMENT REPOSITORY • SOP &amp; RUNBOOK
          </span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Knowledge Base &amp; SOP Dokumen
        </h1>
        <p class="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Repositori berkas panduan teknis operasional, SOP penanganan, dan runbook.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
        <!-- Download Official Template DOCX Button -->
        <a
          href="/templates/GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
          download="GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
          class="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          title="Unduh template resmi .docx"
        >
          <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Unduh Template (.docx)</span>
        </a>

        <!-- Upload Dokumen Baru Button -> Leads to KnowledgeProposeView -->
        <router-link
          to="/knowledge-base/propose"
          class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>+ Upload Dokumen Baru</span>
        </router-link>
      </div>
    </div>

    <!-- 3 Proportional Executive KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <!-- Card 1: Total Dokumen -->
      <div class="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Dokumen</span>
          <div class="flex items-baseline space-x-1.5 mt-0.5">
            <span class="text-2xl font-black text-slate-900 font-mono">{{ totalDocsCount }}</span>
            <span class="text-[11px] text-slate-400">berkas</span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
      </div>

      <!-- Card 2: Kategori Terdata -->
      <div class="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Terdata</span>
          <div class="flex items-baseline space-x-1.5 mt-0.5">
            <span class="text-2xl font-black text-emerald-700 font-mono">{{ categoriesCount }}</span>
            <span class="text-[11px] text-emerald-600 font-medium">kategori</span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
          </svg>
        </div>
      </div>

      <!-- Card 3: Terkait Tiket Kasus -->
      <div class="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rujukan Tiket</span>
          <div class="flex items-baseline space-x-1.5 mt-0.5">
            <span class="text-2xl font-black text-indigo-700 font-mono">{{ linkedTicketsCount }}</span>
            <span class="text-[11px] text-indigo-600 font-medium">terhubung</span>
          </div>
        </div>
        <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- UNIFIED MAIN CARD: Integrated Filter Toolbar + Document Repository + Pagination -->
    <div class="bg-white border border-slate-200 rounded-2xl shadow-xs">
      <!-- 1. Sleek Proportional Filter Toolbar -->
      <div class="p-3 bg-slate-50/70 border-b border-slate-200 rounded-t-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs relative z-20">
        <!-- Left Side: Search Bar & Core Filters -->
        <div class="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <!-- Search Input -->
          <div class="relative w-56 sm:w-64 lg:w-72 shrink-0">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari judul, produk, kode KB, file..."
              class="w-full pl-8 pr-7 h-[34px] bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
            />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>

          <!-- Kategori Dropdown (With live document count) -->
          <div class="w-44 shrink-0">
            <BaseSelect
              v-model="selectedCategory"
              :options="categoryFilterOptions"
              size="sm"
              searchable
              placeholder="Semua Kategori"
              rounded="rounded-lg"
              inputClass="h-[34px]"
            />
          </div>

          <!-- Filter Tipe Case -->
          <div class="w-36 shrink-0">
            <BaseSelect
              v-model="selectedCaseType"
              :options="caseTypeFilterOptions"
              size="sm"
              placeholder="Semua Tipe"
              rounded="rounded-lg"
              inputClass="h-[34px]"
            />
          </div>

          <!-- Reset Filter Button -->
          <button
            v-if="hasActiveFilters"
            @click="resetFilters"
            class="h-[34px] px-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1 shrink-0 bg-white shadow-2xs"
            title="Reset semua filter"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Reset</span>
          </button>
        </div>

        <!-- Right Side: Sort & View Mode Switcher -->
        <div class="flex items-center space-x-2 shrink-0">
          <!-- Sort Dropdown -->
          <div class="w-36 shrink-0">
            <BaseSelect
              v-model="sortBy"
              :options="sortOptions"
              size="sm"
              placement="right"
              placeholder="Urutan"
              rounded="rounded-lg"
              inputClass="h-[34px]"
            />
          </div>

          <!-- Toggle View Mode: Table vs Grid -->
          <div class="flex items-center p-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg h-[34px] shrink-0">
            <button
              @click="viewMode = 'table'"
              class="h-[28px] px-2.5 rounded-md transition-all cursor-pointer flex items-center space-x-1.5"
              :class="viewMode === 'table' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold border border-slate-200/80 dark:border-slate-700' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium hover:bg-slate-200/60 dark:hover:bg-slate-800/60'"
              title="Tampilan Tabel"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              <span class="text-[11px] hidden xl:inline">Tabel</span>
            </button>
            <button
              @click="viewMode = 'grid'"
              class="h-[28px] px-2.5 rounded-md transition-all cursor-pointer flex items-center space-x-1.5"
              :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-bold border border-slate-200/80 dark:border-slate-700' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium hover:bg-slate-200/60 dark:hover:bg-slate-800/60'"
              title="Tampilan Grid"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              <span class="text-[11px] hidden xl:inline">Grid</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Content Body: Table View vs Grid View -->
      <div v-if="paginatedRunbooks.length > 0">
        <!-- MODE A: Table View (Default, Space-efficient) -->
        <div v-if="viewMode === 'table'" class="overflow-x-auto relative z-10">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50/60 border-b border-slate-200 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
                <th class="py-2.5 px-4 min-w-[320px]">Dokumen &amp; Berkas</th>
                <th class="py-2.5 px-3 min-w-[150px]">Kategori &amp; Tipe</th>
                <th class="py-2.5 px-3 min-w-[150px]">Produk / Platform</th>
                <th class="py-2.5 px-3 min-w-[130px]">Rujukan Kasus</th>
                <th class="py-2.5 px-3 min-w-[140px]">Pengunggah</th>
                <th class="py-2.5 px-4 text-right min-w-[140px]">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="item in paginatedRunbooks"
                :key="item.id"
                class="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                @click="openRunbookDetail(item)"
              >
                <!-- Dokumen & Berkas -->
                <td class="py-3 px-4">
                  <div class="flex items-start space-x-2.5">
                    <!-- File Format Icon Badge -->
                    <div
                      class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[9px] shrink-0 border mt-0.5"
                      :class="isDocx(item) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                    >
                      {{ isDocx(item) ? 'DOCX' : 'PDF' }}
                    </div>

                    <div class="min-w-0 space-y-0.5">
                      <div class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-xs leading-snug line-clamp-1">
                        {{ item.title }}
                      </div>
                      <div class="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono flex-wrap">
                        <span class="text-blue-700 font-bold bg-blue-50 px-1 py-0.2 rounded border border-blue-200/60">
                          {{ item.kbCode || `KB-${item.id}` }}
                        </span>
                        <span>•</span>
                        <span class="truncate max-w-[180px]" :title="item.documentName || item.uploadedDocName">
                          {{ item.documentName || item.uploadedDocName || 'Dokumen Terlampir' }}
                        </span>
                        <span v-if="item.documentSize || item.uploadedDocSize" class="text-slate-400">
                          ({{ item.documentSize || item.uploadedDocSize }})
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Kategori & Tipe -->
                <td class="py-3 px-3">
                  <div class="space-y-1">
                    <span class="text-slate-800 font-medium block text-xs truncate max-w-[140px]">
                      {{ item.category || 'General' }}
                    </span>
                    <span 
                      v-if="item.caseType" 
                      class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border inline-block"
                      :class="getCaseTypeBadgeClass(item.caseType)"
                    >
                      {{ item.caseType }}
                    </span>
                  </div>
                </td>

                <!-- Produk / Platform -->
                <td class="py-3 px-3">
                  <div class="text-slate-700 font-medium text-xs truncate max-w-[140px]" :title="item.product">
                    {{ item.product || '-' }}
                  </div>
                </td>

                <!-- Rujukan Kasus -->
                <td class="py-3 px-3">
                  <div class="space-y-0.5">
                    <span 
                      v-if="item.sourceTicket" 
                      class="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block"
                    >
                      {{ item.sourceTicket }}
                    </span>
                    <span v-else class="text-slate-400 text-xs block">-</span>
                    
                    <div v-if="item.ticketsReferencedCount" class="text-[10px] text-slate-400 font-mono">
                      {{ item.ticketsReferencedCount }}x dirujuk
                    </div>
                  </div>
                </td>

                <!-- Pengunggah & Tanggal -->
                <td class="py-3 px-3">
                  <div class="space-y-0.5">
                    <span class="font-medium text-slate-800 block truncate max-w-[130px]">
                      {{ item.author || 'Support Engineer' }}
                    </span>
                    <span class="text-[10px] text-slate-400 block font-mono">
                      {{ formatDate(item.updatedAt || item.createdAt) }}
                    </span>
                  </div>
                </td>

                <!-- Aksi -->
                <td class="py-3 px-4 text-right" @click.stop>
                  <div class="flex items-center justify-end space-x-1.5">
                    <!-- Quick Download Button -->
                    <button
                      @click="downloadRunbookFile(item)"
                      class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                      title="Unduh Dokumen"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </button>

                    <!-- View Detail Button -->
                    <button
                      @click="openRunbookDetail(item)"
                      class="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                      title="Lihat Detail Metadata"
                    >
                      Detail
                    </button>

                    <!-- Delete Button (Admin Only) -->
                    <button
                      v-if="authStore.isAdmin"
                      @click="handleDeleteRunbook(item)"
                      class="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Dokumen (Admin)"
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

        <!-- MODE B: Grid View (Padded inside container) -->
        <div v-else class="p-4 bg-slate-50/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div
            v-for="item in paginatedRunbooks"
            :key="item.id"
            @click="openRunbookDetail(item)"
            class="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <!-- Card Top: Format & Badges -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                  {{ item.kbCode || `KB-${item.id}` }}
                </span>

                <!-- Format Badge -->
                <span 
                  class="text-[9px] font-bold px-1.5 py-0.5 rounded border"
                  :class="isDocx(item) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                >
                  {{ isDocx(item) ? 'DOCX' : 'PDF' }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                {{ item.title }}
              </h3>

              <!-- Metadata Chips -->
              <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span class="font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  {{ item.category || 'General' }}
                </span>
                <span 
                  v-if="item.caseType"
                  class="font-mono font-bold px-1.5 py-0.5 rounded uppercase border"
                  :class="getCaseTypeBadgeClass(item.caseType)"
                >
                  {{ item.caseType }}
                </span>
                <span v-if="item.product" class="font-medium text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                  {{ item.product }}
                </span>
              </div>
            </div>

            <!-- Attached File Box with Direct Download -->
            <div class="space-y-2.5 pt-1">
              <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-xs" @click.stop>
                <div class="flex items-center space-x-2 min-w-0">
                  <svg class="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <div class="min-w-0">
                    <span class="font-semibold text-slate-800 truncate block text-xs" :title="item.documentName || item.uploadedDocName">
                      {{ item.documentName || item.uploadedDocName || 'Dokumen Runbook' }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono">
                      {{ item.documentSize || item.uploadedDocSize || 'Terlampir' }}
                    </span>
                  </div>
                </div>

                <button
                  @click="downloadRunbookFile(item)"
                  class="px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 font-bold rounded-md text-[11px] flex items-center space-x-1 shrink-0 transition-all shadow-2xs cursor-pointer"
                  title="Unduh Berkas"
                >
                  <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>Unduh</span>
                </button>
              </div>

              <!-- Card Footer: Author & Reference -->
              <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span class="truncate max-w-[140px]">
                  By: {{ item.author || 'Support Engineer' }}
                </span>
                <span class="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform text-xs">
                  Detail &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Integrated Pagination Footer -->
        <div class="px-4 py-3 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <strong class="text-slate-800">{{ filteredRunbooks.length ? (currentPage - 1) * pageSize + 1 : 0 }}</strong> - 
            <strong class="text-slate-800">{{ Math.min(currentPage * pageSize, filteredRunbooks.length) }}</strong> dari 
            <strong class="text-slate-800">{{ filteredRunbooks.length }}</strong> dokumen
          </div>

          <div class="flex items-center space-x-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage <= 1"
              class="px-2.5 py-1 text-xs border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors shadow-2xs"
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
              class="px-2.5 py-1 text-xs border border-slate-200 bg-white rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors shadow-2xs"
            >
              Next <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State inside container -->
      <div v-else class="p-10 text-center space-y-3">
        <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div class="font-bold text-slate-800 text-sm">
          {{ (ticketStore.knowledgeBase || []).length === 0 ? 'Belum Ada Dokumen Knowledge Base' : 'Tidak Ditemukan Dokumen yang Cocok' }}
        </div>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          {{ (ticketStore.knowledgeBase || []).length === 0 
            ? 'Repositori berkas Knowledge Base saat ini masih kosong. Unggah berkas SOP teknis baru untuk mendokumentasikan prosedur tim.' 
            : 'Coba ubah kata kunci pencarian, filter kategori, atau klik reset filter.' }}
        </p>
        <div class="pt-1">
          <router-link
            v-if="(ticketStore.knowledgeBase || []).length === 0"
            to="/knowledge-base/propose"
            class="inline-flex items-center px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            + Upload Dokumen Baru
          </router-link>
          <button
            v-else
            @click="resetFilters"
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Runbook Detail Modal (Document Viewer & Downloader) -->
    <div v-if="selectedRunbook" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-3">
          <div class="space-y-1">
           
            <h2 class="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {{ selectedRunbook.title }}
            </h2>
          </div>

          <button
            @click="selectedRunbook = null"
            class="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <!-- Modal Body: Supporting Information & Document Card -->
        <div class="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 font-sans">
          <!-- 1. Supporting Information Grid -->
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">i</span>
              <span>Informasi Metadata Dokumen</span>
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-200/80">
              <div>
                <span class="text-slate-400 text-[10px] block font-medium">Tipe Case</span>
                <strong class="text-blue-700 uppercase font-mono">{{ selectedRunbook.caseType || 'Incident' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block font-medium">Kategori</span>
                <strong class="text-slate-800 block truncate">{{ selectedRunbook.category || 'General' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block font-medium">Produk / Platform</span>
                <strong class="text-slate-800 block truncate">{{ selectedRunbook.product || '-' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block font-medium">Rujukan Tiket Kasus</span>
                <strong v-if="selectedRunbook.sourceTicket" class="text-blue-700 font-mono block truncate">
                  {{ selectedRunbook.sourceTicket }}
                </strong>
                <span v-else class="text-slate-400 block">-</span>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block font-medium">Pengunggah / Author</span>
                <strong class="text-slate-800 block truncate">{{ selectedRunbook.author || 'Support Engineer' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block font-medium">Tanggal Diperbarui</span>
                <strong class="text-slate-800 block font-mono">{{ formatDate(selectedRunbook.updatedAt || selectedRunbook.createdAt) }}</strong>
              </div>
            </div>
          </div>

          <!-- 2. Attached Document Hero Box -->
          <div class="p-4 border-2 border-slate-200 rounded-2xl bg-white space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">&#10003;</span>
                <span>Berkas Fisik SOP / Runbook</span>
              </h4>
              <span class="text-[11px] text-slate-400 font-mono">
                Format: {{ isDocx(selectedRunbook) ? 'Microsoft Word (.docx)' : 'Dokumen PDF (.pdf)' }}
              </span>
            </div>

            <!-- File Item Card -->
            <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
              <div class="flex items-center space-x-3 min-w-0">
                <div
                  class="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border"
                  :class="isDocx(selectedRunbook) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                >
                  {{ isDocx(selectedRunbook) ? 'DOCX' : 'PDF' }}
                </div>
                <div class="min-w-0">
                  <p class="font-bold text-xs sm:text-sm text-slate-900 truncate" :title="selectedRunbook.documentName || selectedRunbook.uploadedDocName">
                    {{ selectedRunbook.documentName || selectedRunbook.uploadedDocName || 'Dokumen_SOP.docx' }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {{ selectedRunbook.documentSize || selectedRunbook.uploadedDocSize || 'Ukuran Terlampir' }}
                  </p>
                </div>
              </div>

              <!-- Download Button -->
              <button
                @click="downloadRunbookFile(selectedRunbook)"
                class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shrink-0 shadow-xs transition-all cursor-pointer"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span>Unduh Dokumen</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <!-- Left: Admin Delete Button -->
          <div>
            <button
              v-if="authStore.isAdmin"
              @click="handleDeleteRunbook(selectedRunbook)"
              class="px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Hapus Dokumen
            </button>
          </div>

          <!-- Right: Close Button -->
          <div class="flex items-center space-x-2">
            <button
              @click="selectedRunbook = null"
              class="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { useUiStore } from '../stores/uiStore';
import { api } from '../services/api';

const route = useRoute();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();

const searchQuery = ref('');
const selectedCategory = ref('ALL');
const selectedCaseType = ref('ALL');
const sortBy = ref('latest');
const viewMode = ref('table'); // 'table' or 'grid'

const currentPage = ref(1);
const pageSize = 10;

const selectedRunbook = ref(null);
const createdAlertMessage = ref('');

onMounted(async () => {
  await ticketStore.fetchKnowledgeBase();
  if (route.query.created) {
    const createdId = Number(route.query.created);
    const found = ticketStore.knowledgeBase.find(k => k.id === createdId);
    if (found) {
      selectedRunbook.value = found;
      createdAlertMessage.value = `Dokumen "${found.title}" telah didaftarkan dengan kode ${found.kbCode || `KB-${found.id}`}.`;
    }
  }
});

// Category Filter Options with live counts for BaseSelect
const categoryFilterOptions = computed(() => {
  const options = [
    { value: 'ALL', label: `Semua Kategori (${(ticketStore.knowledgeBase || []).length})` }
  ];
  const catMap = new Map();
  (ticketStore.knowledgeBase || []).forEach(k => {
    const c = (k.category || '').trim();
    if (c) {
      catMap.set(c, (catMap.get(c) || 0) + 1);
    }
  });
  for (const [name, count] of catMap.entries()) {
    options.push({ value: name, label: `${name} (${count})` });
  }
  return options;
});

// Case Type Options for BaseSelect
const caseTypeFilterOptions = [
  { value: 'ALL', label: 'Semua Tipe' },
  { value: 'Incident', label: 'Incident' },
  { value: 'Request', label: 'Request' },
  { value: 'Problem', label: 'Problem' },
  { value: 'Change', label: 'Change' }
];

// Sort Options for BaseSelect
const sortOptions = [
  { value: 'latest', label: 'Terbaru' },
  { value: 'mostReferenced', label: 'Paling Dirujuk' },
  { value: 'titleAsc', label: 'Judul (A-Z)' }
];

// Summary KPI counts
const totalDocsCount = computed(() => (ticketStore.knowledgeBase || []).length);

const categoriesCount = computed(() => {
  const cats = new Set();
  (ticketStore.knowledgeBase || []).forEach(k => {
    if (k.category && k.category.trim()) cats.add(k.category.trim().toLowerCase());
  });
  return cats.size;
});

const linkedTicketsCount = computed(() => {
  return (ticketStore.knowledgeBase || []).filter(k => Boolean(k.sourceTicket) || (k.ticketsReferencedCount > 0)).length;
});

// Has active filters
const hasActiveFilters = computed(() => {
  return Boolean(
    searchQuery.value ||
    selectedCategory.value !== 'ALL' ||
    selectedCaseType.value !== 'ALL' ||
    sortBy.value !== 'latest'
  );
});

// Reset all filters
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'ALL';
  selectedCaseType.value = 'ALL';
  sortBy.value = 'latest';
  currentPage.value = 1;
};

// Filtered Knowledge Base items
const filteredRunbooks = computed(() => {
  return (ticketStore.knowledgeBase || []).filter(item => {
    // 1. Category filter
    if (selectedCategory.value !== 'ALL') {
      const itemCat = (item.category || '').trim().toLowerCase();
      if (itemCat !== selectedCategory.value.toLowerCase()) return false;
    }

    // 2. Case Type filter
    if (selectedCaseType.value !== 'ALL') {
      if ((item.caseType || '').toLowerCase() !== selectedCaseType.value.toLowerCase()) return false;
    }

    // 3. Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchCode = (item.kbCode || '').toLowerCase().includes(q);
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchCategory = (item.category || '').toLowerCase().includes(q);
      const matchProduct = (item.product || '').toLowerCase().includes(q);
      const matchCaseType = (item.caseType || '').toLowerCase().includes(q);
      const matchDocName = (item.documentName || item.uploadedDocName || '').toLowerCase().includes(q);
      const matchSourceTicket = (item.sourceTicket || '').toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchCategory && !matchProduct && !matchCaseType && !matchDocName && !matchSourceTicket) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (sortBy.value === 'mostReferenced') {
      return (b.ticketsReferencedCount || 0) - (a.ticketsReferencedCount || 0);
    }
    if (sortBy.value === 'titleAsc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    // Default: latest
    const dateA = new Date(a.updatedAt || a.createdAt || 0);
    const dateB = new Date(b.updatedAt || b.createdAt || 0);
    return dateB - dateA;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredRunbooks.value.length / pageSize) || 1;
});

const paginatedRunbooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredRunbooks.value.slice(start, start + pageSize);
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

const openRunbookDetail = (item) => {
  selectedRunbook.value = item;
};

const isDocx = (item) => {
  const name = item?.documentName || item?.uploadedDocName || item?.pdfAttachmentUrl || '';
  return /\.(docx|doc)$/i.test(name);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return String(dateStr);
  }
};

const getCaseTypeBadgeClass = (caseType) => {
  switch ((caseType || '').toLowerCase()) {
    case 'incident':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'request':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'problem':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'change':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const downloadRunbookFile = (item) => {
  if (!item) return;
  if (item.id && (item.pdfAttachmentUrl || item.documentName)) {
    const url = api.getDownloadDocUrl(item.id);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.documentName || `${item.kbCode || 'KB'}_SOP`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    uiStore.toastSuccess(`Mengunduh berkas ${item.documentName || item.title}...`);
  } else {
    downloadFallbackDoc(item);
  }
};

const previewRunbookDoc = (item) => {
  if (!item) return;
  if (item.id && item.pdfAttachmentUrl) {
    const url = api.getDownloadDocUrl(item.id);
    window.open(url, '_blank');
  } else {
    downloadRunbookFile(item);
  }
};

const handleDeleteRunbook = async (item) => {
  if (!item) return;
  const confirmed = await uiStore.confirm(
    `Apakah Anda yakin ingin menghapus dokumen Knowledge Base "${item.title}" (${item.kbCode || 'KB'})? Tindakan ini tidak dapat dibatalkan.`,
    {
      title: 'Hapus Dokumen Knowledge Base',
      confirmText: 'Ya, Hapus Dokumen',
      cancelText: 'Batal',
      type: 'danger'
    }
  );
  if (!confirmed) return;

  try {
    await ticketStore.deleteKnowledgeBase(item.id);
    uiStore.toastSuccess(`Dokumen ${item.kbCode || 'KB'} berhasil dihapus.`);
    selectedRunbook.value = null;
  } catch (err) {
    console.error('Gagal hapus KB:', err);
    uiStore.toastError('Gagal menghapus dokumen Knowledge Base.');
  }
};

const downloadFallbackDoc = (item) => {
  const fileName = item.documentName || item.uploadedDocName || `${item.kbCode || 'KB'}_dokumen.txt`;
  const dummyContent = `=== PT GLOTRA HELPDESK KNOWLEDGE BASE DOKUMEN ===\nKode KB: ${item.kbCode || item.id}\nJudul: ${item.title}\nKategori: ${item.category || '-'}\nProduk: ${item.product || '-'}\nBerkas: ${fileName}\n\nDiunduh pada ${new Date().toISOString()}`;
  const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
</script>
