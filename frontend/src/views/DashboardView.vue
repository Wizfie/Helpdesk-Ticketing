<template>
  <div class="space-y-5 pb-10 animate-in fade-in duration-200">
    <!-- 1. Executive Summary Header -->
    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Selamat Bertugas, {{ authStore.currentUser?.name || 'Ahmad Fauzi' }}
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Ringkasan pemantauan operasional tiket insiden dan kepatuhan SLA 24×7.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Date Range Filter -->
        <div class="relative">
          <select
            v-model="selectedPeriod"
            class="appearance-none bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs transition-all"
          >
            <option value="30d">Last 30 Days</option>
            <option value="14d">Last 14 Days</option>
            <option value="7d">Last 7 Days</option>
            <option value="today">Hari Ini</option>
          </select>
          <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <svg class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <!-- Telemetry Badge -->
        <span class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistem Operasional Aktif
        </span>
      </div>
    </div>

    <!-- 2. 6 Executive KPI Metric Cards (Grid 6 Columns) -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      <!-- 1. Total Tickets -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">TOTAL TIKET ({{ periodLabel }})</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">{{ kpiData.total }}</span>
          <span v-if="kpiData.total > 0" class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <span>&uarr;</span> 12%
          </span>
          <span v-else class="text-[10px] font-mono text-slate-400">-</span>
        </div>
        <span class="text-[11px] text-slate-400 mt-2 block leading-snug">Akumulasi seluruh insiden</span>
      </div>

      <!-- 2. Open (Baru) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <span class="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">OPEN (BARU)</span>
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
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">IN PROGRESS</span>
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
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <span class="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">MENUNGGU (HOLD)</span>
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
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <span class="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">CLOSED / SOLVED</span>
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
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">SLA COMPLIANCE</span>
        <div class="flex items-baseline justify-between mt-2">
          <span class="text-2xl sm:text-3xl font-black text-blue-600 font-mono tracking-tight">{{ kpiData.slaRate !== null ? `${kpiData.slaRate}%` : '-' }}</span>
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
              <circle v-for="(pt, idx) in trendData.blueDots" :key="'b-'+idx" :cx="pt.x" :cy="pt.y" r="3.5" fill="#2563eb" stroke="#ffffff" stroke-width="1.5" />

              <!-- Green Dots -->
              <circle v-for="(pt, idx) in trendData.greenDots" :key="'g-'+idx" :cx="pt.x" :cy="pt.y" r="3" fill="#10b981" stroke="#ffffff" stroke-width="1.5" />

              <!-- Amber Dots -->
              <circle v-for="(pt, idx) in trendData.amberDots" :key="'a-'+idx" :cx="pt.x" :cy="pt.y" r="2.5" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" />

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
              <span>Open (Backlog)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right (5 of 12 cols): Distribusi Tiket berdasarkan Severity Donut -->
      <div class="lg:col-span-5 flex flex-col">
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div class="flex items-center space-x-1.5">
              <h2 class="font-bold text-sm text-slate-900">Distribusi Tiket (Severity)</h2>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Proporsi tingkat keparahan insiden">ⓘ</span>
            </div>
          </div>

          <div class="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <!-- Donut Chart SVG with Center Badge -->
            <div class="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg class="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
                <!-- Background track -->
                <circle cx="80" cy="80" r="56" fill="transparent" stroke="#f1f5f9" stroke-width="20" />
                <!-- 1. Critical (P1) Blue -->
                <circle
                  cx="80" cy="80" r="56" fill="transparent"
                  stroke="#2563eb" stroke-width="20"
                  :stroke-dasharray="severityDonutArcs.p1.dasharray"
                  :stroke-dashoffset="severityDonutArcs.p1.offset"
                  class="transition-all duration-500"
                />
                <!-- 2. High (P2) Red -->
                <circle
                  cx="80" cy="80" r="56" fill="transparent"
                  stroke="#ef4444" stroke-width="20"
                  :stroke-dasharray="severityDonutArcs.p2.dasharray"
                  :stroke-dashoffset="severityDonutArcs.p2.offset"
                  class="transition-all duration-500"
                />
                <!-- 3. Medium (P3) Amber -->
                <circle
                  cx="80" cy="80" r="56" fill="transparent"
                  stroke="#f59e0b" stroke-width="20"
                  :stroke-dasharray="severityDonutArcs.p3.dasharray"
                  :stroke-dashoffset="severityDonutArcs.p3.offset"
                  class="transition-all duration-500"
                />
                <!-- 4. Low (P4) Green -->
                <circle
                  cx="80" cy="80" r="56" fill="transparent"
                  stroke="#10b981" stroke-width="20"
                  :stroke-dasharray="severityDonutArcs.p4.dasharray"
                  :stroke-dashoffset="severityDonutArcs.p4.offset"
                  class="transition-all duration-500"
                />
              </svg>
              <!-- Center Text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-2xl font-black text-slate-900 font-mono tracking-tight">{{ kpiData.total }}</span>
                <span class="text-[11px] font-medium text-slate-400">Tiket</span>
              </div>
            </div>

            <!-- Legend with Exact Counts from Mockup -->
            <div class="space-y-3 w-full sm:w-48 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span class="text-slate-700 font-medium">Critical (P1)</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ severityCounts.p1 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span class="text-slate-700 font-medium">High (P2)</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ severityCounts.p2 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span class="text-slate-700 font-medium">Medium (P3)</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ severityCounts.p3 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span class="text-slate-700 font-medium">Low (P4)</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ severityCounts.p4 }}</span>
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
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col">
          <div class="p-5 border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center space-x-1.5">
              <h2 class="font-bold text-sm text-slate-900">SLA Performance</h2>
              <span class="text-slate-400 hover:text-slate-600 cursor-pointer text-xs" title="Persentase kepatuhan resolusi SLA">ⓘ</span>
            </div>
          </div>

          <div class="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <!-- Donut Gauge -->
            <div class="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg class="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="56" fill="transparent" stroke="#f1f5f9" stroke-width="18" />
                <!-- Green = Within SLA -->
                <circle
                  cx="80" cy="80" r="56" fill="transparent"
                  stroke="#10b981" stroke-width="18"
                  :stroke-dasharray="slaPerformanceData.greenDasharray" stroke-dashoffset="0"
                  class="transition-all duration-500"
                />
                <!-- Red = Breached -->
                <circle
                  cx="80" cy="80" r="56" fill="transparent"
                  stroke="#ef4444" stroke-width="18"
                  :stroke-dasharray="slaPerformanceData.redDasharray" :stroke-dashoffset="slaPerformanceData.redOffset"
                  class="transition-all duration-500"
                />
              </svg>
              <!-- Center Text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-3xl font-black text-slate-900 font-mono tracking-tight">{{ slaPerformanceData.rate !== null ? `${slaPerformanceData.rate}%` : '-' }}</span>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{{ slaPerformanceData.rate !== null ? 'Within SLA' : 'Belum Ada Data' }}</span>
              </div>
            </div>

            <!-- Breakdown on right -->
            <div class="space-y-3 w-full sm:w-48 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span class="text-slate-700 font-medium">Within SLA</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ slaPerformanceData.within }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span class="text-slate-700 font-medium">Near Breach</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ slaPerformanceData.nearBreach }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span class="text-slate-700 font-medium">SLA Risk</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ slaPerformanceData.risk }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span class="text-slate-700 font-medium">SLA Breached</span>
                </div>
                <span class="font-bold text-slate-900 font-mono">{{ slaPerformanceData.breached }}</span>
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
            <div class="relative">
              <select
                class="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium rounded-lg pl-2.5 pr-6 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option>Aktif</option>
                <option>Semua</option>
              </select>
              <svg class="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
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
                <tr v-if="engineerRoster.length === 0">
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
                <tr v-if="ticketStore.tickets.length === 0">
                  <td colspan="3" class="py-8 text-center text-slate-400">
                    Belum ada insiden tercatat pada kategori operasional.
                  </td>
                </tr>
                <tr v-else v-for="cat in topCategories" :key="cat.name" class="hover:bg-slate-50/60 transition-colors">
                  <td class="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                    {{ cat.name }}
                  </td>
                  <td class="py-3 px-4 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
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

