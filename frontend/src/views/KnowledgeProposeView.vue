<template>
  <div class="space-y-5 pb-10 animate-in fade-in duration-200">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Propose New Knowledge Base</h1>
          <p class="text-xs text-slate-500 mt-0.5">Buat artikel knowledge base dari pengalaman penanganan insiden, solusi teknis, atau best practice.</p>
        </div>
      </div>
      <router-link
        to="/knowledge-base"
        class="px-3.5 py-2 border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold rounded-xl text-xs transition-colors inline-flex items-center space-x-1.5 self-start"
      >
        <span>&larr; Kembali ke Knowledge Base</span>
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit(false)" class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
      <!-- ============ LEFT COLUMN ============ -->
      <div class="xl:col-span-8 space-y-4">
        <!-- 1. Metode -->
        <section class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h2 class="flex items-center space-x-2 font-bold text-slate-900 text-sm">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">1</span>
            <span>Pilih Metode Pembuatan Knowledge Base</span>
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- PDF -->
            <label
              class="cursor-pointer rounded-xl border-2 p-4 space-y-2 transition-all"
              :class="method === 'pdf' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-2.5">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <p class="font-bold text-xs text-slate-900">Upload Existing Knowledge Base (PDF)</p>
                    <p class="text-[11px] text-slate-500 leading-snug">Saya sudah memiliki dokumen knowledge base (dari template atau hasil dokumentasi).</p>
                  </div>
                </div>
                <input type="radio" value="pdf" v-model="method" class="mt-1 text-blue-600 focus:ring-blue-500" />
              </div>
              <ul class="text-[11px] text-slate-600 space-y-1 pl-1">
                <li v-for="t in pdfBenefits" :key="t" class="flex items-start space-x-1.5"><span class="text-emerald-600 font-bold">&#10003;</span><span>{{ t }}</span></li>
              </ul>
            </label>

            <!-- Manual -->
            <label
              class="cursor-pointer rounded-xl border-2 p-4 space-y-2 transition-all"
              :class="method === 'manual' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start space-x-2.5">
                  <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </div>
                  <div>
                    <p class="font-bold text-xs text-slate-900">Create Knowledge Base Manually</p>
                    <p class="text-[11px] text-slate-500 leading-snug">Saya ingin mengisi Knowledge Base melalui form secara langsung.</p>
                  </div>
                </div>
                <input type="radio" value="manual" v-model="method" class="mt-1 text-blue-600 focus:ring-blue-500" />
              </div>
              <ul class="text-[11px] text-slate-600 space-y-1 pl-1">
                <li v-for="t in manualBenefits" :key="t" class="flex items-start space-x-1.5"><span class="text-emerald-600 font-bold">&#10003;</span><span>{{ t }}</span></li>
              </ul>
            </label>
          </div>
        </section>

        <!-- 2. Upload PDF (hanya metode PDF) -->
        <section v-if="method === 'pdf'" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h2 class="flex items-center space-x-2 font-bold text-slate-900 text-sm">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">2</span>
            <span>Upload Dokumen PDF Knowledge Base</span>
          </h2>

          <div class="flex flex-col sm:flex-row gap-3">
            <div
              @click="pdfInputRef?.click()"
              @dragover.prevent="pdfDragging = true"
              @dragleave.prevent="pdfDragging = false"
              @drop.prevent="onPdfDrop"
              class="flex-1 flex items-center space-x-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all"
              :class="pdfDragging ? 'border-blue-500 bg-blue-50/60' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'"
            >
              <div class="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black text-[10px] border border-rose-100">PDF</div>
              <div>
                <p class="font-bold text-xs text-slate-800">Klik atau drag file PDF ke sini untuk upload</p>
                <p class="text-[10px] text-slate-400">Format: PDF (Maksimal 25MB)</p>
              </div>
              <input ref="pdfInputRef" type="file" accept="application/pdf,.pdf" class="hidden" @change="onPdfPick" />
            </div>

            <a
              href="/templates/GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
              download="GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
              class="px-4 py-3 border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold rounded-xl text-xs transition-colors inline-flex items-center justify-center space-x-1.5 sm:self-center shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span>Download Template KB</span>
            </a>
          </div>

          <p v-if="pdfError" class="text-[11px] text-rose-600 font-medium">{{ pdfError }}</p>

          <div v-if="pdfFile" class="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl">
            <div class="flex items-center space-x-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black text-[9px] border border-rose-100 shrink-0">PDF</div>
              <div class="min-w-0">
                <p class="font-mono font-bold text-xs text-slate-900 truncate">{{ pdfFile.name }}</p>
                <p class="font-mono text-[10px] text-slate-400">{{ formatSize(pdfFile.size) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span v-if="extracting" class="text-[11px] text-blue-600 font-semibold animate-pulse">Mengekstrak...</span>
              <span v-else class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">&#10003;</span>
              <button type="button" @click="removePdf" class="text-slate-400 hover:text-rose-600 text-base leading-none px-1" title="Hapus PDF">&times;</button>
            </div>
          </div>
        </section>

        <!-- 3. Hasil ekstraksi / Informasi dokumen -->
        <section class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between gap-2">
            <h2 class="flex items-center space-x-2 font-bold text-slate-900 text-sm">
              <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">{{ method === 'pdf' ? 3 : 2 }}</span>
              <span>{{ method === 'pdf' ? 'Hasil Ekstraksi & Preview Data' : 'Informasi Dokumen' }}</span>
            </h2>
            <button
              v-if="method === 'pdf' && pdfFile"
              type="button"
              @click="previewPdf"
              class="px-3 py-1.5 border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-[11px] font-semibold"
            >
              Lihat PDF
            </button>
          </div>

          <div v-if="method === 'pdf' && !pdfFile" class="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-[11px] text-slate-500">
            Upload dokumen PDF terlebih dahulu. Metadata dokumen akan terisi otomatis dan dapat Anda koreksi.
          </div>
          <div v-else-if="method === 'pdf' && extractedOnce" class="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 flex items-start space-x-2">
            <span class="font-bold">&#9432;</span>
            <span>Metadata dasar diekstrak dari nama dokumen. Isi detail (Problem, Root Cause, Resolution, dll.) belum dibaca otomatis &mdash; lengkapi atau verifikasi pada bagian Detail Konten.</span>
          </div>

          <div class="grid grid-cols-1 gap-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Judul Runbook &amp; Prosedur <span class="text-rose-500">*</span></label>
              <input v-model="form.title" required type="text" placeholder="Contoh: HPE 3PAR FC Datastore Recovery via CLI" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Kategori Infrastruktur <span class="text-rose-500">*</span></label>
                <select v-model="form.categoryGroup" required class="w-full p-2.5 border border-slate-200 rounded-lg bg-white">
                  <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Principal / Platform Vendor <span class="text-rose-500">*</span></label>
                <input v-model="form.technologyPrincipal" list="kb-principals" required type="text" placeholder="HPE, Cisco, VMware..." class="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
                <datalist id="kb-principals"><option v-for="p in ticketStore.allPrincipals" :key="p" :value="p"></option></datalist>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Produk / Platform <span class="text-rose-500">*</span></label>
                <input v-model="form.productPlatform" required type="text" placeholder="HPE 3PAR" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Versi / Firmware / OS</label>
                <input v-model="form.firmwareVersion" type="text" placeholder="3.3.1" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white font-mono" />
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tipe Case <span class="text-rose-500">*</span></label>
                <select v-model="form.caseType" required class="w-full p-2.5 border border-slate-200 rounded-lg bg-white">
                  <option>Incident</option><option>Problem</option><option>Configuration</option><option>Maintenance</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Tag / Keywords</label>
                <input v-model="form.tagsText" type="text" placeholder="3PAR, FC, Datastore, Recovery" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
              </div>
            </div>
          </div>
        </section>

        <!-- 4. Detail Konten -->
        <section class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h2 class="flex items-center space-x-2 font-bold text-slate-900 text-sm">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">{{ method === 'pdf' ? 4 : 3 }}</span>
            <span>Detail Konten Knowledge Base</span>
          </h2>

          <div class="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button
              v-for="tab in contentTabs"
              :key="tab.id"
              type="button"
              @click="activeTab = tab.id"
              class="flex-1 min-w-[96px] px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
              :class="activeTab === tab.id ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-white'"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Problem & Symptom -->
          <div v-show="activeTab === 'problem'" class="space-y-3 text-xs">
            <div>
              <div class="flex justify-between mb-1">
                <label class="font-semibold text-slate-700">Gejala Kerusakan / Symptom Description <span class="text-rose-500">*</span></label>
                <span class="font-mono text-[11px] text-slate-400">{{ form.symptom.length }}/2000</span>
              </div>
              <textarea v-model="form.symptom" maxlength="2000" rows="4" placeholder="Datastore unreachable, high I/O latency, multipath error pada host ESXi." class="w-full p-3 border border-slate-200 rounded-lg bg-white"></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div><label class="block font-semibold text-slate-700 mb-1">Error Code / Alert</label><input v-model="form.errorCode" type="text" class="w-full p-2.5 border border-slate-200 rounded-lg font-mono" /></div>
              <div><label class="block font-semibold text-slate-700 mb-1">Environment</label><input v-model="form.environment" type="text" class="w-full p-2.5 border border-slate-200 rounded-lg" /></div>
              <div><label class="block font-semibold text-slate-700 mb-1">Impact / Scope</label><input v-model="form.impactScope" type="text" class="w-full p-2.5 border border-slate-200 rounded-lg" /></div>
            </div>
          </div>

          <!-- Root Cause -->
          <div v-show="activeTab === 'root'" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Pre-Check / Prerequisite</label>
              <textarea v-model="form.prerequisites" rows="2" placeholder="Akses, backup, atau pemeriksaan sebelum troubleshooting." class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Troubleshooting / Diagnostic Steps</label>
              <textarea v-model="form.diagnosticSteps" rows="3" class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Root Cause Analysis</label>
              <textarea v-model="form.rootCause" rows="3" class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
            </div>
          </div>

          <!-- Resolution -->
          <div v-show="activeTab === 'resolution'" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Resolution Steps</label>
              <textarea v-model="form.resolutionSteps" rows="4" class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">CLI / Command Snippet</label>
              <textarea v-model="form.cliSnippet" rows="4" class="w-full p-3 border border-slate-800 bg-slate-950 text-slate-100 rounded-lg font-mono text-[11px]"></textarea>
            </div>
          </div>

          <!-- Verification -->
          <div v-show="activeTab === 'verification'" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Verification Procedure</label>
              <textarea v-model="form.verificationSteps" rows="3" class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Expected Result</label>
              <textarea v-model="form.expectedResult" rows="2" class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
            </div>
          </div>

          <!-- Rollback -->
          <div v-show="activeTab === 'rollback'" class="text-xs">
            <label class="block font-semibold text-slate-700 mb-1">Rollback Procedure</label>
            <textarea v-model="form.rollbackProcedure" rows="5" class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
          </div>

          <!-- Risk -->
          <div v-show="activeTab === 'risk'" class="text-xs">
            <label class="block font-semibold text-slate-700 mb-1">Risk / Potential Impact</label>
            <textarea v-model="form.riskPotentialImpact" rows="5" class="w-full p-3 border border-slate-200 rounded-lg"></textarea>
          </div>
        </section>
      </div>

      <!-- ============ RIGHT COLUMN ============ -->
      <div class="xl:col-span-4 space-y-4">
        <!-- Preview -->
        <section class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <h2 class="font-bold text-slate-900 text-sm">Preview Konten yang Diekstrak</h2>
          <dl class="border border-slate-200 rounded-xl divide-y divide-slate-100 text-[11px]">
            <div v-for="row in previewRows" :key="row.label" class="grid grid-cols-[84px_1fr] gap-2 px-3 py-1.5">
              <dt class="font-semibold text-slate-500">{{ row.label }}</dt>
              <dd class="text-slate-800" :class="previewExpanded ? 'whitespace-pre-line' : 'truncate'">{{ row.value || '—' }}</dd>
            </div>
          </dl>
          <button type="button" @click="previewExpanded = !previewExpanded" class="text-[11px] font-semibold text-blue-600 hover:underline">
            {{ previewExpanded ? 'Ringkas tampilan' : 'Lihat semua hasil ekstraksi' }} &rarr;
          </button>
        </section>

        <!-- 5. Related ticket -->
        <section class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
          <h2 class="flex items-center space-x-2 font-bold text-slate-900 text-sm">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">5</span>
            <span>Related Ticket / Case</span>
          </h2>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Related Ticket / Case ID</label>
              <select v-model="related.ticketId" @change="onTicketChange" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white font-mono text-[11px]">
                <option value="">— Tanpa tiket —</option>
                <option v-for="t in selectableTickets" :key="t.id" :value="t.ticketNumber">{{ t.ticketNumber }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tanggal Case</label>
              <input v-model="related.caseDate" type="date" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Engineer</label>
              <select v-model="related.engineerName" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white">
                <option v-for="e in engineers" :key="e.id" :value="e.name">{{ e.name }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Customer / Mitra (Opsional)</label>
              <input v-model="related.customerName" type="text" placeholder="PT ABC / Internal" class="w-full p-2.5 border border-slate-200 rounded-lg bg-white" />
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-1">
              <label class="font-semibold text-slate-700">Deskripsi Singkat Case</label>
              <span class="font-mono text-[11px] text-slate-400">{{ related.description.length }}/500</span>
            </div>
            <textarea v-model="related.description" maxlength="500" rows="3" class="w-full p-2.5 border border-slate-200 rounded-lg"></textarea>
          </div>
        </section>

        <!-- 6. Supporting docs -->
        <section class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
          <h2 class="flex items-center space-x-2 font-bold text-slate-900 text-sm">
            <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">6</span>
            <span>Supporting Document &amp; Evidence (Opsional)</span>
          </h2>

          <div
            @click="docInputRef?.click()"
            @dragover.prevent="docDragging = true"
            @dragleave.prevent="docDragging = false"
            @drop.prevent="onDocDrop"
            class="p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all"
            :class="docDragging ? 'border-blue-500 bg-blue-50/60' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'"
          >
            <div class="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <p class="font-bold text-slate-800">Klik atau drag file ke sini untuk upload</p>
            <p class="text-[10px] text-slate-400">Format: PDF, DOC/DOCX, TXT, LOG, PNG, JPG. Maksimal 25MB per file (maksimal {{ MAX_DOCS }} file)</p>
            <input ref="docInputRef" type="file" multiple accept=".pdf,.doc,.docx,.txt,.log,.png,.jpg,.jpeg" class="hidden" @change="onDocPick" />
          </div>
          <p v-if="docError" class="text-[11px] text-rose-600 font-medium">{{ docError }}</p>

          <div v-if="docs.length" class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-[11px]">
              <thead class="bg-slate-50 text-slate-500">
                <tr>
                  <th class="text-left font-semibold px-2.5 py-1.5">Nama File</th>
                  <th class="text-left font-semibold px-2 py-1.5">Tipe</th>
                  <th class="text-left font-semibold px-2 py-1.5">Deskripsi</th>
                  <th class="text-center font-semibold px-2 py-1.5">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(d, i) in docs" :key="d.id">
                  <td class="px-2.5 py-1.5 font-mono text-slate-800 max-w-[110px] truncate" :title="d.file.name">{{ d.file.name }}</td>
                  <td class="px-2 py-1.5"><span class="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-600">{{ d.type }}</span></td>
                  <td class="px-2 py-1.5"><input v-model="d.description" type="text" placeholder="Deskripsi" class="w-full border-0 border-b border-slate-200 focus:border-blue-500 focus:ring-0 text-[11px] p-0.5 bg-transparent" /></td>
                  <td class="px-2 py-1.5 text-center whitespace-nowrap">
                    <button type="button" @click="downloadDoc(d)" class="text-blue-600 hover:text-blue-800 px-1" title="Unduh">&#8681;</button>
                    <button type="button" @click="docs.splice(i, 1)" class="text-rose-500 hover:text-rose-700 px-1" title="Hapus">&times;</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-2.5">
          <router-link to="/knowledge-base" class="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs">Batal</router-link>
          <button type="button" @click="handleSubmit(true)" class="px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold rounded-xl text-xs cursor-pointer">Simpan Draft</button>
          <button type="submit" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer">Submit for Review</button>
        </div>
        <p v-if="formError" class="text-[11px] text-rose-600 font-medium text-right">{{ formError }}</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { api } from '../services/api';

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const MAX_BYTES = 25 * 1024 * 1024;
const MAX_DOCS = 5;

const pdfBenefits = [
  'Sistem akan membaca isi PDF secara otomatis',
  'Data akan diisi ke form (draft)',
  'Anda dapat melakukan review dan edit jika diperlukan',
  'Tidak perlu mengisi form dari awal'
];
const manualBenefits = [
  'Isi form sesuai struktur yang disediakan',
  'Sistem akan menghasilkan dokumen PDF otomatis',
  'Cocok untuk pembuatan cepat tanpa dokumen awal'
];
const categories = [
  'SAN & Enterprise Storage',
  'VMware & Hypervisors',
  'Network & Switches',
  'Backup & DR',
  'Database & Middleware',
  'Security & Firewall'
];
const contentTabs = [
  { id: 'problem', label: 'Problem & Symptom' },
  { id: 'root', label: 'Root Cause' },
  { id: 'resolution', label: 'Resolution Steps' },
  { id: 'verification', label: 'Verification' },
  { id: 'rollback', label: 'Rollback' },
  { id: 'risk', label: 'Risk & Impact' }
];

const method = ref('pdf');
const activeTab = ref('problem');
const formError = ref('');

const form = reactive({
  title: '',
  categoryGroup: 'SAN & Enterprise Storage',
  technologyPrincipal: '',
  productPlatform: '',
  firmwareVersion: '',
  caseType: 'Incident',
  tagsText: '',
  symptom: '',
  errorCode: '',
  environment: '',
  impactScope: '',
  prerequisites: '',
  diagnosticSteps: '',
  rootCause: '',
  resolutionSteps: '',
  cliSnippet: '',
  verificationSteps: '',
  expectedResult: '',
  rollbackProcedure: '',
  riskPotentialImpact: ''
});

const related = reactive({
  ticketId: '',
  caseDate: new Date().toISOString().slice(0, 10),
  engineerName: authStore.currentUser?.name || '',
  customerName: '',
  description: ''
});

// ---- Related ticket (engineer hanya melihat tiket miliknya) ----
const selectableTickets = computed(() => {
  if (authStore.isEngineer) {
    return ticketStore.tickets.filter(t => t.assignedToId === authStore.currentUser?.id);
  }
  return ticketStore.tickets;
});
const engineers = computed(() => authStore.users.filter(u => u.roleCode === 'ENGINEER'));

const onTicketChange = () => {
  const t = ticketStore.tickets.find(x => x.ticketNumber === related.ticketId);
  if (!t) return;
  const customer = ticketStore.customers.find(c => c.id === t.customerId);
  const eng = authStore.users.find(u => u.id === t.assignedToId);
  related.customerName = customer?.name || related.customerName;
  if (eng) related.engineerName = eng.name;
  if (!related.description) related.description = (t.title || '').slice(0, 500);
  if (t.createdAt) related.caseDate = String(t.createdAt).slice(0, 10);
};

// ---- PDF upload & simulated metadata extraction ----
const pdfInputRef = ref(null);
const pdfFile = ref(null);
const pdfError = ref('');
const pdfDragging = ref(false);
const extracting = ref(false);
const extractedOnce = ref(false);

const VENDORS = ['HPE', 'Cisco', 'VMware', 'NetApp', 'Brocade', 'Rubrik', 'Veeam', 'Fortinet', 'Dell', 'Huawei', 'Oracle'];
const CATEGORY_HINTS = [
  { re: /(3par|primera|san|storage|netapp|brocade|fc\b)/i, cat: 'SAN & Enterprise Storage' },
  { re: /(esxi|vmware|vcenter|vsan|psod)/i, cat: 'VMware & Hypervisors' },
  { re: /(switch|vlan|bgp|router|network)/i, cat: 'Network & Switches' },
  { re: /(backup|rubrik|veeam|commvault|dr\b)/i, cat: 'Backup & DR' },
  { re: /(sql|oracle|database|middleware)/i, cat: 'Database & Middleware' },
  { re: /(firewall|fortigate|security)/i, cat: 'Security & Firewall' }
];

const formatSize = (b) => (b > 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

const acceptPdf = (file) => {
  pdfError.value = '';
  if (!file) return;
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!isPdf) { pdfError.value = 'Format tidak valid. Hanya file PDF yang diperbolehkan.'; return; }
  if (file.size > MAX_BYTES) { pdfError.value = 'Ukuran file melebihi batas 25MB.'; return; }
  pdfFile.value = file;
  runExtraction(file);
};
const onPdfPick = (e) => { acceptPdf(e.target.files[0]); e.target.value = ''; };
const onPdfDrop = (e) => { pdfDragging.value = false; acceptPdf(e.dataTransfer?.files?.[0]); };

// Ekstraksi di sisi klien (demo): hanya membaca metadata dari nama file.
const runExtraction = (file) => {
  extracting.value = true;
  setTimeout(() => {
    const base = file.name.replace(/\.pdf$/i, '');
    const versionMatch = base.match(/[-_ ]v?(\d+(?:\.\d+)+)$/i);
    const cleaned = base.replace(/^KB[-_ ]/i, '').replace(/[-_ ]v?\d+(?:\.\d+)+$/i, '');
    const words = cleaned.split(/[-_ ]+/).filter(Boolean);

    if (!form.title) form.title = words.join(' ');
    const vendor = VENDORS.find(v => words.some(w => w.toLowerCase() === v.toLowerCase()));
    if (vendor && !form.technologyPrincipal) form.technologyPrincipal = vendor;
    const hint = CATEGORY_HINTS.find(h => h.re.test(cleaned));
    if (hint) form.categoryGroup = hint.cat;
    if (vendor && !form.productPlatform) {
      const idx = words.findIndex(w => w.toLowerCase() === vendor.toLowerCase());
      form.productPlatform = words.slice(idx, idx + 2).join(' ');
    }
    if (!form.firmwareVersion && versionMatch) form.firmwareVersion = versionMatch[1];
    if (!form.tagsText) form.tagsText = words.slice(0, 5).join(', ');

    extracting.value = false;
    extractedOnce.value = true;
  }, 700);
};

const removePdf = () => { pdfFile.value = null; extractedOnce.value = false; pdfError.value = ''; };
const previewPdf = () => {
  if (!pdfFile.value) return;
  const url = URL.createObjectURL(pdfFile.value);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

// ---- Supporting documents ----
const docInputRef = ref(null);
const docs = ref([]);
const docError = ref('');
const docDragging = ref(false);
let docSeq = 0;

const addDocs = (files) => {
  docError.value = '';
  for (const file of files) {
    if (docs.value.length >= MAX_DOCS) { docError.value = `Maksimal ${MAX_DOCS} file pendukung.`; break; }
    if (file.size > MAX_BYTES) { docError.value = `${file.name} melebihi batas 25MB.`; continue; }
    const ext = (file.name.split('.').pop() || '').toUpperCase();
    docs.value.push({ id: ++docSeq, file, type: ext, description: '' });
  }
};
const onDocPick = (e) => { addDocs(Array.from(e.target.files || [])); e.target.value = ''; };
const onDocDrop = (e) => { docDragging.value = false; addDocs(Array.from(e.dataTransfer?.files || [])); };
const downloadDoc = (d) => {
  const url = URL.createObjectURL(d.file);
  const a = document.createElement('a');
  a.href = url;
  a.download = d.file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ---- Preview panel ----
const previewExpanded = ref(false);
const previewRows = computed(() => [
  { label: 'Judul', value: form.title },
  { label: 'Kategori', value: form.categoryGroup },
  { label: 'Vendor', value: form.technologyPrincipal },
  { label: 'Produk', value: form.productPlatform },
  { label: 'Versi', value: form.firmwareVersion },
  { label: 'Symptom', value: form.symptom },
  { label: 'Root Cause', value: form.rootCause },
  { label: 'Resolution', value: form.resolutionSteps }
]);

// ---- Submit ----
const handleSubmit = async (asDraft) => {
  formError.value = '';
  if (method.value === 'pdf' && !pdfFile.value && !asDraft) {
    formError.value = 'Upload dokumen PDF terlebih dahulu atau pilih metode manual.';
    return;
  }
  const required = [
    ['title', 'Judul'], ['technologyPrincipal', 'Principal / Vendor'], ['productPlatform', 'Produk / Platform']
  ];
  if (!asDraft) required.push(['symptom', 'Symptom']);
  const missing = required.filter(([k]) => !String(form[k] || '').trim()).map(([, l]) => l);
  if (missing.length) {
    formError.value = `Lengkapi field wajib: ${missing.join(', ')}.`;
    if (missing.includes('Symptom')) activeTab.value = 'problem';
    return;
  }

  const { tagsText, ...rest } = form;
  const payload = {
    ...rest,
    tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
    relatedTicketId: related.ticketId,
    caseDate: related.caseDate,
    engineerName: related.engineerName,
    customerName: related.customerName,
    caseDescription: related.description,
    creationMethod: method.value === 'pdf' ? 'PDF_UPLOAD' : 'MANUAL',
    uploadedDocName: pdfFile.value?.name || docs.value[0]?.file.name || '',
    supportingDocs: docs.value.map(d => ({ name: d.file.name, type: d.type, description: d.description, size: formatSize(d.file.size) })),
    saveAsDraft: asDraft
  };

  let created = null;
  try {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, typeof v === 'object' ? JSON.stringify(v) : (v ?? '')));
    if (pdfFile.value) fd.append('pdfFile', pdfFile.value);
    docs.value.forEach(d => fd.append('supportingFiles', d.file));
    const res = await api.createArticle(fd);
    created = res.data;
  } catch (err) {
    console.warn('[KnowledgeBase] Gagal submit ke backend, fallback local store:', err.message);
  }

  const item = ticketStore.proposeNewArticle(payload, authStore.currentUser);
  if (created?.id) item.id = created.id;
  router.push({ path: '/knowledge-base', query: { created: item.id } });
};
</script>
