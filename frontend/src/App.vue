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
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

const route = useRoute();
const isPublicRoute = computed(() => Boolean(route.meta && route.meta.public));
</script>
