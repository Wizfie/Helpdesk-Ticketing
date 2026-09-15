<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h1 class="text-xl font-bold text-slate-900">Manajemen Data Customer & PIC Klien</h1>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">Khusus Admin</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Kelola direktori perusahaan mitra, paket kontrak SLA (24x7 Premium / Standard), dan kontak PIC darurat.
        </p>
      </div>

      <button
        @click="showAddCustomerModal = true"
        class="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Tambah Customer Baru</span>
      </button>
    </div>

    <!-- Customers Grid / List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="c in ticketStore.customers"
        :key="c.id"
        class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="space-y-1 flex-1">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {{ c.code }}
              </span>
              <h3 class="font-bold text-slate-900 text-sm">{{ c.name }}</h3>
            </div>
            <p class="text-[11px] text-slate-500">{{ c.address }}</p>
          </div>

          <div class="flex flex-col items-end space-y-2 shrink-0">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
              {{ c.industry || 'Klien Korporat' }} • PKS 24x7 Aktif
            </span>
            <button
              @click="openEditCustomerModal(c)"
              class="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 flex items-center space-x-1 transition-all"
              title="Ubah data profil perusahaan customer ini"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              <span>Edit Mitra</span>
            </button>
          </div>
        </div>

        <!-- PIC List -->
        <div class="space-y-2 pt-2 border-t border-slate-100 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-slate-600 text-[11px] uppercase tracking-wider">Kontak PIC Terdaftar ({{ c.pics.length }})</span>
            <button
              @click="openAddPicModal(c)"
              class="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center space-x-1"
            >
              <span>+ Tambah PIC</span>
            </button>
          </div>

          <div class="space-y-1.5">
            <div
              v-for="pic in c.pics"
              :key="pic.id"
              class="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between text-xs hover:bg-slate-100/70 transition-colors"
            >
              <div class="space-y-0.5">
                <div>
                  <span class="font-bold text-slate-800">{{ pic.name }}</span>
                  <span class="text-slate-400 mx-1.5">•</span>
                  <span class="text-slate-600 font-medium">{{ pic.dept }}</span>
                </div>
                <div class="text-[11px] text-slate-500 font-mono">
                  <span>{{ pic.email }}</span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-[11px] font-mono text-slate-600 font-semibold">{{ pic.phone }}</span>
                <button
                  @click="openEditPicModal(c, pic)"
                  class="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-white transition-colors"
                  title="Edit PIC ini"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal 1: Add Customer -->
    <div v-if="showAddCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tambah Perusahaan Customer Baru</h4>
          <button @click="showAddCustomerModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitAddCustomer" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan *</label>
            <input v-model="newCustomer.name" required type="text" placeholder="Contoh: PT Telekomunikasi Selular (Telkomsel)" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Singkat *</label>
              <input v-model="newCustomer.code" required type="text" placeholder="TSEL" class="w-full p-2 border border-slate-200 rounded-lg text-xs uppercase" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Sektor Industri *</label>
              <input v-model="newCustomer.industry" required type="text" placeholder="Telekomunikasi" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alamat Gedung / Kantor *</label>
            <textarea v-model="newCustomer.address" rows="2" placeholder="Alamat lengkap lokasi..." class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="border-t border-slate-100 pt-2 space-y-2">
            <span class="font-bold text-slate-700 block">Data PIC Awal:</span>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="newCustomer.picName" required type="text" placeholder="Nama PIC (Bpk. ...)" class="p-2 border border-slate-200 rounded-lg text-xs" />
              <input v-model="newCustomer.picPhone" required type="text" placeholder="No. HP PIC" class="p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input v-model="newCustomer.picDept" required type="text" placeholder="Departemen / Divisi" class="p-2 border border-slate-200 rounded-lg text-xs" />
              <input v-model="newCustomer.picEmail" required type="email" placeholder="Email PIC" class="p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showAddCustomerModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Simpan Customer</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Edit Customer -->
    <div v-if="showEditCustomerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Edit Profil Mitra Pelanggan</h4>
            <span class="text-[10px] font-mono text-slate-400">Kode: {{ editCustomerForm.code }}</span>
          </div>
          <button @click="showEditCustomerModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitEditCustomer" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan *</label>
            <input v-model="editCustomerForm.name" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Singkat *</label>
              <input v-model="editCustomerForm.code" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs uppercase" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Sektor Industri *</label>
              <input v-model="editCustomerForm.industry" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Alamat Gedung / Kantor *</label>
            <textarea v-model="editCustomerForm.address" rows="3" class="w-full p-2 border border-slate-200 rounded-lg text-xs"></textarea>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showEditCustomerModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Add PIC to existing Customer -->
    <div v-if="selectedCustomerForPic" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tambah PIC: {{ selectedCustomerForPic.name }}</h4>
          <button @click="selectedCustomerForPic = null" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitAddPic" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap PIC *</label>
            <input v-model="newPic.name" required type="text" placeholder="Contoh: Bpk. Rizky" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Departemen / Posisi *</label>
            <input v-model="newPic.dept" required type="text" placeholder="Contoh: IT Security Ops" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP *</label>
            <input v-model="newPic.phone" required type="text" placeholder="0812-xxxx-xxxx" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Resmi *</label>
            <input v-model="newPic.email" required type="email" placeholder="pic@perusahaan.co.id" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="selectedCustomerForPic = null" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Simpan PIC</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 4: Edit PIC -->
    <div v-if="selectedCustomerForEditPic" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Edit Kontak PIC</h4>
          <button @click="selectedCustomerForEditPic = null" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitEditPic" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap PIC *</label>
            <input v-model="editPicForm.name" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Departemen / Posisi *</label>
            <input v-model="editPicForm.dept" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP *</label>
            <input v-model="editPicForm.phone" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Resmi *</label>
            <input v-model="editPicForm.email" required type="email" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="selectedCustomerForEditPic = null" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">Simpan PIC</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTicketStore } from '../stores/ticketStore';
