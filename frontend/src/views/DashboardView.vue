<template>
  <div class="space-y-6 animate-in fade-in duration-200">
    <!-- 1. Header: Mission Control Console (Figma Spec) -->
    <div class="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-800 relative overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <!-- Left: Node & Salutation -->
        <div>
          <div class="flex items-center space-x-2 text-xs font-mono mb-1.5">
            <span class="text-blue-400 font-bold uppercase tracking-widest text-[11px]">Mission Control Console</span>
            <span class="text-slate-500">•</span>
            <span class="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-400/20">
              NODE-JKT-01A
            </span>
            <span class="text-slate-500">•</span>
            <span class="text-emerald-400 font-bold flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              SLA Engine Active
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Selamat Bertugas, {{ authStore.currentUser.name }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Ikhtisar operasional real-time tiket enterprise, tren beban insiden, dan kepatuhan SLA 24x7 PT Global Transformasi Teknologi.
          </p>

          <!-- Quick Action Buttons -->
          <div class="flex items-center space-x-3 mt-4">
            <router-link
              to="/tickets"
              class="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all transform active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>Buka Antrean Tiket</span>
            </router-link>

            <router-link
              v-if="authStore.currentUser.roleCode === 'ADMIN'"
              to="/tickets/create"
              class="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
            >
              <span>+ Buat Tiket</span>
            </router-link>
          </div>
        </div>

        <!-- Right: Core Telemetry & Subsystem Health Card (Figma Spec) -->
        <div class="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl p-4 sm:p-4.5 shrink-0 max-w-md">
          <div class="flex items-center justify-between border-b border-slate-700/80 pb-2.5 mb-3">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-300">Core Telemetry</span>
            </div>
            <span class="text-xs font-black text-emerald-400 font-mono">99.98% SLA Uptime</span>
          </div>

          <!-- 4 Subsystem status indicators -->
          <div class="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div class="flex items-center justify-between p-1.5 bg-slate-900/60 rounded border border-slate-800">
              <span class="text-slate-400 text-[10px]">TICKETING SYSTEM</span>
              <span class="text-emerald-400 font-bold text-[10px]">99.9%</span>
            </div>
            <div class="flex items-center justify-between p-1.5 bg-slate-900/60 rounded border border-slate-800">
              <span class="text-slate-400 text-[10px]">EMAIL RELAY</span>
              <span class="text-emerald-400 font-bold text-[10px]">OK</span>
            </div>
            <div class="flex items-center justify-between p-1.5 bg-slate-900/60 rounded border border-slate-800">
              <span class="text-slate-400 text-[10px]">SLA ENGINE</span>
              <span class="text-emerald-400 font-bold text-[10px]">Real-Time</span>
            </div>
            <div class="flex items-center justify-between p-1.5 bg-slate-900/60 rounded border border-slate-800">
              <span class="text-slate-400 text-[10px]">KB RUNBOOKS</span>
              <span class="text-blue-400 font-bold text-[10px]">v2.8 Active</span>
            </div>
          </div>
          <div class="mt-2 text-[10px] text-slate-400 font-mono text-right">
            Active Engine: Dual Sync HA
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 6 KPI Metric Cards (Figma Operational Dashboard) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <!-- 1. Total Tickets -->
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tiket</span>
        <div class="text-2xl font-black text-slate-900 font-mono mt-1">{{ ticketStore.totalTickets }}</div>
        <span class="text-[11px] text-emerald-600 font-bold mt-0.5 block">&uarr; +12% vs mgg lalu</span>
      </div>

      <!-- 2. Open -->
      <div class="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs">
        <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Open (Baru)</span>
        <div class="text-2xl font-black text-amber-800 font-mono mt-1">{{ ticketStore.openCount }}</div>
        <span class="text-[11px] text-amber-600 font-medium mt-0.5 block">Needs initial triage</span>
      </div>

      <!-- 3. In Progress -->
      <div class="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20 shadow-xs">
        <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">In Progress</span>
        <div class="text-2xl font-black text-blue-800 font-mono mt-1">{{ ticketStore.inProgressCount }}</div>
        <span class="text-[11px] text-blue-600 font-medium mt-0.5 block">Active troubleshooting</span>
      </div>

      <!-- 4. Waiting -->
      <div class="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-xs">
        <span class="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Menunggu</span>
        <div class="text-2xl font-black text-purple-800 font-mono mt-1">{{ waitingCount }}</div>
        <span class="text-[11px] text-purple-600 font-medium mt-0.5 block">Vendor & Customer</span>
      </div>

      <!-- 5. Resolved Today -->
      <div class="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
        <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Selesai (Resolved)</span>
        <div class="text-2xl font-black text-emerald-800 font-mono mt-1">{{ ticketStore.resolvedCount }}</div>
        <span class="text-[11px] text-emerald-600 font-medium mt-0.5 block">Rata-rata 3.8j MTTR</span>
      </div>

      <!-- 6. SLA Breached Alert Card -->
      <div 
        class="p-4 rounded-xl border shadow-xs"
        :class="breachedCount > 0 ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'"
      >
        <span 
          class="text-[10px] font-bold uppercase tracking-wider block"
          :class="breachedCount > 0 ? 'text-rose-700' : 'text-slate-400'"
        >
          SLA Breached
        </span>
        <div 
          class="text-2xl font-black font-mono mt-1"
          :class="breachedCount > 0 ? 'text-rose-700 animate-pulse' : 'text-slate-900'"
        >
          {{ breachedCount }}
        </div>
        <span 
          class="text-[11px] font-bold mt-0.5 block"
          :class="breachedCount > 0 ? 'text-rose-600' : 'text-emerald-600'"
        >
          {{ breachedCount > 0 ? 'Perlu tindakan cepat' : 'Semua tiket aman' }}
        </span>
      </div>
    </div>

    <!-- 3. Operational Grid: Left Analytics + Right SLA Timers & Rosters -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left Column (8 of 12 cols): Dual-Stream Trends & Recent High-Impact Tickets -->
      <div class="lg:col-span-8 space-y-5">
        <!-- 3.1 Ticket Volume & Resolution Trends (14 DAYS) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-black text-slate-900 text-sm">Ticket Volume &amp; Resolution Trends</h3>
                <span class="text-[10px] font-bold font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  14 DAYS
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                Perbandingan volume tiket masuk (Intake) vs kecepatan terselesaikan (Resolved)
              </p>
            </div>

            <!-- Legend & Toggle -->
            <div class="flex items-center space-x-4 text-xs font-mono">
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                <span class="text-slate-600 font-semibold">Intake</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span class="text-slate-600 font-semibold">Resolved</span>
              </div>
            </div>
          </div>

          <!-- SVG Dual-Stream Curved Area Chart -->
          <div class="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div class="relative w-full overflow-hidden" style="height: 180px;">
              <svg class="w-full h-full" :viewBox="`0 0 ${trendChartSvg.width} ${trendChartSvg.height}`" preserveAspectRatio="none">
                <!-- Grid Guidelines -->
                <line 
                  v-for="lineVal in [5, 10, 15]" 
                  :key="lineVal"
                  :x1="trendChartSvg.padLeft" 
                  :y1="trendChartSvg.baselineY - (lineVal / 18) * trendChartSvg.chartH" 
                  :x2="trendChartSvg.width - 14" 
                  :y2="trendChartSvg.baselineY - (lineVal / 18) * trendChartSvg.chartH" 
                  stroke="#E2E8F0" 
                  stroke-dasharray="3 3" 
                  stroke-width="1"
                />

                <!-- Area Gradient Fill -->
                <defs>
                  <linearGradient id="blueIntakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#2563EB" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="#2563EB" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <!-- Filled Area -->
                <path :d="trendChartSvg.areaPath" fill="url(#blueIntakeGrad)" />

                <!-- Smooth Curve Line -->
                <path :d="trendChartSvg.linePath" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" />

                <!-- Data Points -->
                <g v-for="pt in trendChartSvg.points" :key="pt.label">
                  <circle 
                    :cx="pt.x" 
                    :cy="pt.y" 
                    r="4" 
                    :fill="pt.breached > 0 ? '#EF4444' : '#2563EB'" 
                    stroke="#FFFFFF" 
                    stroke-width="2" 
                    class="transition-all hover:scale-150 cursor-pointer"
                  />
                  <!-- X-Axis Label -->
                  <text 
                    :x="pt.x" 
                    :y="trendChartSvg.baselineY + 16" 
                    font-size="10" 
                    fill="#64748B" 
                    text-anchor="middle" 
                    font-family="monospace"
                  >
                    {{ pt.label }}
                  </text>
                </g>
              </svg>
            </div>

            <!-- Bottom Stats Strip (Figma Spec) -->
            <div class="grid grid-cols-3 gap-3 pt-3 mt-3 border-t border-slate-200/70 text-center text-xs">
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Daily Avg Intake</span>
                <span class="text-base font-black text-slate-800 font-mono">18.4</span>
              </div>
              <div class="border-x border-slate-200/70">
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Daily Avg Cleared</span>
                <span class="text-base font-black text-emerald-600 font-mono">17.1</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Intake-to-Resolve</span>
                <span class="text-base font-black text-blue-600 font-mono">1:0.93</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3.2 Recent High-Impact Tickets (Compact Widget) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2">
              <h3 class="font-black text-slate-900 text-sm">Recent High-Impact Tickets</h3>
              <span class="text-[10px] font-bold font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                Critical Focus
              </span>
            </div>

            <router-link
              to="/tickets"
              class="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 underline decoration-blue-200"
            >
              <span>Lihat Semua Antrean &rarr;</span>
            </router-link>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th class="pb-2">No. Tiket</th>
                  <th class="pb-2">Mitra</th>
                  <th class="pb-2">Judul Kendala</th>
                  <th class="pb-2">Kategori</th>
                  <th class="pb-2 text-center">Severity</th>
                  <th class="pb-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium">
                <tr
                  v-for="t in recentCriticalTickets"
                  :key="t.id"
                  @click="$router.push(`/tickets/${t.id}`)"
                  class="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td class="py-2.5 font-mono font-bold text-blue-600 group-hover:underline">
                    {{ t.ticketNumber }}
                  </td>
                  <td class="py-2.5 font-semibold text-slate-800">
                    {{ getCustomerName(t.customerId) }}
                  </td>
                  <td class="py-2.5 max-w-[220px] truncate text-slate-700">
                    {{ t.title }}
                  </td>
                  <td class="py-2.5">
                    <span class="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded">
                      {{ getCategoryName(t.categoryId) }}
                    </span>
                  </td>
                  <td class="py-2.5 text-center">
                    <span 
                      :class="[
                        'text-[10px] font-bold px-1.5 py-0.5 rounded font-mono',
                        t.severity === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      ]"
                    >
                      {{ t.severity }}
                    </span>
                  </td>
                  <td class="py-2.5 text-right">
                    <span class="text-blue-600 font-bold text-xs group-hover:translate-x-0.5 inline-block transition-transform">
                      &rarr;
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3.3 MTTR vs Tolerance Thresholds (Bullet Performance) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-slate-900 text-sm">Waktu Pemulihan (MTTR) vs Batas Toleransi SLA</h3>
              <p class="text-xs text-slate-500 mt-0.5">Realisasi kecepatan penyelesaian kendala dibanding target SLA kontrak</p>
            </div>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-mono">
              100% Target Met
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              v-for="card in mttrPerformanceCards" 
              :key="card.code"
              class="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2"
            >
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center space-x-2">
                  <span class="font-mono font-bold px-1.5 py-0.5 rounded text-[10px]" :class="card.badgeColor">{{ card.code }}</span>
                  <span class="font-bold text-slate-800 text-[11px]">{{ card.label }}</span>
                </div>
                <span class="font-mono font-bold text-emerald-700 text-[11px]">{{ card.speedup }}</span>
              </div>
              <div class="flex items-baseline justify-between text-xs font-mono">
                <span class="text-slate-500">Realisasi: <strong class="text-slate-900">{{ card.actualLabel }}</strong></span>
                <span class="text-slate-400 text-[11px]">Batas: {{ card.targetLabel }}</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full bg-gradient-to-r transition-all"
                  :class="card.barColor"
                  :style="{ width: `${card.utilization}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (4 of 12 cols): SLA Watch Timers, Customer Load, and On-Duty Roster -->
      <div class="lg:col-span-4 space-y-5">
        <!-- 3.4 SLA Performance Summary (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-blue-600"></span>
              <h3 class="font-black text-slate-900 text-xs uppercase tracking-wider">SLA Performance</h3>
            </div>
            <span class="text-[10px] font-mono text-slate-400 font-bold">CYCLE: BULAN INI</span>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-slate-600 font-medium">Response SLA Compliance</span>
                <span class="font-mono font-black text-slate-900">96.4%</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full rounded-full" style="width: 96.4%"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Target: 95.0%</span>
                <span class="text-emerald-600 font-bold">+1.4% margin</span>
              </div>
            </div>

            <div>
              <div class="flex justify-between items-baseline mb-1">
                <span class="text-slate-600 font-medium">Resolution SLA Compliance</span>
                <span class="font-mono font-black text-slate-900">92.8%</span>
              </div>
              <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 92.8%"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Target: 90.0%</span>
                <span class="text-emerald-600 font-bold">+2.8% margin</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3.5 Active SLA Timers Under Watch (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <h3 class="font-black text-slate-900 text-xs uppercase tracking-wider">Active SLA Timers Under Watch</h3>
            </div>
            <span class="text-[10px] font-bold text-rose-600 font-mono bg-rose-50 px-1.5 py-0.5 rounded">
              High Priority
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div 
              v-for="timer in activeSlaTimers" 
              :key="timer.ticketNumber"
              class="p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-all bg-slate-50/50"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono font-bold text-blue-600">{{ timer.ticketNumber }}</span>
                <span class="font-mono font-bold text-[11px] px-2 py-0.5 rounded" :class="timer.countdownBg">
                  {{ timer.remaining }}
                </span>
              </div>
              <div class="text-[11px] font-semibold text-slate-800">{{ timer.customer }}</div>
              <div class="text-[10px] text-slate-500 truncate mt-0.5">{{ timer.issue }}</div>
            </div>
          </div>
        </div>

        <!-- 3.6 Enterprise Customer Load (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 class="font-black text-slate-900 text-xs uppercase tracking-wider">Enterprise Customer Load</h3>
            <span class="text-[10px] text-slate-400 font-mono font-bold">4 MITRA</span>
          </div>

          <div class="space-y-2 text-xs">
            <div 
              v-for="c in customerLoadData" 
              :key="c.name"
              class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center space-x-2">
                <span class="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] font-mono" :class="c.bgClass">
                  {{ c.code }}
                </span>
                <div>
                  <span class="font-bold text-slate-800 text-[11px] block">{{ c.name }}</span>
                  <span class="text-[10px] text-slate-400 block">{{ c.tier }}</span>
                </div>
              </div>
              <span class="bg-blue-50 text-blue-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                {{ c.count }} tiket
              </span>
            </div>
          </div>
        </div>

        <!-- 3.7 On-Duty Roster (Shift 1) (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 class="font-black text-slate-900 text-xs uppercase tracking-wider">On-Duty Roster (Shift 1)</h3>
            </div>
            <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
              4 Active
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div 
              v-for="eng in onDutyRoster" 
              :key="eng.id"
              class="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50/50"
            >
              <div class="flex items-center space-x-2.5">
                <div class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs font-mono">
                  {{ eng.initials }}
                </div>
                <div>
                  <div class="font-bold text-slate-800 text-[11px] leading-tight">{{ eng.name }}</div>
                  <div class="text-[10px] text-slate-400">{{ eng.role }}</div>
                </div>
              </div>

              <div class="text-right">
                <span class="text-[10px] font-mono font-bold block" :class="eng.statusColorClass">
                  {{ eng.status }}
                </span>
                <span class="text-[9px] text-slate-400 font-mono">{{ eng.activeCount }} aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { ON_DUTY_ROSTER } from '../data/mockData';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

// Counts
const waitingCount = computed(() => {
  return ticketStore.tickets.filter(t => ['PENDING_VENDOR', 'PENDING_CUSTOMER'].includes(t.status)).length;
});

const breachedCount = computed(() => {
  return ticketStore.tickets.filter(t => t.isSlaResolutionBreached).length;
});

const recentCriticalTickets = computed(() => {
  return ticketStore.tickets.slice(0, 4);
});

// Helper names
const getCustomerName = (id) => {
  const c = ticketStore.customers.find(item => item.id === Number(id));
  return c ? c.name : 'Unknown';
};

const getCategoryName = (id) => {
  const cat = ticketStore.categories.find(item => item.id === Number(id));
  return cat ? cat.name : 'Umum';
};

// SVG Dual-Stream Area Chart Data (Figma 14-day Intake vs Resolved)
const trendChartSvg = computed(() => {
  const data = [
    { label: '12 May', total: 11, breached: 0 },
    { label: '14 May', total: 16, breached: 0 },
    { label: '16 May', total: 14, breached: 0 },
    { label: '18 May', total: 18, breached: 1 },
    { label: '20 May', total: 15, breached: 0 },
    { label: '22 May', total: 12, breached: 0 },
    { label: '24 May', total: 9, breached: 0 }
  ];

  const width = 540;
  const height = 150;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 18;
  const padBottom = 26;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxY = 20;

  const points = data.map((d, i) => {
    const x = padLeft + (i / (data.length - 1)) * chartW;
    const y = padTop + chartH - (d.total / maxY) * chartH;
    return { ...d, x, y, index: i };
  });

  let linePath = '';
  if (points.length > 0) {
    linePath = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 4;
      const cp1y = p1.y + (p2.y - p0.y) / 4;
      const cp2x = p2.x - (p3.x - p1.x) / 4;
      const cp2y = p2.y - (p3.y - p1.y) / 4;

      linePath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
  }

  const baselineY = padTop + chartH;
  const lastPoint = points[points.length - 1] || { x: width - padRight, y: baselineY };
  const firstPoint = points[0] || { x: padLeft, y: baselineY };
  const areaPath = linePath ? `${linePath} L ${lastPoint.x.toFixed(1)} ${baselineY} L ${firstPoint.x.toFixed(1)} ${baselineY} Z` : '';

  return { width, height, padLeft, chartW, chartH, baselineY, points, linePath, areaPath };
});

// Active SLA Timers (Figma Spec)
const activeSlaTimers = [
  {
    ticketNumber: 'INC-2026-00128',
    customer: 'Dinas Kominfo Banten',
    issue: 'Switch VLAN trunk packet drops',
    remaining: '00:45:12',
    countdownBg: 'bg-rose-100 text-rose-700'
  },
  {
    ticketNumber: 'INC-2026-00125',
    customer: 'PT Astra International Tbk',
    issue: 'Storage controller failover sync',
    remaining: '01:24:46',
    countdownBg: 'bg-amber-100 text-amber-700'
  }
];

// Customer Load (Figma Spec)
const customerLoadData = [
  { code: 'BCA', name: 'PT Bank Central Asia', tier: 'PKS 24x7 Platinum', count: 14, bgClass: 'bg-blue-600 text-white' },
  { code: 'SIL', name: 'RS Siloam Hospital', tier: 'PKS 24x7 Platinum', count: 11, bgClass: 'bg-indigo-600 text-white' },
  { code: 'KMN', name: 'Dinas Kominfo Banten', tier: 'PKS 24x7 Gold', count: 8, bgClass: 'bg-emerald-600 text-white' },
  { code: 'AST', name: 'PT Astra International', tier: 'PKS 24x7 Enterprise', count: 7, bgClass: 'bg-amber-600 text-white' }
];

// On-Duty Roster mapping
const onDutyRoster = computed(() => {
  return ON_DUTY_ROSTER.map(eng => ({
    ...eng,
    statusColorClass: eng.statusColor === 'emerald' ? 'text-emerald-600' : eng.statusColor === 'amber' ? 'text-amber-600' : 'text-blue-600'
  }));
});

// MTTR Performance Cards
const mttrPerformanceCards = [
  {
    code: 'P1',
    label: 'Critical',
    targetLabel: '4 Jam',
    actualLabel: '2.4 Jam',
    speedup: '40% Lebih Cepat',
    utilization: 60,
    badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200',
    barColor: 'from-rose-500 to-rose-600'
  },
  {
    code: 'P2',
    label: 'Major',
    targetLabel: '8 Jam',
    actualLabel: '5.1 Jam',
    speedup: '36% Lebih Cepat',
    utilization: 64,
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
    barColor: 'from-amber-500 to-amber-600'
  },
  {
    code: 'P3',
    label: 'Medium',
    targetLabel: '24 Jam',
    actualLabel: '13.8 Jam',
    speedup: '42% Lebih Cepat',
    utilization: 58,
    badgeColor: 'bg-sky-100 text-sky-800 border border-sky-200',
    barColor: 'from-sky-500 to-blue-600'
  },
  {
    code: 'P4',
    label: 'Low',
    targetLabel: '48 Jam',
    actualLabel: '22.0 Jam',
    speedup: '54% Lebih Cepat',
    utilization: 46,
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    barColor: 'from-emerald-500 to-teal-600'
  }
];
</script>
