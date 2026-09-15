<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-slate-200 pb-4">
      <div>
        <h1 class="text-xl font-bold text-slate-900">Pusat Pembuatan Tiket Layanan (CPIG Ingestion)</h1>
        <p class="text-xs text-slate-500 mt-0.5">Catat laporan customer dari WhatsApp, Email, atau Telepon ke dalam tiket terstruktur</p>
      </div>
      <router-link to="/" class="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1">
        <span>&larr; Kembali ke Dashboard</span>
      </router-link>
    </div>

    <!-- Mode Selector Tabs: Manual Presets vs Smart Extraction -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <!-- Tab 1: Form Manual + Presets Cepat -->
      <div 
        @click="activeMode = 'MANUAL'"
        class="p-4 rounded-xl border-2 cursor-pointer transition-all"
        :class="activeMode === 'MANUAL' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'"
      >
        <div class="flex items-center space-x-2.5 mb-1.5">
          <div class="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="font-bold text-slate-900 text-sm">Mode 1: Formulir Manual & Template Cepat</h3>
        </div>
        <p class="text-xs text-slate-500">Pilih template isu umum (Server Down, Jaringan Lambat, Akun/VPN) untuk pengisian 1-klik.</p>
      </div>

      <!-- Tab 2: Smart Ingestion (Paste Chat / Screenshot) -->
      <div 
        @click="activeMode = 'SMART'"
        class="p-4 rounded-xl border-2 cursor-pointer transition-all"
        :class="activeMode === 'SMART' ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'"
      >
        <div class="flex items-center space-x-2.5 mb-1.5">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="font-bold text-slate-900 text-sm">Mode 2: Smart Ingestion (Paste Chat / Screenshot WA)</h3>
        </div>
        <p class="text-xs text-slate-500">Tempel pesan santai atau screenshot error chat customer. Sistem mengekstrak draft yang bisa diedit sebelum disubmit.</p>
      </div>
    </div>

    <!-- Quick Issue Presets Toolbar (Available in both modes) -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Isu Cepat (Sekali Klik):</span>
        <span class="text-[11px] text-slate-400">Otomatis mengisi Kategori, Severity & SLA</span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          v-for="preset in ticketStore.quickPresets"
          :key="preset.id"
          type="button"
          @click="applyPreset(preset)"
          class="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all group"
        >
          <div class="font-bold text-slate-800 text-xs group-hover:text-blue-600 truncate">{{ preset.title }}</div>
          <div class="flex items-center justify-between mt-1 text-[10px]">
            <span class="font-semibold text-rose-600" v-if="preset.severity === 'HIGH'">HIGH (30m)</span>
            <span class="font-semibold text-amber-600" v-else-if="preset.severity === 'MEDIUM'">MED (1h)</span>
            <span class="font-semibold text-sky-600" v-else>LOW (2h)</span>
            <span class="text-slate-400">Res: {{ preset.resolutionHours }}j</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Smart Ingestion Drawer / Dropzone (Shown if activeMode === 'SMART') -->
    <div v-if="activeMode === 'SMART'" class="bg-indigo-50/60 border-2 border-dashed border-indigo-300 rounded-xl p-5 space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-bold text-indigo-950 text-sm flex items-center space-x-1.5">
            <span>Ekstraktor Pesan Kasual & Screenshot WhatsApp</span>
          </h4>
          <p class="text-xs text-indigo-700 mt-0.5">
            Tempelkan (Ctrl + V) screenshot chat atau paste kalimat chat customer di bawah ini.
          </p>
        </div>
        <span class="bg-indigo-100 text-indigo-800 text-[11px] font-semibold px-2 py-0.5 rounded">Tesseract / Rule Extractor Ready</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Input Area 1: Raw Text Chat -->
        <div>
          <label class="block text-xs font-semibold text-indigo-900 mb-1">Tempelkan Teks Chat WA:</label>
          <textarea
            v-model="rawChatInput"
            rows="3"
            placeholder="Contoh: halo mas, server A cabang Thamrin tiba-tiba mati tidak bisa diakses sama sekali sejak 15 menit lalu tolong..."
            class="w-full text-xs p-2.5 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <!-- Input Area 2: Paste Screenshot / Upload Image -->
        <div>
          <label class="block text-xs font-semibold text-indigo-900 mb-1">Atau Unggah Screenshot Gambar:</label>
          <div 
            class="border border-indigo-200 rounded-lg p-3 bg-white text-center flex flex-col items-center justify-center min-h-[82px] cursor-pointer hover:bg-indigo-50/30"
            @click="$refs.fileInput.click()"
          >
            <input 
              ref="fileInput" 
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleScreenshotUpload" 
            />
            <span v-if="!uploadedScreenshotName" class="text-xs text-indigo-600 font-medium">
              Klik untuk pilih screenshot atau tekan Ctrl+V
            </span>
            <span v-else class="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
              <span>Berkas: {{ uploadedScreenshotName }}</span>
            </span>
            <span class="text-[10px] text-slate-400 mt-0.5">Mendukung PNG, JPG, WebP</span>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-1">
        <button
          type="button"
          @click="simulateExtraction"
          class="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
        >
          <span>Analisis & Ekstrak ke Formulir Draft</span>
        </button>
        <span class="text-[11px] text-indigo-600 italic">
          * Anda tetap memiliki kendali 100% untuk memeriksa & mengedit draf di bawah sebelum disimpan.
        </span>
      </div>
    </div>

    <!-- Main Ticket Draft Form (Interactive & Editable) -->
    <form @submit.prevent="handleSubmitTicket" class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 class="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <span>Formulir Rincian Tiket</span>
          <span v-if="formDraftSource" class="text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            {{ formDraftSource }}
          </span>
        </h3>
        <span class="text-xs text-slate-400 font-mono">Tersimpan dalam UTC+0</span>
      </div>

      <!-- Row 1: Customer & PIC Dropdown -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Customer / Perusahaan Klien *</label>
          <select 
            v-model="form.customerId" 
            required 
            @change="handleCustomerChange"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="" disabled>-- Pilih Customer --</option>
            <option v-for="c in ticketStore.customers" :key="c.id" :value="c.id">
              {{ c.name }} ({{ c.code }})
            </option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">PIC Pelapor (Customer Contact) *</label>
          <select 
            v-model="form.customerPicId" 
            required
            class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Pilih Kontak PIC --</option>
            <option v-for="p in availablePics" :key="p.id" :value="p.id">
              {{ p.name }} - {{ p.dept }} ({{ p.phone }})
            </option>
          </select>
        </div>
      </div>

      <!-- Row 2: Channel, Category, Severity -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Saluran Laporan (Channel) *</label>
          <select v-model="form.channel" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs">
            <option value="WHATSAPP">WhatsApp Support</option>
            <option value="EMAIL">Email Support</option>
            <option value="PHONE">Telepon / Call</option>
            <option value="DIRECT">Informasi Langsung Engineer</option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="font-semibold text-slate-700">Kategori Masalah *</label>
            <button 
              type="button" 
              @click="openAddCategoryModal" 
              class="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center space-x-1 transition-colors group"
              title="Tambahkan kategori baru jika masalah belum terdaftar"
            >
              <svg class="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>+ Kategori Baru</span>
            </button>
          </div>
          <select 
            v-model="form.categoryId" 
            @change="onCategorySelectChange"
            required 
            class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>-- Pilih Kategori --</option>
            <option v-for="cat in ticketStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }} ({{ cat.code }})
            </option>
            <option value="__ADD_NEW__" class="font-bold text-blue-600 bg-blue-50/80">
              + Tambah Kategori Masalah Baru...
            </option>
          </select>
          <div v-if="selectedCategoryDesc" class="text-[10px] text-slate-500 mt-1 flex items-center space-x-1">
            <svg class="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="truncate">{{ selectedCategoryDesc }}</span>
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Tingkat Keparahan (Severity) *</label>
          <select v-model="form.severity" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs font-semibold">
            <option value="HIGH" class="text-rose-600 font-bold">HIGH (Response 30m / Resolusi 4h)</option>
            <option value="MEDIUM" class="text-amber-600 font-bold">MEDIUM (Response 1h / Resolusi 8h)</option>
            <option value="LOW" class="text-sky-600 font-bold">LOW (Response 2h / Resolusi 24h)</option>
          </select>
        </div>
      </div>

      <!-- Row 3: Judul Laporan -->
      <div class="text-xs">
        <label class="block font-semibold text-slate-700 mb-1">Judul Ringkasan Tiket *</label>
        <input
          v-model="form.title"
          type="text"
          required
          placeholder="Contoh: Server Core BCA Cabang Thamrin Offline"
          class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
        />
      </div>

      <!-- Row 4: Deskripsi & Rincian Gejala -->
      <div class="text-xs">
        <label class="block font-semibold text-slate-700 mb-1">Deskripsi & Gejala Gangguan *</label>
        <textarea
          v-model="form.description"
          rows="3"
          required
          placeholder="Rincikan pesan error, dampak terhadap operasional, dan lokasi perangkat..."
          class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      <!-- Row 5: Pesan Mentah Asli (Raw WhatsApp Chat) -->
      <div v-if="form.rawMessage" class="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
        <label class="block font-semibold text-slate-600 mb-1">Teks Chat Asli (Histori Audit):</label>
        <p class="text-slate-500 italic font-mono text-[11px]">{{ form.rawMessage }}</p>
      </div>

      <!-- Row 6: Assignment Langsung ke Teknisi (Opsional) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
        <div>
          <label class="block font-semibold text-slate-700 mb-1">Alokasikan ke Teknisi (Opsional)</label>
          <select v-model="form.assignedToId" class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs">
            <option value="">-- Biarkan Antrean Terbuka (Belum Ditugaskan) --</option>
            <option 
              v-for="eng in availableEngineers" 
              :key="eng.id" 
              :value="eng.id"
            >
              {{ eng.name }} ({{ eng.email }})
            </option>
          </select>
          <span class="text-[10px] text-slate-400 mt-1 block">Jika dipilih, status tiket langsung menjadi ASSIGNED.</span>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1">Referensi Principal / Vendor Case ID (Opsional)</label>
          <input
            v-model="form.principalCaseId"
            type="text"
            placeholder="Contoh: Cisco TAC #99212 / Mikrotik SUP-881"
            class="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="pt-4 border-t border-slate-200 flex items-center justify-between">
        <router-link to="/" class="px-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50 font-medium">
          Batal
        </router-link>

        <button
          type="submit"
          class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all transform active:scale-95 flex items-center space-x-1.5"
        >
          <span>Terbitkan & Simpan Tiket</span>
        </button>
      </div>
    </form>

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

        <!-- Form Tambah Kategori -->
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

