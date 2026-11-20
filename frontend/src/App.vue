<template>
  <!-- Public Standalone Layout (e.g. Customer Self-Service Tracking Portal) -->
  <div v-if="isPublicRoute" class="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
    <router-view />
  </div>

  <!-- Internal Staff Portal Layout (with Navbar, Sidebar, and RBAC Switcher) -->
  <div v-else class="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
    <!-- Top Navbar with GTT Logo, Live Time, Role Switcher -->
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
import { computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTicketStore } from './stores/ticketStore';
import { useAuthStore } from './stores/authStore';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import GlobalToast from './components/GlobalToast.vue';
import GlobalDialog from './components/GlobalDialog.vue';

const route = useRoute();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const isPublicRoute = computed(() => Boolean(route.meta && route.meta.public));

let pollTimer = null;

onMounted(() => {
  // 1. Initial live fetch from MySQL
  ticketStore.fetchInitialDataFromApi();
  authStore.fetchUsersFromApi();

  // 2. Realtime sync on window focus (saat user beralih dari HeidiSQL/Laragon/DB kembali ke browser)
  const onFocusSync = () => {
    ticketStore.fetchInitialDataFromApi();
    authStore.fetchUsersFromApi();
  };
  window.addEventListener('focus', onFocusSync);

  // 3. Periodic background sync setiap 6 detik agar data selalu real-time
  pollTimer = setInterval(() => {
    ticketStore.fetchInitialDataFromApi();
  }, 6000);

  onUnmounted(() => {
    window.removeEventListener('focus', onFocusSync);
    if (pollTimer) clearInterval(pollTimer);
  });
});
</script>
