<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12">
    <!-- Top Header Bar -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
          <router-link :to="authStore.isEngineer ? '/tickets' : '/'" class="hover:text-blue-600 transition-colors">Portal Operasional</router-link>
          <span>/</span>
          <span class="text-slate-800">Pengaturan Akun</span>
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2.5">
          <span>Profil Pengguna &amp; Keamanan</span>
          <span 
            class="text-xs font-mono font-bold px-2.5 py-0.5 rounded border"
            :class="authStore.isEngineer ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-200'"
          >
            {{ authStore.currentUser?.roleCode || 'USER' }}
          </span>
        </h1>
        <p class="text-xs text-slate-500 mt-1">
          Kelola informasi kontak personal staf, spesialisasi teknis, dan perbarui kata sandi akun operasional Anda secara mandiri.
        </p>
      </div>

      <!-- Quick Back Button -->
      <div>
        <router-link
          :to="authStore.isEngineer ? '/tickets' : '/'"
          class="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Kembali ke {{ authStore.isEngineer ? 'Tiket Saya' : 'Dashboard' }}</span>
        </router-link>
      </div>
    </div>

    <!-- User Profile Banner Card -->
    <div class="bg-linear-to-r from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
      <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <!-- Big Avatar with initials -->
        <div class="w-20 h-20 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
          {{ authStore.currentUserInitials || 'U' }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 class="text-xl font-bold tracking-tight text-white">
              {{ authStore.currentUser?.name }}
            </h2>
            <span 
              class="text-[10px] font-bold px-2 py-0.5 rounded-full font-mono"
              :class="authStore.isEngineer ? 'bg-amber-400 text-slate-950' : 'bg-blue-400 text-slate-950'"
            >
              {{ authStore.currentUser?.roleCode === 'ADMIN' ? 'ADMINISTRATOR / CPIG' : 'SUPPORT ENGINEER' }}
            </span>
            <span class="inline-flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Akun Aktif
            </span>
          </div>

          <p class="text-xs text-slate-300 font-medium mb-3">
            {{ (authStore.currentUser?.role || authStore.currentUser?.roleCode) === 'ADMIN' ? 'Administrator Helpdesk & Operasional' : 'Support Engineer' }}
          </p>

          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 font-mono">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
              {{ authStore.currentUser?.email }}
            </span>
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              {{ authStore.currentUser?.phone || '-' }}
            </span>
            <span class="text-slate-400">
              ID: USER-00{{ authStore.currentUser?.id }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Notifications (Success / Error) -->
    <div 
      v-if="profileMessage.text"
      class="p-4 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200"
      :class="profileMessage.isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'"
    >
      <div class="flex items-center space-x-2.5">
        <svg v-if="!profileMessage.isError" class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <svg v-else class="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-semibold">{{ profileMessage.text }}</span>
      </div>
      <button @click="profileMessage.text = ''" class="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
    </div>

    <!-- Two-Column Settings Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Left Column: Informasi Profil & Kontak (7 cols) -->
      <div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div class="border-b border-slate-100 pb-3">
          <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span>Informasi Personal &amp; Kontak</span>
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">
            Perbarui nama tampilan dan kontak aktif untuk koordinasi penanganan tiket insiden.
          </p>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="space-y-4 text-xs">
          <!-- Nama Lengkap -->
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">Nama Lengkap *</label>
            <input 
              v-model="profileForm.name" 
              type="text" 
              required
              placeholder="Contoh: Budi Santoso"
              class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all font-medium"
            />
          </div>

          <!-- Email Perusahaan (Read-only) -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block font-bold text-slate-700">Email Resmi GTT</label>
              <span class="text-[10px] text-slate-400 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Terkunci (Dikelola Admin)
              </span>
            </div>
            <input 
              :value="authStore.currentUser?.email" 
              disabled
              type="email" 
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono cursor-not-allowed"
            />
            <p class="text-[11px] text-slate-400 mt-1">Untuk perubahan email resmi perusahaan, silakan ajukan permohonan ke Tim HR/Admin IT.</p>
          </div>

          <!-- WhatsApp / HP -->
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">No. WhatsApp / HP Aktif *</label>
            <input 
              v-model="profileForm.phone" 
              type="text" 
              required
              placeholder="0813-xxxx-xxxx"
              class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition-all font-mono"
            />
            <p class="text-[11px] text-slate-400 mt-1">Digunakan untuk eskalasi insiden darurat atau dispatching tiket NOC.</p>
          </div>

          <!-- Submit Button -->
          <div class="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              :disabled="isUpdatingProfile"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>{{ isUpdatingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Right Column: Ganti Password Mandiri & Info Lupa Sandi (5 cols) -->
      <div class="lg:col-span-5 space-y-6">

        <!-- Form Ganti Password Mandiri -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div class="border-b border-slate-100 pb-3">
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              <span>Ubah Kata Sandi Mandiri</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Perbarui kata sandi secara berkala untuk menjaga keamanan akun operasional Anda.
            </p>
          </div>

          <form @submit.prevent="handleChangePassword" class="space-y-4 text-xs">
            <!-- Password Lama -->
            <div>
              <label class="block font-bold text-slate-700 mb-1.5">Kata Sandi Saat Ini *</label>
              <div class="relative">
                <input 
                  v-model="passwordForm.oldPassword" 
                  :type="showOldPassword ? 'text' : 'password'" 
                  required
                  placeholder="Masukkan kata sandi lama..."
                  class="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-slate-800"
                />
                <button 
                  type="button" 
                  @click="showOldPassword = !showOldPassword" 
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <svg v-if="!showOldPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Password Baru -->
            <div>
              <label class="block font-bold text-slate-700 mb-1.5">Kata Sandi Baru *</label>
              <div class="relative">
                <input 
                  v-model="passwordForm.newPassword" 
                  :type="showNewPassword ? 'text' : 'password'" 
                  required
                  minlength="6"
                  placeholder="Minimal 6 karakter..."
                  class="w-full pl-3.5 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-slate-800"
                />
                <button 
                  type="button" 
                  @click="showNewPassword = !showNewPassword" 
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <svg v-if="!showNewPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Konfirmasi Password Baru -->
            <div>
              <label class="block font-bold text-slate-700 mb-1.5">Konfirmasi Kata Sandi Baru *</label>
              <input 
                v-model="passwordForm.confirmPassword" 
                type="password" 
                required
                minlength="6"
                placeholder="Ulangi kata sandi baru..."
                class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-mono text-slate-800"
              />
            </div>

            <div class="pt-2">
              <button
                type="submit"
                :disabled="isUpdatingPassword"
                class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{{ isUpdatingPassword ? 'Memproses...' : 'Perbarui Kata Sandi' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Card Panduan: Lupa Kata Sandi (Dikelola Admin) -->
        <div class="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 text-xs text-blue-900 space-y-3">
          <div class="flex items-start space-x-2.5">
            <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-blue-950 text-xs">Lupa Kata Sandi?</h4>
              <p class="text-[11px] text-blue-800 leading-relaxed mt-1">
                Sesuai standar keamanan ISO &amp; IT Governance PT GTT, pemulihan akun bagi staf yang lupa kata sandi dilakukan secara terpusat oleh <strong>Administrator / CPIG Helpdesk</strong>.
              </p>
            </div>
          </div>

          <div class="bg-white/80 border border-blue-100 rounded-xl p-3 space-y-1.5 text-[11px]">
            <span class="font-bold text-slate-800 block">Langkah Bantuan Reset Sandi:</span>
            <ul class="list-disc list-inside space-y-1 text-slate-600">
              <li>Hubungi Admin Helpdesk melalui email <strong>admin@glotratech.com</strong>.</li>
              <li>Sebutkan <strong>ID Staf (USER-00{{ authStore.currentUser?.id }})</strong> dan nama lengkap Anda.</li>
              <li>Admin akan mereset kata sandi melalui menu <em>Manajemen Pengguna</em> dan menerbitkan sandi sementara.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';

const authStore = useAuthStore();
const ticketStore = useTicketStore();

const profileForm = reactive({
  name: '',
  phone: ''
});

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const showOldPassword = ref(false);
const showNewPassword = ref(false);

const isUpdatingProfile = ref(false);
const isUpdatingPassword = ref(false);

const profileMessage = reactive({
  text: '',
  isError: false
});

const setNotice = (text, isError = false) => {
  profileMessage.text = text;
  profileMessage.isError = isError;
  setTimeout(() => {
    if (profileMessage.text === text) {
      profileMessage.text = '';
    }
  }, 5000);
};

onMounted(() => {
  if (authStore.currentUser) {
    profileForm.name = authStore.currentUser.name || '';
    profileForm.phone = authStore.currentUser.phone || '';
  }
});

const handleUpdateProfile = async () => {
  if (!profileForm.name.trim()) {
    setNotice('Nama lengkap tidak boleh kosong.', true);
    return;
  }
  isUpdatingProfile.value = true;
  try {
    const res = await authStore.updateProfile(authStore.currentUser.id, profileForm, ticketStore);
    if (res?.success !== false) {
      setNotice('Informasi profil Anda berhasil disimpan.');
    } else {
      setNotice(res?.message || 'Gagal memperbarui profil.', true);
    }
  } catch (e) {
    setNotice('Terjadi kesalahan sistem saat menyimpan profil.', true);
  } finally {
    isUpdatingProfile.value = false;
  }
};

const handleChangePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setNotice('Konfirmasi kata sandi baru tidak cocok dengan kata sandi baru.', true);
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    setNotice('Kata sandi baru minimal harus 6 karakter.', true);
    return;
  }

  isUpdatingPassword.value = true;
  try {
    const res = authStore.changePassword(
      authStore.currentUser.id,
      passwordForm.oldPassword,
      passwordForm.newPassword,
      ticketStore
    );

    if (res.success) {
      setNotice(res.message, false);
      passwordForm.oldPassword = '';
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    } else {
      setNotice(res.message, true);
    }
  } catch (e) {
    setNotice('Terjadi kesalahan saat memperbarui kata sandi.', true);
  } finally {
    isUpdatingPassword.value = false;
  }
};
</script>
