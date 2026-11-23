<template>
  <div class="space-y-5 max-w-4xl mx-auto pb-12">
    <!-- Top Header Bar -->
    <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>Profil Pengguna &amp; Keamanan</span>
        </h1>
      </div>

    </div>

    <!-- User Profile High-Contrast Summary Card -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-sm">
      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <!-- Big Avatar with initials -->
        <div class="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center border-2 border-slate-700 shadow-sm shrink-0">
          {{ authStore.currentUserInitials || 'U' }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 class="text-xl font-bold tracking-tight text-white">
              {{ authStore.currentUser?.name }}
            </h2>
            <span 
              class="text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono"
              :class="authStore.isEngineer ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-blue-400 text-slate-950 font-bold'"
            >
              {{ (authStore.currentUser?.roleCode || authStore.currentUser?.role) === 'ADMIN' ? 'ADMINISTRATOR' : 'SUPPORT ENGINEER' }}
            </span>
            <span class="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Akun Aktif
            </span>
          </div>

          <p class="text-xs text-slate-300 font-medium mb-3">
            {{ (authStore.currentUser?.roleCode || authStore.currentUser?.role) === 'ADMIN' ? 'Administrator Helpdesk & Operasional' : 'Support Engineer Helpdesk' }}
          </p>

          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs">
            <span class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-mono">
              <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
              <span>{{ authStore.currentUser?.email }}</span>
            </span>

            <span class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-mono">
              <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span>{{ authStore.currentUser?.phone || '-' }}</span>
            </span>

            <span class="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">
              ID: USER-00{{ authStore.currentUser?.id }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Notifications (Success / Error) -->
    <div 
      v-if="profileMessage.text"
      class="p-3.5 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200"
      :class="profileMessage.isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'"
    >
      <div class="flex items-center space-x-2">
        <svg v-if="!profileMessage.isError" class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <svg v-else class="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-semibold">{{ profileMessage.text }}</span>
      </div>
      <button @click="profileMessage.text = ''" class="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
    </div>

    <!-- Two-Column Settings Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

      <!-- Column 1: Informasi Kontak -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div class="border-b border-slate-100 pb-3 mb-4">
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>Informasi Personal &amp; Kontak</span>
            </h3>
          </div>

          <form @submit.prevent="handleUpdateProfile" class="space-y-3.5 text-xs">
            <!-- Nama Lengkap -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block font-bold text-slate-700">Nama Lengkap</label>
                <span v-if="authStore.isEngineer" class="text-[10px] text-slate-400 flex items-center gap-0.5">
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Terkunci
                </span>
              </div>
              <input 
                v-if="!authStore.isEngineer"
                v-model="profileForm.name" 
                type="text" 
                required
                placeholder="Nama Lengkap"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-medium transition-all"
              />
              <input 
                v-else
                :value="authStore.currentUser?.name" 
                disabled
                type="text" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium cursor-not-allowed"
              />
            </div>

            <!-- Email Resmi -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block font-bold text-slate-700">Email Resmi *</label>
                <span v-if="authStore.isEngineer" class="text-[10px] text-slate-400 flex items-center gap-0.5">
                  <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Terkunci (Hanya Admin)
                </span>
              </div>
              <input 
                v-if="!authStore.isEngineer"
                v-model="profileForm.email" 
                type="email" 
                required
                placeholder="email@glotratech.com"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-mono font-medium transition-all"
              />
              <input 
                v-else
                :value="authStore.currentUser?.email" 
                disabled
                type="email" 
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono cursor-not-allowed"
              />
            </div>

            <!-- WhatsApp / HP (Bisa tanpa strip '-') -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">No. WhatsApp / HP Aktif *</label>
              <input 
                v-model="profileForm.phone" 
                type="text" 
                required
                placeholder="081234567890 (bisa dengan atau tanpa tanda '-')"
                class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-mono font-medium transition-all"
              />
            </div>

            <!-- Submit Button -->
            <div class="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                :disabled="isUpdatingProfile"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 text-xs"
              >
                <span>{{ isUpdatingProfile ? 'Menyimpan...' : 'Simpan' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Column 2: Ubah Kata Sandi Tanpa Sandi Lama -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div class="border-b border-slate-100 pb-3 mb-4">
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              <span>Ubah Kata Sandi</span>
            </h3>
          </div>

          <form @submit.prevent="handleChangePassword" class="space-y-3.5 text-xs">
            <!-- Password Baru (Tanpa Perlu Password Lama) -->
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kata Sandi Baru *</label>
              <div class="relative">
                <input 
                  v-model="passwordForm.newPassword" 
                  :type="showNewPassword ? 'text' : 'password'" 
                  required
                  minlength="6"
                  placeholder="Minimal 6 karakter"
                  class="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-800 focus:border-slate-800 font-mono text-slate-900"
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
              <label class="block font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru *</label>
              <div class="relative">
                <input 
                  v-model="passwordForm.confirmPassword" 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  required
                  minlength="6"
                  placeholder="Ulangi kata sandi baru"
                  class="w-full pl-3.5 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-800 focus:border-slate-800 font-mono text-slate-900"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword" 
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <svg v-if="!showConfirmPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                :disabled="isUpdatingPassword"
                class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 text-xs"
              >
                <span>{{ isUpdatingPassword ? 'Menyimpan...' : 'Perbarui Kata Sandi' }}</span>
              </button>
            </div>
          </form>
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
  email: '',
  phone: ''
});

const passwordForm = reactive({
  newPassword: '',
  confirmPassword: ''
});

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

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
  }, 4000);
};

