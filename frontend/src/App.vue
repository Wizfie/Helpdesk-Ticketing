<template>
  <!-- Public Standalone Layout (e.g. Login, Customer Self-Service Tracking Portal) -->
  <div v-if="isPublicRoute || !authStore.isAuthenticated" class="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans antialiased text-slate-800 dark:text-slate-100">
    <router-view />
  </div>

  <!-- Internal Staff Portal Layout -->
  <div v-else class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans antialiased text-slate-800 dark:text-slate-100">
    <!-- Top Navbar -->
    <Navbar />

    <!-- Main Container (Sidebar + Content) -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar Navigation -->
      <Sidebar />

      <!-- Main Dynamic Content Area -->
      <main class="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 transition-all duration-300">
        <router-view />
      </main>
    </div>
  </div>

  <!-- Global Application Notifications & Standard Dialogs -->
  <GlobalToast />
  <GlobalDialog />
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTicketStore } from './stores/ticketStore';
import { useAuthStore } from './stores/authStore';
import { useUiStore } from './stores/uiStore';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import GlobalToast from './components/GlobalToast.vue';
import GlobalDialog from './components/GlobalDialog.vue';

const route = useRoute();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const uiStore = useUiStore();
const isPublicRoute = computed(() => Boolean(route.meta && route.meta.public));

let pollTimer = null;

onMounted(() => {
  // 0. Initialize theme mode (Dark / Light)
  uiStore.initTheme();

  // 1. Initial live fetch from MySQL hanya jika user sudah login dan bukan di halaman publik
  if (authStore.isAuthenticated && !isPublicRoute.value) {
    ticketStore.fetchInitialDataFromApi();
    authStore.fetchUsersFromApi();
  }

  // Muat data otomatis tepat setelah user berhasil login
  watch(() => authStore.isAuthenticated, (authed) => {
    if (authed && !isPublicRoute.value) {
      ticketStore.fetchInitialDataFromApi();
      authStore.fetchUsersFromApi();
    }
  });

  // 2. Realtime sync on window focus (saat user beralih dari HeidiSQL/Laragon/DB kembali ke browser)
  const onFocusSync = () => {
    if (authStore.isAuthenticated && !isPublicRoute.value) {
      ticketStore.fetchInitialDataFromApi();
      authStore.fetchUsersFromApi();
    }
  };
  window.addEventListener('focus', onFocusSync);

  // 3. Periodic background sync setiap 10 detik agar data selalu real-time (hanya untuk sesi aktif)
  pollTimer = setInterval(() => {
    if (authStore.isAuthenticated && !isPublicRoute.value) {
      ticketStore.fetchInitialDataFromApi();
    }
  }, 10000);

  onUnmounted(() => {
    window.removeEventListener('focus', onFocusSync);
    if (pollTimer) clearInterval(pollTimer);
  });
});
</script>
