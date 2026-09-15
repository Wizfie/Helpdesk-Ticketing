<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h1 class="text-xl font-bold text-slate-900">Manajemen Pengguna & Hak Akses (RBAC)</h1>
          <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">Khusus Admin</span>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Kelola akun staf operasional PT GTT, alokasi peran (Admin, CPIG, Engineer, Management), dan status keaktifan akun.
        </p>
      </div>

      <button
        @click="showAddModal = true"
        class="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Tambah Pengguna Baru</span>
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-xs">
      <div class="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <span class="font-bold text-slate-800">Daftar Akun Staf PT GTT</span>
        <span class="text-slate-500">{{ users.length }} Pengguna Terdaftar</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="py-3 px-4">Pengguna</th>
              <th class="py-3 px-4">Email Perusahaan</th>
              <th class="py-3 px-4">Peran (Role)</th>
              <th class="py-3 px-4">No. Kontak</th>
              <th class="py-3 px-4">Status Akun</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                    {{ user.initials }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-900">{{ user.name }}</div>
                    <span class="text-[10px] text-slate-400">ID: USER-00{{ user.id }}</span>
                  </div>
                </div>
              </td>

              <td class="py-3 px-4 font-mono text-slate-600">
                {{ user.email }}
              </td>

              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="getRoleBadgeClass(user.roleCode)">
                  {{ user.roleCode }}
                </span>
              </td>

              <td class="py-3 px-4 text-slate-600 font-mono">
                {{ user.phone }}
              </td>

              <td class="py-3 px-4">
                <span 
                  class="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                  :class="user.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="user.isActive ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                  <span>{{ user.isActive ? 'Aktif' : 'Nonaktif' }}</span>
                </span>
              </td>

              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openEditModal(user)"
                    class="text-xs font-semibold px-2.5 py-1 rounded text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center space-x-1"
                    title="Ubah data profil staf ini"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    @click="toggleStatus(user)"
                    class="text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                    :class="user.isActive ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'"
                  >
                    {{ user.isActive ? 'Nonaktifkan' : 'Aktifkan' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Add New User -->
    <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h4 class="font-bold text-slate-900 text-sm">Tambah Pengguna Baru</h4>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitAddUser" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap Staf *</label>
            <input v-model="newUser.name" required type="text" placeholder="Contoh: Farhan Pratama" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Resmi GTT *</label>
            <input v-model="newUser.email" required type="email" placeholder="farhan.eng@glotratech.com" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Peran (Role) *</label>
              <select v-model="newUser.roleCode" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
                <option value="ENGINEER">Engineer (Teknisi)</option>
                <option value="CPIG">CPIG (Helpdesk)</option>
                <option value="MANAGEMENT">Management (Lead)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">No. WhatsApp/HP *</label>
              <input v-model="newUser.phone" required type="text" placeholder="0812-xxxx-xxxx" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showAddModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm">Simpan Pengguna</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Edit Existing User -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs animate-in fade-in duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Edit Data Pengguna</h4>
            <span class="text-[10px] text-slate-400 font-mono">ID: USER-00{{ editUserForm.id }}</span>
          </div>
          <button @click="showEditModal = false" class="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>

        <form @submit.prevent="submitEditUser" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap Staf *</label>
            <input v-model="editUserForm.name" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Email Resmi GTT *</label>
            <input v-model="editUserForm.email" required type="email" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Peran (Role) *</label>
              <select v-model="editUserForm.roleCode" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
                <option value="ENGINEER">Engineer (Teknisi)</option>
                <option value="CPIG">CPIG (Helpdesk)</option>
                <option value="MANAGEMENT">Management (Lead)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">No. WhatsApp/HP *</label>
              <input v-model="editUserForm.phone" required type="text" class="w-full p-2 border border-slate-200 rounded-lg text-xs" />
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">Status Keaktifan Akun</label>
            <select v-model="editUserForm.isActive" class="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white">
              <option :value="true">Aktif (Dapat Login & Bertugas)</option>
              <option :value="false">Nonaktif (Akses Dicabut Sementara)</option>
            </select>
          </div>

          <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button type="button" @click="showEditModal = false" class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600">Batal</button>
            <button type="submit" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm">Simpan Perubahan</button>
          </div>
        </form>
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

const users = computed(() => authStore.users);

const showAddModal = ref(false);
const showEditModal = ref(false);

const newUser = ref({
  name: '',
  email: '',
  roleCode: 'ENGINEER',
  phone: ''
});

const editUserForm = ref({
  id: null,
  name: '',
  email: '',
  roleCode: 'ENGINEER',
  phone: '',
  isActive: true
});

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'ADMIN': return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'CPIG': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'ENGINEER': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'MANAGEMENT': return 'bg-slate-100 text-slate-700 border border-slate-200';
    default: return 'bg-slate-50 text-slate-600';
  }
};

const openEditModal = (user) => {
  editUserForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    roleCode: user.roleCode,
    phone: user.phone,
    isActive: user.isActive
  };
  showEditModal.value = true;
};

const submitAddUser = () => {
  authStore.createUser(newUser.value, authStore.currentUser, ticketStore);
  newUser.value = { name: '', email: '', roleCode: 'ENGINEER', phone: '' };
  showAddModal.value = false;
};

const submitEditUser = () => {
  authStore.updateUser(editUserForm.value.id, editUserForm.value, authStore.currentUser, ticketStore);
  showEditModal.value = false;
};

const toggleStatus = (user) => {
  authStore.toggleUserStatus(user.id, authStore.currentUser, ticketStore);
};
</script>
