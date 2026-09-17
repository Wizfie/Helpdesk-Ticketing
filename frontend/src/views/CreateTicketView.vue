<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Top Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link to="/tickets" class="hover:text-blue-600 transition-colors">Tickets</router-link>
          <span>/</span>
          <span class="text-slate-800">Incident Intake</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <span>Pusat Registrasi Tiket Layanan</span>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            CPIG INGESTION CONSOLE
          </span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Registrasi dan routing tiket gangguan insiden customer dengan parameter SLA berbasis kontrak secara terstruktur.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <router-link
          to="/tickets"
          class="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-xs flex items-center space-x-1.5"
        >
          <span>&larr; Antrean Tiket</span>
        </router-link>
      </div>
    </div>

    <!-- Quick Issue Presets Toolbar -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div class="flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-blue-600"></span>
          <span class="text-xs font-bold text-slate-800 uppercase tracking-wider">Template Isu Cepat (Sekali Klik):</span>
        </div>
        <span class="text-[11px] text-slate-400">Otomatis mengisi Kategori, Severity, Judul & SLA Target</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          v-for="preset in ticketStore.quickPresets"
          :key="preset.id"
          type="button"
          @click="applyPreset(preset)"
          class="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all group bg-slate-50/50"
        >
          <div class="font-bold text-slate-800 text-xs group-hover:text-blue-600 truncate mb-1">{{ preset.title }}</div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-bold text-rose-600" v-if="preset.severity === 'HIGH'">HIGH (30m)</span>
            <span class="font-bold text-amber-600" v-else-if="preset.severity === 'MEDIUM'">MED (1h)</span>
            <span class="font-bold text-sky-600" v-else>LOW (2h)</span>
            <span class="text-slate-400 font-medium">Res: {{ preset.resolutionHours }}j</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Main Layout: Form (Left) & Operational Guidance / Smart Ingestion (Right) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left 8 Columns: 3-Step Guided Intake Form -->
      <form @submit.prevent="handleSubmitTicket" class="lg:col-span-8 space-y-6">
        
        <!-- STEP 01: Basic Ticket Details -->
        <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                01
              </span>
              <div>
                <h2 class="text-sm font-bold text-slate-900">Rincian Dasar & Entitas Customer</h2>
                <p class="text-[11px] text-slate-500">Pilih klien dan verifikasi cakupan kontrak SLA yang aktif</p>
              </div>
            </div>
            <span v-if="formDraftSource" class="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
              {{ formDraftSource }}
            </span>
          </div>

          <div class="p-6 space-y-5 text-xs">
            <!-- Customer Selector & Live SLA Contract Banner -->
            <div class="space-y-2">
              <label class="block font-bold text-slate-700">Customer / Perusahaan Klien *</label>
              <select 
                v-model="form.customerId" 
                required 
                @change="handleCustomerChange"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800 text-xs"
              >
                <option value="" disabled>-- Pilih Entitas Customer --</option>
                <option v-for="c in ticketStore.customers" :key="c.id" :value="c.id">
                  {{ c.name }} ({{ c.code }}) - {{ c.serviceContract }}
                </option>
              </select>

              <!-- Live Contract SLA Badge -->
              <div v-if="selectedCustomer" class="p-3 rounded-lg bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                <div class="flex items-center space-x-2">
                  <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <span class="font-mono font-bold text-blue-900 text-[11px] uppercase tracking-wider">
                    ACTIVE CONTRACT SLA: {{ selectedCustomer.contractSla || 'SLA-GOLD-2026' }}
                  </span>
                  <span class="bg-blue-200/80 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                    {{ selectedCustomer.slaTier || '24x7 Mission Critical' }}
                  </span>
                </div>
                <div class="text-[11px] font-medium text-blue-800">
                  {{ selectedCustomer.slaCoverage || 'First Touch ≤ 30m • Resolusi ≤ 4h' }}
                </div>
              </div>
            </div>

            <!-- PIC & Intake Channel -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-700 mb-1">PIC Pelapor (Kontak Klien) *</label>
                <select 
                  v-model="form.customerPicId" 
                  required
                  class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Pilih PIC Pelapor --</option>
                  <option v-for="p in availablePics" :key="p.id" :value="p.id">
                    {{ p.name }} - {{ p.dept }} ({{ p.phone }})
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Saluran Intake (Channel) *</label>
                <select v-model="form.channel" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                  <option value="WHATSAPP">WhatsApp Support (Chat Helpdesk)</option>
                  <option value="EMAIL">Email Support (helpdesk@glotratech.com)</option>
                  <option value="PHONE">Telepon / Dedicated Hotline Call</option>
                  <option value="DIRECT">Informasi Langsung / NOC Monitoring</option>
                </select>
              </div>
            </div>

            <!-- Category & Cluster/Environment -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <select 
                  v-model="form.categoryId" 
                  @change="onCategorySelectChange"
                  required 
                  class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Pilih Kategori Masalah --</option>
                  <option v-for="cat in ticketStore.categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }} ({{ cat.code }})
                  </option>
                  <option value="__ADD_NEW__" class="font-bold text-blue-600 bg-blue-50">
                    + Tambah Kategori Masalah Baru...
                  </option>
                </select>
                <div v-if="selectedCategoryDesc" class="text-[10px] text-slate-500 mt-1 truncate">
                  {{ selectedCategoryDesc }}
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Cluster / Ruang Lingkup Sistem</label>
                <input
                  v-model="form.cluster"
                  type="text"
                  placeholder="Contoh: CKR-PROD-01, Rack A-04"
                  class="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>
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
                    <span class="font-bold text-rose-700">HIGH SEVERITY</span>
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
                    <span class="font-bold text-amber-700">MEDIUM SEVERITY</span>
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
                    <span class="font-bold text-sky-700">LOW SEVERITY</span>
                    <span class="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed">Kendala minor, permohonan konfigurasi atau akun user.</p>
                  <div class="mt-2 text-[10px] font-mono text-sky-700 font-bold">
                    Response ≤ 2h • Resolusi ≤ 24h
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- STEP 02: Detailed Incident Description & Artifacts -->
        <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center space-x-3">
            <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              02
            </span>
            <div>
              <h2 class="text-sm font-bold text-slate-900">Deskripsi Teknis Insiden & Berkas Diagnostik</h2>
              <p class="text-[11px] text-slate-500">Paparkan kronologi, dampak terhadap operasional, dan lampiran bukti</p>
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
                placeholder="Contoh: Server Core Transaction BCA Cabang Thamrin Unreachable"
                class="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
              />
            </div>

            <!-- Description & Diagnostic Narrative -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Deskripsi Teknis & Gejala Gangguan *</label>
              <textarea
                v-model="form.description"
                rows="4"
                required
                placeholder="Jelaskan pesan error yang muncul, log yang teramati, IP atau hostname perangkat, serta estimasi unit kerja yang terimbas..."
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs leading-relaxed"
              ></textarea>
            </div>

            <!-- Drag & Drop Upload Zone -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Lampiran Berkas Diagnostik & Tangkapan Layar</label>
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
                  Mendukung PNG, JPG, PDF, TXT, LOG, PCAP (Maksimal 25MB • Auto-Scanned Safe)
                </div>
              </div>

              <!-- Uploaded Files Preview List -->
              <div v-if="uploadedFiles.length > 0" class="mt-2.5 space-y-2">
                <div 
                  v-for="(f, idx) in uploadedFiles" 
                  :key="idx" 
                  class="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs"
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

        <!-- STEP 03: Assignment & Technology Principal L3 -->
        <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div class="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center space-x-3">
            <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
              03
            </span>
            <div>
              <h2 class="text-sm font-bold text-slate-900">Penugasan Teknisi & Eskalasi Principal (L3 TAC)</h2>
              <p class="text-[11px] text-slate-500">Tugaskan teknisi bertugas dan hubungkan tiket OEM bila membutuhkan eskalasi</p>
            </div>
          </div>

          <div class="p-6 space-y-5 text-xs">
            <!-- Engineer Assignee Selector -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Alokasi Penanganan Teknisi (Engineer On-Duty)</label>
              <select v-model="form.assignedToId" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs">
                <option value="">-- Biarkan Dalam Antrean Terbuka (Triage NOC) --</option>
                <option 
                  v-for="eng in availableEngineers" 
                  :key="eng.id" 
                  :value="eng.id"
                >
                  {{ eng.name }} ({{ eng.roleTitle || 'Support Engineer' }}) • On-Duty
                </option>
              </select>
              <p class="text-[10px] text-slate-400 mt-1">
                Jika teknisi langsung dipilih, status tiket otomatis berubah menjadi <strong>ASSIGNED</strong>.
              </p>
            </div>

            <!-- Email Instant Notification Toggle (SMTP Relay) -->
            <div class="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60">
              <div class="flex items-center space-x-2.5">
                <input 
                  id="emailSyncToggle"
                  v-model="form.isEmailSync"
                  type="checkbox" 
                  class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <div>
                  <label for="emailSyncToggle" class="font-bold text-slate-800 cursor-pointer">
                    Kirim Notifikasi Email Alert Langsung ke Teknisi Bertugas (SMTP Relay)
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
                    class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <div>
                    <label for="principalToggle" class="font-bold text-slate-900 cursor-pointer flex items-center space-x-1.5">
                      <span>Eskalasi ke Technology Principal / OEM Vendor (L3 TAC)</span>
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

              <!-- Principal Form Fields (Revealed when checked) -->
              <div v-if="isPrincipalEscalation" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 animate-in fade-in duration-150">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Vendor Principal *</label>
                  <select v-model="form.principalVendor" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                    <option value="Cisco TAC Global">Cisco TAC Global</option>
                    <option value="Fortinet TAC Enterprise">Fortinet TAC Enterprise</option>
                    <option value="Mikrotik Certified Support">Mikrotik Certified Support</option>
                    <option value="VMware by Broadcom Enterprise">VMware by Broadcom Enterprise</option>
                    <option value="AWS Premium Enterprise Support">AWS Premium Support</option>
                    <option value="Dell EMC Core Support">Dell EMC Core Support</option>
                  </select>
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
                    placeholder="Contoh: Jonathan Reyes (Cisco L3 TAC)"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
              <router-link 
                to="/tickets" 
                class="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
              >
                Batal
              </router-link>

              <button
                type="submit"
                class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all transform active:scale-95 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Terbitkan & Jalankan SLA Tiket</span>
              </button>
            </div>

          </div>
        </div>
      </form>

      <!-- Right 4 Columns: Operational Guidance & Smart Ingestion -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- SLA Realtime Governance Card -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
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
            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Target First Touch</span>
                <span class="font-bold text-slate-900 text-sm font-mono">+{{ targetFirstTouchHours }}</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                P1 REQUIREMENT
              </span>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span class="text-[10px] uppercase font-bold text-slate-500 block">Target Resolusi Tuntas</span>
                <span class="font-bold text-slate-900 text-sm font-mono">+{{ targetResolutionHours }}</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                STANDARD CONTRACT
              </span>
            </div>

            <div class="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900">
              <strong>Ketentuan SLA:</strong> Penghitungan SLA berjalan secara presisi segera setelah tombol terbitkan ditekan. SLA dapat di-pause jika membutuhkan konfirmasi vendor/customer.
            </div>
          </div>
        </div>

        <!-- Smart Ingestion Drawer / Extractor -->
        <div class="bg-indigo-50/60 border border-indigo-200 rounded-xl p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center space-x-1.5">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>Smart Ingestion (Chat / Screenshot)</span>
            </h3>
            <span class="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded">
              OCR READY
            </span>
          </div>

          <p class="text-[11px] text-indigo-800 leading-relaxed">
            Tempelkan pesan santai WhatsApp customer atau unggah tangkapan layar chat untuk diekstrak otomatis ke dalam draft formulir di samping.
          </p>

          <div class="space-y-3">
            <div>
              <label class="block text-[11px] font-bold text-indigo-950 mb-1">Tempelkan Teks Chat WhatsApp:</label>
              <textarea
                v-model="rawChatInput"
                rows="3"
                placeholder="Contoh: halo mas server A cabang Thamrin tiba-tiba offline tidak bisa transaksi urgent tolong..."
                class="w-full text-xs p-2.5 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-indigo-950 mb-1">Atau Pilih Screenshot Error:</label>
              <div 
                class="border border-indigo-200 rounded-lg p-2.5 bg-white text-center cursor-pointer hover:bg-indigo-50/50 transition-colors"
                @click="$refs.screenshotInput.click()"
              >
                <input 
                  ref="screenshotInput" 
                  type="file" 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleScreenshotUpload" 
                />
                <span v-if="!uploadedScreenshotName" class="text-xs text-indigo-600 font-medium">
                  Klik untuk pilih screenshot chat
                </span>
                <span v-else class="text-xs text-emerald-700 font-semibold truncate block">
                  File: {{ uploadedScreenshotName }}
                </span>
              </div>
            </div>

            <button
              type="button"
              @click="simulateExtraction"
              class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>Ekstrak ke Draf Formulir</span>
            </button>
          </div>
        </div>

        <!-- Customer Support Direct Information -->
        <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">Customer Contact Direct</h4>
          <div v-if="selectedCustomer" class="space-y-2 text-xs">
            <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span class="font-bold text-slate-800 block">{{ selectedCustomer.name }}</span>
              <span class="text-[11px] text-slate-500 block">{{ selectedCustomer.address }}</span>
            </div>
            <div v-for="pic in availablePics" :key="pic.id" class="p-2 rounded-lg border border-slate-100 text-[11px] flex justify-between items-center">
              <div>
                <span class="font-bold text-slate-800">{{ pic.name }}</span>
                <span class="text-slate-400 block">{{ pic.dept }}</span>
              </div>
              <span class="font-mono text-slate-600">{{ pic.phone }}</span>
            </div>
          </div>
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
              placeholder="Contoh: VoIP & SIP Trunk Telephony"
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
              <span>Simpan & Pilih Kategori</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <div 
      v-if="categorySuccessToast" 
      class="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs animate-in slide-in-from-bottom-5 duration-200 border border-emerald-700"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      <span class="font-medium">{{ categorySuccessToast }}</span>
      <button @click="categorySuccessToast = ''" class="text-emerald-300 hover:text-white ml-2">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const rawChatInput = ref('');
