<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <div class="flex items-center space-x-2">
          <svg
            class="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <h1 class="text-xl font-bold text-slate-900">Manajemen Pengguna</h1>
          <span
            class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded"
            >Khusus Admin</span
          >
        </div>
      </div>

      <button
        @click="showAddModal = true"
        class="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        <span>Tambah Pengguna Baru</span>
      </button>
    </div>

    <!-- Users Table -->
    <div
      class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-xs"
    >
      <div
        class="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50"
      >
        <span class="font-bold text-slate-800">Daftar Akun Staf</span>
        <span class="text-slate-500"
          >{{ users.length }} Pengguna Terdaftar</span
        >
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-[800px]">
          <thead
            class="bg-slate-50/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]"
          >
            <tr>
              <th class="py-3 px-4">Pengguna</th>
              <th class="py-3 px-4">Email Perusahaan</th>
              <th class="py-3 px-4">Peran </th>
              <th class="py-3 px-4">No. Kontak</th>
              <th class="py-3 px-4">Status Akun</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="py-3 px-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs"
                  >
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <div class="font-bold text-slate-900">{{ user.name }}</div>
                    <span class="text-[10px] text-slate-400"
                      >ID: USER-00{{ user.id }}</span
                    >
                  </div>
                </div>
              </td>

              <td class="py-3 px-4 font-mono text-slate-600">
                {{ user.email }}
              </td>

              <td class="py-3 px-4">
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold"
                  :class="getRoleBadgeClass(user.roleCode)"
                >
                  {{ user.roleCode }}
                </span>
              </td>

              <td class="py-3 px-4 text-slate-600 font-mono">
                {{ user.phone }}
              </td>

              <td class="py-3 px-4">
                <span
                  class="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                  :class="
                    user.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  "
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="user.isActive ? 'bg-emerald-500' : 'bg-slate-400'"
                  ></span>
                  <span>{{ user.isActive ? "Aktif" : "Nonaktif" }}</span>
                </span>
              </td>

              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end space-x-1.5">
                  <button
                    @click="openResetModal(user)"
                    class="text-xs font-semibold px-2.5 py-1 rounded text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center space-x-1 cursor-pointer"
                    title="Bantu reset kata sandi staf ini"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      ></path>
                    </svg>
                    <span>Reset Sandi</span>
                  </button>
                  <button
                    @click="openEditModal(user)"
                    class="text-xs font-semibold px-2.5 py-1 rounded text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center space-x-1 cursor-pointer"
                    title="Ubah data profil staf ini"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    @click="toggleStatus(user)"
                    class="text-xs font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer"
                    :class="
                      user.isActive
                        ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    "
                  >
                    {{ user.isActive ? "Nonaktifkan" : "Aktifkan" }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Toolbar -->
      <div
        class="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <span class="text-slate-500 font-medium">
          Menampilkan
          <strong class="text-slate-800">
            {{ users.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}
          </strong>
          -
          <strong class="text-slate-800">
            {{ Math.min(currentPage * itemsPerPage, users.length) }}
          </strong>
          dari <strong class="text-slate-800">{{ users.length }}</strong> pengguna
        </span>

        <div class="flex items-center space-x-2">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors"
          >
            <span>&larr;</span> Prev
          </button>

          <div class="flex items-center space-x-1.5 text-xs text-slate-600">
            <span>Halaman</span>
            <input
              type="number"
              min="1"
              :max="totalPages"
              :value="currentPage"
              @keydown.enter="handleJumpPage($event)"
              @blur="handleJumpPage($event)"
              class="w-12 py-1 px-1.5 text-center font-mono font-bold text-xs border border-slate-200 rounded-md bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span>dari <strong class="text-slate-800 font-mono">{{ totalPages }}</strong></span>
          </div>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 font-medium transition-colors"
          >
            Next <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Add New User -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-2.5"
        >
          <h4 class="font-bold text-slate-900 text-sm">Tambah Pengguna Baru</h4>
          <button
            @click="showAddModal = false"
            class="text-slate-400 hover:text-slate-600 text-lg"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitAddUser" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Nama Lengkap Staf *</label
            >
            <input
              v-model="newUser.name"
              required
              type="text"
              placeholder="Contoh: Farhan Pratama"
              class="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Email Resmi GTT *</label
            >
            <input
              v-model="newUser.email"
              required
              type="email"
              placeholder="farhan.eng@glotratech.com"
              class="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <BaseSelect
                v-model="newUser.roleCode"
                :options="roleOptions"
                label="Peran (Role)"
                required
                size="sm"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1"
                >No. WhatsApp/HP *</label
              >
              <input
                v-model="newUser.phone"
                required
                type="text"
                placeholder="0812-xxxx-xxxx"
                class="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div
            class="flex justify-end space-x-2 pt-3 border-t border-slate-100"
          >
            <button
              type="button"
              @click="showAddModal = false"
              class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-sm"
            >
              Simpan Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Edit Existing User -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs animate-in fade-in duration-150"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-2.5"
        >
          <div>
            <h4 class="font-bold text-slate-900 text-sm">Edit Data Pengguna</h4>
            <span class="text-[10px] text-slate-400 font-mono"
              >ID: USER-00{{ editUserForm.id }}</span
            >
          </div>
          <button
            @click="showEditModal = false"
            class="text-slate-400 hover:text-slate-600 text-lg"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitEditUser" class="space-y-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Nama Lengkap Staf *</label
            >
            <input
              v-model="editUserForm.name"
              required
              type="text"
              class="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Email Resmi GTT *</label
            >
            <input
              v-model="editUserForm.email"
              required
              type="email"
              class="w-full p-2 border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <BaseSelect
                v-model="editUserForm.roleCode"
                :options="roleOptions"
                label="Peran (Role)"
                required
                size="sm"
              />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1"
                >No. WhatsApp/HP *</label
              >
              <input
                v-model="editUserForm.phone"
                required
                type="text"
                class="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <BaseSelect
              v-model="editUserForm.isActive"
              :options="userStatusOptions"
              label="Status Keaktifan Akun"
              required
              size="sm"
            />
          </div>

          <div
            class="flex justify-end space-x-2 pt-3 border-t border-slate-100"
          >
            <button
              type="button"
              @click="showEditModal = false"
              class="px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Admin Reset User Password -->
    <div
      v-if="showResetModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in duration-150"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 pb-3"
        >
          <div class="flex items-center space-x-2.5">
            <div
              class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                ></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">
                Bantu Reset Sandi Staf
              </h4>
              <p class="text-[11px] text-slate-500">
                Pusat Bantuan Lupa Sandi Akun Helpdesk
              </p>
            </div>
          </div>
          <button
            @click="showResetModal = false"
            class="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div
          class="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5"
        >
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Nama Pengguna:</span>
            <span class="font-bold text-slate-800">{{
              resetTargetUser?.name
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Email:</span>
            <span class="font-mono text-slate-700">{{
              resetTargetUser?.email
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Peran:</span>
            <span class="font-bold text-blue-700">{{
              resetTargetUser?.roleCode
            }}</span>
          </div>
        </div>

        <div class="space-y-2">
          <label class="block font-bold text-slate-700"
            >Kata Sandi Baru / Sementara *</label
          >
          <div class="flex space-x-2">
            <input
              v-model="resetPasswordValue"
              type="text"
              required
              class="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              @click="resetPasswordValue = 'GTT@2026!'"
              class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-[11px] shrink-0 cursor-pointer"
              title="Gunakan default GTT@2026!"
            >
              Default
            </button>
          </div>
          <p class="text-[11px] text-slate-500">
            Berikan kata sandi sementara ini kepada pengguna yang bersangkutan.
            Pengguna dapat mengubahnya kembali secara mandiri di halaman Profil.
          </p>
        </div>

        <div
          v-if="resetSuccessMsg"
          class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2"
        >
          <svg
            class="w-4 h-4 text-emerald-600 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span class="font-semibold">{{ resetSuccessMsg }}</span>
        </div>

        <div class="flex justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            @click="showResetModal = false"
            class="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            {{ resetSuccessMsg ? "Selesai" : "Batal" }}
          </button>
          <button
            type="button"
            @click="submitResetPassword"
            class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Reset Sandi Sekarang
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useTicketStore } from "../stores/ticketStore";
import { useUiStore } from "../stores/uiStore";

const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();

const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
};

onMounted(async () => {
  await authStore.fetchUsersFromApi();
});

const users = computed(() => authStore.users);

// Standard Pagination
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = computed(() => Math.ceil(users.value.length / itemsPerPage) || 1);
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return users.value.slice(start, start + itemsPerPage);
});

const handleJumpPage = (e) => {
  const val = parseInt(e.target.value, 10);
  if (!isNaN(val)) {
    currentPage.value = Math.max(1, Math.min(totalPages.value, val));
  }
  e.target.value = currentPage.value;
};

const goToPage = (page) => {
  currentPage.value = Math.max(1, Math.min(totalPages.value, page));
};

const showAddModal = ref(false);
const showEditModal = ref(false);
const showResetModal = ref(false);

const resetTargetUser = ref(null);
const resetPasswordValue = ref("GTT@2026!");
const resetSuccessMsg = ref("");

// Dropdown options
const roleOptions = [
  { value: 'ADMIN', label: 'Admin', subtext: 'Admin Sistem & Helpdesk', badge: 'Admin', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200' },
  { value: 'ENGINEER', label: 'Engineer', subtext: 'Teknisi ', badge: 'Engineer', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200' }
];

const userStatusOptions = [
  { value: true, label: 'Aktif (Dapat Login & Bertugas)', badge: 'Aktif', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  { value: false, label: 'Nonaktif (Akses Dicabut Sementara)', badge: 'Nonaktif', badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200' }
];

const newUser = ref({
  name: "",
  email: "",
  roleCode: "ENGINEER",
  phone: "",
});

const editUserForm = ref({
  id: null,
  name: "",
  email: "",
  roleCode: "ENGINEER",
  phone: "",
  isActive: true,
});

const getRoleBadgeClass = (role) => {
  switch (role) {
    case "ADMIN":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    case "CPIG":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    case "ENGINEER":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-slate-50 text-slate-600";
  }
};

const openEditModal = (user) => {
  editUserForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    roleCode: user.roleCode,
    phone: user.phone,
    isActive: user.isActive,
  };
  showEditModal.value = true;
};

const openResetModal = (user) => {
  resetTargetUser.value = user;
  resetPasswordValue.value = "GTT@2026!";
  resetSuccessMsg.value = "";
  showResetModal.value = true;
};

const submitResetPassword = async () => {
  if (!resetTargetUser.value) return;
  const ok = await uiStore.confirm({
    title: "Reset Kata Sandi Pengguna?",
    message: `Reset kata sandi untuk staf "${resetTargetUser.value.name}" menjadi kata sandi baru?`,
    confirmText: "Ya, Reset Sandi",
    type: "warning",
  });
  if (!ok) return;

  const res = authStore.adminResetPassword(
    resetTargetUser.value.id,
    resetPasswordValue.value,
    authStore.currentUser,
    ticketStore,
  );
  if (res.success) {
    resetSuccessMsg.value = `Sandi berhasil direset ke: ${res.temporaryPassword}`;
    uiStore.toastSuccess(`Kata sandi "${resetTargetUser.value.name}" berhasil direset.`);
  }
};

const submitAddUser = async () => {
  try {
    const userName = newUser.value.name;
    await authStore.createUser(newUser.value, authStore.currentUser, ticketStore);
    newUser.value = { name: "", email: "", roleCode: "ENGINEER", phone: "" };
    showAddModal.value = false;
    uiStore.toastSuccess(`Pengguna "${userName}" berhasil didaftarkan!`);
  } catch (err) {
    uiStore.toastError("Gagal mendaftarkan pengguna: " + (err.message || "Terjadi kesalahan"));
  }
};

const submitEditUser = async () => {
  try {
    const userName = editUserForm.value.name;
    await authStore.updateUser(
      editUserForm.value.id,
      editUserForm.value,
      authStore.currentUser,
      ticketStore,
    );
    showEditModal.value = false;
    uiStore.toastSuccess(`Data profil "${userName}" berhasil diperbarui!`);
  } catch (err) {
    uiStore.toastError("Gagal memperbarui profil: " + (err.message || "Terjadi kesalahan"));
  }
};

const toggleStatus = async (user) => {
  const willBeActive = !user.isActive;
  const ok = await uiStore.confirm({
    title: willBeActive ? "Aktifkan Akun Pengguna?" : "Nonaktifkan Akun Pengguna?",
    message: `Apakah Anda yakin ingin ${willBeActive ? "mengaktifkan" : "menonaktifkan"} akses staf "${user.name}"?`,
    confirmText: willBeActive ? "Ya, Aktifkan" : "Ya, Nonaktifkan",
    type: willBeActive ? "info" : "warning",
  });
  if (!ok) return;

  await authStore.toggleUserStatus(user.id, authStore.currentUser, ticketStore);
  uiStore.toastSuccess(`Status pengguna "${user.name}" berhasil diubah menjadi ${willBeActive ? "Aktif" : "Nonaktif"}.`);
};
</script>
