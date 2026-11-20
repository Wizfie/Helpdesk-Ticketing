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
          Buat tiket gangguan atau permintaan layanan dengan parameter SLA berbasis kontrak secara terstruktur.
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

    <!-- Main Layout: Form (Left) & Knowledge Base Recommendations (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left 8 Columns: 3-Step Guided Intake Form -->
      <form @submit.prevent="handleSubmitTicket" class="lg:col-span-8 space-y-6">
        
        <!-- STEP 01: Informasi Tiket & Customer -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                01
              </span>
              <div>
                <h2 class="text-sm font-bold text-slate-900">Informasi Tiket &amp; Customer</h2>
                <p class="text-[11px] text-slate-500">Pilih jenis tiket, data customer, dan informasi awal insiden.</p>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-5 text-xs">
            <!-- Row 1: Jenis Tiket & Customer Selector -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <BaseSelect
                  v-model="form.ticketType"
                  :options="ticketTypeOptions"
                  label="Jenis Tiket"
                  required
                  placeholder="Pilih jenis tiket..."
                />
              </div>

              <div>
                <BaseSelect
                  v-model="form.customerId"
                  :options="customerOptions"
                  label="Customer / Perusahaan Klien"
                  required
                  searchable
                  placeholder="-- Pilih Entitas Customer --"
                  @change="handleCustomerChange"
                />
              </div>
            </div>

            <!-- Inactive Customer Warning Banner -->
            <div v-if="selectedCustomer && selectedCustomer.isActive === false" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2 text-xs">
              <svg class="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <div class="leading-tight">
                <span class="font-bold">Perhatian:</span> Akun mitra ini berstatus <strong class="underline">NONAKTIF</strong>. Pastikan verifikasi status kontrak ke tim sales/legal.
              </div>
            </div>

            <!-- Live Contract SLA & Quota Badge -->
            <div v-if="selectedCustomer" class="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div class="flex items-center space-x-2">
                <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span class="font-mono font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                  ACTIVE CONTRACT SLA: {{ selectedCustomer.contractSla || selectedCustomer.slaTier || '-' }}
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
                    {{ customerQuotaInfo.remaining }} / {{ customerQuotaInfo.quota }} ({{ customerQuotaInfo.percentage }}%)
                  </span>
                </div>
              </div>
            </div>

            <!-- Row 2: PIC Pelapor & Saluran Intake -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="font-bold text-slate-700">PIC Pelapor (Kontak Klien) *</label>
                  <!-- Quick contact action icons -->
                  <div v-if="selectedPic" class="flex items-center space-x-1.5">
                    <a 
                      v-if="selectedPic.phone" 
                      :href="`tel:${selectedPic.phone}`" 
                      title="Telepon PIC"
                      class="p-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </a>
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
                    <a 
                      v-if="selectedPic.email" 
                      :href="`mailto:${selectedPic.email}`" 
                      title="Kirim Email PIC"
                      class="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
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

              <div>
                <BaseSelect
                  v-model="form.channel"
                  :options="channelOptions"
                  label="Saluran Intake (Channel)"
                  required
                  placeholder="Pilih saluran intake..."
                />
              </div>
            </div>

            <!-- Row 3: Waktu Kejadian, Kategori Masalah & Affected Service -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Waktu Kejadian / Incident Start (Date & Time) -->
              <div>
                <label class="block font-bold text-slate-700 mb-1">Waktu Kejadian / Incident Start *</label>
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="form.incidentDate"
                    type="date"
                    required
                    class="w-full px-2.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    v-model="form.incidentTime"
                    type="time"
                    required
                    class="w-full px-2.5 py-2 border border-slate-200 rounded-xl bg-white text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
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

              <!-- Affected Service / System -->
              <div>
                <BaseSelect
                  v-model="form.affectedService" 
                  :options="affectedServiceOptions"
                  label="Affected Service / System"
                  required
                  searchable
                  placeholder="Pilih affected service..."
                />
              </div>
            </div>

            <!-- Row 4: Cluster/Device, Dampak Gangguan (Business Impact) & Related Ticket -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Cluster / Host / Device</label>
                <input
                  v-model="form.cluster"
                  type="text"
                  placeholder="Contoh: PROD-CL01, Server IP, atau node"
                  class="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <BaseSelect
                  v-model="form.businessImpact"
                  :options="businessImpactOptions"
                  label="Dampak Gangguan (Business Impact)"
                  required
                  placeholder="Pilih dampak gangguan..."
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Related Ticket (Jika ada)</label>
                <input
                  v-model="form.relatedTicket"
                  type="text"
                  placeholder="Contoh: TICK-20261004-0001"
                  class="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          </div>
        </div>

        <!-- STEP 02: Detail Insiden -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center space-x-3">
            <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              02
            </span>
            <div>
              <h2 class="text-sm font-bold text-slate-900">Detail Insiden</h2>
              <p class="text-[11px] text-slate-500">Jelaskan masalah secara detail dan lampirkan bukti pendukung.</p>
            </div>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <!-- Ticket Title -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Judul Ringkasan Tiket *</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Contoh: Server Down / Service Unreachable"
                class="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>

            <!-- Description & Character Count -->
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
                placeholder="Jelaskan pesan error yang muncul, log yang teramati, IP atau hostname perangkat, serta estimasi unit kerja yang terimbas..."
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
              ></textarea>
            </div>

            <!-- Severity Cards (Clickable) -->
            <div>
              <label class="block font-bold text-slate-700 mb-2">Tingkat Keparahan (Severity Level) *</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div 
                  @click="form.severity = 'HIGH'"
                  class="p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                  :class="form.severity === 'HIGH' ? 'border-rose-500 bg-rose-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'"
                >
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-rose-700">🔴 HIGH SEVERITY</span>
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500" :class="form.severity === 'HIGH' ? 'animate-ping' : ''"></span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed">Layanan inti mati total, transaksi utama nasabah berhenti.</p>
                  <div class="mt-2 text-[10px] font-mono text-rose-700 font-bold">
                    Response ≤ 30m • Resolusi ≤ 4h
                  </div>
                </div>

                <div 
                  @click="form.severity = 'MEDIUM'"
                  class="p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                  :class="form.severity === 'MEDIUM' ? 'border-amber-500 bg-amber-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'"
                >
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-amber-700">🟡 MEDIUM SEVERITY</span>
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed">Kinerja terdegradasi / intermiten, redundansi masih aktif.</p>
                  <div class="mt-2 text-[10px] font-mono text-amber-700 font-bold">
                    Response ≤ 1h • Resolusi ≤ 8h
                  </div>
                </div>

                <div 
                  @click="form.severity = 'LOW'"
                  class="p-3.5 rounded-xl border-2 cursor-pointer transition-all"
                  :class="form.severity === 'LOW' ? 'border-sky-500 bg-sky-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'"
                >
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="font-bold text-sky-700">🔵 LOW SEVERITY</span>
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed">Kendala minor, permohonan konfigurasi atau akun user.</p>
                  <div class="mt-2 text-[10px] font-mono text-sky-700 font-bold">
                    Response ≤ 2h • Resolusi ≤ 24h
                  </div>
                </div>
              </div>
            </div>

            <!-- Drag & Drop Upload Zone -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Lampiran Berkas Diagnostik &amp; Tangkapan Layar</label>
              <div 
                class="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-blue-50/30 hover:border-blue-300 transition-all cursor-pointer flex flex-col items-center justify-center"
                @click="$refs.proofInput.click()"
              >
                <input 
                  ref="proofInput" 
                  type="file" 
                  accept="image/*,.pdf,.txt,.log,.pcap" 
                  class="hidden" 
                  @change="handleFileUpload" 
                />
                <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <div class="font-bold text-slate-700 text-xs">
                  Klik untuk unggah atau seret berkas ke area ini
                </div>
                <div class="text-[11px] text-slate-400 mt-0.5">
                  Mendukung PNG, JPG, PDF, TXT, LOG, PCAP • Maksimal 25MB • Auto-Scanned Safe
                </div>
              </div>

              <!-- Uploaded Files Preview List -->
              <div v-if="uploadedFiles.length > 0" class="mt-2.5 space-y-2">
                <div 
                  v-for="(f, idx) in uploadedFiles" 
                  :key="idx" 
                  class="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs"
                >
                  <div class="flex items-center space-x-2">
                    <span class="p-1 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px]">SCAN PASS</span>
                    <span class="font-medium text-slate-800 text-xs truncate max-w-xs">{{ f.name }}</span>
                    <span class="text-[10px] text-slate-400">({{ f.size }})</span>
                  </div>
                  <button 
                    type="button" 
                    @click="removeFile(idx)" 
                    class="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- STEP 03: Penugasan & Eskalasi -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center space-x-3">
            <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              03
            </span>
            <div>
              <h2 class="text-sm font-bold text-slate-900">Penugasan &amp; Eskalasi</h2>
              <p class="text-[11px] text-slate-500">Tugaskan teknisi bertugas dan atur eskalasi jika diperlukan.</p>
            </div>
          </div>

          <div class="p-6 space-y-5 text-xs">
            <!-- Engineer Assignee Selector -->
            <div>
              <BaseSelect 
                v-model="form.assignedToId"
                :options="engineerOptions"
                label="Alokasi Penanganan Teknisi (Engineer On-Duty)"
                placeholder="-- Biarkan Dalam Antrean Terbuka (Triage NOC) --"
              />
              <p class="text-[10px] text-slate-400 mt-1">
                Jika teknisi langsung dipilih, status tiket otomatis berubah menjadi <strong>ASSIGNED</strong>.
              </p>
            </div>

            <!-- Email Notification Toggle -->
            <div class="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
              <div class="flex items-center space-x-2.5">
                <input 
                  id="emailSyncToggle"
                  v-model="form.isEmailSync"
                  type="checkbox" 
                  class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <label for="emailSyncToggle" class="font-bold text-slate-800 cursor-pointer">
                    Kirim Notifikasi Email Alert ke Teknisi
                  </label>
                  <p class="text-[11px] text-slate-500">
                    Sistem akan mengirimkan dispatch payload email notifikasi resmi segera setelah tiket diterbitkan.
                  </p>
                </div>
              </div>
              <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                EMAIL DISPATCH READY
              </span>
            </div>

            <!-- Technology Principal Escalation Toggle -->
            <div class="p-4 rounded-xl border border-slate-200 bg-white space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2.5">
                  <input 
                    id="principalToggle"
                    v-model="isPrincipalEscalation"
                    type="checkbox" 
                    class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <label for="principalToggle" class="font-bold text-slate-900 cursor-pointer flex items-center space-x-1.5">
                      <span>Eskalasi ke Technology Principal / OEM Vendor</span>
                    </label>
                    <p class="text-[11px] text-slate-500">
                      Aktifkan bila insiden memerlukan dukungan langsung vendor (Cisco, Fortinet, Mikrotik, VMware, AWS).
                    </p>
                  </div>
                </div>
                <span v-if="isPrincipalEscalation" class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                  L3 OEM ACTIVE
                </span>
              </div>

              <!-- Principal Form Fields -->
              <div v-if="isPrincipalEscalation" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 animate-in fade-in duration-150">
                <div>
                  <BaseSelect 
                    v-model="form.principalVendor" 
                    :options="principalVendorOptions"
                    label="Vendor Principal"
                    required
                    placeholder="Pilih vendor principal..."
                  />
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">Case / Ticket ID Principal *</label>
                  <input 
                    v-model="form.principalCaseId"
                    type="text"
                    placeholder="Contoh: SR-699212009"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label class="block font-bold text-slate-700 mb-1">Nama Spesialis Principal</label>
                  <input 
                    v-model="form.principalSpecialist"
                    type="text"
                    placeholder="Contoh: Jonathan Reyes (L3 TAC)"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
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
                :disabled="isSubmitting"
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2"
              >
                <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>{{ isSubmitting ? 'Menerbitkan...' : 'Terbitkan &amp; Jalankan SLA Tiket' }}</span>
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
            <span class="text-[10px] font-mono text-slate-400">PKS Glotra 2026</span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Target First Touch</span>
                <span class="font-bold text-slate-900 text-sm font-mono">+{{ targetFirstTouchHours }}</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                P1 REQUIREMENT
              </span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Target Resolusi Tuntas</span>
                <span class="font-bold text-slate-900 text-sm font-mono">+{{ targetResolutionHours }}</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                STANDARD CONTRACT
              </span>
            </div>

            <div class="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              <strong>Ketentuan SLA:</strong> Penghitungan SLA berjalan presisi segera setelah tiket diterbitkan. SLA dapat di-pause jika tiket berstatus *Waiting Customer* atau *Waiting Vendor*.
            </div>
          </div>
        </div>

        <!-- KNOWLEDGE BASE RECOMMENDATION CARD (Matching Image Specification) -->
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
            Berdasarkan judul, kategori, dan deskripsi, ditemukan case yang mirip:
          </p>

          <div v-if="recommendedKbs.length === 0" class="p-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            Belum ada referensi Knowledge Base runbook yang terkait. Basis pengetahuan akan terisi seiring tim menyelesaikan insiden operasional.
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
                  Similarity: {{ kb.similarityScore }}%
                </span>
              </div>

              <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                {{ kb.excerpt }}
              </p>

              <div class="flex items-center justify-between pt-1">
                <!-- Tags -->
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in kb.tags" 
                    :key="tag"
                    class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 font-medium"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Action Button -->
                <button
                  type="button"
                  @click="viewKbDetail(kb)"
                  class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-2xs shrink-0"
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
              <span>Lihat Semua Hasil Pencarian di Knowledge Base</span>
              <span>&rarr;</span>
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal Detail Knowledge Base Recommendation -->
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
              Similarity {{ selectedKbDetail.similarityScore }}%
            </span>
          </div>
          <button @click="selectedKbDetail = null" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <div class="space-y-3 text-xs">
          <h3 class="text-sm font-bold text-slate-900">{{ selectedKbDetail.title }}</h3>
          
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span class="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Gejala &amp; Ringkasan Kasus</span>
            <p class="text-slate-600 leading-relaxed">{{ selectedKbDetail.excerpt }}</p>
          </div>

          <div class="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
            <span class="font-bold text-blue-900 block text-[11px] uppercase tracking-wider">Langkah Diagnostik Rekomendasi (SOP)</span>
            <p class="text-blue-800 leading-relaxed font-mono whitespace-pre-line text-[11px]">{{ selectedKbDetail.solution }}</p>
          </div>

          <div class="flex flex-wrap gap-1.5 pt-1">
            <span 
              v-for="t in selectedKbDetail.tags" 
              :key="t"
              class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
            >
              #{{ t }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            @click="applyKbToDescription(selectedKbDetail)"
            class="text-blue-600 hover:text-blue-800 font-bold"
          >
            + Sisipkan Solusi ke Deskripsi Tiket
          </button>
          <button
            type="button"
            @click="selectedKbDetail = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tambah Kategori Masalah Baru -->
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
              <p class="text-[11px] text-slate-500">Kategori baru akan langsung tersimpan dan dipilih untuk tiket ini</p>
            </div>
          </div>
          <button 
            @click="closeAddCategoryModal" 
            type="button" 
            class="text-slate-400 hover:text-slate-600 p-1 rounded-md"
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
              placeholder="Contoh: VoIP &amp; SIP Trunk Telephony"
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
              placeholder="Contoh: VOIP (Dibuat otomatis jika dikosongkan)"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs font-mono uppercase"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Deskripsi Ruang Lingkup Masalah (Opsional)</label>
            <textarea
              v-model="newCategoryForm.desc"
              rows="2"
              placeholder="Contoh: Kendala pada perangkat IP Phone, registrasi ekstensi PBX, atau SIP trunk flapping"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              @click="closeAddCategoryModal"
              class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs flex items-center space-x-1.5"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { useUiStore } from '../stores/uiStore';
import { api } from '../services/api';

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();

onMounted(async () => {
  await Promise.all([
    ticketStore.fetchCustomers(),
    ticketStore.fetchSlaPolicies(),
    authStore.fetchUsersFromApi()
  ]);
});

const showAddCategoryModal = ref(false);
const previousCategoryId = ref(1);
const isPrincipalEscalation = ref(false);
const uploadedFiles = ref([]);
const isSubmitting = ref(false);
const selectedKbDetail = ref(null);

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
  ticketType: 'Incident (Gangguan)',
  customerId: '',
  customerPicId: '',
  channel: 'WHATSAPP',
  incidentDate: getTodayDate(),
  incidentTime: getNowTime(),
  categoryId: '',
  affectedService: 'VMware Infrastructure',
  cluster: 'PROD-CL01',
  businessImpact: 'Seluruh layanan tidak dapat digunakan',
  relatedTicket: '',
  title: 'Server Down / Service Unreachable',
  description: 'Server utama tidak merespon koneksi (RTO). Seluruh layanan transaksi pengguna terhenti total. VMware vCenter masih bisa diakses namun VM di cluster PROD-CL01 tidak dapat dihubungi. IP 10.10.10.25 tidak bisa ping.',
  rawMessage: '',
  severity: 'HIGH',
  assignedToId: '',
  isEmailSync: true,
  principalVendor: 'VMware by Broadcom Enterprise',
  principalCaseId: '',
  principalSpecialist: ''
});

