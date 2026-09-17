<template>
  <div class="space-y-6 max-w-7xl mx-auto pb-12">
    <!-- Top Header Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link to="/tickets" class="hover:text-blue-600 transition-colors">Admin Settings</router-link>
          <span>/</span>
          <span class="text-slate-800">Enterprise Accounts</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <span>Enterprise Accounts Directory</span>
          <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            MSA CONTRACTS
          </span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Manajemen portofolio mitra korporat, alokasi tier kontrak SLA, cluster infrastruktur, dan kontak PIC darurat.
        </p>
      </div>

      <div class="flex items-center space-x-3">
        <button
          @click="showAddCustomerModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Tambah Mitra Korporat</span>
        </button>
      </div>
    </div>

    <!-- 3 Account Portfolio KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ACTIVE ACCOUNTS</span>
          <span class="text-2xl font-black text-slate-900 font-mono mt-0.5 block">{{ ticketStore.customers.length }} Klien Mitra</span>
          <span class="text-[11px] text-emerald-600 font-medium">100% kontrak PKS aktif &amp; enforceable</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">SLA COMPLIANCE</span>
          <span class="text-2xl font-black text-slate-900 font-mono mt-0.5 block">99.4%</span>
          <span class="text-[11px] text-blue-600 font-medium">Melampaui target korporat 98.0%</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">MANAGED DATA CENTERS</span>
          <span class="text-2xl font-black text-slate-900 font-mono mt-0.5 block">8 Dedicated Nodes</span>
          <span class="text-[11px] text-purple-600 font-medium">Cluster DC Jabodetabek &amp; Banten</span>
        </div>
        <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama klien, kode instansi, atau cluster..."
          class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
        />
        <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>

      <div class="flex items-center space-x-2">
        <select v-model="filterIndustry" class="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs">
          <option value="">Semua Sektor Industri</option>
          <option value="Perbankan">Perbankan / Finansial</option>
          <option value="Pemerintahan">Pemerintahan / Publik</option>
          <option value="Kesehatan">Kesehatan / Rumah Sakit</option>
          <option value="Otomotif">Otomotif &amp; Korporasi</option>
        </select>

        <select v-model="filterTier" class="px-3 py-2 border border-slate-200 rounded-lg bg-white text-xs">
          <option value="">Semua Tier Kontrak</option>
          <option value="PLATINUM">Platinum 24x7</option>
          <option value="GOLD">Gold 8x5</option>
          <option value="SILVER">Silver Standard</option>
        </select>
      </div>
    </div>

    <!-- Enterprise Accounts Table (Dense ITIL Layout) -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider font-mono">
            <tr>
              <th class="px-5 py-3">Client Entity &amp; Code</th>
              <th class="px-5 py-3">Industry Sector</th>
              <th class="px-5 py-3">Contract Tier &amp; Coverage</th>
              <th class="px-5 py-3">Production Cluster</th>
              <th class="px-5 py-3">Primary Contacts (PICs)</th>
              <th class="px-5 py-3 text-center">Active Tickets</th>
              <th class="px-5 py-3 text-center">Account Status</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr 
              v-for="c in filteredCustomers" 
              :key="c.id"
              class="hover:bg-blue-50/20 transition-colors"
            >
              <!-- Name & Code -->
              <td class="px-5 py-3.5">
                <div class="font-bold text-slate-900 text-xs">{{ c.name }}</div>
                <div class="flex items-center space-x-1.5 mt-0.5 text-[10px] font-mono">
                  <span class="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">{{ c.code }}</span>
                  <span class="text-slate-400 truncate max-w-xs">{{ c.address }}</span>
                </div>
              </td>

              <!-- Industry -->
              <td class="px-5 py-3.5 text-slate-600 font-medium">
                {{ c.industry || 'Klien Korporat' }}
              </td>

              <!-- Contract SLA Tier -->
              <td class="px-5 py-3.5">
                <span 
                  class="font-mono font-bold text-[10px] px-2 py-0.5 rounded"
                  :class="c.contractSla?.includes('PLATINUM') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ c.contractSla || 'SLA-GOLD-2026' }}
                </span>
                <span class="block text-[10px] text-slate-500 font-mono mt-0.5">
                  {{ c.slaCoverage || 'First Touch ≤ 30m • Res ≤ 4h' }}
                </span>
              </td>

              <!-- Cluster -->
              <td class="px-5 py-3.5 font-mono text-slate-700 font-semibold text-[11px]">
                {{ c.cluster || 'PROD-CL01' }}
              </td>

              <!-- PICs list preview -->
              <td class="px-5 py-3.5">
                <div class="space-y-1">
                  <div v-for="pic in c.pics.slice(0, 1)" :key="pic.id" class="text-[11px]">
                    <span class="font-bold text-slate-800">{{ pic.name }}</span>
                    <span class="text-slate-400 block text-[10px]">{{ pic.phone }} &bull; {{ pic.dept }}</span>
                  </div>
                  <button 
                    @click="openPicListModal(c)"
                    class="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>Lihat Semua PIC ({{ c.pics.length }}) &rarr;</span>
                  </button>
                </div>
              </td>

              <!-- Active Tickets Count -->
              <td class="px-5 py-3.5 text-center">
                <span 
                  class="font-mono font-black text-xs px-2.5 py-1 rounded-full"
                  :class="getActiveTicketCount(c.id) > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'"
                >
                  {{ getActiveTicketCount(c.id) }} Open
                </span>
              </td>

              <!-- Status -->
              <td class="px-5 py-3.5 text-center">
                <span class="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  ACTIVE • MANAGED
                </span>
              </td>

              <!-- Actions -->
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end space-x-1.5">
                  <button
                    @click="openEditCustomerModal(c)"
                    class="text-blue-600 hover:text-blue-800 font-bold text-xs p-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <router-link
                    :to="`/tickets?customer=${c.code}`"
                    class="text-slate-500 hover:text-slate-800 font-medium text-xs p-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    Tiket
                  </router-link>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal 1: Add Customer -->
    <div v-if="showAddCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tambah Perusahaan Mitra Baru</h4>
          <button @click="showAddCustomerModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitAddCustomer" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan *</label>
            <input v-model="newCustomer.name" required type="text" placeholder="Contoh: PT Telekomunikasi Selular" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Singkat *</label>
              <input v-model="newCustomer.code" required type="text" placeholder="TELKOMSEL" class="w-full p-2 border border-slate-200 rounded-lg text-xs uppercase" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Sektor Industri *</label>
              <input v-model="newCustomer.industry" required type="text" placeholder="Telekomunikasi" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Paket Kontrak SLA *</label>
              <select v-model="newCustomer.contractSla" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
                <option value="SLA-PLATINUM-2026">SLA-PLATINUM-2026 (24x7)</option>
                <option value="SLA-GOLD-2026">SLA-GOLD-2026 (8x5)</option>
                <option value="SLA-SILVER-2026">SLA-SILVER-2026 (Standard)</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Production Cluster</label>
              <input v-model="newCustomer.cluster" type="text" placeholder="TSEL-DC-01" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alamat Gedung / Kantor *</label>
            <textarea v-model="newCustomer.address" rows="2" placeholder="Alamat lengkap lokasi instalasi..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="border-t border-slate-100 pt-2 space-y-2">
            <span class="font-bold text-slate-700 block">Data PIC Pelapor Awal:</span>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="newCustomer.picName" required type="text" placeholder="Nama PIC (Bpk. ...)" class="p-2 border border-slate-200 rounded-lg text-xs" />
              <input v-model="newCustomer.picPhone" required type="text" placeholder="No. HP WhatsApp PIC" class="p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="newCustomer.picDept" required type="text" placeholder="Departemen / Divisi" class="p-2 border border-slate-200 rounded-lg text-xs" />
              <input v-model="newCustomer.picEmail" required type="email" placeholder="Email PIC" class="p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showAddCustomerModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Simpan Mitra</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Edit Customer -->
    <div v-if="showEditCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Edit Data Mitra Korporat</h4>
          <button @click="showEditCustomerModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitEditCustomer" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan *</label>
            <input v-model="editCustomerForm.name" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Singkat *</label>
              <input v-model="editCustomerForm.code" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs uppercase font-mono" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Sektor Industri *</label>
              <input v-model="editCustomerForm.industry" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Paket Kontrak SLA *</label>
              <select v-model="editCustomerForm.contractSla" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
                <option value="SLA-PLATINUM-2026">SLA-PLATINUM-2026 (24x7)</option>
                <option value="SLA-GOLD-2026">SLA-GOLD-2026 (8x5)</option>
                <option value="SLA-SILVER-2026">SLA-SILVER-2026 (Standard)</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Production Cluster</label>
              <input v-model="editCustomerForm.cluster" type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alamat Gedung / Kantor *</label>
            <textarea v-model="editCustomerForm.address" rows="2" class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showEditCustomerModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Perbarui Data</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: View & Manage PICs -->
    <div v-if="showPicModal && activeCustomer" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Kontak PIC Terdaftar - {{ activeCustomer.name }}</h4>
            <p class="text-[11px] text-slate-500">Daftar PIC resmi yang berwenang melapor dan menerima update tiket</p>
          </div>
          <button @click="showPicModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <div class="space-y-2.5 max-h-72 overflow-y-auto">
          <div 
            v-for="pic in activeCustomer.pics" 
            :key="pic.id"
            class="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
          >
            <div>
              <div class="font-bold text-slate-900">{{ pic.name }}</div>
              <div class="text-[11px] text-slate-500">{{ pic.dept }} &bull; {{ pic.email }}</div>
            </div>
            <span class="font-mono text-slate-700 font-semibold text-xs">{{ pic.phone }}</span>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex justify-between items-center">
          <button
            @click="openAddPicModal(activeCustomer)"
            class="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold hover:bg-blue-100 transition-colors"
          >
            + Tambah PIC Baru
          </button>
          <button @click="showPicModal = false" class="px-4 py-1.5 bg-slate-800 text-white rounded-lg font-bold">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Add PIC -->
    <div v-if="showAddPicModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tambah PIC Baru</h4>
          <button @click="showAddPicModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitAddPic" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap PIC *</label>
            <input v-model="newPic.name" required type="text" placeholder="Bpk. / Ibu ..." class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Departemen / Divisi *</label>
            <input v-model="newPic.dept" required type="text" placeholder="IT Ops / Infrastruktur" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">No. Handphone (WhatsApp) *</label>
            <input v-model="newPic.phone" required type="text" placeholder="0812-..." class="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono" />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alamat Email PIC *</label>
            <input v-model="newPic.email" required type="email" placeholder="pic@perusahaan.com" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showAddPicModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Simpan PIC</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { useAuthStore } from '../stores/authStore';

