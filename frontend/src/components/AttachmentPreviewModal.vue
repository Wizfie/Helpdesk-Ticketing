<template>
  <div v-if="activeFile" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
    <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
      <!-- Modal Header -->
      <div class="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center space-x-2.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <svg v-if="isTextLog" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <svg v-else-if="isPdf" class="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="min-w-0">
            <h4 class="font-bold text-sm text-slate-100 flex items-center space-x-2 truncate">
              <span class="truncate">{{ fileName }}</span>
              <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                {{ fileCategory || (isTextLog ? 'Console Log' : (isPdf ? 'Dokumen PDF' : 'Image/Bukti')) }}
              </span>
            </h4>
            <p class="text-[11px] text-slate-400 truncate">
              {{ uploader ? `Diunggah oleh ${uploader}` : 'Bukti terverifikasi digital GTT' }}
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-2 shrink-0 ml-3">
          <!-- Download Button in Header -->
          <a
            :href="fileUrl"
            :download="fileName"
            target="_blank"
            class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
            title="Unduh Berkas ke Komputer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Unduh</span>
          </a>

          <!-- Close Button -->
          <button 
            type="button"
            @click="$emit('close')" 
            class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-5 overflow-y-auto flex-1 bg-slate-50 space-y-4">
        <!-- Text / Log Viewer -->
        <div v-if="isTextLog" class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">Format: Text / Log File</span>
            <div class="flex items-center space-x-2">
              <button
                type="button"
                @click="copyLogContent"
                class="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded hover:bg-slate-100 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>{{ copied ? '✓ Tersalin!' : 'Salin Isi Log' }}</span>
              </button>
              <a
                :href="fileUrl"
                :download="fileName"
                class="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Unduh {{ fileName.endsWith('.log') ? '.log' : '.txt' }}</span>
              </a>
            </div>
          </div>
          <!-- Render konten teks jika berhasil diambil, atau tampilkan link unduh -->
          <div v-if="textContent" class="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
            <pre>{{ textContent }}</pre>
          </div>
          <div v-else class="bg-slate-950 text-slate-400 p-6 rounded-xl text-center border border-slate-800">
            <p class="text-xs mb-3">Preview tidak tersedia di browser. Klik tombol di bawah untuk mengunduh berkas.</p>
            <a :href="fileUrl" :download="fileName" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh {{ fileName }}</span>
            </a>
          </div>
        </div>

        <!-- PDF / Document Card -->
        <div v-else-if="isPdf" class="space-y-4 py-4">
          <div class="border border-slate-200 rounded-2xl bg-white p-6 shadow-sm text-center space-y-4">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-800 text-sm">{{ fileName }}</h4>
              <p class="text-xs text-slate-400 mt-1">Dokumen PDF &bull; Klik tombol di bawah untuk mengunduh</p>
            </div>
            <a
              :href="fileUrl"
              :download="fileName"
              class="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh Dokumen PDF</span>
            </a>
          </div>
        </div>

        <!-- Image Preview -->
        <div v-else class="space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">Format: Berkas Gambar / Tangkapan Layar</span>
            <a
              :href="fileUrl"
              :download="fileName"
              class="px-2.5 py-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Unduh Berkas</span>
            </a>
          </div>
          
          <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center p-3 shadow-inner min-h-[220px]">
            <img 
              :src="fileUrl" 
              :alt="fileName" 
              class="max-h-[380px] w-auto max-w-full object-contain rounded-lg shadow-lg"
              @error="imgError = true"
            />
          </div>
          <p v-if="imgError" class="text-xs text-center text-slate-500">Gambar tidak dapat dimuat. Pastikan backend berjalan dan berkas tersedia.</p>
        </div>

        <!-- Storage & Security Notice -->
        <div class="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3 flex items-start space-x-2.5 text-xs text-blue-900">
          <svg class="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-[11px] leading-relaxed">
            <strong>Penyimpanan Persisten GTT:</strong> Berkas bukti ini tersimpan dan terenkripsi aman dalam sistem pelaporan Helpdesk PT Global Transformasi Teknologi.
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <span class="text-slate-400 font-mono text-[11px]">
          Target: {{ ticketNumber || '-' }}
        </span>
        <div class="flex items-center space-x-2">
          <a
            :href="fileUrl"
            :download="fileName"
            target="_blank"
            class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>Unduh Berkas</span>
          </a>
          <button 
            type="button"
            @click="$emit('close')" 
            class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { getUploadUrl } from '../services/api';

const props = defineProps({
  file: {
    type: [String, Object],
    default: null
  },
  attachment: {
    type: Object,
    default: null
  },
  ticketNumber: {
    type: String,
    default: ''
  }
});

defineEmits(['close']);

const copied = ref(false);
const imgError = ref(false);
const textContent = ref('');

const activeFile = computed(() => props.file || props.attachment);

const fileName = computed(() => {
  if (!activeFile.value) return '';
  if (typeof activeFile.value === 'string') return activeFile.value;
  return activeFile.value.name || activeFile.value.originalName || 'berkas';
});

const uploader = computed(() => {
  if (typeof activeFile.value === 'object' && activeFile.value) {
    return activeFile.value.uploadedBy;
  }
  return null;
});

const fileCategory = computed(() => {
  if (typeof activeFile.value === 'object' && activeFile.value) {
    return activeFile.value.source;
  }
  return null;
});

const isTextLog = computed(() => {
  const name = fileName.value.toLowerCase();
  return name.endsWith('.txt') || name.endsWith('.log') || name.endsWith('.rsc');
});

const isPdf = computed(() => {
  const name = fileName.value.toLowerCase();
  return name.endsWith('.pdf');
});

// URL real ke file di backend — mendukung localhost & production domain via getUploadUrl
const fileUrl = computed(() => {
  if (!fileName.value) return '';
  // Jika attachment sudah memiliki url/path langsung, gunakan itu
  if (typeof activeFile.value === 'object' && activeFile.value?.url) {
    return getUploadUrl(activeFile.value.url);
  }
  return getUploadUrl(fileName.value);
});

// Auto-fetch konten teks jika tipe log/txt
watch(fileUrl, async (url) => {
  textContent.value = '';
  imgError.value = false;
  if (isTextLog.value && url) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        textContent.value = await res.text();
      }
    } catch {
      textContent.value = '';
    }
  }
}, { immediate: true });

const copyLogContent = async () => {
  try {
    const toCopy = textContent.value || fileName.value;
    await navigator.clipboard.writeText(toCopy);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  } catch (err) {
    console.error(err);
  }
};
</script>