// Dropdown options
const ticketTypeOptions = [
  { value: 'Incident (Gangguan)', label: 'Incident (Gangguan)', subtext: 'Insiden pemadaman atau degradasi fungsionalitas sistem' },
  { value: 'Service Request (Permintaan)', label: 'Service Request (Permintaan)', subtext: 'Permintaan bantuan layanan, konfigurasi, atau akses' },
  { value: 'Problem (Investigasi RCA)', label: 'Problem (Investigasi RCA)', subtext: 'Investigasi komprehensif akar masalah berulang' },
  { value: 'Maintenance / Perubahan', label: 'Maintenance / Perubahan', subtext: 'Jadwal pemeliharaan dan perubahan infrastruktur' }
];

const customerOptions = computed(() => {
  return (ticketStore.customers || []).map(c => ({
    value: c.id,
    label: c.name,
    subtext: c.slaTier || 'SLA Standard',
    badge: c.isActive === false ? 'NONAKTIF' : (c.slaTier || ''),
    badgeClass: c.isActive === false ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
  }));
});

const channelOptions = [
  { value: 'WHATSAPP', label: 'WhatsApp Support', subtext: 'Chat Helpdesk via WhatsApp Business' },
  { value: 'EMAIL', label: 'Email Support', subtext: 'helpdesk@glotratech.com' },
  { value: 'PHONE', label: 'Telepon Hotline', subtext: 'Dedicated Hotline Call Center' },
  { value: 'DIRECT', label: 'Informasi Langsung / NOC', subtext: 'Alert langsung dari sistem NOC Monitoring' }
];

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