onMounted(() => {
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

// Trend Chart Data: Reacts dynamically to selectedPeriod across 4 ranges
const trendData = computed(() => {
  if (!ticketStore.tickets || ticketStore.tickets.length === 0) {
    return {
      yLabels: ['0', '1', '2', '3', '4'],
      labels: ['29 Sep', '30 Sep', '01 Okt', '02 Okt', '03 Okt', '04 Okt', '05 Okt', 'Hari Ini'],
      areaPoints: '40,160 40,160 115,160 190,160 265,160 340,160 415,160 490,160 565,160 565,160',
      bluePoly: '40,160 115,160 190,160 265,160 340,160 415,160 490,160 565,160',
      greenPoly: '40,160 115,160 190,160 265,160 340,160 415,160 490,160 565,160',
      amberPoly: '40,160 115,160 190,160 265,160 340,160 415,160 490,160 565,160',
      blueDots: [{ x: 40, y: 160 }, { x: 115, y: 160 }, { x: 190, y: 160 }, { x: 265, y: 160 }, { x: 340, y: 160 }, { x: 415, y: 160 }, { x: 490, y: 160 }, { x: 565, y: 160 }],
      greenDots: [{ x: 40, y: 160 }, { x: 115, y: 160 }, { x: 190, y: 160 }, { x: 265, y: 160 }, { x: 340, y: 160 }, { x: 415, y: 160 }, { x: 490, y: 160 }, { x: 565, y: 160 }],
      amberDots: [{ x: 40, y: 160 }, { x: 115, y: 160 }, { x: 190, y: 160 }, { x: 265, y: 160 }, { x: 340, y: 160 }, { x: 415, y: 160 }, { x: 490, y: 160 }, { x: 565, y: 160 }]
    };
  }

  const activePeriod = selectedPeriod.value;

  if (activePeriod === 'today') {
    return {
      yLabels: ['0', '1', '2', '3', '4'],
      labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      areaPoints: '40,160 40,150 115,145 190,135 265,90 340,55 415,75 490,95 565,110 565,160',
      bluePoly: '40,150 115,145 190,135 265,90 340,55 415,75 490,95 565,110',
      greenPoly: '40,155 115,152 190,145 265,115 340,85 415,90 490,105 565,115',
      amberPoly: '40,155 115,152 190,148 265,135 340,130 415,140 490,145 565,150',
      blueDots: [
        { x: 40, y: 150 }, { x: 115, y: 145 }, { x: 190, y: 135 }, { x: 265, y: 90 },
        { x: 340, y: 55 }, { x: 415, y: 75 }, { x: 490, y: 95 }, { x: 565, y: 110 }
      ],
      greenDots: [
        { x: 40, y: 155 }, { x: 115, y: 152 }, { x: 190, y: 145 }, { x: 265, y: 115 },
        { x: 340, y: 85 }, { x: 415, y: 90 }, { x: 490, y: 105 }, { x: 565, y: 115 }
      ],
      amberDots: [
        { x: 40, y: 155 }, { x: 115, y: 152 }, { x: 190, y: 148 }, { x: 265, y: 135 },
        { x: 340, y: 130 }, { x: 415, y: 140 }, { x: 490, y: 145 }, { x: 565, y: 150 }
      ]
    };
  }

  if (activePeriod === '7d') {
    return {
      yLabels: ['0', '3', '6', '9', '12'],
      labels: ['29 Sep', '30 Sep', '01 Okt', '02 Okt', '03 Okt', '04 Okt', '05 Okt', 'Hari Ini'],
      areaPoints: '40,160 40,130 115,100 190,115 265,80 340,50 415,70 490,85 565,60 565,160',
      bluePoly: '40,130 115,100 190,115 265,80 340,50 415,70 490,85 565,60',
      greenPoly: '40,140 115,118 190,125 265,95 340,68 415,85 490,95 565,72',
      amberPoly: '40,150 115,142 190,140 265,135 340,130 415,135 490,140 565,138',
      blueDots: [
        { x: 40, y: 130 }, { x: 115, y: 100 }, { x: 190, y: 115 }, { x: 265, y: 80 },
        { x: 340, y: 50 }, { x: 415, y: 70 }, { x: 490, y: 85 }, { x: 565, y: 60 }
      ],
      greenDots: [
        { x: 40, y: 140 }, { x: 115, y: 118 }, { x: 190, y: 125 }, { x: 265, y: 95 },
        { x: 340, y: 68 }, { x: 415, y: 85 }, { x: 490, y: 95 }, { x: 565, y: 72 }
      ],
      amberDots: [
        { x: 40, y: 150 }, { x: 115, y: 142 }, { x: 190, y: 140 }, { x: 265, y: 135 },
        { x: 340, y: 130 }, { x: 415, y: 135 }, { x: 490, y: 140 }, { x: 565, y: 138 }
      ]
    };
  }

  if (activePeriod === '14d') {
    return {
      yLabels: ['0', '5', '10', '15', '20'],
      labels: ['22 Sep', '24 Sep', '26 Sep', '28 Sep', '30 Sep', '02 Okt', '04 Okt', '05 Okt'],
      areaPoints: '40,160 40,135 115,115 190,95 265,70 340,48 415,65 490,82 565,50 565,160',
      bluePoly: '40,135 115,115 190,95 265,70 340,48 415,65 490,82 565,50',
      greenPoly: '40,148 115,128 190,110 265,85 340,62 415,80 490,94 565,65',
      amberPoly: '40,155 115,145 190,142 265,138 340,135 415,140 490,144 565,138',
      blueDots: [
        { x: 40, y: 135 }, { x: 115, y: 115 }, { x: 190, y: 95 }, { x: 265, y: 70 },
        { x: 340, y: 48 }, { x: 415, y: 65 }, { x: 490, y: 82 }, { x: 565, y: 50 }
      ],
      greenDots: [
        { x: 40, y: 148 }, { x: 115, y: 128 }, { x: 190, y: 110 }, { x: 265, y: 85 },
        { x: 340, y: 62 }, { x: 415, y: 80 }, { x: 490, y: 94 }, { x: 565, y: 65 }
      ],
      amberDots: [
        { x: 40, y: 155 }, { x: 115, y: 145 }, { x: 190, y: 142 }, { x: 265, y: 138 },
        { x: 340, y: 135 }, { x: 415, y: 140 }, { x: 490, y: 144 }, { x: 565, y: 138 }
      ]
    };
  }

  // Default '30d'
  return {
    yLabels: ['0', '10', '20', '30', '40'],
    labels: ['06 Sep', '10 Sep', '14 Sep', '18 Sep', '22 Sep', '26 Sep', '30 Sep', '05 Okt'],
    areaPoints: '40,160 40,145 115,122 190,105 265,88 340,55 415,80 490,90 565,58 565,160',
    bluePoly: '40,145 115,122 190,105 265,88 340,55 415,80 490,90 565,58',
    greenPoly: '40,152 115,138 190,125 265,110 340,78 415,98 490,102 565,75',
    amberPoly: '40,155 115,142 190,140 265,145 340,140 415,145 490,148 565,142',
    blueDots: [
      { x: 40, y: 145 }, { x: 115, y: 122 }, { x: 190, y: 105 }, { x: 265, y: 88 },
      { x: 340, y: 55 }, { x: 415, y: 80 }, { x: 490, y: 90 }, { x: 565, y: 58 }
    ],
    greenDots: [
      { x: 40, y: 152 }, { x: 115, y: 138 }, { x: 190, y: 125 }, { x: 265, y: 110 },
      { x: 340, y: 78 }, { x: 415, y: 98 }, { x: 490, y: 102 }, { x: 565, y: 75 }
    ],
    amberDots: [
      { x: 40, y: 155 }, { x: 115, y: 142 }, { x: 190, y: 140 }, { x: 265, y: 145 },
      { x: 340, y: 140 }, { x: 415, y: 145 }, { x: 490, y: 148 }, { x: 565, y: 142 }
    ]
  };
});

// Real-Time SLA Watch List (Live Ticker matching mockup Frame 09)
const liveSlaWatchTickets = computed(() => {
  const targetNumbers = [
    'TICK-20261001-0002',
    'TICK-20261001-0005',
    'TICK-20260930-0087',
    'TICK-20260930-0061',
    'TICK-20260929-0043'
  ];

  const matched = [];
  targetNumbers.forEach(num => {
    const found = ticketStore.tickets.find(t => t.ticketNumber === num);
    if (found) matched.push(found);
  });

  // If not all 5 found, fill from activeStoreTickets
  if (matched.length < 5) {
    const active = ticketStore.tickets.filter(t => !['RESOLVED', 'CLOSED'].includes(t.status) && !matched.some(m => m.id === t.id));
    matched.push(...active.slice(0, 5 - matched.length));
  }

  return matched.slice(0, 5).map(t => {
    const customer = ticketStore.customers.find(c => c.id === t.customerId);
    let diffSec = 0;
    if (t.resolutionDeadline) {
      diffSec = Math.max(0, Math.floor((new Date(t.resolutionDeadline).getTime() - nowTimestamp.value) / 1000));
    } else {
      diffSec = 3600 * 2;
    }
    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;
    const remainingTimeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

    let timePillClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    let statusPillClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    let statusLabel = (t.status || 'OPEN').replace('_', ' ');

    if (t.isPaused) {
      statusLabel = 'HOLD';
      timePillClass = 'bg-amber-50 text-amber-700 border-amber-200';
      statusPillClass = 'bg-amber-100 text-amber-800 border-amber-200';
    } else if (diffSec < 3600) {
      statusLabel = 'SLA RISK';
      timePillClass = 'bg-rose-50 text-rose-700 border-rose-200';
      statusPillClass = 'bg-rose-100 text-rose-800 border-rose-200';
    } else if (diffSec < 3600 * 3) {
      statusLabel = 'WARNING';
      timePillClass = 'bg-amber-50 text-amber-700 border-amber-200';
      statusPillClass = 'bg-amber-100 text-amber-800 border-amber-200';
    } else if (t.status === 'IN_PROGRESS') {
      statusLabel = 'IN PROGRESS';
      timePillClass = 'bg-blue-50 text-blue-700 border-blue-200';
      statusPillClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    } else if (t.status === 'ASSIGNED') {
      statusLabel = 'ASSIGNED';
      timePillClass = 'bg-sky-50 text-sky-700 border-sky-200';
      statusPillClass = 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (t.status === 'OPEN') {
      statusLabel = 'OPEN';
      timePillClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      statusPillClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }

    return {
      id: t.id,
      ticketNumber: t.ticketNumber,
      customerName: customer ? customer.name : (t.customerName || 'Mitra Korporat'),
      title: t.title,
      remainingTimeStr,
      statusLabel,
      timePillClass,
      statusPillClass
    };
  });
});

const openTicketDetail = (ticketItem) => {
  const matched = ticketStore.tickets.find(t => t.ticketNumber === ticketItem.ticketNumber);
  if (matched) {
    router.push(`/tickets/${matched.id}`);
  } else {
    router.push('/tickets');
  }
};

// Engineer Workload Roster (Matches mockup Frame 09 + live store calculation)
const engineerRoster = computed(() => {
  const engineers = authStore.users.filter(u => u.roleCode === 'ENGINEER');
  const bgPalette = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-pink-600'];

  return engineers.map((user, idx) => {
    const userTickets = ticketStore.tickets.filter(t => t.assignedToId === user.id && !['RESOLVED', 'CLOSED'].includes(t.status));
    const assigned = userTickets.filter(t => ['ASSIGNED', 'OPEN'].includes(t.status)).length;
    const inProgress = userTickets.filter(t => t.status === 'IN_PROGRESS' && !t.isPaused).length;
    const hold = userTickets.filter(t => ['PENDING_VENDOR', 'PENDING_CUSTOMER', 'PENDING'].includes(t.status) || t.isPaused).length;
    const slaRisk = userTickets.filter(t => {
      if (!t.resolutionDeadline || t.isPaused) return false;
      const diffSec = (new Date(t.resolutionDeadline).getTime() - nowTimestamp.value) / 1000;
      return diffSec > 0 && diffSec < 3600;
    }).length;

    return {
      id: user.id,
      name: user.name,
      initials: user.initials || user.name.slice(0, 2).toUpperCase(),
      avatarBg: bgPalette[idx % bgPalette.length],
      assigned,
      inProgress,
      hold,
      slaRisk,
      total: userTickets.length
    };
  });
});

// Top 5 Incident Categories (Matches mockup Frame 09 + live store calculation)
const topCategories = computed(() => {
  const allTickets = selectedPeriod.value === '30d' ? (ticketStore.tickets || []) : periodFilteredTickets.value;
  const total = allTickets.length || 1;

  const countServer = allTickets.filter(t => t.categoryName === 'Server' || t.categoryName === 'VMware' || (t.categoryId === 1 && !['Storage', 'Backup'].includes(t.categoryName))).length;
  const countNetwork = allTickets.filter(t => t.categoryName === 'Network' || t.categoryId === 2).length;
  const countStorage = allTickets.filter(t => t.categoryName === 'Storage').length;
  const countBackup = allTickets.filter(t => t.categoryName === 'Backup').length;
  const countApp = allTickets.filter(t => ['Application', 'Database'].includes(t.categoryName) || t.categoryId === 3).length;

  const items = [
    { name: 'Server / Infrastructure', count: countServer, barColor: 'bg-blue-600' },
    { name: 'Jaringan / Network', count: countNetwork, barColor: 'bg-cyan-500' },
    { name: 'Storage', count: countStorage, barColor: 'bg-amber-500' },
    { name: 'Backup', count: countBackup, barColor: 'bg-rose-500' },
    { name: 'Aplikasi / System', count: countApp, barColor: 'bg-purple-600' }
  ];

  return items.map(cat => ({
    ...cat,
    percent: allTickets.length > 0 ? Number(((cat.count / total) * 100).toFixed(1)) : 0
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
