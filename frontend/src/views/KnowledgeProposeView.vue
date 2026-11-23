<template>
  <div class="space-y-6 pb-12 animate-in fade-in duration-200">
    <!-- Page Header & Navigation -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0112.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Upload Dokumen Knowledge Base</h1>
          <p class="text-xs text-slate-500 mt-0.5">Unggah berkas runbook / SOP teknis pendukung operasional helpdesk multi-vendor.</p>
        </div>
      </div>

      <router-link
        to="/knowledge-base"
        class="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors inline-flex items-center space-x-1.5 self-start cursor-pointer shadow-2xs"
      >
        <span>&larr; Kembali ke Knowledge Base</span>
      </router-link>
    </div>

    <!-- Main Upload & Form Container -->
    <form @submit.prevent="handleSubmit(false)" class="max-w-4xl mx-auto space-y-6">
      <!-- Section 1: Upload File Dokumen Runbook -->
      <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Upload Berkas Dokumen Runbook</span>
              <span class="text-rose-500 font-bold">*</span>
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5 pl-8">
              Pilih dokumen runbook (.docx, .doc, atau .pdf) sesuai dengan standar template resmi.
            </p>
          </div>

          <!-- Official Template Download Button -->
          <a
            href="/templates/GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
            download="GTT_Knowledge_Base_Engineering_Runbook_Template.docx"
            class="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-blue-700 font-semibold rounded-xl text-xs border border-blue-200 shadow-2xs transition-all flex items-center justify-center space-x-1.5 self-start shrink-0 cursor-pointer"
            title="Unduh file dokumen template resmi (.docx)"
          >
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Unduh Template KB (.docx)</span>
          </a>
        </div>

        <!-- Drag & Drop Upload Zone -->
        <div
          v-if="!docFile"
          @click="fileInputRef?.click()"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onFileDrop"
          class="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
          :class="isDragging ? 'border-blue-500 bg-blue-50/60 ring-4 ring-blue-500/10' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'"
        >
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <p class="font-bold text-sm text-slate-800">Klik atau seret file dokumen ke sini</p>
          <p class="text-xs text-slate-500 mt-1">Mendukung format: <strong class="text-slate-700">DOCX, DOC, PDF</strong> (Maksimal 15MB)</p>
          <input
            ref="fileInputRef"
            type="file"
            accept=".docx,.doc,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf"
            class="hidden"
            @change="onFilePick"
          />
        </div>

        <!-- Selected File Preview Card -->
        <div
          v-else
          class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in duration-150"
        >
          <div class="flex items-center space-x-3.5 min-w-0">
            <!-- Icon Badge based on file extension -->
            <div
              class="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border"
              :class="isWordFile ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
            >
              {{ isWordFile ? 'DOCX' : 'PDF' }}
            </div>
            <div class="min-w-0">
              <p class="font-bold text-xs sm:text-sm text-slate-900 truncate" :title="docFile.name">
                {{ docFile.name }}
              </p>
              <div class="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                <span>{{ formatSize(docFile.size) }}</span>
                <span>•</span>
                <span class="text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                  Dokumen siap diunggah
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              @click="fileInputRef?.click()"
              class="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer shadow-2xs"
            >
              Ganti File
            </button>
            <button
              type="button"
              @click="removeFile"
              class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
              title="Hapus berkas"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept=".docx,.doc,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,application/pdf"
            class="hidden"
            @change="onFilePick"
          />
        </div>

        <p v-if="fileError" class="text-xs text-rose-600 font-medium pl-8">{{ fileError }}</p>
      </section>

      <!-- Section 2: Informasi Pendukung Dokumen -->
      <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 class="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
            <span>Informasi Pendukung</span>
          </h2>
          <p class="text-[11px] text-slate-500 mt-0.5 pl-8">
            Lengkapi atribut pendukung dan tautkan ke kasus tiket untuk memperkaya referensi operasional.
          </p>
        </div>

        <div class="space-y-4 text-xs pt-1">
          <!-- 1. Pengait ke Kasus Tiket (Opsional, Terutama Tiket yang Sudah Selesai) -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="block font-semibold text-slate-700">
                Kaitkan ke Kasus Tiket <span class="text-slate-400 font-normal">(Opsional — Rujukan Kasus Selesai / Eksisting)</span>
              </label>
              <span v-if="selectedTicketInfo" class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Tiket Dikaitkan
              </span>
            </div>

            <BaseSelect
              v-model="form.sourceTicket"
              :options="ticketOptions"
              searchable
              placeholder="Pilih tiket rujukan (utamakan tiket yang sudah selesai / resolved)..."
              @change="onTicketChange"
            />

            <!-- Info box when ticket is selected -->
            <div v-if="selectedTicketInfo" class="mt-2.5 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start space-x-2.5 text-xs text-blue-900 animate-in fade-in duration-200">
              <div class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                ✓
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 flex-wrap">
                  <span class="font-mono font-bold text-blue-700">{{ selectedTicketInfo.ticketNumber }}</span>
                  <span class="text-slate-400">•</span>
                  <span class="font-semibold text-slate-800 truncate">{{ selectedTicketInfo.title }}</span>
                  <span
                    class="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase font-mono"
                    :class="selectedTicketInfo.status === 'CLOSED' || selectedTicketInfo.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'"
                  >
                    {{ selectedTicketInfo.status }}
                  </span>
                </div>
                <p class="text-[11px] text-blue-800/80 mt-1">
                  Dokumen ini akan otomatis muncul sebagai referensi solusi pada tiket ini dan kasus serupa lainnya di panel <em>Related Knowledge Base</em>.
                </p>
              </div>
              <button
                type="button"
                @click="form.sourceTicket = ''; onTicketChange()"
                class="text-blue-500 hover:text-rose-600 font-bold text-xs p-1 cursor-pointer"
                title="Batalkan pengaitan tiket"
              >
                &times;
              </button>
            </div>
          </div>

          <!-- 2. Judul Dokumen -->
          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Judul Dokumen / Runbook <span class="text-rose-500 font-bold">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              placeholder="Contoh: Prosedur Troubleshooting Datastore Recovery HPE 3PAR FC"
              class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- 3. Grid Informasi Pendukung (Tipe Case, Kategori, Produk) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Tipe Case (Dinamis List Lokal, Add/Delete, BaseSelect Standar Project) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between min-h-[22px]">
                <label class="block font-semibold text-slate-700 text-xs">
                  Tipe Case <span class="text-rose-500 font-bold">*</span>
                </label>
                <button
                  v-if="!isAddingCaseType"
                  type="button"
                  @click="isAddingCaseType = true"
                  class="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Tambah opsi tipe case baru"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  <span>Tambah Opsi</span>
                </button>
              </div>

              <!-- Inline Add Input Tipe Case -->
              <div v-if="isAddingCaseType" class="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold text-blue-900">Tambah Tipe Case:</span>
                  <button @click="isAddingCaseType = false; newCaseTypeName = ''" type="button" class="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">&times;</button>
                </div>
                <div class="flex items-center space-x-1.5">
                  <input
                    v-model="newCaseTypeName"
                    type="text"
                    placeholder="Misal: Incident, Problem, Request..."
                    @keydown.enter.prevent="handleAddCaseType"
                    class="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    @click="handleAddCaseType"
                    :disabled="!newCaseTypeName.trim()"
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              <!-- Empty State Tipe Case -->
              <div v-else-if="caseTypesList.length === 0" class="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                <p class="text-[11px] text-slate-500 mb-1.5">Belum ada tipe case</p>
                <button
                  type="button"
                  @click="isAddingCaseType = true"
                  class="px-2.5 py-1 bg-white border border-slate-200 hover:bg-blue-50 text-blue-600 font-bold text-[11px] rounded-lg shadow-2xs cursor-pointer inline-flex items-center space-x-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  <span>Tambah Opsi</span>
                </button>
              </div>

              <!-- Standard Project Dropdown (BaseSelect) & Tag Pills -->
              <div v-else class="space-y-1.5">
                <BaseSelect
                  v-model="form.caseType"
                  :options="caseTypeOptions"
                  placeholder="-- Pilih Tipe Case --"
                  menu-width-class="w-full"
                />

                <div class="flex flex-wrap gap-1 pt-0.5 max-h-20 overflow-y-auto">
                  <span
                    v-for="item in caseTypesList"
                    :key="item.id || item.name"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] transition-colors shadow-2xs"
                    :class="form.caseType === item.name ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'"
                  >
                    <span @click="form.caseType = item.name" class="cursor-pointer">{{ item.name }}</span>
                    <button
                      type="button"
                      @click.stop="handleDeleteCaseType(item)"
                      class="text-slate-400 hover:text-rose-600 font-bold ml-1.5 cursor-pointer leading-none"
                      title="Hapus opsi ini dari database"
                    >
                      &times;
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Kategori (Dinamis Database MySQL kb_options, Add/Delete, BaseSelect Standar Project) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between min-h-[22px]">
                <label class="block font-semibold text-slate-700 text-xs">
                  Kategori <span class="text-rose-500 font-bold">*</span>
                </label>
                <button
                  v-if="!isAddingCategory"
                  type="button"
                  @click="isAddingCategory = true"
                  class="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Tambah opsi kategori baru"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  <span>Tambah Opsi</span>
                </button>
              </div>

              <!-- Inline Add Input Kategori -->
              <div v-if="isAddingCategory" class="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-bold text-blue-900">Tambah Kategori Baru:</span>
                  <button @click="isAddingCategory = false; newCategoryName = ''" type="button" class="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">&times;</button>
                </div>
                <div class="flex items-center space-x-1.5">
                  <input
                    v-model="newCategoryName"
                    type="text"
                    placeholder="Misal: Storage, Network, Server, Security..."
                    @keydown.enter.prevent="handleAddCategory"
                    class="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    @click="handleAddCategory"
                    :disabled="!newCategoryName.trim()"
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg disabled:opacity-50 cursor-pointer shadow-2xs"
                  >
                    Simpan
                  </button>
                </div>
              </div>

              <!-- Empty State Kategori -->
              <div v-else-if="categoriesList.length === 0" class="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center">
                <p class="text-[11px] text-slate-500 mb-1.5">Belum ada kategori</p>
                <button
                  type="button"
                  @click="isAddingCategory = true"
                  class="px-2.5 py-1 bg-white border border-slate-200 hover:bg-blue-50 text-blue-600 font-bold text-[11px] rounded-lg shadow-2xs cursor-pointer inline-flex items-center space-x-1"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  <span>Tambah Opsi</span>
                </button>
              </div>

              <!-- Standard Project Dropdown (BaseSelect) & Tag Pills -->
              <div v-else class="space-y-1.5">
                <BaseSelect
                  v-model="form.category"
                  :options="categoryOptions"
                  searchable
                  placeholder="-- Pilih Kategori --"
                  menu-width-class="w-full"
                />

                <div class="flex flex-wrap gap-1 pt-0.5 max-h-20 overflow-y-auto">
                  <span
                    v-for="item in categoriesList"
                    :key="item.id || item.name"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] transition-colors shadow-2xs"
                    :class="form.category === item.name ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'"
                  >
                    <span @click="form.category = item.name" class="cursor-pointer">{{ item.name }}</span>
                    <button
                      type="button"
                      @click.stop="handleDeleteCategory(item)"
                      class="text-slate-400 hover:text-rose-600 font-bold ml-1.5 cursor-pointer leading-none"
                      title="Hapus opsi ini dari database"
                    >
                      &times;
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <!-- Produk / Platform (Free Text Murni) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between min-h-[22px]">
                <label class="block font-semibold text-slate-700 text-xs">
                  Produk / Platform <span class="text-rose-500 font-bold">*</span>
                </label>
                <span class="text-[10px] font-medium text-slate-400">Hardware / OS</span>
              </div>
              <input
                v-model="form.product"
                type="text"
                required
                placeholder="Contoh: HPE 3PAR, FortiGate, Cisco Nexus, VMware..."
                class="w-full px-3 py-2.5 min-h-[42px] border border-slate-200 rounded-xl bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
              />
              <span class="text-[10px] text-slate-400 block pt-0.5">Teks bebas nama merk, tipe hardware, atau sistem software.</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-2">
        <router-link
          to="/knowledge-base"
          class="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
        >
          Batal
        </router-link>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
        >
          <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <span>{{ isSubmitting ? 'Mengunggah...' : 'Upload Dokumen' }}</span>
        </button>
      </div>

      <p v-if="formError" class="text-xs text-rose-600 font-medium text-right">{{ formError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { useUiStore } from '../stores/uiStore';
import { api } from '../services/api';
import BaseSelect from '../components/BaseSelect.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();

const MAX_BYTES = 15 * 1024 * 1024; // 15MB

const fileInputRef = ref(null);
const docFile = ref(null);
const fileError = ref('');
const isDragging = ref(false);
const isSubmitting = ref(false);
const formError = ref('');

const caseTypesList = ref([]);
const categoriesList = ref([]);

const caseTypeOptions = computed(() => {
  return [
    { value: '', label: '-- Pilih Tipe Case --' },
    ...caseTypesList.value.map(item => ({
      value: item.name,
      label: item.name,
      badge: 'Case'
    }))
  ];
});

const categoryOptions = computed(() => {
  return [
    { value: '', label: '-- Pilih Kategori --' },
    ...categoriesList.value.map(item => ({
      value: item.name,
      label: item.name,
      badge: 'Kategori'
    }))
  ];
});

const isAddingCaseType = ref(false);
const newCaseTypeName = ref('');

const isAddingCategory = ref(false);
const newCategoryName = ref('');

const fetchOptionsFromApi = async () => {
  try {
    const res = await api.getKbOptions();
    const all = Array.isArray(res) ? res : (res?.data || []);
    caseTypesList.value = all.filter(o => o.type === 'CASE_TYPE');
    categoriesList.value = all.filter(o => o.type === 'CATEGORY');

    if (!form.caseType && caseTypesList.value.length > 0) {
      form.caseType = caseTypesList.value[0].name;
    }
    if (!form.category && categoriesList.value.length > 0) {
      form.category = categoriesList.value[0].name;
    }
  } catch (e) {
    console.warn('Gagal memuat opsi KB dari database:', e);
  }
};

const handleAddCaseType = async () => {
  const val = newCaseTypeName.value.trim();
  if (!val) return;
  try {
    const res = await api.createKbOption({ type: 'CASE_TYPE', name: val });
    const created = res?.data || res;
    if (!caseTypesList.value.some(c => c.name.toLowerCase() === val.toLowerCase())) {
      caseTypesList.value.push(created);
    }
    form.caseType = val;
  } catch (e) {
    console.error('Failed add case type to database:', e);
    if (!caseTypesList.value.some(c => c.name.toLowerCase() === val.toLowerCase())) {
      caseTypesList.value.push({ id: Date.now(), name: val });
    }
    form.caseType = val;
  }
  newCaseTypeName.value = '';
  isAddingCaseType.value = false;
};

const handleDeleteCaseType = async (item) => {
  try {
    if (item.id) {
      await api.deleteKbOption(item.id);
    }
  } catch (e) {
    console.error('Failed delete case type from database:', e);
  }
  caseTypesList.value = caseTypesList.value.filter(c => c.name !== item.name);
  if (form.caseType === item.name) {
    form.caseType = caseTypesList.value[0]?.name || '';
  }
};

const handleAddCategory = async () => {
  const val = newCategoryName.value.trim();
  if (!val) return;
  try {
    const res = await api.createKbOption({ type: 'CATEGORY', name: val });
    const created = res?.data || res;
    if (!categoriesList.value.some(c => c.name.toLowerCase() === val.toLowerCase())) {
      categoriesList.value.push(created);
    }
    form.category = val;
  } catch (e) {
    console.error('Failed add category to database:', e);
    if (!categoriesList.value.some(c => c.name.toLowerCase() === val.toLowerCase())) {
      categoriesList.value.push({ id: Date.now(), name: val });
    }
    form.category = val;
  }
  newCategoryName.value = '';
  isAddingCategory.value = false;
};

const handleDeleteCategory = async (item) => {
  try {
    if (item.id) {
      await api.deleteKbOption(item.id);
    }
  } catch (e) {
    console.error('Failed delete category from database:', e);
  }
  categoriesList.value = categoriesList.value.filter(c => c.name !== item.name);
  if (form.category === item.name) {
    form.category = categoriesList.value[0]?.name || '';
  }
};

const form = reactive({
  title: '',
  caseType: '',
  category: '',
  product: '',
  sourceTicket: ''
});

const isWordFile = computed(() => {
  if (!docFile.value) return false;
  return /\.(docx|doc)$/i.test(docFile.value.name);
});

const formatSize = (b) => {
  if (!b) return '0 KB';
  return b > 1024 * 1024
    ? (b / 1024 / 1024).toFixed(1) + ' MB'
    : Math.max(1, Math.round(b / 1024)) + ' KB';
};

const selectedTicketInfo = computed(() => {
  if (!form.sourceTicket) return null;
  return (ticketStore.tickets || []).find(t => t.ticketNumber === form.sourceTicket) || null;
});

const ticketOptions = computed(() => {
  const allTickets = ticketStore.tickets || [];
  const completed = allTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');
  const others = allTickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');

  const options = [
    { value: '', label: '— Tanpa Rujukan Tiket (Dokumen SOP Standar Umum) —' }
  ];

  completed.forEach(t => {
    options.push({
      value: t.ticketNumber,
      label: `${t.ticketNumber} - ${t.title}`,
      subtext: `[SELESAI] • Mitra: ${t.customerName || t.customer?.name || '-'} • Kat: ${t.category || '-'}`,
      badge: 'Selesai',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    });
  });

  others.forEach(t => {
    options.push({
      value: t.ticketNumber,
      label: `${t.ticketNumber} - ${t.title}`,
      subtext: `[${t.status}] • Mitra: ${t.customerName || t.customer?.name || '-'} • Kat: ${t.category || '-'}`,
      badge: t.status,
      badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200'
    });
  });

  return options;
});

const onTicketChange = () => {
  if (!form.sourceTicket) return;
  const t = (ticketStore.tickets || []).find(x => x.ticketNumber === form.sourceTicket);
  if (!t) return;

  // Auto-suggest title if empty or previously generated
  if (!form.title || form.title.startsWith('SOP Penanganan:')) {
    form.title = `SOP Penanganan: ${t.title}`;
  }
  // Auto-fill product if empty
  if (!form.product && (t.deviceModel || t.principalVendor)) {
    form.product = t.deviceModel || t.principalVendor;
  }
  // Match category if appropriate
  const ticketCategory = typeof t.category === 'string' ? t.category : (t.category?.name || t.categoryName || '');
  if (ticketCategory) {
    const existing = categoriesList.value.find(c => c.name.toLowerCase() === ticketCategory.toLowerCase());
    if (existing) {
      form.category = existing.name;
    } else {
      api.createKbOption({ type: 'CATEGORY', name: ticketCategory })
        .then(res => {
          const created = res?.data || res;
          categoriesList.value.push(created);
          form.category = ticketCategory;
        })
        .catch(() => {
          form.category = ticketCategory;
        });
    }
  }
};

const acceptFile = (file) => {
  fileError.value = '';
  if (!file) return;

  const validExts = ['.docx', '.doc', '.pdf'];
  const ext = (file.name.substring(file.name.lastIndexOf('.')) || '').toLowerCase();

  if (!validExts.includes(ext)) {
    fileError.value = 'Format berkas tidak valid. Harap pilih dokumen Word (.docx, .doc) atau PDF (.pdf).';
    return;
  }

  if (file.size > MAX_BYTES) {
    fileError.value = 'Ukuran berkas melebihi batas maksimal 15MB.';
    return;
  }

  docFile.value = file;

  // Auto-fill title if empty from clean filename
  if (!form.title) {
    const rawName = file.name.replace(/\.[^/.]+$/, '');
    form.title = rawName.replace(/[-_]/g, ' ').trim();
  }
};

const onFilePick = (e) => {
  acceptFile(e.target.files?.[0]);
  e.target.value = '';
};

const onFileDrop = (e) => {
  isDragging.value = false;
  acceptFile(e.dataTransfer?.files?.[0]);
};

const removeFile = () => {
  docFile.value = null;
  fileError.value = '';
};

onMounted(async () => {
  await fetchOptionsFromApi();

  if (!ticketStore.tickets || ticketStore.tickets.length === 0) {
    await ticketStore.fetchTickets();
  }
  if (!ticketStore.knowledgeBase || ticketStore.knowledgeBase.length === 0) {
    await ticketStore.fetchKnowledgeBase();
  }

  // Jika ada kategori atau tipe case di dokumen database yang belum tercatat di kb_options, sinkronkan ke database
  for (const k of (ticketStore.knowledgeBase || [])) {
    if (k.caseType && !caseTypesList.value.some(c => c.name.toLowerCase() === k.caseType.toLowerCase())) {
      try {
        const res = await api.createKbOption({ type: 'CASE_TYPE', name: k.caseType });
        const created = res?.data || res;
        caseTypesList.value.push(created);
      } catch (e) {}
    }
    if (k.category && !categoriesList.value.some(c => c.name.toLowerCase() === k.category.toLowerCase())) {
      try {
        const res = await api.createKbOption({ type: 'CATEGORY', name: k.category });
        const created = res?.data || res;
        categoriesList.value.push(created);
      } catch (e) {}
    }
  }

  if (!form.caseType && caseTypesList.value.length > 0) {
    form.caseType = caseTypesList.value[0].name;
  }
  if (!form.category && categoriesList.value.length > 0) {
    form.category = categoriesList.value[0].name;
  }

  if (route.query.ticketNumber) {
    form.sourceTicket = String(route.query.ticketNumber);
    onTicketChange();
  }
});

const handleSubmit = async () => {
  formError.value = '';

  if (!docFile.value) {
    formError.value = 'Harap pilih berkas dokumen /runbook terlebih dahulu.';
    return;
  }

  if (!form.title || !form.title.trim()) {
    formError.value = 'Judul dokumen wajib diisi.';
    return;
  }

  if (!form.category) {
    formError.value = 'Kategori wajib dipilih atau ditambahkan.';
    return;
  }

  if (!form.caseType) {
    formError.value = 'Tipe case wajib dipilih atau ditambahkan.';
    return;
  }

  if (!form.product || !form.product.trim()) {
    formError.value = 'Produk / platform wajib diisi.';
    return;
  }

  isSubmitting.value = true;
  try {
    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('caseType', form.caseType);
    fd.append('category', form.category);
    fd.append('product', form.product.trim());
    fd.append('sourceTicket', form.sourceTicket || '');

    if (docFile.value) {
      fd.append('file', docFile.value);
    }

    let createdArticle = null;
    try {
      const res = await api.createArticle(fd);
      createdArticle = res?.data || res;
    } catch (apiErr) {
      console.warn('[KnowledgeBase] Gagal submit ke backend REST API, menggunakan fallback pinia store:', apiErr);
    }

    // Refresh store from backend or fallback
    await ticketStore.fetchKnowledgeBase();

    // Fallback store update if needed
    if (!createdArticle || !ticketStore.knowledgeBase.some(k => k.id === createdArticle.id)) {
      ticketStore.proposeNewArticle({
        title: form.title.trim(),
        caseType: form.caseType,
        category: form.category,
        product: form.product.trim(),
        sourceTicket: form.sourceTicket || null,
        uploadedDocName: docFile.value?.name || null,
        uploadedDocSize: formatSize(docFile.value?.size)
      }, authStore.currentUser);
    }

    uiStore.toastSuccess('Dokumen Knowledge Base berhasil diunggah.');
    router.push('/knowledge-base');
  } catch (err) {
    console.error('Submit KB error:', err);
    formError.value = 'Terjadi kesalahan saat mengunggah dokumen. Silakan coba lagi.';
    uiStore.toastError('Gagal mengunggah dokumen Knowledge Base.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