const affectedServiceOptions = [
  { value: 'VMware Infrastructure', label: 'VMware Infrastructure', subtext: 'ESXi, vCenter, VM instances' },
  { value: 'Database Server (PostgreSQL / Oracle / MySQL)', label: 'Database Server', subtext: 'PostgreSQL, Oracle, MySQL' },
  { value: 'Network Core & Switching (Cisco / Nexus)', label: 'Network Core & Switching', subtext: 'Switch, Router, Firewall' },
  { value: 'Storage SAN & Storage Controller', label: 'Storage SAN & Controller', subtext: 'SAN Array, LUN, Controller' },
  { value: 'Backup & Disaster Recovery (Rubrik / Veeam)', label: 'Backup & Disaster Recovery', subtext: 'Backup jobs, Veeam, Rubrik' },
  { value: 'Web Portal & Application Service', label: 'Web Portal & Application', subtext: 'Frontend, Web apps, Microservices' },
  { value: 'Operating System / Virtual Machine', label: 'OS & Virtual Machine', subtext: 'Linux / Windows guest OS' },
  { value: 'Lainnya', label: 'Lainnya / General Infrastructure', subtext: 'Infrastruktur umum lainnya' }
];

const businessImpactOptions = [
  { value: 'Seluruh layanan tidak dapat digunakan', label: 'Seluruh layanan tidak dapat digunakan', badge: 'Critical Impact', badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200' },
  { value: 'Sebagian fungsionalitas utama terganggu', label: 'Sebagian fungsionalitas utama terganggu', badge: 'Major Impact', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200' },
  { value: 'Degradasi performa minor', label: 'Degradasi performa minor', badge: 'Minor', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200' },
  { value: 'Tidak berdampak langsung ke operasional bisnis', label: 'Tidak berdampak langsung', badge: 'Low', badgeClass: 'bg-slate-100 text-slate-600' }
];

const principalVendorOptions = [
  { value: 'VMware by Broadcom Enterprise', label: 'VMware by Broadcom Enterprise' },
  { value: 'Cisco TAC Global', label: 'Cisco TAC Global' },
  { value: 'Fortinet TAC Enterprise', label: 'Fortinet TAC Enterprise' },
  { value: 'Mikrotik Certified Support', label: 'Mikrotik Certified Support' },
  { value: 'AWS Premium Enterprise Support', label: 'AWS Premium Support' },
  { value: 'Dell EMC Core Support', label: 'Dell EMC Core Support' }
];

const selectedCustomer = computed(() => {
  return ticketStore.customers.find(item => item.id === Number(form.value.customerId));
});

const customerQuotaInfo = computed(() => {
  return ticketStore.getCustomerQuotaInfo(selectedCustomer.value);
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

const availableEngineers = computed(() => {
  return authStore.users.filter(u => u.roleCode === 'ENGINEER');
});

const engineerOptions = computed(() => {
  const list = [{ value: '', label: '-- Biarkan Dalam Antrean Terbuka (Triage NOC) --', subtext: 'Tiket masuk antrean umum unassigned' }];
  (availableEngineers.value || []).forEach(eng => {
    list.push({
      value: eng.id,
      label: eng.name,
      subtext: (eng.role || eng.roleCode) === 'ADMIN' ? 'Administrator' : 'Support Engineer',
      badge: 'On-Duty',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    });
  });
  return list;
});

// Knowledge Base Recommendations based on real published runbooks
const recommendedKbs = computed(() => {
  const kbList = (ticketStore.knowledgeBase || []).filter(k => k.status === 'PUBLISHED');
  if (kbList.length === 0) return [];

  const query = `${form.value.title || ''} ${form.value.description || ''}`.toLowerCase().trim();
  return kbList
    .map(k => {
      const matchTitle = query && (k.title || '').toLowerCase().includes(query) ? 35 : 0;
      const matchCat = query && (k.category || '').toLowerCase().includes(query) ? 20 : 0;
      const matchPrin = query && (k.technologyPrincipal || '').toLowerCase().includes(query) ? 25 : 0;
      return {
        id: k.id,
        code: k.kbCode || `KB-${k.id}`,
        title: k.title,
        similarityScore: Math.min(95, 55 + matchTitle + matchCat + matchPrin),
        excerpt: k.symptom || k.title,
        solution: k.recommendation || k.rootCause || '',
        tags: [k.category, k.technologyPrincipal].filter(Boolean)
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

const targetFirstTouchHours = computed(() => {
  const contract = (selectedCustomer.value?.contractSla || '').toUpperCase();
  const matched = (ticketStore.slaPolicies || []).find(p => p.tierCode === selectedCustomer.value?.contractSla || contract.includes(p.tierCode));
  if (matched) {
    if (form.value.severity === 'HIGH') return formatHoursToHms(matched.p1ResponseHours);
    if (form.value.severity === 'LOW') return formatHoursToHms(matched.p3ResponseHours || matched.p4ResponseHours || 4);
    return formatHoursToHms(matched.p2ResponseHours);
  }
  const defaultPolicy = (ticketStore.slaPolicies || [])[0];
  if (defaultPolicy) {
    if (form.value.severity === 'HIGH') return formatHoursToHms(defaultPolicy.p1ResponseHours);
    if (form.value.severity === 'LOW') return formatHoursToHms(defaultPolicy.p3ResponseHours || defaultPolicy.p4ResponseHours || 4);
    return formatHoursToHms(defaultPolicy.p2ResponseHours);
  }
  return form.value.severity === 'HIGH' ? '01:00:00' : (form.value.severity === 'LOW' ? '04:00:00' : '02:00:00');
});

const targetResolutionHours = computed(() => {
  const contract = (selectedCustomer.value?.contractSla || '').toUpperCase();
  const matched = (ticketStore.slaPolicies || []).find(p => p.tierCode === selectedCustomer.value?.contractSla || contract.includes(p.tierCode));
  if (matched) {
    if (form.value.severity === 'HIGH') return formatHoursToHms(matched.p1ResolutionHours);
    if (form.value.severity === 'LOW') return formatHoursToHms(matched.p3ResolutionHours || matched.p4ResolutionHours || 24);
    return formatHoursToHms(matched.p2ResolutionHours);
  }
  const defaultPolicy = (ticketStore.slaPolicies || [])[0];
  if (defaultPolicy) {
    if (form.value.severity === 'HIGH') return formatHoursToHms(defaultPolicy.p1ResolutionHours);
    if (form.value.severity === 'LOW') return formatHoursToHms(defaultPolicy.p3ResolutionHours || defaultPolicy.p4ResolutionHours || 24);
    return formatHoursToHms(defaultPolicy.p2ResolutionHours);
  }
  return form.value.severity === 'HIGH' ? '08:00:00' : (form.value.severity === 'LOW' ? '24:00:00' : '16:00:00');
});

const handleCustomerChange = () => {
  const pics = availablePics.value;
  if (pics.length > 0) {
    form.value.customerPicId = pics[0].id;
  } else {
    form.value.customerPicId = '';
  }

  if (selectedCustomer.value) {
    form.value.cluster = selectedCustomer.value.cluster || '';
  }
};

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadedFiles.value.push({
      id: 'file-' + Date.now(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    });
  }
};

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1);
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
  isSubmitting.value = true;
  try {
    const payload = {
      ...form.value,
      contractSla: selectedCustomer.value?.contractSla || '',
      contractTier: selectedCustomer.value?.slaTier || selectedCustomer.value?.contractSla || '',
      environment: selectedCustomer.value?.environment || 'PROD-DC-01',
      impactScope: form.value.businessImpact,
      principalVendor: isPrincipalEscalation.value ? form.value.principalVendor : null,
      principalCaseId: isPrincipalEscalation.value ? form.value.principalCaseId : null,
      principalSpecialist: isPrincipalEscalation.value ? form.value.principalSpecialist : null,
      attachments: uploadedFiles.value.map(f => ({
        id: f.id,
        name: f.name,
        originalName: f.name,
        fileType: 'image/svg+xml',
        size: f.size,
        uploadedBy: authStore.currentUser?.name || 'CPIG Operator',
        uploadedAt: new Date().toISOString()
      }))
    };

    let apiTicket = null;
    try {
      const res = await api.createTicket(payload);
      if (res && res.data) {
        apiTicket = res.data;
      }
    } catch (err) {
      console.warn('[CreateTicket] Gagal sync ke API backend, fallback store lokal:', err.message);
    }

    const newTicket = ticketStore.createTicket(payload, authStore.currentUser);
    if (apiTicket && apiTicket.id) {
      newTicket.id = apiTicket.id;
      newTicket.ticketNumber = apiTicket.ticketNumber;
    }
    router.push(`/tickets/${newTicket.id}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
