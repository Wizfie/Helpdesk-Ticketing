<template>
  <div class="space-y-5 pb-10 animate-in fade-in duration-200">
    <!-- 1. Executive Summary Header -->
    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Selamat Bertugas, {{ authStore.currentUser?.name || 'Ahmad Fauzi' }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Date Range Filter -->
        <div class="w-44">
          <BaseSelect
            v-model="selectedPeriod"
            :options="periodOptions"
            size="sm"
            placement="right"
          >
            <template #leading>
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </template>
          </BaseSelect>
        </div>

      </div>
    </div>

    <!-- 2. 6 Executive KPI Metric Cards (Grid 6 Columns) -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <!-- 1. Total Tickets -->
      <div 
        @click="goToKpi('total')"
        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-blue-400 hover:ring-2 hover:ring-blue-100 group"
        title="Lihat seluruh tiket insiden"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">TOTAL TIKET ({{ periodLabel }})</span>
          <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-blue-600 font-mono tracking-tight transition-colors">{{ kpiData.total }}</span>
          <span v-if="kpiData.total > 0" class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span>&uarr;</span> 12%
          </span>
          <span v-else class="text-[10px] font-mono text-slate-400">-</span>
        </div>
        <span class="text-[11px] text-slate-400 mt-2 block leading-snug">Akumulasi seluruh insiden</span>
      </div>

      <!-- 2. Open (Baru) -->
      <div 
        @click="goToKpi('open')"
        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-amber-400 hover:ring-2 hover:ring-amber-100 group"
        title="Lihat tiket baru yang belum dialokasikan"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">OPEN (BARU)</span>
          <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-rose-600 font-mono tracking-tight">{{ kpiData.open }}</span>
          <span v-if="kpiData.total > 0" class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span>&uarr;</span> 20%
          </span>
          <span v-else class="text-[10px] font-mono text-slate-400">-</span>
        </div>
        <span class="text-[11px] text-slate-400 mt-2 block leading-snug">Menunggu alokasi teknisi</span>
      </div>

      <!-- 3. In Progress -->
      <div 
        @click="goToKpi('inProgress')"
        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-blue-500 hover:ring-2 hover:ring-blue-100 group"
        title="Lihat tiket yang sedang ditangani teknisi"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">IN PROGRESS</span>
          <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-blue-600 font-mono tracking-tight">{{ kpiData.inProgress }}</span>
          <span v-if="kpiData.total > 0" class="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span>&darr;</span> 10%
          </span>
          <span v-else class="text-[10px] font-mono text-slate-400">-</span>
        </div>
        <span class="text-[11px] text-slate-400 mt-2 block leading-snug">Investigasi &amp; penanganan</span>
      </div>

      <!-- 4. Waiting / Hold -->
      <div 
        @click="goToKpi('waiting')"
        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-orange-400 hover:ring-2 hover:ring-orange-100 group"
        title="Lihat tiket yang sedang dijeda (Hold)"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">MENUNGGU (HOLD)</span>
          <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-amber-800 font-mono tracking-tight">{{ kpiData.waiting }}</span>
          <span v-if="kpiData.total > 0" class="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span>&rarr;</span> 0%
          </span>
          <span v-else class="text-[10px] font-mono text-slate-400">-</span>
        </div>
        <span class="text-[11px] text-slate-400 mt-2 block leading-snug">Part Indent &amp; Customer</span>
      </div>

      <!-- 5. Closed / Solved -->
      <div 
        @click="goToKpi('solved')"
        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-emerald-400 hover:ring-2 hover:ring-emerald-100 group"
        title="Lihat tiket yang sudah selesai (Resolved / Closed)"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">CLOSED / SOLVED</span>
          <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight">{{ kpiData.solved }}</span>
          <span v-if="kpiData.total > 0" class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span>&uarr;</span> 18%
          </span>
          <span v-else class="text-[10px] font-mono text-slate-400">-</span>
        </div>
        <span class="text-[11px] text-slate-400 mt-2 block leading-snug">Pemulihan tuntas tercapai</span>
      </div>

      <!-- 6. SLA Compliance -->
      <div 
        @click="goToKpi('sla')"
        class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 group"
        title="Buka Laporan Eksekutif Kepatuhan SLA"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">SLA COMPLIANCE</span>
          <svg class="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </div>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-blue-600 group-hover:text-indigo-600 font-mono tracking-tight transition-colors">{{ kpiData.slaRate !== null ? `${kpiData.slaRate}%` : '-' }}</span>
        </div>
        <span class="text-[11px] text-slate-400 mt-2 block leading-snug">{{ kpiData.slaRate !== null ? 'Target 100% Terlaksana' : 'Belum ada tiket insiden' }}</span>
      </div>
    </div>

    <!-- 3. Middle Row 1: Trend Multi-line Chart & Severity Donut -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <!-- Left (7 of 12 cols): Trend Tiket & Penyelesaian Multi-line Chart -->
      <div class="lg:col-span-7 flex flex-col">
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div class="flex items-center space-x-2">
              <h2 class="font-bold text-sm text-slate-900">Trend Tiket &amp; Penyelesaian</h2>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {{ periodLabel }}
              </span>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Grafik volume tiket masuk vs tiket terselesaikan">ⓘ</span>
            </div>
          </div>

          <!-- SVG Multi-line Chart -->
          <div class="flex-1 w-full min-h-[220px] relative pt-2">
            <div v-if="ticketStore.totalTickets === 0" class="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-10">
              <span class="text-xs font-semibold text-slate-500">Belum ada aktivitas tiket pada periode ini</span>
              <span class="text-[11px] text-slate-400 mt-0.5">Grafik trend akan otomatis terbentuk saat tiket baru dibuat</span>
            </div>
            <svg class="w-full h-48 overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
              <defs>
                <!-- Area Fill Gradient for Tiket Baru (Blue) -->
                <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.12" />
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              <!-- Horizontal Grid Lines -->
              <line x1="30" y1="20" x2="590" y2="20" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="30" y1="55" x2="590" y2="55" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="30" y1="90" x2="590" y2="90" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="30" y1="125" x2="590" y2="125" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
              <line x1="30" y1="160" x2="590" y2="160" stroke="#e2e8f0" stroke-width="1" />

              <!-- Y-Axis Labels -->
              <text x="18" y="24" text-anchor="end" class="text-[10px] fill-slate-400 font-mono">{{ trendData.yLabels[4] }}</text>
              <text x="18" y="59" text-anchor="end" class="text-[10px] fill-slate-400 font-mono">{{ trendData.yLabels[3] }}</text>
              <text x="18" y="94" text-anchor="end" class="text-[10px] fill-slate-400 font-mono">{{ trendData.yLabels[2] }}</text>
              <text x="18" y="129" text-anchor="end" class="text-[10px] fill-slate-400 font-mono">{{ trendData.yLabels[1] }}</text>
              <text x="18" y="164" text-anchor="end" class="text-[10px] fill-slate-400 font-mono">{{ trendData.yLabels[0] }}</text>

              <!-- Filled Area Under Tiket Baru -->
              <polygon
                :points="trendData.areaPoints"
                fill="url(#blueAreaGrad)"
              />

              <!-- Line 1: Tiket Baru (Blue) -->
              <polyline
                fill="none"
                stroke="#2563eb"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="trendData.bluePoly"
              />
              <!-- Line 2: Tiket Selesai (Green) -->
              <polyline
                fill="none"
                stroke="#10b981"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="trendData.greenPoly"
              />
              <!-- Line 3: Open / Backlog (Amber) -->
              <polyline
                fill="none"
                stroke="#f59e0b"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :points="trendData.amberPoly"
              />

              <!-- Blue Dots -->
              <circle v-for="(pt, idx) in trendData.blueDots" :key="'b-'+idx" :cx="pt.x" :cy="pt.y" r="3.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5">
                <title>{{ pt.val }} Tiket Baru ({{ trendData.labels[idx] }})</title>
              </circle>

              <!-- Green Dots -->
              <circle v-for="(pt, idx) in trendData.greenDots" :key="'g-'+idx" :cx="pt.x" :cy="pt.y" r="3" fill="#10b981" stroke="#ffffff" stroke-width="1.5">
                <title>{{ pt.val }} Tiket Selesai ({{ trendData.labels[idx] }})</title>
              </circle>

              <!-- Amber Dots -->
              <circle v-for="(pt, idx) in trendData.amberDots" :key="'a-'+idx" :cx="pt.x" :cy="pt.y" r="2.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5">
                <title>{{ pt.val }} Belum Selesai ({{ trendData.labels[idx] }})</title>
              </circle>

              <!-- X-Axis Labels -->
              <text v-for="(lbl, idx) in trendData.labels" :key="'lbl-'+idx" :x="40 + idx * 75" y="176" text-anchor="middle" class="text-[10px] fill-slate-400 font-mono">{{ lbl }}</text>
            </svg>
          </div>

          <!-- Bottom Legend -->
          <div class="flex items-center justify-center space-x-6 pt-3 mt-1 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>Tiket Baru</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Tiket Selesai</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Belum Selesai (Aktif)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right (5 of 12 cols): Distribusi Tiket berdasarkan Severity Donut -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col hover:border-slate-300 transition-all">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div class="flex items-center space-x-1.5">
              <h2 class="font-bold text-sm text-slate-900">Distribusi Tiket (Severity)</h2>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Proporsi tingkat keparahan insiden">ⓘ</span>
            </div>
            <router-link
              to="/tickets"
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
            >
              <span>Lihat Antrean</span>
              <span>&rarr;</span>
            </router-link>
          </div>

          <div class="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <!-- Donut Chart SVG with Center Badge -->
            <div 
              @click="router.push('/tickets')"
              class="relative w-44 h-44 shrink-0 flex items-center justify-center cursor-pointer group"
              title="Klik untuk melihat seluruh antrean tiket"
            >
              <svg class="w-44 h-44 -rotate-90 transform overflow-visible" viewBox="0 0 160 160">
                <!-- Background track -->
                <circle cx="80" cy="80" r="56" fill="transparent" stroke="#f1f5f9" stroke-width="20" />
                
                <!-- 1. Critical (P1) Blue -->
                <g 
                  :style="getSeveritySliceShift('p1')"
                  class="transition-transform duration-300 ease-out"
                >
                  <circle
                    cx="80" cy="80" r="56" fill="transparent"
                    stroke="#2563eb" 
                    :stroke-width="hoveredSeverity === 'p1' ? 24 : 20"
                    :stroke-dasharray="severityDonutArcs.p1.dasharray"
                    :stroke-dashoffset="severityDonutArcs.p1.offset"
                    @click.stop="goToSeverity('HIGH')"
                    @mouseenter="hoveredSeverity = 'p1'"
                    @mouseleave="hoveredSeverity = null"
                    class="transition-all duration-300 cursor-pointer"
                    :class="hoveredSeverity === 'p1' ? 'filter drop-shadow-md' : ''"
                  />
                </g>

                <!-- 2. High (P2) Red -->
                <g 
                  :style="getSeveritySliceShift('p2')"
                  class="transition-transform duration-300 ease-out"
                >
                  <circle
                    cx="80" cy="80" r="56" fill="transparent"
                    stroke="#ef4444" 
                    :stroke-width="hoveredSeverity === 'p2' ? 24 : 20"
                    :stroke-dasharray="severityDonutArcs.p2.dasharray"
                    :stroke-dashoffset="severityDonutArcs.p2.offset"
                    @click.stop="goToSeverity('HIGH')"
                    @mouseenter="hoveredSeverity = 'p2'"
                    @mouseleave="hoveredSeverity = null"
                    class="transition-all duration-300 cursor-pointer"
                    :class="hoveredSeverity === 'p2' ? 'filter drop-shadow-md' : ''"
                  />
                </g>

                <!-- 3. Medium (P3) Amber -->
                <g 
                  :style="getSeveritySliceShift('p3')"
                  class="transition-transform duration-300 ease-out"
                >
                  <circle
                    cx="80" cy="80" r="56" fill="transparent"
                    stroke="#f59e0b" 
                    :stroke-width="hoveredSeverity === 'p3' ? 24 : 20"
                    :stroke-dasharray="severityDonutArcs.p3.dasharray"
                    :stroke-dashoffset="severityDonutArcs.p3.offset"
                    @click.stop="goToSeverity('MEDIUM')"
                    @mouseenter="hoveredSeverity = 'p3'"
                    @mouseleave="hoveredSeverity = null"
                    class="transition-all duration-300 cursor-pointer"
                    :class="hoveredSeverity === 'p3' ? 'filter drop-shadow-md' : ''"
                  />
                </g>

                <!-- 4. Low (P4) Green -->
                <g 
                  :style="getSeveritySliceShift('p4')"
                  class="transition-transform duration-300 ease-out"
                >
                  <circle
                    cx="80" cy="80" r="56" fill="transparent"
                    stroke="#10b981" 
                    :stroke-width="hoveredSeverity === 'p4' ? 24 : 20"
                    :stroke-dasharray="severityDonutArcs.p4.dasharray"
                    :stroke-dashoffset="severityDonutArcs.p4.offset"
                    @click.stop="goToSeverity('LOW')"
                    @mouseenter="hoveredSeverity = 'p4'"
                    @mouseleave="hoveredSeverity = null"
                    class="transition-all duration-300 cursor-pointer"
                    :class="hoveredSeverity === 'p4' ? 'filter drop-shadow-md' : ''"
                  />
                </g>
              </svg>
              <!-- Center Text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-2xl font-black text-slate-900 group-hover:text-blue-600 font-mono tracking-tight transition-colors">{{ kpiData.total }}</span>
                <span class="text-[11px] font-medium text-slate-400 group-hover:text-blue-500 flex items-center gap-0.5">Tiket <span class="text-[9px]">↗</span></span>
              </div>
            </div>

            <!-- Legend with Exact Counts from Mockup -->
            <div class="space-y-2 w-full sm:w-48 text-xs">
              <div 
                @click="goToSeverity('HIGH')"
                @mouseenter="hoveredSeverity = 'p1'"
                @mouseleave="hoveredSeverity = null"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer transition-all duration-200 group border"
                :class="hoveredSeverity === 'p1' ? 'bg-blue-50 border-blue-200 shadow-2xs translate-x-1' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'"
                title="Filter tiket Critical (P1)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-blue-600 transition-transform" :class="hoveredSeverity === 'p1' ? 'scale-125' : ''"></span>
                  <span class="text-slate-700 font-medium" :class="hoveredSeverity === 'p1' ? 'text-blue-700 font-bold' : ''">Critical (P1)</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono" :class="hoveredSeverity === 'p1' ? 'text-blue-600' : ''">{{ severityCounts.p1 }}</span>
                  <span class="text-slate-400 group-hover:text-blue-600 text-xs transition-opacity" :class="hoveredSeverity === 'p1' ? 'opacity-100' : 'opacity-0'">→</span>
                </div>
              </div>

              <div 
                @click="goToSeverity('HIGH')"
                @mouseenter="hoveredSeverity = 'p2'"
                @mouseleave="hoveredSeverity = null"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer transition-all duration-200 group border"
                :class="hoveredSeverity === 'p2' ? 'bg-rose-50 border-rose-200 shadow-2xs translate-x-1' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'"
                title="Filter tiket High (P2)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-rose-500 transition-transform" :class="hoveredSeverity === 'p2' ? 'scale-125' : ''"></span>
                  <span class="text-slate-700 font-medium" :class="hoveredSeverity === 'p2' ? 'text-rose-700 font-bold' : ''">High (P2)</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono" :class="hoveredSeverity === 'p2' ? 'text-rose-600' : ''">{{ severityCounts.p2 }}</span>
                  <span class="text-slate-400 group-hover:text-rose-600 text-xs transition-opacity" :class="hoveredSeverity === 'p2' ? 'opacity-100' : 'opacity-0'">→</span>
                </div>
              </div>

              <div 
                @click="goToSeverity('MEDIUM')"
                @mouseenter="hoveredSeverity = 'p3'"
                @mouseleave="hoveredSeverity = null"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer transition-all duration-200 group border"
                :class="hoveredSeverity === 'p3' ? 'bg-amber-50 border-amber-200 shadow-2xs translate-x-1' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'"
                title="Filter tiket Medium (P3)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-amber-500 transition-transform" :class="hoveredSeverity === 'p3' ? 'scale-125' : ''"></span>
                  <span class="text-slate-700 font-medium" :class="hoveredSeverity === 'p3' ? 'text-amber-700 font-bold' : ''">Medium (P3)</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono" :class="hoveredSeverity === 'p3' ? 'text-amber-600' : ''">{{ severityCounts.p3 }}</span>
                  <span class="text-slate-400 group-hover:text-amber-600 text-xs transition-opacity" :class="hoveredSeverity === 'p3' ? 'opacity-100' : 'opacity-0'">→</span>
                </div>
              </div>

              <div 
                @click="goToSeverity('LOW')"
                @mouseenter="hoveredSeverity = 'p4'"
                @mouseleave="hoveredSeverity = null"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer transition-all duration-200 group border"
                :class="hoveredSeverity === 'p4' ? 'bg-emerald-50 border-emerald-200 shadow-2xs translate-x-1' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'"
                title="Filter tiket Low (P4)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-500 transition-transform" :class="hoveredSeverity === 'p4' ? 'scale-125' : ''"></span>
                  <span class="text-slate-700 font-medium" :class="hoveredSeverity === 'p4' ? 'text-emerald-700 font-bold' : ''">Low (P4)</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono" :class="hoveredSeverity === 'p4' ? 'text-emerald-600' : ''">{{ severityCounts.p4 }}</span>
                  <span class="text-slate-400 group-hover:text-emerald-600 text-xs transition-opacity" :class="hoveredSeverity === 'p4' ? 'opacity-100' : 'opacity-0'">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Middle Row 2: SLA Watch Table & SLA Performance Gauge -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <!-- Left (7 of 12 cols): Pantauan Waktu SLA Aktif (SLA Watch) -->
      <div class="lg:col-span-7 flex flex-col">
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center space-x-1.5">
              <h2 class="font-bold text-sm text-slate-900">Pantauan Waktu SLA Aktif (SLA Watch)</h2>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Pemantauan hitung mundur SLA tiket insiden">ⓘ</span>
            </div>
            <router-link
              to="/tickets"
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <span>&rarr;</span>
            </router-link>
          </div>

          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th class="py-2.5 px-4 font-mono">No. Tiket</th>
                  <th class="py-2.5 px-3">Mitra Pelanggan</th>
                  <th class="py-2.5 px-3">Deskripsi Kendala</th>
                  <th class="py-2.5 px-3 text-center">Sisa Waktu SLA</th>
                  <th class="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="t in liveSlaWatchTickets" 
                  :key="t.ticketNumber"
                  @click="openTicketDetail(t)"
                  class="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td class="py-3 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                    {{ t.ticketNumber }}
                  </td>
                  <td class="py-3 px-3 font-semibold text-slate-800 whitespace-nowrap">
                    {{ t.customerName }}
                  </td>
                  <td class="py-3 px-3 max-w-[200px] truncate text-slate-600" :title="t.title">
                    {{ t.title }}
                  </td>
                  <td class="py-3 px-3 text-center whitespace-nowrap">
                    <span 
                      class="px-2.5 py-1 rounded-md font-mono font-bold text-[11px] border"
                      :class="t.timePillClass"
                    >
                      {{ t.remainingTimeStr }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center whitespace-nowrap">
                    <span 
                      class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                      :class="t.statusPillClass"
                    >
                      {{ t.statusLabel }}
                    </span>
                  </td>
                </tr>
                <tr v-if="liveSlaWatchTickets.length === 0">
                  <td colspan="5" class="py-8 text-center text-slate-400">
                    Belum ada tiket insiden aktif dalam pantauan waktu SLA.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right (5 of 12 cols): SLA Performance Gauge Donut -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col hover:border-slate-300 transition-all">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center space-x-1.5">
              <h2 class="font-bold text-sm text-slate-900">SLA Performance</h2>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Persentase kepatuhan resolusi SLA">ⓘ</span>
            </div>
            <router-link
              to="/reports"
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
            >
              <span>Laporan SLA</span>
              <span>&rarr;</span>
            </router-link>
          </div>

          <div class="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <!-- Donut Gauge -->
            <div 
              @click="router.push('/reports')"
              class="relative w-44 h-44 shrink-0 flex items-center justify-center cursor-pointer group"
              title="Buka Laporan Eksekutif Kepatuhan SLA"
            >
              <svg class="w-44 h-44 -rotate-90 transform overflow-visible" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="56" fill="transparent" stroke="#f1f5f9" stroke-width="18" />
                
                <!-- Green = Within SLA -->
                <g 
                  :style="getSlaSliceShift('within')"
                  class="transition-transform duration-300 ease-out"
                >
                  <circle
                    cx="80" cy="80" r="56" fill="transparent"
                    stroke="#10b981" 
                    :stroke-width="hoveredSla === 'within' ? 22 : 18"
                    :stroke-dasharray="slaPerformanceData.greenDasharray" stroke-dashoffset="0"
                    @click.stop="router.push('/reports')"
                    @mouseenter="hoveredSla = 'within'"
                    @mouseleave="hoveredSla = null"
                    class="transition-all duration-300 cursor-pointer"
                    :class="hoveredSla === 'within' ? 'filter drop-shadow-md' : ''"
                  />
                </g>

                <!-- Red = Breached -->
                <g 
                  :style="getSlaSliceShift('breached')"
                  class="transition-transform duration-300 ease-out"
                >
                  <circle
                    cx="80" cy="80" r="56" fill="transparent"
                    stroke="#ef4444" 
                    :stroke-width="hoveredSla === 'breached' ? 22 : 18"
                    :stroke-dasharray="slaPerformanceData.redDasharray" :stroke-dashoffset="slaPerformanceData.redOffset"
                    @click.stop="router.push({ path: '/tickets', query: { sla: 'breached' } })"
                    @mouseenter="hoveredSla = 'breached'"
                    @mouseleave="hoveredSla = null"
                    class="transition-all duration-300 cursor-pointer"
                    :class="hoveredSla === 'breached' ? 'filter drop-shadow-md' : ''"
                  />
                </g>
              </svg>
              <!-- Center Text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-3xl font-black text-slate-900 group-hover:text-blue-600 font-mono tracking-tight transition-colors">{{ slaPerformanceData.rate !== null ? `${slaPerformanceData.rate}%` : '-' }}</span>
                <span class="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-wider mt-0.5 flex items-center gap-0.5">
                  {{ slaPerformanceData.rate !== null ? 'Within SLA' : 'Belum Ada Data' }}
                  <span v-if="slaPerformanceData.rate !== null" class="text-[9px]">↗</span>
                </span>
              </div>
            </div>

            <!-- Breakdown on right -->
            <div class="space-y-2 w-full sm:w-48 text-xs">
              <div 
                @click="router.push('/reports')"
                @mouseenter="hoveredSla = 'within'"
                @mouseleave="hoveredSla = null"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer transition-all duration-200 group border"
                :class="hoveredSla === 'within' ? 'bg-emerald-50 border-emerald-200 shadow-2xs translate-x-1' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'"
                title="Buka laporan SLA untuk tiket yang tepat waktu (Met)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-500 transition-transform" :class="hoveredSla === 'within' ? 'scale-125' : ''"></span>
                  <span class="text-slate-700 font-medium" :class="hoveredSla === 'within' ? 'text-emerald-700 font-bold' : ''">Within SLA</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono" :class="hoveredSla === 'within' ? 'text-emerald-600' : ''">{{ slaPerformanceData.within }}</span>
                  <span class="text-slate-400 group-hover:text-emerald-600 text-xs transition-opacity" :class="hoveredSla === 'within' ? 'opacity-100' : 'opacity-0'">→</span>
                </div>
              </div>

              <div 
                @click="router.push({ path: '/tickets', query: { tab: 'NEAR_BREACH' } })"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer hover:bg-slate-50 hover:shadow-2xs border border-transparent hover:border-slate-200 transition-all duration-150 group"
                title="Lihat antrean tiket yang mendekati batas SLA (< 2 jam)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-amber-500 group-hover:scale-110 transition-transform"></span>
                  <span class="text-slate-700 font-medium group-hover:text-amber-700">Near Breach</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono group-hover:text-amber-600">{{ slaPerformanceData.nearBreach }}</span>
                  <span class="text-slate-400 group-hover:text-amber-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </div>

              <div 
                @click="router.push({ path: '/tickets', query: { tab: 'NEAR_BREACH' } })"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer hover:bg-slate-50 hover:shadow-2xs border border-transparent hover:border-slate-200 transition-all duration-150 group"
                title="Lihat tiket berisiko pelanggaran SLA (< 1 jam)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-orange-500 group-hover:scale-110 transition-transform"></span>
                  <span class="text-slate-700 font-medium group-hover:text-orange-700">SLA Risk</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono group-hover:text-orange-600">{{ slaPerformanceData.risk }}</span>
                  <span class="text-slate-400 group-hover:text-orange-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </div>

              <div 
                @click="router.push({ path: '/tickets', query: { sla: 'breached' } })"
                @mouseenter="hoveredSla = 'breached'"
                @mouseleave="hoveredSla = null"
                class="flex items-center justify-between p-1.5 -mx-1.5 rounded-lg cursor-pointer transition-all duration-200 group border"
                :class="hoveredSla === 'breached' ? 'bg-rose-50 border-rose-200 shadow-2xs translate-x-1' : 'border-transparent hover:bg-slate-50 hover:border-slate-200'"
                title="Lihat tiket yang melewati batas SLA (Breached)"
              >
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-rose-500 transition-transform" :class="hoveredSla === 'breached' ? 'scale-125' : ''"></span>
                  <span class="text-slate-700 font-medium" :class="hoveredSla === 'breached' ? 'text-rose-700 font-bold' : ''">SLA Breached</span>
                </div>
                <div class="flex items-center space-x-1.5">
                  <span class="font-bold text-slate-900 font-mono" :class="hoveredSla === 'breached' ? 'text-rose-600' : ''">{{ slaPerformanceData.breached }}</span>
                  <span class="text-slate-400 group-hover:text-rose-600 text-xs transition-opacity" :class="hoveredSla === 'breached' ? 'opacity-100' : 'opacity-0'">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Bottom Row 3: Ticket Aktif per Engineer & Top 5 Kategori Tiket -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      <!-- Left (6 of 12 cols): Ticket Aktif per Engineer -->
      <div class="lg:col-span-6 flex flex-col">
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center space-x-1.5">
              <h2 class="font-bold text-sm text-slate-900">Ticket Aktif per Engineer</h2>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Distribusi penugasan tiket aktif per teknisi">ⓘ</span>
            </div>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-mono">
              {{ engineerRoster?.length || 0 }} Teknisi Bertugas
            </span>
          </div>

          <!-- Internal Slim Scroll container with Sticky Header (Option 1) -->
          <div class="overflow-x-auto overflow-y-auto max-h-[260px] scrollbar-thin flex-1 relative">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] shadow-2xs">
                <tr>
                  <th class="py-2.5 px-4 bg-slate-50">Engineer</th>
                  <th class="py-2.5 px-3 bg-slate-50">Assigned</th>
                  <th class="py-2.5 px-3 bg-slate-50">In Progress</th>
                  <th class="py-2.5 px-3 bg-slate-50">Hold</th>
                  <th class="py-2.5 px-3 bg-slate-50">SLA Risk</th>
                  <th class="py-2.5 px-4 bg-slate-50 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="eng in engineerRoster" :key="eng.id" class="hover:bg-slate-50/60 transition-colors">
                  <!-- Name & Avatar -->
                  <td class="py-3 px-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2.5">
                      <div 
                        class="w-7 h-7 rounded-full text-white font-bold flex items-center justify-center text-[10px] shrink-0"
                        :class="eng.avatarBg"
                      >
                        {{ eng.initials }}
                      </div>
                      <span class="font-semibold text-slate-800">{{ eng.name }}</span>
                    </div>
                  </td>

                  <!-- Assigned with bar -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-blue-600 h-1.5 rounded-full" :style="{ width: `${(eng.assigned / 8) * 100}%` }"></div>
                      </div>
                      <span class="font-mono text-slate-700 font-semibold text-[11px]">{{ eng.assigned }}</span>
                    </div>
                  </td>

                  <!-- In Progress with bar -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-emerald-500 h-1.5 rounded-full" :style="{ width: `${(eng.inProgress / 6) * 100}%` }"></div>
                      </div>
                      <span class="font-mono text-slate-700 font-semibold text-[11px]">{{ eng.inProgress }}</span>
                    </div>
                  </td>

                  <!-- Hold with bar -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-amber-500 h-1.5 rounded-full" :style="{ width: `${(eng.hold / 3) * 100}%` }"></div>
                      </div>
                      <span class="font-mono text-slate-700 font-semibold text-[11px]">{{ eng.hold }}</span>
                    </div>
                  </td>

                  <!-- SLA Risk with bar -->
                  <td class="py-3 px-3 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div class="bg-rose-500 h-1.5 rounded-full" :style="{ width: `${(eng.slaRisk / 2) * 100}%` }"></div>
                      </div>
                      <span class="font-mono font-semibold text-[11px]" :class="eng.slaRisk > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'">{{ eng.slaRisk }}</span>
                    </div>
                  </td>

                  <!-- Total -->
                  <td class="py-3 px-4 text-right whitespace-nowrap">
                    <span class="font-mono font-black text-slate-900 text-sm">{{ eng.total }}</span>
                  </td>
                </tr>
                <tr v-if="!engineerRoster || engineerRoster.length === 0">
                  <td colspan="6" class="py-8 text-center text-slate-400">
                    Belum ada akun teknisi / penugasan insiden aktif.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right (6 of 12 cols): Top 5 Kategori Tiket -->
      <div class="lg:col-span-6 flex flex-col">
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex-1 flex flex-col">
          <div class="p-4 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center space-x-1.5">
              <h2 class="font-bold text-sm text-slate-900">Top 5 Kategori Tiket</h2>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Kategori insiden dengan frekuensi tertinggi">ⓘ</span>
            </div>
            <router-link
              to="/tickets"
              class="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
            >
              <span>Lihat Antrean</span>
              <span>&rarr;</span>
            </router-link>
          </div>

          <div class="overflow-x-auto flex-1">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <tr>
                  <th class="py-2.5 px-4">Kategori</th>
                  <th class="py-2.5 px-4 text-center">Jumlah</th>
                  <th class="py-2.5 px-4">Persentase</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-if="topCategories.length === 0">
                  <td colspan="3" class="py-8 text-center text-slate-400">
                    Belum ada insiden tercatat pada kategori operasional.
                  </td>
                </tr>
                <tr 
                  v-else 
                  v-for="cat in topCategories" 
                  :key="cat.name" 
                  @click="router.push({ path: '/tickets', query: { category: cat.name } })"
                  class="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  :title="`Klik untuk menyaring antrean tiket kategori ${cat.name}`"
                >
                  <td class="py-3 px-4 font-semibold text-slate-800 group-hover:text-blue-600 whitespace-nowrap flex items-center gap-1.5">
                    <span>{{ cat.name }}</span>
                    <span class="text-slate-400 group-hover:text-blue-600 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </td>
                  <td class="py-3 px-4 text-center font-mono font-bold text-slate-900 group-hover:text-blue-600 whitespace-nowrap">
                    {{ cat.count }}
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap min-w-[160px]">
                    <div class="flex items-center space-x-3">
                      <div class="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          class="h-2 rounded-full transition-all duration-500" 
                          :class="cat.barColor" 
                          :style="{ width: `${cat.percent}%` }"
                        ></div>
                      </div>
                      <span class="font-mono text-slate-600 font-semibold text-[11px] w-12 text-right">
                        {{ cat.percent }}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const selectedPeriod = ref('30d');
const trendFilter = ref('30d');

const periodOptions = [
  { value: '30d', label: 'Last 30 Days' },
  { value: '14d', label: 'Last 14 Days' },
  { value: '7d', label: 'Last 7 Days' },
  { value: 'today', label: 'Hari Ini' }
];

// Label helper for period
const periodLabel = computed(() => {
  switch (selectedPeriod.value) {
    case 'today': return 'Hari Ini';
    case '7d': return '7 Hari';
    case '14d': return '14 Hari';
    default: return '30 Hari';
  }
});

// Real-time ticking timestamp
const nowTimestamp = ref(Date.now());
let timerInterval = null;

onMounted(async () => {
  ticketStore.fetchInitialDataFromApi();
  authStore.fetchUsers();
  timerInterval = setInterval(() => {
    nowTimestamp.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

// Dynamically filter tickets based on selectedPeriod
const periodFilteredTickets = computed(() => {
  const all = ticketStore.tickets || [];
  if (selectedPeriod.value === '30d') {
    return all;
  }
  const now = nowTimestamp.value;
  let msLimit = 30 * 24 * 3600 * 1000;
  if (selectedPeriod.value === 'today') {
    msLimit = 24 * 3600 * 1000;
  } else if (selectedPeriod.value === '7d') {
    msLimit = 7 * 24 * 3600 * 1000;
  } else if (selectedPeriod.value === '14d') {
    msLimit = 14 * 24 * 3600 * 1000;
  }

  return all.filter(t => {
    if (!t.createdAt) return true;
    const diff = now - new Date(t.createdAt).getTime();
    return diff >= 0 && diff <= msLimit;
  });
});

// KPI Metrics: Reacts to selectedPeriod
const kpiData = computed(() => {
  const storeTotal = ticketStore.totalTickets;
  if (storeTotal === 0) {
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      waiting: 0,
      solved: 0,
      slaRate: null
    };
  }

  if (selectedPeriod.value === '30d') {
    const open = ticketStore.openCount;
    const inProgress = ticketStore.inProgressCount;
    const waiting = ticketStore.holdCount;
    const solved = ticketStore.resolvedCount + ticketStore.closedCount;
    const slaRate = ticketStore.slaComplianceRate;

    return {
      total: storeTotal,
      open,
      inProgress,
      waiting,
      solved,
      slaRate
    };
  }

  const list = periodFilteredTickets.value;
  const total = list.length;
  if (total === 0) {
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      waiting: 0,
      solved: 0,
      slaRate: null
    };
  }

  const open = list.filter(t => t.status === 'OPEN').length;
  const inProgress = list.filter(t => ['IN_PROGRESS', 'ASSIGNED'].includes(t.status) && !t.isPaused).length;
  const waiting = list.filter(t => t.isPaused || ['HOLD', 'PENDING_VENDOR', 'PENDING_CUSTOMER'].includes(t.status)).length;
  const solved = list.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length;
  const withinSla = list.filter(t => !t.isSlaResolutionBreached).length;
  const slaRate = Math.round((withinSla / total) * 100);

  return {
    total,
    open,
    inProgress,
    waiting,
    solved,
    slaRate
  };
});

// Severity Breakdown Counts: Reacts to selectedPeriod
const severityCounts = computed(() => {
  const all = selectedPeriod.value === '30d' ? ticketStore.tickets : periodFilteredTickets.value;
  if (!all || all.length === 0) {
    return { p1: 0, p2: 0, p3: 0, p4: 0 };
  }
  const p1 = all.filter(t => t.severity === 'CRITICAL' || (t.severity === 'HIGH' && t.categoryId === 1)).length;
  const p2 = all.filter(t => t.severity === 'HIGH' && t.categoryId !== 1).length;
  const p3 = all.filter(t => t.severity === 'MEDIUM').length;
  const p4 = all.filter(t => t.severity === 'LOW').length;
  return {
    p1,
    p2,
    p3,
    p4
  };
});

// Dynamic SVG Arc geometry for Severity Donut
const severityDonutArcs = computed(() => {
  const { p1, p2, p3, p4 } = severityCounts.value;
  const total = p1 + p2 + p3 + p4;
  if (total === 0) {
    return {
      p1: { dasharray: `0 351.86`, offset: '0' },
      p2: { dasharray: `0 351.86`, offset: '0' },
      p3: { dasharray: `0 351.86`, offset: '0' },
      p4: { dasharray: `0 351.86`, offset: '0' }
    };
  }
  const c = 351.86;
  const l1 = (p1 / total) * c;
  const l2 = (p2 / total) * c;
  const l3 = (p3 / total) * c;
  const l4 = (p4 / total) * c;
  return {
    p1: { dasharray: `${l1.toFixed(2)} ${c}`, offset: '0' },
    p2: { dasharray: `${l2.toFixed(2)} ${c}`, offset: (-l1).toFixed(2) },
    p3: { dasharray: `${l3.toFixed(2)} ${c}`, offset: (-(l1 + l2)).toFixed(2) },
    p4: { dasharray: `${l4.toFixed(2)} ${c}`, offset: (-(l1 + l2 + l3)).toFixed(2) }
  };
});

// Dynamic SLA Performance Gauge & Breakdown (Reacts to selectedPeriod)
const slaPerformanceData = computed(() => {
  const list = selectedPeriod.value === '30d' ? (ticketStore.tickets || []) : periodFilteredTickets.value;
  if (!list || list.length === 0) {
    return {
      rate: null,
      within: 0,
      nearBreach: 0,
      risk: 0,
      breached: 0,
      greenDasharray: `0 351.86`,
      redDasharray: `0 351.86`,
      redOffset: '0'
    };
  }
  const total = list.length;
  const breached = list.filter(t => t.isSlaResolutionBreached).length;
  const within = list.filter(t => !t.isSlaResolutionBreached).length;
  const risk = list.filter(t => {
    if (['RESOLVED', 'CLOSED'].includes(t.status)) return false;
    if (!t.resolutionDeadline) return false;
    const diffSec = (new Date(t.resolutionDeadline).getTime() - nowTimestamp.value) / 1000;
    return diffSec > 0 && diffSec < 3600;
  }).length;
  const nearBreach = list.filter(t => {
    if (['RESOLVED', 'CLOSED'].includes(t.status)) return false;
    if (t.isNearBreachFlag) return true;
    if (!t.resolutionDeadline) return false;
    const diffSec = (new Date(t.resolutionDeadline).getTime() - nowTimestamp.value) / 1000;
    return diffSec >= 3600 && diffSec < 3 * 3600;
  }).length;

  const rate = Math.round((within / total) * 100);
  const c = 351.86;
  const greenLen = ((rate / 100) * c).toFixed(2);
  const redLen = (((100 - rate) / 100) * c).toFixed(2);
  const redOffset = (-((rate / 100) * c)).toFixed(2);

  return {
    rate,
    within,
    nearBreach,
    risk,
    breached,
    greenDasharray: `${greenLen} ${c}`,
    redDasharray: `${redLen} ${c}`,
    redOffset
  };
});

// Helper for dynamic nice Y-axis scale (0 to maxY across 4 intervals)
function getNiceScale(maxVal) {
  if (maxVal <= 4) return { step: 1, maxY: 4, labels: ['0', '1', '2', '3', '4'] };
  if (maxVal <= 8) return { step: 2, maxY: 8, labels: ['0', '2', '4', '6', '8'] };
  if (maxVal <= 12) return { step: 3, maxY: 12, labels: ['0', '3', '6', '9', '12'] };
  if (maxVal <= 20) return { step: 5, maxY: 20, labels: ['0', '5', '10', '15', '20'] };
  if (maxVal <= 40) return { step: 10, maxY: 40, labels: ['0', '10', '20', '30', '40'] };
  if (maxVal <= 80) return { step: 20, maxY: 80, labels: ['0', '20', '40', '60', '80'] };
  if (maxVal <= 100) return { step: 25, maxY: 100, labels: ['0', '25', '50', '75', '100'] };
  const rawStep = Math.ceil(maxVal / 4);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = Math.ceil(rawStep / magnitude) * magnitude;
  const maxY = step * 4;
  return {
    step,
    maxY,
    labels: [0, step, step * 2, step * 3, maxY].map(String)
  };
}

// Trend Chart Data: 100% data dinamis dari tiket riil dan bereaksi terhadap filter periode
const trendData = computed(() => {
  const allTickets = ticketStore.tickets || [];
  const activePeriod = selectedPeriod.value;
  const now = nowTimestamp.value;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  // Bangun 8 checkpoints waktu & label sumbu X berdasarkan rentang periode
  const checkpoints = [];
  if (activePeriod === 'today') {
    const today = new Date(now);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0).getTime();
    for (let i = 0; i < 8; i++) {
      const timeMs = startOfToday + (i * 3) * 3600 * 1000;
      const hourStr = `${String(i * 3).padStart(2, '0')}:00`;
      checkpoints.push({
        timeMs,
        label: hourStr
      });
    }
  } else if (activePeriod === '7d') {
    for (let i = 0; i < 8; i++) {
      const timeMs = now - (7 - i) * 24 * 3600 * 1000;
      const d = new Date(timeMs);
      const label = i === 7 ? 'Hari Ini' : `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]}`;
      checkpoints.push({ timeMs, label });
    }
  } else if (activePeriod === '14d') {
    for (let i = 0; i < 8; i++) {
      const timeMs = now - (7 - i) * 2 * 24 * 3600 * 1000;
      const d = new Date(timeMs);
      const label = i === 7 ? 'Hari Ini' : `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]}`;
      checkpoints.push({ timeMs, label });
    }
  } else {
    // Default '30d'
    for (let i = 0; i < 8; i++) {
      const timeMs = now - (7 - i) * 4 * 24 * 3600 * 1000;
      const d = new Date(timeMs);
      const label = i === 7 ? 'Hari Ini' : `${String(d.getDate()).padStart(2, '0')} ${monthNames[d.getMonth()]}`;
      checkpoints.push({ timeMs, label });
    }
  }

  // Ambil tiket sesuai cakupan periode aktif
  const ticketsList = activePeriod === '30d' ? allTickets : periodFilteredTickets.value;

  // Hitung jumlah pada setiap checkpoint secara dinamis
  const pointsData = checkpoints.map((cp, idx) => {
    const x = 40 + idx * 75;
    const targetMs = cp.timeMs;

    // 1. Tiket Baru (dibuat pada atau sebelum targetMs)
    const newCount = ticketsList.filter(t => {
      if (!t.createdAt) return false;
      return new Date(t.createdAt).getTime() <= targetMs;
    }).length;

    // 2. Tiket Selesai (resolved pada atau sebelum targetMs)
    const resolvedCount = ticketsList.filter(t => {
      if (t.resolvedAt) {
        return new Date(t.resolvedAt).getTime() <= targetMs;
      }
      if (['RESOLVED', 'CLOSED'].includes(t.status) && t.updatedAt) {
        return new Date(t.updatedAt).getTime() <= targetMs;
      }
      return false;
    }).length;

    // 3. Open (Backlog = Tiket Baru - Tiket Selesai)
    const backlogCount = Math.max(0, newCount - resolvedCount);

    return {
      x,
      label: cp.label,
      newVal: newCount,
      resolvedVal: resolvedCount,
      backlogVal: backlogCount
    };
  });

  // Tentukan skala sumbu Y secara otomatis mengikuti data nyata
  const maxVal = Math.max(
    0,
    ...pointsData.map(p => Math.max(p.newVal, p.resolvedVal, p.backlogVal))
  );
  const scale = getNiceScale(maxVal);

  const getYCoord = (v) => {
    return 160 - (v / scale.maxY) * 140;
  };

  const points = pointsData.map(p => ({
    x: p.x,
    label: p.label,
    blueY: getYCoord(p.newVal),
    greenY: getYCoord(p.resolvedVal),
    amberY: getYCoord(p.backlogVal),
    blueVal: p.newVal,
    greenVal: p.resolvedVal,
    amberVal: p.backlogVal
  }));

  const bluePoly = points.map(p => `${p.x},${p.blueY.toFixed(1)}`).join(' ');
  const greenPoly = points.map(p => `${p.x},${p.greenY.toFixed(1)}`).join(' ');
  const amberPoly = points.map(p => `${p.x},${p.amberY.toFixed(1)}`).join(' ');
  const areaPoints = `40,160 ${bluePoly} 565,160`;

  return {
    yLabels: scale.labels,
    labels: checkpoints.map(c => c.label),
    areaPoints,
    bluePoly,
    greenPoly,
    amberPoly,
    blueDots: points.map(p => ({ x: p.x, y: Number(p.blueY.toFixed(1)), val: p.blueVal })),
    greenDots: points.map(p => ({ x: p.x, y: Number(p.greenY.toFixed(1)), val: p.greenVal })),
    amberDots: points.map(p => ({ x: p.x, y: Number(p.amberY.toFixed(1)), val: p.amberVal }))
  };
});

// Real-Time SLA Watch List: Prioritas Risiko Tertinggi (SLA Breached / SLA Risk) & Deadline Terdekat
const liveSlaWatchTickets = computed(() => {
  const allTickets = ticketStore.tickets || [];
  // Hanya tiket aktif (belum selesai/tutup)
  const activeTickets = allTickets.filter(t => !['RESOLVED', 'CLOSED'].includes(t.status));

  const mapped = activeTickets.map(t => {
    const customer = ticketStore.customers.find(c => c.id === t.customerId);
    const deadlineMs = t.resolutionDeadline ? new Date(t.resolutionDeadline).getTime() : 0;
    const nowMs = nowTimestamp.value;

    const isBreached = Boolean(
      t.isSlaResolutionBreached === true || 
      (deadlineMs > 0 && deadlineMs <= nowMs)
    );

    let diffSec = 0;
    if (!isBreached && deadlineMs > nowMs) {
      diffSec = Math.floor((deadlineMs - nowMs) / 1000);
    } else if (!isBreached && !deadlineMs) {
      diffSec = 3600 * 2;
    }

    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    const remainingTimeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    let timePillClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let statusPillClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    let statusLabel = (t.status || 'OPEN').replace(/_/g, ' ');
    let riskTier = 4; // 1: Breached, 2: <1h, 3: <3h, 4: Normal active, 5: Hold

    if (t.isPaused || ['HOLD', 'PENDING_VENDOR', 'PENDING_CUSTOMER'].includes(t.status)) {
      statusLabel = 'HOLD';
      timePillClass = 'bg-amber-50 text-amber-700 border-amber-200';
      statusPillClass = 'bg-amber-100 text-amber-800 border-amber-200';
      riskTier = 5;
    } else if (isBreached || diffSec === 0) {
      statusLabel = 'SLA RISK';
      timePillClass = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      statusPillClass = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      riskTier = 1; // Prioritas tertinggi
    } else if (diffSec < 3600) {
      statusLabel = 'SLA RISK';
      timePillClass = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      statusPillClass = 'bg-rose-100 text-rose-800 border-rose-200 font-bold';
      riskTier = 2; // Kritis di bawah 1 jam
    } else if (diffSec < 3600 * 3) {
      statusLabel = 'WARNING';
      timePillClass = 'bg-amber-50 text-amber-700 border-amber-200';
      statusPillClass = 'bg-amber-100 text-amber-800 border-amber-200';
      riskTier = 3; // Peringatan di bawah 3 jam
    } else if (t.status === 'IN_PROGRESS') {
      statusLabel = 'IN PROGRESS';
      timePillClass = 'bg-blue-50 text-blue-700 border-blue-200';
      statusPillClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      riskTier = 4;
    } else if (t.status === 'ASSIGNED') {
      statusLabel = 'ASSIGNED';
      timePillClass = 'bg-sky-50 text-sky-700 border-sky-200';
      statusPillClass = 'bg-blue-100 text-blue-800 border-blue-200';
      riskTier = 4;
    } else {
      statusLabel = 'OPEN';
      timePillClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      statusPillClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      riskTier = 4;
    }

    return {
      id: t.id,
      ticketNumber: t.ticketNumber,
      customerName: customer ? customer.name : (t.customerName || 'Mitra Korporat'),
      title: t.title,
      remainingTimeStr,
      statusLabel,
      timePillClass,
      statusPillClass,
      riskTier,
      diffSec,
      deadlineMs: deadlineMs || 0
    };
  });

  // Urutkan berdasarkan risiko tertinggi (Tier 1 teratas) dan batas waktu terdekat
  mapped.sort((a, b) => {
    if (a.riskTier !== b.riskTier) {
      return a.riskTier - b.riskTier;
    }
    // Jika sama-sama breached (Tier 1), dahulukan deadline yang paling awal/lama terlewati
    if (a.riskTier === 1) {
      return a.deadlineMs - b.deadlineMs;
    }
    // Jika tiket aktif, dahulukan sisa waktu terkecil (deadline terdekat)
    return a.diffSec - b.diffSec;
  });

  return mapped.slice(0, 5);
});

const openTicketDetail = (ticketItem) => {
  const matched = ticketStore.tickets.find(t => t.ticketNumber === ticketItem.ticketNumber);
  if (matched) {
    router.push(`/tickets/${matched.id}`);
  } else {
    router.push('/tickets');
  }
};

const goToKpi = (type) => {
  switch (type) {
    case 'total':
      router.push('/tickets');
      break;
    case 'open':
      router.push({ path: '/tickets', query: { status: 'OPEN' } });
      break;
    case 'inProgress':
      router.push({ path: '/tickets', query: { status: 'IN_PROGRESS' } });
      break;
    case 'waiting':
      router.push({ path: '/tickets', query: { status: 'HOLD' } });
      break;
    case 'solved':
      router.push({ path: '/tickets', query: { status: 'RESOLVED' } });
      break;
    case 'sla':
      router.push('/reports');
      break;
  }
};

const goToSeverity = (sev) => {
  router.push({ path: '/tickets', query: { severity: sev } });
};

// Interactive exploded slice hover states & outward shift calculations
const hoveredSeverity = ref(null); // 'p1' | 'p2' | 'p3' | 'p4' | null
const hoveredSla = ref(null); // 'within' | 'breached' | null

const getSeveritySliceShift = (key) => {
  if (hoveredSeverity.value !== key) {
    return { transform: 'translate(0px, 0px)' };
  }
  const { p1, p2, p3, p4 } = severityCounts.value;
  const total = p1 + p2 + p3 + p4;
  if (total === 0) return { transform: 'translate(0px, 0px)' };

  const c = 351.86;
  const l1 = (p1 / total) * c;
  const l2 = (p2 / total) * c;
  const l3 = (p3 / total) * c;
  const l4 = (p4 / total) * c;

  let midDist = 0;
  if (key === 'p1') {
    if (p1 === 0) return { transform: 'translate(0px, 0px)' };
    midDist = l1 / 2;
  } else if (key === 'p2') {
    if (p2 === 0) return { transform: 'translate(0px, 0px)' };
    midDist = l1 + l2 / 2;
  } else if (key === 'p3') {
    if (p3 === 0) return { transform: 'translate(0px, 0px)' };
    midDist = l1 + l2 + l3 / 2;
  } else if (key === 'p4') {
    if (p4 === 0) return { transform: 'translate(0px, 0px)' };
    midDist = l1 + l2 + l3 + l4 / 2;
  }

  const angleRad = (midDist / c) * 2 * Math.PI;
  const shiftDist = 8; // Geser potongan keluar 8px
  const dx = (shiftDist * Math.cos(angleRad)).toFixed(2);
  const dy = (shiftDist * Math.sin(angleRad)).toFixed(2);

  return {
    transform: `translate(${dx}px, ${dy}px)`
  };
};

const getSlaSliceShift = (key) => {
  if (hoveredSla.value !== key) {
    return { transform: 'translate(0px, 0px)' };
  }
  const { within, breached } = slaPerformanceData.value;
  const total = within + breached;
  if (total === 0) return { transform: 'translate(0px, 0px)' };

  const c = 351.86;
  const lWithin = (within / total) * c;
  const lBreached = (breached / total) * c;

  let midDist = 0;
  if (key === 'within') {
    if (within === 0) return { transform: 'translate(0px, 0px)' };
    midDist = lWithin / 2;
  } else if (key === 'breached') {
    if (breached === 0) return { transform: 'translate(0px, 0px)' };
    midDist = lWithin + lBreached / 2;
  }

  const angleRad = (midDist / c) * 2 * Math.PI;
  const shiftDist = 8; // Geser potongan keluar 8px
  const dx = (shiftDist * Math.cos(angleRad)).toFixed(2);
  const dy = (shiftDist * Math.sin(angleRad)).toFixed(2);

  return {
    transform: `translate(${dx}px, ${dy}px)`
  };
};

// Engineer Workload Roster (Matches mockup Frame 09 + live store calculation)
const engineerRoster = computed(() => {
  const engineers = (authStore.users || []).filter(u => u.roleCode === 'ENGINEER');
  const bgPalette = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-pink-600'];

  const allTickets = ticketStore.tickets || [];

  const roster = engineers.map((user, idx) => {
    const userTickets = allTickets.filter(t => t.assignedToId === user.id && !['RESOLVED', 'CLOSED'].includes(t.status));
    const assigned = userTickets.filter(t => ['ASSIGNED', 'OPEN'].includes(t.status)).length;
    const inProgress = userTickets.filter(t => t.status === 'IN_PROGRESS' && !t.isPaused).length;
    const hold = userTickets.filter(t => ['PENDING_VENDOR', 'PENDING_CUSTOMER', 'PENDING'].includes(t.status) || t.isPaused).length;
    const slaRisk = userTickets.filter(t => {
      if (!t.resolutionDeadline || t.isPaused) return false;
      const diffSec = (new Date(t.resolutionDeadline).getTime() - nowTimestamp.value) / 1000;
      return diffSec > 0 && diffSec < 3600;
    }).length;

    const parts = (user.name || '').trim().split(/\s+/);
    const initials = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : (parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'U');

    return {
      id: user.id,
      name: user.name,
      initials,
      avatarBg: bgPalette[idx % bgPalette.length],
      assigned,
      inProgress,
      hold,
      slaRisk,
      total: userTickets.length
    };
  }).filter(e => e.total > 0);

  return roster;
});

// Top 5 Incident Categories (Dynamic: automatically aggregates from existing categories & tickets)
const topCategories = computed(() => {
  const allTickets = selectedPeriod.value === '30d' ? (ticketStore.tickets || []) : periodFilteredTickets.value;
  const total = allTickets.length;

  const getTicketCategoryName = (t) => {
    if (t.categoryName && t.categoryName.trim()) return t.categoryName.trim();
    if (t.category?.name && t.category.name.trim()) return t.category.name.trim();
    if (t.categoryId && ticketStore.categories) {
      const found = ticketStore.categories.find(c => c.id === Number(t.categoryId));
      if (found && found.name) return found.name.trim();
    }
    return 'Lainnya';
  };

  const countsMap = new Map();

  // 1. Inisialisasi dari kategori yang terdaftar di sistem master
  if (Array.isArray(ticketStore.categories)) {
    ticketStore.categories.forEach(c => {
      if (c && c.name) {
        countsMap.set(c.name.trim(), 0);
      }
    });
  }

  // 2. Akumulasi insiden periode aktif
  allTickets.forEach(t => {
    const catName = getTicketCategoryName(t);
    countsMap.set(catName, (countsMap.get(catName) || 0) + 1);
  });

  const palette = [
    'bg-blue-600',
    'bg-indigo-600',
    'bg-cyan-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-emerald-500',
    'bg-purple-600'
  ];

  // 3. Urutkan berdasarkan frekuensi terbanyak (descending) dan ambil Top 5
  const sorted = Array.from(countsMap.entries())
    .map(([name, count]) => ({
      name,
      count
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 5);

  return sorted.map((cat, idx) => ({
    name: cat.name,
    count: cat.count,
    barColor: palette[idx % palette.length],
    percent: total > 0 ? Number(((cat.count / total) * 100).toFixed(1)) : 0
  }));
});
</script>

<style scoped>
/* Ultra-slim smooth scrollbar for dashboard tables */
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 9999px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
