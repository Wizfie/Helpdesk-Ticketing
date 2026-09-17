<template>
  <div class="space-y-6">
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
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Systems Normal • SLA Engine Active
        </span>
      </div>
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
          Knowledge Base
        </h1>
        <p class="text-xs text-slate-500 leading-relaxed">
          Internal repository of validated troubleshooting procedures, root cause analysis, and standard resolutions across multi-vendor data center architectures.
        </p>
      </div>

      <!-- Search Input & Action Button -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div class="relative w-full sm:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search symptoms, products, errors, or incident IDs... [/]"
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

        <button
          @click="openProposeModal"
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>+ Propose New Article</span>
        </button>
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
              24 PLAYBOOKS
            </span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              Storage &amp; SAN Troubleshooting
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              High-availability failover, optical SFP diagnostics, and unmap queue recovery across enterprise arrays.
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
              18 PLAYBOOKS
            </span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              VMware Infrastructure Recovery
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              ESXi PSOD register triage, APD/PDL datastore isolation, and locked VM process terminations.
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
              12 PLAYBOOKS
            </span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
              Enterprise Backup Resiliency
            </h3>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Rubrik cluster sync, locked snapshot consolidation, and MS SQL / Oracle VSS writer unfreezes.
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
            
            <!-- Filter by Principal -->
            <select
              v-model="selectedPrincipal"
              class="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="">All Principals</option>
              <option value="HPE">HPE 3PAR / Primera</option>
              <option value="VMware">VMware ESXi / vSAN</option>
              <option value="Rubrik">Rubrik CDM</option>
              <option value="Brocade">Brocade Fabric OS</option>
              <option value="Oracle">Oracle / PostgreSQL</option>
            </select>

            <!-- Filter by Status -->
            <select
              v-model="selectedStatus"
              class="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">Status: All</option>
              <option value="PUBLISHED">Status: Approved</option>
              <option value="DRAFT">Status: Draft / Review</option>
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
                  {{ item.category }}
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
                  {{ item.approver ? `${item.approver}` : `Author: ${item.author}` }}
                </span>
                <span>•</span>
                <span class="text-slate-400">Updated {{ item.updatedAt || 'Recently' }}</span>
              </div>

              <div class="flex items-center space-x-2">
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="item.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ item.status === 'PUBLISHED' ? 'VERIFIED PLAYBOOK' : 'PENDING REVIEW' }}
                </span>
                <span class="text-blue-600 group-hover:translate-x-0.5 transition-transform font-bold text-xs">&rarr;</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="paginatedRunbooks.length === 0" class="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="font-bold text-slate-800 text-sm">Tidak ditemukan runbook yang cocok</div>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Coba ganti filter teknologi principal atau kata kunci pencarian pada bilah di atas.
            </p>
            <button
              @click="resetFilters"
              class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Reset Semua Filter
            </button>
          </div>
        </div>

        <!-- Pagination Bar (Figma Frame 08 Spec) -->
        <div class="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-xs flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong class="text-slate-800">{{ filteredRunbooks.length ? (currentPage - 1) * pageSize + 1 : 0 }}</strong> to 
            <strong class="text-slate-800">{{ Math.min(currentPage * pageSize, filteredRunbooks.length) }}</strong> of 
            <strong class="text-slate-800">{{ filteredRunbooks.length }}</strong> published runbooks
          </div>

          <div class="flex items-center space-x-1">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all"
              :class="currentPage === page ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-700 hover:bg-slate-100'"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
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
                64%
              </span>
            </div>
            <div class="w-12 h-12 rounded-full border-4 border-blue-600/20 border-t-blue-600 flex items-center justify-center font-bold text-blue-700 text-xs font-mono">
              64%
            </div>
          </div>
          <p class="text-[11px] text-slate-500 leading-relaxed">
            64% of resolved L2/L3 enterprise incidents directly link to a verified playbook, saving an average of 42 minutes per incident recovery.
          </p>

          <!-- Pending Approvals Sub-section -->
          <div class="pt-3 border-t border-slate-100 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                PENDING APPROVALS
              </span>
              <span class="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full">
                {{ ticketStore.pendingKbApprovals.length }} Pending
              </span>
            </div>

            <div class="space-y-2">
              <div
                v-for="pending in ticketStore.pendingKbApprovals"
                :key="pending.id"
                class="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all text-xs space-y-1"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-800 text-[11px] line-clamp-1">{{ pending.title }}</span>
                </div>
                <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>From {{ pending.sourceTicket }}</span>
                  <span class="text-amber-700 font-semibold">{{ pending.stage }}</span>
                </div>
                <div class="pt-1 flex items-center justify-between text-[10px]">
                  <span class="text-slate-400">{{ pending.submittedAt }}</span>
                  <button
                    v-if="authStore.currentUser.roleCode === 'ADMIN'"
                    @click="handleApprovePending(pending.id)"
                    class="text-blue-600 font-bold hover:underline"
                  >
                    Review &amp; Approve &rarr;
                  </button>
                  <span v-else class="text-slate-400 italic">Menunggu Approval Admin</span>
                </div>
              </div>
            </div>

            <button
              @click="showPendingModal = true"
              class="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 block"
            >
              Manage Approvals Queue &rarr;
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
            Quick queries frequently used by on-call engineers in the last 48 hours:
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

        <!-- 3. Authoring Standard Note Card (Figma Frame 08 Spec) -->
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-xs space-y-2.5">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <h4 class="font-bold text-xs uppercase tracking-wider text-blue-300">
              Authoring Standard
            </h4>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Ensure all submitted runbooks include sanitized log excerpts, exact CLI syntax verification, and a validated rollback section before supervisor sign-off.
          </p>
          <div class="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>ITIL v4 Compliant</span>
            <span class="text-blue-400 font-mono">ISO/IEC 20000</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 1: Runbook Detail Drawer / Modal -->
    <div v-if="selectedRunbook" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <!-- Modal Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded border border-blue-200">
                {{ selectedRunbook.kbCode || `KB-${selectedRunbook.id}` }}
              </span>
              <span class="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded">
                {{ selectedRunbook.category }}
              </span>
              <span class="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
                {{ selectedRunbook.technologyPrincipal }}
              </span>
              <span class="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                VERIFIED
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {{ selectedRunbook.title }}
            </h2>
            <div class="text-[11px] text-slate-500 flex items-center space-x-2">
              <span>{{ selectedRunbook.approver ? `${selectedRunbook.approver}` : `Author: ${selectedRunbook.author}` }}</span>
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

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          <!-- Incident Source Banner -->
          <div v-if="selectedRunbook.source" class="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-center space-x-2 text-indigo-900 font-mono text-[11px]">
            <svg class="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <span><strong>Validated Lineage:</strong> {{ selectedRunbook.source }}</span>
          </div>

          <!-- Symptoms & Root Cause Analysis -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Incident Symptom (Gejala)</span>
              </h4>
              <p class="text-slate-600 leading-relaxed">
                {{ selectedRunbook.symptom }}
              </p>
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Root Cause Analysis (RCA)</span>
              </h4>
              <p class="text-slate-600 leading-relaxed">
                {{ selectedRunbook.rootCause }}
              </p>
            </div>
          </div>

          <!-- Prerequisites & Hardware Compatibility -->
          <div v-if="selectedRunbook.prerequisites" class="border border-slate-200 rounded-xl p-4 space-y-1 bg-slate-50/50">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
              Prerequisites &amp; Environment Target
            </h4>
            <p class="text-slate-700 font-mono text-[11px]">
              {{ selectedRunbook.prerequisites }}
            </p>
          </div>

          <!-- CLI Command Snippet (Dark Terminal) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
                <svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Verified Diagnostic &amp; Resolution CLI Sequence</span>
              </h4>
              <button
                @click="copySnippet(selectedRunbook.cliSnippet)"
                class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>{{ copiedCode ? '✓ Copied to Clipboard' : '📋 Copy Commands' }}</span>
              </button>
            </div>

            <div class="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
              <pre class="whitespace-pre leading-relaxed">{{ selectedRunbook.cliSnippet }}</pre>
            </div>
          </div>

          <!-- Verification Steps & Rollback Procedure -->
          <div class="space-y-3">
            <div v-if="selectedRunbook.verificationSteps" class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <h5 class="font-bold text-emerald-900 text-xs flex items-center space-x-1.5">
                <span>✓ Health Check &amp; Post-Fix Verification</span>
              </h5>
              <p class="text-emerald-800 text-[11px] leading-relaxed">
                {{ selectedRunbook.verificationSteps }}
              </p>
            </div>

            <div v-if="selectedRunbook.rollbackProcedure" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
              <h5 class="font-bold text-rose-900 text-xs flex items-center space-x-1.5">
                <span>⚠️ Rollback &amp; Fallback Procedure (Safety Protocol)</span>
              </h5>
              <p class="text-rose-800 text-[11px] leading-relaxed">
                {{ selectedRunbook.rollbackProcedure }}
              </p>
            </div>

            <div v-if="selectedRunbook.recommendation" class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <h5 class="font-bold text-blue-900 text-xs flex items-center space-x-1.5">
                <span>🛡️ Long-term Preventive Recommendation</span>
              </h5>
              <p class="text-blue-800 text-[11px] leading-relaxed">
                {{ selectedRunbook.recommendation }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            @click="printRunbook"
            class="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            <span>Cetak Runbook SOP</span>
          </button>

          <button
            @click="selectedRunbook = null"
            class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 2: Propose New Article Modal -->
    <div v-if="showProposeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Propose New Engineering Runbook</h3>
            <p class="text-[11px] text-slate-500">Ajukan prosedur troubleshooting terverifikasi untuk disetujui lead engineer.</p>
          </div>
          <button @click="showProposeModal = false" class="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitProposedArticle" class="p-6 overflow-y-auto space-y-4 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Judul Runbook &amp; Prosedur *</label>
            <input
              v-model="newArticle.title"
              required
              type="text"
              placeholder="Contoh: Cisco Nexus 9000 VPC Split-Brain Recovery via Keepalive Interface"
              class="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kategori Infrastruktur *</label>
              <select v-model="newArticle.categoryGroup" required class="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white">
                <option value="SAN & Enterprise Storage">SAN &amp; Enterprise Storage</option>
                <option value="VMware & Hypervisors">VMware &amp; Hypervisors</option>
                <option value="Network & Switches">Network &amp; Switches</option>
                <option value="Backup & DR">Backup &amp; DR</option>
                <option value="Database & Middleware">Database &amp; Middleware</option>
                <option value="Security & Firewall">Security &amp; Firewall</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Principal / Platform Vendor *</label>
              <input
                v-model="newArticle.technologyPrincipal"
                required
                type="text"
                placeholder="Contoh: Cisco NX-OS / VMware ESXi 8.0"
                class="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Gejala Kerusakan (Symptom Description) *</label>
            <textarea
              v-model="newArticle.symptom"
              required
              rows="2"
              placeholder="Jelaskan indikasi kegagalan sistem, error code, atau perilaku anomali..."
              class="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Akar Masalah Teknis (Root Cause Analysis) *</label>
            <textarea
              v-model="newArticle.rootCause"
              required
              rows="2"
              placeholder="Rincikan faktor teknis utama penyebab kegagalan..."
              class="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
            ></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">CLI Commands &amp; Resolution Sequence *</label>
            <textarea
              v-model="newArticle.cliSnippet"
              required
              rows="4"
              placeholder="# Step 1: Check status\nshow status\n\n# Step 2: Remediate issue\nrestart service"
              class="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono bg-slate-900 text-slate-100"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Prosedur Verifikasi Sukses</label>
              <input
                v-model="newArticle.verificationSteps"
                type="text"
                placeholder="Contoh: Pastikan vPC peer link status up dan link flapping berhenti."
                class="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">Prosedur Rollback Darurat</label>
              <input
                v-model="newArticle.rollbackProcedure"
                type="text"
                placeholder="Contoh: Isolate secondary peer switch jika traffic drop."
                class="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div class="pt-4 border-t border-slate-200 flex justify-end space-x-2">
            <button
              type="button"
              @click="showProposeModal = false"
              class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Publikasikan Runbook
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Pending Approvals Queue Modal -->
    <div v-if="showPendingModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 class="font-bold text-slate-900 text-sm">Governance &amp; Approvals Queue</h3>
            <span class="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
              {{ ticketStore.pendingKbApprovals.length }} Tiket Menunggu
            </span>
          </div>
          <button @click="showPendingModal = false" class="text-slate-400 hover:text-slate-600 text-2xl font-bold cursor-pointer">&times;</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-3 text-xs">
          <div
            v-for="pending in ticketStore.pendingKbApprovals"
            :key="pending.id"
            class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-900 text-sm">{{ pending.title }}</span>
              <span class="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                {{ pending.stage }}
              </span>
            </div>
            <p class="text-slate-600 text-[11px] leading-relaxed">
              {{ pending.summary }}
            </p>
            <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div>
                <span>Source: <strong>{{ pending.sourceTicket }}</strong> ({{ pending.customer }})</span>
                <span class="ml-2">By: {{ pending.author }}</span>
              </div>
              <button
                v-if="authStore.currentUser.roleCode === 'ADMIN'"
                @click="handleApprovePending(pending.id)"
                class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
              >
                Setujui &amp; Terbitkan
              </button>
            </div>
          </div>

          <div v-if="ticketStore.pendingKbApprovals.length === 0" class="text-center py-8 text-slate-400">
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
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const searchQuery = ref('');
const selectedCategoryTab = ref('all');
const selectedPrincipal = ref('');
const selectedStatus = ref('ALL');
const sortBy = ref('mostReferenced');

const currentPage = ref(1);
const pageSize = 5;

const selectedRunbook = ref(null);
const showProposeModal = ref(false);
const showPendingModal = ref(false);
const copiedCode = ref(false);

const frequentTags = [
  'Datastore inaccessible',
  'Controller failover',
  'VLAN packet drops',
  'PSOD',
  'Replication lag'
];

const categoryTabs = [
  { id: 'all', label: 'All Technologies', count: 85 },
  { id: 'vmware', label: 'VMware & Hypervisors', count: 18 },
  { id: 'storage', label: 'SAN & Enterprise Storage', count: 24 },
  { id: 'network', label: 'Network & Switches', count: 15 },
  { id: 'backup', label: 'Backup & DR', count: 12 },
  { id: 'database', label: 'Database & Middleware', count: 9 },
  { id: 'security', label: 'Security & Firewall', count: 7 }
];

const newArticle = ref({
  title: '',
  categoryGroup: 'SAN & Enterprise Storage',
  technologyPrincipal: '',
  symptom: '',
  rootCause: '',
  cliSnippet: '',
  verificationSteps: '',
  rollbackProcedure: ''
});

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
      const matchPrincipal = item.technologyPrincipal?.toLowerCase().includes(p) || item.title.toLowerCase().includes(p);
      if (!matchPrincipal) return false;
    }

    // 3. Status filter
    if (selectedStatus.value !== 'ALL') {
      if (item.status !== selectedStatus.value) return false;
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

const openProposeModal = () => {
  newArticle.value = {
    title: '',
    categoryGroup: 'SAN & Enterprise Storage',
    technologyPrincipal: '',
    symptom: '',
    rootCause: '',
    cliSnippet: '# 1. Triage & Verify\nshow port\n\n# 2. Remediate\nset online',
    verificationSteps: '',
    rollbackProcedure: ''
  };
  showProposeModal.value = true;
};

const submitProposedArticle = () => {
  const item = ticketStore.proposeNewArticle(newArticle.value, authStore.currentUser);
  showProposeModal.value = false;
  selectedRunbook.value = item;
};

const handleApprovePending = (pendingId) => {
  ticketStore.approvePendingApproval(pendingId, authStore.currentUser);
  if (showPendingModal.value && ticketStore.pendingKbApprovals.length === 0) {
    showPendingModal.value = false;
  }
};

const printRunbook = () => {
  window.print();
};
</script>