const activeMode = ref('MANUAL');
const rawChatInput = ref('');
const uploadedScreenshotName = ref('');
const formDraftSource = ref('');
const showAddCategoryModal = ref(false);
const categorySuccessToast = ref('');
const previousCategoryId = ref(1);
const newCategoryForm = ref({
  name: '',
  code: '',
  desc: ''
});

const selectedCategoryDesc = computed(() => {
  const cat = ticketStore.categories.find(c => c.id === Number(form.value.categoryId));
  return cat ? cat.desc : '';
});

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

const form = ref({
  customerId: 1,
  customerPicId: 101,
  channel: 'WHATSAPP',
  categoryId: 1,
  severity: 'HIGH',
  title: '',
  description: '',
  rawMessage: '',
  assignedToId: '',
  principalCaseId: '',
  uploadedProof: null
});

const availablePics = computed(() => {
  const c = ticketStore.customers.find(item => item.id === Number(form.value.customerId));
  return c ? c.pics : [];
});

const availableEngineers = computed(() => {
  return authStore.users.filter(u => u.roleCode === 'ENGINEER');
});

const handleCustomerChange = () => {
  const pics = availablePics.value;
  if (pics.length > 0) {
    form.value.customerPicId = pics[0].id;
  } else {
    form.value.customerPicId = '';
  }
};

