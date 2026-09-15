<template>
  <div class="space-y-6">
    <!-- Top Welcome Banner & Summary -->
    <div class="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold uppercase tracking-wider bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Peran Aktif: {{ authStore.currentUser.roleCode }}
            </span>
            <span class="text-xs text-slate-300 font-mono">Standar Waktu UTC+0 | Display WIB</span>
          </div>
          <h1 class="text-2xl font-extrabold text-white mt-2">Selamat Datang, {{ authStore.currentUser.name }}</h1>
          <p class="text-sm text-slate-300 mt-1 max-w-xl">
            Sistem Helpdesk Ticketing Internal PT Global Transformasi Teknologi. Pantau antrean tiket, penanganan bertahap, dan kepatuhan SLA 24/7.
          </p>
        </div>

        <!-- Quick Action on CPIG / Admin only -->
        <div v-if="['CPIG', 'ADMIN'].includes(authStore.currentUser.roleCode)" class="flex items-center space-x-3">
          <router-link
            to="/tickets/create"
            class="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition-all transform active:scale-95 text-sm"
          >
            <span>+ Buat Tiket Cepat</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 6 KPI Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span class="text-xs text-slate-500 font-medium">Total Tiket</span>
        <div class="text-2xl font-bold text-slate-900 mt-1">{{ ticketStore.totalTickets }}</div>
        <span class="text-[10px] text-slate-400">Seluruh laporan tercatat</span>
      </div>

      <div class="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
        <span class="text-xs text-amber-700 font-medium">Antrean (Open)</span>
        <div class="text-2xl font-bold text-amber-800 mt-1">{{ ticketStore.openCount }}</div>
        <span class="text-[10px] text-amber-600">Menunggu penanganan</span>
      </div>

      <div class="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm">
        <span class="text-xs text-blue-700 font-medium">Dalam Pengerjaan</span>
        <div class="text-2xl font-bold text-blue-800 mt-1">{{ ticketStore.inProgressCount }}</div>
        <span class="text-[10px] text-blue-600">Aktif & Pending SLA</span>
      </div>

      <div class="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
        <span class="text-xs text-emerald-700 font-medium">Resolved</span>
        <div class="text-2xl font-bold text-emerald-800 mt-1">{{ ticketStore.resolvedCount }}</div>
        <span class="text-[10px] text-emerald-600">Masa tunggu 3 hari</span>
      </div>

      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span class="text-xs text-slate-500 font-medium">Closed</span>
        <div class="text-2xl font-bold text-slate-700 mt-1">{{ ticketStore.closedCount }}</div>
        <span class="text-[10px] text-slate-400">Tuntas & Terarsip</span>
      </div>

      <div class="bg-white p-4 rounded-xl border border-blue-300 bg-blue-50 shadow-sm">
        <span class="text-xs text-blue-800 font-bold">Kepatuhan SLA</span>
        <div class="text-2xl font-extrabold text-blue-700 mt-1">{{ ticketStore.slaComplianceRate }}%</div>
        <span class="text-[10px] text-blue-600 font-medium">Target 24/7 Tercapai</span>
      </div>
    </div>

    <!-- Executive Trend & Analytics Dashboard (Featured for MANAGEMENT & Admins) -->
    <div 
      v-if="['MANAGEMENT', 'ADMIN'].includes(authStore.currentUser.roleCode) || showAnalyticsSection" 
      class="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm space-y-5 animate-in fade-in duration-200"
    >
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </span>
            <h2 class="text-base font-extrabold text-slate-900">Tren Analitik & Kinerja Operasional Eksekutif</h2>
            <span class="text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
              Live Overview
            </span>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Visualisasi tren beban insiden mingguan, efektivitas waktu perbaikan (MTTR), dan konsentrasi kendala mitra korporat.
          </p>
        </div>

        <!-- Period Toggle for Management -->
        <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            @click="trendPeriod = 'THIS_WEEK'"
            class="px-2.5 py-1 rounded font-semibold transition-all"
            :class="trendPeriod === 'THIS_WEEK' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
          >
            Pekan Ini (W37)
          </button>
          <button
            @click="trendPeriod = 'THIS_MONTH'"
            class="px-2.5 py-1 rounded font-semibold transition-all"
            :class="trendPeriod === 'THIS_MONTH' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-800'"
          >
            Bulan Ini (Sep 2026)
          </button>
        </div>
      </div>

      <!-- 4-Grid Tailored Analytics Layout (Optimized for Laptop 13" & Desktop) -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
        <!-- 1. Smooth Area Trend Chart: Volume Insiden & Kepatuhan SLA -->
        <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Tren Beban Insiden & Kepatuhan SLA</h3>
                <span class="text-xs text-slate-500 mt-0.5 block">Volume harian dan ketepatan pemenuhan komitmen waktu</span>
              </div>
              <div class="flex items-center space-x-3 text-xs self-start sm:self-auto">
                <span class="flex items-center space-x-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs"></span>
                  <span class="text-slate-600 font-medium">SLA Met</span>
                </span>
                <span class="flex items-center space-x-1.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs"></span>
                  <span class="text-slate-600 font-medium">Breached</span>
                </span>
              </div>
            </div>

            <!-- Dynamic SVG Area Trend Chart Card -->
            <div class="relative mt-4 bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
              <!-- Hover Floating Badge (if hovering on a point) -->
              <div 
                v-if="activeTrendHover" 
                class="absolute top-3 right-3 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-md shadow-lg z-10 flex items-center space-x-2"
              >
                <span class="font-bold">{{ activeTrendHover.date }}:</span>
                <span class="text-emerald-400 font-bold">{{ activeTrendHover.met }} Met</span>
                <span v-if="activeTrendHover.breached > 0" class="text-rose-400 font-bold">({{ activeTrendHover.breached }} Breached)</span>
                <span class="text-slate-300">Total: {{ activeTrendHover.total }}</span>
              </div>

              <svg 
                class="w-full h-44 overflow-visible"
                :viewBox="`0 0 ${trendChartSvg.width} ${trendChartSvg.height}`"
              >
                <defs>
                  <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.32" />
                    <stop offset="85%" stop-color="#3B82F6" stop-opacity="0.05" />
                    <stop offset="100%" stop-color="#3B82F6" stop-opacity="0" />
                  </linearGradient>
                </defs>

                <!-- Horizontal Dashed Grid Guidelines -->
                <line 
                  v-for="yVal in [15, 10, 5]" 
                  :key="yVal"
                  :x1="trendChartSvg.padLeft" 
                  :y1="trendChartSvg.height - 26 - (yVal / 18) * trendChartSvg.chartH" 
                  :x2="trendChartSvg.width - 14" 
                  :y2="trendChartSvg.height - 26 - (yVal / 18) * trendChartSvg.chartH" 
                  stroke="#E2E8F0" 
                  stroke-dasharray="3 3" 
                  stroke-width="1"
                />

                <!-- Y-Axis Ticks -->
                <text 
                  v-for="yVal in [15, 10, 5]" 
                  :key="`lbl-${yVal}`"
                  :x="trendChartSvg.padLeft - 6" 
                  :y="trendChartSvg.height - 23 - (yVal / 18) * trendChartSvg.chartH" 
                  text-anchor="end" 
                  class="text-[9px] fill-slate-400 font-mono font-medium"
                >
                  {{ yVal }}
                </text>

                <!-- Smooth Gradient Area -->
                <path 
                  :d="trendChartSvg.areaPath" 
                  fill="url(#trendAreaGrad)" 
                />

                <!-- Smooth Spline Curve Line -->
                <path 
                  :d="trendChartSvg.linePath" 
                  fill="none" 
                  stroke="#2563EB" 
                  stroke-width="2.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                />

                <!-- Data Markers & Interactive Hover Targets -->
                <g 
                  v-for="pt in trendChartSvg.points" 
                  :key="pt.label" 
                  class="cursor-pointer group"
                  @mouseenter="activeTrendHover = pt"
                  @mouseleave="activeTrendHover = null"
                >
                  <!-- Invisible wider hit area -->
                  <circle :cx="pt.x" :cy="pt.y" r="16" fill="transparent" />

                  <!-- Outer Halo on Breached -->
                  <circle 
                    v-if="pt.breached > 0"
                    :cx="pt.x" 
                    :cy="pt.y" 
                    r="8" 
                    fill="#FEE2E2" 
                    class="animate-pulse"
                  />

                  <!-- Marker Dot -->
                  <circle 
                    :cx="pt.x" 
                    :cy="pt.y" 
                    :r="activeTrendHover && activeTrendHover.label === pt.label ? 6.5 : 4.5" 
                    :fill="pt.breached > 0 ? '#EF4444' : '#10B981'" 
                    stroke="#FFFFFF" 
                    stroke-width="2" 
                    class="transition-all duration-150 shadow-xs"
                  />

                  <!-- X-Axis Day Label -->
                  <text 
                    :x="pt.x" 
                    :y="trendChartSvg.baselineY + 16" 
                    text-anchor="middle" 
                    class="text-[10px] fill-slate-600 font-semibold"
                    :class="activeTrendHover && activeTrendHover.label === pt.label ? 'fill-blue-700 font-bold' : ''"
                  >
                    {{ pt.label }}
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <!-- Trend Footer Metrics -->
          <div class="mt-auto pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span class="flex items-center space-x-1.5">
              <span class="text-slate-500">Beban Rata-rata:</span>
              <strong class="text-slate-900 font-mono">8.7 tiket/hari</strong>
            </span>
            <span class="flex items-center space-x-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Kepatuhan SLA: 98.4% (Tepat Waktu)</span>
            </span>
          </div>
        </div>

        <!-- 2. MTTR Performance vs SLA Contract Benchmark Bullet Cards -->
        <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Efisiensi Pemulihan (MTTR) vs Batas SLA</h3>
                <span class="text-xs text-slate-500 mt-0.5 block">Benchmark realisasi waktu kerja teknisi terhadap batas toleransi kontrak</span>
              </div>
              <span class="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 self-start sm:self-auto">
                Semua Level Optimal
              </span>
            </div>

            <!-- 2x2 Benchmark Bullet Cards Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mt-4">
              <div 
                v-for="card in mttrPerformanceCards" 
                :key="card.code"
                class="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-xs transition-all hover:border-slate-300"
              >
                <!-- 1. Point Title Highlighted Clearly (Full width, no truncation!) -->
                <div class="flex items-center space-x-2 pb-1 border-b border-slate-100">
                  <span class="px-2 py-0.5 rounded font-mono font-bold text-xs shrink-0 shadow-2xs" :class="card.badgeColor">
                    {{ card.code }}
                  </span>
                  <span class="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    {{ card.label }}
                  </span>
                </div>

                <!-- 2. Realisasi MTTR vs Target + Badge Efisiensi Lebih Cepat -->
                <div class="flex items-center justify-between pt-0.5">
                  <div class="space-y-0.5">
                    <span class="text-[10px] text-slate-400 block font-medium leading-none">Realisasi MTTR</span>
                    <div class="flex items-baseline space-x-1.5">
                      <span class="text-base sm:text-lg font-black text-slate-900 font-mono tracking-tight">
                        {{ card.actualLabel }}
                      </span>
                      <span class="text-[10px] text-slate-500 font-mono">
                        / {{ card.targetLabel }}
                      </span>
                    </div>
                  </div>

                  <!-- Prominent Speedup Highlight Badge -->
                  <div class="text-right">
                    <span class="inline-flex items-center space-x-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs shrink-0 whitespace-nowrap">
                      <span>⚡</span>
                      <span>{{ card.speedup }}</span>
                    </span>
                  </div>
                </div>

                <!-- 3. Bullet Progress Gauge with Contract Target Line -->
                <div class="space-y-1">
                  <div class="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/80">
                    <div 
                      class="h-full bg-gradient-to-r rounded-full transition-all"
                      :class="card.barColor"
                      :style="{ width: `${card.utilization}%` }"
                    ></div>
                  </div>

                  <div class="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 gap-1 flex-wrap">
                    <span class="whitespace-nowrap">{{ card.utilization }}% terpakai</span>
                    <span class="text-emerald-600 font-semibold whitespace-nowrap">{{ card.marginSafe }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="mt-auto pt-4 border-t border-slate-200/80 text-xs text-slate-500 italic">
            * Seluruh tingkatan keparahan diselesaikan dengan margin keselamatan kerja di atas 36% dari batas toleransi PKS 24x7.
          </p>
        </div>

        <!-- 3. Categorical Composition: Interactive SVG Donut Chart -->
        <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Distribusi Kategori Insiden Teknis</h3>
                <span class="text-xs text-slate-500 mt-0.5 block">Komposisi sebaran domain permasalahan infrastruktur TI</span>
              </div>
              <span class="text-xs text-slate-500 font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto">
                Bulan Berjalan (Sep 2026)
              </span>
            </div>

            <!-- Donut Chart & Legend Split Container -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <!-- SVG Donut Representation -->
              <div class="relative flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <svg class="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                  <!-- Base Track -->
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="46" 
                    fill="none" 
                    stroke="#F1F5F9" 
                    stroke-width="14" 
                  />

                  <!-- Dynamic Donut Segments -->
                  <circle 
                    v-for="cat in categoryDonutData" 
                    :key="cat.id"
                    cx="60" 
                    cy="60" 
                    r="46" 
                    fill="none" 
                    :stroke="cat.color" 
                    stroke-width="14" 
                    :stroke-dasharray="cat.strokeDasharray" 
                    :stroke-dashoffset="cat.strokeDashoffset" 
                    stroke-linecap="butt"
                    class="transition-all duration-300 cursor-pointer"
                    :class="activeCategoryHover === cat.id ? 'opacity-100 stroke-[16]' : 'opacity-90'"
                    @mouseenter="activeCategoryHover = cat.id"
                    @mouseleave="activeCategoryHover = null"
                  />
                </svg>

                <!-- Center Cutout Metric -->
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span class="text-2xl font-black text-slate-900 leading-none tracking-tight">61</span>
                  <span class="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mt-0.5">Total Insiden</span>
                </div>
              </div>

              <!-- Structured Interactive Legend List -->
              <div class="flex-1 w-full space-y-1.5 text-xs">
                <div 
                  v-for="cat in categoryDonutData" 
                  :key="cat.id"
                  class="flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer"
                  :class="activeCategoryHover === cat.id ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'"
                  @mouseenter="activeCategoryHover = cat.id"
                  @mouseleave="activeCategoryHover = null"
                >
                  <div class="flex items-center space-x-2.5">
                    <span class="w-3 h-3 rounded-full shrink-0 shadow-xs" :style="{ backgroundColor: cat.color }"></span>
                    <span class="text-xs text-slate-700 font-medium">{{ cat.name }}</span>
                  </div>
                  <div class="flex items-center space-x-2 font-mono text-xs">
                    <span class="font-black text-slate-900">{{ cat.percentage }}%</span>
                    <span class="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-bold">({{ cat.count }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>Dominasi kendala: <strong class="text-blue-700 font-semibold">Jaringan Fiber Optic & Routing BGP (42%)</strong></span>
            <span class="text-slate-400 font-mono">4 Sektor Utama</span>
          </div>
        </div>

        <!-- 4. Ranked Partner Leaderboard: Konsentrasi Gangguan per Mitra Klien -->
        <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
              <div>
                <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Konsentrasi Gangguan per Mitra Klien</h3>
                <span class="text-xs text-slate-500 mt-0.5 block">Peringkat mitra berdasarkan beban frekuensi penanganan insiden</span>
              </div>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
                PKS 24x7 Terpantau
              </span>
            </div>

            <!-- Ranked Partner Cards Leaderboard -->
            <div class="space-y-2.5 mt-4">
              <div 
                v-for="partner in customerLeaderboard" 
                :key="partner.code"
                class="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-3.5 shadow-xs flex flex-col gap-2 hover:border-slate-300 transition-all"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2.5">
                    <!-- Rank Number Pill -->
                    <span class="text-xs font-bold text-slate-400 w-4 text-center font-mono">
                      #{{ partner.rank }}
                    </span>

                    <!-- Monogram Avatar -->
                    <span 
                      class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shadow-xs shrink-0"
                      :class="partner.initialsBg"
                    >
                      {{ partner.code }}
                    </span>

                    <!-- Partner Name & Sector -->
                    <div>
                      <h4 class="font-bold text-slate-900 text-xs leading-snug">{{ partner.name }}</h4>
                      <span class="text-[11px] text-slate-400 leading-none">{{ partner.sector }}</span>
                    </div>
                  </div>

                  <!-- Share & Active Tickets -->
                  <div class="text-right">
                    <div class="flex items-center space-x-2 justify-end">
                      <span class="font-mono font-black text-xs text-slate-900">{{ partner.percentage }}%</span>
                      <span class="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                        {{ partner.active }} aktif
                      </span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-mono block mt-0.5">{{ partner.tickets }} tiket tercatat</span>
                  </div>
                </div>

                <!-- Proportional Horizontal Bar -->
                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    class="h-full rounded-full transition-all"
                    :class="partner.barColor"
                    :style="{ width: `${partner.percentage}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>Mitra dengan beban tertinggi: <strong class="text-slate-800 font-semibold">PT Bank Central Asia Tbk</strong></span>
            <span class="text-emerald-700 font-bold">100% SLA Safe</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Bar & Search -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <!-- Search Keyword -->
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nomor tiket, judul, customer, atau kata kunci..."
            class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex items-center space-x-2 text-xs">
          <!-- Severity Filter -->
          <select v-model="filterSeverity" class="border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-xs">
            <option value="">Semua Severity</option>
            <option value="HIGH">High Severity (Kritis)</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>

          <!-- Status Filter -->
          <select v-model="filterStatus" class="border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-xs">
            <option value="">Semua Status</option>
            <option value="OPEN">Open (Baru)</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending (SLA Ditahan)</option>
            <option value="RESOLVED">Resolved (Solusi Siap)</option>
            <option value="CLOSED">Closed (Selesai)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Ticket Queue Table -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 class="font-bold text-slate-900 text-sm">Daftar Antrean Tiket Layanan IT</h2>
          <p class="text-xs text-slate-500">Klik tiket untuk melihat detail tahapan pengerjaan milestone dan riwayat SLA</p>
        </div>
        <span class="text-xs text-slate-500 font-medium">Menampilkan {{ filteredTickets.length }} tiket</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[980px]">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-2.5 px-3 whitespace-nowrap">No. Tiket & Saluran</th>
              <th class="py-2.5 px-3 whitespace-nowrap">Customer & PIC</th>
              <th class="py-2.5 px-3">Judul Permasalahan</th>
              <th class="py-2.5 px-3 whitespace-nowrap">Severity</th>
              <th class="py-2.5 px-3 whitespace-nowrap">Status & Teknisi</th>
              <th class="py-2.5 px-3 whitespace-nowrap">Response SLA</th>
              <th class="py-2.5 px-3 whitespace-nowrap">Resolution SLA (24/7)</th>
              <th class="py-2.5 px-3 text-right whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="t in filteredTickets" 
              :key="t.id"
              class="hover:bg-slate-50/80 transition-colors group cursor-pointer"
              @click="$router.push(`/tickets/${t.id}`)"
            >
              <!-- Ticket Number & Channel -->
              <td class="py-2.5 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                <div class="flex items-center space-x-1.5">
                  <span>{{ t.ticketNumber }}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-sans font-normal mt-0.5 flex items-center space-x-1">
                  <span class="bg-slate-100 text-slate-600 px-1 rounded">{{ t.channel }}</span>
                  <span>{{ formatTime(t.createdAt).local.slice(0, 12) }}</span>
                </div>
              </td>

              <!-- Customer & PIC -->
              <td class="py-2.5 px-3 min-w-[140px] max-w-[180px]">
                <div class="font-semibold text-slate-800 truncate" :title="getCustomerName(t.customerId)">{{ getCustomerName(t.customerId) }}</div>
                <div class="text-[11px] text-slate-500 truncate" :title="getPicName(t.customerId, t.customerPicId)">{{ getPicName(t.customerId, t.customerPicId) }}</div>
              </td>

              <!-- Title & Category -->
              <td class="py-2.5 px-3 min-w-[200px] max-w-xs">
                <div class="font-medium text-slate-900 truncate" :title="t.title">{{ t.title }}</div>
                <div class="text-[10px] text-slate-500 mt-0.5 truncate">{{ getCategoryName(t.categoryId) }}</div>
              </td>

              <!-- Severity Badge -->
              <td class="py-2.5 px-3 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-[11px] font-bold inline-block" :class="getSeverityBadge(t.severity)">
                  {{ t.severity }}
                </span>
              </td>

              <!-- Status & Assigned -->
              <td class="py-2.5 px-3 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold block w-fit" :class="getStatusBadge(t.status)">
                  {{ t.status }}
                </span>
                <span class="text-[10px] text-slate-500 block mt-0.5 truncate max-w-[120px]">
                  {{ t.assignedToId ? getEngineerName(t.assignedToId) : '(Belum Ditugaskan)' }}
                </span>
              </td>

              <!-- Response SLA Badge -->
              <td class="py-2.5 px-3 whitespace-nowrap">
                <SlaBadge 
                  :deadlineUtc="t.responseDeadline" 
                  :resolvedAtUtc="t.respondedAt"
                  typeLabel="Respon"
                />
              </td>

              <!-- Resolution SLA Badge -->
              <td class="py-2.5 px-3 whitespace-nowrap">
                <SlaBadge 
                  :deadlineUtc="t.resolutionDeadline" 
                  :isPaused="t.isPaused"
                  :resolvedAtUtc="t.resolvedAt"
                  typeLabel="Resolusi"
                />
              </td>

              <!-- Action Link -->
              <td class="py-2.5 px-3 text-right whitespace-nowrap">
                <router-link 
                  :to="`/tickets/${t.id}`"
                  class="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold text-xs bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
                >
                  <span>Detail & Tracker</span>
                  <span>&rarr;</span>
                </router-link>
              </td>
            </tr>

            <tr v-if="filteredTickets.length === 0">
              <td colspan="8" class="text-center py-8 text-slate-400">
                Tidak ada tiket yang cocok dengan filter pencarian.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { formatUtcToLocal } from '../utils/dateFormatter';
import SlaBadge from '../components/SlaBadge.vue';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const searchQuery = ref('');
const filterSeverity = ref('');
const filterStatus = ref('');
const trendPeriod = ref('THIS_WEEK');
const showAnalyticsSection = ref(false);
const activeTrendHover = ref(null);
const activeCategoryHover = ref(null);

const weeklyTrendData = computed(() => {
  if (trendPeriod.value === 'THIS_MONTH') {
    return [
      { label: 'W34', total: 12, met: 12, breached: 0, date: '18 - 24 Agt 2026' },
      { label: 'W35', total: 15, met: 14, breached: 1, date: '25 - 31 Agt 2026' },
      { label: 'W36', total: 14, met: 14, breached: 0, date: '01 - 07 Sep 2026' },
      { label: 'W37 (Aktif)', total: 9, met: 9, breached: 0, date: '08 - 14 Sep 2026' }
    ];
  }
  return [
    { label: 'Sen', total: 9, met: 9, breached: 0, date: 'Senin, 08 Sep' },
    { label: 'Sel', total: 14, met: 14, breached: 0, date: 'Selasa, 09 Sep' },
    { label: 'Rab', total: 11, met: 10, breached: 1, date: 'Rabu, 10 Sep' },
    { label: 'Kam', total: 15, met: 15, breached: 0, date: 'Kamis, 11 Sep' },
    { label: 'Jum', total: 8, met: 8, breached: 0, date: 'Jumat, 12 Sep' },
    { label: 'Sab', total: 3, met: 3, breached: 0, date: 'Sabtu, 13 Sep' },
    { label: 'Min', total: 1, met: 1, breached: 0, date: 'Minggu, 14 Sep' }
  ];
});

// Dynamic SVG curve generator for Area Trend Chart
const trendChartSvg = computed(() => {
  const data = weeklyTrendData.value;
  const width = 480;
  const height = 150;
  const padLeft = 28;
  const padRight = 14;
  const padTop = 18;
  const padBottom = 26;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxY = 18;

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

// Tailored MTTR Bullet Performance Cards
const mttrPerformanceCards = [
  {
    code: 'P1',
    label: 'Critical (Kritis)',
    targetHours: 4.0,
    actualHours: 2.4,
    targetLabel: '4 Jam',
    actualLabel: '2.4 Jam',
    speedup: '40% Lebih Cepat',
    utilization: 60,
    badgeColor: 'bg-rose-100 text-rose-800 border border-rose-200',
    barColor: 'from-rose-500 to-rose-600',
    marginSafe: '+1.6 Jam batas aman'
  },
  {
    code: 'P2',
    label: 'Major (Signifikan)',
    targetHours: 8.0,
    actualHours: 5.1,
    targetLabel: '8 Jam',
    actualLabel: '5.1 Jam',
    speedup: '36% Lebih Cepat',
    utilization: 64,
    badgeColor: 'bg-amber-100 text-amber-800 border border-amber-200',
    barColor: 'from-amber-500 to-amber-600',
    marginSafe: '+2.9 Jam batas aman'
  },
  {
    code: 'P3',
    label: 'Medium (Standar)',
    targetHours: 24.0,
    actualHours: 13.8,
    targetLabel: '24 Jam',
    actualLabel: '13.8 Jam',
    speedup: '42% Lebih Cepat',
    utilization: 58,
    badgeColor: 'bg-sky-100 text-sky-800 border border-sky-200',
    barColor: 'from-sky-500 to-blue-600',
    marginSafe: '+10.2 Jam batas aman'
  },
  {
    code: 'P4',
    label: 'Low (Request)',
    targetHours: 48.0,
    actualHours: 22.0,
    targetLabel: '48 Jam',
    actualLabel: '22.0 Jam',
    speedup: '54% Lebih Cepat',
    utilization: 46,
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    barColor: 'from-emerald-500 to-teal-600',
    marginSafe: '+26.0 Jam batas aman'
  }
];

// Tailored SVG Donut Categories
const categoryDonutData = computed(() => {
  const categories = [
    { id: 'net', name: 'Jaringan & Konektivitas', percentage: 42, count: 26, color: '#2563EB', bgBadge: 'bg-blue-600', textBadge: 'text-blue-700' },
    { id: 'srv', name: 'Server & Infrastruktur Cloud', percentage: 28, count: 17, color: '#6366F1', bgBadge: 'bg-indigo-600', textBadge: 'text-indigo-700' },
    { id: 'app', name: 'Aplikasi & Database Core', percentage: 18, count: 11, color: '#10B981', bgBadge: 'bg-emerald-600', textBadge: 'text-emerald-700' },
    { id: 'sec', name: 'Keamanan & Akses VPN', percentage: 12, count: 7, color: '#F59E0B', bgBadge: 'bg-amber-500', textBadge: 'text-amber-700' }
  ];

  const C = 2 * Math.PI * 46; // Radius 46 -> Circumference = 289.026
  let currentOffset = 0;

  return categories.map(cat => {
    const dashLength = (cat.percentage / 100) * C;
    const strokeDasharray = `${dashLength.toFixed(1)} ${(C - dashLength).toFixed(1)}`;
    const strokeDashoffset = (-currentOffset).toFixed(1);
    currentOffset += dashLength;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset
    };
  });
});

// Tailored Partner Leaderboard
const customerLeaderboard = [
  {
    rank: 1,
    code: 'BCA',
    name: 'PT Bank Central Asia Tbk',
    sector: 'Perbankan & Fintech Korporat',
    percentage: 38,
    tickets: 23,
    active: 3,
    slaRate: '100%',
    initialsBg: 'bg-blue-600 text-white',
    barColor: 'bg-blue-600'
  },
  {
    rank: 2,
    code: 'RSH',
    name: 'PT Siloam Hospitals Group',
    sector: 'Fasilitas Kesehatan & Rumah Sakit',
    percentage: 29,
    tickets: 18,
    active: 2,
    slaRate: '100%',
    initialsBg: 'bg-indigo-600 text-white',
    barColor: 'bg-indigo-600'
  },
  {
    rank: 3,
    code: 'DKB',
    name: 'Dinas Kominfo Pemprov Banten',
    sector: 'Sektor Publik & Pemerintahan Daerah',
    percentage: 21,
    tickets: 13,
    active: 1,
    slaRate: '98%',
    initialsBg: 'bg-emerald-600 text-white',
    barColor: 'bg-emerald-600'
  },
  {
    rank: 4,
    code: 'AST',
    name: 'PT Astra International Tbk',
    sector: 'Manufaktur & Konglomerasi Otomotif',
    percentage: 12,
    tickets: 7,
    active: 1,
    slaRate: '100%',
    initialsBg: 'bg-amber-600 text-white',
    barColor: 'bg-amber-600'
  }
];

const formatTime = (t) => formatUtcToLocal(t);

const getCustomerName = (id) => {
  const c = ticketStore.customers.find(item => item.id === id);
  return c ? c.name : 'Unknown';
};

const getPicName = (custId, picId) => {
  const c = ticketStore.customers.find(item => item.id === custId);
  if (!c || !c.pics) return '-';
  const p = c.pics.find(item => item.id === picId);
  return p ? `${p.name} (${p.dept})` : '-';
};

const getCategoryName = (id) => {
  const cat = ticketStore.categories.find(item => item.id === id);
  return cat ? cat.name : 'Umum';
};

const getEngineerName = (id) => {
  const u = authStore.users.find(item => item.id === id);
  return u ? u.name : '-';
};

const getSeverityBadge = (s) => {
  switch (s) {
    case 'HIGH': return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'MEDIUM': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'LOW': return 'bg-sky-50 text-sky-700 border border-sky-200';
    default: return 'bg-slate-50 text-slate-700';
  }
};

const getStatusBadge = (st) => {
  switch (st) {
    case 'OPEN': return 'bg-amber-100 text-amber-800';
    case 'ASSIGNED': return 'bg-indigo-100 text-indigo-800';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
    case 'PENDING_VENDOR':
    case 'PENDING_CUSTOMER': return 'bg-orange-100 text-orange-900';
    case 'RESOLVED': return 'bg-emerald-100 text-emerald-800 font-bold';
    case 'CLOSED': return 'bg-slate-200 text-slate-800';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const filteredTickets = computed(() => {
  return ticketStore.tickets.filter(t => {
    // Search query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchNum = t.ticketNumber.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchCust = getCustomerName(t.customerId).toLowerCase().includes(q);
      if (!matchNum && !matchTitle && !matchCust) return false;
    }
    // Severity filter
    if (filterSeverity.value && t.severity !== filterSeverity.value) return false;
    // Status filter
    if (filterStatus.value) {
      if (filterStatus.value === 'PENDING') {
        if (!t.status.includes('PENDING')) return false;
      } else if (t.status !== filterStatus.value) {
        return false;
      }
    }
    return true;
  });
});
</script>
