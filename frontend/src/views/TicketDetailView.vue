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
            <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </span>

          <!-- Priority Badge -->
          <span 
            class="font-bold text-[11px] px-2.5 py-0.8 rounded-full uppercase tracking-wide flex items-center gap-1.5 shadow-2xs"
            :class="getSeverityBadgeClass(ticket.severity)"
          >
            <span class="w-2 h-2 rounded-full" :class="getSeverityDotClass(ticket.severity)"></span>
            {{ ticket.severity || 'HIGH' }}
          </span>

          <!-- Status Badge -->
          <span 
            class="font-bold text-[11px] px-2.5 py-0.8 rounded-full uppercase tracking-wide flex items-center gap-1.5 shadow-2xs"
            :class="getStatusBadgeClass(ticket.status)"
          >
            <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(ticket.status)"></span>
            {{ ticket.status }}
          </span>

          <!-- Assigned Badge if applicable -->
          <span 
            v-if="ticket.assignedToId"
            class="bg-blue-100/80 text-blue-800 font-bold text-[11px] px-2.5 py-0.8 rounded-full uppercase tracking-wide shadow-2xs"
          >
            ASSIGNED
          </span>

          <!-- Channel Origin Badge -->
          <span class="bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] px-2.5 py-0.8 rounded-full uppercase tracking-wide flex items-center gap-1.5 shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            {{ ticket.channel || 'WHATSAPP' }} ORIGIN
          </span>

          <!-- Customer Pill -->
          <span class="bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px] px-2.5 py-0.8 rounded-full shadow-2xs">
            {{ getCustomer(ticket.customerId).name || 'PT Astra' }}
          </span>
        </div>

        <!-- Action Buttons Right (Edit, Print, Aksi Lainnya) -->
        <div class="flex items-center gap-2 text-xs no-print">
          <!-- Edit Ticket Button -->
          <button
            @click="openEditModal"
            class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Edit detail tiket"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
            </svg>
            <span>Edit</span>
          </button>

          <!-- Print Ticket Button -->
          <button
            @click="printTicket"
            class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Cetak lembar detail tiket"
          >
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            <span>Print</span>
          </button>

          <!-- Aksi Lainnya Dropdown Menu -->
          <div class="relative" ref="moreActionsDropdownRef">
            <button
              @click="toggleMoreActions"
              class="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <span>Aksi Lainnya</span>
              <svg class="w-3.5 h-3.5 text-slate-500 transition-transform" :class="{ 'rotate-180': showMoreActions }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Dropdown Body -->
            <div 
              v-if="showMoreActions"
              class="absolute right-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 text-xs animate-in fade-in duration-100"
            >
              <!-- SLA Pause / Resume -->
              <button
                v-if="ticket.isPaused && canEngineerAct"
                @click="handleResumeSla(); showMoreActions = false"
                class="w-full text-left px-3.5 py-2 hover:bg-emerald-50 text-emerald-700 font-medium flex items-center space-x-2"
              >
                <span>&rtrif; Lanjutkan Jam SLA</span>
              </button>
              <button
                v-else-if="!ticket.isPaused && canEngineerAct && !['RESOLVED', 'CLOSED'].includes(ticket.status)"
                @click="openPauseModal(); showMoreActions = false"
                class="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-amber-800 font-medium flex items-center space-x-2"
              >
                <span>&#10074;&#10074; Tahan Jam SLA (Pause)</span>
              </button>

              <!-- Eskalasi Tiket -->
              <button
                v-if="canEngineerAct && !['RESOLVED', 'CLOSED'].includes(ticket.status)"
                @click="openEscalateModal(); showMoreActions = false"
                class="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-blue-700 font-medium flex items-center space-x-2"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                </svg>
                <span>Eskalasi ke Principal / PM</span>
              </button>

              <!-- Reassign Teknisi (Admin only) -->
              <button
                v-if="authStore.currentUser.roleCode === 'ADMIN' && ticket.status !== 'CLOSED'"
                @click="openAssignModal(); showMoreActions = false"
                class="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center space-x-2"
              >
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Reassign Teknisi</span>
              </button>

              <div class="my-1 border-t border-slate-100"></div>

              <!-- Salin Link Customer -->
              <button
                @click="handleCopyLink(); showMoreActions = false"
                class="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center space-x-2"
              >
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                <span>{{ copiedLink ? '✓ Link Tersalin!' : 'Bagikan Link Customer' }}</span>
              </button>

              <!-- Pratinjau Email Notif -->
              <button
                @click="showEmailPreviewModal = true; showMoreActions = false"
                class="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center space-x-2"
              >
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>Pratinjau Email Notifikasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Ticket Title (Large font) -->
      <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mt-1">
        {{ ticket.title }}
      </h1>

      <!-- Metadata Subtitle Row -->
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-sans">
        <span>Dibuat: <strong class="text-slate-700 font-semibold">{{ formatTime(ticket.createdAt).local }} WIB</strong></span>
        <span class="text-slate-300">•</span>
        <span>Updated: <strong class="text-slate-700 font-semibold">{{ formatTime(ticket.updatedAt).local }} WIB</strong></span>
        <span class="text-slate-300">•</span>
        <span>Dibuat oleh: <strong class="text-slate-700 font-semibold">{{ creatorName }}</strong></span>
        <span class="text-slate-300">•</span>
        <span>PIC: <strong class="text-slate-700 font-semibold">{{ picInfo.name }} ({{ picInfo.phone }})</strong></span>
      </div>
    </div>

    <!-- 2. FOUR TOP METRIC CARDS ROW (Point 5 Reference) -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Card 1: RESPONSE SLA -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">RESPONSE SLA</span>
            <span 
              class="font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs"
              :class="isResponseBreached ? 'bg-rose-100 text-rose-800 animate-pulse' 
                    : ticket.respondedAt ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-blue-50 text-blue-700'"
            >
              {{ isResponseBreached ? '✕ Breached' 
               : ticket.respondedAt ? '✓ Met' 
               : '⏱ Menunggu' }}
            </span>
          </div>
          <div class="text-[11px] text-slate-500 mt-1">
            Target: &le; {{ responseTargetText }}
          </div>
          <div class="text-2xl font-black text-slate-900 font-mono mt-1 flex items-baseline gap-1">
            <span>{{ formatClock(ticket.respondedAt || ticket.createdAt) }}</span>
            <span class="text-xs font-semibold text-slate-400">WIB</span>
          </div>
        </div>

        <div class="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
          <div class="font-medium text-slate-700">Waktu Respon: <strong class="text-slate-900 font-bold">{{ responseDurationText }}</strong></div>
          <div class="text-slate-400 truncate">
            Target: {{ formatClock(ticket.responseDeadline) }} WIB &bull; Respon: {{ formatClock(ticket.respondedAt || ticket.createdAt) }} WIB
          </div>
        </div>
      </div>

      <!-- Card 2: RESOLUTION SLA -->
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
            <span 
              class="text-[10px] font-bold font-mono"
              :class="isResolutionBreached || slaProgressPercent >= 90 ? 'text-rose-600' : slaProgressPercent >= 75 ? 'text-amber-700' : 'text-slate-500'"
            >{{ slaProgressPercent }}% berlalu</span>
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

        <div class="pt-2 mt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
          <div class="font-medium text-slate-700">Waktu Berjalan: <strong class="text-slate-900 font-bold">{{ elapsedTimeFormatted }}</strong></div>
          <div class="text-slate-400 truncate">
            Deadline: {{ formatClock(ticket.resolutionDeadline) }} WIB
          </div>
        </div>
      </div>

      <!-- Card 3: CUSTOMER & KONTRAK -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">CUSTOMER &amp; KONTRAK</span>
          <div class="font-black text-slate-900 text-sm truncate">
            {{ customerInfo.name }} ({{ customerInfo.code || 'AST' }})
          </div>
          <div class="text-[11px] text-slate-500 truncate mt-0.5">
            {{ customerInfo.contractName || 'PKS Layanan Managed Service 24x7' }}
          </div>
          <div class="mt-2">
            <span class="inline-block bg-blue-100 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
              {{ customerInfo.slaTier || '24x7 Mission Critical' }}
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

          <!-- 3 Quick Contact Icons -->
          <div class="flex items-center gap-1.5 shrink-0 no-print">
            <!-- Call Phone -->
            <a 
              :href="'tel:' + (picInfo.phoneClean || '081212010198')" 
              class="w-7 h-7 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-colors border border-slate-200"
              title="Panggil PIC via Telepon"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </a>

            <!-- WhatsApp Direct -->
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

            <!-- Mailto Email -->
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

      <!-- Card 4: INFORMASI SISTEM -->
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">INFORMASI SISTEM</span>
          <div class="space-y-1.5 text-xs">
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Kategori</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ categoryInfo.name || 'Server & Infrastruktur' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Affected System</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ ticket.affectedSystem || 'VMware Infrastructure' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Cluster / Host</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate font-mono text-[11px]">{{ ticket.cluster || 'PROD-CL01' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Impact Scope</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ ticket.impactScope || 'Standard Operational' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-32 shrink-0">Incident Source</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ ticket.incidentSource || (ticket.channel ? ticket.channel + ' Support' : 'WhatsApp Support') }}</strong>
            </div>
          </div>
        </div>

        <div class="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Env: {{ ticket.environment || 'PROD-DC-01' }}</span>
          <span class="text-blue-600 font-medium">Verified Active</span>
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

          <div class="text-[11px] text-slate-400 italic">
            Direct communication established with {{ picInfo.name }} via {{ ticket.channel || 'WhatsApp' }} ({{ formatTime(ticket.createdAt).local }} WIB).
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

            <!-- Add Diagnostic Step Button -->
            <button
              v-if="canEngineerAct && ticket.status !== 'CLOSED'"
              @click="openMilestoneModal"
              class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer no-print"
            >
              <span>+ Add Diagnostic Step</span>
            </button>
          </div>

          <!-- Chronological Step Items List -->
          <div class="relative pl-8 space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
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
                    <span class="font-bold text-slate-900 text-xs">{{ step.stepName }}</span>
                    <span 
                      class="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                      :class="getStatusBadgeClass(step.status)"
                    >
                      {{ step.status }}
                    </span>
                    <span 
                      v-if="step.progressPercent !== undefined"
                      class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono"
                    >
                      {{ step.progressPercent }}%
                    </span>
                  </div>

                  <!-- Clock timestamp -->
                  <div class="text-[11px] font-mono text-slate-400 flex items-center space-x-1 shrink-0">
                    <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{{ formatTime(step.timestampUtc).local }} WIB</span>
                  </div>
                </div>

                <!-- Actor name -->
                <div class="text-[11px] text-slate-500 font-medium">
                  {{ step.actorName }} ({{ step.actorRole }})
                </div>

                <!-- Notes / Description -->
                <p class="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                  {{ step.notes }}
                </p>

                <!-- Additional Notes (Optional) -->
                <div v-if="step.additionalNotes" class="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                  <span class="font-bold text-slate-700">Catatan Tambahan:</span> {{ step.additionalNotes }}
                </div>

                <!-- Attached File Pill & Download Action (Point 5 Reference) -->
                <div v-if="step.proofFile" class="pt-1.5 flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    @click="openAttachmentPreview(step.proofFile, 'Bukti Step ' + (index + 1))"
                    class="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono text-[11px] font-semibold transition-colors border border-slate-200 cursor-pointer"
                    title="Pratinjau berkas bukti"
                  >
                    <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <span>{{ step.proofFile }}</span>
                  </button>

                  <!-- Direct Download Button for Step Proof -->
                  <button
                    type="button"
                    @click="downloadAttachment(step.proofFile)"
                    class="inline-flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md border border-blue-200 font-mono text-[10px] font-bold transition-colors cursor-pointer"
                    title="Unduh berkas bukti ini"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3C. Side-by-side Analysis Cards (Root Cause & Resolution Strategy) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Left: Root Cause Identification -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <div class="flex items-center space-x-2 text-rose-700">
                  <svg class="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <h4 class="font-bold text-xs uppercase tracking-wider text-rose-800">Root Cause Identification</h4>
                </div>
                <span class="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                  CONFIRMED
                </span>
              </div>

              <p class="text-xs text-slate-700 leading-relaxed font-sans">
                {{ ticket.rootCause || 'Transient PCIe interconnect bus stall between Controller Node 0 and Node 1 triggered sudden failover while sync threshold sat at 88%, resulting in host path timeout prior to full NVRAM mirroring reconciliation.' }}
              </p>
            </div>

            <div class="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
              Classification: Hardware Bus &bull; Verified via HPE SP collects
            </div>
          </div>

          <!-- Right: Resolution Strategy & Implementation -->
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div class="space-y-2.5">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <div class="flex items-center space-x-2 text-emerald-700">
                  <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h4 class="font-bold text-xs uppercase tracking-wider text-emerald-800">Resolution Strategy &amp; Implementation</h4>
                </div>
                <span class="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                  COMPLETED
                </span>
              </div>

              <p class="text-xs text-slate-700 leading-relaxed font-sans">
                {{ ticket.resolutionStrategy || 'Rebalance FC host paths across Fabric 1, clear stalled cache unmap operations via HPE CLI command line, and trigger targeted rescan on ESXi host storage adapters to re-mount production datastore.' }}
              </p>
            </div>

            <div class="pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
              Resolved by: {{ getEngineerName(ticket.assignedToId) || 'Budi Santoso' }} &bull; Assisted by: Cisco TAC &bull; Duration: 45 menit
            </div>
          </div>
        </div>

        <!-- 3D. Berkas Lampiran & Bukti Digital Card -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                </svg>
                <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Berkas Lampiran &amp; Bukti Digital</h3>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">Lampiran dari customer maupun hasil troubleshooting.</p>
            </div>
            <span class="text-[10px] font-mono text-slate-500 font-bold">
              {{ allAttachments.length }} Berkas
            </span>
          </div>

          <!-- Attachments Row & Upload Dropzone -->
          <!-- Attachments Row & Upload Dropzone -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <!-- File Pills / Cards with Preview & Direct Download -->
            <div 
              v-for="att in allAttachments" 
              :key="att.id || att.name"
              class="p-2.5 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200 flex flex-col justify-between text-xs transition-all hover:shadow-2xs group"
            >
              <div class="flex items-start justify-between">
                <div 
                  @click="openAttachmentPreview(att.name, att.source)"
                  class="flex items-start space-x-2 min-w-0 cursor-pointer flex-1"
                  title="Klik untuk melihat pratinjau"
                >
                  <!-- Icon badge according to extension -->
                  <span 
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono shrink-0 shadow-2xs"
                    :class="att.name.endsWith('.pdf') ? 'bg-rose-100 text-rose-700' : (att.name.endsWith('.txt') || att.name.endsWith('.log') ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700')"
                  >
                    {{ att.name.endsWith('.pdf') ? 'PDF' : (att.name.endsWith('.txt') || att.name.endsWith('.log') ? 'TXT' : 'IMG') }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="font-bold text-slate-800 truncate font-mono text-[11px] group-hover:text-blue-600 transition-colors" :title="att.name">
                      {{ att.name }}
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ att.size || '12 KB' }}</div>
                  </div>
                </div>

                <!-- Direct Download Icon Button -->
                <button
                  type="button"
                  @click.stop="downloadAttachment(att.name)"
                  class="w-7 h-7 rounded-lg hover:bg-blue-100 text-slate-400 hover:text-blue-700 flex items-center justify-center transition-colors shrink-0 ml-1 cursor-pointer"
                  title="Unduh Berkas Ini"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </button>
              </div>

              <!-- Step Linking Badge or Action -->
              <div class="pt-2 mt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <button
                  v-if="isAttachmentLinkedToStep(att.source)"
                  type="button"
                  @click="scrollToStep(att.source)"
                  class="text-blue-600 hover:text-blue-800 font-semibold truncate hover:underline flex items-center gap-1 cursor-pointer text-left"
                  title="Klik untuk melihat tahapan ini pada timeline"
                >
                  <span>🔗</span>
                  <span class="truncate">{{ getStepShortName(att.source) }}</span>
                </button>
                <button
                  v-else
                  type="button"
                  @click="openLinkStepModal(att)"
                  class="text-slate-500 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer hover:underline"
                  title="Tautkan berkas ini ke tahapan timeline"
                >
                  <span>🔗</span>
                  <span>Tautkan ke Step</span>
                </button>
              </div>
            </div>

            <!-- Upload Box Dropzone -->
            <div 
              @click="openUploadAttachmentModal"
              class="p-2.5 bg-slate-50/60 hover:bg-blue-50/50 border border-dashed border-slate-300 hover:border-blue-400 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all no-print"
            >
              <svg class="w-5 h-5 text-blue-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <span class="text-[11px] font-bold text-blue-700">Upload Lampiran Lain</span>
              <span class="text-[9px] text-slate-400 mt-0.5">Tautkan ke Step / Umum</span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (4 of 12 cols) -->
      <div class="lg:col-span-4 space-y-5">
        <!-- 4A. Related Knowledge Base (Point 5 Reference) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Related Knowledge Base</h3>
            </div>
            <span class="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded shadow-2xs">
              {{ relatedKbArticles.length }} CASES FOUND
            </span>
          </div>

          <p class="text-[11px] text-slate-400 -mt-1">
            Case yang mirip berdasarkan judul, kategori, dan deskripsi.
          </p>

          <!-- KB Cards List -->
          <div class="space-y-3">
            <div 
              v-for="kb in relatedKbArticles" 
              :key="kb.id"
              class="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2 hover:border-slate-300 transition-all shadow-2xs"
            >
              <div class="flex items-start justify-between gap-1">
                <div class="font-bold text-slate-900 text-xs font-mono">
                  <span class="text-blue-700">{{ kb.kbCode }}</span>: {{ kb.title }}
                </div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0 border border-emerald-200/60 font-mono">
                  Similarity: {{ kb.similarity }}%
                </span>
              </div>

              <p class="text-[11px] text-slate-600 leading-relaxed font-sans line-clamp-2">
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

        <!-- 4B. Status Penanganan & Eskalasi (Point 5 Reference) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Status Penanganan &amp; Eskalasi</h3>
            </div>
            <span class="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded uppercase shadow-2xs">
              {{ hasPrincipalEscalation ? 'TERESKALASI' : 'INTERNAL NOC' }}
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Principal / Partner Vendor</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ ticket.principalVendor || 'Cisco TAC Global' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Nomor Kasus / Case ID</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-mono font-semibold truncate">{{ ticket.principalCaseId || '24325' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Spesialis Penanggung Jawab</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ ticket.principalSpecialist || 'Spesialis Support L3' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Status Eskalasi</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-blue-600 font-semibold truncate">{{ ticket.escalationTier || 'Principal Escalation' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Tanggal Eskalasi</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-slate-800 font-semibold truncate">{{ formatTime(ticket.escalatedAt || ticket.updatedAt).local }} WIB</strong>
            </div>
            <div class="flex items-start pt-1">
              <span class="text-slate-400 w-36 shrink-0">Catatan</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="text-slate-700 leading-snug">
                {{ ticket.principalLatestUpdate || 'Case successfully registered with Principal Support Desk.' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 4C. Assigned Engineer (Point 5 Reference) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Assigned Engineer</h4>
            <button
              v-if="authStore.currentUser.roleCode === 'ADMIN' && ticket.status !== 'CLOSED'"
              @click="openAssignModal"
              class="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
            >
              Reassign
            </button>
          </div>

          <!-- Avatar & Engineer Name -->
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
              {{ assignedEngineerInitials }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="font-black text-slate-900 text-sm truncate">{{ assignedEngineerName }}</div>
              <div class="text-[11px] text-slate-500 truncate">Senior Storage &amp; Infrastructure Engineer</div>
            </div>
          </div>

          <!-- Detailed Key-Values -->
          <div class="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
            <div class="flex items-start">
              <span class="text-slate-400 w-24 shrink-0">Supervisor</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-medium text-slate-800">Denny Wicaksono</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-24 shrink-0">Shift</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-mono text-slate-700 text-[11px]">Morning Tier-2 (08:00 - 17:00 WIB)</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-24 shrink-0">Email</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="text-blue-600 font-mono text-[11px] truncate">{{ assignedEngineerEmail }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-24 shrink-0">Telepon</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="text-slate-800 font-mono text-[11px]">{{ assignedEngineerPhone }}</span>
            </div>
          </div>
        </div>

        <!-- 4D. Case Closure Card (Point 5 Reference) -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3.5">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h4 class="font-bold text-slate-900 text-xs uppercase tracking-wider">Case Closure</h4>
            </div>

            <!-- Selesaikan Tiket Button -->
            <button
              v-if="ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && canEngineerAct"
              @click="openResolveModal"
              class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>✓ Selesaikan Tiket</span>
            </button>
          </div>

          <!-- Closure Metrics Key-Values -->
          <div class="space-y-2 text-xs">
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Final Status</span>
              <span class="text-slate-400 mx-1">:</span>
              <strong class="text-emerald-700 font-bold uppercase">{{ ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? ticket.status : 'Resolved' }}</strong>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Tanggal Penyelesaian</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-medium text-slate-800">{{ closureResolvedDateText }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Customer Confirmation</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-bold text-amber-700">Pending</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Total Durasi Troubleshooting</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="font-mono font-bold text-slate-800">{{ closureDurationText }}</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Response SLA</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="text-emerald-700 font-bold">✓ Met (12 menit)</span>
            </div>
            <div class="flex items-start">
              <span class="text-slate-400 w-36 shrink-0">Resolution SLA</span>
              <span class="text-slate-400 mx-1">:</span>
              <span class="text-emerald-700 font-bold">✓ Met (3.8 jam)</span>
            </div>
          </div>

          <!-- Checkbox: Jadikan sebagai kandidat KB -->
          <div class="pt-2.5 border-t border-slate-100">
            <label class="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                :checked="ticket.isProposeKb" 
                @change="handleToggleKbCandidate"
                class="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
              />
              <span class="font-medium">Jadikan sebagai kandidat KB</span>
            </label>
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
              placeholder="Initial Diagnosis" 
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
                    min="0" 
                    max="100" 
                    required 
                    class="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 font-mono text-center focus:ring-2 focus:ring-blue-500" 
                  />
                  <span class="absolute right-3 top-2 text-xs font-bold text-slate-400 font-mono">%</span>
                </div>

                <!-- Range Slider -->
                <div class="flex-1 px-1">
                  <input 
                    v-model.number="newMilestone.progressPercent"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <!-- Slider Marks -->
                  <div class="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span 
                      @click="newMilestone.progressPercent = 0" 
                      class="cursor-pointer hover:text-blue-600"
                      :class="newMilestone.progressPercent === 0 ? 'text-blue-600 font-bold' : ''"
                    >0%</span>
                    <span 
                      @click="newMilestone.progressPercent = 25" 
                      class="cursor-pointer hover:text-blue-600"
                      :class="newMilestone.progressPercent === 25 ? 'text-blue-600 font-bold' : ''"
                    >25%</span>
                    <span 
                      @click="newMilestone.progressPercent = 50" 
                      class="cursor-pointer hover:text-blue-600"
                      :class="newMilestone.progressPercent === 50 ? 'text-blue-600 font-bold' : ''"
                    >50%</span>
                    <span 
                      @click="newMilestone.progressPercent = 75" 
                      class="cursor-pointer hover:text-blue-600"
                      :class="newMilestone.progressPercent === 75 ? 'text-blue-600 font-bold' : ''"
                    >75%</span>
                    <span 
                      @click="newMilestone.progressPercent = 100" 
                      class="cursor-pointer hover:text-blue-600"
                      :class="newMilestone.progressPercent === 100 ? 'text-blue-600 font-bold' : ''"
                    >100%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Status Penanganan * -->
            <div>
              <label class="block font-bold text-slate-800 text-xs mb-1">
                Status Penanganan <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <select 
                  v-model="newMilestone.status" 
                  class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-semibold focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="IN_PROGRESS">&#9679; In Progress</option>
                  <option value="PENDING">&#9679; Pending (Part / Vendor / Client)</option>
                  <option value="ESCALATED">&#9679; Escalated (Principal TAC)</option>
                  <option value="RESOLVED">&#9679; Resolved (Terselesaikan)</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
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
              placeholder="Melakukan pengecekan konektivitas server dan status service.&#10;Hasil pengecekan:&#10;- Server tidak merespon ping&#10;- Layanan aplikasi tidak dapat diakses oleh user&#10;- Tidak ditemukan alert pada vCenter" 
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
                  Format: PNG, JPG, PDF, TXT, LOG (Maksimal 25MB per file)
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
              <select
                v-model="newMilestone.proofFile"
                class="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-mono"
              >
                <option value="">-- Tanpa Lampiran --</option>
                <option
                  v-for="att in allAttachments"
                  :key="att.id || att.name"
                  :value="att.name"
                >
                  📄 {{ att.name }} ({{ att.size || 'Berkas' }}) - {{ att.source || 'Tiket' }}
                </option>
              </select>
            </div>
          </div>

          <!-- 5. Catatan Tambahan (Opsional) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-slate-800 text-xs">
                Catatan Tambahan (Opsional)
              </label>
              <span class="text-[11px] font-mono text-slate-400">
                {{ (newMilestone.additionalNotes || '').length }}/1000
              </span>
            </div>
            <textarea 
              v-model="newMilestone.additionalNotes" 
              rows="2" 
              maxlength="1000"
              placeholder="Informasi tambahan, referensi, atau rencana tindak lanjut..." 
              class="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans focus:ring-2 focus:ring-blue-500 leading-relaxed placeholder:text-slate-400"
            ></textarea>
          </div>

          <!-- 6. Knowledge Base Auto-Sync Option (Sesuai MoM Point 7) -->
          <div class="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-start space-x-2.5">
            <input 
              v-model="newMilestone.syncToKb" 
              id="sync-kb-checkbox" 
              type="checkbox" 
              class="mt-0.5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
            />
            <label for="sync-kb-checkbox" class="text-xs text-slate-700 cursor-pointer select-none">
              <span class="font-bold text-indigo-900 block">Usulkan Catatan Troubleshooting ini ke Knowledge Base</span>
              <span class="text-[11px] text-slate-500">
                Otomatis mengonversi temuan diagnosa dan langkah perbaikan di atas menjadi draft Runbook/SOP agar dapat dijadikan solusi cepat untuk tiket serupa.
              </span>
            </label>
          </div>

          <!-- 7. Panduan Progress Penanganan (Blue Callout Box) -->
          <div class="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 space-y-3">
            <div class="flex items-start space-x-2">
              <div class="text-blue-600 font-bold text-xs mt-0.5">ⓘ</div>
              <div>
                <h5 class="font-bold text-slate-900 text-xs">Panduan Progress Penanganan</h5>
                <p class="text-[11px] text-slate-600 mt-0.5">
                  Gunakan milestone berikut sebagai acuan. Progress dapat disesuaikan dengan kondisi aktual.
                </p>
              </div>
            </div>

            <!-- Horizontal Stepper / Progress Track -->
            <div class="relative pt-2 pb-1 overflow-x-auto">
              <!-- Background Connecting Line -->
              <div class="absolute top-[17px] left-3 right-3 h-0.5 bg-blue-200 z-0"></div>
              
              <!-- Milestone Nodes -->
              <div class="relative z-10 flex justify-between min-w-[520px] text-center">
                <div 
                  v-for="m in progressMilestones" 
                  :key="m.percent"
                  @click="applyMilestoneFromGuide(m)"
                  class="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                >
                  <!-- Node Circle -->
                  <div 
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold shadow-xs transition-colors"
                    :class="newMilestone.progressPercent >= m.percent 
                      ? 'bg-blue-600 border-white text-white ring-2 ring-blue-400' 
                      : 'bg-white border-blue-300 text-blue-600 group-hover:border-blue-500'"
                  >
                    <span>&#9679;</span>
                  </div>

                  <!-- Percentage & Label -->
                  <span 
                    class="text-[10px] font-mono font-bold mt-1.5 transition-colors"
                    :class="newMilestone.progressPercent === m.percent ? 'text-blue-700 font-black' : 'text-slate-700'"
                  >
                    {{ m.percent }}%
                  </span>
                  <span 
                    class="text-[9px] font-medium leading-tight max-w-[65px] transition-colors"
                    :class="newMilestone.progressPercent === m.percent ? 'text-blue-700 font-bold' : 'text-slate-500'"
                  >
                    {{ m.label }}
                  </span>
                </div>
              </div>
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

    <!-- Modal: Upload Lampiran Berkas Tiket dengan Opsi Tautkan ke Step -->
    <div v-if="showUploadAttachmentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">📎</span>
            <h4 class="font-bold text-slate-900 text-sm">Unggah Berkas Lampiran Tiket</h4>
          </div>
          <button @click="showUploadAttachmentModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitUploadAttachment" class="space-y-3.5">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Pilih Berkas *</label>
            <input
              type="file"
              required
              accept=".pdf,.txt,.log,.png,.jpg,.jpeg,.doc,.docx"
              @change="handleManualAttachmentFileChange"
              class="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-semibold text-slate-700">Tautkan ke Tahapan Step Tiket (Opsional)</label>
              <span class="text-[10px] text-blue-600 font-semibold">Tautan Dua Arah</span>
            </div>
            <select
              v-model="newAttachmentForm.targetStepName"
              class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
            >
              <option value="">-- Umum (Tidak Terikat Step Tertentu) --</option>
              <option
                v-for="(st, idx) in timelineSteps"
                :key="st.id || idx"
                :value="st.stepName"
              >
                Step {{ idx + 1 }}: {{ st.stepName }} ({{ st.status }})
              </option>
            </select>
            <p class="text-[10px] text-slate-400 mt-1">
              Jika dipilih, berkas ini akan langsung tampil sebagai berkas bukti pada tahapan step yang dipilih di timeline.
            </p>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showUploadAttachmentModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer">Upload Berkas</button>
          </div>
        </form>
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
            <label class="block font-semibold text-slate-700 mb-1">Pilih Tahapan / Step Target *</label>
            <select v-model="selectedTargetStepName" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
              <option value="" disabled>-- Pilih Step --</option>
              <option
                v-for="(st, idx) in timelineSteps"
                :key="st.id || idx"
                :value="st.stepName"
              >
                Step {{ idx + 1 }}: {{ st.stepName }}
              </option>
            </select>
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
              <label class="block font-semibold text-slate-700 mb-1">Tingkat Severity *</label>
              <select v-model="editData.severity" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
                <option value="HIGH">HIGH (Kritis)</option>
                <option value="MEDIUM">MEDIUM (Sedang)</option>
                <option value="LOW">LOW (Rendah)</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kategori Sistem *</label>
              <select v-model="editData.categoryId" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
                <option v-for="cat in ticketStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Affected System</label>
              <input v-model="editData.affectedSystem" type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Cluster / Host</label>
              <input v-model="editData.cluster" type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Impact Scope</label>
            <input v-model="editData.impactScope" type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
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
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 space-y-4 text-xs animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
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
          <div>
            <h5 class="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">Gejala &amp; Ringkasan Kasus</h5>
            <p class="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{{ selectedKb.symptom }}</p>
          </div>

          <div v-if="selectedKb.rootCause">
            <h5 class="font-bold text-rose-800 uppercase tracking-wider text-[11px] mb-1">Akar Masalah (Root Cause)</h5>
            <p class="text-slate-700 leading-relaxed bg-rose-50/50 p-3 rounded-lg border border-rose-100">{{ selectedKb.rootCause }}</p>
          </div>

          <div v-if="selectedKb.cliSnippet">
            <div class="flex items-center justify-between mb-1">
              <h5 class="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Snippet Perintah / Panduan CLI</h5>
              <button 
                @click="copySnippet(selectedKb.cliSnippet)"
                class="text-[10px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {{ copiedSnippet ? '✓ Tersalin!' : 'Salin Snippet' }}
              </button>
            </div>
            <pre class="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">{{ selectedKb.cliSnippet }}</pre>
          </div>

          <div v-if="selectedKb.verificationSteps">
            <h5 class="font-bold text-emerald-800 uppercase tracking-wider text-[11px] mb-1">Langkah Verifikasi</h5>
            <p class="text-slate-700 leading-relaxed bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">{{ selectedKb.verificationSteps }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100">
          <div class="flex flex-wrap gap-1">
            <span v-for="tag in selectedKb.tags" :key="tag" class="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-mono">
              {{ tag }}
            </span>
          </div>

          <div class="flex space-x-2">
            <button @click="selectedKb = null" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Tutup</button>
            <button @click="applyKbSolution(selectedKb)" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer">
              Gunakan Solusi Ini
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 4: Pause SLA (Hold SLA) -->
    <div v-if="showPauseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Penahanan Waktu SLA (Hold SLA)</h4>
            <p class="text-[11px] text-slate-500">Timer Resolution SLA akan dibekukan sementara hingga status dilanjutkan.</p>
          </div>
          <button @click="showPauseModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
        </div>

        <form @submit.prevent="submitPauseSla" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Preset Alasan Penahanan (MoM) *</label>
            <select v-model="pauseData.pendingType" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
              <template v-if="ticketStore.holdReasons && ticketStore.holdReasons.length > 0">
                <option v-for="hr in ticketStore.holdReasons" :key="hr.code" :value="hr.code">
                  {{ hr.name }}
                </option>
              </template>
              <template v-else>
                <option value="PART_INDENT">1. Part Indent (Menunggu pengiriman suku cadang/hardware)</option>
                <option value="CUSTOMER">2. Menunggu Customer (Konfirmasi user/akses remote/maintenance window)</option>
                <option value="VENDOR">3. Dependensi Vendor / Partner / PM (Koordinasi pihak ketiga/lead)</option>
              </template>
            </select>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Rincian Keterangan *</label>
            <textarea v-model="pauseData.reason" required rows="2" placeholder="Sebutkan detail kebutuhan part, nomor PO, atau konfirmasi customer yang ditunggu..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nomor Kasus / RMA Principal (Opsional)</label>
            <input v-model="pauseData.principalCaseId" type="text" placeholder="Contoh: HPE-2026-004821 atau RMA-77412" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showPauseModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm cursor-pointer">Bekukan SLA</button>
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
            <label class="block font-semibold text-slate-700 mb-1">Tujuan Eskalasi *</label>
            <select v-model="escalateData.target" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
              <option value="VENDOR">Vendor / Principal TAC (L3 OEM Specialist)</option>
              <option value="PM">Project Manager (PM) - Koordinasi Scope &amp; Timeline</option>
              <option value="PARTNER">Mitra / Partner Implementasi</option>
              <option value="INTERNAL_L2">Internal Lead / Tier 2 Specialist</option>
            </select>
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

    <!-- Modal 6: Resolve Ticket -->
    <div v-if="showResolveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Penyelesaian Tiket Insiden (Resolve)</h4>
          <button @click="showResolveModal = false" class="text-slate-400 hover:text-slate-600 text-lg cursor-pointer">&times;</button>
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
            <button type="button" @click="showResolveModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 cursor-pointer">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm cursor-pointer">Selesaikan Tiket</button>
          </div>
        </form>
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
            <label class="block font-semibold text-slate-700 mb-1">Pilih Teknisi Penanggung Jawab *</label>
            <select v-model="selectedEngineerId" required class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
              <option v-for="u in engineers" :key="u.id" :value="u.id">
                {{ u.name }} ({{ u.roleTitle || 'Support Engineer' }})
              </option>
            </select>
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

    <!-- Modal 9: Email Notification Preview -->
    <EmailPreviewModal
      v-if="ticket"
      :is-open="showEmailPreviewModal"
      :ticket="ticket"
      :customer="customerInfo"
      :pic="picInfo"
      :engineer="{ name: assignedEngineerName }"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { api } from '../services/api';
import { formatUtcToLocal } from '../utils/dateFormatter';
import AttachmentPreviewModal from '../components/AttachmentPreviewModal.vue';
import EmailPreviewModal from '../components/EmailPreviewModal.vue';

const route = useRoute();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const ticketId = computed(() => Number(route.params.id));
const ticket = computed(() => ticketStore.tickets.find(t => t.id === ticketId.value));

// Modals and UI States
const showMilestoneModal = ref(false);
const showEditModal = ref(false);
const showPauseModal = ref(false);
const showEscalateModal = ref(false);
const showResolveModal = ref(false);
const showAssignModal = ref(false);
const showEmailPreviewModal = ref(false);
const showMoreActions = ref(false);
const moreActionsDropdownRef = ref(null);
const fileInputRef = ref(null);

const showUploadAttachmentModal = ref(false);
const showLinkStepModal = ref(false);
const targetAttachmentToLink = ref(null);
const selectedTargetStepName = ref('');
const highlightedStepIndex = ref(null);
const milestoneFileInputRef = ref(null);

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
  stepName: 'Initial Diagnosis',
  notes: 'Melakukan pengecekan konektivitas server dan status service.\nHasil pengecekan:\n- Server tidak merespon ping\n- Layanan aplikasi tidak dapat diakses oleh user\n- Tidak ditemukan alert pada vCenter',
  additionalNotes: '',
  progressPercent: 25,
  proofFile: 'ping-test-result.txt',
  fileSourceType: 'upload',
  selectedExistingFile: '',
  uploadedFileObj: null,
  fileSizeStr: '1.8 KB',
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

const handleDropFile = (e) => {
  isDraggingOver.value = false;
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    newMilestone.value.uploadedFileObj = file;
    newMilestone.value.proofFile = file.name;
    const sizeKb = Math.round(file.size / 1024);
    newMilestone.value.fileSizeStr = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';
  }
};

const editData = ref({
  title: '',
  description: '',
  severity: 'HIGH',
  categoryId: 1,
  affectedSystem: '',
  cluster: '',
  impactScope: ''
});

const pauseData = ref({
  pendingType: 'PART_INDENT',
  reason: '',
  principalCaseId: ''
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

// Helper lookups
const formatTime = (t) => formatUtcToLocal(t);
const formatClock = (utcDateString) => {
  if (!utcDateString) return '--:--';
  const d = new Date(utcDateString);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }).replace('.', ':');
};

const getCustomer = (id) => ticketStore.customers.find(c => c.id === id) || {};
const customerInfo = computed(() => {
  if (!ticket.value) return {};
  const c = getCustomer(ticket.value.customerId);
  return {
    name: c.name || 'PT Astra',
    code: c.code || 'AST',
    contractName: c.contractName || 'PKS Layanan Managed Service 24x7',
    slaTier: c.contractTier || '24x7 Mission Critical'
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

const categoryInfo = computed(() => {
  if (!ticket.value) return {};
  const cat = ticketStore.categories.find(c => c.id === ticket.value.categoryId);
  return cat || { name: 'Server & Infrastruktur' };
});

const creatorName = computed(() => {
  if (!ticket.value) return 'Ahmad Fauzi';
  const u = authStore.users.find(item => item.id === ticket.value.createdById);
  return u ? u.name : 'Ahmad Fauzi';
});

const assignedEngineerName = computed(() => {
  if (!ticket.value?.assignedToId) return 'Budi Santoso';
  const u = authStore.users.find(item => item.id === ticket.value.assignedToId);
  return u ? u.name : 'Budi Santoso';
});

const assignedEngineerInitials = computed(() => {
  const name = assignedEngineerName.value;
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
});

const assignedEngineerEmail = computed(() => {
  if (!ticket.value?.assignedToId) return 'budi.santoso@gtt.co.id';
  const u = authStore.users.find(item => item.id === ticket.value.assignedToId);
  return u?.email || 'budi.santoso@gtt.co.id';
});

const assignedEngineerPhone = computed(() => {
  if (!ticket.value?.assignedToId) return '081298765432';
  const u = authStore.users.find(item => item.id === ticket.value.assignedToId);
  return u?.phone || '081298765432';
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

onMounted(() => {
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
  return policies.find(p => p.tierCode === ticket.value.contractSla) || null;
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
  if (ticket.value.resolvedAt || ticket.value.status === 'RESOLVED') return 'SELESAI (BERHENTI)';
  if (ticket.value.status === 'CLOSED') return 'DITUTUP (BERHENTI)';
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
  if (ticket.value?.resolvedAt) {
    return formatTime(ticket.value.resolvedAt).local + ' WIB';
  }
  return '04 Okt 2026, 18.00 WIB';
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

// Diagnostic Timeline Steps (Point 5 Reference)
const timelineSteps = computed(() => {
  // If ticket has stored milestones and there are 3+, use them
  if (ticket.value?.milestones && ticket.value.milestones.length >= 4) {
    return ticket.value.milestones;
  }

  // Otherwise, provide the comprehensive 6-step diagnostic progression as per Point 5 Mockup!
  const customMilestones = ticket.value?.milestones || [];
  const baseSteps = [
    {
      id: 1,
      stepName: 'Laporan Diterima (Ticket Created)',
      status: 'OPEN',
      actorName: creatorName.value,
      actorRole: 'Admin',
      notes: `Tiket diterbitkan oleh ${creatorName.value}. Target respon: 30 menit.`,
      timestampUtc: '2026-10-04T07:25:45.000Z',
      proofFile: null
    },
    {
      id: 2,
      stepName: 'Penugasan Teknisi',
      status: 'ASSIGNED',
      actorName: assignedEngineerName.value,
      actorRole: 'Engineer',
      notes: `Tiket ditugaskan ke ${assignedEngineerName.value} untuk pengecekan awal.`,
      timestampUtc: '2026-10-04T07:37:12.000Z',
      proofFile: null
    },
    {
      id: 3,
      stepName: 'Pengecekan Awal',
      status: 'IN PROGRESS',
      actorName: assignedEngineerName.value,
      actorRole: 'Engineer',
      notes: 'Melakukan pengecekan koneksi ke server dan status layanan. Ditemukan server tidak merespon ping.',
      timestampUtc: '2026-10-04T07:50:33.000Z',
      proofFile: 'ping-test-result.txt'
    },
    {
      id: 4,
      stepName: 'Eskalasi ke Principal',
      status: 'ESCALATED',
      actorName: assignedEngineerName.value,
      actorRole: 'Engineer',
      notes: 'Dibuat case ke Cisco TAC Global. Case ID: 24325.',
      timestampUtc: '2026-10-04T08:35:10.000Z',
      proofFile: 'case-24325.pdf'
    },
    {
      id: 5,
      stepName: 'Root Cause Identified',
      status: 'UPDATE',
      actorName: 'Cisco TAC',
      actorRole: 'Principal',
      notes: 'Ditemukan transient PCIe interconnect bus stall.',
      timestampUtc: '2026-10-04T10:15:21.000Z',
      proofFile: 'tac-analysis.pdf'
    },
    {
      id: 6,
      stepName: 'Resolution Applied',
      status: 'RESOLVED',
      actorName: assignedEngineerName.value,
      actorRole: 'Engineer',
      notes: 'Rebalance FC host paths dan rescan storage. Layanan normal kembali.',
      timestampUtc: '2026-10-04T11:00:05.000Z',
      proofFile: 'resolution-steps.txt'
    }
  ];

  // If user has added new milestones beyond default count, append them
  if (customMilestones.length > 0) {
    const additional = customMilestones.filter(m => !baseSteps.some(b => b.stepName === m.stepName));
    return [...baseSteps, ...additional];
  }
  return baseSteps;
  return baseSteps;
});

// Attachments list (Point 5 Reference)
const allAttachments = computed(() => {
  const defaults = [
    { id: 'att-1', name: 'ping-test-result.txt', size: '12 KB', source: 'Troubleshooting Step 3' },
    { id: 'att-2', name: 'case-24325.pdf', size: '542 KB', source: 'Eskalasi Principal Cisco TAC' },
    { id: 'att-3', name: 'tac-analysis.pdf', size: '1.2 MB', source: 'Analisis Hardware Bus Cisco' },
    { id: 'att-4', name: 'resolution-steps.txt', size: '18 KB', source: 'Prosedur Rescan Storage' }
  ];

  const existing = ticket.value?.attachments || [];
  const merged = [...defaults];
  existing.forEach(att => {
    if (!merged.some(m => m.name === att.name)) {
      merged.push({
        id: att.id,
        name: att.name,
        size: att.size || '150 KB',
        source: att.source || 'Upload Lampiran'
      });
    }
  });
  return merged;
});

// Related Knowledge Base articles (Point 5 Reference)
const relatedKbArticles = computed(() => {
  return [
    {
      id: 12,
      kbCode: 'KB-00012',
      title: 'HPE 3PAR Datastore Unreachable',
      similarity: 92,
      symptom: 'Langkah-langkah pengecekan saat datastore pada HPE 3PAR tidak merespon koneksi FC fabric.',
      rootCause: 'Transient PCIe interconnect bus stall & dirty cache unmap queue congestion.',
      cliSnippet: `# Verifikasi controller node status\nshowsys -d\ncheckhealth -svc -detail\n\n# Rebalance FC paths\nservicenode start 0\nstatcmp -iter 5\nsetnode online 0`,
      verificationSteps: 'Pastikan seluruh Virtual Volumes melaporkan status Normal dan ESXi storage adapter Active.',
      tags: ['Storage', 'HPE', 'Datastore', 'Connectivity']
    },
    {
      id: 8,
      kbCode: 'KB-00008',
      title: 'VM Tidak Merespon di Cluster',
      similarity: 78,
      symptom: 'Panduan pengecekan status VM pada cluster vCenter saat host terindikasi path failover.',
      rootCause: 'Host storage adapter path timeout akibat burst traffic I/O sync.',
      cliSnippet: `# Cek status multipath pada ESXi host\nesxcli storage nmp device list\nesxcli storage core adapter rescan --all`,
      verificationSteps: 'Status VM kembali running tanpa storage freeze.',
      tags: ['VMware', 'vCenter', 'Cluster', 'VM']
    },
    {
      id: 5,
      kbCode: 'KB-00005',
      title: 'Network Timeout ke Server',
      similarity: 65,
      symptom: 'Troubleshooting koneksi jaringan dan routing packet loss ke gateway server produksi.',
      rootCause: 'Packet drop pada upstream port switch SAN Brocade.',
      cliSnippet: `sfpshow 1/14\nportstatsshow 1/14`,
      verificationSteps: 'Ping latency stabil < 1ms tanpa dropped frame.',
      tags: ['Network', 'Connectivity', 'Timeout']
    }
  ];
});

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
  switch (st) {
    case 'OPEN': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'ASSIGNED': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
    case 'IN PROGRESS':
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'ESCALATED':
    case 'PENDING_VENDOR': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'UPDATE': return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
    case 'RESOLVED': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'CLOSED': return 'bg-slate-200 text-slate-800 border border-slate-300';
    default: return 'bg-slate-100 text-slate-800';
  }
};

const getStatusDotClass = (st) => {
  switch (st) {
    case 'OPEN':
    case 'IN PROGRESS':
    case 'IN_PROGRESS': return 'bg-blue-600';
    case 'ASSIGNED': return 'bg-indigo-600';
    case 'ESCALATED':
    case 'PENDING_VENDOR': return 'bg-amber-500';
    case 'UPDATE': return 'bg-cyan-600';
    case 'RESOLVED': return 'bg-emerald-600';
    default: return 'bg-slate-500';
  }
};

const getTimelineNodeColor = (status, isLatest) => {
  if (status === 'RESOLVED') return 'bg-emerald-600 text-white';
  if (status === 'OPEN') return 'bg-blue-500 text-white';
  if (status === 'ASSIGNED') return 'bg-indigo-500 text-white';
  if (status === 'ESCALATED') return 'bg-amber-500 text-white';
  if (status === 'UPDATE') return 'bg-cyan-600 text-white';
  if (isLatest) return 'bg-blue-600 text-white ring-4 ring-blue-100';
  return 'bg-blue-600 text-white';
};

// Actions & Handlers
const openEditModal = () => {
  if (!ticket.value) return;
  editData.value = {
    title: ticket.value.title,
    description: ticket.value.description,
    severity: ticket.value.severity || 'HIGH',
    categoryId: ticket.value.categoryId || 1,
    affectedSystem: ticket.value.affectedSystem || 'VMware Infrastructure',
    cluster: ticket.value.cluster || 'PROD-CL01',
    impactScope: ticket.value.impactScope || 'Standard Operational'
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

const handleMilestoneFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newMilestone.value.uploadedFileObj = file;
  newMilestone.value.proofFile = file.name;
  const sizeKb = Math.round(file.size / 1024);
  newMilestone.value.fileSizeStr = sizeKb > 1024 ? (sizeKb / 1024).toFixed(1) + ' MB' : sizeKb + ' KB';
};

const removeMilestoneFile = () => {
  newMilestone.value.uploadedFileObj = null;
  newMilestone.value.proofFile = '';
  newMilestone.value.fileSizeStr = '';
  if (milestoneFileInputRef.value) milestoneFileInputRef.value.value = '';
};

const openMilestoneModal = () => {
  const currentProg = ticket.value?.progressPercent !== undefined ? ticket.value.progressPercent : 25;
  newMilestone.value = {
    stepName: currentProg >= 80 ? 'Resolution Applied' : (currentProg >= 40 ? 'Troubleshooting' : 'Initial Diagnosis'),
    notes: 'Melakukan pengecekan konektivitas server dan status service.\nHasil pengecekan:\n- Server tidak merespon ping\n- Layanan aplikasi tidak dapat diakses oleh user\n- Tidak ditemukan alert pada vCenter',
    additionalNotes: '',
    progressPercent: currentProg,
    status: ticket.value?.status === 'ESCALATED' ? 'ESCALATED' : 'IN_PROGRESS',
    proofFile: 'ping-test-result.txt',
    fileSourceType: 'upload',
    selectedExistingFile: '',
    uploadedFileObj: null,
    fileSizeStr: '1.8 KB',
    syncToKb: false
  };
  showMilestoneModal.value = true;
};

const submitMilestone = async () => {
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

  try {
    await api.addMilestone(ticket.value.id, {
      stepName: newMilestone.value.stepName,
      notes: newMilestone.value.notes,
      proofFile: finalProofFile
    });
  } catch (err) {
    console.warn('[TicketDetail] API milestone fallback:', err.message);
  }

  ticketStore.addProgressMilestone(
    ticket.value.id,
    {
      stepName: newMilestone.value.stepName,
      notes: newMilestone.value.notes,
      additionalNotes: newMilestone.value.additionalNotes,
      progressPercent: newMilestone.value.progressPercent,
      proofFile: finalProofFile,
      proofFileSize: finalFileSize,
      nextStatus: newMilestone.value.status || 'IN_PROGRESS',
      syncToKb: newMilestone.value.syncToKb
    },
    authStore.currentUser
  );

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

const handleManualAttachmentFileChange = (e) => {
  newAttachmentForm.value.fileObj = e.target.files[0] || null;
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
  pauseData.value = { pendingType: 'PART_INDENT', reason: '', principalCaseId: ticket.value?.principalCaseId || '' };
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
  showPauseModal.value = false;
};

const handleResumeSla = async () => {
  if (!ticket.value) return;
  try {
    await api.resumeSla(ticket.value.id);
  } catch (err) {
    console.warn('[TicketDetail] API resume fallback:', err.message);
  }
  ticketStore.resumeSla(ticket.value.id, authStore.currentUser);
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

const openResolveModal = () => {
  resolveData.value = {
    rootCause: ticket.value.rootCause || 'Transient PCIe interconnect bus stall between Controller Node 0 and Node 1 triggered sudden failover while sync threshold sat at 88%, resulting in host path timeout prior to full NVRAM mirroring reconciliation.',
    resolutionStrategy: ticket.value.resolutionStrategy || 'Rebalance FC host paths across Fabric 1, clear stalled cache unmap operations via HPE CLI command line, and trigger targeted rescan on ESXi host storage adapters to re-mount production datastore.',
    recommendation: ticket.value.recommendation || 'Upgrade firmware controller ke patch stabil dan lakukan inspeksi konektor berkala.'
  };
  showResolveModal.value = true;
};

const submitResolve = async () => {
  if (!ticket.value) return;
  try {
    await api.resolveTicket(ticket.value.id, resolveData.value);
  } catch (err) {
    console.warn('[TicketDetail] API resolve fallback:', err.message);
  }
  ticketStore.resolveTicket(ticket.value.id, resolveData.value, authStore.currentUser);
  showResolveModal.value = false;
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

const openAttachmentPreview = (fileName, source) => {
  selectedAttachment.value = {
    name: fileName,
    fileType: fileName.endsWith('.txt') || fileName.endsWith('.log') ? 'text/plain' : (fileName.endsWith('.pdf') ? 'application/pdf' : 'image/svg+xml'),
    source: source || 'Lampiran Bukti Troubleshooting'
  };
};

const downloadAttachment = (fileName) => {
  const name = fileName || 'lampiran.txt';
  let content = '';
  let mimeType = 'text/plain';

  if (name.endsWith('.txt') || name.endsWith('.log')) {
    mimeType = 'text/plain';
    if (name.includes('ping')) {
      content = `=== PING TEST DIAGNOSTIC RESULT ===
Target Host: 10.200.4.15 (PROD-STORAGE-NODE0)
Incident Ref: TICK-20261004-0005
Timestamp: 2026-10-04 14:50:33 WIB
Tested by: Budi Santoso (Senior Storage & Infrastructure Engineer)

PING 10.200.4.15 (10.200.4.15): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
Request timeout for icmp_seq 3

--- 10.200.4.15 ping statistics ---
4 packets transmitted, 0 packets received, 100.0% packet loss
Fault classification: Host port offline (Controller unmap queue stalled)`;
    } else if (name.includes('resolution')) {
      content = `=== RESOLUTION IMPLEMENTATION STEPS ===
Incident Ref: TICK-20261004-0005
Engineer: Budi Santoso (Senior Storage & Infrastructure Engineer)
Timestamp: 2026-10-04 18:00:05 WIB
Assisted by: Cisco TAC Global

1. Rebalance FC host paths across Fabric 1 switches.
2. Execute clear stalled cache unmap operations via HPE CLI command line:
   # servicenode start 0
   # statcmp -iter 5
   # setnode online 0
3. Trigger targeted rescan on ESXi host storage adapters:
   # esxcli storage core adapter rescan --all
4. Datastore LUN PROD-CL01 successfully remounted.
5. Production VM health check: All services verified NORMAL (0 packet loss, latency 1.2ms).`;
    } else {
      content = `[2026-10-04 14:25:12 WIB] Incident Telemetry Log: ${name}
Ref: TICK-20261004-0005
Engineer: Budi Santoso
Status: Captured & Verified.`;
    }
  } else if (name.endsWith('.pdf')) {
    content = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj\n4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n5 0 obj<</Length 220>>stream\nBT\n/F1 16 Tf\n50 780 Td\n(GTT Helpdesk Incident Telemetry - ${name}) Tj\n/F1 11 Tf\n0 -30 Td\n(Ticket: TICK-20261004-0005 | Case ID: 24325) Tj\n0 -20 Td\n(Principal Escalation: Cisco TAC Global) Tj\n0 -20 Td\n(Diagnostic analysis: Transient PCIe bus stall confirmed.) Tj\n0 -20 Td\n(Status: Technical resolution steps applied and verified.) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000056 00000 n \n0000000111 00000 n \n0000000212 00000 n \n0000000281 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n550\n%%EOF`;
    mimeType = 'application/pdf';
  } else {
    content = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#1e293b"/><text x="30" y="50" fill="#38bdf8" font-family="monospace" font-size="20" font-weight="bold">GTT HELPDESK ATTACHMENT</text><text x="30" y="90" fill="#94a3b8" font-family="monospace" font-size="14">File: ${name}</text><text x="30" y="120" fill="#94a3b8" font-family="monospace" font-size="14">Ticket: TICK-20261004-0005</text><text x="30" y="180" fill="#4ade80" font-family="monospace" font-size="16">VERIFIED DIGITAL EVIDENCE</text></svg>`;
    mimeType = 'image/svg+xml';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (!files || files.length === 0 || !ticket.value) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
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
  if (!ticket.value) return;
  ticketStore.updateTicketDetails(
    ticket.value.id,
    {
      rootCause: kb.rootCause || ticket.value.rootCause,
      resolutionStrategy: (kb.symptom ? kb.symptom + '\n\n' : '') + (kb.cliSnippet || '')
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
