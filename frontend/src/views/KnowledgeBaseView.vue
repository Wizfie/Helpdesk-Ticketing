<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Top Bar / Breadcrumb & Status Telemetry -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
      <div class="flex items-center space-x-2 text-xs text-slate-500 font-mono">
        <span class="text-blue-600 font-bold">GTT</span>
        <span>&gt;</span>
        <span class="text-slate-800 font-semibold">Operations</span>
        <span>&gt;</span>
        <span class="text-slate-500">Knowledge Base</span>
      </div>
      <div class="flex items-center space-x-3 text-xs">
        <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Sistem Operasional Aktif
        </span>
      </div>
    </div>

    <!-- Alert Banner when article was recently created/proposed -->
    <div 
      v-if="createdAlertMessage" 
      class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
          ✓
        </div>
        <div>
          <strong class="font-bold text-emerald-950 block">Dokumen Knowledge Base Berhasil Diajukan!</strong>
          <span class="text-emerald-800 text-[11px]">{{ createdAlertMessage }}</span>
        </div>
      </div>
      <button 
        @click="createdAlertMessage = ''" 
        class="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 text-sm rounded-lg hover:bg-emerald-100/60 cursor-pointer"
      >
        &times;
      </button>
    </div>

    <!-- Header Banner -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div class="space-y-1.5 max-w-2xl">
        <div class="flex items-center space-x-2">
          <span class="text-[10px] font-mono font-bold tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase border border-blue-200/60">
            REPOSITORY • VALIDATED ENGINEERING RUNBOOKS
          </span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          Knowledge Base &amp; Runbook SOP
        </h1>
        <p class="text-xs text-slate-500 leading-relaxed">
          Repositori terpusat prosedur troubleshooting terverifikasi, analisis akar masalah (RCA), dan standar pemulihan multi-vendor data center.
        </p>
      </div>

      <!-- Search Input & Action Button -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative w-full sm:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari gejala, vendor, produk, atau kode KB..."
            class="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            &times;
          </button>
        </div>

        <!-- Download Official Template DOCX Button -->
        <a
          href="/templates/GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
          download="GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
          class="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          title="Unduh file dokumen template resmi (.docx)"
        >
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Unduh Template (.docx)</span>
        </a>

        <!-- Buat Runbook Baru Button -> Leads to KnowledgeProposeView -->
        <router-link
          to="/knowledge-base/propose"
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>+ Buat Runbook Baru</span>
        </router-link>
      </div>
    </div>

    <!-- Category Pill Tabs -->
    <div class="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-thin">
      <button
        v-for="cat in categoryTabs"
        :key="cat.id"
        @click="selectedCategoryTab = cat.id"
        class="px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer"
        :class="selectedCategoryTab === cat.id 
          ? 'bg-blue-600 text-white font-bold shadow-xs' 
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'"
      >
        <span>{{ cat.label }}</span>
        <span 
          class="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold"
          :class="selectedCategoryTab === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'"
        >
          {{ cat.count }}
        </span>
      </button>
    </div>

    <!-- 3 Featured Technology Playbook Cards (Figma Frame 08 Spec) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Card 1: Storage & SAN -->
      <div 
        @click="filterByFeatured('SAN & Enterprise Storage')"
        class="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path>
              </svg>
            </div>
            <span class="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {{ storagePlaybooksCount }} PLAYBOOKS
            </span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              Storage &amp; SAN Troubleshooting
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              High-availability failover, optical SFP diagnostics, dan unmap queue recovery pada enterprise storage.
            </p>
          </div>
        </div>
        <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-blue-600">
          <span>HPE 3PAR • NetApp AFF • Brocade</span>
          <span>&rarr;</span>
        </div>
      </div>

      <!-- Card 2: VMware Infrastructure -->
      <div 
        @click="filterByFeatured('VMware & Hypervisors')"
        class="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <span class="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              {{ vmwarePlaybooksCount }} PLAYBOOKS
            </span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              VMware Infrastructure Recovery
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              ESXi PSOD register triage, APD/PDL datastore isolation, dan locked VM process terminations.
            </p>
          </div>
        </div>
        <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-blue-600">
          <span>ESXi 8.0 • vSAN • vCenter HA</span>
          <span>&rarr;</span>
        </div>
      </div>

      <!-- Card 3: Enterprise Backup -->
      <div 
        @click="filterByFeatured('Backup & DR')"
        class="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <span class="text-[10px] font-mono font-bold bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded border border-cyan-200">
              {{ backupPlaybooksCount }} PLAYBOOKS
            </span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              Enterprise Backup Resiliency
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Rubrik cluster sync, locked snapshot consolidation, dan MS SQL / Oracle VSS writer unfreezes.
            </p>
          </div>
        </div>
        <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-blue-600">
          <span>Rubrik CDM • Veeam • Commvault</span>
          <span>&rarr;</span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid (8 cols Runbook Feed vs 4 cols Governance & SLA) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Runbooks Feed (8 cols) -->
      <div class="lg:col-span-8 space-y-4">
        <!-- Feed Filter Toolbar -->
        <div class="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-slate-400 text-[10px] uppercase tracking-wider font-mono">FILTER RUNBOOKS</span>
            
            <!-- Filter by Principal (Dinamis) -->
            <select
              v-model="selectedPrincipal"
              class="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="">Semua Principal (All)</option>
              <option v-for="p in availablePrincipals" :key="p" :value="p">{{ p }}</option>
            </select>

            <!-- Filter by Status -->
            <select
              v-model="selectedStatus"
              class="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">Semua Status (All)</option>
              <option value="PUBLISHED">Status: Published / Approved</option>
              <option value="PENDING_APPROVAL">Status: Menunggu Review</option>
              <option value="DRAFT">Status: Draft</option>
            </select>
          </div>

          <!-- Sort Dropdown -->
          <div class="flex items-center space-x-2">
            <span class="text-slate-400 text-[11px]">Sort:</span>
            <select
              v-model="sortBy"
              class="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
            >
              <option value="mostReferenced">Most Referenced</option>
              <option value="latest">Recently Updated</option>
            </select>
          </div>
        </div>

        <!-- Runbook Item Cards Feed -->
        <div class="space-y-3">
          <div
            v-for="item in paginatedRunbooks"
            :key="item.id"
            @click="openRunbookDetail(item)"
            class="bg-white border border-slate-200 hover:border-blue-400/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
          >
            <!-- Card Header: Badges & Ticket Reference Counter -->
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center space-x-2">
                <span class="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/70">
                  {{ item.kbCode || `KB-${item.id}` }}
                </span>
                <span class="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {{ item.category || item.categoryGroup }}
                </span>
                <span class="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {{ item.technologyPrincipal }}
                </span>
              </div>

              <div class="flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                <span class="font-bold text-slate-700">{{ item.ticketsReferencedCount || 0 }}</span>
                <span>tickets referenced</span>
              </div>
            </div>

            <!-- Title -->
            <h3 class="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors leading-snug">
              {{ item.title }}
            </h3>

            <!-- Summary / Symptom -->
            <p class="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {{ item.symptom }}
            </p>

            <!-- Card Footer: Author & Timestamp & State -->
            <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>
                  {{ item.approver ? `${item.approver}` : `Author: ${item.author || item.engineerName}` }}
                </span>
                <span>•</span>
                <span class="text-slate-400">Updated {{ item.updatedAt || 'Recently' }}</span>
              </div>

              <div class="flex items-center space-x-2">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-emerald-50 text-emerald-700 border border-emerald-200': item.status === 'PUBLISHED',
                    'bg-amber-50 text-amber-700 border border-amber-200': item.status === 'PENDING_APPROVAL',
                    'bg-slate-100 text-slate-600 border border-slate-200': item.status === 'DRAFT'
                  }"
                >
                  {{ item.status === 'PUBLISHED' ? 'VERIFIED PLAYBOOK' : (item.status === 'PENDING_APPROVAL' ? 'PENDING REVIEW' : 'DRAFT') }}
                </span>
                <span class="text-blue-600 group-hover:translate-x-0.5 transition-transform font-bold text-xs">&rarr;</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="paginatedRunbooks.length === 0" class="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="font-bold text-slate-800 text-sm">
              {{ ticketStore.knowledgeBase.length === 0 ? 'Belum Ada Runbook SOP' : 'Tidak ditemukan runbook yang cocok' }}
            </div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              {{ ticketStore.knowledgeBase.length === 0 
                ? 'Basis pengetahuan saat ini kosong. Buat runbook baru untuk membangun dokumentasi playbook tim teknis.' 
                : 'Coba ubah filter teknologi principal, status, atau kata kunci pencarian pada bilah di atas.' }}
            </p>
            <div class="pt-1">
              <router-link
                v-if="ticketStore.knowledgeBase.length === 0"
                to="/knowledge-base/propose"
                class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                + Buat Runbook Baru
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

        <!-- Pagination Bar (Figma Frame 08 Spec) -->
        <div class="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Menampilkan <strong class="text-slate-800">{{ filteredRunbooks.length ? (currentPage - 1) * pageSize + 1 : 0 }}</strong> - 
            <strong class="text-slate-800">{{ Math.min(currentPage * pageSize, filteredRunbooks.length) }}</strong> dari 
            <strong class="text-slate-800">{{ filteredRunbooks.length }}</strong> runbooks
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

      <!-- Right Column: Governance, Approvals & Search Shortcuts (4 cols) -->
      <div class="lg:col-span-4 space-y-4">
        <!-- 1. Governance & SLA Reusability Box -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <h3 class="font-black text-slate-900 text-xs uppercase tracking-wider">
                Governance &amp; SLA
              </h3>
            </div>
            <span class="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              AUDITED
            </span>
          </div>

          <!-- KPI Banner -->
          <div class="bg-blue-50/70 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span class="text-[10px] font-mono font-bold text-blue-800 uppercase block tracking-wider">
                INCIDENT REUSABILITY RATE
              </span>
              <span class="text-3xl font-black text-blue-900 font-mono tracking-tight mt-0.5 block">
                {{ incidentReusabilityRate }}%
              </span>
            </div>
            <div class="w-12 h-12 rounded-full border-4 border-blue-600/20 border-t-blue-600 flex items-center justify-center font-bold text-blue-700 text-xs font-mono">
              {{ incidentReusabilityRate }}%
            </div>
          </div>
          <p class="text-[11px] text-slate-500 leading-relaxed">
            {{ incidentReusabilityRate }}% insiden terselesaikan didukung oleh playbook runbook terverifikasi, memangkas durasi investigasi teknis secara signifikan.
          </p>

          <!-- Pending Approvals Sub-section -->
          <div class="pt-3 border-t border-slate-100 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                PENDING APPROVALS
              </span>
              <span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full font-mono">
                {{ allPendingItems.length }} Pending
              </span>
            </div>

            <div class="space-y-2">
              <div
                v-for="pending in allPendingItems.slice(0, 3)"
                :key="pending.id"
                class="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all text-xs space-y-1"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-800 text-[11px] line-clamp-1">{{ pending.title }}</span>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{{ pending.sourceTicket ? `From ${pending.sourceTicket}` : (pending.author ? `By ${pending.author}` : 'Runbook Baru') }}</span>
                  <span class="text-amber-700 font-semibold">{{ pending.stage || 'Review Needed' }}</span>
                </div>
                <div class="pt-1 flex items-center justify-between text-[10px]">
                  <span class="text-slate-400">{{ pending.submittedAt || pending.updatedAt || 'Recent' }}</span>
                  <button
                    v-if="authStore.isAdmin"
                    @click="handleApproveAnyPending(pending)"
                    class="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Review &amp; Approve &rarr;
                  </button>
                  <span v-else class="text-slate-400 italic">Menunggu Approval Admin</span>
                </div>
              </div>

              <div v-if="allPendingItems.length === 0" class="text-slate-400 text-center py-2 text-[11px]">
                Tidak ada antrean approval pending.
              </div>
            </div>

            <button
              v-if="allPendingItems.length > 0"
              @click="showPendingModal = true"
              class="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 block cursor-pointer"
            >
              Lihat Semua Antrean Approval ({{ allPendingItems.length }}) &rarr;
            </button>
          </div>
        </div>

        <!-- 2. Frequently Searched Box (Figma Frame 08 Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div class="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider">
              Frequently Searched
            </h4>
          </div>
          <p class="text-[11px] text-slate-500">
            Kueri penelusuran yang sering diakses engineer dalam 48 jam terakhir:
          </p>
          <div class="flex flex-wrap gap-1.5 pt-1">
            <button
              v-for="tag in frequentTags"
              :key="tag"
              @click="applyQuickSearch(tag)"
              class="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all cursor-pointer"
            >
              🔍 {{ tag }}
            </button>
          </div>
        </div>

        <!-- 3. Template Runbook GTT Standard Card -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <h4 class="font-bold text-xs uppercase tracking-wider text-blue-300">
                Template Runbook GTT
              </h4>
            </div>
            <a
              href="/templates/GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
              download="GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
              class="text-[10px] font-bold text-blue-300 hover:text-white underline cursor-pointer"
            >
              Unduh .docx
            </a>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Format resmi 12 bagian Engineering Runbook mencakup Pre-Check, Analisis Akar Masalah, Prosedur CLI, hingga Verifikasi &amp; Rollback.
          </p>
          <div class="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Template v1.0</span>
            <span class="text-blue-400 font-mono">12 Bagian Standar</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 1: Runbook Detail Drawer / Modal (Conforms to Official 12-Section Template) -->
    <div v-if="selectedRunbook" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center space-x-2 flex-wrap gap-y-1">
              <span class="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                {{ selectedRunbook.kbCode || `KB-${selectedRunbook.id}` }}
              </span>
              <span class="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded">
                {{ selectedRunbook.category || selectedRunbook.categoryGroup }}
              </span>
              <span class="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
                {{ selectedRunbook.technologyPrincipal }}
              </span>
              <span class="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded uppercase">
                {{ selectedRunbook.caseType || 'Incident' }}
              </span>
              <span 
                class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase"
                :class="{
                  'bg-emerald-100 text-emerald-800 border-emerald-200': selectedRunbook.status === 'PUBLISHED',
                  'bg-amber-100 text-amber-800 border-amber-200': selectedRunbook.status === 'PENDING_APPROVAL',
                  'bg-slate-100 text-slate-700 border-slate-200': selectedRunbook.status === 'DRAFT'
                }"
              >
                {{ selectedRunbook.status === 'PUBLISHED' ? 'VERIFIED SOP' : (selectedRunbook.status === 'PENDING_APPROVAL' ? 'PENDING APPROVAL' : 'DRAFT') }}
              </span>
            </div>
            <h2 class="text-base sm:text-xl font-black text-slate-900 leading-snug">
              {{ selectedRunbook.title }}
            </h2>
            <div class="text-[11px] text-slate-500 flex items-center space-x-2 flex-wrap">
              <span>Prepared By: <strong>{{ selectedRunbook.author || selectedRunbook.engineerName || 'Engineer GTT' }}</strong></span>
              <span>•</span>
              <span>Approver: <strong>{{ selectedRunbook.approver || 'Denny Wicaksono' }}</strong></span>
              <span>•</span>
              <span>Version: <strong>{{ selectedRunbook.version || '1.0' }}</strong></span>
              <span>•</span>
              <span>Updated {{ selectedRunbook.updatedAt || 'Recently' }}</span>
              <span>•</span>
              <span class="font-mono text-blue-700">{{ selectedRunbook.ticketsReferencedCount || 0 }} tickets referenced</span>
            </div>
          </div>

          <button
            @click="selectedRunbook = null"
            class="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            &times;
          </button>
        </div>

        <!-- Modal Body (12 Structured Sections from Official Template) -->
        <div class="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 font-sans">
          <!-- 1. DOCUMENT INFORMATION -->
          <div class="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-blue-700">
              <span class="w-5 h-5 rounded bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
              <span>Document Information</span>
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span class="text-slate-400 text-[10px] block">Product / Platform</span>
                <strong class="text-slate-800">{{ selectedRunbook.productPlatform || selectedRunbook.technologyPrincipal || 'HPE 3PAR / Primera' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block">Version / Firmware / OS</span>
                <strong class="text-slate-800 font-mono">{{ selectedRunbook.firmwareVersion || 'v3.3.1 MU5 / ESXi 8.0' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block">Case Type</span>
                <strong class="text-blue-700 uppercase">{{ selectedRunbook.caseType || 'Incident' }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] block">Source Reference</span>
                <strong class="text-slate-800 truncate block">{{ selectedRunbook.source || 'Standard Engineering SOP' }}</strong>
              </div>
            </div>
          </div>

          <!-- 2. PROBLEM DESCRIPTION -->
          <div class="space-y-3">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800">
              <span class="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">2</span>
              <span>Problem Description</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-amber-50/40 border border-amber-200 rounded-xl p-4 space-y-1.5">
                <span class="text-[10px] font-bold text-amber-800 uppercase block">Symptom / Gejala</span>
                <p class="text-slate-700 leading-relaxed">{{ selectedRunbook.symptom }}</p>
              </div>
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase block">Error Code / Alert</span>
                  <span class="font-mono text-rose-700 font-bold">{{ selectedRunbook.errorCode || 'ALERT-PCIE-BUS-STALL' }}</span>
                </div>
                <div class="flex justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span class="text-[10px] text-slate-400 block">Environment</span>
                    <strong class="text-slate-800">{{ selectedRunbook.environment || 'Production DC Cluster' }}</strong>
                  </div>
                  <div>
                    <span class="text-[10px] text-slate-400 block">Impact / Scope</span>
                    <strong class="text-rose-700">{{ selectedRunbook.impactScope || 'Standard Operational / Latency' }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. PRE-CHECK / PREREQUISITE -->
          <div class="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50/50">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800">
              <span class="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">3</span>
              <span>Pre-Check / Prerequisite</span>
            </h4>
            <p class="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
              {{ selectedRunbook.prerequisites || 'Akses SSH CLI dengan privilege level 3 / admin, verifikasi backup datastore sebelum maintenance.' }}
            </p>
          </div>

          <!-- 4. TROUBLESHOOTING / DIAGNOSTIC & 5. ROOT CAUSE ANALYSIS -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800">
                <span class="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">4</span>
                <span>Troubleshooting / Diagnostic Steps</span>
              </h4>
              <p class="text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {{ selectedRunbook.diagnosticSteps || '1. Periksa status port dan cluster hardware node.\n2. Cek alur link optical power dan error frame counter.\n3. Analisis core dump file exception kernel.' }}
              </p>
            </div>

            <div class="border border-rose-200 rounded-xl p-4 space-y-2 bg-rose-50/40">
              <h4 class="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <span class="w-5 h-5 rounded bg-rose-200 text-rose-800 flex items-center justify-center text-[10px]">5</span>
                <span>Root Cause Analysis (RCA)</span>
              </h4>
              <p class="text-slate-700 leading-relaxed font-sans">
                {{ selectedRunbook.rootCause }}
              </p>
            </div>
          </div>

          <!-- 6. RESOLUTION PROCEDURE & CLI COMMANDS -->
          <div class="space-y-3">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800">
              <span class="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">6</span>
              <span>Resolution Procedure &amp; CLI Commands</span>
            </h4>
            <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span class="text-[11px] font-bold text-slate-700 block">Resolution Steps:</span>
              <p class="text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {{ selectedRunbook.resolutionSteps || 'Terapkan rebalance FC host path, bersihkan command unmap yang tersendat, dan jalankan targeted rescan pada adapter storage ESXi.' }}
              </p>
            </div>

            <!-- Terminal CLI Snippet -->
            <div v-if="selectedRunbook.cliSnippet" class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono text-slate-500 font-semibold">CLI Configuration Snippet:</span>
                <button
                  @click="copySnippet(selectedRunbook.cliSnippet)"
                  class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>{{ copiedCode ? '✓ Copied' : '📋 Copy Snippet' }}</span>
                </button>
              </div>
              <div class="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <pre class="whitespace-pre leading-relaxed">{{ selectedRunbook.cliSnippet }}</pre>
              </div>
            </div>
          </div>

          <!-- 7. VERIFICATION & 8. ROLLBACK PROCEDURE -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <h4 class="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <span class="w-5 h-5 rounded bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">7</span>
                <span>Verification Procedure &amp; Expected Result</span>
              </h4>
              <p class="text-emerald-900 text-[11px] leading-relaxed">
                <strong>Verifikasi:</strong> {{ selectedRunbook.verificationSteps || 'Uji fungsionalitas volume dan pastikan status IO running normal.' }}
              </p>
              <p class="text-emerald-800 text-[11px] leading-relaxed border-t border-emerald-200/60 pt-2">
                <strong>Expected Result:</strong> {{ selectedRunbook.expectedResult || 'Semua antarmuka storage melaporkan Active/Optimized, zero latency timeout.' }}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <h4 class="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <span class="w-5 h-5 rounded bg-rose-200 text-rose-800 flex items-center justify-center text-[10px]">8</span>
                <span>Rollback Procedure (Safety Protocol)</span>
              </h4>
              <p class="text-rose-900 text-[11px] leading-relaxed">
                {{ selectedRunbook.rollbackProcedure || 'Jika proses gagal dalam 10 menit, eksekusi command halt pada node dan eskalasikan ke support principal.' }}
              </p>
            </div>
          </div>

          <!-- 9. RISK & 10. RELATED TICKET -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50">
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800">
                <span class="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">9</span>
                <span>Risk / Potential Impact</span>
              </h4>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                {{ selectedRunbook.riskPotentialImpact || 'Potensi transient failover selama proses eksekusi perbaikan path SAN switch.' }}
              </p>
            </div>

            <div class="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50">
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800">
                <span class="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">10</span>
                <span>Related Case / Ticket</span>
              </h4>
              <div class="text-[11px] space-y-1">
                <div>Ticket Ref: <strong class="text-blue-700 font-mono">{{ selectedRunbook.relatedTicketId || selectedRunbook.ticketNumber || 'TICK-20261004-0005' }}</strong></div>
                <div>Case Date: <span class="text-slate-700 font-medium">{{ selectedRunbook.caseDate || '04 Okt 2026' }}</span> &bull; Engineer: <strong class="text-slate-800">{{ selectedRunbook.engineerName || selectedRunbook.author }}</strong></div>
              </div>
            </div>
          </div>

          <!-- 11. SUPPORTING DOCUMENT & 12. REVIEW & APPROVAL -->
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800 mb-1.5">
                  <span class="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">11</span>
                  <span>Supporting Document &amp; Evidence</span>
                </h4>
                <div v-if="selectedRunbook.uploadedDocName || selectedRunbook.pdfAttachmentUrl" class="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                  <div class="flex items-center space-x-2 min-w-0">
                    <span class="text-base">📄</span>
                    <span class="font-mono text-slate-800 text-[11px] truncate font-medium">{{ selectedRunbook.uploadedDocName || 'lampiran_telemetry.pdf' }}</span>
                  </div>
                  <button 
                    @click="downloadSupportingDoc(selectedRunbook)"
                    class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-[10px] border border-blue-200 flex items-center space-x-1 shrink-0 cursor-pointer"
                  >
                    <span>Unduh Berkas</span>
                    <span>&darr;</span>
                  </button>
                </div>
                <div v-else class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-[11px] italic">
                  Tidak ada dokumen lampiran tambahan.
                </div>
              </div>

              <div>
                <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 text-slate-800 mb-1.5">
                  <span class="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">12</span>
                  <span>Review &amp; Approval</span>
                </h4>
                <div class="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5 text-[11px]">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Prepared By:</span>
                    <strong class="text-slate-800">{{ selectedRunbook.author || selectedRunbook.engineerName || 'Engineer GTT' }}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Reviewed By:</span>
                    <strong class="text-slate-800">{{ selectedRunbook.approver || 'Denny Wicaksono (Supervisor)' }}</strong>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-400">Status Governance:</span>
                    <span 
                      class="font-bold px-2 py-0.5 rounded border text-[10px] font-mono uppercase"
                      :class="{
                        'bg-emerald-50 text-emerald-700 border-emerald-200': selectedRunbook.status === 'PUBLISHED',
                        'bg-amber-50 text-amber-700 border-amber-200': selectedRunbook.status === 'PENDING_APPROVAL',
                        'bg-slate-100 text-slate-700 border-slate-200': selectedRunbook.status === 'DRAFT'
                      }"
                    >
                      {{ selectedRunbook.status || 'PUBLISHED' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center space-x-2">
            <!-- Cetak SOP Button -->
            <button
              @click="printRunbook"
              class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
            >
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
              </svg>
              <span>Cetak SOP</span>
            </button>

            <!-- Unduh Template Dokumen DOCX -->
            <a
              href="/templates/GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
              download="GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
              class="px-3.5 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Unduh Template (.docx)</span>
            </a>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Approve button if Admin and runbook is PENDING_APPROVAL -->
            <button
              v-if="authStore.isAdmin && selectedRunbook.status === 'PENDING_APPROVAL'"
              @click="publishSelectedRunbook"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Setujui &amp; Publikasikan SOP</span>
            </button>

            <button
              @click="selectedRunbook = null"
              class="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 2: Pending Approvals Queue Modal -->
    <div v-if="showPendingModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 class="font-bold text-slate-900 text-sm">Governance &amp; Approvals Queue</h3>
            <span class="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
              {{ allPendingItems.length }} Tiket &amp; Runbook Menunggu
            </span>
          </div>
          <button @click="showPendingModal = false" class="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer">&times;</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-3 text-xs">
          <div
            v-for="pending in allPendingItems"
            :key="pending.id"
            class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm">{{ pending.title }}</span>
              <span class="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                {{ pending.stage || 'Review Needed' }}
              </span>
            </div>
            <p class="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
              {{ pending.summary }}
            </p>
            <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div>
                <span v-if="pending.sourceTicket">Source: <strong>{{ pending.sourceTicket }}</strong></span>
                <span class="ml-2">By: {{ pending.author }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  v-if="pending.type === 'ARTICLE_SUBMISSION'"
                  @click="openRunbookDetail(pending.raw); showPendingModal = false;"
                  class="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Lihat Detail
                </button>
                <button
                  v-if="authStore.isAdmin"
                  @click="handleApproveAnyPending(pending)"
                  class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  Setujui &amp; Terbitkan
                </button>
              </div>
            </div>
          </div>

          <div v-if="allPendingItems.length === 0" class="text-center py-8 text-slate-400">
            Semua antrean proposal telah disetujui.
          </div>
        </div>

        <div class="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            @click="showPendingModal = false"
            class="px-4 py-1.5 bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const searchQuery = ref('');
const selectedCategoryTab = ref('all');
const selectedPrincipal = ref('');
const selectedStatus = ref('ALL');
const sortBy = ref('mostReferenced');

const currentPage = ref(1);
const pageSize = 10;

const selectedRunbook = ref(null);
const showPendingModal = ref(false);
const copiedCode = ref(false);
const createdAlertMessage = ref('');

onMounted(() => {
  if (route.query.created) {
    const createdId = Number(route.query.created);
    const found = ticketStore.knowledgeBase.find(k => k.id === createdId);
    if (found) {
      selectedRunbook.value = found;
      createdAlertMessage.value = `Runbook "${found.title}" telah didaftarkan dengan kode ${found.kbCode || `KB-${found.id}`}. Status: ${found.status === 'PUBLISHED' ? 'Terverifikasi & Diterbitkan' : 'Menunggu Review Admin'}.`;
    }
  }
});

const frequentTags = [
  'Datastore inaccessible',
  'Controller failover',
  'VLAN packet drops',
  'PSOD',
  'Replication lag'
];

const availablePrincipals = computed(() => {
  return ticketStore.allPrincipals;
});

const storagePlaybooksCount = computed(() => {
  return ticketStore.knowledgeBase.filter(k => 
    (k.categoryGroup || '').toLowerCase().includes('storage') || 
    (k.category || '').toLowerCase().includes('storage') ||
    (k.title || '').toLowerCase().includes('3par') ||
    (k.title || '').toLowerCase().includes('san')
  ).length;
});

const vmwarePlaybooksCount = computed(() => {
  return ticketStore.knowledgeBase.filter(k => 
    (k.categoryGroup || '').toLowerCase().includes('vmware') || 
    (k.category || '').toLowerCase().includes('vmware') ||
    (k.title || '').toLowerCase().includes('esxi') ||
    (k.title || '').toLowerCase().includes('vsan')
  ).length;
});

const backupPlaybooksCount = computed(() => {
  return ticketStore.knowledgeBase.filter(k => 
    (k.categoryGroup || '').toLowerCase().includes('backup') || 
    (k.category || '').toLowerCase().includes('backup') ||
    (k.title || '').toLowerCase().includes('rubrik') ||
    (k.title || '').toLowerCase().includes('veeam')
  ).length;
});

const incidentReusabilityRate = computed(() => {
  const closedOrResolved = ticketStore.tickets.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status));
  if (closedOrResolved.length === 0) return 0;
  const withKb = closedOrResolved.filter(t => t.isProposeKb || (t.rootCause && t.rootCause.length > 10)).length;
  return Math.min(100, Math.round((withKb / closedOrResolved.length) * 100));
});

const categoryTabs = computed(() => [
  { id: 'all', label: 'All Technologies', count: ticketStore.knowledgeBase.length },
  { 
    id: 'vmware', 
    label: 'VMware & Hypervisors', 
    count: ticketStore.knowledgeBase.filter(k => (k.categoryGroup || '').includes('VMware') || (k.category || '').toLowerCase().includes('vmware')).length 
  },
  { 
    id: 'storage', 
    label: 'SAN & Enterprise Storage', 
    count: ticketStore.knowledgeBase.filter(k => (k.categoryGroup || '').includes('Storage') || (k.category || '').toLowerCase().includes('storage')).length 
  },
  { 
    id: 'network', 
    label: 'Network & Switches', 
    count: ticketStore.knowledgeBase.filter(k => (k.categoryGroup || '').includes('Network') || (k.category || '').toLowerCase().includes('network')).length 
  },
  { 
    id: 'backup', 
    label: 'Backup & DR', 
    count: ticketStore.knowledgeBase.filter(k => (k.categoryGroup || '').includes('Backup') || (k.category || '').toLowerCase().includes('backup')).length 
  },
  { 
    id: 'database', 
    label: 'Database & Middleware', 
    count: ticketStore.knowledgeBase.filter(k => (k.categoryGroup || '').includes('Database') || (k.category || '').toLowerCase().includes('database')).length 
  },
  { 
    id: 'security', 
    label: 'Security & Firewall', 
    count: ticketStore.knowledgeBase.filter(k => (k.categoryGroup || '').includes('Security') || (k.category || '').toLowerCase().includes('security')).length 
  }
]);

const filteredRunbooks = computed(() => {
  return ticketStore.knowledgeBase.filter(item => {
    // 1. Tab filter
    if (selectedCategoryTab.value !== 'all') {
      const matchTab = {
        'vmware': item.categoryGroup?.includes('VMware') || item.category?.toLowerCase().includes('vmware'),
        'storage': item.categoryGroup?.includes('Storage') || item.category?.toLowerCase().includes('storage'),
        'network': item.categoryGroup?.includes('Network') || item.category?.toLowerCase().includes('network'),
        'backup': item.categoryGroup?.includes('Backup') || item.category?.toLowerCase().includes('backup'),
        'database': item.categoryGroup?.includes('Database') || item.category?.toLowerCase().includes('database'),
        'security': item.categoryGroup?.includes('Security') || item.category?.toLowerCase().includes('security')
      }[selectedCategoryTab.value];
      if (!matchTab) return false;
    }

    // 2. Principal filter
    if (selectedPrincipal.value) {
      const p = selectedPrincipal.value.toLowerCase();
      const matchPrincipal = item.technologyPrincipal?.toLowerCase().includes(p) || item.title?.toLowerCase().includes(p);
      if (!matchPrincipal) return false;
    }

    // 3. Status filter
    if (selectedStatus.value !== 'ALL') {
      if (selectedStatus.value === 'PUBLISHED' && item.status !== 'PUBLISHED') return false;
      if (selectedStatus.value === 'PENDING_APPROVAL' && item.status !== 'PENDING_APPROVAL') return false;
      if (selectedStatus.value === 'DRAFT' && item.status !== 'DRAFT') return false;
    }

    // 4. Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchCode = (item.kbCode || '').toLowerCase().includes(q);
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchSymptom = (item.symptom || '').toLowerCase().includes(q);
      const matchPrincipal = (item.technologyPrincipal || '').toLowerCase().includes(q);
      const matchRoot = (item.rootCause || '').toLowerCase().includes(q);
      if (!matchCode && !matchTitle && !matchSymptom && !matchPrincipal && !matchRoot) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy.value === 'mostReferenced') {
      return (b.ticketsReferencedCount || 0) - (a.ticketsReferencedCount || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
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

// All pending proposals (from tickets and directly proposed articles)
const allPendingItems = computed(() => {
  const fromTickets = (ticketStore.pendingKbApprovals || []).map(p => ({
    id: p.id,
    type: 'TICKET_PROPOSAL',
    title: p.title,
    sourceTicket: p.sourceTicket,
    author: p.author,
    customer: p.customer,
    stage: p.stage,
    submittedAt: p.submittedAt,
    summary: p.summary,
    raw: p
  }));
  const fromArticles = (ticketStore.knowledgeBase || [])
    .filter(k => k.status === 'PENDING_APPROVAL')
    .map(k => ({
      id: k.id,
      type: 'ARTICLE_SUBMISSION',
      title: k.title,
      sourceTicket: k.relatedTicketId || k.ticketNumber || null,
      author: k.author || k.engineerName,
      customer: k.customerName || null,
      stage: 'Article Pending Review',
      submittedAt: k.updatedAt || 'Recent',
      summary: k.symptom,
      raw: k
    }));
  return [...fromArticles, ...fromTickets];
});

const filterByFeatured = (groupName) => {
  if (groupName.includes('Storage')) selectedCategoryTab.value = 'storage';
  else if (groupName.includes('VMware')) selectedCategoryTab.value = 'vmware';
  else if (groupName.includes('Backup')) selectedCategoryTab.value = 'backup';
  currentPage.value = 1;
};

const applyQuickSearch = (tag) => {
  searchQuery.value = tag;
  currentPage.value = 1;
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategoryTab.value = 'all';
  selectedPrincipal.value = '';
  selectedStatus.value = 'ALL';
  sortBy.value = 'mostReferenced';
  currentPage.value = 1;
};

const openRunbookDetail = (item) => {
  selectedRunbook.value = item;
};

const copySnippet = (code) => {
  if (!code) return;
  navigator.clipboard.writeText(code);
  copiedCode.value = true;
  setTimeout(() => {
    copiedCode.value = false;
  }, 2500);
};

const handleApproveAnyPending = (pendingItem) => {
  if (pendingItem.type === 'ARTICLE_SUBMISSION') {
    ticketStore.publishKbArticle(pendingItem.id, authStore.currentUser);
    if (selectedRunbook.value && selectedRunbook.value.id === pendingItem.id) {
      selectedRunbook.value.status = 'PUBLISHED';
    }
  } else {
    ticketStore.approvePendingApproval(pendingItem.id, authStore.currentUser);
  }
  if (showPendingModal.value && allPendingItems.value.length === 0) {
    showPendingModal.value = false;
  }
};

const publishSelectedRunbook = () => {
  if (!selectedRunbook.value) return;
  ticketStore.publishKbArticle(selectedRunbook.value.id, authStore.currentUser);
  selectedRunbook.value.status = 'PUBLISHED';
};

const downloadSupportingDoc = (item) => {
  const fileName = item.uploadedDocName || 'supporting_evidence.txt';
  const dummyContent = `=== PT GLOTRA HELPDESK ENGINEERING EVIDENCE FILE ===\nKnowledge Base Ref: ${item.kbCode || item.id}\nTitle: ${item.title}\nDocument: ${fileName}\n\nEvidence Content / System Telemetry Log:\nVerified operational diagnostics at ${new Date().toISOString()}`;
  const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const printRunbook = () => {
  if (!selectedRunbook.value) return;
  const rb = selectedRunbook.value;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${rb.kbCode || 'KB'} - ${rb.title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; line-height: 1.4; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 4px; color: #0f172a; }
        .meta { color: #64748b; font-size: 11px; margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
        .section { margin-bottom: 14px; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; page-break-inside: avoid; }
        .section-header { background: #f1f5f9; padding: 6px 10px; font-weight: bold; font-size: 11px; color: #0f172a; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
        .section-body { padding: 10px; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 6px 8px; text-align: left; vertical-align: top; border-bottom: 1px solid #e2e8f0; }
        th { width: 25%; font-weight: 600; color: #475569; background: #f8fafc; }
        pre { background: #0f172a; color: #f8fafc; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 10px; white-space: pre-wrap; margin: 0; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>${rb.kbCode || 'KB'} : ${rb.title}</h1>
      <div class="meta">
        <strong>PT Global Transformasi Teknologi (Glotra) - Operations Helpdesk SOP</strong><br/>
        Category: ${rb.categoryGroup || rb.category || '-'} | Vendor: ${rb.technologyPrincipal || '-'} | Version: ${rb.version || '1.0'} | Status: ${rb.status || 'PUBLISHED'}
      </div>

      <div class="section">
        <div class="section-header">1. Document Information</div>
        <div class="section-body">
          <table>
            <tr><th>Product / Platform</th><td>${rb.productPlatform || rb.technologyPrincipal || '-'}</td></tr>
            <tr><th>Version / Firmware</th><td>${rb.firmwareVersion || '-'}</td></tr>
            <tr><th>Case Type</th><td>${rb.caseType || 'Incident'}</td></tr>
            <tr><th>Prepared By</th><td>${rb.author || rb.engineerName || '-'}</td></tr>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">2. Problem Description</div>
        <div class="section-body">
          <table>
            <tr><th>Symptom / Gejala</th><td>${rb.symptom || '-'}</td></tr>
            <tr><th>Error Code / Alert</th><td>${rb.errorCode || '-'}</td></tr>
            <tr><th>Environment</th><td>${rb.environment || '-'}</td></tr>
            <tr><th>Impact / Scope</th><td>${rb.impactScope || '-'}</td></tr>
          </table>
        </div>
      </div>

      <div class="section">
        <div class="section-header">3. Pre-Check / Prerequisite</div>
        <div class="section-body">${rb.prerequisites || '-'}</div>
      </div>

      <div class="section">
        <div class="section-header">4. Troubleshooting / Diagnostic Steps</div>
        <div class="section-body" style="white-space: pre-line;">${rb.diagnosticSteps || '-'}</div>
      </div>

      <div class="section">
        <div class="section-header">5. Root Cause Analysis (RCA)</div>
        <div class="section-body">${rb.rootCause || '-'}</div>
      </div>

      <div class="section">
        <div class="section-header">6. Resolution Procedure & CLI Commands</div>
        <div class="section-body">
          <p style="margin-top: 0;">${rb.resolutionSteps || '-'}</p>
          ${rb.cliSnippet ? `<pre>${rb.cliSnippet}</pre>` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-header">7. Verification & Expected Result</div>
        <div class="section-body">
          <strong>Verification:</strong> ${rb.verificationSteps || '-'}<br/>
          <strong>Expected Result:</strong> ${rb.expectedResult || '-'}
        </div>
      </div>

      <div class="section">
        <div class="section-header">8. Rollback Procedure</div>
        <div class="section-body">${rb.rollbackProcedure || '-'}</div>
      </div>

      <div class="section">
        <div class="section-header">9. Risk & Potential Impact</div>
        <div class="section-body">${rb.riskPotentialImpact || '-'}</div>
      </div>

      <div class="section">
        <div class="section-header">10. Related Case / Ticket</div>
        <div class="section-body">
          Ticket Ref: <strong>${rb.relatedTicketId || rb.ticketNumber || '-'}</strong> | Date: ${rb.caseDate || '-'} | Engineer: ${rb.engineerName || rb.author || '-'}
        </div>
      </div>

      <div class="section">
        <div class="section-header">11. Supporting Document & Evidence</div>
        <div class="section-body">${rb.uploadedDocName || 'Tidak ada dokumen lampiran tambahan.'}</div>
      </div>

      <div class="section">
        <div class="section-header">12. Review & Approval</div>
        <div class="section-body">
          Reviewed By: <strong>${rb.approver || '-'}</strong> | Status: <strong>${rb.status || 'PUBLISHED'}</strong> | Version: <strong>${rb.version || '1.0'}</strong>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};
</script>
