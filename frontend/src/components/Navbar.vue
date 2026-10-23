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
        <router-link :to="authStore.currentUser?.roleCode === 'ENGINEER' ? '/tickets' : '/'" class="flex items-center space-x-2.5 group shrink-0">
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

      <!-- Right: User Actions, Notifications, & Profile -->
      <div class="flex items-center space-x-2 sm:space-x-3">

        <!-- Simple Clean & Seed Database Buttons -->
        <div class="flex items-center space-x-1 sm:space-x-1.5">
          <!-- Button 1: Clean (0 Tiket) -->
          <button
            @click="handleCleanData"
            :disabled="ticketStore.isSystemResetting"
            type="button"
            class="px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
            :class="ticketStore.isCleanMode 
              ? 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-200 shadow-2xs font-bold' 
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'"
            title="Bersihkan semua tiket (0 Tiket)"
          >
            <span>🧹</span>
            <span class="hidden sm:inline">Clean</span>
            <span class="text-[10px] px-1 py-0.2 rounded font-mono font-bold" :class="ticketStore.isCleanMode ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'">0</span>
          </button>

          <!-- Button 2: Seeding (156 Tiket) -->
          <button
            @click="handleSeedData"
            :disabled="ticketStore.isSystemResetting"
            type="button"
            class="px-2 sm:px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
            :class="!ticketStore.isCleanMode 
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-1 ring-emerald-200 shadow-2xs font-bold' 
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'"
            title="Muat ulang 156 tiket seeding"
          >
            <span>🌱</span>
            <span class="hidden sm:inline">Seeding</span>
            <span class="text-[10px] px-1 py-0.2 rounded font-mono font-bold" :class="!ticketStore.isCleanMode ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500'">156</span>
          </button>
        </div>

        <!-- Notification Bell & Badge Menu -->
        <div class="relative" ref="notificationDropdownRef">
          <button
            @click="toggleNotificationDropdown"
            type="button"
            class="relative p-1.5 sm:p-2 rounded-lg transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
            :class="[
              isNotificationOpen 
                ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-200' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            ]"
            title="Pemberitahuan Sistem"
          >
            <!-- Bell Icon -->
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>

            <!-- Dynamic Unread Alert Count Badge -->
            <span 
              v-if="ticketStore.unreadNotificationCount > 0"
              class="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-rose-500 rounded-full ring-2 ring-white shadow-xs animate-pulse"
            >
              {{ ticketStore.unreadNotificationCount }}
            </span>
          </button>

          <!-- Notification Dropdown Panel (Multi-purpose System Notifications) -->
          <div 
            v-if="isNotificationOpen"
            class="absolute right-0 mt-2 w-84 sm:w-[420px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          >
            <!-- Dropdown Header -->
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
              <div class="flex items-center space-x-2">
                <span class="font-bold text-slate-900 text-xs tracking-tight">Notifikasi Sistem</span>
                <span 
                  v-if="ticketStore.unreadNotificationCount > 0"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 font-mono"
                >
                  {{ ticketStore.unreadNotificationCount }} Baru
                </span>
                <span 
                  v-else-if="ticketStore.systemNotifications.length > 0"
                  class="text-[10px] text-slate-400 font-medium"
                >
                  Semua telah dibaca
                </span>
              </div>

              <!-- Quick Header Actions -->
              <div class="flex items-center space-x-1">
                <button
                  v-if="ticketStore.unreadNotificationCount > 0"
                  @click.stop="ticketStore.markAllNotificationsAsRead()"
                  class="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                  title="Tandai semua sudah dibaca"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7M5 18l4 4L19 12"></path>
                  </svg>
                </button>

                <button
                  v-if="ticketStore.systemNotifications.length > 0"
                  @click.stop="ticketStore.clearAllNotifications()"
                  class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  title="Bersihkan notifikasi (akan diingatkan kembali dalam 30 menit jika kondisi belum terselesaikan)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>

                <button 
                  @click="isNotificationOpen = false" 
                  class="text-slate-400 hover:text-slate-600 text-lg leading-none p-1 cursor-pointer"
                  title="Tutup"
                >
                  &times;
                </button>
              </div>
            </div>

            <!-- Notification Items List -->
            <div class="max-h-[460px] overflow-y-auto divide-y divide-slate-100">
              <div 
                v-for="notif in ticketStore.systemNotifications" 
                :key="notif.id"
                @click="handleNotificationClick(notif)"
                class="p-3.5 transition-colors cursor-pointer flex items-start space-x-3 text-left group relative"
                :class="[
                  !notif.isRead ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'hover:bg-slate-50 opacity-90'
                ]"
              >
                <!-- Unread Blue Dot Indicator -->
                <span 
                  v-if="!notif.isRead"
                  class="absolute top-4 left-1.5 w-1.5 h-1.5 rounded-full bg-blue-600"
                  title="Belum dibaca"
                ></span>

                <!-- Alert Icon -->
                <div 
                  class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  :class="{
                    'bg-rose-100 text-rose-600': notif.severity === 'CRITICAL' || notif.badgeColor === 'rose',
                    'bg-amber-100 text-amber-700': notif.severity === 'WARNING' || notif.badgeColor === 'amber',
                    'bg-blue-100 text-blue-700': notif.badgeColor === 'blue' || notif.severity === 'INFO'
                  }"
                >
                  <!-- Quota Icon -->
                  <svg v-if="notif.category === 'KUOTA'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                  <!-- Maintenance Icon -->
                  <svg v-else-if="notif.category === 'MAINTENANCE'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <!-- SLA Breach / Near Breach Icon -->
                  <svg v-else-if="notif.category === 'SLA'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <!-- Dispatch / Unassigned Icon -->
                  <svg v-else-if="notif.category === 'DISPATCH'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  <!-- Assignment Icon -->
                  <svg v-else-if="notif.category === 'ASSIGNMENT'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <!-- Critical Incident (Flame) Icon -->
                  <svg v-else-if="notif.category === 'INCIDENT'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
                  </svg>
                  <!-- Knowledge Base Review Icon -->
                  <svg v-else-if="notif.category === 'KNOWLEDGE_BASE'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  <!-- Fallback Icon -->
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>

                <!-- Info Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-1.5 mb-1">
                    <h5 
                      class="text-xs leading-snug break-words transition-colors flex-1"
                      :class="!notif.isRead ? 'font-bold text-slate-900 group-hover:text-blue-600' : 'font-semibold text-slate-700 group-hover:text-blue-600'"
                    >
                      {{ notif.title }}
                    </h5>
                    <span 
                      class="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0 whitespace-nowrap"
                      :class="{
                        'bg-rose-50 text-rose-700 border border-rose-200': notif.badgeColor === 'rose',
                        'bg-amber-50 text-amber-700 border border-amber-200': notif.badgeColor === 'amber',
                        'bg-blue-50 text-blue-700 border border-blue-200': notif.badgeColor === 'blue'
                      }"
                    >
                      {{ notif.badgeText }}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed break-words">
                    {{ notif.message }}
                  </p>
                  
                  <div class="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span class="font-mono">{{ notif.timestamp }}</span>
                    <div class="flex items-center space-x-2">
                      <button
                        @click.stop="ticketStore.clearNotification(notif.id)"
                        class="text-slate-400 hover:text-rose-600 text-[10px] font-medium transition-colors"
                        title="Tunda notifikasi ini (30 menit)"
                      >
                        Hapus
                      </button>
                      <span class="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                        Buka &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="ticketStore.systemNotifications.length === 0" class="py-8 text-center px-4">
                <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p class="text-xs font-bold text-slate-800">Semua Notifikasi Bersih</p>
                <p class="text-[11px] text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                  Tidak ada notifikasi aktif. Peringatan akan otomatis muncul kembali dalam 30 menit jika kondisi belum terselesaikan.
                </p>
              </div>
            </div>


          </div>
        </div>

        <!-- Active User Profile & Logout -->
        <div class="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 border-l border-slate-200">
          <router-link 
            to="/profile"
            class="flex items-center space-x-2 p-1 -m-1 rounded-xl hover:bg-slate-100 transition-colors group cursor-pointer"
            title="Buka Profil Pengguna & Kelola Sandi (Klik)"
          >
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs tracking-wider shadow-sm shrink-0 group-hover:ring-2 group-hover:ring-blue-400 transition-all">
              {{ authStore.currentUser?.initials || 'U' }}
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px] lg:max-w-[160px] group-hover:text-blue-600 transition-colors">
                {{ authStore.currentUser?.name || 'User' }}
              </p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span 
                  class="text-[9px] font-bold px-1.5 py-0.2 rounded font-mono"
                  :class="authStore.isEngineer ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ authStore.currentUser?.roleCode || 'USER' }}
                </span>
                <span class="text-[10px] text-slate-400 truncate max-w-[120px] hidden xl:inline">{{ authStore.currentUser?.email }}</span>
              </div>
            </div>
          </router-link>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            type="button"
            class="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-colors cursor-pointer"
            title="Keluar dari akun (Logout)"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="hidden md:inline">Keluar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Global Database Operation Overlay -->
    <div 
      v-if="ticketStore.isSystemResetting" 
      class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div class="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4 border border-slate-100">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center animate-spin">
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-sm">Menghubungkan ke Database MySQL</h4>
          <p class="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Mengeksekusi transaksi data di backend Express.js (Prisma ORM)...
          </p>
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

