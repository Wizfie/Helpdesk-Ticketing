<template>
  <div class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
    <!-- Subtle Background Ambient Gradients -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
    </div>

    <!-- Main Container Card -->
    <div class="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-in fade-in duration-300">
      
      <!-- Left Column: Branding & Credentials Form (7 of 12) -->
      <div class="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between">
        <div>
          <!-- Logo & Brand Header -->
          <div class="flex items-center space-x-3 mb-6">
            <img 
              src="/gtt-logo.png" 
              alt="Glotra Technology" 
              class="h-10 w-auto object-contain"
            />
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-black text-slate-900 text-lg tracking-tight">GTT Helpdesk</span>
                <span class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">v1.0 RBAC</span>
              </div>
              <p class="text-xs text-slate-500 font-medium italic">"Think it, Solve it" &bull; 24x7 Enterprise SLA</p>
            </div>
          </div>

          <!-- Title -->
          <div class="mb-6">
            <h1 class="text-2xl font-black text-slate-900 tracking-tight">
              Masuk ke Portal Operasional
            </h1>
            <p class="text-xs text-slate-500 mt-1">
              Silakan masukkan kredensial akun staf atau pilih akun demo di samping untuk menguji pembatasan peran (RBAC).
            </p>
          </div>

          <!-- Alert Error -->
          <div 
            v-if="errorMessage" 
            class="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2 animate-in fade-in"
          >
            <svg class="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- Email -->
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Staf
              </label>
              <div class="relative">
                <input 
                  v-model="email" 
                  type="email" 
                  required
                  placeholder="nama.staf@glotratech.com" 
                  class="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800"
                />
                <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
            </div>

            <!-- Password -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <div class="flex items-center space-x-2">
                  <button 
                    type="button"
                    @click="showForgotPasswordModal = true"
                    class="text-[11px] text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer"
                  >
                    Lupa sandi?
                  </button>
                  <span class="text-slate-300">&bull;</span>
                  <span class="text-[11px] text-slate-500 font-medium">Demo: password123</span>
                </div>
              </div>
              <div class="relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  required
                  placeholder="Masukkan kata sandi..." 
                  class="w-full pl-9 pr-10 py-2 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-800 font-mono"
                />
                <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem Helpdesk' }}</span>
              <svg v-if="!isLoading" class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>
        </div>

        <!-- Footer Notice -->
        <div class="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>&copy; 2026 PT Glotra Technology.</span>
          <span class="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Node JKT-01A Operational
          </span>
        </div>
      </div>

      <!-- Right Column: Quick Demo RBAC Switcher (5 of 12) -->
      <div class="bg-slate-50/90 p-6 sm:p-8 lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-200/80 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Akses Demo Cepat (RBAC)</span>
            <span class="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">1-Click Login</span>
          </div>
          <p class="text-xs text-slate-500 mb-4 leading-relaxed">
            Klik salah satu akun di bawah untuk menguji pembatasan hak akses dan isolasi tiket antar staf teknisi:
          </p>

          <!-- List of Quick Demo Accounts (Dinamis dari Database MySQL) -->
          <div class="space-y-2.5">
            <button 
              v-for="user in activeUsers" 
              :key="user.id"
              @click="quickLogin(user.email)"
              type="button"
              class="w-full text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/60 hover:border-blue-300 transition-all shadow-2xs group cursor-pointer"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-xs text-slate-900 group-hover:text-blue-700">{{ user.name }}</span>
                <span 
                  class="text-[10px] font-bold px-2 py-0.2 rounded border"
                  :class="(user.roleCode || user.role) === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'"
                >
                  {{ user.roleCode || user.role }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 leading-tight">
                {{ user.email }} &bull; {{ user.phone || 'Staf Operasional' }}
              </p>
            </button>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-200/70 text-[10px] text-slate-400 text-center">
          Mode pengujian Role-Based Access Control aktif.
        </div>
      </div>
    </div>

    <!-- Modal Lupa Kata Sandi (Dikelola oleh Admin) -->
    <div v-if="showForgotPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Bantuan Pemulihan Sandi</h4>
              <p class="text-[11px] text-slate-500">Kebijakan Reset Akun PT Glotra Technology</p>
            </div>
          </div>
          <button @click="showForgotPasswordModal = false" class="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer">&times;</button>
        </div>

        <div class="space-y-3 text-slate-600 leading-relaxed text-[11px]">
          <p>
            Untuk menjaga integritas operasional Helpdesk 24/7, <strong>fitur reset kata sandi tidak menggunakan link email publik</strong>, melainkan dibantu dan dikonfirmasi langsung oleh <strong>Administrator / CPIG Helpdesk</strong>.
          </p>

          <div class="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2 text-blue-900">
            <span class="font-bold block text-xs">Cara Mendapatkan Reset Sandi:</span>
            <ol class="list-decimal list-inside space-y-1 text-[11px] text-blue-800">
              <li>Hubungi Administrator melalui email resmi <strong>admin@glotratech.com</strong>.</li>
              <li>Sebutkan email perusahaan dan nama lengkap Anda untuk verifikasi staf.</li>
              <li>Admin akan mereset akun Anda dari menu <em>Manajemen Pengguna</em> dan memberikan sandi sementara.</li>
            </ol>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[10px] text-slate-400 block font-mono">KONTAK ADMINISTRATOR OPERASIONAL:</span>
            <div class="flex items-center justify-between mt-1 text-slate-700 font-semibold">
              <span>Ahmad Fauzi (SysAdmin Lead)</span>
              <span class="font-mono text-blue-600">0811-9988-771</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            @click="showForgotPasswordModal = false"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('admin@glotratech.com');
const password = ref('password123');
const showPassword = ref(false);
const showForgotPasswordModal = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

const activeUsers = computed(() => (authStore.users || []).filter(u => u.isActive));

onMounted(async () => {
  await authStore.fetchUsersFromApi();
  if (activeUsers.value.length > 0 && !email.value) {
    email.value = activeUsers.value[0].email;
  }
});

const handleLogin = () => {
  errorMessage.value = '';
  isLoading.value = true;

  setTimeout(() => {
    const res = authStore.login(email.value, password.value);
    isLoading.value = false;

    if (!res.success) {
      errorMessage.value = res.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.';
      return;
    }

    // Role-based routing: Engineer to /tickets, Admin to /
    if (res.user.roleCode === 'ENGINEER') {
      router.push('/tickets');
    } else {
      router.push('/');
    }
  }, 300);
};

const quickLogin = (userEmail) => {
  email.value = userEmail;
  password.value = 'password123';
  handleLogin();
};
</script>
