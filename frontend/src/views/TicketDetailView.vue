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

  <div v-else-if="ticket" class="space-y-5 animate-in fade-in duration-200 pb-12 print-container">
    <!-- 1. TOP BREADCRUMB & ACTION BAR (Point 5 Reference) -->
    <div class="flex flex-col gap-2">
      <!-- Breadcrumb -->
      <div class="flex items-center space-x-2 text-xs text-slate-500 font-sans">
        <router-link to="/tickets" class="hover:text-blue-600 font-medium text-slate-500">Tickets</router-link>
        <span class="text-slate-300">/</span>
        <span class="hover:text-blue-600 font-medium text-slate-500 cursor-pointer">Incident</span>
        <span class="text-slate-300">/</span>
        <span class="text-slate-800 font-semibold">{{ ticket.ticketNumber }}</span>
      </div>

      <!-- Header Row: Ticket Badges & Action Buttons -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        <!-- Badges Pill Row -->
        <div class="flex flex-wrap items-center gap-2">
          <!-- Ticket Code Pill -->
          <span class="font-mono font-bold text-blue-700 text-sm bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200/80 flex items-center gap-1.5 shadow-2xs">
            <span>{{ ticket.ticketNumber }}</span>
          </span>


          <!-- Customer Pill -->
<span class="font-mono font-bold text-blue-700 text-sm bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-200/80 flex items-center gap-1.5 shadow-2xs">
              {{ getCustomer(ticket.customerId).name || '' }}
          </span>
        </div>

        <!-- Action Buttons Right (Hold & Closed) -->
        <div class="flex items-center gap-2 text-xs no-print">
          <!-- Button Kirim Email Manual ke PIC (1 Email Terpadu: Tracking & Konfirmasi) -->
          <button
            v-if="authStore.isAdmin"
            type="button"
            @click="handleSendCustomerTrackingEmail"
            :disabled="isSendingCustomerEmail"
            class="inline-flex items-center space-x-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            :title="['RESOLVED', 'CLOSED'].includes(ticket.status) ? 'Kirim email berita acara & konfirmasi penutupan ke PIC klien' : 'Kirim manual 1 email resmi ke PIC: Berisi rincian tiket & link tracking mandiri'"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>{{ isSendingCustomerEmail ? 'Mengirim...' : (['RESOLVED', 'CLOSED'].includes(ticket.status) ? 'Kirim BAP ke PIC' : 'Kirim Email ke PIC') }}</span>
          </button>

          <!-- Hold / Resume Button -->
          <button
            v-if="ticket.isPaused && canEngineerAct"
            @click="handleResumeSla"
            class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Lanjutkan perhitungan waktu SLA"
          >
            <span>▶ Lanjutkan SLA</span>
          </button>
          <button
            v-else-if="!ticket.isPaused && canEngineerAct && !['RESOLVED', 'CLOSED'].includes(ticket.status)"
            @click="openPauseModal"
            class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Tahan jam SLA tiket ini (Hold)"
          >
            <span>⏸ Hold Tiket</span>
          </button>

          <!-- Closed / Selesaikan Tiket Button -->
          <button
            v-if="canEngineerAct && !['RESOLVED', 'CLOSED'].includes(ticket.status)"
            @click="openResolveModal"
            class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Tutup dan selesaikan tiket ini"
          >
            <span>✓ Closed Tiket</span>
          </button>
          <div v-else-if="['RESOLVED', 'CLOSED'].includes(ticket.status)" class="flex items-center gap-2">
            <span
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 rounded-lg text-xs"
            >
              ✓ Kasus Closed
            </span>
          </div>
        </div>
      </div>

      <!-- Ticket Title (Large font) -->
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-1">
        {{ ticket.title }}
      </h1>

      <!-- Metadata Subtitle Row -->
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-sans">
        <span>Dibuat: <strong class="text-slate-700 font-semibold">{{ formatTime(ticket.createdAt).local }}</strong></span>
        <span class="text-slate-300">•</span>
        <span>Updated: <strong class="text-slate-700 font-semibold">{{ formatTime(ticket.updatedAt).local }}</strong></span>
        <span class="text-slate-300">•</span>
        <span>Dibuat oleh: <strong class="text-slate-700 font-semibold">{{ creatorName }}</strong></span>
      </div>
    </div>

    <!-- 2. FOUR TOP METRIC CARDS ROW -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card 1: RESOLUTION SLA -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">RESOLUTION SLA</span>
            <span 
              class="font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs"
              :class="isResolutionBreached ? 'bg-rose-100 text-rose-800 animate-pulse' 
                    : ticket.resolvedAt ? 'bg-emerald-100 text-emerald-800'
                    : ticket.isPaused ? 'bg-amber-100 text-amber-800' 
                    : isNearResolutionBreach ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-50 text-blue-700'"
            >
              {{ isResolutionBreached ? '✕ Breached' 
               : ticket.resolvedAt ? '✓ Met'
               : ticket.isPaused ? '⏸ Dijeda'
               : isNearResolutionBreach ? '⚠ Near Breach'
               : '⏱ Berjalan' }}
            </span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Target: &le; {{ resolutionTargetText }}</span>
          </div>
          <div 
            class="text-2xl font-black font-mono mt-1 flex items-baseline gap-1"
            :class="isResolutionBreached ? 'text-rose-600' 
                  : ticket.resolvedAt ? 'text-emerald-600'
                  : ticket.isPaused ? 'text-amber-700' 
                  : isNearResolutionBreach ? 'text-orange-600'
                  : 'text-blue-600'"
          >
            <span>{{ resolutionCountdown }}</span>
          </div>
          <!-- Progress bar -->
          <div class="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :class="isResolutionBreached ? 'bg-rose-500' 
                    : ticket.resolvedAt ? 'bg-emerald-500'
                    : ticket.isPaused ? 'bg-amber-400' 
                    : isNearResolutionBreach ? 'bg-orange-500'
                    : 'bg-blue-500'"
              :style="{ width: slaProgressPercent + '%' }"
            ></div>
          </div>
        </div>

        <div class="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
          <div class="flex items-center justify-between">
            <span class="font-medium text-slate-600">
              {{ ticket.resolvedAt || ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'Waktu Penyelesaian:' : 'Waktu Berjalan:' }}
            </span>
            <strong class="text-slate-900 font-bold font-mono">{{ elapsedTimeFormatted }}</strong>
          </div>
          <div v-if="ticket.totalPausedDurationSec > 0" class="flex items-center justify-between text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
            <span>Jeda SLA (Hold):</span>
            <span class="font-semibold font-mono">{{ Math.round(ticket.totalPausedDurationSec / 60) }} mnt</span>
          </div>
          <div class="flex items-center justify-between text-slate-400 text-[10.5px]">
            <span>Deadline:</span>
            <span class="font-medium text-slate-600">{{ formatDeadlineText(ticket.resolutionDeadline) }}</span>
          </div>
        </div>
      </div>

      <!-- Card 2: CUSTOMER & KONTRAK -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CUSTOMER &amp; KONTRAK</span>
          <div class="font-black text-slate-900 text-sm truncate">
            {{ customerInfo.name }}
          </div>
          <div v-if="customerInfo.slaTier" class="mt-2">
            <span class="inline-block bg-blue-100 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
              {{ customerInfo.slaTier }}
            </span>
          </div>
        </div>

        <!-- PIC and 3 Quick Contact Icon Buttons -->
        <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="text-[11px] text-slate-600 truncate">
            <div class="font-medium truncate flex items-center gap-1">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>PIC: <strong class="text-slate-800">{{ picInfo.name }}</strong></span>
            </div>
            <div class="font-mono text-slate-500 truncate flex items-center gap-1 mt-0.5">
              <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>{{ picInfo.phone }}</span>
            </div>
          </div>

          <!-- Quick Contact Icons -->
          <div class="flex items-center gap-1.5 shrink-0 no-print">
            <a 
              :href="'https://wa.me/' + (picInfo.phoneClean || '6281212010198') + '?text=Halo%20' + encodeURIComponent(picInfo.name) + ',%20update%20terkait%20tiket%20' + ticket.ticketNumber" 
              target="_blank"
              class="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-2xs"
              title="Hubungi via WhatsApp"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.993.578 1.933.882 2.801.882l.004-.001c3.177 0 5.765-2.587 5.765-5.766.001-3.181-2.587-5.768-5.774-5.768zm3.228 8.163c-.134.375-.783.725-1.077.771-.295.047-.639.066-1.895-.443-1.606-.65-2.64-2.28-2.72-2.387-.08-.108-.646-.861-.646-1.642 0-.781.405-1.164.551-1.323.147-.159.32-.199.426-.199.107 0 .213.001.306.006.1.005.234-.038.365.276.134.321.458 1.117.498 1.2.04.083.067.18.013.288-.054.108-.08.175-.16.27-.08.094-.168.21-.24.282-.08.08-.163.167-.07.327.094.16.417.689.894 1.115.614.547 1.132.717 1.292.797.16.08.254.067.348-.041.094-.108.401-.467.508-.627.107-.16.213-.134.359-.08.147.054.935.441 1.095.521.16.08.267.12.306.187.04.067.04.388-.094.763z"/>
              </svg>
            </a>
            <a 
              :href="'mailto:' + (picInfo.email || 'customer@astra.co.id') + '?subject=Update%20Tiket%20' + ticket.ticketNumber" 
              class="w-7 h-7 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-2xs"
              title="Kirim Email ke PIC"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Card 3: INFORMASI SISTEM (Serial Number di ringkasan) -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">INFORMASI SISTEM</span>
          <div class="space-y-2 text-xs">
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Kategori</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ categoryInfo.name || 'Server & Infrastruktur' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Jenis Tiket</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {{ ticket.ticketType || 'Incident' }}
              </span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Serial Number (S/N)</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-900 font-mono font-bold">{{ ticket.serialNumber || '-' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Tingkat Prioritas</span>
              <span class="text-slate-400 mx-1">:</span>
              <span 
                class="font-bold text-[10px] px-2 py-0.5 rounded-full uppercase"
                :class="getSeverityBadgeClass(ticket.severity)"
              >
                {{ ticket.severity || 'HIGH' }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Status: {{ ticket.status }}</span>
          <span class="text-blue-600 font-medium font-sans">Verified System</span>
        </div>
      </div>

      <!-- Card 4: ASSIGNED ENGINEER -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ASSIGNED ENGINEER</span>
            <button
              v-if="authStore.isAdmin && ticket.status !== 'CLOSED'"
              @click="openAssignModal"
              class="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
            >
              Reassign
            </button>
          </div>

          <!-- Avatar & Engineer Name -->
          <div class="flex items-center space-x-3 mt-1.5">
            <div class="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              {{ assignedEngineerInitials }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-black text-slate-900 text-sm truncate">{{ assignedEngineerName }}</div>
              <div class="text-[11px] text-slate-500 truncate">{{ assignedEngineerRoleName }}</div>
            </div>
          </div>
        </div>

        <!-- Detailed Key-Values -->
        <div class="pt-2 mt-2 border-t border-slate-100 space-y-1 text-xs">
          <div class="flex items-start">
            <span class="text-slate-400 w-16 shrink-0">Email</span>
            <span class="text-slate-400 mx-1">:</span>
            <span class="text-blue-600 font-mono text-[11px] truncate">{{ assignedEngineerEmail }}</span>
          </div>
          <div class="flex items-start">
            <span class="text-slate-400 w-16 shrink-0">Telepon</span>
            <span class="text-slate-400 mx-1">:</span>
            <span class="text-slate-800 font-mono text-[11px]">{{ assignedEngineerPhone }}</span>
          </div>
        </div>

        <!-- Manual Dispatch Trigger Button (Admin Only) -->
        <div v-if="authStore.isAdmin && assignedEngineerEmail" class="pt-2 mt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            @click="handleSendEngineerDispatchEmail"
            :disabled="isSendingDispatchEmail"
            class="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Kirim email notifikasi penugasan tiket resmi ke teknisi ini"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>{{ isSendingDispatchEmail ? 'Mengirim...' : 'Notif Teknisi' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. MAIN TWO-COLUMN CONTENT AREA (Point 5 Reference) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <!-- LEFT COLUMN (8 of 12 cols) -->
      <div class="lg:col-span-8 space-y-5">
        <!-- 3A. Incident Initial Report -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="font-bold text-slate-900 text-sm">Incident Initial Report</h3>
            </div>
            <span class="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              UNEDITED DISPATCH
            </span>
          </div>

          <div class="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100 font-sans">
            {{ ticket.description || 'Server utama tidak merespon koneksi (RTO). Seluruh layanan transaksi pengguna terhenti total.' }}
          </div>

          <!-- Lampiran Berkas Insiden (Under Initial Report) -->
          <div v-if="initialAttachment" class="mt-3 p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
            <div class="flex items-center space-x-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
              </div>
              <div class="min-w-0">
                <div class="font-bold text-slate-800 text-xs truncate">{{ initialAttachment.name }}</div>
                <div class="text-[10px] text-slate-400 font-mono">{{ initialAttachment.size }} &bull; Lampiran Berkas Awal Kasus</div>
              </div>
            </div>
            <div class="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                @click="downloadAttachment(initialAttachment.name)"
                class="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 inline-flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Unduh berkas lampiran awal"
              >
                <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Unduh Berkas</span>
              </button>
            </div>
          </div>

          <div class="text-[11px] text-slate-400 italic">
            Direct communication established with {{ picInfo.name }} ({{ formatTime(ticket.createdAt).local }}).
          </div>
        </div>

        <!-- 3B. Diagnostic & Troubleshooting Timeline -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div class="flex items-start space-x-2.5">
              <div class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-black text-slate-900 text-sm">Diagnostic &amp; Troubleshooting Timeline</h3>
                <p class="text-xs text-slate-500 mt-0.5">Kronologi penanganan insiden dengan catatan aktivitas dan lampiran bukti.</p>
              </div>
            </div>

            <!-- Add Diagnostic Step Button (Hilang jika tiket sudah RESOLVED atau CLOSED) -->
            <button
              v-if="canEngineerAct && !['RESOLVED', 'CLOSED'].includes(ticket.status)"
              @click="openMilestoneModal"
              class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer no-print"
            >
              <span>+ Add Diagnostic Step</span>
            </button>
          </div>

          <!-- Chronological Step Items List -->
          <div :key="timelineKey" class="relative pl-8 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            <div 
              v-for="(step, index) in timelineSteps" 
              :key="step.id || index"
              :id="'step-node-' + index"
              class="relative group transition-all duration-300 rounded-xl"
              :class="highlightedStepIndex === index ? 'ring-4 ring-blue-400 ring-offset-2 bg-blue-50/40 p-1 -m-1' : ''"
            >
              <!-- Numbered Circle Indicator -->
              <div 
                class="absolute -left-8 top-0.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-black shadow-xs transition-transform group-hover:scale-105"
                :class="getTimelineNodeColor(step.status, index === timelineSteps.length - 1)"
              >
                <span>{{ index + 1 }}</span>
              </div>

              <!-- Step Body Card -->
              <div class="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:border-slate-300 transition-colors space-y-2">
                <!-- Title, Status Badge, Timestamp -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div class="flex items-center space-x-2 flex-wrap">
                    <span class="font-bold text-slate-900 text-xs">{{ step.stepName || step.title }}</span>
                    <span 
                      class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                      :class="getStatusBadgeClass(step.status)"
                    >
                      {{ step.status }}
                    </span>
                    <span 
                      class="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
                      :class="Number(step.progressPercent || 0) === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'"
                    >
                      {{ step.progressPercent ?? 0 }}%
                    </span>
                  </div>

                  <!-- Clock timestamp -->
                  <div class="text-[11px] font-mono text-slate-400 flex items-center space-x-1 shrink-0">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{{ formatTime(step.timestampUtc).local }}</span>
                  </div>
                </div>

                <!-- Actor name -->
                <div class="text-[11px] text-slate-500 font-medium">
                  {{ step.actorName || 'Support Engineer' }} ({{ step.actorRole || 'ENGINEER' }})
                </div>

                <!-- Notes / Description -->
                <p class="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                  {{ step.notes }}
                </p>


                <!-- Direct Download Button for Step Proof -->
                <div v-if="step.proofFile" class="pt-1.5 flex items-center">
                  <button
                    type="button"
                    @click="downloadAttachment(step.proofFile)"
                    class="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 hover:border-blue-300 font-mono text-[11px] font-semibold transition-all shadow-2xs cursor-pointer group"
                    title="Unduh berkas lampiran ini"
                  >
                    <svg class="w-3.5 h-3.5 text-blue-600 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="truncate max-w-[260px]">{{ step.proofFile }}</span>
                    <span class="inline-flex items-center space-x-1 text-[10px] font-bold text-blue-600 bg-blue-100/70 px-1.5 py-0.5 rounded ml-1">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      <span>Unduh</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (4 of 12 cols) -->
      <div class="lg:col-span-4 space-y-5">
        <!-- 4A. Case Closure Card (Muncul setelah closed/resolved) -->
        <div v-if="ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Case Closure</h4>
            </div>
            <span class="font-bold text-[10px] px-2 py-0.5 rounded uppercase shadow-2xs bg-emerald-100 text-emerald-800">
              {{ ticket.status === 'CLOSED' ? 'CLOSED' : 'RESOLVED' }}
            </span>
          </div>

          <!-- Closure Metrics Key-Values -->
          <div class="space-y-2 text-xs">
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Final Status</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-emerald-700 font-bold uppercase">{{ ticket.status }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Tanggal Penyelesaian</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-medium text-slate-800">{{ closureResolvedDateText }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Customer Confirmation</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-bold text-emerald-700">Telah Diselesaikan</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Total Durasi Troubleshooting</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-mono font-bold text-slate-800">{{ closureDurationText }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Resolution SLA</span>
              <span class="text-slate-400 mx-1">:</span>
              <span :class="ticket.isSlaResolutionBreached ? 'text-rose-600' : 'text-emerald-700'" class="font-bold">
                {{ ticket.isSlaResolutionBreached ? '✗ Breached (Terlewati)' : '✓ Met (Terpenuhi)' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 4B. Status Penanganan & Penahanan SLA (Hold / Eskalasi - Tampil sebelum tiket Closed) -->
        <div v-else class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">
                {{ ticket.isPaused ? 'Status Penahanan SLA (Hold)' : (ticket.principalVendor || ticket.escalationTier ? 'Status Eskalasi Vendor' : 'Status Penanganan') }}
              </h3>
            </div>
            <span 
              class="font-bold text-[10px] px-2 py-0.5 rounded uppercase shadow-2xs"
              :class="ticket.isPaused ? 'bg-amber-100 text-amber-800' : (ticket.principalVendor || ticket.escalationTier ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800')"
            >
              {{ isHoldPart ? 'HOLD PART / HARDWARE' : isHoldCustomer ? 'HOLD PARTNER / KLIEN' : ticket.isPaused ? 'SLA DIJEDA (HOLD)' : (ticket.principalVendor || ticket.escalationTier ? 'TERESKALASI' : ticket.status) }}
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Status Penanganan</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong :class="ticket.isPaused ? 'text-amber-700' : 'text-blue-600'" class="font-semibold">
                {{ isHoldPart ? 'Hold: Menunggu Suku Cadang (Part Hardware)' : isHoldCustomer ? 'Hold: Menunggu Konfirmasi Klien' : ticket.isPaused ? 'Penahanan SLA' : (ticket.escalationTier || (ticket.status === 'IN_PROGRESS' ? 'Investigasi & Troubleshooting' : ticket.status)) }}
              </strong>
            </div>

            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">
                {{ isHoldCustomer ? 'Klien / Mitra Terkait' : 'Vendor / Principal Suku Cadang' }}
              </span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">
                {{ ticket.principalVendor || (isHoldCustomer ? (customerInfo.name || 'Mitra Klien') : (isHoldPart ? 'Distributor Resmi / Principal OEM' : (assignedEngineerName || 'Tim L2 Support'))) }}
              </strong>
            </div>

            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">
                {{ isHoldPart ? 'No. RMA / Kasus Part' : 'Nomor Kasus / Case ID' }}
              </span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-mono font-semibold truncate">
                {{ ticket.principalCaseId || '-' }}
              </strong>
            </div>

            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Timer SLA</span>
              <span class="text-slate-400 mx-1">:</span>
              <span v-if="ticket.isPaused" class="text-amber-700 font-bold flex items-center gap-1 font-mono">
                <span>⏸</span> Dibekukan (Waktu Resolusi Berhenti Sementara)
              </span>
              <span v-else class="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                <span>▶</span> Berjalan Normal
              </span>
            </div>

            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Tanggal Pembaruan</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">
                {{ formatTime(ticket.escalatedAt || ticket.pausedAt || ticket.updatedAt).local }}
              </strong>
            </div>

            <div v-if="ticket.pauseDetails || ticket.principalLatestUpdate" class="flex items-start pt-1 border-t border-slate-100/80">
              <span class="text-slate-400 w-36 shrink-0">Keterangan / Catatan</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="text-slate-700 leading-snug">
                {{ ticket.pauseDetails || ticket.principalLatestUpdate || (isHoldPart ? 'Menunggu ketersediaan part pengganti hardware.' : '-') }}
              </span>
            </div>
          </div>
        </div>

        <!-- 4C. Related Knowledge Base (Point 5 Reference) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Related Knowledge Base</h3>
            </div>
            <span class="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
              {{ relatedKbArticles?.length || 0 }} CASES FOUND
            </span>
          </div>

          <p v-if="relatedKbArticles && relatedKbArticles.length > 0" class="text-[11px] text-slate-400 -mt-1">
            Referensi artikel atau berkas runbook penyelesaian masalah yang relevan.
          </p>

          <div v-if="!relatedKbArticles || relatedKbArticles.length === 0" class="p-5 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            Belum ada referensi Knowledge Base runbook yang terkait dengan tiket ini.
          </div>

          <!-- KB Cards List -->
          <div v-else class="space-y-3">
            <div 
              v-for="kb in relatedKbArticles" 
              :key="kb.id"
              class="p-3.5 border rounded-xl space-y-2.5 transition-all shadow-2xs"
              :class="kb.isDirectLinked ? 'bg-blue-50/40 border-blue-200 ring-1 ring-blue-500/10' : 'bg-slate-50/70 border-slate-200/80 hover:border-slate-300'"
            >
              <div class="flex items-start justify-between gap-1.5">
                <div class="font-bold text-slate-900 text-xs font-mono min-w-0">
                  <span class="text-blue-700">{{ kb.kbCode }}</span>: {{ kb.title }}
                </div>
                <span 
                  v-if="kb.isDirectLinked"
                  class="px-2 py-0.5 rounded text-[10px] font-black bg-blue-600 text-white shrink-0 font-mono tracking-wide shadow-2xs"
                >
                  TERKAIT LANGSUNG
                </span>
                <span 
                  v-else
                  class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0 border border-emerald-200/60 font-mono"
                >
                  Match: {{ kb.similarity }}%
                </span>
              </div>

              <!-- Attached Document Bar (if runbook document is attached) -->
              <div 
                v-if="kb.documentName || kb.pdfAttachmentUrl" 
                class="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-xs"
              >
                <div class="flex items-center space-x-2 min-w-0">
                  <span 
                    class="px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 border"
                    :class="isDocx(kb) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                  >
                    {{ isDocx(kb) ? 'DOCX' : 'PDF' }}
                  </span>
                  <div class="min-w-0">
                    <span class="font-semibold text-slate-800 text-[11px] truncate block" :title="kb.documentName">
                      {{ kb.documentName || 'Dokumen Runbook Resmi' }}
                    </span>
                    <span v-if="kb.documentSize" class="text-[10px] text-slate-400 block">
                      {{ kb.documentSize }}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  @click.stop="downloadKbDoc(kb)"
                  class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] rounded transition-colors inline-flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  title="Unduh Berkas Dokumen"
                >
                  <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  <span>Unduh</span>
                </button>
              </div>

              <p v-else-if="kb.symptom || kb.description" class="text-[11px] text-slate-600 leading-relaxed font-sans line-clamp-2">
                {{ kb.symptom || kb.description }}
              </p>

              <!-- Tags and Detail Button -->
              <div class="flex items-center justify-between pt-1">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in kb.tags" 
                    :key="tag"
                    class="bg-white text-slate-600 text-[10px] px-1.5 py-0.5 rounded border border-slate-200 font-mono"
                  >
                    {{ tag }}
                  </span>
                </div>

                <button
                  @click="openKbDetail(kb)"
                  class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded shadow-2xs transition-all cursor-pointer shrink-0 ml-2"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>

          <!-- Action Button: Propose KB Runbook from this completed ticket -->
          <div v-if="ticket && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED')" class="pt-2 border-t border-slate-100">
            <router-link 
              :to="`/knowledge-base/propose?ticketNumber=${ticket.ticketNumber}`"
              class="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer text-center"
            >
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>+ Unggah Dokumen KB dari Kasus Tiket Ini</span>
            </router-link>
          </div>

          <!-- Bottom KB Directory Link -->
          <div class="pt-1 text-center">
            <router-link 
              to="/knowledge-base" 
              class="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              <span>Lihat Semua Hasil Pencarian di Knowledge Base</span>
              <span>&rarr;</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALS -->

    <!-- Modal: Tambah Update Penanganan Teknis (Point 7 Mockup) -->
    <div v-if="showMilestoneModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-auto p-5 sm:p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-start justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-black text-slate-900 text-sm sm:text-base tracking-tight">Tambah Update Penanganan Teknis</h4>
              <p class="text-xs text-slate-500 mt-0.5">Catat setiap tahapan pekerjaan, hasil pengecekan, dan temuan dengan jelas.</p>
            </div>
          </div>
          <button 
            @click="showMilestoneModal = false" 
            class="text-slate-400 hover:text-slate-600 text-xl leading-none p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitMilestone" class="space-y-4">
          <!-- 1. Nama Tahapan / Langkah Kerja * -->
          <div>
            <label class="block font-bold text-slate-800 text-xs mb-1">
              Nama Tahapan / Langkah Kerja <span class="text-rose-500">*</span>
            </label>
            <input 
              v-model="newMilestone.stepName" 
              required 
              type="text" 
              placeholder="Contoh: Initial Diagnosis, Tracing Port, Replacement SFP" 
              class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800" 
            />
            <p class="text-[11px] text-slate-400 mt-1">
              Contoh: Initial Diagnosis, Troubleshooting, Root Cause Identification, Resolution Applied
            </p>
          </div>

          <!-- 2. Progress Penanganan & Status Penanganan (Side by side) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Left: Progress Penanganan * (i) -->
            <div>
              <div class="flex items-center space-x-1.5 mb-1">
                <label class="font-bold text-slate-800 text-xs">
                  Progress Penanganan <span class="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  class="text-slate-400 hover:text-blue-600 text-[11px] cursor-pointer"
                  title="Persentase kemajuan estimasi penanganan tiket sampai terselesaikan"
                >
                  ⓘ
                </button>
              </div>

              <!-- Input with % Box -->
              <div class="flex items-center space-x-2">
                <div class="relative w-24">
                  <input 
                    v-model.number="newMilestone.progressPercent" 
                    type="number" 
                    :min="minAllowedProgress" 
                    max="100" 
                    @input="handleProgressInput"
                    @change="handleProgressBlur"
                    @blur="handleProgressBlur"
                    required 
                    :class="isProgressInvalid ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'"
                    class="w-full pl-3 pr-8 py-2 border rounded-xl text-xs font-bold text-slate-800 font-mono text-center transition-all" 
                  />
                  <span class="absolute right-3 top-2 text-xs font-bold text-slate-400 font-mono">%</span>
                </div>

                <!-- Range Slider (Proporsional 0-100%, terkunci minimal step sebelumnya) -->
                <div class="flex-1 px-1">
                  <input 
                    :value="newMilestone.progressPercent"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    @input="handleSliderInput"
                    :style="sliderTrackStyle"
                    class="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
                  />
                  <!-- Slider Marks -->
                  <div class="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span 
                      v-for="mark in [0, 25, 50, 75, 100]"
                      :key="mark"
                      @click="mark >= minAllowedProgress ? newMilestone.progressPercent = mark : null" 
                      :class="[
                        mark < minAllowedProgress ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:text-blue-600',
                        newMilestone.progressPercent === mark ? 'text-blue-600 font-bold' : ''
                      ]"
                    >{{ mark }}%</span>
                  </div>
                  <p v-if="isProgressInvalid" class="text-[10px] text-rose-600 font-bold mt-1">
                    ⚠️ Progres tidak boleh di bawah step sebelumnya (Minimal: {{ minAllowedProgress }}%)
                  </p>
                  <p v-else class="text-[10px] text-slate-500 mt-1">
                    * Minimal {{ minAllowedProgress }}% (posisi awal: +1% dari step sebelumnya)
                  </p>
                </div>
              </div>
            </div>

            <!-- Right: Status Penanganan * -->
            <div>
              <BaseSelect
                v-model="newMilestone.status"
                :options="milestoneStatusOptions"
                label="Status Penanganan"
                required
                size="sm"
              />
            </div>
          </div>

          <!-- 3. Catatan Diagnosa & Temuan * -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-slate-800 text-xs">
                Catatan Diagnosa &amp; Temuan <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] font-mono text-slate-400">
                {{ (newMilestone.notes || '').length }}/2000
              </span>
            </div>
            <textarea 
              v-model="newMilestone.notes" 
              required 
              rows="4" 
              maxlength="2000"
              placeholder="Tuliskan catatan tahapan tindakan, hasil pengetesan, atau temuan teknis lapangan..." 
              class="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans focus:ring-2 focus:ring-blue-500 leading-relaxed placeholder:text-slate-400"
            ></textarea>
          </div>

          <!-- 4. Lampiran Berkas Bukti Log / Screenshot (Opsional) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-slate-800 text-xs">
                Lampiran Berkas Bukti Log / Screenshot (Opsional)
              </label>
              <button
                v-if="allAttachments.length > 0"
                type="button"
                @click="newMilestone.fileSourceType = newMilestone.fileSourceType === 'existing' ? 'upload' : 'existing'"
                class="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                {{ newMilestone.fileSourceType === 'existing' ? 'Upload Berkas Baru' : 'Pilih dari Berkas Tiket' }}
              </button>
            </div>

            <!-- Mode 1: Drag & Drop Zone / Upload Baru -->
            <div v-if="newMilestone.fileSourceType !== 'existing'" class="space-y-2">
              <input
                ref="milestoneFileInputRef"
                type="file"
                class="hidden"
                accept=".pdf,.txt,.log,.png,.jpg,.jpeg,.doc,.docx"
                @change="handleMilestoneFileChange"
              />

              <!-- Dropzone -->
              <div
                @click="triggerMilestoneFileInput"
                @dragover.prevent="isDraggingOver = true"
                @dragleave.prevent="isDraggingOver = false"
                @drop.prevent="handleDropFile"
                class="p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                :class="isDraggingOver ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/20'"
              >
                <div class="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p class="font-bold text-xs text-slate-800">
                  Klik atau drag file ke sini untuk upload
                </p>
                <p class="text-[10px] text-slate-400 mt-0.5">
                  Format: PNG, JPG, PDF, TXT, LOG (Maksimal 5MB, Auto-kompres gambar)
                </p>
              </div>

              <!-- Uploaded / Selected File Card Preview (Matching mockup) -->
              <div 
                v-if="newMilestone.proofFile" 
                class="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs animate-in fade-in"
              >
                <div class="flex items-center space-x-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="font-mono font-bold text-xs text-slate-900 truncate">{{ newMilestone.proofFile }}</p>
                    <p class="font-mono text-[10px] text-slate-400">{{ newMilestone.fileSizeStr || '1.8 KB' }}</p>
                  </div>
                </div>

                <div class="flex items-center space-x-2">
                  <!-- Green checkmark -->
                  <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold" title="Berkas siap diunggah">
                    &#10003;
                  </div>
                  <!-- Remove file -->
                  <button
                    type="button"
                    @click="removeMilestoneFile"
                    class="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 text-base leading-none cursor-pointer"
                    title="Hapus lampiran"
                  >
                    &times;
                  </button>
                </div>
              </div>
            </div>

            <!-- Mode 2: Pilih Berkas Existing dari Tiket -->
            <div v-else class="space-y-1.5">
              <BaseSelect
                v-model="newMilestone.proofFile"
                :options="proofFileOptions"
                size="sm"
                placeholder="-- Tanpa Lampiran --"
              />
            </div>
          </div>

          <!-- Modal Actions Footer -->
          <div class="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button 
              type="button" 
              @click="showMilestoneModal = false" 
              class="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Simpan Update
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Konfirmasi Status RESOLVED pada Langkah Diagnosa (Proper Custom UI Confirm Modal) -->
    <div v-if="showConfirmResolveStepModal" style="z-index: 100;" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150 my-auto text-center">
        <!-- Icon badge -->
        <div class="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-xs">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1.5">
          <h4 class="font-black text-slate-900 text-base">Konfirmasi Selesaikan Kasus</h4>
          <p class="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Apakah Anda yakin ingin menyelesaikan tiket <strong class="text-slate-800 font-mono font-bold">{{ ticket?.ticketNumber }}</strong> dengan menandai langkah ini sebagai <strong class="text-emerald-700 font-bold">RESOLVED</strong>?
          </p>
        </div>

        <!-- Detail Summary Box -->
        <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Nomor Tiket:</span>
            <span class="font-mono font-bold text-slate-800">{{ ticket?.ticketNumber }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Nama Langkah:</span>
            <span class="font-semibold text-slate-800 truncate max-w-[210px]" :title="newMilestone.stepName">{{ newMilestone.stepName || '-' }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Status Baru:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">RESOLVED</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Target Progres:</span>
            <span class="font-bold text-emerald-700">100% (Selesai Penuh)</span>
          </div>
        </div>

        <!-- Notice -->
        <div class="flex items-start space-x-2 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-left text-[11px] text-emerald-900 leading-relaxed">
          <span class="text-emerald-600 mt-0.5 text-sm shrink-0">💡</span>
          <span>Setelah tiket berstatus RESOLVED, tombol penambahan tahapan diagnosa (+ Add Diagnostic Step) akan resmi ditutup.</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="showConfirmResolveStepModal = false" 
            class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="button" 
            @click="executeSubmitMilestone" 
            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Ya, Selesaikan Tiket</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Tautkan Berkas yang Ada ke Step -->
    <div v-if="showLinkStepModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tautkan Berkas ke Step</h4>
          <button @click="showLinkStepModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <div class="space-y-3">
          <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800 text-[11px]">
            📄 {{ targetAttachmentToLink?.name }}
          </div>

          <div>
            <BaseSelect 
              v-model="selectedTargetStepName"
              :options="stepOptions"
              label="Pilih Tahapan / Step Target"
              required
              size="sm"
              placeholder="-- Pilih Step --"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showLinkStepModal = false" class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button
              type="button"
              :disabled="!selectedTargetStepName"
              @click="submitLinkAttachmentToStep"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm cursor-pointer"
            >
              Tautkan
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 2: Edit Ticket Information -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Edit Detail Tiket Insiden</h4>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitEditTicket" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Judul Insiden *</label>
            <input v-model="editData.title" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Deskripsi Laporan Awal *</label>
            <textarea v-model="editData.description" required rows="3" class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <BaseSelect
                v-model="editData.severity"
                :options="severityOptions"
                label="Tingkat Severity"
                required
                size="sm"
              />
            </div>
            <div>
              <BaseSelect
                v-model="editData.categoryId"
                :options="categorySelectOptions"
                label="Kategori Sistem"
                required
                size="sm"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Serial Number (S/N Perangkat)</label>
            <input v-model="editData.serialNumber" type="text" placeholder="Contoh: SN-8829103-" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showEditModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm cursor-pointer">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>



    <!-- Modal 3: Knowledge Base Detail Lightbox -->
    <div v-if="selectedKb" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl p-6 space-y-4 text-xs animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{{ selectedKb.kbCode }}</span>
              <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">Similarity: {{ selectedKb.similarity }}%</span>
            </div>
            <h3 class="font-black text-slate-900 text-base mt-1">{{ selectedKb.title }}</h3>
          </div>
          <button @click="selectedKb = null" class="text-slate-400 hover:text-slate-600 text-2xl leading-none cursor-pointer">&times;</button>
        </div>

        <div class="space-y-3 font-sans">
          <!-- Document Card -->
          <div v-if="selectedKb.documentName" class="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between">
            <div class="flex items-center space-x-3 min-w-0">
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border"
                :class="isDocx(selectedKb) ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-rose-100 text-rose-700 border-rose-300'"
              >
                {{ isDocx(selectedKb) ? 'DOCX' : 'PDF' }}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-900 text-xs truncate" :title="selectedKb.documentName">{{ selectedKb.documentName }}</p>
                <p class="text-[11px] text-slate-500 font-mono mt-0.5">{{ selectedKb.documentSize || 'Berkas runbook SOP' }}</p>
              </div>
            </div>
            <button
              type="button"
              @click="downloadKbDoc(selectedKb)"
              class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs inline-flex items-center space-x-1.5 shrink-0 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh SOP</span>
            </button>
          </div>

          <!-- Metadata Grid -->
          <div class="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px]">
            <div>
              <span class="text-slate-400 block font-medium">Kategori:</span>
              <span class="font-bold text-slate-800">{{ selectedKb.category || '-' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-medium">Tipe Case:</span>
              <span class="font-bold text-slate-800">{{ selectedKb.caseType || '-' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-medium">Produk / Platform:</span>
              <span class="font-bold text-slate-800">{{ selectedKb.product || '-' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block font-medium">Rujukan Kasus Asal:</span>
              <span class="font-bold text-blue-700 font-mono">{{ selectedKb.sourceTicket || 'SOP Mandiri' }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end pt-3 border-t border-slate-100">
          <button @click="selectedKb = null" class="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-xs">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Pause SLA (Hold SLA) -->
    <div v-if="showPauseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 sm:p-7 space-y-5 text-xs animate-in fade-in zoom-in-95 duration-150 my-auto">
        <div class="flex items-start justify-between border-b border-slate-100 pb-3.5">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/80">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-black text-slate-900 text-base">Penahanan Waktu SLA (Hold SLA)</h4>
              <p class="text-xs text-slate-500 mt-0.5">Timer Resolution SLA akan dibekukan sementara. Perhitungan waktu ditangguhkan hingga dilanjutkan.</p>
            </div>
          </div>
          <button @click="showPauseModal = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitPauseSla" class="space-y-4">
          <div>
            <BaseSelect
              v-model="pauseData.pendingType"
              :options="holdReasonOptions"
              label="Preset Kategori Penahanan SLA"
              required
              size="md"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-800 mb-1">
                {{ pauseData.pendingType === 'PART_HARDWARE' ? 'Distributor / Vendor Principal Suku Cadang' : 'Mitra / Pihak Terkait (Opsional)' }}
              </label>
              <input 
                v-model="pauseData.principalVendor" 
                type="text" 
                :placeholder="pauseData.pendingType === 'PART_HARDWARE' ? 'Contoh: HPE Indonesia / Synnex Metrodata / Cisco TAC' : 'Contoh: Tim IT Klien PT Astra'" 
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500" 
              />
            </div>

            <div>
              <label class="block font-bold text-slate-800 mb-1">
                {{ pauseData.pendingType === 'PART_HARDWARE' ? 'Nomor RMA / Tiket Kasus Part' : 'Nomor Tiket / Referensi Klien' }}
              </label>
              <input 
                v-model="pauseData.principalCaseId" 
                type="text" 
                placeholder="Contoh: RMA-77412 atau PO-2026-081" 
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-amber-500" 
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-slate-800">
                Rincian Keterangan &amp; Justifikasi Penahanan <span class="text-rose-500">*</span>
              </label>
              <span class="text-[11px] text-slate-400">Wajib diisi untuk audit MoM</span>
            </div>
            <textarea 
              v-model="pauseData.reason" 
              required 
              rows="3" 
              placeholder="Jelaskan secara spesifik alasan hold, part hardware yang dibutuhkan, status estimasi ketersediaan barang, atau konfirmasi customer yang sedang ditunggu..." 
              class="w-full p-3 border border-slate-200 rounded-xl text-xs font-sans focus:ring-2 focus:ring-amber-500 leading-relaxed"
            ></textarea>
          </div>

          <div class="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center space-x-2 text-amber-900 text-xs">
            <span class="text-base">⏸</span>
            <span>Saat tombol diklik, status tiket otomatis beralih ke <strong>{{ pauseData.pendingType === 'PART_HARDWARE' ? 'PENDING_VENDOR' : 'PENDING_CUSTOMER' }}</strong> dan timer SLA berhenti berjalan.</span>
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button type="button" @click="showPauseModal = false" class="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer">Batal</button>
            <button type="submit" class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer">Bekukan SLA Tiket</button>
          </div>
        </form>
      </div>
    </div>



    <!-- Modal 5: Eskalasi Tiket -->
    <div v-if="showEscalateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Eskalasi Tiket Insiden</h4>
            <p class="text-[11px] text-slate-500">Alihkan penanganan tiket ke Project Manager, Mitra Partner, atau Principal TAC.</p>
          </div>
          <button @click="showEscalateModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitEscalate" class="space-y-3">
          <div>
            <BaseSelect
              v-model="escalateData.target"
              :options="escalationTargetOptions"
              label="Tujuan Eskalasi"
              required
              size="sm"
            />
          </div>

          <div v-if="escalateData.target === 'VENDOR'" class="space-y-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Pilih / Ketik Principal Vendor *</label>
              <input
                v-model="escalateData.vendorName"
                list="escalate-principals-list"
                required
                type="text"
                placeholder="Pilih atau ketik vendor (cth. Cisco Systems, HPE, Fortinet)..."
                class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
              />
              <datalist id="escalate-principals-list">
                <option v-for="p in ticketStore.allPrincipals" :key="p" :value="p"></option>
              </datalist>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Nomor Kasus / Case ID</label>
                <input v-model="escalateData.vendorCaseId" type="text" placeholder="Contoh: TAC-2026-9921" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono bg-white" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Nama Spesialis Vendor</label>
                <input v-model="escalateData.vendorSpecialist" type="text" placeholder="Contoh: Marcus Vance (L3 TAC)" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white" />
              </div>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Catatan Teknis Eskalasi *</label>
            <textarea v-model="escalateData.note" required rows="3" placeholder="Sebutkan kendala teknis, log temuan, atau bantuan yang dibutuhkan..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showEscalateModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer">Kirim Eskalasi</button>
          </div>
        </form>
      </div>
    </div>



    <!-- Modal 6: Konfirmasi Penutupan Tiket (Proper Confirm Dialog - Zero Manual Input) -->
    <div v-if="showResolveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150 my-auto text-center">
        <!-- Icon badge -->
        <div class="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-xs">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-1.5">
          <h4 class="font-black text-slate-900 text-base">Konfirmasi Penutupan Tiket</h4>
          <p class="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
            Apakah Anda yakin ingin menyelesaikan dan menutup tiket <strong class="text-slate-800 font-mono font-bold">{{ ticket.ticketNumber }}</strong>? Timer Resolution SLA akan resmi dihentikan.
          </p>
        </div>

        <!-- Detail Summary Box -->
        <div class="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Nomor Tiket:</span>
            <span class="font-mono font-bold text-slate-800">{{ ticket.ticketNumber }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Judul Kasus:</span>
            <span class="font-semibold text-slate-800 truncate max-w-[210px]" :title="ticket.title">{{ ticket.title }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Status Akhir:</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 tracking-wide">CLOSED</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Resolution SLA:</span>
            <span class="font-bold text-emerald-700">✓ Met (Berhenti)</span>
          </div>
        </div>

        <!-- Automation Note -->
        <div class="flex items-start space-x-2 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-left text-[11px] text-emerald-900 leading-relaxed">
          <span class="text-emerald-600 mt-0.5 text-sm shrink-0">💡</span>
          <span>Tiket akan resmi diselesaikan dan status diperbarui menjadi CLOSED. Seluruh catatan kronologi penanganan dan lampiran bukti tersimpan secara permanen pada timeline.</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
          <button 
            type="button" 
            @click="showResolveModal = false" 
            class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="button" 
            @click="submitResolve" 
            class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Ya, Tutup Tiket Sekarang</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 7: Assign Engineer -->
    <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Alokasikan Penugasan Teknisi</h4>
          <button @click="showAssignModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitAssign" class="space-y-3">
          <div>
            <BaseSelect
              v-model="selectedEngineerId"
              :options="engineerSelectOptions"
              label="Pilih Teknisi Penanggung Jawab"
              required
              size="sm"
              placeholder="-- Pilih Teknisi --"
            />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showAssignModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm cursor-pointer">Tugaskan</button>
          </div>
        </form>
      </div>
    </div>



    <!-- Modal 8: Attachment Preview Lightbox -->
    <AttachmentPreviewModal
      v-if="selectedAttachment"
      :attachment="selectedAttachment"
      @close="selectedAttachment = null"
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { useUiStore } from '../stores/uiStore';
import { api, getUploadUrl } from '../services/api';
import { compressImageIfNeeded } from '../utils/imageCompressor';
import { formatUtcToLocal } from '../utils/dateFormatter';
import AttachmentPreviewModal from '../components/AttachmentPreviewModal.vue';

const route = useRoute();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();

const ticketId = computed(() => Number(route.params.id));
const directTicket = ref(null);
const ticket = computed(() => {
  if (directTicket.value) return directTicket.value;
  return ticketStore.tickets.find(t => t.id == ticketId.value || String(t.id) === String(route.params.id) || t.ticketNumber === route.params.id) || null;
});

// Modals and UI States
const showMilestoneModal = ref(false);
const showConfirmResolveStepModal = ref(false);
const showEditModal = ref(false);
const showPauseModal = ref(false);
const showEscalateModal = ref(false);
const showResolveModal = ref(false);
const showAssignModal = ref(false);
const showMoreActions = ref(false);
const moreActionsDropdownRef = ref(null);
const fileInputRef = ref(null);

const showUploadAttachmentModal = ref(false);
const showLinkStepModal = ref(false);
const targetAttachmentToLink = ref(null);
const selectedTargetStepName = ref('');
const highlightedStepIndex = ref(null);
const milestoneFileInputRef = ref(null);
const timelineKey = ref(0);

const newAttachmentForm = ref({
  fileObj: null,
  targetStepName: ''
});

const selectedAttachment = ref(null);
const selectedKb = ref(null);
const copiedLink = ref(false);
const copiedSnippet = ref(false);
const selectedEngineerId = ref(null);

// Forms State
const newMilestone = ref({
  stepName: '',
  notes: '',
  additionalNotes: '',
  progressPercent: 0,
  proofFile: null,
  fileSourceType: 'upload',
  selectedExistingFile: '',
  uploadedFileObj: null,
  fileSizeStr: '',
  status: 'IN_PROGRESS',
  syncToKb: false
});

const isDraggingOver = ref(false);

const progressMilestones = [
  { percent: 0, label: 'Assigned', status: 'ASSIGNED' },
  { percent: 10, label: 'Acknowledged', status: 'IN_PROGRESS' },
  { percent: 25, label: 'Initial Diagnosis', status: 'IN_PROGRESS' },
  { percent: 40, label: 'Troubleshooting', status: 'IN_PROGRESS' },
  { percent: 60, label: 'Root Cause Identified', status: 'IN_PROGRESS' },
  { percent: 80, label: 'Resolution Applied', status: 'IN_PROGRESS' },
  { percent: 90, label: 'Customer Validation', status: 'IN_PROGRESS' },
  { percent: 100, label: 'Resolved', status: 'RESOLVED' }
];

const applyMilestoneFromGuide = (m) => {
  newMilestone.value.progressPercent = m.percent;
  newMilestone.value.stepName = m.label;
  if (m.status) {
    newMilestone.value.status = m.status;
  }
};

const handleDropFile = async (e) => {
  isDraggingOver.value = false;
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    const processedFile = await compressImageIfNeeded(file);
    newMilestone.value.uploadedFileObj = processedFile;
    newMilestone.value.proofFile = processedFile.name;
    const sizeKb = Math.round(processedFile.size / 1024);
    newMilestone.value.fileSizeStr = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';
  }
};

const editData = ref({
  title: '',
  description: '',
  severity: 'HIGH',
  categoryId: 1,
  serialNumber: ''
});

const pauseData = ref({
  pendingType: 'PART_HARDWARE',
  reason: '',
  principalCaseId: '',
  principalVendor: ''
});

const isHoldPart = computed(() => {
  if (!ticket.value) return false;
  const reason = (ticket.value.pauseReason || '').toUpperCase();
  const status = (ticket.value.status || '').toUpperCase();
  return reason.includes('PART') || reason === 'WAITING_SPAREPART' || status === 'PENDING_PART' || status === 'PENDING_VENDOR';
});

const isHoldCustomer = computed(() => {
  if (!ticket.value) return false;
  const reason = (ticket.value.pauseReason || '').toUpperCase();
  const status = (ticket.value.status || '').toUpperCase();
  return reason.includes('CUSTOMER') || reason.includes('PARTNER') || status === 'PENDING_CUSTOMER';
});

const escalateData = ref({
  target: 'VENDOR',
  vendorName: '',
  vendorCaseId: '',
  vendorSpecialist: '',
  note: ''
});

const resolveData = ref({
  rootCause: '',
  resolutionStrategy: '',
  recommendation: ''
});

// Permission checks
const isEngineerForbidden = computed(() => {
  if (!ticket.value || !authStore.currentUser) return false;
  const role = authStore.currentUser.role || authStore.currentUser.roleCode;
  if (role === 'ENGINEER') {
    return ticket.value.assignedToId && ticket.value.assignedToId !== authStore.currentUser.id;
  }
  return false;
});

const canEngineerAct = computed(() => {
  if (!authStore.currentUser) return true;
  const role = authStore.currentUser.role || authStore.currentUser.roleCode;
  if (role === 'ADMIN') return true;
  if (role === 'ENGINEER') {
    return ticket.value && (!ticket.value.assignedToId || ticket.value.assignedToId === authStore.currentUser.id);
  }
  return true;
});

const engineers = computed(() => {
  return authStore.users.filter(u => u.roleCode === 'ENGINEER');
});

// Helper lookups
const formatTime = (t) => formatUtcToLocal(t);
const formatClock = (utcDateString) => {
  if (!utcDateString) return '--:--';
  const d = new Date(utcDateString);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':');
};
const formatDeadlineText = (utcDateString) => {
  if (!utcDateString) return '--:-- WIB';
  const d = new Date(utcDateString);
  const datePart = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: 'Asia/Jakarta' });
  const timePart = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':');
  return `${datePart}, ${timePart} WIB`;
};

const getCustomer = (id) => ticketStore.customers.find(c => c.id === id) || {};
const customerInfo = computed(() => {
  if (!ticket.value) return {};
  const c = getCustomer(ticket.value.customerId);
  return {
    name: c.name || ticket.value.customerName || 'Mitra Korporat',
    slaTier: c.slaTier || c.contractTier || ticket.value.contractTier || ticket.value.contractSla || ''
  };
});

const picInfo = computed(() => {
  if (!ticket.value) return {};
  const c = getCustomer(ticket.value.customerId);
  let p = null;
  if (c && c.pics) {
    p = c.pics.find(item => item.id === ticket.value.customerPicId) || c.pics[0];
  }
  const name = p?.name || 'Rohman';
  const phone = p?.phone || '081212010198';
  const phoneClean = phone.replace(/[^0-9]/g, '');
  const email = p?.email || 'rohman@astra.co.id';
  return { name, phone, phoneClean, email };
});

const initialAttachment = computed(() => {
  if (!ticket.value) return null;
  if (ticket.value.attachmentName || ticket.value.attachmentUrl) {
    return {
      name: ticket.value.attachmentName || 'lampiran-insiden.log',
      size: ticket.value.attachmentSize || '38.4 KB',
      url: ticket.value.attachmentUrl || null
    };
  }
  if (ticket.value.attachments && ticket.value.attachments.length > 0) {
    const first = ticket.value.attachments[0];
    return {
      name: first.name || first.fileName || 'lampiran-insiden.log',
      size: first.size || '38.4 KB',
      url: first.url || null
    };
  }
  const tNum = ticket.value.ticketNumber ? ticket.value.ticketNumber.toLowerCase() : 'tk';
  const isPort = (ticket.value.title || '').toLowerCase().includes('port') || (ticket.value.title || '').toLowerCase().includes('fc') || (ticket.value.title || '').toLowerCase().includes('switch');
  const fallbackName = isPort ? `syslog-${tNum}-fc12-linkloss.txt` : `incident-${tNum}-telemetry-log.txt`;
  return {
    name: fallbackName,
    size: '28.5 KB',
    url: null,
    isFallback: true
  };
});

const openInitialAttachmentPreview = (att) => {
  if (!att?.name) return;
  downloadAttachment(att.name);
};

const categoryInfo = computed(() => {
  if (!ticket.value) return {};
  const cat = ticketStore.categories.find(c => c.id === ticket.value.categoryId);
  return cat || { name: 'Server & Infrastruktur' };
});

const creatorName = computed(() => {
  if (!ticket.value?.createdById) return 'Admin/Sistem';
  const u = authStore.users.find(item => item.id === ticket.value.createdById);
  return u ? u.name : 'Admin/Sistem';
});

const assignedEngineerName = computed(() => {
  if (!ticket.value?.assignedToId) return 'Belum Ditugaskan';
  const u = authStore.users.find(item => item.id === ticket.value.assignedToId);
  return u ? u.name : 'Belum Ditugaskan';
});

const assignedEngineerInitials = computed(() => {
  const name = assignedEngineerName.value;
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
});

const assignedEngineerRoleName = computed(() => {
  if (!ticket.value?.assignedToId) return '-';
  const u = authStore.users.find(item => item.id === ticket.value.assignedToId);
  return (u?.role || u?.roleCode) === 'ADMIN' ? 'Administrator' : 'Support Engineer';
});

const assignedEngineerEmail = computed(() => {
  if (!ticket.value?.assignedToId) return '-';
  const u = authStore.users.find(item => item.id === ticket.value.assignedToId);
  return u?.email || '-';
});

const assignedEngineerPhone = computed(() => {
  if (!ticket.value?.assignedToId) return '-';
  const u = authStore.users.find(item => item.id === ticket.value.assignedToId);
  return u?.phone || '-';
});

const getEngineerName = (id) => {
  const u = authStore.users.find(item => item.id === id);
  return u ? u.name : '-';
};

const hasPrincipalEscalation = computed(() => {
  if (!ticket.value) return false;
  return !!ticket.value.principalCaseId || 
         !!ticket.value.principalVendor || 
         ticket.value.status === 'PENDING_VENDOR' || 
         ticket.value.escalationTier === 'VENDOR_PRINCIPAL';
});

// SLA Countdown & Timers
const now = ref(Date.now());
let timerInterval = null;

const loadTicketDetails = async () => {
  const idToFetch = ticketId.value || route.params.id;
  if (!idToFetch) return;
  try {
    const res = await api.getTicketById(idToFetch);
    const data = res?.data || res;
    if (data && data.id) {
      directTicket.value = { ...data, milestones: [...(data.milestones || [])] };
      const idx = ticketStore.tickets.findIndex(t => t.id == data.id || String(t.id) === String(data.id));
      if (idx !== -1) {
        ticketStore.tickets[idx] = {
          ...ticketStore.tickets[idx],
          ...data,
          milestones: [...(data.milestones || [])]
        };
      } else {
        ticketStore.tickets.push(data);
      }
    }
  } catch (err) {
    console.warn('[TicketDetail] Backend offline or detail fallback:', err.message);
  }
};

watch(() => route.params.id, () => {
  directTicket.value = null;
  loadTicketDetails();
});

onMounted(() => {
  loadTicketDetails();
  timerInterval = setInterval(() => {
    now.value = Date.now();
  }, 1000);

  // Close dropdown on outside click
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  document.removeEventListener('click', handleOutsideClick);
});

const handleOutsideClick = (e) => {
  if (moreActionsDropdownRef.value && !moreActionsDropdownRef.value.contains(e.target)) {
    showMoreActions.value = false;
  }
};

const toggleMoreActions = () => {
  showMoreActions.value = !showMoreActions.value;
};

// Response SLA calculations
const matchedSlaPolicy = computed(() => {
  if (!ticket.value) return null;
  const policies = ticketStore.slaPolicies || [];
  const tier = ticket.value.contractTier || ticket.value.contractSla || customerInfo.value?.slaTier;
  if (!tier) return null;
  return policies.find(p => 
    p.tierCode === tier || 
    p.tierName === tier || 
    (p.tierName && tier && p.tierName.toUpperCase().includes(tier.toUpperCase()))
  ) || null;
});

const responseTargetText = computed(() => {
  if (!ticket.value) return '30 Menit';
  if (matchedSlaPolicy.value) {
    const sev = ticket.value.severity;
    let respH = sev === 'HIGH' ? matchedSlaPolicy.value.p1ResponseHours
              : sev === 'LOW'  ? (matchedSlaPolicy.value.p3ResponseHours || matchedSlaPolicy.value.p4ResponseHours || 4)
              : matchedSlaPolicy.value.p2ResponseHours;
    const mins = Math.round(respH * 60);
    return mins < 60 ? `${mins} Menit (${matchedSlaPolicy.value.tierName})` : `${respH} Jam (${matchedSlaPolicy.value.tierName})`;
  }
  if (ticket.value.responseDeadline && ticket.value.createdAt) {
    const diffMs = new Date(ticket.value.responseDeadline).getTime() - new Date(ticket.value.createdAt).getTime();
    const mins = Math.round(diffMs / 60000);
    return mins < 60 ? `${mins} Menit` : `${Math.round(mins / 60)} Jam`;
  }
  return '30 Menit';
});

const responseDurationText = computed(() => {
  if (!ticket.value || !ticket.value.createdAt) return '-';
  const endTime = ticket.value.respondedAt ? new Date(ticket.value.respondedAt).getTime() : Date.now();
  const diffMs = endTime - new Date(ticket.value.createdAt).getTime();
  const totalSec = Math.max(0, Math.floor(diffMs / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}j ${m}m`;
  if (m > 0) return `${m}m ${s}d`;
  return `${s} detik`;
});

// Resolution SLA calculations
const resolutionTargetText = computed(() => {
  if (!ticket.value) return '8 Jam';
  if (matchedSlaPolicy.value) {
    const sev = ticket.value.severity;
    let resH = sev === 'HIGH' ? matchedSlaPolicy.value.p1ResolutionHours
             : sev === 'LOW'  ? (matchedSlaPolicy.value.p3ResolutionHours || matchedSlaPolicy.value.p4ResolutionHours || 24)
             : matchedSlaPolicy.value.p2ResolutionHours;
    return `${resH} Jam (${matchedSlaPolicy.value.tierName})`;
  }
  if (ticket.value.resolutionDeadline && ticket.value.createdAt) {
    const diffMs = new Date(ticket.value.resolutionDeadline).getTime() - new Date(ticket.value.createdAt).getTime();
    return `${Math.round(diffMs / 3600000)} Jam`;
  }
  return '8 Jam';
});

const resolutionCountdown = computed(() => {
  if (!ticket.value) return '00:00:00 HRS';
  // Timer berhenti hanya ketika RESOLVED atau CLOSED
  if (ticket.value.resolvedAt || ticket.value.status === 'RESOLVED') {
    return isResolutionBreached.value ? 'SELESAI (TERLAMBAT)' : 'SELESAI (TEPAT WAKTU)';
  }
  if (ticket.value.status === 'CLOSED') {
    return isResolutionBreached.value ? 'DITUTUP (TERLAMBAT)' : 'DITUTUP (TEPAT WAKTU)';
  }
  if (ticket.value.isPaused) return 'DIJEDA (FROZEN)';

  if (!ticket.value.resolutionDeadline) return '--:--:-- HRS';

  const deadlineMs = new Date(ticket.value.resolutionDeadline).getTime();
  const diffSec = Math.floor((deadlineMs - now.value) / 1000);

  if (diffSec <= 0) {
    // Sudah breach — tampilkan waktu yang telah lewat (negatif)
    const overSec = Math.abs(diffSec);
    const h = Math.floor(overSec / 3600);
    const m = Math.floor((overSec % 3600) / 60);
    const s = overSec % 60;
    return `+${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} (BREACH)`;
  }

  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} HRS`;
});

// Apakah Resolution SLA breached (melewati batas waktu tanpa selesai)
const isResolutionBreached = computed(() => {
  if (!ticket.value) return false;
  if (ticket.value.isSlaResolutionBreached) return true;
  if (ticket.value.resolvedAt || ticket.value.status === 'RESOLVED' || ticket.value.status === 'CLOSED') {
    if (ticket.value.resolvedAt && ticket.value.resolutionDeadline) {
      return new Date(ticket.value.resolvedAt).getTime() > new Date(ticket.value.resolutionDeadline).getTime();
    }
    return false;
  }
  if (ticket.value.isPaused) return false;
  if (!ticket.value.resolutionDeadline) return false;
  return new Date(ticket.value.resolutionDeadline).getTime() < now.value;
});

// Apakah Response SLA breached
const isResponseBreached = computed(() => {
  if (!ticket.value) return false;
  if (ticket.value.isSlaResponseBreached) return true;
  if (ticket.value.respondedAt && ticket.value.responseDeadline) {
    return new Date(ticket.value.respondedAt).getTime() > new Date(ticket.value.responseDeadline).getTime();
  }
  if (!ticket.value.respondedAt && ticket.value.responseDeadline) {
    return new Date(ticket.value.responseDeadline).getTime() < now.value;
  }
  return false;
});

// Apakah Resolution SLA sedang dalam status Near Breach (< 25% sisa waktu)
const isNearResolutionBreach = computed(() => {
  if (!ticket.value || !ticket.value.resolutionDeadline || !ticket.value.createdAt) return false;
  if (ticket.value.resolvedAt || ticket.value.status === 'RESOLVED' || ticket.value.status === 'CLOSED' || isResolutionBreached.value) return false;
  const totalMs = new Date(ticket.value.resolutionDeadline).getTime() - new Date(ticket.value.createdAt).getTime();
  const remainMs = new Date(ticket.value.resolutionDeadline).getTime() - now.value;
  if (totalMs <= 0) return false;
  const pct = remainMs / totalMs;
  return pct > 0 && pct < 0.25; // sisa < 25%
});

const slaProgressPercent = computed(() => {
  if (!ticket.value || !ticket.value.resolutionDeadline || !ticket.value.createdAt) return 0;
  if (isResolutionBreached.value) return 100;
  const totalMs = new Date(ticket.value.resolutionDeadline).getTime() - new Date(ticket.value.createdAt).getTime();
  if (totalMs <= 0) return 100;
  const endTime = ticket.value.resolvedAt ? new Date(ticket.value.resolvedAt).getTime() : now.value;
  const elapsedMs = endTime - new Date(ticket.value.createdAt).getTime();
  return Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
});

const elapsedTimeFormatted = computed(() => {
  if (!ticket.value || !ticket.value.createdAt) return '-';
  const endTime = ticket.value.resolvedAt
    ? new Date(ticket.value.resolvedAt).getTime()
    : now.value;
  const totalMs = Math.max(0, endTime - new Date(ticket.value.createdAt).getTime());
  const sec = Math.floor(totalMs / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
});

const estimatedResolutionTime = computed(() => {
  if (ticket.value?.resolutionDeadline) return ticket.value.resolutionDeadline;
  const d = new Date();
  d.setHours(22, 30, 0, 0);
  return d.toISOString();
});

const closureResolvedDateText = computed(() => {
  const t = ticket.value?.resolvedAt || ticket.value?.closedAt || ticket.value?.updatedAt;
  return t ? formatTime(t).local : '-';
});

const closureDurationText = computed(() => {
  if (!ticket.value || !ticket.value.createdAt) return '--:--:--';
  const endTime = ticket.value.resolvedAt || ticket.value.closedAt || null;
  if (!endTime) return '--:--:--';
  const totalMs = new Date(endTime).getTime() - new Date(ticket.value.createdAt).getTime();
  const totalSec = Math.max(0, Math.floor(totalMs / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
});

// Diagnostic Timeline Steps: Menampilkan data milestone riil dari database
const timelineSteps = computed(() => {
  // Jika tiket memiliki milestones tersimpan di DB, gunakan data riil tersebut
  if (ticket.value?.milestones && ticket.value.milestones.length > 0) {
    let runningProgress = 0;
    return ticket.value.milestones.map((m) => {
      let p = m.progressPercent !== undefined && m.progressPercent !== null && m.progressPercent !== ''
        ? Number(m.progressPercent)
        : null;

      if (p === null || isNaN(p)) {
        if (m.status === 'RESOLVED' || m.status === 'CLOSED') {
          p = 100;
        } else {
          // Pause/Hold, Resume, atau milestone tanpa persentase tetap mewarisi progres berjalan
          p = runningProgress;
        }
      }
      runningProgress = Math.max(runningProgress, p);
      return {
        ...m,
        progressPercent: runningProgress
      };
    });
  }

  // Fallback awal untuk tiket baru yang belum memiliki milestone tambahan
  const createdAtUtc = ticket.value?.createdAt || new Date().toISOString();
  return [
    {
      id: 1,
      stepName: 'Laporan Diterima (Ticket Created)',
      status: 'OPEN',
      actorName: creatorName.value,
      actorRole: 'Admin',
      notes: `Tiket #${ticket.value?.ticketNumber || ''} berhasil diterbitkan dan masuk ke sistem Helpdesk. Target respon SLA berjalan.`,
      timestampUtc: createdAtUtc,
      progressPercent: 0,
      proofFile: ticket.value?.attachmentName || null
    }
  ];
});

// Attachments list — hanya dari data tiket real (tidak ada defaults dummy)
const allAttachments = computed(() => {
  const existing = ticket.value?.attachments || [];
  return existing.map(att => ({
    id: att.id,
    name: att.name || att.fileName || att.originalName || 'lampiran',
    size: att.size || att.fileSize || '-',
    source: att.source || att.stepName || 'Upload Lampiran'
  }));
});

// Dropdown options
const milestoneStatusOptions = [
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'PENDING', label: 'Pending (Part / Vendor / Client)' },
  { value: 'ESCALATED', label: 'Escalated (Principal TAC)' },
  { value: 'RESOLVED', label: 'Resolved (Terselesaikan)' }
];

const proofFileOptions = computed(() => [
  { value: '', label: '-- Tanpa Lampiran --' },
  ...(allAttachments.value || []).map(att => ({
    value: att.name,
    label: att.name,
    subtext: att.stepName ? `Terikat ke: ${att.stepName}` : 'Lampiran berkas'
  }))
]);

const stepOptions = computed(() => 
  (timelineSteps.value || []).map((st, idx) => ({
    value: st.stepName,
    label: `Step ${idx + 1}: ${st.stepName}`,
    subtext: st.desc || ''
  }))
);

const stepOptionsWithGeneral = computed(() => [
  { value: '', label: '-- Umum (Tidak Terikat Step Tertentu) --' },
  ...stepOptions.value
]);

const severityOptions = [
  { value: 'HIGH', label: 'HIGH (Kritis)', badge: 'Critical', badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200' },
  { value: 'MEDIUM', label: 'MEDIUM (Sedang)', badge: 'Major', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: 'LOW', label: 'LOW (Rendah)', badge: 'Minor', badgeClass: 'bg-sky-50 text-sky-700 border border-sky-200' }
];

const categorySelectOptions = computed(() => 
  (ticketStore.categories || []).map(cat => ({
    value: cat.id,
    label: cat.name,
    subtext: cat.code || ''
  }))
);

const holdReasonOptions = computed(() => {
  return [
    { value: 'PART_HARDWARE', label: 'Part / Hardware (Menunggu suku cadang/penggantian hardware)', subtext: 'Perangkat pengganti, modul controller, atau disk dalam pengiriman/tahap instalasi' },
    { value: 'PARTNER_CUSTOMER', label: 'Partner / Customer (Menunggu konfirmasi atau akses)', subtext: 'Menunggu konfirmasi customer, verifikasi pihak ketiga, atau window maintenance' }
  ];
});

const escalationTargetOptions = [
  { value: 'VENDOR', label: 'Vendor / Principal TAC (L3 OEM Specialist)', subtext: 'Eskalasi ke principal OEM seperti Cisco, VMware, Fortinet' },
  { value: 'PM', label: 'Project Manager (PM)', subtext: 'Koordinasi scope & timeline proyek' },
  { value: 'PARTNER', label: 'Mitra / Partner Implementasi', subtext: 'Pihak ketiga penyedia layanan' },
  { value: 'INTERNAL_L2', label: 'Internal Lead / Tier 2 Specialist', subtext: 'Eskalasi internal tier 2' }
];

const engineerSelectOptions = computed(() => 
  (engineers.value || []).map(u => ({
    value: u.id,
    label: u.name,
    subtext: (u.role || u.roleCode) === 'ADMIN' ? 'Administrator' : 'Support Engineer',
    badge: 'Engineer'
  }))
);

// Related Knowledge Base articles (dynamically matched from uploaded runbooks)
const relatedKbArticles = computed(() => {
  if (!ticketStore.knowledgeBase || ticketStore.knowledgeBase.length === 0 || !ticket.value) {
    return [];
  }
  const t = ticket.value;
  const tCatName = typeof t.category === 'string' ? t.category : (t.category?.name || t.categoryName || '');
  const tTitle = typeof t.title === 'string' ? t.title : '';
  const tVendor = typeof t.principalVendor === 'string' ? t.principalVendor : '';
  const query = `${tTitle} ${tCatName} ${tVendor}`.toLowerCase();
  return ticketStore.knowledgeBase
    .map(k => {
      // Direct ticket linkage check
      const kSource = typeof k.sourceTicket === 'string' ? k.sourceTicket : String(k.sourceTicket || '');
      const tNum = typeof t.ticketNumber === 'string' ? t.ticketNumber : String(t.ticketNumber || '');
      const tId = String(t.id || '');
      const isDirectLinked = Boolean(
        kSource && (
          kSource === tNum ||
          kSource === tId ||
          kSource.toLowerCase() === tNum.toLowerCase()
        )
      );

      const kTitle = typeof k.title === 'string' ? k.title : '';
      const kCat = typeof k.category === 'string' ? k.category : (k.category?.name || '');
      const kProd = typeof k.product === 'string' ? k.product : '';

      const matchTitle = query && tTitle && kTitle.toLowerCase().includes(tTitle.toLowerCase()) ? 25 : 0;
      const matchCat = query && tCatName && kCat.toLowerCase().includes(tCatName.toLowerCase()) ? 20 : 0;
      const matchProd = query && tVendor && kProd.toLowerCase().includes(tVendor.toLowerCase()) ? 25 : 0;
      const score = isDirectLinked ? 100 : Math.min(95, 50 + matchTitle + matchCat + matchProd);

      return {
        id: k.id,
        kbCode: k.kbCode || `KB-${k.id}`,
        title: k.title,
        similarity: score,
        isDirectLinked,
        sourceTicket: k.sourceTicket,
        caseType: k.caseType,
        category: kCat,
        product: kProd,
        documentName: k.documentName,
        documentSize: k.documentSize,
        pdfAttachmentUrl: k.pdfAttachmentUrl,
        tags: [kCat, k.caseType, kProd].filter(Boolean)
      };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4);
});

const isDocx = (item) => {
  const name = item?.documentName || item?.pdfAttachmentUrl || '';
  return name.toLowerCase().endsWith('.docx') || name.toLowerCase().endsWith('.doc');
};

const downloadKbDoc = (item) => {
  if (!item) return;
  if (item.id && item.pdfAttachmentUrl) {
    const url = api.getDownloadDocUrl(item.id);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.documentName || item.title || 'Dokumen_Runbook';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    uiStore.toastSuccess(`Mengunduh dokumen "${item.documentName || item.title}"...`);
  } else {
    uiStore.toastInfo('Berkas dokumen resmi belum diunggah untuk runbook ini.');
  }
};

// Badges Styling helpers
const getSeverityBadgeClass = (s) => {
  switch (s) {
    case 'HIGH': return 'bg-rose-100 text-rose-800 border border-rose-200';
    case 'MEDIUM': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'LOW': return 'bg-slate-100 text-slate-700 border border-slate-200';
    default: return 'bg-rose-100 text-rose-800 border border-rose-200';
  }
};

const getSeverityDotClass = (s) => {
  switch (s) {
    case 'HIGH': return 'bg-rose-600';
    case 'MEDIUM': return 'bg-amber-500';
    case 'LOW': return 'bg-slate-400';
    default: return 'bg-rose-600';
  }
};

const getStatusBadgeClass = (st) => {
  const norm = (st || '').toUpperCase().trim();
  switch (norm) {
    case 'OPEN':
      return 'bg-sky-50 text-sky-700 border border-sky-300';
    case 'ASSIGNED':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-300';
    case 'IN PROGRESS':
    case 'IN_PROGRESS':
      return 'bg-blue-50 text-blue-700 border border-blue-300';
    case 'PENDING':
      return 'bg-amber-50 text-amber-800 border border-amber-300';
    case 'PENDING_VENDOR':
      return 'bg-orange-50 text-orange-800 border border-orange-300';
    case 'PENDING_CUSTOMER':
      return 'bg-yellow-50 text-yellow-800 border border-yellow-300';
    case 'ESCALATED':
      return 'bg-purple-50 text-purple-700 border border-purple-300';
    case 'RESOLVED':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold';
    case 'CLOSED':
      return 'bg-slate-100 text-slate-700 border border-slate-300 font-medium';
    default:
      return 'bg-slate-50 text-slate-700 border border-slate-200';
  }
};

const getStatusDotClass = (st) => {
  const norm = (st || '').toUpperCase().trim();
  switch (norm) {
    case 'OPEN': return 'bg-sky-500';
    case 'ASSIGNED': return 'bg-indigo-600';
    case 'IN PROGRESS':
    case 'IN_PROGRESS': return 'bg-blue-600';
    case 'PENDING': return 'bg-amber-500';
    case 'PENDING_VENDOR': return 'bg-orange-500';
    case 'PENDING_CUSTOMER': return 'bg-yellow-500';
    case 'ESCALATED': return 'bg-purple-600';
    case 'RESOLVED': return 'bg-emerald-600';
    case 'CLOSED': return 'bg-slate-600';
    default: return 'bg-slate-500';
  }
};

const getTimelineNodeColor = (status, isLatest) => {
  const norm = (status || '').toUpperCase().trim();
  switch (norm) {
    case 'RESOLVED':
      return 'bg-emerald-600 text-white';
    case 'CLOSED':
      return 'bg-slate-600 text-white';
    case 'ESCALATED':
      return 'bg-purple-600 text-white';
    case 'PENDING_VENDOR':
      return 'bg-orange-500 text-white';
    case 'PENDING_CUSTOMER':
      return 'bg-yellow-600 text-white';
    case 'PENDING':
      return 'bg-amber-500 text-white';
    case 'IN PROGRESS':
    case 'IN_PROGRESS':
      return isLatest ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-blue-600 text-white';
    case 'ASSIGNED':
      return 'bg-indigo-600 text-white';
    case 'OPEN':
      return 'bg-sky-500 text-white';
    default:
      return 'bg-blue-600 text-white';
  }
};

// Actions & Handlers
const openEditModal = () => {
  if (!ticket.value) return;
  editData.value = {
    title: ticket.value.title,
    description: ticket.value.description,
    severity: ticket.value.severity || 'HIGH',
    categoryId: ticket.value.categoryId || 1,
    serialNumber: ticket.value.serialNumber || ''
  };
  showEditModal.value = true;
};

const submitEditTicket = () => {
  if (!ticket.value) return;
  ticketStore.updateTicketDetails(
    ticket.value.id,
    { ...editData.value },
    authStore.currentUser
  );
  showEditModal.value = false;
};

const printTicket = () => {
  window.print();
};

const triggerMilestoneFileInput = () => {
  milestoneFileInputRef.value?.click();
};

const handleMilestoneFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const processedFile = await compressImageIfNeeded(file);
  newMilestone.value.uploadedFileObj = processedFile;
  newMilestone.value.proofFile = processedFile.name;
  const sizeKb = Math.round(processedFile.size / 1024);
  newMilestone.value.fileSizeStr = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';
};

const removeMilestoneFile = () => {
  newMilestone.value.uploadedFileObj = null;
  newMilestone.value.proofFile = '';
  newMilestone.value.fileSizeStr = '';
  if (milestoneFileInputRef.value) milestoneFileInputRef.value.value = '';
};

const minAllowedProgress = computed(() => {
  const steps = timelineSteps.value || [];
  if (steps.length === 0) return 0;
  const maxPrev = steps.reduce((max, s) => {
    const p = s.progressPercent !== undefined && s.progressPercent !== null ? Number(s.progressPercent) : 0;
    return Math.max(max, isNaN(p) ? 0 : p);
  }, 0);
  return Math.min(100, Math.max(0, maxPrev));
});

const isProgressInvalid = computed(() => {
  const val = Number(newMilestone.value.progressPercent);
  return isNaN(val) || val < minAllowedProgress.value || val > 100;
});

const handleProgressInput = () => {
  if (newMilestone.value.progressPercent > 100) {
    newMilestone.value.progressPercent = 100;
  }
};

const handleProgressBlur = () => {
  const min = minAllowedProgress.value;
  const val = Number(newMilestone.value.progressPercent);
  if (isNaN(val) || val < min) {
    newMilestone.value.progressPercent = min;
  } else if (val > 100) {
    newMilestone.value.progressPercent = 100;
  }
};

const handleSliderInput = (e) => {
  const min = minAllowedProgress.value;
  const val = Number(e.target.value);
  if (val < min) {
    newMilestone.value.progressPercent = min;
  } else {
    newMilestone.value.progressPercent = Math.min(100, val);
  }
};

const sliderTrackStyle = computed(() => {
  const min = minAllowedProgress.value;
  const curr = Math.max(min, Number(newMilestone.value.progressPercent || min));
  return {
    background: `linear-gradient(to right, #cbd5e1 0%, #cbd5e1 ${min}%, #2563eb ${min}%, #2563eb ${curr}%, #e2e8f0 ${curr}%, #e2e8f0 100%)`
  };
});

watch(() => newMilestone.value.status, (st) => {
  if (st === 'RESOLVED') {
    newMilestone.value.progressPercent = 100;
  }
});

const openMilestoneModal = () => {
  const minProg = minAllowedProgress.value;
  // Cukup min + 1% dari step sebelumnya jadi state awal (maksimal 100%)
  const initialProg = ticket.value?.status === 'RESOLVED' ? 100 : Math.min(100, minProg + 1);
  newMilestone.value = {
    stepName: '',
    notes: '',
    additionalNotes: '',
    progressPercent: initialProg,
    status: ticket.value?.status === 'ESCALATED' ? 'ESCALATED' : (ticket.value?.status === 'RESOLVED' ? 'RESOLVED' : 'IN_PROGRESS'),
    proofFile: null,
    fileSourceType: 'upload',
    selectedExistingFile: '',
    uploadedFileObj: null,
    fileSizeStr: '',
    syncToKb: false
  };
  showMilestoneModal.value = true;
};

const submitMilestone = () => {
  if (!ticket.value) return;

  const selectedStatus = newMilestone.value.status || 'IN_PROGRESS';

  // Jika status penanganan dipilih RESOLVED atau CLOSED, buka modal konfirmasi proper
  if (selectedStatus === 'RESOLVED' || selectedStatus === 'CLOSED') {
    showConfirmResolveStepModal.value = true;
    return;
  }

  executeSubmitMilestone();
};

const executeSubmitMilestone = async () => {
  if (!ticket.value) return;

  let finalProofFile = null;
  let finalFileSize = '1.8 KB';

  if (newMilestone.value.proofFile) {
    finalProofFile = newMilestone.value.proofFile;
    finalFileSize = newMilestone.value.fileSizeStr || '1.8 KB';
  } else if (newMilestone.value.uploadedFileObj) {
    finalProofFile = newMilestone.value.uploadedFileObj.name;
    finalFileSize = newMilestone.value.fileSizeStr || '1.8 KB';
  }

  const selectedStatus = newMilestone.value.status || 'IN_PROGRESS';
  const minProg = minAllowedProgress.value;
  let selectedProgress = Number(newMilestone.value.progressPercent ?? minProg);
  if (selectedStatus === 'RESOLVED' || selectedStatus === 'CLOSED') {
    selectedProgress = 100;
  } else {
    selectedProgress = Math.min(100, Math.max(minProg, isNaN(selectedProgress) ? minProg : selectedProgress));
  }
  newMilestone.value.progressPercent = selectedProgress;

  const nowIso = new Date().toISOString();
  const currentUser = authStore.currentUser || { name: 'Support Engineer', roleCode: 'ENGINEER' };

  try {
    await api.addMilestone(ticket.value.id, {
      stepName: newMilestone.value.stepName,
      notes: newMilestone.value.notes,
      proofFile: finalProofFile,
      nextStatus: selectedStatus,
      progressPercent: selectedProgress
    });
  } catch (err) {
    console.warn('[TicketDetail] API milestone fallback:', err.message);
  }

  // Simpan ke local store untuk offline/sinkronisasi
  ticketStore.addProgressMilestone(
    ticket.value.id,
    {
      stepName: newMilestone.value.stepName,
      notes: newMilestone.value.notes,
      additionalNotes: newMilestone.value.additionalNotes,
      progressPercent: selectedProgress,
      proofFile: finalProofFile,
      proofFileSize: finalFileSize,
      nextStatus: selectedStatus,
      syncToKb: newMilestone.value.syncToKb
    },
    currentUser
  );

  // Ambil langsung data tiket & milestones terbaru dari database
  await loadTicketDetails();

  // Sinkronisasi status dan progres pada directTicket & ticket
  if (directTicket.value) {
    directTicket.value.status = selectedStatus;
    directTicket.value.progressPercent = selectedProgress;
    directTicket.value.updatedAt = nowIso;
    if (selectedStatus === 'RESOLVED' || selectedStatus === 'CLOSED') {
      directTicket.value.resolvedAt = nowIso;
    }
    // Re-assign array & object reference untuk re-render seketika
    directTicket.value = { 
      ...directTicket.value, 
      milestones: [...(directTicket.value.milestones || [])] 
    };
  }

  if (ticket.value) {
    ticket.value.status = selectedStatus;
    ticket.value.progressPercent = selectedProgress;
    ticket.value.updatedAt = nowIso;
    if (selectedStatus === 'RESOLVED' || selectedStatus === 'CLOSED') {
      ticket.value.resolvedAt = nowIso;
    }
  }

  // Trigger re-render instan pada timeline DOM
  timelineKey.value++;
  showConfirmResolveStepModal.value = false;
  showMilestoneModal.value = false;
};

const isAttachmentLinkedToStep = (source) => {
  if (!source) return false;
  return source.toLowerCase().includes('step') || source.toLowerCase().includes('troubleshooting');
};

const getStepShortName = (source) => {
  if (!source) return 'Step';
  if (source.startsWith('Step: ')) return source.replace('Step: ', '');
  return source;
};

const scrollToStep = (source) => {
  if (!source) return;
  const clean = source.replace('Step: ', '').trim();
  const stepIdx = timelineSteps.value.findIndex(s => 
    s.stepName === clean || 
    clean.includes(s.stepName) || 
    (s.proofFile && clean.includes(s.proofFile))
  );
  if (stepIdx !== -1) {
    const el = document.getElementById('step-node-' + stepIdx);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightedStepIndex.value = stepIdx;
      setTimeout(() => {
        highlightedStepIndex.value = null;
      }, 3000);
    }
  }
};

const openUploadAttachmentModal = () => {
  newAttachmentForm.value = {
    fileObj: null,
    targetStepName: ''
  };
  showUploadAttachmentModal.value = true;
};

const handleManualAttachmentFileChange = async (e) => {
  const file = e.target.files[0] || null;
  if (!file) {
    newAttachmentForm.value.fileObj = null;
    return;
  }
  newAttachmentForm.value.fileObj = await compressImageIfNeeded(file);
};

const submitUploadAttachment = () => {
  if (!ticket.value || !newAttachmentForm.value.fileObj) return;
  const file = newAttachmentForm.value.fileObj;
  const sizeKb = Math.round(file.size / 1024);
  const sizeStr = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';

  ticketStore.addAttachment(
    ticket.value.id,
    {
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      size: sizeStr,
      source: newAttachmentForm.value.targetStepName ? `Step: ${newAttachmentForm.value.targetStepName}` : 'Upload Manual Pengguna',
      targetStepName: newAttachmentForm.value.targetStepName || null
    },
    authStore.currentUser
  );

  showUploadAttachmentModal.value = false;
};

const openLinkStepModal = (att) => {
  targetAttachmentToLink.value = att;
  selectedTargetStepName.value = '';
  showLinkStepModal.value = true;
};

const submitLinkAttachmentToStep = () => {
  if (!ticket.value || !targetAttachmentToLink.value || !selectedTargetStepName.value) return;
  ticketStore.linkAttachmentToStep(
    ticket.value.id,
    targetAttachmentToLink.value.name,
    selectedTargetStepName.value,
    authStore.currentUser
  );
  showLinkStepModal.value = false;
};

const openPauseModal = () => {
  pauseData.value = { 
    pendingType: 'PART_HARDWARE', 
    reason: ticket.value?.pauseDetails || '', 
    principalCaseId: ticket.value?.principalCaseId || '',
    principalVendor: ticket.value?.principalVendor || ''
  };
  showPauseModal.value = true;
};

const submitPauseSla = async () => {
  if (!ticket.value) return;
  try {
    await api.pauseSla(ticket.value.id, pauseData.value);
  } catch (err) {
    console.warn('[TicketDetail] API pause fallback:', err.message);
  }
  ticketStore.pauseSla(ticket.value.id, pauseData.value, authStore.currentUser);
  ticket.value.isPaused = true;
  ticket.value.pausedAt = new Date().toISOString();
  ticket.value.pauseReason = pauseData.value.pendingType;
  ticket.value.pauseDetails = pauseData.value.reason;
  if (pauseData.value.principalCaseId) {
    ticket.value.principalCaseId = pauseData.value.principalCaseId;
  }
  if (pauseData.value.principalVendor) {
    ticket.value.principalVendor = pauseData.value.principalVendor;
  }
  ticket.value.status = (pauseData.value.pendingType === 'PARTNER_CUSTOMER') ? 'PENDING_CUSTOMER' : 'PENDING_VENDOR';
  showPauseModal.value = false;
  await loadTicketDetails();
  timelineKey.value++;
};

const handleResumeSla = async () => {
  if (!ticket.value) return;
  try {
    await api.resumeSla(ticket.value.id);
  } catch (err) {
    console.warn('[TicketDetail] API resume fallback:', err.message);
  }
  ticketStore.resumeSla(ticket.value.id, authStore.currentUser);
  ticket.value.isPaused = false;
  ticket.value.pausedAt = null;
  ticket.value.status = 'IN_PROGRESS';
  await loadTicketDetails();
  timelineKey.value++;
};

const openEscalateModal = () => {
  escalateData.value = {
    target: 'VENDOR',
    vendorName: ticket.value?.principalVendor || 'Cisco TAC Global',
    vendorCaseId: ticket.value?.principalCaseId || '24325',
    vendorSpecialist: ticket.value?.principalSpecialist || 'Spesialis Support L3',
    note: ''
  };
  showEscalateModal.value = true;
};

const submitEscalate = async () => {
  if (!ticket.value) return;
  try {
    await api.escalateTicket(ticket.value.id, escalateData.value);
  } catch (err) {
    console.warn('[TicketDetail] API escalate fallback:', err.message);
  }
  ticketStore.escalateTicket(ticket.value.id, escalateData.value, authStore.currentUser);
  showEscalateModal.value = false;
};

const pullFromTroubleshootingSteps = () => {
  const steps = timelineSteps.value || [];
  if (steps.length === 0) return;

  // Cari langkah diagnosa / analisis akar masalah
  const diagStep = steps.find(s => 
    (s.title && (s.title.toLowerCase().includes('akar') || s.title.toLowerCase().includes('root') || s.title.toLowerCase().includes('diagnos') || s.title.toLowerCase().includes('analis') || s.title.toLowerCase().includes('identif'))) ||
    (s.stepName && (s.stepName.toLowerCase().includes('akar') || s.stepName.toLowerCase().includes('root') || s.stepName.toLowerCase().includes('diagnos') || s.stepName.toLowerCase().includes('analis') || s.stepName.toLowerCase().includes('identif'))) ||
    (s.notes && (s.notes.toLowerCase().includes('akar masalah') || s.notes.toLowerCase().includes('root cause') || s.notes.toLowerCase().includes('penyebab') || s.notes.toLowerCase().includes('ditemukan') || s.notes.toLowerCase().includes('hasil pengecekan')))
  );

  // Cari langkah tindakan solusi perbaikan
  const fixStep = [...steps].reverse().find(s => 
    (s.title && (s.title.toLowerCase().includes('solusi') || s.title.toLowerCase().includes('perbaikan') || s.title.toLowerCase().includes('resolusi') || s.title.toLowerCase().includes('action') || s.title.toLowerCase().includes('tindakan') || s.title.toLowerCase().includes('verifikasi') || s.title.toLowerCase().includes('applied') || s.title.toLowerCase().includes('selesai'))) ||
    (s.stepName && (s.stepName.toLowerCase().includes('solusi') || s.stepName.toLowerCase().includes('perbaikan') || s.stepName.toLowerCase().includes('resolusi') || s.stepName.toLowerCase().includes('action') || s.stepName.toLowerCase().includes('tindakan') || s.stepName.toLowerCase().includes('verifikasi') || s.stepName.toLowerCase().includes('applied') || s.stepName.toLowerCase().includes('selesai'))) ||
    (s.notes && (s.notes.toLowerCase().includes('solusi') || s.notes.toLowerCase().includes('perbaikan') || s.notes.toLowerCase().includes('berhasil') || s.notes.toLowerCase().includes('rebalance') || s.notes.toLowerCase().includes('restart') || s.notes.toLowerCase().includes('ganti') || s.notes.toLowerCase().includes('selesai')))
  );

  const defaultDiagNote = diagStep?.notes || (steps.length > 0 ? (steps[0].notes || steps[0].stepName || steps[0].title) : '');
  const defaultFixNote = fixStep?.notes || (steps.length > 1 ? (steps[steps.length - 1].notes || steps[steps.length - 1].stepName || steps[steps.length - 1].title) : (steps.length > 0 ? (steps[0].notes || steps[0].stepName || steps[0].title) : ''));

  if (defaultDiagNote) {
    resolveData.value.rootCause = defaultDiagNote.trim();
  }
  if (defaultFixNote) {
    resolveData.value.resolutionStrategy = defaultFixNote.trim();
  }
};

const openResolveModal = () => {
  resolveData.value = {
    rootCause: ticket.value?.rootCause || '',
    resolutionStrategy: ticket.value?.resolutionStrategy || '',
    recommendation: ticket.value?.recommendation || ''
  };
  pullFromTroubleshootingSteps();
  showResolveModal.value = true;
};

const submitResolve = async () => {
  if (!ticket.value) return;

  // Otomatis tarik dari tahapan troubleshooting tanpa butuh input manual
  pullFromTroubleshootingSteps();

  if (!resolveData.value.rootCause) {
    resolveData.value.rootCause = ticket.value.rootCause || ticket.value.description || 'Pemeriksaan dan diagnosis insiden telah selesai diverifikasi.';
  }
  if (!resolveData.value.resolutionStrategy) {
    resolveData.value.resolutionStrategy = ticket.value.resolutionStrategy || 'Tindakan perbaikan teknis dan validasi sistem telah diterapkan sesuai prosedur operasional.';
  }

  try {
    await api.resolveTicket(ticket.value.id, resolveData.value);
  } catch (err) {
    console.warn('[TicketDetail] API resolve fallback:', err.message);
  }

  const nowIso = new Date().toISOString();
  ticketStore.resolveTicket(ticket.value.id, resolveData.value, authStore.currentUser);
  ticket.value.status = 'CLOSED';
  ticket.value.resolvedAt = nowIso;
  ticket.value.closedAt = nowIso;
  ticket.value.progressPercent = 100;
  ticket.value.rootCause = resolveData.value.rootCause;
  ticket.value.resolutionStrategy = resolveData.value.resolutionStrategy;
  ticket.value.recommendation = resolveData.value.recommendation;

  if (directTicket.value) {
    directTicket.value.status = 'CLOSED';
    directTicket.value.progressPercent = 100;
    directTicket.value.resolvedAt = nowIso;
    directTicket.value.closedAt = nowIso;
    directTicket.value = { ...directTicket.value };
  }

  await loadTicketDetails();
  timelineKey.value++;
  showResolveModal.value = false;
};

const isSendingDispatchEmail = ref(false);
const isSendingCustomerEmail = ref(false);
const isSendingResolutionEmail = ref(false);

const handleSendCustomerTrackingEmail = async () => {
  if (!ticket.value?.id) return;
  isSendingCustomerEmail.value = true;
  try {
    const res = await api.sendCustomerTrackingEmail(ticket.value.id);
    uiStore.toastSuccess(res?.message || 'Email tiket & link tracking mandiri berhasil dikirim ke PIC klien!');
    await loadTicketDetails();
    timelineKey.value++;
  } catch (err) {
    uiStore.toastError(err.message || 'Gagal mengirim email ke PIC klien.');
  } finally {
    isSendingCustomerEmail.value = false;
  }
};

const handleSendEngineerDispatchEmail = async () => {
  if (!ticket.value?.id) return;
  isSendingDispatchEmail.value = true;
  try {
    const res = await api.sendEngineerDispatchEmail(ticket.value.id);
    uiStore.toastSuccess(res?.message || 'Email penugasan berhasil dikirim ke teknisi!');
    await loadTicketDetails();
    timelineKey.value++;
  } catch (err) {
    uiStore.toastError(err.message || 'Gagal mengirim email penugasan teknisi.');
  } finally {
    isSendingDispatchEmail.value = false;
  }
};

const handleSendResolutionEmail = async () => {
  if (!ticket.value?.id) return;
  isSendingResolutionEmail.value = true;
  try {
    const res = await api.sendResolutionEmail(ticket.value.id);
    uiStore.toastSuccess(res?.message || 'Berita Acara resmi berhasil dikirim ke PIC klien!');
    await loadTicketDetails();
    timelineKey.value++;
  } catch (err) {
    uiStore.toastError(err.message || 'Gagal mengirim Berita Acara ke klien.');
  } finally {
    isSendingResolutionEmail.value = false;
  }
};

const openAssignModal = () => {
  selectedEngineerId.value = ticket.value.assignedToId || (engineers.value[0] ? engineers.value[0].id : null);
  showAssignModal.value = true;
};

const submitAssign = async () => {
  if (!ticket.value || !selectedEngineerId.value) return;
  try {
    await api.assignEngineer(ticket.value.id, selectedEngineerId.value);
  } catch (err) {
    console.warn('[TicketDetail] API assign fallback:', err.message);
  }
  ticketStore.assignEngineer(ticket.value.id, selectedEngineerId.value, authStore.currentUser);
  showAssignModal.value = false;
};

const openAttachmentPreview = (fileName) => {
  if (!fileName) return;
  downloadAttachment(fileName);
};

const downloadAttachment = (fileName) => {
  if (!fileName) return;
  const a = document.createElement('a');
  a.href = getUploadUrl(fileName);
  a.download = fileName;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0 || !ticket.value) return;

  for (let i = 0; i < files.length; i++) {
    const file = await compressImageIfNeeded(files[i]);
    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';

    ticketStore.addAttachment(
      ticket.value.id,
      {
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        size: sizeStr,
        source: 'Upload Manual Pengguna'
      },
      authStore.currentUser
    );
  }
  // Reset input
  event.target.value = '';
};

const openKbDetail = (kb) => {
  selectedKb.value = kb;
};

const copySnippet = (snippet) => {
  if (!snippet) return;
  navigator.clipboard.writeText(snippet);
  copiedSnippet.value = true;
  setTimeout(() => { copiedSnippet.value = false; }, 2500);
};

const applyKbSolution = (kb) => {
  if (!ticket.value || !kb) return;
  const note = `[Rujukan SOP ${kb.kbCode || ''}]: ${kb.title || ''}${kb.documentName ? ' (File: ' + kb.documentName + ')' : ''}`;
  ticketStore.updateTicketDetails(
    ticket.value.id,
    {
      resolutionStrategy: ticket.value.resolutionStrategy ? `${ticket.value.resolutionStrategy}\n\n${note}` : note
    },
    authStore.currentUser
  );
  selectedKb.value = null;
};

const handleToggleKbCandidate = (e) => {
  if (!ticket.value) return;
  ticketStore.toggleProposeKb(ticket.value.id);
};

const handleCopyLink = () => {
  if (!ticket.value) return;
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/track/${ticket.value.ticketNumber}?token=${ticket.value.trackingToken}`;
  navigator.clipboard.writeText(url);
  copiedLink.value = true;
  setTimeout(() => { copiedLink.value = false; }, 3000);
};
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .print-container {
    padding: 0 !important;
    margin: 0 !important;
    background: white !important;
    color: black !important;
  }
}
</style>