const isNotificationOpen = ref(false);
const notificationDropdownRef = ref(null);
let recheckInterval = null;

const toggleNotificationDropdown = () => {
  isNotificationOpen.value = !isNotificationOpen.value;
};

const handleCleanData = async () => {
  if (ticketStore.isCleanMode) return;
  if (window.confirm('Bersihkan semua tiket? (Mode Bersih 0 Tiket)')) {
    await ticketStore.switchToCleanMode();
    router.push('/');
  }
};

const handleSeedData = async () => {
  if (!ticketStore.isCleanMode) return;
  if (window.confirm('Muat ulang 156 tiket seeding ke database?')) {
    await ticketStore.switchToFullMockMode();
    router.push('/');
  }
};

const handleNotificationClick = (notif) => {
  // Mark as read when opened
  ticketStore.markNotificationAsRead(notif.id);
  isNotificationOpen.value = false;

  if (notif.type.includes('QUOTA') || notif.type.includes('MAINTENANCE')) {
    router.push({ path: '/admin/customers', query: { focus: notif.targetId } });
  } else if (notif.targetTicketId) {
    ticketStore.selectTicket(notif.targetTicketId);
    router.push('/tickets');
  } else if (notif.link) {
    router.push(notif.link);
  }
};

const handleClickOutside = (event) => {
  if (notificationDropdownRef.value && !notificationDropdownRef.value.contains(event.target)) {
    isNotificationOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  // Auto-schedule background recheck: immediate check then every 30 seconds
  ticketStore.recheckNotifications();
  recheckInterval = setInterval(() => {
    ticketStore.recheckNotifications();
  }, 30000);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (recheckInterval) {
    clearInterval(recheckInterval);
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const switchRole = (code) => {
  authStore.switchRole(code);
  if (code === 'ENGINEER') {
    router.push('/tickets');
  } else {
    router.push('/');
  }
};
</script>