const ticketStore = useTicketStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const filterIndustry = ref('');
const filterTier = ref('');

const showAddCustomerModal = ref(false);
const showEditCustomerModal = ref(false);
const showPicModal = ref(false);
const showAddPicModal = ref(false);
const activeCustomer = ref(null);

const newCustomer = ref({
  name: '',
  code: '',
  industry: '',
  contractSla: 'SLA-PLATINUM-2026',
  cluster: '',
  address: '',
  picName: '',
  picPhone: '',
  picDept: '',
  picEmail: ''
});

const editCustomerForm = ref({
  id: null,
  name: '',
  code: '',
  industry: '',
  contractSla: '',
  cluster: '',
  address: ''
});

const newPic = ref({
  name: '',
  dept: '',
  phone: '',
  email: ''
});

const filteredCustomers = computed(() => {
  return ticketStore.customers.filter(c => {
    const q = searchQuery.value.toLowerCase();
    const matchQuery = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.cluster && c.cluster.toLowerCase().includes(q));
    const matchIndustry = !filterIndustry.value || (c.industry && c.industry.includes(filterIndustry.value));
    const matchTier = !filterTier.value || (c.contractSla && c.contractSla.includes(filterTier.value));
    return matchQuery && matchIndustry && matchTier;
  });
});