onMounted(() => {
  if (authStore.currentUser) {
    profileForm.name = authStore.currentUser.name || '';
    profileForm.email = authStore.currentUser.email || '';
    profileForm.phone = authStore.currentUser.phone || '';
  }
});

const handleUpdateProfile = async () => {
  if (authStore.isAdmin) {
    if (!profileForm.name.trim()) {
      setNotice('Nama lengkap tidak boleh kosong.', true);
      return;
    }
    if (!profileForm.email.trim()) {
      setNotice('Email resmi tidak boleh kosong.', true);
      return;
    }
  }
  if (!profileForm.phone.trim()) {
    setNotice('Nomor telepon tidak boleh kosong.', true);
    return;
  }

  isUpdatingProfile.value = true;
  try {
    const payload = {
      phone: profileForm.phone
    };
    if (authStore.isAdmin) {
      if (profileForm.name) payload.name = profileForm.name;
      if (profileForm.email) payload.email = profileForm.email;
    }

    const res = await authStore.updateProfile(authStore.currentUser.id, payload, ticketStore);
    if (res?.success !== false) {
      setNotice('Informasi profil berhasil diperbarui.');
    } else {
      setNotice(res?.message || 'Gagal memperbarui profil.', true);
    }
  } catch (e) {
    setNotice('Terjadi kesalahan saat menyimpan profil.', true);
  } finally {
    isUpdatingProfile.value = false;
  }
};

const handleChangePassword = async () => {
  if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
    setNotice('Kata sandi baru minimal harus 6 karakter.', true);
    return;
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setNotice('Konfirmasi kata sandi tidak cocok.', true);
    return;
  }

  isUpdatingPassword.value = true;
  try {
    const res = await authStore.changePassword(
      authStore.currentUser.id,
      passwordForm.newPassword,
      ticketStore
    );

    if (res?.success) {
      setNotice('Kata sandi berhasil diperbarui.', false);
      passwordForm.newPassword = '';
      passwordForm.confirmPassword = '';
    } else {
      setNotice(res?.message || 'Gagal mengubah kata sandi.', true);
    }
  } catch (e) {
    setNotice('Terjadi kesalahan saat memperbarui kata sandi.', true);
  } finally {
    isUpdatingPassword.value = false;
  }
};
</script>
