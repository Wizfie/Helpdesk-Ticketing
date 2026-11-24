<template>
  <div class="space-y-6">
    <!-- Top Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link to="/tickets" class="hover:text-blue-600 transition-colors">Tickets</router-link>
          <span>/</span>
          <span class="text-slate-800">Incident Intake</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">
          Buat Tiket Layanan Baru
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Penerbitan tiket gangguan operasional dengan penghitungan SLA terotomasi berbasis kontrak mitra.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <router-link
          to="/tickets"
          class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs flex items-center space-x-1.5"
        >
          <span>&larr; Kembali ke Daftar Tiket</span>
        </router-link>
      </div>
    </div>

    <!-- Main Layout: Form (Left 8 Cols) & SLA / KB Guidance (Right 4 Cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left 8 Columns: 3-Step Guided Intake Form -->
      <form @submit.prevent="handleSubmitTicket" class="lg:col-span-8 space-y-6">
        
        <!-- STEP 01: Informasi Tiket & Customer -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs relative z-30">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 rounded-t-2xl flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                01
              </span>
              <div>
                <h2 class="text-sm font-bold text-slate-900">Informasi Tiket &amp; Customer</h2>
                <p class="text-[11px] text-slate-500">Pilih jenis tiket, entitas customer, dan kategori masalah.</p>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-5 text-xs">
            <!-- Row 1: Jenis Tiket & Customer Selector -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-30">
              <!-- Jenis Tiket with Custom Manage Action -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="font-bold text-slate-700">Jenis Tiket *</label>
                  <button 
                    type="button" 
                    @click="showTicketTypeModal = true" 
                    class="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                  >
                    <span>+ Kelola Jenis</span>
                  </button>
                </div>
                <BaseSelect
                  v-model="form.ticketType"
                  :options="ticketTypeOptions"
                  placeholder="Pilih jenis tiket..."
                  required
                />
              </div>

              <!-- Customer Selector (Includes inactive customers soft-deleted) -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="font-bold text-slate-700">Customer / Perusahaan Klien *</label>
                </div>
                <BaseSelect
                  v-model="form.customerId"
                  :options="customerOptions"
                  placeholder="-- Pilih Entitas Customer --"
                  required
                  searchable
                  @change="handleCustomerChange"
                />
              </div>
            </div>

            <!-- Inactive Customer Warning Banner (Soft Delete Indicator) -->
            <div v-if="selectedCustomer && selectedCustomer.isActive === false" class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-2.5 text-xs">
              <svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div class="leading-relaxed">
                <span class="font-bold">Perhatian Akun Nonaktif:</span> Customer ini tercatat berstatus <strong class="underline font-bold text-rose-700">NONAKTIF</strong> (arsip). Anda tetap dapat menerbitkan tiket untuk penyelesaian historis atau transisi kontrak.
              </div>
            </div>

            <!-- Live Contract SLA & Quota Badge -->
            <div v-if="selectedCustomer" class="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span class="font-mono font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                  KONTRAK SLA: {{ selectedCustomer.contractSla || selectedCustomer.slaTier || '-' }}
                </span>
                <span v-if="selectedCustomer.slaTier && selectedCustomer.slaTier !== selectedCustomer.contractSla" class="bg-blue-200/80 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {{ selectedCustomer.slaTier }}
                </span>
              </div>
              <div class="flex items-center space-x-3 text-[11px]">
                <div v-if="selectedCustomer.slaCoverage" class="font-medium text-blue-800">
                  {{ selectedCustomer.slaCoverage }}
                </div>
                <div class="flex items-center space-x-1.5 pl-2 border-l border-blue-200">
                  <span class="text-slate-500 font-semibold">Sisa Kuota:</span>
                  <span v-if="customerQuotaInfo.quota === 'Unlimited'" class="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white text-slate-700 border border-slate-200">
                    Unlimited
                  </span>
                  <span v-else class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border" :class="[
                    customerQuotaInfo.isCritical ? 'bg-rose-100 text-rose-800 border-rose-300' :
                    customerQuotaInfo.isNearLimit ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border-emerald-300'
                  ]">
                    {{ customerQuotaInfo.remaining }} Tiket
                    <span v-if="customerQuotaInfo.percentage !== null" class="font-normal opacity-85 ml-1">
                      ({{ customerQuotaInfo.percentage }}%)
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Quota Exhausted Warning Alert (Peringatan & Penguncian Kuota Habis) -->
            <div v-if="isQuotaExhausted" class="p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-start space-x-3 text-rose-900 text-xs animate-in fade-in duration-200">
              <div class="w-6 h-6 rounded-lg bg-rose-200 text-rose-700 flex items-center justify-center shrink-0 font-bold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div class="space-y-0.5">
                <div class="font-bold text-rose-800 text-[11px] uppercase tracking-wider">Peringatan: Kuota Tiket Pelanggan Telah Habis</div>
                <p class="text-[11px] text-rose-700 leading-relaxed">
                  Mitra <strong>{{ selectedCustomer.name }}</strong> telah kehabisan alokasi kuota tiket insiden (<strong>sisa 0 tiket / {{ customerQuotaInfo.used }} insiden tercatat</strong>). Penerbitan tiket baru dinonaktifkan sampai kuota ditambah melalui menu <em>Manajemen Pelanggan</em>.
                </p>
              </div>
            </div>

            <!-- Quota Critical Warning Alert (Sesuai TC-05 Laporan Bab 3: Sisa kuota hampir habis <= 10%) -->
            <div v-else-if="customerQuotaInfo.isCritical" class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start space-x-3 text-amber-900 dark:text-amber-200 text-xs animate-in fade-in duration-200">
              <div class="w-6 h-6 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 font-bold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <div class="space-y-0.5">
                <div class="font-bold text-amber-800 dark:text-amber-300 text-[11px] uppercase tracking-wider">Perhatian: Alokasi Kuota Tiket Hampir Habis</div>
                <p class="text-[11px] text-amber-700 dark:text-amber-300/90 leading-relaxed">
                  Sisa kuota insiden untuk mitra <strong>{{ selectedCustomer.name }}</strong> tinggal <strong>{{ customerQuotaInfo.remaining }} tiket ({{ customerQuotaInfo.percentage }}%)</strong>. Segera persiapkan penambahan kuota kontrak melalui menu <em>Kelola Customer</em>.
                </p>
              </div>
            </div>

            <!-- Row 2: PIC Pelapor & Kategori Masalah -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-20">
              <!-- PIC Pelapor -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="font-bold text-slate-700">PIC Pelapor (Kontak Klien) *</label>
                  <div v-if="selectedPic" class="flex items-center space-x-1.5">
                    <a 
                      v-if="selectedPic.phone" 
                      :href="`https://wa.me/${cleanPhoneForWa(selectedPic.phone)}`" 
                      target="_blank" 
                      title="Chat WhatsApp PIC"
                      class="p-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <BaseSelect 
                  v-model="form.customerPicId" 
                  :options="customerPicOptions"
                  placeholder="-- Pilih PIC Pelapor --"
                  required
                  :disabled="!form.customerId || customerPicOptions.length === 0"
                />
              </div>

              <!-- Kategori Masalah -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="font-bold text-slate-700">Kategori Masalah *</label>
                  <button 
                    type="button" 
                    @click="openAddCategoryModal" 
                    class="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center space-x-1 transition-colors"
                  >
                    <span>+ Kategori Baru</span>
                  </button>
                </div>
                <BaseSelect 
                  v-model="form.categoryId" 
                  :options="categoryOptions"
                  placeholder="-- Pilih Kategori Masalah --"
                  required 
                  searchable
                  @change="onCategorySelectChange"
                />
                <div v-if="selectedCategoryDesc" class="text-[10px] text-slate-500 mt-1 truncate">
                  {{ selectedCategoryDesc }}
                </div>
              </div>
            </div>

            <!-- Row 3: Waktu Kejadian -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Waktu Kejadian (Tanggal) *</label>
                <input
                  v-model="form.incidentDate"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Waktu Kejadian (Jam WIB) *</label>
                <input
                  v-model="form.incidentTime"
                  type="time"
                  required
                  class="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

          </div>
        </div>

        <!-- STEP 02: Detail Insiden & Lampiran -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs relative z-20">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 rounded-t-2xl flex items-center space-x-3">
            <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              02
            </span>
            <div>
              <h2 class="text-sm font-bold text-slate-900">Detail Insiden &amp; Lampiran</h2>
              <p class="text-[11px] text-slate-500">Uraikan kendala, nomor seri perangkat, tingkat keparahan, dan lampiran berkas.</p>
            </div>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <!-- Title & Serial Number -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="sm:col-span-2">
                <label class="block font-bold text-slate-700 mb-1">Judul Ringkasan Tiket *</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  placeholder="Contoh: Server Down / Storage Controller Degraded"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 text-xs"
                />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Serial Number (S/N Perangkat)</label>
                <input
                  v-model="form.serialNumber"
                  type="text"
                  placeholder="Contoh: SN-8829103-"
                  class="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-slate-800 text-xs"
                />
              </div>
            </div>

            <!-- Description -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="font-bold text-slate-700">Deskripsi Teknis &amp; Gejala Gangguan *</label>
                <span class="text-[10px] text-slate-400 font-mono">{{ form.description.length }}/2000</span>
              </div>
              <textarea
                v-model="form.description"
                rows="4"
                required
                maxlength="2000"
                placeholder="Jelaskan pesan error yang muncul, log yang teramati, IP atau hostname perangkat, serta unit kerja yang terimbas..."
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
              ></textarea>
            </div>

            <!-- Severity Level: Compact Buttons Without Paragraph Descriptions -->
            <div>
              <label class="block font-bold text-slate-700 mb-2">Tingkat Keparahan (Severity Level) *</label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  @click="form.severity = 'HIGH'"
                  class="py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  :class="form.severity === 'HIGH' ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-2xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-rose-500" :class="form.severity === 'HIGH' ? 'animate-ping' : ''"></span>
                  <span>HIGH</span>
                </button>

                <button
                  type="button"
                  @click="form.severity = 'MEDIUM'"
                  class="py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  :class="form.severity === 'MEDIUM' ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-2xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>MEDIUM</span>
                </button>

                <button
                  type="button"
                  @click="form.severity = 'LOW'"
                  class="py-2.5 px-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  :class="form.severity === 'LOW' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-2xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>LOW</span>
                </button>
              </div>
            </div>

            <!-- Single Lampiran Berkas Upload Zone (Optional, max 5MB) -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="font-bold text-slate-700">Lampiran Berkas Pendukung (Opsional)</label>
                <span class="text-[10px] text-slate-400 font-mono">Maks. 5 MB</span>
              </div>

              <!-- Upload Drag/Drop Box if no file selected -->
              <div 
                v-if="!selectedFile"
                class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer flex flex-col items-center justify-center"
                @click="$refs.fileInput.click()"
              >
                <input 
                  ref="fileInput" 
                  type="file" 
                  accept="image/*,.pdf,.txt,.log,.docx,.xlsx,.zip" 
                  class="hidden" 
                  @change="handleFileChange" 
                />
                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5 border border-blue-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <div class="font-bold text-slate-700 text-xs">
                  Pilih atau seret berkas lampiran (Opsional)
                </div>
                <div class="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, PDF, TXT, LOG, DOCX, ZIP • Maksimal 5 MB (Auto-kompres gambar)
                </div>
              </div>

              <!-- File Preview Pill when file selected -->
              <div v-else class="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                <div class="flex items-center space-x-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-slate-800 text-xs truncate">{{ selectedFile.name }}</p>
                    <p class="text-[10px] text-slate-400 font-mono">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  @click="removeFile" 
                  class="px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- STEP 03: Penugasan & Notifikasi -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs relative z-10">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 rounded-t-2xl flex items-center space-x-3">
            <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              03
            </span>
            <div>
              <h2 class="text-sm font-bold text-slate-900">Penugasan &amp; Notifikasi</h2>
              <p class="text-[11px] text-slate-500">Tugaskan teknisi penanganan dan atur dispatch notifikasi.</p>
            </div>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <!-- Engineer Assignee Selector -->
            <div>
              <BaseSelect 
                v-model="form.assignedToId"
                :options="engineerOptions"
                label="Alokasi Penanganan Teknisi (Engineer On-Duty) *"
                placeholder="-- Pilih Teknisi Bertugas --"
                required
              />
              <p class="text-[10px] text-slate-500 mt-1 font-medium">
                Teknisi penanganan wajib dipilih. Status tiket langsung tercatat <strong class="text-blue-700">ASSIGNED</strong> dan waktu respon SLA aktif.
              </p>
            </div>

            <!-- Email Notification Optional Toggle -->
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <label for="emailNotifToggle" class="flex items-center space-x-2.5 cursor-pointer flex-1">
                <input 
                  id="emailNotifToggle"
                  v-model="form.sendEmailNotification"
                  type="checkbox" 
                  class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span class="font-bold text-slate-800 block">
                    Kirim notifikasi email setelah tiket terbit (Opsional)
                  </span>
                  <span class="text-[11px] text-slate-500 block">
                    Mengirimkan pemberitahuan intake tiket ke PIC klien dan teknisi yang ditugaskan.
                  </span>
                </div>
              </label>
              <span 
                class="text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0"
                :class="form.sendEmailNotification ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'"
              >
                {{ form.sendEmailNotification ? 'EMAIL AKTIF' : 'NONAKTIF' }}
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
              <router-link 
                to="/tickets" 
                class="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
              >
                Batal
              </router-link>

              <button
                type="submit"
                :disabled="isSubmitting || isQuotaExhausted"
                :class="isQuotaExhausted ? 'bg-slate-300 text-slate-500 cursor-not-allowed hover:bg-slate-300 shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer'"
                class="px-6 py-2.5 disabled:opacity-60 rounded-xl text-xs font-bold transition-all flex items-center space-x-2"
                :title="isQuotaExhausted ? 'Kuota tiket pelanggan telah habis (0 tiket tersisa)' : ''"
              >
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <svg v-else-if="!isQuotaExhausted" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <svg v-else class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                </svg>
                <span>{{ isSubmitting ? 'Menerbitkan...' : (isQuotaExhausted ? 'Kuota Tiket Habis (Terkunci)' : 'Terbitkan &amp; Jalankan SLA Tiket') }}</span>
              </button>
            </div>

          </div>
        </div>
      </form>

      <!-- Right 4 Columns: Operational SLA Governance & Knowledge Base Recommendation -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- SLA Realtime Governance Card -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Operational SLA Target</span>
            </h3>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
              {{ matchedSlaPolicy?.tierName || activeCustomerSlaTier || 'STANDARD CONTRACT' }}
            </span>
          </div>

          <div class="space-y-3 text-xs">
            <!-- Operating Window Subtitle -->
            <div v-if="matchedSlaPolicy?.operatingHours" class="text-[11px] text-slate-500 flex items-center justify-between pb-1 border-b border-slate-100">
              <span>Jam Layanan:</span>
              <strong class="text-slate-700 font-mono text-[10px]">{{ matchedSlaPolicy.operatingHours }}</strong>
            </div>

            <!-- First Touch Row -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Target First Touch</span>
                <span class="font-bold text-slate-900 text-sm font-mono">+{{ targetFirstTouchHours }}</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded border" :class="[
                form.severity === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                form.severity === 'LOW' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              ]">
                {{ currentSeverityLevel.code }} RESPON
              </span>
            </div>

            <!-- Resolution Row -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Target Resolusi Tuntas</span>
                <span class="font-bold text-slate-900 text-sm font-mono">+{{ targetResolutionHours }}</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded border" :class="[
                form.severity === 'HIGH' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                form.severity === 'LOW' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              ]">
                {{ currentSeverityLevel.code }} RESOLUSI
              </span>
            </div>

            <div class="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Ketentuan SLA:</strong> Perhitungan SLA berjalan presisi segera setelah tiket diterbitkan. SLA dapat ditahan jika terdapat penundaan suku cadang (Part/Hardware) atau koordinasi mitra (Partner/Customer).
            </div>
          </div>
        </div>

        <!-- KNOWLEDGE BASE RECOMMENDATION CARD -->
        <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
                KNOWLEDGE BASE RECOMMENDATION
              </h3>
            </div>
            <span class="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {{ recommendedKbs.length }} CASES FOUND
            </span>
          </div>

          <p v-if="recommendedKbs.length > 0" class="text-[11px] text-slate-500 leading-relaxed">
            Rujukan berkas SOP dan dokumen runbook terkait judul dan kategori masalah:
          </p>

          <div v-if="recommendedKbs.length === 0" class="p-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            Belum ada referensi dokumen SOP yang cocok.
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="kb in recommendedKbs" 
              :key="kb.code"
              class="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all bg-slate-50/40 space-y-2"
            >
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-bold text-slate-900 text-xs block leading-snug hover:text-blue-600 cursor-pointer" @click="viewKbDetail(kb)">
                    {{ kb.code }}: {{ kb.title }}
                  </span>
                </div>
                <span 
                  class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  :class="kb.similarityScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ kb.similarityScore }}% match
                </span>
              </div>

              <div class="flex items-center justify-between pt-1">
                <span class="text-[10px] text-slate-500 font-mono">
                  {{ kb.documentName || 'Dokumen SOP' }}
                </span>
                <button
                  type="button"
                  @click="viewKbDetail(kb)"
                  class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-2xs shrink-0 cursor-pointer"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          </div>

          <div class="pt-2 text-center border-t border-slate-100">
            <router-link
              to="/knowledge-base"
              class="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
            >
              <span>Buka Repositori Dokumen SOP</span>
              <span>&rarr;</span>
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <!-- MODAL 1: Kelola Jenis Tiket (Add & Delete) -->
    <div 
      v-if="showTicketTypeModal" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div class="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2.5">
            <span class="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </span>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Kelola Master Jenis Tiket</h3>
              <p class="text-[11px] text-slate-500">Tambah atau hapus pilihan jenis tiket dinamis.</p>
            </div>
          </div>
          <button 
            @click="showTicketTypeModal = false" 
            type="button" 
            class="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Add New Ticket Type Input Form -->
        <div class="flex gap-2 text-xs">
          <input
            v-model="newTicketTypeName"
            type="text"
            placeholder="Ketik jenis tiket baru..."
            class="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
            @keyup.enter="handleAddTicketType"
          />
          <button
            type="button"
            @click="handleAddTicketType"
            class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
          >
            + Tambah
          </button>
        </div>

        <!-- List of Existing Ticket Types -->
        <div class="space-y-1.5 max-h-60 overflow-y-auto text-xs pr-1">
          <div 
            v-for="item in customTicketTypes" 
            :key="item.id || item.value"
            class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all"
          >
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span class="font-bold text-slate-800">{{ item.label }}</span>
            </div>
            <button
              v-if="customTicketTypes.length > 1"
              type="button"
              @click="handleDeleteTicketType(item)"
              class="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
              title="Hapus jenis tiket ini"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-end pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            @click="showTicketTypeModal = false"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: Tambah Kategori Masalah Baru -->
    <div 
      v-if="showAddCategoryModal" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div class="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2.5">
            <span class="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
              </svg>
            </span>
            <div>
              <h3 class="text-sm font-bold text-slate-900">Tambah Kategori Masalah Baru</h3>
              <p class="text-[11px] text-slate-500">Kategori baru akan langsung tersimpan dan dipilih untuk tiket ini.</p>
            </div>
          </div>
          <button 
            @click="closeAddCategoryModal" 
            type="button" 
            class="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSaveNewCategory" class="space-y-3.5 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Kategori Masalah *</label>
            <input
              v-model="newCategoryForm.name"
              type="text"
              required
              placeholder="Contoh: Storage SAN &amp; Fiber Channel"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
              autofocus
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Kode Singkat Kategori (3-5 Huruf)</label>
            <input
              v-model="newCategoryForm.code"
              type="text"
              maxlength="5"
              placeholder="Contoh: SAN (Dibuat otomatis jika kosong)"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs font-mono uppercase"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Deskripsi Ruang Lingkup Masalah (Opsional)</label>
            <textarea
              v-model="newCategoryForm.desc"
              rows="2"
              placeholder="Contoh: Kendala pada LUN storage, controller cache flapping, atau port switch FC"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="closeAddCategoryModal"
              class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Simpan &amp; Pilih Kategori</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 3: Detail KB Recommendation -->
    <div 
      v-if="selectedKbDetail" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div class="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {{ selectedKbDetail.code }}
            </span>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {{ selectedKbDetail.similarityScore }}% Match
            </span>
          </div>
          <button @click="selectedKbDetail = null" class="text-slate-400 hover:text-slate-600 text-2xl leading-none cursor-pointer">&times;</button>
        </div>

        <div class="space-y-3 text-xs">
          <h3 class="text-sm font-bold text-slate-900">{{ selectedKbDetail.title }}</h3>
          
          <div v-if="selectedKbDetail.documentName" class="p-3 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div class="flex items-center space-x-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                DOC
              </div>
              <div class="min-w-0">
                <p class="font-bold text-slate-900 text-xs truncate">{{ selectedKbDetail.documentName }}</p>
                <p class="text-[10px] text-slate-500 font-mono">{{ selectedKbDetail.documentSize || 'Berkas runbook SOP' }}</p>
              </div>
            </div>
            <a
              v-if="selectedKbDetail.pdfAttachmentUrl"
              :href="selectedKbDetail.pdfAttachmentUrl"
              download
              target="_blank"
              class="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-lg border border-blue-200 shrink-0 inline-flex items-center space-x-1"
            >
              <span>Unduh Berkas</span>
            </a>
          </div>

          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span class="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Keterangan / Dokumen Terkait</span>
            <p class="text-slate-600 leading-relaxed">{{ selectedKbDetail.solution }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            @click="applyKbToDescription(selectedKbDetail)"
            class="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
          >
            + Sisipkan Solusi ke Deskripsi Tiket
          </button>
          <button
            type="button"
            @click="selectedKbDetail = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { useUiStore } from '../stores/uiStore';
import { api } from '../services/api';
import { compressImageIfNeeded } from '../utils/imageCompressor';

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();

const showAddCategoryModal = ref(false);
const showTicketTypeModal = ref(false);
const previousCategoryId = ref(1);
const selectedFile = ref(null);
const isSubmitting = ref(false);
const selectedKbDetail = ref(null);
const newTicketTypeName = ref('');

// Dynamic ticket types list
const customTicketTypes = ref([
  { id: 1, label: 'Incident', value: 'Incident' },
  { id: 2, label: 'Service Request', value: 'Service Request' },
  { id: 3, label: 'Problem', value: 'Problem' },
  { id: 4, label: 'Change / Maintenance', value: 'Change / Maintenance' }
]);

const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getNowTime = () => {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const newCategoryForm = ref({
  name: '',
  code: '',
  desc: ''
});

const form = ref({
  ticketType: 'Incident',
  customerId: '',
  customerPicId: '',
  incidentDate: getTodayDate(),
  incidentTime: getNowTime(),
  categoryId: '',
  title: 'Server Down / Storage Degraded',
  serialNumber: '',
  description: 'Perangkat server utama tidak merespon koneksi (RTO). Seluruh layanan transaksi pengguna terhenti total. Mohon investigasi segera.',
  severity: 'HIGH',
  assignedToId: '',
  sendEmailNotification: true
});

const availableEngineers = computed(() => {
  return authStore.users.filter(u => u.roleCode === 'ENGINEER' || (u.role && u.role.code === 'ENGINEER'));
});

const engineerOptions = computed(() => {
  return (availableEngineers.value || []).map(eng => ({
    value: eng.id,
    label: eng.name,
    subtext: eng.specialty || ((eng.role || eng.roleCode) === 'ADMIN' ? 'Administrator' : 'Support Engineer'),
    badge: 'On-Duty',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  }));
});

const loadTicketTypes = async () => {
  try {
    const res = await api.getKbOptions({ type: 'TICKET_TYPE' });
    if (res && res.data && res.data.length > 0) {
      customTicketTypes.value = res.data.map(opt => ({
        id: opt.id,
        label: opt.label || opt.name || opt.value,
        value: opt.value || opt.label
      }));
    }
  } catch (err) {
    console.warn('[CreateTicket] Gagal load jenis tiket dari backend, menggunakan preset lokal:', err);
  }
};

onMounted(async () => {
  await Promise.all([
    ticketStore.fetchCustomers(),
    ticketStore.fetchSlaPolicies(),
    authStore.fetchUsersFromApi(),
    loadTicketTypes()
  ]);

  if (availableEngineers.value.length > 0 && !form.value.assignedToId) {
    form.value.assignedToId = availableEngineers.value[0].id;
  }
});

watch(availableEngineers, (list) => {
  if (list && list.length > 0 && !form.value.assignedToId) {
    form.value.assignedToId = list[0].id;
  }
}, { immediate: true });

const ticketTypeOptions = computed(() => {
  return customTicketTypes.value.map(t => ({
    value: t.value,
    label: t.label
  }));
});

const handleAddTicketType = async () => {
  const name = newTicketTypeName.value.trim();
  if (!name) return;

  const exists = customTicketTypes.value.some(t => t.value.toLowerCase() === name.toLowerCase());
  if (exists) {
    uiStore.toastWarning(`Jenis tiket "${name}" sudah terdaftar.`);
    return;
  }

  try {
    const res = await api.createKbOption({
      type: 'TICKET_TYPE',
      label: name,
      value: name
    });
    if (res && res.data) {
      customTicketTypes.value.push({
        id: res.data.id,
        label: res.data.label || name,
        value: res.data.value || name
      });
    } else {
      customTicketTypes.value.push({
        id: Date.now(),
        label: name,
        value: name
      });
    }
  } catch (err) {
    console.warn('[CreateTicket] Simpan jenis tiket ke server error, tambah lokal:', err);
    customTicketTypes.value.push({
      id: Date.now(),
      label: name,
      value: name
    });
  }

  form.value.ticketType = name;
  newTicketTypeName.value = '';
  uiStore.toastSuccess(`Jenis tiket "${name}" berhasil ditambahkan.`);
};

const handleDeleteTicketType = async (item) => {
  if (customTicketTypes.value.length <= 1) {
    uiStore.toastWarning('Minimal harus ada satu jenis tiket.');
    return;
  }

  try {
    if (item.id) {
      await api.deleteKbOption(item.id);
    }
  } catch (err) {
    console.warn('[CreateTicket] Gagal hapus jenis tiket di backend:', err);
  }

  customTicketTypes.value = customTicketTypes.value.filter(t => t.value !== item.value);
  if (form.value.ticketType === item.value) {
    form.value.ticketType = customTicketTypes.value[0]?.value || 'Incident';
  }
  uiStore.toastSuccess(`Jenis tiket "${item.label}" berhasil dihapus.`);
};

// Customer options: soft-deleted / inactive customers remain in list with (Nonaktif) label
const customerOptions = computed(() => {
  return (ticketStore.customers || []).map(c => {
    const isInactive = c.isActive === false;
    return {
      value: c.id,
      label: isInactive ? `${c.name} (Nonaktif)` : c.name,
      subtext: isInactive ? 'Akun Mitra Nonaktif' : (c.slaTier || 'SLA Standard'),
      badge: isInactive ? 'NONAKTIF' : (c.slaTier || ''),
      badgeClass: isInactive ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
    };
  });
});

const categoryOptions = computed(() => {
  const list = (ticketStore.categories || []).map(cat => ({
    value: cat.id,
    label: `${cat.name} (${cat.code})`,
    subtext: cat.desc || ''
  }));
  list.push({
    value: '__ADD_NEW__',
    label: '+ Tambah Kategori Masalah Baru...',
    subtext: 'Buka form untuk membuat master kategori baru'
  });
  return list;
});

const selectedCustomer = computed(() => {
  return ticketStore.customers.find(item => item.id === Number(form.value.customerId));
});

const customerQuotaInfo = computed(() => {
  return ticketStore.getCustomerQuotaInfo(selectedCustomer.value);
});

const isQuotaExhausted = computed(() => {
  if (!selectedCustomer.value) return false;
  const q = customerQuotaInfo.value;
  if (!q || q.quota === 'Unlimited') return false;
  return typeof q.remaining === 'number' && q.remaining <= 0;
});

const availablePics = computed(() => {
  return selectedCustomer.value ? (selectedCustomer.value.pics || []) : [];
});

const customerPicOptions = computed(() => {
  return (availablePics.value || []).map(p => ({
    value: p.id,
    label: p.name,
    subtext: `${p.phone || '-'} • ${p.email || '-'}`,
    badge: p.isPrimary ? 'Primary PIC' : ''
  }));
});

const selectedPic = computed(() => {
  if (!availablePics.value || availablePics.value.length === 0) return null;
  return availablePics.value.find(p => p.id === Number(form.value.customerPicId)) || availablePics.value[0];
});

const cleanPhoneForWa = (phone) => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
};

const selectedCategoryDesc = computed(() => {
  const cat = ticketStore.categories.find(c => c.id === Number(form.value.categoryId));
  return cat ? cat.desc : '';
});

// File upload handling: optional max 5MB with auto-compression for photos/images
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const processedFile = await compressImageIfNeeded(file);
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (processedFile.size > maxSizeBytes) {
      uiStore.toastWarning('Ukuran berkas melebihi batas maksimal 5 MB.');
      e.target.value = '';
      return;
    }
    selectedFile.value = processedFile;
  } catch (err) {
    console.error('Error handling file upload:', err);
    selectedFile.value = file;
  }
};