const uploadedScreenshotName = ref('');
const formDraftSource = ref('');
const showAddCategoryModal = ref(false);
const categorySuccessToast = ref('');
const previousCategoryId = ref(1);
const isPrincipalEscalation = ref(false);
const uploadedFiles = ref([]);

const newCategoryForm = ref({
  name: '',
  code: '',
  desc: ''
});

const form = ref({
  customerId: 1,
  customerPicId: 101,
  channel: 'WHATSAPP',
  categoryId: 1,
  severity: 'HIGH',
  cluster: 'CKR-PROD-01',
  title: '',
  description: '',
  rawMessage: '',
  assignedToId: '',
  isEmailSync: true,
  principalVendor: 'Cisco TAC Global',
  principalCaseId: '',
  principalSpecialist: ''
});

const selectedCustomer = computed(() => {
  return ticketStore.customers.find(item => item.id === Number(form.value.customerId));
});

const availablePics = computed(() => {
  return selectedCustomer.value ? selectedCustomer.value.pics : [];
});

const selectedCategoryDesc = computed(() => {
  const cat = ticketStore.categories.find(c => c.id === Number(form.value.categoryId));
  return cat ? cat.desc : '';
});

const availableEngineers = computed(() => {
  return authStore.users.filter(u => u.roleCode === 'ENGINEER');
});

