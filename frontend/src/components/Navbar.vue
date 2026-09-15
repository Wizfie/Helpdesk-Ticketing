<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 px-3 sm:px-4 lg:px-6 py-2.5 shadow-sm">
    <div class="flex items-center justify-between gap-2">
      <!-- Left: Hamburger Menu (Mobile) & Brand Logo -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <!-- Hamburger / Sidebar Toggle Button (Visible on Mobile & Desktop) -->
        <button
          @click="uiStore.toggleSidebar()"
          type="button"
          class="p-1.5 rounded-lg transition-colors focus:outline-none flex items-center justify-center"
          :class="[
            uiStore.isSidebarCollapsed 
              ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          ]"
          :title="uiStore.isSidebarCollapsed ? 'Tampilkan Sidebar (Klik)' : 'Sembunyikan Sidebar Menu (Klik)'"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <!-- Brand Logo & Title -->
        <router-link to="/" class="flex items-center space-x-2.5 group shrink-0">
          <img 
            src="/gtt-logo.png" 
            alt="Glotra Technology" 
            class="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div class="hidden sm:block">
            <div class="flex items-center space-x-1.5">
              <span class="font-bold text-slate-900 text-sm sm:text-base tracking-tight">GTT Helpdesk</span>
              <span class="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded">v1.0</span>
            </div>
            <p class="text-[10px] sm:text-xs text-slate-500 font-medium italic">"Think it, Solve it"</p>
          </div>
        </router-link>
      </div>

      <!-- Center: Live Time Clock (WIB & UTC) - Hidden on mobile -->
      <div class="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-slate-700 font-semibold">{{ currentWibTime }} WIB</span>
        <span class="text-slate-400">|</span>
        <span class="text-slate-500">{{ currentUtcTime }} UTC</span>
      </div>

      <!-- Right: Role Switcher & Profile -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <!-- Desktop Role Switcher (Pills) -->
        <div class="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span class="text-xs font-semibold text-slate-500 px-2">Peran:</span>
          <button
            v-for="role in authStore.roles"
            :key="role.id"
            @click="switchRole(role.code)"
            :class="[
              'px-2.5 py-1 text-xs font-medium rounded-md transition-all',
              authStore.currentUser.roleCode === role.code
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            ]"
            :title="role.description"
          >
            {{ role.code }}
          </button>
        </div>

        <!-- Mobile Role Selector (Compact Dropdown) -->
        <div class="lg:hidden flex items-center">
          <select 
            :value="authStore.currentUser.roleCode"
            @change="switchRole($event.target.value)"
            class="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="role in authStore.roles" :key="role.id" :value="role.code">
              {{ role.code }}
            </option>
          </select>
        </div>

        <!-- Reset Demo Data Button -->
        <button
          @click="handleResetDemo"
          type="button"
          class="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-all"
          title="Reset semua data tiket ke kondisi default bawaan awal"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          <span class="hidden sm:inline">Reset Demo</span>
        </button>

        <!-- Active User Initials Badge -->
        <div class="flex items-center space-x-2 pl-1.5 sm:pl-2 border-l border-slate-200">
          <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] sm:text-xs tracking-wider shadow-sm shrink-0">
            {{ authStore.currentUser.initials }}
          </div>
          <div class="hidden xl:block text-left">
            <p class="text-xs font-bold text-slate-800 leading-tight">{{ authStore.currentUser.name }}</p>
            <p class="text-[11px] font-medium text-blue-600">{{ authStore.currentUser.roleCode }}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';
import { useTicketStore } from '../stores/ticketStore';

const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();
const ticketStore = useTicketStore();

const currentWibTime = ref('');
const currentUtcTime = ref('');

let clockInterval = null;

const switchRole = (code) => {
  authStore.switchRole(code);
  const allowedRoles = router.currentRoute.value.meta?.roles;
  if (allowedRoles && !allowedRoles.includes(code)) {
    router.push('/');
  }
};

const handleResetDemo = () => {
  if (window.confirm('Kembalikan semua data ke default awal demo? Tiket dan input baru di browser ini akan di-reset.')) {
    ticketStore.resetToDefaultData();
    window.location.reload();
  }
};

const updateClock = () => {
  const now = new Date();
  
  currentWibTime.value = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  }).format(now);

  const uH = String(now.getUTCHours()).padStart(2, '0');
  const uM = String(now.getUTCMinutes()).padStart(2, '0');
  const uS = String(now.getUTCSeconds()).padStart(2, '0');
  currentUtcTime.value = `${uH}:${uM}:${uS}`;
};

onMounted(() => {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
});
</script>
