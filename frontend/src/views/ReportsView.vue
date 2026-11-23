<template>
  <div class="space-y-6">
    <!-- Top Header Bar -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link to="/tickets" class="hover:text-blue-600 transition-colors">Audit &amp; Intelligence</router-link>
          <span>/</span>
          <span class="text-slate-800">Executive SLA Reports</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <span>Executive SLA Intelligence &amp; Reporting</span>
          <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            AUDIT COMPLIANCE
          </span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Laporan evaluasi kepatuhan kontrak SLA dan performa penanganan tiket helpdesk.
        </p>
      </div>

      <!-- Export Action Buttons -->
      <div class="flex items-center space-x-2.5">
        <button
          @click="exportExcel"
          class="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Ekspor Excel (.xlsx)</span>
        </button>

        <button
          @click="triggerPrint"
          class="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
          </svg>
          <span>Cetak / Cetak PDF</span>
        </button>
      </div>
    </div>

    <!-- Filter Bar: Periode & Customer -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 text-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <!-- Preset Periode Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="font-bold text-slate-700">Filter Periode:</span>
          <button
            v-for="p in periodOptions"
            :key="p.id"
            @click="selectedPeriod = p.id"
            class="px-3 py-1.5 rounded-lg font-medium transition-all text-xs"
            :class="selectedPeriod === p.id ? 'bg-blue-600 text-white font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            {{ p.label }}
          </button>
        </div>

        <!-- Filter Customer Dropdown -->
        <div class="flex items-center space-x-2">
          <label class="font-semibold text-slate-600 whitespace-nowrap">Filter Mitra:</label>
          <BaseSelect
            v-model="selectedCustomer"
            :options="customerReportOptions"
            size="sm"
            placement="right"
            searchable
            placeholder="Semua Mitra Korporat"
            containerClass="w-72 sm:w-80 md:w-96"
          />
        </div>
      </div>

      <!-- Custom Date Range Row -->
      <div v-if="selectedPeriod === 'CUSTOM'" class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg animate-in fade-in duration-150">
        <span class="font-semibold text-slate-700">Rentang Tanggal Spesifik:</span>
        <div class="flex items-center space-x-2">
          <label class="text-slate-500 text-[11px]">Dari:</label>
          <input
            v-model="customStartDate"
            type="date"
            class="border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-xs font-mono"
          />
        </div>
        <div class="flex items-center space-x-2">
          <label class="text-slate-500 text-[11px]">Sampai:</label>
          <input
            v-model="customEndDate"
            type="date"
            class="border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-xs font-mono"
          />
        </div>
      </div>
    </div>

    <!-- Printable Executive Report (Page 1: Summary, Page 2: Case List) -->
    <div id="printable-report" class="w-full space-y-6 print:space-y-0">

      <!-- ================= PAGE 1 ================= -->
      <section class="report-page report-page-1 bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-xs space-y-3 print:space-y-1.5 print:p-0">
        <!-- Header -->
        <div class="flex items-center justify-between border-b-2 border-slate-800 pb-3 print:pb-2 gap-4">
          <div class="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
            <img src="/gtt-logo.png" alt="Glotra Technology" class="h-12 print:h-9 w-auto object-contain flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h2 class="text-base md:text-lg print:text-sm font-black text-slate-900 leading-tight">PT GLOBAL TRANSFORMASI TEKNOLOGI</h2>
              <p class="text-xs print:text-[9.5px] text-slate-600 italic">"Think it, Solve it" &bull; IT Enterprise Managed Services &amp; Infrastructure Support</p>
              <p class="text-[11px] print:text-[8px] text-slate-500 break-words leading-tight">Prudential Center Kota Kasablanka Fl 22 Unit A Jalan Casablanca Kav. 88, RT.7/RW.9, Menteng Dalam, Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12870</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="text-xs print:text-[9.5px] font-mono font-bold text-blue-700 block bg-blue-50 px-2.5 py-1 print:py-0.5 rounded border border-blue-200">REPORT-SLA-{{ currentMonthYear }}</span>
            <span class="text-[11px] print:text-[8px] text-slate-400 block mt-1 print:mt-0.5 whitespace-nowrap">Generated: {{ reportPrintDate.local }}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="text-center space-y-1 print:space-y-0.5 py-1.5 print:py-0.5">
          <h3 class="text-base md:text-lg print:text-xs font-black text-blue-900 uppercase tracking-wide">LAPORAN EKSEKUTIF KINERJA HELPDESK &amp; KEPATUHAN KONTRAK SLA</h3>
          <p class="text-xs print:text-[9.5px] text-slate-600 font-medium">
            Periode Evaluasi: <strong class="text-blue-700">{{ activePeriodLabel }}</strong> &bull;
            <strong class="text-emerald-700">{{ activeSlaStandardLabel }}</strong>
          </p>
        </div>

        <!-- Row 1: Status Summary Cards -->
        <div class="grid grid-cols-4 gap-2">
          <div class="rpt-card bg-blue-50 border-blue-200">
            <span class="rpt-icon bg-blue-500"><span class="material-symbols-outlined">description</span></span>
            <div>
              <div class="rpt-label text-blue-800">Total Insiden</div>
              <div class="rpt-big text-blue-900">{{ reportStats.total }}</div>
              <div class="rpt-sub text-slate-500">Tiket diproses periode ini</div>
            </div>
          </div>
          <div class="rpt-card bg-emerald-50 border-emerald-200">
            <span class="rpt-icon bg-emerald-500"><span class="material-symbols-outlined">check_circle</span></span>
            <div>
              <div class="rpt-label text-emerald-800">Closed / Solved</div>
              <div class="rpt-big text-emerald-900">{{ statusCounts.resolved + statusCounts.closed }}
                <span class="text-[9px] font-bold text-emerald-600">{{ pctOf(statusCounts.resolved + statusCounts.closed) }}%</span>
              </div>
              <div class="rpt-sub text-slate-500">Tiket selesai &amp; dikonfirmasi</div>
            </div>
          </div>
          <div class="rpt-card bg-orange-50 border-orange-200">
            <span class="rpt-icon bg-orange-500"><span class="material-symbols-outlined">hourglass_top</span></span>
            <div>
              <div class="rpt-label text-orange-800">Open / In Progress</div>
              <div class="rpt-big text-orange-900">{{ statusCounts.open + statusCounts.progress }}
                <span class="text-[9px] font-bold text-orange-600">{{ pctOf(statusCounts.open + statusCounts.progress) }}%</span>
              </div>
              <div class="rpt-sub text-slate-500">Tiket dalam penanganan</div>
            </div>
          </div>
          <div class="rpt-card bg-rose-50 border-rose-200">
            <span class="rpt-icon bg-rose-500"><span class="material-symbols-outlined">pause_circle</span></span>
            <div>
              <div class="rpt-label text-rose-800">Hold / Pending</div>
              <div class="rpt-big text-rose-900">{{ statusCounts.hold }}
                <span class="text-[9px] font-bold text-rose-600">{{ pctOf(statusCounts.hold) }}%</span>
              </div>
              <div class="rpt-sub text-slate-500">Menunggu vendor/klien</div>
            </div>
          </div>
        </div>

        <!-- Row 2: SLA Cards -->
        <div class="grid grid-cols-3 gap-2">
          <div class="rpt-card bg-sky-50 border-sky-200">
            <span class="rpt-icon bg-sky-600"><span class="material-symbols-outlined">verified</span></span>
            <div>
              <div class="rpt-label text-sky-800">SLA Compliance Rate</div>
              <div class="rpt-big text-sky-900">{{ reportStats.slaRate !== null ? `${reportStats.slaRate}%` : '-' }}</div>
              <div class="rpt-sub text-slate-500">{{ reportStats.slaRate !== null ? 'Target Kontrak: \u2265 98.0%' : 'Belum ada data tiket' }}</div>
            </div>
          </div>
          <div class="rpt-card bg-rose-50 border-rose-200">
            <span class="rpt-icon bg-rose-600"><span class="material-symbols-outlined">warning</span></span>
            <div>
              <div class="rpt-label text-rose-800">Pelanggaran SLA Mayor</div>
              <div class="rpt-big text-rose-700">{{ reportStats.breaches }} <span class="text-xs font-bold">Breaches</span></div>
              <div class="rpt-sub text-slate-500">{{ reportStats.breaches > 0 ? 'Berpotensi pinalti finansial' : 'Nol pinalti finansial' }}</div>
            </div>
          </div>
          <div class="rpt-card bg-indigo-50 border-indigo-200">
            <span class="rpt-icon bg-indigo-500"><span class="material-symbols-outlined">timer</span></span>
            <div>
              <div class="rpt-label text-indigo-800">Mean Time to Restore (MTTR)</div>
              <div class="rpt-big text-indigo-900">{{ reportStats.mttr }}</div>
              <div class="rpt-sub text-slate-500">Rata-rata waktu penyelesaian</div>
            </div>
          </div>
        </div>

        <!-- Row 3: Account Performance + Priority Chart -->
        <div class="grid grid-cols-5 gap-2">
          <div class="col-span-3 rpt-panel">
            <div class="rpt-panel-title"><span class="material-symbols-outlined">business</span>
              <div>Account SLA Performance (Performa per Mitra)<p>Evaluasi pemenuhan SLA per instansi klien</p></div>
            </div>
            <table class="rpt-table">
              <thead>
                <tr>
                  <th class="text-left">Customer Entity</th><th>Contract Tier</th><th>Total</th>
                  <th>Resp. SLA%</th><th>Resol. SLA%</th><th>Avg MTTR</th><th>Breaches</th><th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="acc in customerShown.rows" :key="acc.id">
                  <td class="text-left font-bold text-blue-900">{{ acc.name }}</td>
                  <td class="text-[7px]">{{ acc.tier }}</td>
                  <td class="font-bold">{{ acc.handled }}</td>
                  <td class="font-bold" :class="acc.responseRate !== null && acc.responseRate < 90 ? 'text-rose-600' : 'text-emerald-600'">{{ acc.responseRate !== null ? `${acc.responseRate}%` : '-' }}</td>
                  <td class="font-bold" :class="acc.resolutionRate !== null && acc.resolutionRate < 90 ? 'text-rose-600' : 'text-emerald-600'">{{ acc.resolutionRate !== null ? `${acc.resolutionRate}%` : '-' }}</td>
                  <td>{{ acc.mttr }}</td>
                  <td class="font-bold" :class="acc.breaches > 0 ? 'text-rose-600' : 'text-slate-400'">{{ acc.breaches }}</td>
                  <td>
                    <span class="material-symbols-outlined text-[15px]" :class="acc.trendColor">{{ acc.trendIcon }}</span>
                  </td>
                </tr>
                <tr v-if="customerShown.hidden > 0"><td colspan="8" class="text-slate-500 italic py-0.5 text-[7px]">+ {{ customerShown.hidden }} mitra lainnya (lihat ekspor Excel)</td></tr>
                <tr v-if="customerShown.rows.length === 0"><td colspan="8" class="text-slate-400 py-2">Belum ada data mitra.</td></tr>
              </tbody>
            </table>
          </div>

          <div class="col-span-2 rpt-panel flex flex-col">
            <div class="rpt-panel-title"><span class="material-symbols-outlined">bar_chart</span>
              <div>Incident Priority Distribution<p>Berdasarkan ITIL Severity Matrix (Total: {{ reportStats.total }} Tiket)</p></div>
            </div>
            <div class="px-1 flex-1 flex flex-col justify-between">
              <!-- bars stretch to the bottom of the card; baseline sits at the card's bottom edge -->
              <div class="flex-1 min-h-[105px] print:min-h-[75px] flex items-stretch justify-around gap-2 pt-4 border-b-2 border-slate-400">
                <div v-for="p in priorityDistribution" :key="p.key" class="relative w-1/3">
                  <div class="absolute bottom-0 left-0 right-0" :style="{ height: Math.max(p.count / maxPriorityCount * 88, p.count ? 6 : 2) + '%' }">
                    <span class="absolute -top-4 print:-top-3.5 left-0 right-0 text-center text-[10px] print:text-[8px] font-bold text-slate-700 whitespace-nowrap">{{ p.count }} ({{ p.pct }}%)</span>
                    <div class="w-full h-full rounded-t" :class="p.color"></div>
                  </div>
                </div>
              </div>
              <div class="flex justify-around gap-2 pt-1 pb-0.5">
                <div v-for="p in priorityDistribution" :key="p.key + '-l'" class="w-1/3 text-center leading-tight">
                  <div class="text-xs print:text-[8px] font-bold">{{ p.short }}</div>
                  <div class="text-[11px] print:text-[7px] text-slate-500">{{ p.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 4: Engineer Roster -->
        <div class="rpt-panel">
          <div class="rpt-panel-title"><span class="material-symbols-outlined">engineering</span>
            <div>Engineer Workload &amp; Resolution Velocity Roster<p>Produktivitas tim teknis pada periode laporan</p></div>
          </div>
          <table class="rpt-table">
            <thead>
              <tr><th class="text-left">Engineer Name &amp; Role</th><th>Active Load</th><th>Resolved Tickets</th><th>Avg MTTR</th><th>SLA Compliance</th></tr>
            </thead>
            <tbody>
              <tr v-for="eng in engineerShown.rows" :key="eng.name">
                <td class="text-left font-semibold">{{ eng.name }} <span class="text-slate-500 font-normal">({{ eng.role }})</span></td>
                <td>{{ eng.activeCount }}</td>
                <td>{{ eng.resolvedCount }}</td>
                <td>{{ eng.avgMttr }}</td>
                <td>
                  <span v-if="eng.compliance !== null" class="inline-block min-w-[38px] rounded px-1.5 py-0.5 font-bold"
                    :class="eng.compliance >= 90 ? 'bg-emerald-100 text-emerald-700' : eng.compliance >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'">{{ eng.compliance }}%</span>
                  <span v-else class="text-slate-400">-</span>
                </td>
              </tr>
              <tr v-if="engineerShown.hidden > 0"><td colspan="5" class="text-slate-500 italic py-0.5 text-[7px]">+ {{ engineerShown.hidden }} engineer lainnya (lihat ekspor Excel)</td></tr>
              <tr v-if="engineerRoster.length === 0"><td colspan="5" class="text-slate-400 py-2">Belum ada tiket yang ditugaskan.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Row 5: Knowledge Base / Runbooks (Top 4 Artikel) -->
        <div class="rpt-panel">
          <div class="rpt-panel-title"><span class="material-symbols-outlined">menu_book</span>
            <div>Knowledge Base / Runbooks (Top 4 Artikel Terverifikasi)<p>Dokumentasi mitigasi teknis yang telah divalidasi</p></div>
          </div>
          <table class="rpt-table">
            <thead>
              <tr>
                <th class="text-left">Artikel / Judul Solusi</th>
                <th>Kategori Teknis</th>
                <th>Author PIC</th>
                <th>Tgl Terakhir Update</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="kb in topKbArticles" :key="kb.id">
                <td class="text-left font-medium text-slate-800">{{ kb.title }}</td>
                <td>{{ kb.categoryName || kb.category || '-' }}</td>
                <td>{{ kb.author || '-' }}</td>
                <td>{{ kb.date }}</td>
              </tr>
              <tr v-if="!topKbArticles || topKbArticles.length === 0"><td colspan="4" class="text-slate-400 py-1.5">Belum ada artikel knowledge base tercatat.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Row 6: Formal Sign-off Cards (Area Tanda Tangan Basah / Manual) -->
        <div class="grid grid-cols-2 gap-3.5 mt-3 print:mt-2.5 break-inside-avoid">
          <!-- Kotak Kiri: Disiapkan Oleh (Helpdesk Lead) -->
          <div class="border border-slate-200 rounded-xl p-4 print:p-2 bg-white shadow-2xs flex flex-col items-center justify-between text-center min-h-[140px] print:min-h-[90px]">
            <p class="text-blue-950 font-bold text-xs print:text-[8.5px] tracking-tight">
              Disiapkan Oleh :
            </p>
            
            <!-- Ruang Kosong untuk Tanda Tangan Manual -->
            <div class="h-16 print:h-9 w-full flex items-center justify-center">
              <span class="text-[10px] print:text-[7px] text-slate-300 font-mono italic print:hidden">[ Ruang Tanda Tangan ]</span>
            </div>

            <div class="space-y-0.5">
              <p class="font-extrabold text-blue-950 text-xs print:text-[9px]">{{ authStore.currentUser.name }}</p>
              <p class="text-[11px] print:text-[7.5px] text-slate-500 font-medium">{{ (authStore.currentUser?.role || authStore.currentUser?.roleCode) === 'ADMIN' ? 'System Administrator' : 'Support Engineer' }}</p>
              <p class="text-[11px] print:text-[7.5px] text-blue-700 font-medium">{{ reportPrintDate.local.split(',')[0] }}</p>
            </div>
          </div>

          <!-- Kotak Kanan: Disetujui Oleh (Management) -->
          <div class="border border-slate-200 rounded-xl p-4 print:p-2 bg-white shadow-2xs flex flex-col items-center justify-between text-center min-h-[140px] print:min-h-[90px]">
            <p class="text-blue-950 font-bold text-xs print:text-[8.5px] tracking-tight">
              Disetujui Oleh :
            </p>

            <!-- Ruang Kosong untuk Tanda Tangan Manual -->
            <div class="h-16 print:h-9 w-full flex items-center justify-center">
              <span class="text-[10px] print:text-[7px] text-slate-300 font-mono italic print:hidden">[ Ruang Tanda Tangan &amp; Cap ]</span>
            </div>

            <div class="w-full max-w-[200px] print:max-w-[140px] space-y-0.5">
              <!-- Garis Tanda Tangan -->
              <div class="border-b-2 border-blue-950 w-full mx-auto pb-0.5 mb-1">
                <input
                  v-if="!isPrinting"
                  v-model="approverName"
                  type="text"
                  placeholder="Nama Penyetuju..."
                  class="w-full text-center text-xs print:text-[9px] font-bold text-blue-950 bg-transparent focus:outline-none print:hidden placeholder:text-slate-300"
                />
                <p v-if="approverName" class="font-extrabold text-blue-950 text-xs print:text-[9px] hidden print:block">
                  {{ approverName }}
                </p>
              </div>
              <div>
                <input
                  v-if="!isPrinting"
                  v-model="approverTitle"
                  type="text"
                  placeholder="Jabatan Penyetuju..."
                  class="w-full text-center text-[11px] print:text-[7.5px] text-slate-600 font-medium bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:outline-none print:hidden placeholder:text-slate-300 py-0.5"
                  title="Klik untuk mengubah jabatan penyetuju"
                />
                <p class="text-[11px] print:text-[7.5px] text-slate-600 font-medium hidden print:block">
                  {{ approverTitle || 'Service Operations Manager' }}
                </p>
              </div>
            </div>  
          </div>
        </div>

        <div class="flex justify-between text-[8px] text-slate-500 border-t border-slate-200 pt-1.5 print:hidden">
          <span>GTT Helpdesk Ticketing - PT Global Transformasi Teknologi</span>
          <span>Halaman 1 dari 2</span>
        </div>
      </section>

      <!-- ================= PAGE 2 ================= -->
      <section class="report-page report-page-2 bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-xs space-y-3.5 print:space-y-1.5 print:p-0">
        <div class="flex items-center justify-between border-b-2 border-slate-800 pb-3 print:pb-2 gap-4">
          <div class="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
            <img src="/gtt-logo.png" alt="Glotra Technology" class="h-12 print:h-9 w-auto object-contain flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <h2 class="text-base md:text-lg print:text-sm font-black text-slate-900 leading-tight">PT GLOBAL TRANSFORMASI TEKNOLOGI</h2>
              <p class="text-xs print:text-[9.5px] text-slate-600 italic">"Think it, Solve it" &bull; IT Enterprise Managed Services &amp; Infrastructure Support</p>
              <p class="text-[11px] print:text-[8px] text-slate-500 break-words leading-tight">Prudential Center Kota Kasablanka Fl 22 Unit A Jalan Casablanca Kav. 88, RT.7/RW.9, Menteng Dalam, Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12870</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <span class="text-xs print:text-[9.5px] font-mono font-bold text-blue-700 block bg-blue-50 px-2.5 py-1 print:py-0.5 rounded border border-blue-200">REPORT-SLA-{{ currentMonthYear }}</span>
            <span class="text-[11px] print:text-[8px] text-slate-400 block mt-1 print:mt-0.5 whitespace-nowrap">Generated: {{ reportPrintDate.local }}</span>
          </div>
        </div>

        <div class="text-center space-y-1 print:space-y-0.5 py-1 print:py-0.5">
          <h3 class="text-base md:text-lg print:text-xs font-black text-slate-900 uppercase tracking-wide">DAFTAR CASE HELPDESK</h3>
          <p class="text-xs print:text-[9.5px] text-slate-600 font-medium">Periode Evaluasi: <strong class="text-blue-700">{{ activePeriodLabel }}</strong> &bull; <strong class="text-emerald-700">{{ activeSlaStandardLabel }}</strong></p>
        </div>

        <!-- Status filter chips (summary counts) -->
        <div class="flex flex-wrap justify-center gap-2 print:gap-1 text-xs print:text-[7.5px] font-bold">
          <span class="rpt-chip bg-blue-600 text-white border-blue-600">All ({{ reportStats.total }})</span>
          <span class="rpt-chip bg-orange-50 text-orange-700 border-orange-300">Open ({{ statusCounts.open }})</span>
          <span class="rpt-chip bg-blue-50 text-blue-700 border-blue-300">In Progress ({{ statusCounts.progress }})</span>
          <span class="rpt-chip bg-purple-50 text-purple-700 border-purple-300">Hold ({{ statusCounts.hold }})</span>
          <span class="rpt-chip bg-emerald-50 text-emerald-700 border-emerald-300">Resolved ({{ statusCounts.resolved }})</span>
          <span class="rpt-chip bg-slate-50 text-slate-600 border-slate-300">Closed ({{ statusCounts.closed }})</span>
        </div>

        <!-- Table with horizontal scroll on screen and full-fit on print -->
        <div class="rpt-cases-wrap w-full overflow-x-auto print:overflow-visible">
          <table class="rpt-table rpt-cases">
            <thead>
              <tr>
                <th>No.</th>
                <th>Ticket ID</th>
                <th>Tgl Open</th>
                <th>Tgl Closed</th>
                <th>Cust.</th>
                <th>Device / Kategori</th>
                <th>Serial Number</th>
                <th>Severity</th>
                <th class="text-left">Issue</th>
                <th class="text-left">Resolusi</th>
                <th>Engineer PIC</th>
                <th>Status</th>
                <th>Resp.</th>
                <th>Resol.</th>
                <th>SLA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in caseRows" :key="row.id">
                <td>{{ idx + 1 }}</td>
                <td class="font-bold text-blue-700 whitespace-nowrap">{{ row.ticketNumber }}</td>
                <td class="leading-tight text-center">
                  <div class="font-medium text-slate-800">{{ row.openDateObj ? row.openDateObj.date : '-' }}</div>
                  <div v-if="row.openDateObj" class="text-[10px] print:text-[5.5px] text-slate-500 font-mono">{{ row.openDateObj.time }}</div>
                </td>
                <td class="leading-tight text-center">
                  <template v-if="row.closedDateObj">
                    <div class="font-medium text-slate-800">{{ row.closedDateObj.date }}</div>
                    <div class="text-[10px] print:text-[5.5px] text-slate-500 font-mono">{{ row.closedDateObj.time }}</div>
                  </template>
                  <span v-else class="text-slate-400 font-mono">-</span>
                </td>
                <td :title="row.customerFull" class="font-semibold text-slate-800 text-center">
                  {{ row.customerShort }}
                </td>
                <td class="text-center">{{ row.category }}</td>
                <td class="font-mono text-slate-700 text-center break-all">{{ row.serialNumber }}</td>
                <td class="text-center"><span class="rpt-badge" :class="row.sevClass">{{ row.sev }}</span></td>
                <td class="text-left">{{ row.title }}</td>
                <td class="text-left">{{ row.resolution }}</td>
                <td class="text-center">{{ row.engineer }}</td>
                <td class="text-center"><span class="rpt-badge" :class="row.statusClass">{{ row.statusLabel }}</span></td>
                <td class="text-center">{{ row.responseTime }}</td>
                <td class="text-center">{{ row.resolutionTime }}</td>
                <td class="text-center"><span class="rpt-badge" :class="row.slaClass">{{ row.slaLabel }}</span></td>
              </tr>
              <tr v-if="caseRows.length === 0"><td colspan="15" class="text-slate-400 py-4 text-center">Belum ada tiket pada periode ini.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Formal sign-off: placed at the end of the document, kept together on one page -->
        <div class="grid grid-cols-2 gap-16 print:gap-8 pt-6 print:pt-3 text-center text-xs print:text-[8.5px] break-inside-avoid" style="break-inside: avoid; page-break-inside: avoid;">
          <div class="flex flex-col items-center">
            <p class="text-slate-600 font-semibold text-xs print:text-[8px]">Disiapkan Oleh :</p>
            <div class="h-16 print:h-9"></div>
            <p class="font-bold text-slate-900 underline text-xs print:text-[9px]">{{ authStore.currentUser.name }}</p>
            <p class="text-slate-500 text-[11px] print:text-[7.5px]">{{ (authStore.currentUser?.role || authStore.currentUser?.roleCode) === 'ADMIN' ? 'Helpdesk Administrator' : 'Support Engineer' }}</p>
            <p class="text-slate-500 text-[11px] print:text-[7.5px]">{{ reportPrintDate.local.split(',')[0] }}</p>
          </div>
          <div class="flex flex-col items-center">
            <p class="text-slate-600 font-semibold text-xs print:text-[8px]">Disetujui Oleh :</p>
            <div class="h-16 print:h-9"></div>
            <input v-if="!isPrinting" v-model="approverName" type="text" placeholder="Nama Penyetuju..."
              class="w-full border-b border-slate-300 text-center text-xs print:text-[9px] font-bold bg-transparent focus:outline-none print:hidden placeholder:text-slate-300" />
            <p class="font-bold text-slate-900 underline hidden print:block text-[9px]">{{ approverName || '___________________' }}</p>
            <input v-if="!isPrinting" v-model="approverTitle" type="text" placeholder="Jabatan..."
              class="w-full text-center text-[11px] print:text-[7.5px] text-slate-500 bg-transparent focus:outline-none mt-1 border-b border-slate-200 print:hidden placeholder:text-slate-300" />
            <p class="text-slate-500 hidden print:block text-[7.5px]">{{ approverTitle || 'Service Operations Manager' }}</p>
          </div>
        </div>
        <div class="flex justify-between text-[8px] text-slate-500 border-t border-slate-200 pt-1.5 print:hidden">
          <span>GTT Helpdesk Ticketing - PT Global Transformasi Teknologi</span>
          <span>Halaman 2 dari 2</span>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { useAuthStore } from '../stores/authStore';
import { formatUtcToLocal } from '../utils/dateFormatter';

const ticketStore = useTicketStore();
const authStore = useAuthStore();

const approverName = ref('');
const approverTitle = ref('Service Operations Manager');
const isPrinting = ref(false);

const srcTickets = computed(() => ticketStore.tickets);
const srcCustomers = computed(() => ticketStore.customers);
const srcUsers = computed(() => authStore.users);
const srcCategories = computed(() => ticketStore.categories);
const srcKb = computed(() => ticketStore.knowledgeBase);
const periodOptions = [
  { id: 'ALL_TIME',   label: 'Semua (YTD)' },
  { id: 'THIS_MONTH', label: 'Bulan Ini' },
  { id: 'THIS_WEEK',  label: '7 Hari Terakhir' },
  { id: 'LAST_MONTH', label: 'Bulan Lalu' },
  { id: 'CUSTOM',     label: 'Rentang Kustom...' }
];

const selectedPeriod = ref('ALL_TIME');
const selectedCustomer = ref('');
const customStartDate = ref('');
const customEndDate = ref('');

const customerReportOptions = computed(() => [
  { value: '', label: 'Semua Mitra Korporat' },
  ...(ticketStore.customers || []).map(c => ({
    value: c.id,
    label: c.name,
    badge: c.slaTier || ''
  }))
]);

const reportPrintDate = formatUtcToLocal(new Date().toISOString());
const currentMonthYear = new Date().toISOString().slice(0, 7);

const activePeriodLabel = computed(() => {
  if (selectedPeriod.value === 'CUSTOM') {
    return `Rentang Kustom: ${customStartDate.value} s.d. ${customEndDate.value}`;
  }
  const p = periodOptions.find(item => item.id === selectedPeriod.value);
  return p ? p.label : 'Semua Waktu';
});

const activeSlaStandardLabel = computed(() => {
  if (selectedCustomer.value) {
    const cust = srcCustomers.value.find(c => c.id === Number(selectedCustomer.value));
    if (cust) {
      const tier = cust.slaTier || cust.contractTier || 'SLA Korporat';
      return `Mitra: ${cust.name} — Paket: ${tier}`;
    }
  }
  return 'Cakupan: Konsolidasi Seluruh Mitra Korporat';
});

const reportTickets = computed(() => {
  return srcTickets.value.filter(t => {
    if (selectedCustomer.value && t.customerId !== Number(selectedCustomer.value)) return false;
    const created = new Date(t.createdAt);
    const now = new Date();
    if (selectedPeriod.value === 'THIS_WEEK') {
      if (created < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) return false;
    } else if (selectedPeriod.value === 'THIS_MONTH') {
      if (created.getMonth() !== now.getMonth() || created.getFullYear() !== now.getFullYear()) return false;
    } else if (selectedPeriod.value === 'LAST_MONTH') {
      const lm = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const ly = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      if (created.getMonth() !== lm || created.getFullYear() !== ly) return false;
    } else if (selectedPeriod.value === 'CUSTOM' && customStartDate.value && customEndDate.value) {
      if (created < new Date(customStartDate.value) || created > new Date(customEndDate.value + 'T23:59:59')) return false;
    }
    return true;
  });
});

function calcMttr(tickets) {
  const resolved = tickets.filter(t => t.resolvedAt && t.createdAt);
  if (!resolved.length) return '-';
  const avgMin = resolved.reduce((a, t) => a + (new Date(t.resolvedAt) - new Date(t.createdAt)) / 60000, 0) / resolved.length;
  const h = Math.floor(avgMin / 60), m = Math.round(avgMin % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const reportStats = computed(() => {
  const t = reportTickets.value;
  const total = t.length;
  const breaches = t.filter(x => x.isSlaResolutionBreached).length;
  return {
    total,
    slaRate: total > 0 ? ((total - breaches) / total * 100).toFixed(1) : null,
    breaches,
    mttr: calcMttr(t)
  };
});

const channelDistribution = computed(() => {
  const t = reportTickets.value;
  const total = t.length || 1;
  return [
    { key: 'WHATSAPP', label: 'WhatsApp Support', color: 'bg-emerald-500', textColor: 'text-emerald-700' },
    { key: 'EMAIL',    label: 'Email Support',    color: 'bg-blue-500',    textColor: 'text-blue-700' },
    { key: 'PHONE',    label: 'Telepon Hotline',  color: 'bg-purple-500',  textColor: 'text-purple-700' },
    { key: 'PORTAL',   label: 'Portal / NOC',     color: 'bg-slate-600',   textColor: 'text-slate-700' }
  ].map(ch => {
    const count = t.filter(x => (x.channel || '').toUpperCase() === ch.key).length;
    return { ...ch, count, pct: Math.round(count / total * 100) };
  }).filter(ch => ch.count > 0);
});

const priorityDistribution = computed(() => {
  const t = reportTickets.value;
  const total = t.length;
  return [
    { key: 'HIGH',   short: 'Critical', name: 'Critical', label: 'Critical Severity', color: 'bg-rose-500',  textColor: 'text-rose-700' },
    { key: 'MEDIUM', short: 'Med',      name: 'Medium',   label: 'Medium Severity',   color: 'bg-amber-500', textColor: 'text-amber-700' },
    { key: 'LOW',    short: 'Low',      name: 'Low',      label: 'Low Severity',      color: 'bg-sky-500',   textColor: 'text-sky-700' }
  ].map(p => {
    const count = t.filter(x => {
      const sev = (x.severity || '').toUpperCase();
      if (p.key === 'HIGH') return sev === 'HIGH' || sev === 'CRITICAL';
      return sev === p.key;
    }).length;
    return { ...p, count, pct: total > 0 ? Math.round(count / total * 100) : 0 };
  });
});

const maxPriorityCount = computed(() => Math.max(1, ...priorityDistribution.value.map(p => p.count)));

const customerPerformance = computed(() =>
  srcCustomers.value.map(cust => {
    const ct = reportTickets.value.filter(t => t.customerId === cust.id);
    const handled = ct.length;
    const breaches = ct.filter(t => t.isSlaResolutionBreached).length;
    const responseBreaches = ct.filter(t => t.isSlaResponseBreached).length;
    const responseRate = handled > 0 ? +((handled - responseBreaches) / handled * 100).toFixed(1) : null;
    const resolutionRate = handled > 0 ? +((handled - breaches) / handled * 100).toFixed(1) : null;
    const trend = handled === 0 ? 'NO DATA' : (resolutionRate >= 99 ? 'EXCELLENT' : resolutionRate >= 95 ? 'STABLE' : 'NEEDS REVIEW');
    const trendIcon = trend === 'EXCELLENT' ? 'trending_up' : trend === 'STABLE' ? 'trending_flat' : trend === 'NO DATA' ? 'remove' : 'trending_down';
    const trendColor = trend === 'EXCELLENT' ? 'text-emerald-600' : trend === 'STABLE' ? 'text-amber-500' : trend === 'NO DATA' ? 'text-slate-400' : 'text-rose-600';
    return {
      id: cust.id, name: cust.name, tier: cust.slaTier || cust.contractTier || '-',
      handled, responseRate, resolutionRate, mttr: calcMttr(ct), breaches, trend, trendIcon, trendColor,
      trendBadge: trend === 'EXCELLENT' ? 'bg-emerald-100 text-emerald-800' : trend === 'STABLE' ? 'bg-blue-100 text-blue-800' : trend === 'NO DATA' ? 'bg-slate-100 text-slate-500' : 'bg-rose-100 text-rose-800'
    };
  })
);

const getUserById = (id) => srcUsers.value.find(u => u.id === Number(id));

const engineerRoster = computed(() => {
  const map = {};
  reportTickets.value.filter(t => t.assignedToId).forEach(t => {
    const id = t.assignedToId;
    const u = t.assignedTo || getUserById(id);
    if (!map[id]) map[id] = { name: u?.name || `Engineer #${id}`, role: (u?.role || u?.roleCode) === 'ADMIN' ? 'Admin' : 'Engineer', tickets: [] };
    map[id].tickets.push(t);
  });
  return Object.values(map).map(eng => {
    const active = eng.tickets.filter(t => !['RESOLVED','CLOSED'].includes(t.status)).length;
    const resolved = eng.tickets.filter(t => ['RESOLVED','CLOSED'].includes(t.status)).length;
    const breaches = eng.tickets.filter(t => t.isSlaResolutionBreached).length;
    return {
      name: eng.name, role: eng.role, activeCount: active, resolvedCount: resolved,
      avgMttr: calcMttr(eng.tickets),
      compliance: eng.tickets.length > 0 ? Math.round((eng.tickets.length - breaches) / eng.tickets.length * 100) : null
    };
  });
});

// Page 1 must stay on a single A4 sheet: cap long lists and show a "+N lainnya" note.
const MAX_ACCOUNT_ROWS = 4;
const MAX_ENGINEER_ROWS = 4;

const customerShown = computed(() => {
  const active = customerPerformance.value.filter(c => c.handled > 0).sort((a, b) => b.handled - a.handled);
  return { rows: active.slice(0, MAX_ACCOUNT_ROWS), hidden: Math.max(0, active.length - MAX_ACCOUNT_ROWS) };
});

const engineerShown = computed(() => {
  const sorted = [...engineerRoster.value].sort((a, b) => (b.activeCount + b.resolvedCount) - (a.activeCount + a.resolvedCount));
  return { rows: sorted.slice(0, MAX_ENGINEER_ROWS), hidden: Math.max(0, sorted.length - MAX_ENGINEER_ROWS) };
});

// ---- Status summary ----
const statusCounts = computed(() => {
  const t = reportTickets.value;
  const c = (arr) => t.filter(x => arr.includes(x.status)).length;
  return {
    open: c(['OPEN', 'ASSIGNED']),
    progress: c(['IN_PROGRESS']),
    hold: c(['PENDING_VENDOR', 'PENDING_CUSTOMER']),
    resolved: c(['RESOLVED']),
    closed: c(['CLOSED'])
  };
});

const pctOf = (n) => reportStats.value.total > 0 ? (n / reportStats.value.total * 100).toFixed(1) : '0.0';

// ---- Knowledge Base top 5 ----
const topKbArticles = computed(() => {
  try {
    const list = Array.isArray(srcKb.value) ? srcKb.value : [];
    return [...list]
      .sort((a, b) => (b.usageCount || b.usedCount || 0) - (a.usageCount || a.usedCount || 0) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4)
      .map(kb => {
        let dateStr = '-';
        if (kb.createdAt && !isNaN(new Date(kb.createdAt).getTime())) {
          const formatted = formatUtcToLocal(kb.createdAt);
          dateStr = (formatted.local || '-').split(',')[0];
        } else if (kb.updatedAt) {
          dateStr = typeof kb.updatedAt === 'string' ? kb.updatedAt : '-';
        }
        return {
          ...kb,
          date: dateStr
        };
      });
  } catch (err) {
    console.error('Failed to compute topKbArticles:', err);
    return [];
  }
});

// ---- Case list (page 2) ----
const fmtMinutes = (min) => {
  if (min === null || min === undefined || isNaN(min) || min < 0) return '-';
  if (min < 60) return `${Math.round(min)}m`;
  const h = Math.round(min / 60);
  return h < 48 ? `${h}h` : `${Math.round(h / 24)}d`;
};

const STATUS_META = {
  OPEN:             { label: 'Open',        cls: 'bg-orange-100 text-orange-700' },
  ASSIGNED:         { label: 'Open',        cls: 'bg-orange-100 text-orange-700' },
  IN_PROGRESS:      { label: 'In Progress', cls: 'bg-blue-100 text-blue-700' },
  PENDING_VENDOR:   { label: 'Hold',        cls: 'bg-purple-100 text-purple-700' },
  PENDING_CUSTOMER: { label: 'Hold',        cls: 'bg-purple-100 text-purple-700' },
  RESOLVED:         { label: 'Resolved',    cls: 'bg-emerald-100 text-emerald-700' },
  CLOSED:           { label: 'Closed',      cls: 'bg-emerald-600 text-white' }
};

const SEV_META = {
  CRITICAL: { label: 'Critical', cls: 'bg-red-600 text-white' },
  HIGH:     { label: 'Critical', cls: 'bg-red-600 text-white' },
  CRIT:     { label: 'Critical', cls: 'bg-red-600 text-white' },
  MEDIUM:   { label: 'Med',      cls: 'bg-amber-500 text-white' },
  MED:      { label: 'Med',      cls: 'bg-amber-500 text-white' },
  LOW:      { label: 'Low',      cls: 'bg-sky-500 text-white' }
};

const formatReportDateParts = (isoDate) => {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return null;

  const datePart = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(d);

  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  }).format(d).replace('.', ':') + ' WIB';

  return {
    date: datePart,
    time: timePart,
    full: `${datePart}, ${timePart}`
  };
};

const getCustomerShortName = (customerId) => {
  const c = srcCustomers.value.find(item => item.id === customerId);
  if (!c) return '-';
  if (c.code) return c.code;
  const name = c.name || '';
  if (name.includes('Astra Graphia')) return 'AGIT';
  if (name.includes('BCA') || name.includes('Bank Central Asia')) return 'BCA';
  if (name.includes('Telkomsel')) return 'Telkomsel';
  if (name.includes('Mandiri')) return 'Mandiri';
  if (name.includes('BRI')) return 'BRI';
  if (name.includes('BNI')) return 'BNI';

  // Strip PT/CV/Tbk
  const clean = name.replace(/^(PT|CV|PT\.)\s+/i, '').replace(/\s+(Tbk|\(Persero\))\s*/gi, '').trim();
  if (clean.length > 15) {
    return clean.slice(0, 14) + '…';
  }
  return clean || name;
};

const caseRows = computed(() => {
  const now = Date.now();
  return [...reportTickets.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(t => {
      const st = STATUS_META[t.status] || { label: t.status, cls: 'bg-slate-100 text-slate-700' };
      const sv = SEV_META[(t.severity || '').toUpperCase()] || { label: (t.severity || '-'), cls: 'bg-slate-200 text-slate-700' };
      const done = ['RESOLVED', 'CLOSED'].includes(t.status);
      const created = new Date(t.createdAt).getTime();
      const respMin = t.respondedAt ? (new Date(t.respondedAt).getTime() - created) / 60000 : null;
      const resMin = t.resolvedAt ? (new Date(t.resolvedAt).getTime() - created) / 60000 : null;

      let slaLabel, slaClass;
      if (t.isSlaResolutionBreached || t.isSlaResponseBreached) {
        slaLabel = 'Breached'; slaClass = 'bg-red-100 text-red-700';
      } else if (done) {
        slaLabel = 'Met'; slaClass = 'bg-emerald-100 text-emerald-700';
      } else if (t.isPaused || ['PENDING_VENDOR', 'PENDING_CUSTOMER'].includes(t.status)) {
        slaLabel = 'Paused'; slaClass = 'bg-purple-100 text-purple-700';
      } else if (t.resolutionDeadline && new Date(t.resolutionDeadline).getTime() - now < 2 * 3600 * 1000) {
        slaLabel = 'At Risk'; slaClass = 'bg-amber-100 text-amber-700';
      } else {
        slaLabel = 'Running'; slaClass = 'bg-sky-100 text-sky-700';
      }

      const cat = srcCategories.value.find(c => c.id === t.categoryId);
      const eng = t.assignedTo || getUserById(t.assignedToId);
      const resolution = t.resolutionStrategy || t.actionTaken || t.resolutionNotes || t.rootCause || '-';
      
      const openDateParts = formatReportDateParts(t.createdAt);
      const closedDateParts = (t.closedAt || (done && t.resolvedAt)) ? formatReportDateParts(t.closedAt || t.resolvedAt) : null;
      const custShort = getCustomerShortName(t.customerId);
      const custFull = getCustomerName(t.customerId);

      return {
        id: t.id,
        ticketNumber: t.ticketNumber,
        openDateObj: openDateParts,
        closedDateObj: closedDateParts,
        openDate: openDateParts ? openDateParts.full : '-',
        closedDate: closedDateParts ? closedDateParts.full : '-',
        customerShort: custShort,
        customer: custShort,
        customerFull: custFull,
        category: cat ? cat.name : '-',
        serialNumber: t.serialNumber || '-',
        sev: sv.label,
        sevClass: sv.cls,
        title: t.title,
        resolution,
        engineer: eng ? eng.name : '-',
        statusLabel: st.label,
        statusClass: st.cls,
        responseTime: fmtMinutes(respMin),
        resolutionTime: fmtMinutes(resMin),
        slaLabel,
        slaClass
      };
    });
});

const getCustomerName = (id) => {
  const c = srcCustomers.value.find(item => item.id === id);
  return c ? c.name : 'Unknown';
};

const triggerPrint = () => {
  const source = document.getElementById('printable-report');
  if (!source) return;
  isPrinting.value = true;

  // Render the report in an isolated iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:100%;height:100%;border:0;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(n => n.outerHTML).join('\n');
  const base = `${location.origin}/`;
  doc.open();
  doc.write(`<!doctype html><html lang="id"><head><meta charset="utf-8"><base href="${base}">
    <title>Laporan SLA - GTT Helpdesk</title>${headStyles}
    <style>
      @page {
        size: A4 portrait;
        margin: 6mm 6mm 6mm 6mm;
      }
      *, *::before, *::after {
        box-sizing: border-box !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow: visible !important;
      }
      #printable-report {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }
    </style>
    </head><body>${source.outerHTML}</body></html>`);
  doc.close();

  const cleanup = () => {
    isPrinting.value = false;
    setTimeout(() => iframe.remove(), 500);
  };

  const doPrint = () => {
    const win = iframe.contentWindow;
    win.focus();
    win.onafterprint = cleanup;
    win.print();
    setTimeout(cleanup, 60000);
  };

  // Wait for fonts/images (logo, Material Symbols) before opening print dialog
  setTimeout(() => {
    const ready = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
    ready.then(() => setTimeout(doPrint, 300));
  }, 400);
};

const exportExcel = async () => {
  const { default: ExcelJS } = await import('exceljs');
  const wb = new ExcelJS.Workbook();
  wb.creator = authStore.currentUser?.name || 'GTT Helpdesk';
  wb.created = new Date();

  const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  const THIN = { style: 'thin', color: { argb: 'FFCBD5E1' } };
  const BORDER = { top: THIN, left: THIN, bottom: THIN, right: THIN };
  const fmtDate = (iso) => (iso ? formatUtcToLocal(iso).local : '-');

  // Builds a styled table sheet: title rows, header row, data rows, filter + frozen header.
  const addTableSheet = (name, title, columns, rows) => {
    const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 4 }] });
    ws.mergeCells(1, 1, 1, columns.length);
    ws.getCell(1, 1).value = title;
    ws.getCell(1, 1).font = { bold: true, size: 14, color: { argb: 'FF1E3A8A' } };
    ws.mergeCells(2, 1, 2, columns.length);
    ws.getCell(2, 1).value = `PT Global Transformasi Teknologi  |  Periode: ${activePeriodLabel.value}  |  Standar: ${activeSlaStandardLabel.value}`;
    ws.getCell(2, 1).font = { italic: true, size: 10, color: { argb: 'FF475569' } };

    const header = ws.getRow(4);
    columns.forEach((col, i) => {
      const cell = header.getCell(i + 1);
      cell.value = col.header;
      cell.fill = HEADER_FILL;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = BORDER;
      ws.getColumn(i + 1).width = col.width || 16;
    });
    header.height = 24;

    rows.forEach((r, ri) => {
      const row = ws.addRow(r);
      row.eachCell({ includeEmpty: true }, (cell, ci) => {
        const col = columns[ci - 1] || {};
        cell.border = BORDER;
        cell.alignment = { vertical: 'middle', horizontal: col.align || 'left', wrapText: !!col.wrap };
        if (col.numFmt) cell.numFmt = col.numFmt;
        if (ri % 2 === 1) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
      });
    });

    if (rows.length) ws.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4 + rows.length, column: columns.length } };
    return ws;
  };

  // =========================================================================
  // ---- Sheet 1: DASHBOARD (Format Khusus Sesuai Mockup Spesifikasi) ----
  // =========================================================================
  const buildDashboardSheet = () => {
    const ws = wb.addWorksheet('DASHBOARD', {
      views: [{ showGridLines: true }]
    });

    // Column Widths for Columns A through H
    ws.getColumn('A').width = 17;
    ws.getColumn('B').width = 11;
    ws.getColumn('C').width = 15;
    ws.getColumn('D').width = 13;
    ws.getColumn('E').width = 15;
    ws.getColumn('F').width = 13;
    ws.getColumn('G').width = 17;
    ws.getColumn('H').width = 11;

    // Row 1: Header Title Banner (Merged A1:H1)
    ws.mergeCells('A1:H1');
    const titleCell = ws.getCell('A1');
    titleCell.value = 'GTT HELPDESK – CASE DASHBOARD';
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0C2340' } // Dark Navy Blue
    };
    titleCell.font = {
      name: 'Calibri',
      size: 15,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(1).height = 28;

    // Row 2: Subtitle (Merged A2:H2)
    ws.mergeCells('A2:H2');
    const subtitleCell = ws.getCell('A2');
    subtitleCell.value = 'Monitoring sederhana untuk pencatatan dan status case helpdesk';
    subtitleCell.font = {
      name: 'Calibri',
      size: 9.5,
      italic: true,
      color: { argb: 'FF475569' }
    };
    subtitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getRow(2).height = 18;

    // Row 3: Spacer
    ws.getRow(3).height = 8;

    // Row 4 & 5: 4 KPI Cards
    const totalCases = reportTickets.value.length;
    const openProgressCount = reportTickets.value.filter(t => ['OPEN', 'ASSIGNED', 'IN_PROGRESS'].includes(t.status) && !t.isPaused).length;
    const closedResolvedCount = reportTickets.value.filter(t => ['RESOLVED', 'CLOSED'].includes(t.status)).length;
    const slaBreachCount = reportTickets.value.filter(t => t.isSlaResolutionBreached || t.isSlaResponseBreached).length;

    // Card 1: TOTAL CASE (A4:B4, A5:B5)
    ws.mergeCells('A4:B4');
    const c1H = ws.getCell('A4');
    c1H.value = 'TOTAL CASE';
    c1H.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } }; // Vibrant Blue
    c1H.font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: 'FFFFFFFF' } };
    c1H.alignment = { horizontal: 'center', vertical: 'middle' };
    c1H.border = {
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    ws.mergeCells('A5:B5');
    const c1V = ws.getCell('A5');
    c1V.value = totalCases;
    c1V.font = { name: 'Calibri', bold: true, size: 20, color: { argb: 'FF0F172A' } };
    c1V.alignment = { horizontal: 'center', vertical: 'middle' };
    c1V.border = {
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    // Card 2: OPEN / IN PROGRESS (C4:D4, C5:D5)
    ws.mergeCells('C4:D4');
    const c2H = ws.getCell('C4');
    c2H.value = 'OPEN / IN PROGRESS';
    c2H.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDE68A' } }; // Warm pastel peach
    c2H.font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: 'FF92400E' } }; // Bold Deep Amber
    c2H.alignment = { horizontal: 'center', vertical: 'middle' };
    c2H.border = {
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    ws.mergeCells('C5:D5');
    const c2V = ws.getCell('C5');
    c2V.value = openProgressCount;
    c2V.font = { name: 'Calibri', bold: true, size: 20, color: { argb: 'FF1E3A8A' } };
    c2V.alignment = { horizontal: 'center', vertical: 'middle' };
    c2V.border = {
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    // Card 3: CLOSED / RESOLVED (E4:F4, E5:F5)
    ws.mergeCells('E4:F4');
    const c3H = ws.getCell('E4');
    c3H.value = 'CLOSED / RESOLVED';
    c3H.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Soft mint green
    c3H.font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: 'FF166534' } }; // Bold Deep Forest Green
    c3H.alignment = { horizontal: 'center', vertical: 'middle' };
    c3H.border = {
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    ws.mergeCells('E5:F5');
    const c3V = ws.getCell('E5');
    c3V.value = closedResolvedCount;
    c3V.font = { name: 'Calibri', bold: true, size: 20, color: { argb: 'FF1E3A8A' } };
    c3V.alignment = { horizontal: 'center', vertical: 'middle' };
    c3V.border = {
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    // Card 4: SLA BREACH (G4:H4, G5:H5)
    ws.mergeCells('G4:H4');
    const c4H = ws.getCell('G4');
    c4H.value = 'SLA BREACH';
    c4H.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }; // Soft pink
    c4H.font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: 'FF991B1B' } }; // Bold Deep Crimson Red
    c4H.alignment = { horizontal: 'center', vertical: 'middle' };
    c4H.border = {
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    ws.mergeCells('G5:H5');
    const c4V = ws.getCell('G5');
    c4V.value = slaBreachCount;
    c4V.font = { name: 'Calibri', bold: true, size: 20, color: { argb: 'FF1E3A8A' } };
    c4V.alignment = { horizontal: 'center', vertical: 'middle' };
    c4V.border = {
      left: { style: 'medium', color: { argb: 'FF16A34A' } },
      right: { style: 'medium', color: { argb: 'FF16A34A' } },
      top: { style: 'medium', color: { argb: 'FF16A34A' } },
      bottom: { style: 'medium', color: { argb: 'FF16A34A' } }
    };

    ws.getRow(4).height = 19;
    ws.getRow(5).height = 30;

    // Row 6 & 7: Spacers
    ws.getRow(6).height = 8;
    ws.getRow(7).height = 10;

    // Row 8: Section Headers
    ws.mergeCells('A8:B8');
    ws.getCell('A8').value = 'RINGKASAN STATUS CASE';
    ws.getCell('A8').font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: 'FF0F172A' } };
    ws.getCell('A8').alignment = { vertical: 'middle', horizontal: 'left' };

    ws.mergeCells('D8:E8');
    ws.getCell('D8').value = 'RINGKASAN SEVERITY';
    ws.getCell('D8').font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: 'FF0F172A' } };
    ws.getCell('D8').alignment = { vertical: 'middle', horizontal: 'left' };

    ws.mergeCells('G8:H8');
    ws.getCell('G8').value = 'RINGKASAN KATEGORI';
    ws.getCell('G8').font = { name: 'Calibri', bold: true, size: 10.5, color: { argb: 'FF0F172A' } };
    ws.getCell('G8').alignment = { vertical: 'middle', horizontal: 'left' };

    ws.getRow(8).height = 20;
    ws.getRow(9).height = 6;

    // Row 10: Table Headers
    const TABLE_HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
    const TABLE_HEADER_FONT = { name: 'Calibri', bold: true, size: 9.5, color: { argb: 'FFFFFFFF' } };

    // Table 1 Header: Status | Jumlah
    ws.getCell('A10').value = 'Status';
    ws.getCell('A10').fill = TABLE_HEADER_FILL;
    ws.getCell('A10').font = TABLE_HEADER_FONT;
    ws.getCell('A10').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('A10').border = BORDER;

    ws.getCell('B10').value = 'Jumlah';
    ws.getCell('B10').fill = TABLE_HEADER_FILL;
    ws.getCell('B10').font = TABLE_HEADER_FONT;
    ws.getCell('B10').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('B10').border = BORDER;

    // Table 2 Header: Severity | Jumlah
    ws.getCell('D10').value = 'Severity';
    ws.getCell('D10').fill = TABLE_HEADER_FILL;
    ws.getCell('D10').font = TABLE_HEADER_FONT;
    ws.getCell('D10').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('D10').border = BORDER;

    ws.getCell('E10').value = 'Jumlah';
    ws.getCell('E10').fill = TABLE_HEADER_FILL;
    ws.getCell('E10').font = TABLE_HEADER_FONT;
    ws.getCell('E10').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('E10').border = BORDER;

    // Table 3 Header: Kategori | Jumlah
    ws.getCell('G10').value = 'Kategori';
    ws.getCell('G10').fill = TABLE_HEADER_FILL;
    ws.getCell('G10').font = TABLE_HEADER_FONT;
    ws.getCell('G10').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('G10').border = BORDER;

    ws.getCell('H10').value = 'Jumlah';
    ws.getCell('H10').fill = TABLE_HEADER_FILL;
    ws.getCell('H10').font = TABLE_HEADER_FONT;
    ws.getCell('H10').alignment = { horizontal: 'center', vertical: 'middle' };
    ws.getCell('H10').border = BORDER;

    ws.getRow(10).height = 19;

    // Table 1 Rows: Status
    const statusData = [
      { name: 'Open', count: reportTickets.value.filter(t => ['OPEN', 'ASSIGNED'].includes(t.status)).length },
      { name: 'In Progress', count: reportTickets.value.filter(t => t.status === 'IN_PROGRESS' && !t.isPaused).length },
      { name: 'Hold', count: reportTickets.value.filter(t => t.isPaused || ['HOLD', 'PENDING_VENDOR', 'PENDING_CUSTOMER', 'PENDING'].includes(t.status)).length },
      { name: 'Resolved', count: reportTickets.value.filter(t => t.status === 'RESOLVED').length },
      { name: 'Closed', count: reportTickets.value.filter(t => t.status === 'CLOSED').length }
    ];

    statusData.forEach((item, idx) => {
      const rowNum = 11 + idx;
      const cellName = ws.getCell(`A${rowNum}`);
      const cellVal = ws.getCell(`B${rowNum}`);
      cellName.value = item.name;
      cellName.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF0F172A' } };
      cellName.alignment = { horizontal: 'center', vertical: 'middle' };
      cellName.border = BORDER;

      cellVal.value = item.count;
      cellVal.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF0F172A' } };
      cellVal.alignment = { horizontal: 'center', vertical: 'middle' };
      cellVal.border = BORDER;
      ws.getRow(rowNum).height = 18;
    });

    // Table 2 Rows: Severity
    const critCount = reportTickets.value.filter(t => (t.severity || '').toUpperCase() === 'CRITICAL' || (t.severity || '').toUpperCase() === 'HIGH').length;
    const medCount = reportTickets.value.filter(t => (t.severity || '').toUpperCase() === 'MEDIUM' || (t.severity || '').toUpperCase() === 'MED').length;
    const lowCount = reportTickets.value.filter(t => (t.severity || '').toUpperCase() === 'LOW').length;

    const severityData = [
      { name: 'Critical', count: critCount },
      { name: 'Med', count: medCount },
      { name: 'Low', count: lowCount }
    ];

    severityData.forEach((item, idx) => {
      const rowNum = 11 + idx;
      const cellName = ws.getCell(`D${rowNum}`);
      const cellVal = ws.getCell(`E${rowNum}`);
      cellName.value = item.name;
      cellName.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF0F172A' } };
      cellName.alignment = { horizontal: 'center', vertical: 'middle' };
      cellName.border = BORDER;

      cellVal.value = item.count;
      cellVal.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF0F172A' } };
      cellVal.alignment = { horizontal: 'center', vertical: 'middle' };
      cellVal.border = BORDER;
      ws.getRow(rowNum).height = 18;
    });

    // Clear row 14 cells in Table 2
    ws.getCell('D14').value = null;
    ws.getCell('D14').border = {};
    ws.getCell('E14').value = null;
    ws.getCell('E14').border = {};

    // Table 3 Rows: Kategori (Storage, VMware, Backup, Network, Server, Database, Security)
    const categoryData = [
      { name: 'Storage', count: reportTickets.value.filter(t => (t.categoryName || '').toLowerCase().includes('storage')).length },
      { name: 'VMware', count: reportTickets.value.filter(t => (t.categoryName || '').toLowerCase().includes('vmware')).length },
      { name: 'Backup', count: reportTickets.value.filter(t => (t.categoryName || '').toLowerCase().includes('backup')).length },
      { name: 'Network', count: reportTickets.value.filter(t => (t.categoryName || '').toLowerCase().includes('network')).length },
      { name: 'Server', count: reportTickets.value.filter(t => (t.categoryName || '').toLowerCase().includes('server')).length },
      { name: 'Database', count: reportTickets.value.filter(t => (t.categoryName || '').toLowerCase().includes('database')).length },
      { name: 'Security', count: reportTickets.value.filter(t => (t.categoryName || '').toLowerCase().includes('security') || (t.categoryName || '').toLowerCase().includes('aplikasi')).length }
    ];

    categoryData.forEach((item, idx) => {
      const rowNum = 11 + idx;
      const cellName = ws.getCell(`G${rowNum}`);
      const cellVal = ws.getCell(`H${rowNum}`);
      cellName.value = item.name;
      cellName.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF0F172A' } };
      cellName.alignment = { horizontal: 'center', vertical: 'middle' };
      cellName.border = BORDER;

      cellVal.value = item.count;
      cellVal.font = { name: 'Calibri', size: 9.5, color: { argb: 'FF0F172A' } };
      cellVal.alignment = { horizontal: 'center', vertical: 'middle' };
      cellVal.border = BORDER;
      ws.getRow(rowNum).height = 18;
    });

    // Visual Bar Chart Box matching rows 20-33 in the user's mockup
    try {
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 270;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Card Border with rounded corners
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#94A3B8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(4, 4, 492, 262, 14);
          } else {
            ctx.rect(4, 4, 492, 262);
          }
          ctx.fill();
          ctx.stroke();

          // Title
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 12px Calibri, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Jumlah Case Berdasarkan Status', 215, 24);

          // Gridlines & Axis
          const maxVal = Math.max(1, ...statusData.map(s => s.count), 2);
          const chartTop = 42;
          const chartBottom = 215;
          const chartLeft = 40;
          const chartRight = 380;
          const gridSteps = 5;

          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          for (let i = 0; i <= gridSteps; i++) {
            const y = chartBottom - (i / gridSteps) * (chartBottom - chartTop);
            ctx.beginPath();
            ctx.moveTo(chartLeft, y);
            ctx.lineTo(chartRight, y);
            ctx.stroke();
          }

          // Y Axis Label "Jumlah"
          ctx.save();
          ctx.translate(20, (chartTop + chartBottom) / 2);
          ctx.rotate(-Math.PI / 2);
          ctx.font = 'bold 10px Calibri, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Jumlah', 0, 0);
          ctx.restore();

          // X Axis Label "Status"
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 10px Calibri, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Status', (chartLeft + chartRight) / 2, 235);

          // Colors matching user mockup:
          // Open: #3B82F6, In Progress: #EF4444, Hold: #84CC16, Resolved: #7C3AED (Purple), Closed: #06B6D4 (Teal)
          const barColors = ['#3B82F6', '#EF4444', '#84CC16', '#7C3AED', '#06B6D4'];
          const barWidth = 26;
          const slotWidth = (chartRight - chartLeft) / 5;

          statusData.forEach((st, idx) => {
            const barHeight = maxVal > 0 ? (st.count / maxVal) * (chartBottom - chartTop) : 0;
            const x = chartLeft + idx * slotWidth + (slotWidth - barWidth) / 2;
            const y = chartBottom - barHeight;

            if (barHeight > 0) {
              ctx.fillStyle = barColors[idx];
              ctx.fillRect(x, y, barWidth, barHeight);
              ctx.strokeStyle = '#000000';
              ctx.lineWidth = 0.5;
              ctx.strokeRect(x, y, barWidth, barHeight);
            }
          });

          // Legend on the right
          const legendX = 405;
          const legendStartY = 90;
          const legendGap = 22;

          statusData.forEach((st, idx) => {
            const ly = legendStartY + idx * legendGap;
            ctx.fillStyle = barColors[idx];
            ctx.fillRect(legendX, ly - 9, 10, 10);
            ctx.fillStyle = '#0F172A';
            ctx.font = '11px Calibri, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(st.name, legendX + 16, ly);
          });

          // Add image to Excel
          const base64Data = canvas.toDataURL('image/png').split(',')[1];
          const imgId = wb.addImage({
            base64: base64Data,
            extension: 'png'
          });
          ws.addImage(imgId, {
            tl: { col: 0.1, row: 18.5 },
            br: { col: 5.8, row: 33.5 }
          });
        }
      }
    } catch (chartErr) {
      console.warn('Canvas chart generation skipped:', chartErr);
    }

    return ws;
  };

  // Build Sheet 1: DASHBOARD
  buildDashboardSheet();

  // ---- Sheet 2: LIST CASE (Daftar Case Helpdesk Lengkap) ----
  const rawById = new Map(reportTickets.value.map(t => [t.id, t]));
  addTableSheet('LIST CASE', 'DAFTAR CASE HELPDESK', [
    { header: 'No', width: 6, align: 'center' },
    { header: 'Ticket ID', width: 16 },
    { header: 'Tgl Open', width: 22 },
    { header: 'Tgl Closed', width: 22 },
    { header: 'Customer', width: 24, align: 'left' },
    { header: 'Device / Kategori', width: 20 },
    { header: 'Serial Number', width: 18, align: 'center' },
    { header: 'Severity', width: 12, align: 'center' },
    { header: 'Issue', width: 40, wrap: true },
    { header: 'Resolusi', width: 40, wrap: true },
    { header: 'Engineer PIC', width: 20 },
    { header: 'Status', width: 13, align: 'center' },
    { header: 'Waktu Respon', width: 14, align: 'center' },
    { header: 'Waktu Resolusi', width: 15, align: 'center' },
    { header: 'Target Respon', width: 22 },
    { header: 'Target Resolusi', width: 22 },
    { header: 'SLA Status', width: 13, align: 'center' }
  ], caseRows.value.map((r, i) => {
    const raw = rawById.get(r.id) || {};
    return [
      i + 1,
      r.ticketNumber,
      r.openDate,
      r.closedDate,
      r.customerFull || r.customer,
      r.category,
      r.serialNumber,
      r.sev,
      r.title,
      r.resolution,
      r.engineer,
      r.statusLabel,
      r.responseTime,
      r.resolutionTime,
      fmtDate(raw.responseDeadline),
      fmtDate(raw.resolutionDeadline),
      r.slaLabel
    ];
  }));

  // ---- Sheet 3: Performa Mitra ----
  addTableSheet('Performa Mitra', 'ACCOUNT SLA PERFORMANCE (PERFORMA PER MITRA)', [
    { header: 'Customer Entity', width: 28 }, { header: 'ID Mitra', width: 12, align: 'center' },
    { header: 'Paket Kontrak SLA', width: 26, align: 'left' }, { header: 'Total Tiket', width: 12, align: 'center' },
    { header: 'Response SLA %', width: 16, align: 'center', numFmt: '0.0"%"' },
    { header: 'Resolution SLA %', width: 16, align: 'center', numFmt: '0.0"%"' },
    { header: 'Avg MTTR', width: 12, align: 'center' }, { header: 'Breaches', width: 11, align: 'center' },
    { header: 'Health Trend', width: 16, align: 'center' }
  ], customerPerformance.value.slice().sort((a, b) => b.handled - a.handled).map(a => [
    a.name, a.id, a.tier, a.handled, a.responseRate ?? '-', a.resolutionRate ?? '-', a.mttr, a.breaches, a.trend
  ]));

  // ---- Sheet 4: Engineer ----
  addTableSheet('Engineer', 'ENGINEER WORKLOAD & RESOLUTION VELOCITY ROSTER', [
    { header: 'Engineer', width: 26 }, { header: 'Role', width: 26 },
    { header: 'Active Load', width: 13, align: 'center' }, { header: 'Resolved Tickets', width: 17, align: 'center' },
    { header: 'Avg MTTR', width: 12, align: 'center' },
    { header: 'SLA Compliance %', width: 18, align: 'center', numFmt: '0"%"' }
  ], engineerRoster.value.slice().sort((a, b) => (b.activeCount + b.resolvedCount) - (a.activeCount + a.resolvedCount)).map(e => [
    e.name, e.role, e.activeCount, e.resolvedCount, e.avgMttr, e.compliance ?? '-'
  ]));

  // ---- Sheet 5: Knowledge Base ----
  addTableSheet('Knowledge Base', 'KNOWLEDGE BASE / RUNBOOKS (TOP 5 ARTIKEL)', [
    { header: 'Artikel / Judul', width: 50, wrap: true }, { header: 'Kategori', width: 20 },
    { header: 'Dibuat Oleh', width: 22 }, { header: 'Tgl Update', width: 16, align: 'center' }
  ], topKbArticles.value.map(k => [k.title, k.categoryName || k.category || '-', k.author || '-', k.date]));

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  link.href = url;
  link.download = `Laporan_SLA_GTT_${selectedPeriod.value}_${dateStr}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};</script>

<style>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 18px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings: 'FILL' 1, 'wght' 500;
}

/* ===== Report building blocks ===== */
#printable-report { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

/* Desktop screen styles (Sharp & readable at standard 100% browser zoom) */
.rpt-card {
  display: flex;
  align-items: center;
  gap: 12px;
  border-width: 1px;
  border-radius: 12px;
  padding: 12px 14px;
}
.rpt-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  color: #fff;
}
.rpt-icon .material-symbols-outlined { font-size: 20px; }
.rpt-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .02em; }
.rpt-big { font-size: 22px; font-weight: 900; line-height: 1.1; }
.rpt-sub { font-size: 11px; }

.rpt-panel { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; background: #fff; }
.rpt-panel-title { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; font-weight: 800; text-transform: uppercase; color: #1e3a8a; margin-bottom: 8px; }
.rpt-panel-title .material-symbols-outlined { color: #2563eb; font-size: 18px; }
.rpt-panel-title p { font-size: 11px; font-weight: 400; text-transform: none; color: #64748b; margin-top: 1px; }

.rpt-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rpt-table th { background: #f1f5f9; color: #334155; font-weight: 800; padding: 8px 8px; text-align: center; border-bottom: 1px solid #cbd5e1; font-size: 11px; text-transform: uppercase; }
.rpt-table td { padding: 7px 8px; text-align: center; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
.rpt-table th.text-left, .rpt-table td.text-left { text-align: left; }

html.dark .rpt-panel { background: #1e293b !important; border-color: #334155 !important; }
html.dark .rpt-panel-title { color: #93c5fd !important; }
html.dark .rpt-panel-title p { color: #94a3b8 !important; }
html.dark .rpt-table th { background: #0f172a !important; color: #cbd5e1 !important; border-bottom-color: #334155 !important; }
html.dark .rpt-table td { border-bottom-color: #334155 !important; color: #f1f5f9 !important; }
html.dark .rpt-cases th { background: #0f172a !important; color: #cbd5e1 !important; border-bottom-color: #334155 !important; }
html.dark .rpt-cases td { border-bottom-color: #334155 !important; color: #f1f5f9 !important; }
html.dark .rpt-cases tbody tr:nth-child(even) { background: rgba(255, 255, 255, 0.02) !important; }
html.dark .rpt-cases tbody tr:hover { background: rgba(30, 58, 138, 0.35) !important; }

.rpt-badge { display: inline-block; border-radius: 5px; padding: 2.5px 7px; font-weight: 700; font-size: 11px; white-space: nowrap; }
.rpt-chip { border-width: 1px; border-radius: 6px; padding: 3px 12px; font-size: 11px; }

@media screen {
  .rpt-cases-wrap {
    width: 100%;
    overflow-x: auto;
  }
  .rpt-cases {
    width: 100%;
    min-width: 1180px;
    font-size: 11.5px;
  }
  .rpt-cases th { padding: 9px 6px; }
  .rpt-cases td { padding: 8px 6px; }
  .rpt-cases th:nth-child(1)  { width: 34px; }
  .rpt-cases th:nth-child(2)  { width: 85px; }
  .rpt-cases th:nth-child(3)  { width: 105px; }
  .rpt-cases th:nth-child(4)  { width: 105px; }
  .rpt-cases th:nth-child(5)  { width: 80px; }
  .rpt-cases th:nth-child(6)  { width: 110px; }
  .rpt-cases th:nth-child(7)  { width: 100px; }
  .rpt-cases th:nth-child(8)  { width: 75px; }
  .rpt-cases th:nth-child(9)  { min-width: 150px; text-align: left; }
  .rpt-cases th:nth-child(10) { min-width: 140px; text-align: left; }
  .rpt-cases th:nth-child(11) { width: 95px; }
  .rpt-cases th:nth-child(12) { width: 85px; }
  .rpt-cases th:nth-child(13) { width: 50px; }
  .rpt-cases th:nth-child(14) { width: 50px; }
  .rpt-cases th:nth-child(15) { width: 75px; }
}

.rpt-cases tbody tr:nth-child(even) { background: #f8fafc; }
.rpt-cases tr { break-inside: avoid; page-break-inside: avoid; }

@page {
  size: A4 portrait;
  margin: 6mm 6mm 6mm 6mm;

  @bottom-left {
    content: "GTT Helpdesk Ticketing - PT Global Transformasi Teknologi";
    font-family: Inter, Arial, sans-serif;
    font-size: 8px;
    color: #64748b;
  }
  @bottom-right {
    content: "Halaman " counter(page) " dari " counter(pages);
    font-family: Inter, Arial, sans-serif;
    font-size: 8px;
    color: #64748b;
  }
}

/* ===== Print Overrides (Scaled specifically for A4 PDF export) ===== */
@media print {
  *, *::before, *::after {
    box-sizing: border-box !important;
  }

  html, body {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
  }

  #printable-report {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    overflow: visible !important;
  }

  #printable-report > * + * { margin-top: 0 !important; }

  .report-page {
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box !important;
    padding: 0 !important;
    margin: 0 !important;
    font-size: 8px !important;
    overflow: hidden !important;
  }

  .report-page-1 {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    gap: 5px !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .report-page + .report-page {
    break-before: page;
    page-break-before: always;
  }

  .rpt-card { padding: 3px 5px !important; border-radius: 6px !important; gap: 4px !important; box-sizing: border-box !important; }
  .rpt-icon { width: 22px !important; height: 22px !important; }
  .rpt-icon .material-symbols-outlined { font-size: 13px !important; }
  .rpt-label { font-size: 7.5px !important; font-weight: 800 !important; }
  .rpt-big { font-size: 15px !important; font-weight: 900 !important; }
  .rpt-sub { font-size: 6.5px !important; }

  .rpt-panel { padding: 3px 5px !important; border-radius: 6px !important; box-sizing: border-box !important; width: 100% !important; max-width: 100% !important; overflow: hidden !important; }
  .rpt-panel-title { font-size: 7.5px !important; font-weight: 800 !important; gap: 3px !important; margin-bottom: 2px !important; }
  .rpt-panel-title .material-symbols-outlined { font-size: 12px !important; }
  .rpt-panel-title p { font-size: 6px !important; }

  .rpt-table { font-size: 6.5px !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
  .rpt-table th { font-size: 6.2px !important; padding: 1.5px 1.5px !important; box-sizing: border-box !important; }
  .rpt-table td { font-size: 6.5px !important; padding: 1.5px 1.5px !important; box-sizing: border-box !important; }

  .rpt-cases-wrap {
    width: 100% !important;
    max-width: 100% !important;
    overflow: visible !important;
    padding: 0 !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }

  .rpt-cases {
    table-layout: fixed !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    font-size: 6px !important;
    border-collapse: collapse !important;
    box-sizing: border-box !important;
  }

  .rpt-cases th,
  .rpt-cases td {
    min-width: 0 !important;
    max-width: none !important;
    word-break: break-word !important;
    overflow-wrap: break-word !important;
    box-sizing: border-box !important;
  }

  .rpt-cases th {
    font-size: 5.8px !important;
    padding: 2px 1px !important;
  }
  .rpt-cases td {
    font-size: 6px !important;
    padding: 2px 1px !important;
    line-height: 1.15 !important;
  }

  .rpt-cases th:nth-child(1)  { width: 3%   !important; }
  .rpt-cases th:nth-child(2)  { width: 7%   !important; }
  .rpt-cases th:nth-child(3)  { width: 8.5% !important; }
  .rpt-cases th:nth-child(4)  { width: 8.5% !important; }
  .rpt-cases th:nth-child(5)  { width: 6%   !important; }
  .rpt-cases th:nth-child(6)  { width: 7.5% !important; }
  .rpt-cases th:nth-child(7)  { width: 7.5% !important; }
  .rpt-cases th:nth-child(8)  { width: 5.5% !important; }
  .rpt-cases th:nth-child(9)  { width: 12%  !important; }
  .rpt-cases th:nth-child(10) { width: 11%  !important; }
  .rpt-cases th:nth-child(11) { width: 7.5% !important; }
  .rpt-cases th:nth-child(12) { width: 6%   !important; }
  .rpt-cases th:nth-child(13) { width: 3.5% !important; }
  .rpt-cases th:nth-child(14) { width: 3.5% !important; }
  .rpt-cases th:nth-child(15) { width: 6.5% !important; }

  .rpt-badge {
    font-size: 5.5px !important;
    padding: 1px 2.5px !important;
    border-radius: 2.5px !important;
  }
  .rpt-chip {
    padding: 1px 5px !important;
    font-size: 7px !important;
  }

  th, td {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }

  .break-inside-avoid {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