const getActiveTicketCount = (customerId) => {
  return ticketStore.tickets.filter(t => t.customerId === customerId && !['RESOLVED', 'CLOSED'].includes(t.status)).length;
};

const openEditCustomerModal = (customer) => {
  editCustomerForm.value = {
    id: customer.id,
    name: customer.name,
    code: customer.code,
    industry: customer.industry || 'Klien Korporat',
    contractSla: customer.contractSla || 'SLA-PLATINUM-2026',
    cluster: customer.cluster || 'PROD-CL01',
    address: customer.address || ''
  };
  showEditCustomerModal.value = true;
};

const submitEditCustomer = () => {
  const cust = ticketStore.customers.find(c => c.id === editCustomerForm.value.id);
  if (cust) {
    cust.name = editCustomerForm.value.name;
    cust.code = editCustomerForm.value.code;
    cust.industry = editCustomerForm.value.industry;
    cust.contractSla = editCustomerForm.value.contractSla;
    cust.cluster = editCustomerForm.value.cluster;
    cust.address = editCustomerForm.value.address;
  }
  showEditCustomerModal.value = false;
};

const submitAddCustomer = () => {
  const newId = ticketStore.customers.length + 1;
  ticketStore.customers.push({
    id: newId,
    name: newCustomer.value.name,
    code: newCustomer.value.code.toUpperCase(),
    industry: newCustomer.value.industry,
    serviceContract: 'PKS Layanan Managed Service',
    contractSla: newCustomer.value.contractSla,
    slaTier: newCustomer.value.contractSla.includes('PLATINUM') ? '24x7 PLATINUM MISSION CRITICAL' : '8x5 GOLD ENTERPRISE',
    slaCoverage: newCustomer.value.contractSla.includes('PLATINUM') ? 'First Touch ≤ 30m • Resolusi ≤ 4h' : 'First Touch ≤ 1h • Resolusi ≤ 8h',
    cluster: newCustomer.value.cluster || 'PROD-CL01',
    address: newCustomer.value.address,
    isActive: true,
    pics: [
      {
        id: newId * 100 + 1,
        name: newCustomer.value.picName,
        phone: newCustomer.value.picPhone,
        email: newCustomer.value.picEmail,
        dept: newCustomer.value.picDept
      }
    ]
  });

  showAddCustomerModal.value = false;
  newCustomer.value = {
    name: '',
    code: '',
    industry: '',
    contractSla: 'SLA-PLATINUM-2026',
    cluster: '',
    address: '',
    picName: '',
    picPhone: '',
    picDept: '',
    picEmail: ''
  };
};

const openPicListModal = (customer) => {
  activeCustomer.value = customer;
  showPicModal.value = true;
};

const openAddPicModal = (customer) => {
  activeCustomer.value = customer;
  newPic.value = { name: '', dept: '', phone: '', email: '' };
  showAddPicModal.value = true;
};

const submitAddPic = () => {
  if (!activeCustomer.value) return;
  const newPicId = activeCustomer.value.pics.length > 0 
    ? Math.max(...activeCustomer.value.pics.map(p => p.id)) + 1 
    : 101;
  activeCustomer.value.pics.push({
    id: newPicId,
    name: newPic.value.name,
    dept: newPic.value.dept,
    phone: newPic.value.phone,
    email: newPic.value.email
  });
  showAddPicModal.value = false;
};
</script>
