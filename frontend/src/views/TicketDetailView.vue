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
          Tiket <strong>#{{ ticket?.ticketNumber }}</strong> saat ini berstatus antrean baru dan belum dialokasikan oleh petugas CPIG / Administrator.
        </span>
      </p>
      <p class="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
        Berdasarkan kebijakan operasional Helpdesk PT Global Transformasi Teknologi, wewenang penugasan teknisi sepenuhnya berada di bawah kendali petugas CPIG / Administrator TI. Teknisi hanya dapat mengakses tiket yang telah secara resmi didelegasikan kepada dirinya.
      </p>
    </div>
    <div class="pt-3">
      <router-link 
        to="/" 
        class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all text-xs inline-flex items-center space-x-2"
      >
        <span>&larr; Kembali ke Antrean Tiket Saya</span>
      </router-link>
    </div>
  </div>

  <div v-else-if="ticket" class="space-y-6">
    <!-- Top Bar: Navigation & Status Overview -->
    <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div class="flex items-center space-x-3">
          <router-link to="/" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </router-link>
          <div>
            <div class="flex items-center space-x-2">
              <span class="font-mono font-bold text-blue-700 text-lg">{{ ticket.ticketNumber }}</span>
              <span class="px-2.5 py-0.5 rounded-md text-xs font-bold" :class="getStatusBadge(ticket.status)">
                {{ ticket.status }}
              </span>
              <span class="px-2 py-0.5 rounded text-xs font-bold" :class="getSeverityBadge(ticket.severity)">
                {{ ticket.severity }}
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Dibuat: {{ formatTime(ticket.createdAt).local }} ({{ formatTime(ticket.createdAt).utc }}) via {{ ticket.channel }}
            </p>
          </div>
        </div>

        <!-- SLA Badges Container -->
        <div class="flex flex-wrap items-center gap-2">
          <SlaBadge 
            :deadlineUtc="ticket.responseDeadline" 
            :resolvedAtUtc="ticket.respondedAt"
            typeLabel="Response SLA"
          />
          <SlaBadge 
            :deadlineUtc="ticket.resolutionDeadline" 
            :isPaused="ticket.isPaused"
            :resolvedAtUtc="ticket.resolvedAt"
            typeLabel="Resolution SLA"
          />
        </div>
      </div>

      <!-- Action Toolbar (Role Contextual Actions) -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div class="flex items-center space-x-2 text-xs">
          <span class="text-slate-500 font-medium">Teknisi Bertugas:</span>
          <span class="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
            {{ ticket.assignedToId ? getEngineerName(ticket.assignedToId) : 'Belum Ditugaskan' }}
          </span>
          <button
            v-if="['CPIG', 'ADMIN'].includes(authStore.currentUser.roleCode) && ticket.status !== 'CLOSED'"
            @click="showAssignModal = true"
            class="text-blue-600 hover:text-blue-800 font-semibold underline ml-1"
          >
            {{ ticket.assignedToId ? 'Ganti Teknisi' : 'Tugaskan Teknisi' }}
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <!-- Button: Resume SLA (If Paused) -->
          <button
            v-if="ticket.isPaused && canEngineerAct"
            @click="resumeSla"
            class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center space-x-1"
          >
            <span>▶ Lanjutkan SLA Timer</span>
          </button>

          <!-- Button: Pause SLA (If In Progress) -->
          <button
            v-else-if="ticket.status === 'IN_PROGRESS' && canEngineerAct"
            @click="showPauseModal = true"
            class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center space-x-1"
          >
            <span>⏸ Tahan SLA (Pending Vendor/Customer)</span>
          </button>

          <!-- Button: Resolve Ticket -->
          <button
            v-if="['IN_PROGRESS', 'PENDING_VENDOR', 'PENDING_CUSTOMER', 'ASSIGNED'].includes(ticket.status) && canEngineerAct && ['ENGINEER', 'ADMIN'].includes(authStore.currentUser.roleCode)"
            @click="showResolveModal = true"
            class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all"
          >
            <span>✓ Selesaikan Masalah (RESOLVED)</span>
          </button>

          <!-- Button: Close Ticket (If Resolved) -->
          <button
            v-if="ticket.status === 'RESOLVED' && ['CPIG', 'ADMIN'].includes(authStore.currentUser.roleCode)"
            @click="showCloseModal = true"
            class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-sm transition-all"
          >
            <span>🔒 Konfirmasi & Tutup Tiket (CLOSED)</span>
          </button>

          <!-- Button: Submit to KB -->
          <button
            v-if="['RESOLVED', 'CLOSED'].includes(ticket.status)"
            @click="submitToKb"
            class="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-semibold rounded-lg transition-all"
          >
            <span>📚 Ajukan ke Knowledge Base</span>
          </button>

          <!-- Button: Email Notification Preview -->
          <button
            type="button"
            @click="showEmailPreviewModal = true"
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 font-semibold rounded-lg transition-all flex items-center space-x-1.5"
            title="Lihat contoh format email notifikasi resmi yang dikirimkan sistem"
          >
            <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span>Format Notifikasi Email</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Resolved Alert Banner (Auto-Close Policy 3x24 Hours) -->
    <div v-if="ticket.status === 'RESOLVED'" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start justify-between">
      <div class="space-y-1">
        <p class="font-bold flex items-center space-x-1.5">
          <span>✓ Tiket Berstatus RESOLVED (Perbaikan Teknis Selesai)</span>
        </p>
        <p class="text-emerald-700">
          Penghitungan <strong>Resolution SLA resmi dihentikan</strong> pada {{ formatTime(ticket.resolvedAt).local }}.
          Tiket memasuki masa tenggang <strong>72 jam (3x24 jam)</strong>. Jika tidak ada sanggahan dari customer, sistem otomatis menutup tiket menjadi <strong>CLOSED</strong>.
        </p>
      </div>
      <span class="bg-emerald-200/60 text-emerald-800 font-bold px-2.5 py-1 rounded">SLA Resolution Terpenuhi</span>
    </div>

    <!-- Main Content Layout (2 Columns) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: Customer & Problem Details -->
      <div class="space-y-6 lg:col-span-1">
        <!-- Customer Info Card -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Informasi Customer</h3>
          <div class="space-y-2 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Nama Perusahaan</span>
              <span class="font-bold text-slate-800 text-sm">{{ getCustomer(ticket.customerId).name }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Perjanjian Kerjasama (PKS)</span>
              <span class="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] block mt-0.5">
                {{ getCustomer(ticket.customerId).serviceContract || 'PKS Pemeliharaan Layanan 24x7' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Ketentuan Target SLA (Berdasarkan Severity)</span>
              <div class="mt-0.5 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-semibold" :class="getSeverityBadge(ticket.severity)">
                <span>Kasus {{ ticket.severity }}:</span>
                <span v-if="ticket.severity === 'HIGH'">Target Respon &le; 30 Menit • Resolusi &le; 4 Jam</span>
                <span v-else-if="ticket.severity === 'MEDIUM'">Target Respon &le; 1 Jam • Resolusi &le; 8 Jam</span>
                <span v-else>Target Respon &le; 2 Jam • Resolusi &le; 24 Jam</span>
              </div>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">PIC Pelapor</span>
              <span class="font-medium text-slate-800 block">{{ getPic(ticket.customerId, ticket.customerPicId).name }}</span>
              <span class="text-slate-500 text-[11px]">{{ getPic(ticket.customerId, ticket.customerPicId).phone }} • {{ getPic(ticket.customerId, ticket.customerPicId).dept }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Alamat Instalasi</span>
              <span class="text-slate-600 text-[11px]">{{ getCustomer(ticket.customerId).address }}</span>
            </div>
            <div class="pt-2 border-t border-slate-100">
              <router-link
                :to="`/track/${ticket.ticketNumber}?token=${ticket.trackingToken}`"
                target="_blank"
                class="text-[11px] text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1 font-semibold"
                title="Buka halaman yang dilihat pelanggan saat mengklik tombol di email resmi"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                <span>Buka Pelacakan Mandiri Customer (Tampilan Asli Email) &rarr;</span>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Issue Details Card -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <h3 class="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Rincian Permasalahan</h3>
          <div class="space-y-3 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Judul Tiket</span>
              <p class="font-bold text-slate-900 text-sm mt-0.5">{{ ticket.title }}</p>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Kategori</span>
              <span class="font-medium text-slate-800">{{ getCategory(ticket.categoryId).name }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Deskripsi Gejala</span>
              <p class="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-line mt-1">
                {{ ticket.description }}
              </p>
            </div>
            <!-- Raw Message Chat (If Available) -->
            <div v-if="ticket.rawMessage">
              <span class="text-slate-400 block text-[11px]">Pesan Asli Customer (WhatsApp/Email):</span>
              <p class="text-slate-500 italic text-[11px] bg-slate-50 p-2 rounded border border-slate-100 font-mono mt-1">
                "{{ ticket.rawMessage }}"
              </p>
            </div>
            <!-- Vendor Case ID (If Available) -->
            <div v-if="ticket.principalCaseId" class="pt-2 border-t border-slate-100">
              <span class="text-slate-400 block text-[11px]">Vendor / Principal Case ID:</span>
              <span class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs mt-1 inline-block">
                {{ ticket.principalCaseId }}
              </span>
            </div>
          </div>
        </div>

        <!-- Digital Attachments & Evidence Card -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div class="flex items-center justify-between gap-3 pb-0.5">
            <div class="flex items-center space-x-2 min-w-0">
              <h3 class="font-bold text-slate-700 text-xs uppercase tracking-wider truncate">
                Berkas Lampiran
              </h3>
              <span class="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full text-[10px] border border-blue-200 shrink-0">
                {{ (ticket.attachments || []).length }}
              </span>
            </div>
            <button
              v-if="canUploadAttachment"
              type="button"
              @click="$refs.attFileInput.click()"
              class="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 shrink-0 ml-auto"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>+ Unggah</span>
            </button>
            <input 
              ref="attFileInput" 
              type="file" 
              class="hidden" 
              @change="handleQuickUpload" 
            />
          </div>

          <!-- Attachment Items -->
          <div v-if="(ticket.attachments || []).length > 0" class="space-y-2">
            <div
              v-for="att in ticket.attachments"
              :key="att.id"
              class="p-2.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/20 transition-all flex items-start justify-between gap-2"
            >
              <div class="flex items-start space-x-2.5 overflow-hidden">
                <!-- Icon based on type -->
                <div class="w-8 h-8 rounded-lg bg-blue-100/70 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <svg v-if="att.fileType?.includes('text') || att.name?.endsWith('.txt') || att.name?.endsWith('.log')" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>

                <div class="overflow-hidden space-y-0.5">
                  <p class="font-bold text-xs text-slate-800 truncate" :title="att.originalName || att.name">
                    {{ att.originalName || att.name }}
                  </p>
                  <div class="text-[10px] text-slate-500 flex flex-wrap items-center gap-1">
                    <span class="font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                      {{ att.source || 'Bukti Digital' }}
                    </span>
                    <span>•</span>
                    <span>{{ att.size || '140 KB' }}</span>
                  </div>
                  <p class="text-[10px] text-slate-400">
                    {{ att.uploadedBy ? att.uploadedBy : '' }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  @click="openPreview(att)"
                  title="Lihat Pratinjau Berkas"
                  class="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg shadow-sm transition-all flex items-center space-x-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <span>Lihat</span>
                </button>
                <a
                  :href="getDownloadSrc(att.name)"
                  download
                  title="Unduh Berkas"
                  class="p-1 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-5 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p class="text-xs text-slate-500">Belum ada berkas lampiran pada tiket ini.</p>
            <button
              v-if="canUploadAttachment"
              @click="$refs.attFileInput.click()"
              class="mt-2 text-xs font-semibold text-blue-600 hover:underline"
            >
              + Unggah Berkas Pertama
            </button>
          </div>
        </div>

        <!-- Resolution Summary Card (If Resolved/Closed) -->
        <div v-if="ticket.rootCause" class="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 shadow-sm space-y-3">
          <h3 class="font-bold text-emerald-900 text-xs uppercase tracking-wider">Dokumentasi Solusi Final</h3>
          <div class="space-y-2 text-xs text-slate-800">
            <div>
              <span class="text-emerald-700 font-bold block text-[11px]">Akar Masalah (Root Cause):</span>
              <p class="text-slate-700">{{ ticket.rootCause }}</p>
            </div>
            <div>
              <span class="text-emerald-700 font-bold block text-[11px]">Tindakan Perbaikan (Action Taken):</span>
              <p class="text-slate-700">{{ ticket.actionTaken }}</p>
            </div>
            <div v-if="ticket.recommendation">
              <span class="text-emerald-700 font-bold block text-[11px]">Rekomendasi Preventif:</span>
              <p class="text-slate-700">{{ ticket.recommendation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Milestone Tracking (Stepped Milestones) -->
      <div class="lg:col-span-2">
        <MilestoneStepper :ticket="ticket" />
      </div>
    </div>

    <!-- Modal 1: Assign Engineer -->
    <div v-if="showAssignModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs">
        <h4 class="font-bold text-slate-900 text-sm">Tugaskan Tiket ke Teknisi</h4>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Pilih Engineer Tersedia</label>
          <select v-model="selectedEngineerId" class="w-full p-2 border border-slate-200 rounded-lg bg-white">
            <option v-for="eng in availableEngineers" :key="eng.id" :value="eng.id">
              {{ eng.name }} ({{ eng.roleCode }})
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button @click="showAssignModal = false" class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
          <button @click="confirmAssign" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg">Tugaskan</button>
        </div>
      </div>
    </div>

    <!-- Modal 2: Pause SLA -->
    <div v-if="showPauseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
        <h4 class="font-bold text-slate-900 text-sm">Tahan Timer SLA (Pause SLA)</h4>
        <p class="text-slate-500">Timer Resolution SLA akan dibekukan sementara agar KPI teknisi tidak terpotong saat menunggu pihak eksternal.</p>
        
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Alasan Penahanan SLA *</label>
          <select v-model="pauseForm.pendingType" class="w-full p-2 border border-slate-200 rounded-lg bg-white">
            <option value="VENDOR">Menunggu Pihak Ketiga / Principal (Cisco/Mikrotik/Server)</option>
            <option value="CUSTOMER">Menunggu Respon / Data Tambahan dari PIC Customer</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Keterangan Tambahan *</label>
          <textarea v-model="pauseForm.reason" rows="2" placeholder="Contoh: Menunggu kiriman sparepart kartu SFP dari vendor..." class="w-full p-2 border border-slate-200 rounded-lg"></textarea>
        </div>

        <div v-if="pauseForm.pendingType === 'VENDOR'">
          <label class="block font-semibold text-slate-700 mb-1">Nomor Case Principal (Opsional)</label>
          <input v-model="pauseForm.principalCaseId" type="text" placeholder="Contoh: TAC-2026-9921" class="w-full p-2 border border-slate-200 rounded-lg" />
        </div>

        <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button @click="showPauseModal = false" class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
          <button @click="confirmPause" class="px-4 py-1.5 bg-amber-600 text-white font-bold rounded-lg">Tahan SLA Sekarang</button>
        </div>
      </div>
    </div>

    <!-- Modal 3: Resolve Ticket -->
    <div v-if="showResolveModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs">
        <h4 class="font-bold text-slate-900 text-sm">Formulir Penyelesaian Tiket (RESOLVED)</h4>
        <p class="text-slate-500">Mencatat solusi teknis secara lengkap. Timer Resolution SLA akan berhenti otomatis.</p>
        
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Akar Masalah (Root Cause) *</label>
          <textarea v-model="resolveForm.rootCause" required rows="2" placeholder="Penyebab utama gangguan..." class="w-full p-2 border border-slate-200 rounded-lg"></textarea>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Tindakan Perbaikan (Action Taken) *</label>
          <textarea v-model="resolveForm.actionTaken" required rows="2" placeholder="Langkah teknis yang telah dijalankan..." class="w-full p-2 border border-slate-200 rounded-lg"></textarea>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Catatan Hasil Pengujian *</label>
          <input v-model="resolveForm.resolutionNotes" required type="text" placeholder="Contoh: Layanan kembali normal, ping 0% RTO." class="w-full p-2 border border-slate-200 rounded-lg" />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Rekomendasi Preventif (Opsional)</label>
          <input v-model="resolveForm.recommendation" type="text" placeholder="Saran pemeliharaan agar isu serupa tidak berulang..." class="w-full p-2 border border-slate-200 rounded-lg" />
        </div>

        <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button @click="showResolveModal = false" class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
          <button @click="confirmResolve" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg">Simpan & Selesaikan</button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Close Ticket -->
    <div v-if="showCloseModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs">
        <h4 class="font-bold text-slate-900 text-sm">Tutup Tiket (CLOSED)</h4>
        <p class="text-slate-500">Tiket akan ditutup secara permanen dan diarsipkan ke histori sistem.</p>
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Catatan Konfirmasi Penutupan</label>
          <input v-model="closeReason" type="text" placeholder="Contoh: Customer konfirmasi via WhatsApp sudah aman" class="w-full p-2 border border-slate-200 rounded-lg" />
        </div>
        <div class="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button @click="showCloseModal = false" class="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
          <button @click="confirmClose" class="px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg">Tutup Tiket Sekarang</button>
        </div>
      </div>
    </div>

    <!-- Modal 5: Attachment Preview Lightbox / Console Viewer -->
    <AttachmentPreviewModal 
      v-if="previewModalFile" 
      :file="previewModalFile" 
      :ticket-number="ticket.ticketNumber" 
      @close="previewModalFile = null" 
    />

    <!-- Modal 6: Email Notification Preview -->
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

  <!-- 404 Fallback State When Ticket ID Not Found in URL -->
  <div v-else class="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-4">
    <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-xl font-bold">
      ?
    </div>
    <div class="space-y-1">
      <h2 class="font-bold text-slate-900 text-base">Tiket Tidak Ditemukan (#{{ route.params.id }})</h2>
      <p class="text-xs text-slate-500">ID tiket tersebut tidak terdaftar pada database sistem atau URL salah.</p>
    </div>
    <router-link to="/" class="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm">
      &larr; Kembali ke Dashboard Tiket
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { formatUtcToLocal } from '../utils/dateFormatter';
import SlaBadge from '../components/SlaBadge.vue';
import MilestoneStepper from '../components/MilestoneStepper.vue';
import AttachmentPreviewModal from '../components/AttachmentPreviewModal.vue';
import EmailPreviewModal from '../components/EmailPreviewModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const ticketId = computed(() => Number(route.params.id));
const ticket = computed(() => ticketStore.tickets.find(t => t.id === ticketId.value));

const isEngineerForbidden = computed(() => {
  if (!ticket.value) return false;
  if (authStore.currentUser.roleCode === 'ENGINEER') {
    // Sesuai SOP GTT: Penugasan ditentukan oleh CPIG/Admin.
    // Teknisi hanya diizinkan mengakses tiket yang secara resmi ditugaskan kepada dirinya.
    return ticket.value.assignedToId !== authStore.currentUser.id;
  }
  return false;
});

const canEngineerAct = computed(() => {
  const role = authStore.currentUser.roleCode;
  if (['ADMIN', 'CPIG'].includes(role)) return true;
  if (role === 'ENGINEER') {
    return ticket.value && ticket.value.assignedToId === authStore.currentUser.id;
  }
  return false;
});

const formatTime = (t) => formatUtcToLocal(t);

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

const availableEngineers = computed(() => {
  return authStore.users.filter(u => u.roleCode === 'ENGINEER');
});

// Modals State
const showAssignModal = ref(false);
const selectedEngineerId = ref(3);

const showPauseModal = ref(false);
const pauseForm = ref({
  pendingType: 'VENDOR',
  reason: '',
  principalCaseId: ''
});

const showResolveModal = ref(false);
const resolveForm = ref({
  rootCause: 'Kerusakan pada optic transceiver SFP port uplink switch.',
  actionTaken: 'Melakukan penggantian module optic baru dan verifikasi link rate 10 Gbps.',
  resolutionNotes: 'Layanan core network kembali normal 100%.',
  recommendation: 'Jadwalkan pembersihan debu fiber optic secara berkala tiap 3 bulan.'
});

const showCloseModal = ref(false);
const closeReason = ref('Customer konfirmasi layanan sudah stabil.');

const confirmAssign = () => {
  ticketStore.assignEngineer(ticket.value.id, selectedEngineerId.value, authStore.currentUser);
  showAssignModal.value = false;
};

const confirmPause = () => {
  ticketStore.pauseSla(ticket.value.id, pauseForm.value, authStore.currentUser);
  showPauseModal.value = false;
};

const resumeSla = () => {
  ticketStore.resumeSla(ticket.value.id, authStore.currentUser);
};

const confirmResolve = () => {
  ticketStore.resolveTicket(ticket.value.id, resolveForm.value, authStore.currentUser);
  showResolveModal.value = false;
};

const confirmClose = () => {
  ticketStore.closeTicket(ticket.value.id, closeReason.value, authStore.currentUser);
  showCloseModal.value = false;
};

const submitToKb = () => {
  const kb = ticketStore.submitTicketToKb(ticket.value.id, authStore.currentUser);
  if (kb) {
    alert(`Tiket ${ticket.value.ticketNumber} berhasil diajukan sebagai kandidat Knowledge Base (Status: DRAFT). Menunggu persetujuan Admin/Lead.`);
    router.push('/knowledge-base');
  }
};

// Email Notification Preview State
const showEmailPreviewModal = ref(false);

// Attachments & Preview State
const previewModalFile = ref(null);

const canUploadAttachment = computed(() => {
  return ['CPIG', 'ENGINEER', 'ADMIN'].includes(authStore.currentUser.roleCode);
});

const openPreview = (att) => {
  previewModalFile.value = att;
};

const getDownloadSrc = (fileName) => {
  const name = (fileName || '').toLowerCase();
  if (name.includes('whatsapp') || name.includes('chat')) {
    return '/mock-attachments/whatsapp-chat-kendala.svg';
  }
  if (name.includes('502') || name.includes('gateway') || name.includes('siloam')) {
    return '/mock-attachments/error-502-bad-gateway.svg';
  }
  if (name.includes('cisco') || name.includes('tac')) {
    return '/mock-attachments/cisco-tac-ticket-confirmation.svg';
  }
  if (name.includes('ping') || name.includes('http')) {
    return '/mock-attachments/ping-http200-proof.svg';
  }
  if (name.endsWith('.txt') || name.endsWith('.log')) {
    return '/mock-attachments/kvm-console-error-log.txt';
  }
  return '/gtt-logo.png';
};

const handleQuickUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  ticketStore.addAttachment(ticket.value.id, {
    fileName: file.name,
    fileType: file.type || 'image/png',
    size: `${Math.round(file.size / 1024) || 120} KB`,
    source: 'Dokumen Tambahan Lapangan'
  }, authStore.currentUser);

  e.target.value = '';
};
</script>