const targetFirstTouchHours = computed(() => {
  const contract = (selectedCustomer.value?.contractSla || '').toUpperCase();
  if (contract.includes('PLATINUM')) {
    if (form.value.severity === 'HIGH') return '00:30:00';
    if (form.value.severity === 'MEDIUM') return '01:00:00';
    return '01:30:00';
  }
  if (contract.includes('SILVER')) {
    if (form.value.severity === 'HIGH') return '01:00:00';
    if (form.value.severity === 'MEDIUM') return '02:00:00';
    return '04:00:00';
  }
  // Default / GOLD
  if (form.value.severity === 'HIGH') return '00:30:00';
  if (form.value.severity === 'MEDIUM') return '01:00:00';
  return '02:00:00';
});

const targetResolutionHours = computed(() => {
  const contract = (selectedCustomer.value?.contractSla || '').toUpperCase();
  if (contract.includes('PLATINUM')) {
    if (form.value.severity === 'HIGH') return '04:00:00';
    if (form.value.severity === 'MEDIUM') return '06:00:00';
    return '12:00:00';
  }
  if (contract.includes('SILVER')) {
    if (form.value.severity === 'HIGH') return '12:00:00';
    if (form.value.severity === 'MEDIUM') return '16:00:00';
    return '24:00:00';
  }
  // Default / GOLD
  if (form.value.severity === 'HIGH') return '08:00:00';
  if (form.value.severity === 'MEDIUM') return '12:00:00';
  return '24:00:00';
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

const applyPreset = (preset) => {
  form.value.categoryId = preset.categoryId;
  form.value.severity = preset.severity;
  form.value.title = preset.title;
  form.value.description = preset.description;
  formDraftSource.value = `Template: ${preset.title}`;
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

const handleScreenshotUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadedScreenshotName.value = file.name;
    uploadedFiles.value.push({
      id: 'shot-' + Date.now(),
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB'
    });
  }
};

const simulateExtraction = () => {
  const text = rawChatInput.value || 'Pesan dari screenshot error: Server database transaksi down RTO';
  
  form.value.rawMessage = text;
  form.value.title = 'Server Database & Core Service Unreachable';
  form.value.categoryId = 1;
  form.value.severity = 'HIGH';
  form.value.description = `[Hasil Ekstraksi Pesan Kasual WhatsApp]: Terdeteksi kendala server unreachable atau offline.\nPesan Asli: "${text}"`;
  formDraftSource.value = 'Ekstraksi Pintar WhatsApp OCR';

  if (text.toLowerCase().includes('bca')) {
    form.value.customerId = 1;
    handleCustomerChange();
  } else if (text.toLowerCase().includes('siloam')) {
    form.value.customerId = 3;
    handleCustomerChange();
  } else if (text.toLowerCase().includes('banten') || text.toLowerCase().includes('diskominfo')) {
    form.value.customerId = 2;
    handleCustomerChange();
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

  categorySuccessToast.value = `Kategori "${newCat.name}" (${newCat.code}) berhasil ditambahkan dan dipilih.`;
  setTimeout(() => {
    categorySuccessToast.value = '';
  }, 4000);
};

const handleSubmitTicket = () => {
  const payload = {
    ...form.value,
    contractSla: selectedCustomer.value?.contractSla || 'SLA-GOLD-2026',
    contractTier: selectedCustomer.value?.slaTier || '24x7 GOLD ENTERPRISE',
    environment: selectedCustomer.value?.environment || 'PROD-DC-01',
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

  const newTicket = ticketStore.createTicket(payload, authStore.currentUser);
  router.push(`/tickets/${newTicket.id}`);
};
</script>
