<template>
  <!-- 403 Forbidden Screen when Engineer tries to access another engineer's ticket -->
  <div 
    v-if="isEngineerForbidden" 
    class="max-w-lg mx-auto my-12 p-8 bg-white border border-rose-200 rounded-3xl shadow-xl text-center space-y-4 animate-in fade-in duration-200"
  >
    <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
    </div>
    <div class="space-y-2">
      <span class="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 uppercase">
        403 - Akses Penugasan Ditolak
      </span>
      <h2 class="font-bold text-slate-900 text-lg">Anda Tidak Memiliki Izin Membuka Tiket Ini</h2>
      <p class="text-xs text-slate-600 leading-relaxed">
        <span v-if="ticket?.assignedToId">
          Tiket <strong>#{{ ticket?.ticketNumber }}</strong> telah dialokasikan khusus kepada rekan teknisi 
          <strong>{{ getEngineerName(ticket?.assignedToId) }}</strong>.
        </span>
        <span v-else>
          Tiket <strong>#{{ ticket?.ticketNumber }}</strong> saat ini berstatus antrean baru dan belum dialokasikan oleh petugas Admin / CPIG.
        </span>
      </p>
      <p class="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
        Berdasarkan kebijakan operasional Helpdesk PT Global Transformasi Teknologi, wewenang penugasan teknisi sepenuhnya berada di bawah kendali Admin / CPIG. Teknisi hanya dapat mengakses tiket yang secara resmi ditugaskan kepada dirinya.
      </p>
    </div>
    <div class="pt-3">
      <router-link 
        to="/tickets" 
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-xs inline-flex items-center space-x-2"
      >
        <span>&larr; Kembali ke Antrean Tiket Saya</span>
      </router-link>
    </div>
  </div>

  <div v-else-if="ticket" class="space-y-5 animate-in fade-in duration-200">
    <!-- Top Breadcrumb & Action Toolbar (Figma Spec) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div class="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <router-link to="/tickets" class="hover:text-blue-600 flex items-center gap-1 font-bold text-blue-600">
          <span>&larr; Antrean</span>
        </router-link>
        <span>&gt;</span>
        <span class="text-slate-800 font-bold">{{ ticket.ticketNumber }}</span>
        <span>&gt;</span>
        <span class="text-slate-500 truncate max-w-xs">{{ ticket.title }}</span>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <!-- Customer Tracking Link Button -->
        <button
          @click="handleCopyLink"
          class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all"
          title="Salin tautan pelacakan publik customer bertoken"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <span>{{ copiedLink ? 'Tersalin!' : 'Bagikan Link Customer' }}</span>
        </button>

        <!-- Email Notification Preview -->
        <button
          @click="showEmailPreviewModal = true"
          class="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span>Email Notif</span>
        </button>

        <!-- SLA Pause / Resume Button -->
        <button
          v-if="ticket.isPaused && canEngineerAct"
          @click="handleResumeSla"
          class="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
        >
          <span>&rtrif; Lanjutkan SLA</span>
        </button>
        <button
          v-else-if="!ticket.isPaused && canEngineerAct && !['RESOLVED', 'CLOSED'].includes(ticket.status)"
          @click="openPauseModal"
          class="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-bold rounded-lg transition-all"
        >
          <span>&#10074;&#10074; Tahan SLA (Pause)</span>
        </button>

        <!-- Resolve Button -->
        <button
          v-if="ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && canEngineerAct"
          @click="openResolveModal"
          class="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-all"
        >
          <span>&check; Resolve Ticket</span>
        </button>
      </div>
    </div>

    <!-- Main Ticket Header Card (Figma Spec) -->
    <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <!-- Title & Origin Tags -->
      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div class="space-y-2">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="font-mono font-black text-blue-700 text-base">{{ ticket.ticketNumber }}</span>
            <span class="font-mono font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider" :class="getSeverityBadge(ticket.severity)">
              &bull; PRIORITY {{ ticket.severity }}
            </span>
            <span class="font-bold text-[10px] px-2 py-0.5 rounded uppercase" :class="getStatusBadge(ticket.status)">
              {{ ticket.status }}
            </span>
            <span class="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-slate-200">
              {{ ticket.channel }} ORIGIN
            </span>
            <span class="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
              {{ getCustomer(ticket.customerId).name }}
            </span>
          </div>

          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {{ ticket.title }}
          </h2>

          <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
            <span>Diterima: <strong>{{ formatTime(ticket.createdAt).local }}</strong></span>
            <span>&bull;</span>
            <span>Cluster: <strong class="text-slate-800">{{ ticket.cluster || 'CKR-PROD-01' }}</strong></span>
            <span>&bull;</span>
            <span>PIC: <strong>{{ getPic(ticket.customerId, ticket.customerPicId).name || 'Dimas Setiawan' }}</strong></span>
          </div>
        </div>
      </div>

      <!-- DUAL LIVE SLA HEADER COUNTERS (Figma Frame Spec) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
        <!-- SLA 1: Response SLA Status -->
        <div class="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RESPONSE SLA STATUS</span>
            <span class="bg-emerald-100 text-emerald-800 font-bold text-[10px] font-mono px-2 py-0.5 rounded">
              &check; COMPLETED IN 12M
            </span>
          </div>
          <div class="mt-2">
            <div class="text-xs text-slate-500">Target: <strong class="text-slate-800 font-mono">30 Mins (Gold 8&times;5)</strong></div>
            <div class="text-2xl font-black text-slate-900 font-mono mt-1">
              {{ formatClock(ticket.respondedAt || ticket.createdAt) }} <span class="text-xs font-normal text-slate-400">WIB</span>
            </div>
            <div class="text-[11px] text-slate-500 font-mono mt-0.5">
              Started: {{ formatClock(ticket.createdAt) }} WIB &bull; Acknowledged: {{ formatClock(ticket.respondedAt || ticket.createdAt) }} WIB
            </div>
          </div>
        </div>

        <!-- SLA 2: Resolution SLA Countdown -->
        <div class="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">RESOLUTION SLA COUNTDOWN</span>
            <span 
              class="font-bold text-[10px] font-mono px-2 py-0.5 rounded"
              :class="ticket.isSlaResolutionBreached ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-amber-100 text-amber-800'"
            >
              {{ ticket.isSlaResolutionBreached ? '● SLA BREACHED' : '● NEAR BREACH WARNING' }}
            </span>
          </div>
          <div class="mt-2">
            <div class="flex items-baseline justify-between">
              <span class="text-xs text-slate-500">Target: <strong class="text-slate-800 font-mono">8h 00m (Gold SLA)</strong></span>
              <span class="text-[10px] text-slate-400 font-mono">REMAINING TO COMPLIANCE</span>
            </div>
            <div 
              class="text-2xl font-black font-mono mt-1"
              :class="ticket.isSlaResolutionBreached ? 'text-rose-600' : 'text-amber-600'"
            >
              {{ resolutionCountdown }}
            </div>
            <div class="text-[11px] text-slate-500 font-mono mt-0.5 flex justify-between">
              <span>Elapsed: 06h 36m</span>
              <span>Strict Deadline: Today {{ formatClock(ticket.resolutionDeadline) }} WIB</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-Column Responsive Layout: Content vs Sidebar (Figma Spec) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left Column (8 of 12 cols): Incident Report, Principal L3, Diagnostic Timeline, Root Cause -->
      <div class="lg:col-span-8 space-y-5">
        <!-- 1. Incident Initial Report -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 class="font-black text-slate-900 text-xs uppercase tracking-wider">Incident Initial Report</h3>
            <span class="text-[10px] font-mono text-slate-400 font-bold">UNEDITED DISPATCH</span>
          </div>
          <div class="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 font-sans">
            {{ ticket.description }}
          </div>
          <div class="text-[11px] text-slate-500 italic">
            Direct communication established with Dimas Setiawan (IT Ops Lead, PT Astra Honda Motor) via corporate WhatsApp Support Channel (+62 811-9928-1102).
          </div>
        </div>

        <!-- 2. Technology Principal Integration (L3 OEM Support - Figma Spec) -->
        <div class="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-md border border-blue-800/50 space-y-3.5">
          <div class="flex items-center justify-between border-b border-blue-800/40 pb-2.5">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              <h3 class="font-bold text-xs uppercase tracking-wider text-blue-200">Technology Principal Integration</h3>
            </div>
            <span class="text-[10px] font-bold font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
              &bull; ACTIVE L3 ENGINEERING
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div>
              <span class="text-[10px] text-slate-400 uppercase block">Principal Case ID</span>
              <span class="font-bold text-blue-300 text-sm">{{ ticket.principalCaseId || 'HPE-2026-004821' }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase block">Principal Specialist</span>
              <span class="font-bold text-white">{{ ticket.principalSpecialist || 'Marcus Vance (HPE Storage L3)' }}</span>
            </div>
            <div>
              <span class="text-[10px] text-slate-400 uppercase block">Telemetry Bridge</span>
              <span class="font-bold text-emerald-400">{{ ticket.principalBridgeStatus || 'Connected via HPE InfoSight API' }}</span>
            </div>
          </div>

          <!-- Latest Principal Update -->
          <div class="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 text-xs">
            <div class="flex items-center justify-between text-[11px] text-blue-300 font-mono mb-1">
              <span>Latest Principal Engineering Update</span>
              <span>{{ ticket.principalUpdateTimestamp || '11:38 WIB' }}</span>
            </div>
            <p class="text-slate-200 leading-relaxed">
              {{ ticket.principalLatestUpdate || 'HPE Support analyzed controller B core dump logs; transient PCIe bus assertion detected on Node 1 midplane bus interface. Recommended NVRAM battery status verification and selective cache invalidation prior to re-enabling automatic failback.' }}
            </p>
          </div>
        </div>

        <!-- 3. Diagnostic & Troubleshooting Timeline (Verifiable Telemetry Logs) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-black text-slate-900 text-sm">Diagnostic &amp; Troubleshooting Timeline</h3>
              <p class="text-xs text-slate-500 mt-0.5">Chronological engineering intervention steps with verifiable telemetry logs</p>
            </div>

            <button
              v-if="canEngineerAct && ticket.status !== 'CLOSED'"
              @click="openMilestoneModal"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all"
            >
              + Add Diagnostic Step
            </button>
          </div>

          <!-- Milestones Component -->
          <MilestoneStepper 
            :milestones="ticket.milestones" 
            :ticket="ticket"
            :canAct="canEngineerAct"
            @open-preview="openAttachmentPreview"
          />
        </div>

        <!-- 4. ROOT CAUSE IDENTIFICATION & RESOLUTION STRATEGY (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-blue-600"></span>
              <h3 class="font-black text-slate-900 text-sm">Root Cause Identification &amp; Resolution Strategy</h3>
            </div>
            <span class="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200">
              CONFIRMED WITH HPE
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Root Cause Box -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center space-x-2 text-rose-700 font-bold uppercase tracking-wider text-[11px]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span>Root Cause Identification</span>
              </div>
              <p class="text-slate-700 leading-relaxed font-sans">
                {{ ticket.rootCause || 'Transient PCIe interconnect bus stall between Controller Node 0 and Node 1 triggered sudden failover while sync threshold sat at 88%, resulting in host path timeout prior to full NVRAM mirroring reconciliation.' }}
              </p>
              <div class="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-200">
                Classification: Hardware Bus &bull; Verified via HPE SP collects
              </div>
            </div>

            <!-- Resolution Strategy Box -->
            <div class="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
              <div class="flex items-center space-x-2 text-blue-800 font-bold uppercase tracking-wider text-[11px]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Resolution Strategy</span>
              </div>
              <p class="text-slate-700 leading-relaxed font-sans">
                {{ ticket.resolutionStrategy || 'Rebalance FC host paths across Fabric 1, clear stalled cache unmap operations via HPE CLI command line, and trigger targeted rescan on ESXi host storage adapters to re-mount production datastore.' }}
              </p>
              <div class="pt-2 text-[10px] font-mono text-slate-400 border-t border-blue-200">
                Resolved by: Ismat Yulian &bull; Pending Host Rescan
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Berkas Lampiran & Bukti Digital Card -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 class="font-black text-slate-900 text-xs uppercase tracking-wider">Berkas Lampiran &amp; Bukti Digital</h3>
            <span class="text-[10px] font-mono text-slate-500 font-bold">
              {{ (ticket.attachments || []).length }} Berkas Terlampir
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div 
              v-for="att in (ticket.attachments || [])" 
              :key="att.id"
              class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
            >
              <div class="flex items-center space-x-2.5 truncate mr-2">
                <span class="text-lg">
                  {{ att.fileType?.includes('text') ? '📄' : '🖼️' }}
                </span>
                <div class="truncate">
                  <div class="font-bold text-slate-800 truncate font-mono text-[11px]">{{ att.name }}</div>
                  <div class="text-[10px] text-slate-400 font-mono">{{ att.size }} &bull; {{ att.source }}</div>
                </div>
              </div>

              <div class="flex items-center space-x-1.5 shrink-0">
                <button
                  @click="openAttachmentPreview(att.name, att.source)"
                  class="px-2 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] rounded hover:bg-blue-100"
                >
                  Lihat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column (4 of 12 cols): Customer Profile, System Properties, Assigned Engineer, Workflow Actions -->
      <div class="lg:col-span-4 space-y-5">
        <!-- 1. Enterprise Customer Profile Card (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise Customer</span>
            <span class="font-mono text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {{ getCustomer(ticket.customerId).code || 'AHM' }}
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div>
              <h4 class="font-black text-slate-900 text-sm">{{ getCustomer(ticket.customerId).name }}</h4>
              <span class="text-[11px] text-slate-500 font-mono block mt-0.5">Plant 4 Cikarang West Data Center</span>
            </div>

            <div class="pt-2 border-t border-slate-100 space-y-1.5 text-xs font-mono">
              <div class="flex justify-between">
                <span class="text-slate-400">Contract Tier:</span>
                <span class="font-bold text-amber-600">{{ ticket.contractTier || '8x5 GOLD ENTERPRISE' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Primary Rep:</span>
                <span class="font-bold text-slate-800">{{ getPic(ticket.customerId, ticket.customerPicId).name || 'Dimas Setiawan' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Support Channel:</span>
                <span class="font-bold text-emerald-600">WhatsApp VIP Group</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. System Properties (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider">System Properties</h4>
          </div>

          <div class="space-y-2 text-xs font-mono">
            <div class="flex justify-between">
              <span class="text-slate-400">Category:</span>
              <span class="font-bold text-slate-800">{{ getCategory(ticket.categoryId).name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Subcategory:</span>
              <span class="font-bold text-slate-800">HPE 3PAR / FC Datastore</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Impact Scope:</span>
              <span class="font-bold text-rose-600">{{ ticket.impactScope || 'Critical Workloads' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Environment:</span>
              <span class="font-bold text-blue-700">{{ ticket.environment || 'PROD-DC-01' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Incident Source:</span>
              <span class="font-bold text-slate-800">WhatsApp Dispatcher</span>
            </div>
          </div>
        </div>

        <!-- 3. Assigned Engineer Card (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider">Assigned Engineer</h4>
            <button
              v-if="authStore.currentUser.roleCode === 'ADMIN' && ticket.status !== 'CLOSED'"
              @click="showAssignModal = true"
              class="text-blue-600 hover:text-blue-800 text-[11px] font-bold underline"
            >
              Reassign
            </button>
          </div>

          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center font-mono shadow-sm">
              {{ ticket.assignedToId ? getEngineerName(ticket.assignedToId).slice(0, 2).toUpperCase() : 'NA' }}
            </div>
            <div>
              <div class="font-black text-slate-900 text-xs">
                {{ ticket.assignedToId ? getEngineerName(ticket.assignedToId) : 'Belum Ditugaskan' }}
              </div>
              <div class="text-[10px] text-slate-400 font-mono">Senior Storage &amp; Infrastructure Engineer</div>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 space-y-1">
            <div class="flex justify-between">
              <span>Supervisor:</span>
              <strong class="text-slate-800">Denny Wicaksono</strong>
            </div>
            <div class="flex justify-between">
              <span>Shift:</span>
              <strong class="text-slate-800">Morning Tier-2 (08:00 - 17:00 WIB)</strong>
            </div>
          </div>
        </div>

        <!-- 4. Workflow Actions (Figma Spec) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
          <h4 class="font-black text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
            Workflow Actions
          </h4>

          <!-- Propose for Knowledge Base Toggle -->
          <div class="flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-800 text-xs block">Propose for Knowledge Base</span>
              <span class="text-[10px] text-slate-400 block">Jadikan runbook solusi standar</span>
            </div>
            <button
              @click="ticketStore.toggleProposeKb(ticket.id)"
              class="w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none"
              :class="ticket.isProposeKb ? 'bg-blue-600' : 'bg-slate-200'"
            >
              <div
                class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200"
                :class="ticket.isProposeKb ? 'translate-x-4' : 'translate-x-0'"
              ></div>
            </button>
          </div>

          <!-- Customer Dispatch Sync Toggle -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span class="font-bold text-slate-800 text-xs block">Customer Dispatch Sync</span>
              <span class="text-[10px] text-slate-400 block">Forward milestone steps to WhatsApp</span>
            </div>
            <button
              @click="ticketStore.toggleWhatsAppSync(ticket.id)"
              class="w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none"
              :class="ticket.isWhatsAppSync ? 'bg-emerald-600' : 'bg-slate-200'"
            >
              <div
                class="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200"
                :class="ticket.isWhatsAppSync ? 'translate-x-4' : 'translate-x-0'"
              ></div>
            </button>
          </div>

          <!-- Pause / Resolve Buttons in Sidebar -->
          <div class="pt-3 border-t border-slate-100 space-y-2">
            <button
              v-if="!ticket.isPaused && canEngineerAct && !['RESOLVED', 'CLOSED'].includes(ticket.status)"
              @click="openPauseModal"
              class="w-full py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <span>&#10074;&#10074; Request SLA Clock Pause</span>
            </button>

            <button
              v-if="ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && canEngineerAct"
              @click="openResolveModal"
              class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center space-x-1.5"
            >
              <span>&check; Resolve Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Modal 1: Add Milestone -->
    <div v-if="showMilestoneModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tambah Milestone Penanganan Teknis</h4>
          <button @click="showMilestoneModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitMilestone" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Tahapan / Langkah Kerja *</label>
            <input v-model="newMilestone.stepName" required type="text" placeholder="Contoh: Check storage controller hardware status" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Catatan Diagnosa &amp; Temuan *</label>
            <textarea v-model="newMilestone.notes" required rows="3" placeholder="Rincikan tindakan teknis yang telah dilakukan..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Lampiran Berkas Bukti Log / Screenshot (Opsional)</label>
            <input v-model="newMilestone.proofFile" type="text" placeholder="Contoh: controller_status.png atau vmkernel_dmesg.log" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showMilestoneModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Simpan Milestone</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Pause SLA -->
    <div v-if="showPauseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Penahanan Waktu SLA (Pause SLA)</h4>
          <button @click="showPauseModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitPauseSla" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alasan Penahanan *</label>
            <select v-model="pauseData.pendingType" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
              <option value="VENDOR">Menunggu Respon / Part Vendor Principal (HPE/Cisco)</option>
              <option value="CUSTOMER">Menunggu Konfirmasi / Verifikasi Pelanggan</option>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Rincian Keterangan *</label>
            <textarea v-model="pauseData.reason" required rows="2" placeholder="Sebutkan kebutuhan vendor atau instruksi ke pelanggan..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nomor Kasus Vendor (Jika ada)</label>
            <input v-model="pauseData.principalCaseId" type="text" placeholder="Contoh: HPE-2026-004821" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showPauseModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg shadow-sm">Bekukan SLA</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Resolve Ticket -->
    <div v-if="showResolveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Penyelesaian Tiket Insiden (Resolve)</h4>
          <button @click="showResolveModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitResolve" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Root Cause (Akar Masalah Teknis) *</label>
            <textarea v-model="resolveData.rootCause" required rows="2" placeholder="Jelaskan penyebab pasti kegagalan hardware/software..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Resolution Strategy (Strategi Solusi Diterapkan) *</label>
            <textarea v-model="resolveData.resolutionStrategy" required rows="2" placeholder="Jelaskan tindakan permanen yang telah diambil..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Rekomendasi Pencegahan Lanjutan</label>
            <textarea v-model="resolveData.recommendation" rows="2" placeholder="Saran upgrade firmware atau tindakan preventif..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showResolveModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg shadow-sm">Selesaikan Tiket</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 4: Assign Engineer -->
    <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Alokasikan Penugasan Teknisi</h4>
          <button @click="showAssignModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitAssign" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Pilih Teknisi Penanggung Jawab *</label>
            <select v-model="selectedEngineerId" required class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
              <option v-for="u in engineers" :key="u.id" :value="u.id">
                {{ u.name }} ({{ u.roleTitle || 'Support Engineer' }})
              </option>
            </select>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showAssignModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Tugaskan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 5: Attachment Preview Lightbox -->
    <AttachmentPreviewModal
      v-if="selectedAttachment"
      :attachment="selectedAttachment"
      @close="selectedAttachment = null"
    />

    <!-- Modal 6: Email Preview -->
    <EmailPreviewModal
      v-if="ticket"
      :is-open="showEmailPreviewModal"
      :ticket="ticket"
      :customer="getCustomer(ticket.customerId)"
      :pic="getPic(ticket.customerId, ticket.customerPicId)"
      :engineer="{ name: getEngineerName(ticket.assignedToId) }"
      @close="showEmailPreviewModal = false"
    />
  </div>

  <!-- 404 Fallback State -->
  <div v-else class="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-4">
    <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-xl font-bold">
      ?
    </div>
    <h2 class="font-bold text-slate-900 text-base">Tiket Tidak Ditemukan (#{{ route.params.id }})</h2>
    <router-link to="/tickets" class="inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs shadow-sm">
      &larr; Kembali ke Antrean Tiket
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { formatUtcToLocal } from '../utils/dateFormatter';
import MilestoneStepper from '../components/MilestoneStepper.vue';
import AttachmentPreviewModal from '../components/AttachmentPreviewModal.vue';
import EmailPreviewModal from '../components/EmailPreviewModal.vue';

const route = useRoute();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const ticketId = computed(() => Number(route.params.id));
const ticket = computed(() => ticketStore.tickets.find(t => t.id === ticketId.value));

// Modals State
const showMilestoneModal = ref(false);
const showPauseModal = ref(false);
const showResolveModal = ref(false);
const showAssignModal = ref(false);
const showEmailPreviewModal = ref(false);
const selectedAttachment = ref(null);
const copiedLink = ref(false);

const selectedEngineerId = ref(null);

const newMilestone = ref({
  stepName: '',
  notes: '',
  proofFile: ''
});

const pauseData = ref({
  pendingType: 'VENDOR',
  reason: '',
  principalCaseId: ''
});

const resolveData = ref({
  rootCause: '',
  resolutionStrategy: '',
  recommendation: ''
});

const isEngineerForbidden = computed(() => {
  if (!ticket.value) return false;
  if (authStore.currentUser.roleCode === 'ENGINEER') {
    return ticket.value.assignedToId !== authStore.currentUser.id;
  }
  return false;
});

const canEngineerAct = computed(() => {
  const role = authStore.currentUser.roleCode;
  if (role === 'ADMIN') return true;
  if (role === 'ENGINEER') {
    return ticket.value && ticket.value.assignedToId === authStore.currentUser.id;
  }
  return false;
});

const engineers = computed(() => {
  return authStore.users.filter(u => u.roleCode === 'ENGINEER');
});

const formatTime = (t) => formatUtcToLocal(t);
const formatClock = (utcDateString) => {
  if (!utcDateString) return '--:--';
  const d = new Date(utcDateString);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':');
};
const getCustomer = (id) => ticketStore.customers.find(c => c.id === id) || {};
const getPic = (custId, picId) => {
  const c = getCustomer(custId);
  if (!c || !c.pics) return {};
  return c.pics.find(p => p.id === picId) || {};
};
const getCategory = (id) => ticketStore.categories.find(cat => cat.id === id) || {};
const getEngineerName = (id) => {
  const u = authStore.users.find(item => item.id === id);
  return u ? u.name : '-';
};

const resolutionCountdown = computed(() => {
  if (!ticket.value) return '00:00:00';
  if (ticket.value.status === 'RESOLVED') return 'RESOLVED (STOPPED)';
  if (ticket.value.isPaused) return 'PAUSED (FROZEN)';
  if (ticket.value.isSlaResolutionBreached) return 'BREACHED (00:00:00)';
  return '01:24:12 HRS';
});

const getSeverityBadge = (s) => {
  switch (s) {
    case 'HIGH': return 'bg-rose-100 text-rose-800 border border-rose-200';
    case 'MEDIUM': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'LOW': return 'bg-slate-100 text-slate-700 border border-slate-200';
    default: return 'bg-slate-100 text-slate-700';
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

const openMilestoneModal = () => {
  newMilestone.value = { stepName: '', notes: '', proofFile: '' };
  showMilestoneModal.value = true;
};

const submitMilestone = () => {
  if (!ticket.value) return;
  ticketStore.addProgressMilestone(
    ticket.value.id,
    {
      stepName: newMilestone.value.stepName,
      notes: newMilestone.value.notes,
      proofFile: newMilestone.value.proofFile || null,
      nextStatus: 'IN_PROGRESS'
    },
    authStore.currentUser
  );
  showMilestoneModal.value = false;
};

const openPauseModal = () => {
  pauseData.value = { pendingType: 'VENDOR', reason: '', principalCaseId: ticket.value.principalCaseId || '' };
  showPauseModal.value = true;
};

const submitPauseSla = () => {
  if (!ticket.value) return;
  ticketStore.pauseSla(ticket.value.id, pauseData.value, authStore.currentUser);
  showPauseModal.value = false;
};

const handleResumeSla = () => {
  if (!ticket.value) return;
  ticketStore.resumeSla(ticket.value.id, authStore.currentUser);
};

const openResolveModal = () => {
  resolveData.value = {
    rootCause: ticket.value.rootCause || '',
    resolutionStrategy: ticket.value.resolutionStrategy || '',
    recommendation: ticket.value.recommendation || ''
  };
  showResolveModal.value = true;
};

const submitResolve = () => {
  if (!ticket.value) return;
  ticketStore.resolveTicket(ticket.value.id, resolveData.value, authStore.currentUser);
  showResolveModal.value = false;
};

const openAssignModal = () => {
  selectedEngineerId.value = ticket.value.assignedToId || (engineers.value[0] ? engineers.value[0].id : null);
  showAssignModal.value = true;
};

const submitAssign = () => {
  if (!ticket.value || !selectedEngineerId.value) return;
  ticketStore.assignEngineer(ticket.value.id, selectedEngineerId.value, authStore.currentUser);
  showAssignModal.value = false;
};

const openAttachmentPreview = (fileName, source) => {
  selectedAttachment.value = {
    name: fileName,
    fileType: fileName.endsWith('.txt') || fileName.endsWith('.log') ? 'text/plain' : 'image/svg+xml',
    source: source || 'Lampiran Bukti Milestone'
  };
};

const handleCopyLink = () => {
  if (!ticket.value) return;
  const url = `${window.location.origin}${window.location.pathname}#/track/${ticket.value.ticketNumber}?token=${ticket.value.trackingToken}`;
  navigator.clipboard.writeText(url);
  copiedLink.value = true;
  setTimeout(() => { copiedLink.value = false; }, 3000);
};
</script>