const applyPreset = (preset) => {
  form.value.categoryId = preset.categoryId;
  form.value.severity = preset.severity;
  form.value.title = preset.title;
  form.value.description = preset.description;
  formDraftSource.value = `Template: ${preset.title}`;
};

const handleScreenshotUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    uploadedScreenshotName.value = file.name;
    form.value.uploadedProof = file.name;
  }
};

const simulateExtraction = () => {
  const text = rawChatInput.value || 'Pesan dari screenshot error: Server database transaksi down RTO';
  
  form.value.rawMessage = text;
  form.value.title = 'Server Database & Core Service Unreachable';
  form.value.categoryId = 1;
  form.value.severity = 'HIGH';
  form.value.description = `[Hasil Ekstraksi Pesan]: Terdeteksi kendala koneksi server offline.\nPesan Asli: "${text}"`;
  formDraftSource.value = 'Hasil Ekstraksi Pintar (Silakan Review & Edit)';

  if (text.toLowerCase().includes('bca')) {
    form.value.customerId = 1;
    handleCustomerChange();
  } else if (text.toLowerCase().includes('siloam')) {
    form.value.customerId = 3;
    handleCustomerChange();
  }
};

const handleSubmitTicket = () => {
  const newTicket = ticketStore.createTicket(form.value, authStore.currentUser);
  router.push(`/tickets/${newTicket.id}`);
};
</script>