const removeFile = () => {
  selectedFile.value = null;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes > 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
  return Math.round(bytes / 1024) + ' KB';
};

// Knowledge Base Recommendations based on real runbooks
const recommendedKbs = computed(() => {
  const kbList = ticketStore.knowledgeBase || [];
  if (kbList.length === 0) return [];

  const titleText = (form.value.title || '').toLowerCase().trim();
  const descText = (form.value.description || '').toLowerCase().trim();
  const selectedCatObj = ticketStore.categories.find(c => c.id === Number(form.value.categoryId));
  const selectedCatName = (selectedCatObj?.name || '').toLowerCase().trim();

  // Tokenize keywords from title and description (>2 letters)
  const keywords = `${titleText} ${descText}`
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);

  return kbList
    .map(k => {
      const kbTitle = (k.title || '').toLowerCase();
      const kbCat = (k.category || '').toLowerCase();
      const kbProduct = (k.product || '').toLowerCase();

      let matchScore = 55; // baseline confidence score

      // 1. Category match (+25%)
      if (selectedCatName && (kbCat.includes(selectedCatName) || selectedCatName.includes(kbCat))) {
        matchScore += 25;
      }

      // 2. Keyword tokens match against Title or Product (+5% per unique matched keyword, max +20%)
      const matchedWords = new Set();
      keywords.forEach(word => {
        if (kbTitle.includes(word) || kbProduct.includes(word)) {
          matchedWords.add(word);
        }
      });
      matchScore += Math.min(20, matchedWords.size * 5);

      return {
        id: k.id,
        code: k.kbCode || `KB-${k.id}`,
        title: k.title,
        similarityScore: Math.min(95, matchScore),
        documentName: k.documentName,
        documentSize: k.documentSize,
        pdfAttachmentUrl: k.pdfAttachmentUrl,
        solution: k.documentName ? `SOP Berkas: ${k.documentName} (${k.documentSize || ''})` : `Panduan teknis SOP ${k.title}`
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3);
});

const viewKbDetail = (kb) => {
  selectedKbDetail.value = kb;
};

const applyKbToDescription = (kb) => {
  if (kb && kb.solution) {
    form.value.description += `\n\n[Referensi Solusi ${kb.code}]:\n${kb.solution}`;
  }
  selectedKbDetail.value = null;
};

const formatHoursToHms = (hours) => {
  const totalSecs = Math.round(Number(hours || 0) * 3600);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const activeCustomerSlaTier = computed(() => {
  return selectedCustomer.value?.slaTier || selectedCustomer.value?.contractSla || '';
});

const matchedSlaPolicy = computed(() => {
  const policies = ticketStore.slaPolicies || [];
  if (policies.length === 0) return null;

  const rawTier = (activeCustomerSlaTier.value || '').trim();
  if (!rawTier) return policies[0];

  const upper = rawTier.toUpperCase();

  // 1. Exact match by tierName or tierCode
  const exact = policies.find(p => 
    (p.tierName && p.tierName.toUpperCase() === upper) ||
    (p.tierCode && p.tierCode.toUpperCase() === upper)
  );
  if (exact) return exact;

  // 2. Partial/contains match
  const partial = policies.find(p => 
    (p.tierName && (upper.includes(p.tierName.toUpperCase()) || p.tierName.toUpperCase().includes(upper))) ||
    (p.tierCode && (upper.includes(p.tierCode.toUpperCase()) || p.tierCode.toUpperCase().includes(upper)))
  );
  if (partial) return partial;

  // 3. Keyword match (PLATINUM, GOLD, SILVER, GOV)
  let keyword = '';
  if (upper.includes('PLATINUM')) keyword = 'PLATINUM';
  else if (upper.includes('GOLD')) keyword = 'GOLD';
  else if (upper.includes('SILVER')) keyword = 'SILVER';
  else if (upper.includes('GOV')) keyword = 'GOV';

  if (keyword) {
    const kwMatch = policies.find(p => (p.tierName || '').toUpperCase().includes(keyword));
    if (kwMatch) return kwMatch;
  }

  return policies[0];
});

const currentSeverityLevel = computed(() => {
  if (form.value.severity === 'HIGH') return { code: 'P1', label: 'P1 - HIGH (CRITICAL)' };
  if (form.value.severity === 'LOW') return { code: 'P3', label: 'P3 - LOW' };
  return { code: 'P2', label: 'P2 - MEDIUM' };
});

const targetFirstTouchHours = computed(() => {
  const policy = matchedSlaPolicy.value;
  if (policy) {
    if (form.value.severity === 'HIGH') return formatHoursToHms(policy.p1ResponseHours);
    if (form.value.severity === 'LOW') return formatHoursToHms(policy.p3ResponseHours || policy.p4ResponseHours || 4);
    return formatHoursToHms(policy.p2ResponseHours);
  }
  return form.value.severity === 'HIGH' ? '00:30:00' : (form.value.severity === 'LOW' ? '04:00:00' : '01:00:00');
});

const targetResolutionHours = computed(() => {
  const policy = matchedSlaPolicy.value;
  if (policy) {
    if (form.value.severity === 'HIGH') return formatHoursToHms(policy.p1ResolutionHours);
    if (form.value.severity === 'LOW') return formatHoursToHms(policy.p3ResolutionHours || policy.p4ResolutionHours || 24);
    return formatHoursToHms(policy.p2ResolutionHours);
  }
  return form.value.severity === 'HIGH' ? '04:00:00' : (form.value.severity === 'LOW' ? '24:00:00' : '08:00:00');
});

const handleCustomerChange = () => {
  const pics = availablePics.value;
  if (pics.length > 0) {
    form.value.customerPicId = pics[0].id;
  } else {
    form.value.customerPicId = '';
  }
};

const openAddCategoryModal = () => {
  newCategoryForm.value = {
    name: '',
    code: '',
    desc: ''
  };
  showAddCategoryModal.value = true;
};

const closeAddCategoryModal = () => {
  showAddCategoryModal.value = false;
  if (form.value.categoryId === '__ADD_NEW__') {
    form.value.categoryId = previousCategoryId.value || (ticketStore.categories[0]?.id || '');
  }
};

const onCategorySelectChange = () => {
  if (form.value.categoryId === '__ADD_NEW__') {
    openAddCategoryModal();
  } else {
    previousCategoryId.value = form.value.categoryId;
  }
};

const handleSaveNewCategory = () => {
  if (!newCategoryForm.value.name.trim()) return;

  const newCat = ticketStore.addCategory({
    name: newCategoryForm.value.name,
    code: newCategoryForm.value.code,
    desc: newCategoryForm.value.desc
  }, authStore.currentUser);

  form.value.categoryId = newCat.id;
  previousCategoryId.value = newCat.id;
  showAddCategoryModal.value = false;

  uiStore.toastSuccess(`Kategori "${newCat.name}" (${newCat.code}) berhasil ditambahkan dan dipilih.`);
};

const handleSubmitTicket = async () => {
  if (isQuotaExhausted.value) {
    uiStore.toastError(`Gagal: Kuota tiket untuk mitra "${selectedCustomer.value?.name}" telah habis (sisa 0 tiket). Tidak dapat menerbitkan tiket baru.`);
    return;
  }
  if (!form.value.assignedToId) {
    uiStore.toastWarning('Alokasi teknisi penanganan wajib dipilih. Tiket tidak dapat diterbitkan tanpa teknisi bertugas.');
    return;
  }
  isSubmitting.value = true;
  try {
    const formData = new FormData();
    formData.append('ticketType', form.value.ticketType || 'Incident');
    formData.append('customerId', form.value.customerId);
    if (form.value.customerPicId) {
      formData.append('customerPicId', form.value.customerPicId);
    }
    if (form.value.categoryId) {
      formData.append('categoryId', form.value.categoryId);
    }
    if (form.value.serialNumber) {
      formData.append('serialNumber', form.value.serialNumber);
    }
    formData.append('severity', form.value.severity || 'MEDIUM');
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('assignedToId', form.value.assignedToId);
    formData.append('sendEmailNotification', String(Boolean(form.value.sendEmailNotification)));

    if (selectedFile.value) {
      formData.append('file', selectedFile.value);
    }

    let apiTicket = null;
    try {
      const res = await api.createTicket(formData);
      if (res && res.data) {
        apiTicket = res.data;
      }
    } catch (err) {
      const status = err.response?.status;
      const errMsg = err.response?.data?.message || err.message;
      if (status === 400 || status === 403 || status === 404) {
        uiStore.toastError(errMsg);
        return;
      }
      console.warn('[CreateTicket] Gagal sync ke API backend, fallback store lokal:', err.message);
    }

    const payload = {
      ...form.value,
      contractSla: selectedCustomer.value?.contractSla || '',
      contractTier: selectedCustomer.value?.slaTier || selectedCustomer.value?.contractSla || '',
      attachmentName: selectedFile.value ? selectedFile.value.name : null,
      attachmentSize: selectedFile.value ? formatFileSize(selectedFile.value.size) : null,
      attachmentUrl: selectedFile.value ? URL.createObjectURL(selectedFile.value) : null
    };

    const newTicket = ticketStore.createTicket(payload, authStore.currentUser);
    if (apiTicket && apiTicket.id) {
      newTicket.id = apiTicket.id;
      newTicket.ticketNumber = apiTicket.ticketNumber;
      if (apiTicket.attachmentUrl) {
        newTicket.attachmentUrl = apiTicket.attachmentUrl;
        newTicket.attachmentName = apiTicket.attachmentName;
        newTicket.attachmentSize = apiTicket.attachmentSize;
      }
    }

    uiStore.toastSuccess(`Tiket ${newTicket.ticketNumber} berhasil diterbitkan.`);
    router.push(`/tickets/${newTicket.id}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
