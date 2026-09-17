<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <h1 class="text-xl font-bold text-slate-900">Knowledge Base & Dokumentasi Solusi</h1>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">Pusat Referensi Teknis</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Koleksi solusi terverifikasi dari riwayat penanganan tiket terdokumentasi (Ticket Resolution Flow) dan panduan SOP teknis.
        </p>
      </div>

      <!-- Search Bar -->
      <div class="relative w-full md:w-80">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari solusi, symptom, atau error code..."
          class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
      <button
        @click="selectedCategory = ''"
        class="px-3.5 py-1.5 rounded-lg font-medium transition-all"
        :class="selectedCategory === '' ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
      >
        Semua Kategori ({{ ticketStore.knowledgeBase.length }})
      </button>
      <button
        v-for="cat in ticketStore.categories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all"
        :class="selectedCategory === cat.id ? 'bg-blue-600 text-white font-bold shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in filteredArticles"
        :key="item.id"
        class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {{ item.categoryName }}
            </span>
            <span 
              class="text-[10px] font-bold px-2 py-0.5 rounded"
              :class="item.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
            >
              {{ item.status === 'PUBLISHED' ? 'Verified Solution' : 'Draft (Perlu Review Lead)' }}
            </span>
          </div>

          <h3 class="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer" @click="viewDetail(item)">
            {{ item.title }}
          </h3>

          <!-- Sumber Asal Solusi (Alur Knowledge Base) -->
          <div class="text-[11px] text-indigo-700 bg-indigo-50/70 px-2 py-1 rounded border border-indigo-100 flex items-center space-x-1 font-mono">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <span>Asal Data: {{ item.source || 'Pengajuan Tiket Penanganan' }}</span>
          </div>

          <p class="text-xs text-slate-600 line-clamp-2">
            <strong class="text-slate-700">Gejala:</strong> {{ item.symptom }}
          </p>

          <div class="bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <p><strong class="text-slate-700">Akar Masalah:</strong> {{ item.rootCause }}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div class="text-[11px] text-slate-400">
            Penulis: <span class="text-slate-600 font-medium">{{ item.author }}</span>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- Publish Button (Admin/CPIG only for Drafts) -->
            <button
              v-if="item.status === 'DRAFT' && authStore.currentUser.roleCode === 'ADMIN'"
              @click="publishArticle(item.id)"
              class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold transition-colors"
            >
              Setujui & Publish
            </button>
            <button
              @click="viewDetail(item)"
              class="text-blue-600 hover:text-blue-800 font-semibold text-xs"
            >
              Baca Solusi &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: View Article Detail -->
    <div v-if="selectedArticle" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span class="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">{{ selectedArticle.categoryName }}</span>
            <h3 class="font-bold text-slate-900 text-base mt-1">{{ selectedArticle.title }}</h3>
            <p class="text-slate-400 text-[11px] mt-0.5">
              Penulis: {{ selectedArticle.author }} • Sumber: {{ selectedArticle.source || 'Tiket Penanganan Selesai' }}
            </p>
          </div>
          <button @click="selectedArticle = null" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>

        <div class="space-y-3 text-slate-700">
          <div>
            <h4 class="font-bold text-slate-900 text-xs uppercase text-slate-500 mb-1">Gejala Kerusakan (Symptom)</h4>
            <p class="bg-slate-50 p-3 rounded-lg border border-slate-100">{{ selectedArticle.symptom }}</p>
          </div>

          <div>
            <h4 class="font-bold text-slate-900 text-xs uppercase text-slate-500 mb-1">Akar Masalah (Root Cause)</h4>
            <p class="bg-slate-50 p-3 rounded-lg border border-slate-100">{{ selectedArticle.rootCause }}</p>
          </div>

          <div>
            <h4 class="font-bold text-slate-900 text-xs uppercase text-slate-500 mb-1">Langkah Penyelesaian Teknis</h4>
            <pre class="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-[11px] whitespace-pre-wrap">{{ selectedArticle.resolutionSteps }}</pre>
          </div>

          <div v-if="selectedArticle.recommendation">
            <h4 class="font-bold text-slate-900 text-xs uppercase text-slate-500 mb-1">Rekomendasi Preventif</h4>
            <p class="bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-100">{{ selectedArticle.recommendation }}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-end">
          <button @click="selectedArticle = null" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedArticle = ref(null);

const filteredArticles = computed(() => {
  return ticketStore.knowledgeBase.filter(item => {
    if (selectedCategory.value && item.categoryId !== selectedCategory.value) return false;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSymptom = item.symptom.toLowerCase().includes(q);
      const matchRoot = item.rootCause.toLowerCase().includes(q);
      if (!matchTitle && !matchSymptom && !matchRoot) return false;
    }
    return true;
  });
});

const viewDetail = (item) => {
  selectedArticle.value = item;
};

const publishArticle = (id) => {
  ticketStore.publishKbArticle(id, authStore.currentUser);
  alert('Artikel Knowledge Base berhasil diverifikasi dan dipublikasikan!');
};
</script>