import { useAuthStore } from '../stores/authStore';

const ticketStore = useTicketStore();
const authStore = useAuthStore();

const showAddCustomerModal = ref(false);
const showEditCustomerModal = ref(false);

const selectedCustomerForPic = ref(null);
const selectedCustomerForEditPic = ref(null);

const newCustomer = ref({
  name: '',
  code: '',
  industry: 'Telekomunikasi',
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
  address: ''
});

const newPic = ref({
  name: '',
  dept: '',
  phone: '',
  email: ''
});

const editPicForm = ref({
  id: null,
  customerId: null,
  name: '',
  dept: '',
  phone: '',
  email: ''
});

const openEditCustomerModal = (customer) => {
  editCustomerForm.value = {
    id: customer.id,
    name: customer.name,
    code: customer.code,
    industry: customer.industry || 'Telekomunikasi',
    address: customer.address
  };
  showEditCustomerModal.value = true;
};

const openAddPicModal = (customer) => {
  selectedCustomerForPic.value = customer;
  newPic.value = { name: '', dept: '', phone: '', email: '' };
};

const openEditPicModal = (customer, pic) => {
  selectedCustomerForEditPic.value = customer;
  editPicForm.value = {
    id: pic.id,
    customerId: customer.id,
    name: pic.name,
    dept: pic.dept,
    phone: pic.phone,
    email: pic.email
  };
};

const submitAddCustomer = () => {
  ticketStore.addCustomer(newCustomer.value, authStore.currentUser);
  newCustomer.value = { name: '', code: '', industry: 'Telekomunikasi', address: '', picName: '', picPhone: '', picDept: '', picEmail: '' };
  showAddCustomerModal.value = false;
};

const submitEditCustomer = () => {
  ticketStore.updateCustomer(editCustomerForm.value.id, editCustomerForm.value, authStore.currentUser);
  showEditCustomerModal.value = false;
};

const submitAddPic = () => {
  if (!selectedCustomerForPic.value) return;
  ticketStore.addCustomerPic(selectedCustomerForPic.value.id, newPic.value, authStore.currentUser);
  selectedCustomerForPic.value = null;
};

const submitEditPic = () => {
  if (!selectedCustomerForEditPic.value) return;
  ticketStore.updateCustomerPic(
    selectedCustomerForEditPic.value.id,
    editPicForm.value.id,
    editPicForm.value,
    authStore.currentUser
  );
  selectedCustomerForEditPic.value = null;
};
</script>
