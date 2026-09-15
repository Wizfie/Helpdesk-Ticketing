<template>
  <!-- Mobile Backdrop Overlay -->
  <div 
    v-if="uiStore.isSidebarOpen" 
    @click="uiStore.closeSidebar()"
    class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
  ></div>

  <!-- Sidebar Container (Fixed Drawer on Mobile, Collapsible Static on Desktop) -->
  <aside 
    class="bg-white border-r border-slate-200 flex flex-col justify-between z-30 transition-all duration-300 ease-in-out shrink-0"
    :class="[
      // Mobile positioning (Fixed drawer)
      'fixed inset-y-0 left-0 w-72 p-4 shadow-2xl lg:shadow-none',
      uiStore.isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      // Desktop positioning (Static collapsible sidebar)
      'lg:static lg:translate-x-0 lg:min-h-[calc(100vh-61px)]',
      uiStore.isSidebarCollapsed 
        ? 'lg:w-0 lg:p-0 lg:border-r-0 lg:opacity-0 lg:pointer-events-none lg:overflow-hidden' 
        : 'lg:w-64 lg:p-4 lg:opacity-100'
    ]"
  >
    <div class="space-y-4" :class="{ 'lg:hidden': uiStore.isSidebarCollapsed }">
      <!-- Drawer / Sidebar Top Bar with Collapse & Close Buttons -->
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <div class="flex items-center space-x-2">
          <img src="/gtt-logo.png" alt="GTT" class="h-6 w-auto object-contain" />
          <span class="font-bold text-slate-800 text-xs tracking-tight">Navigasi Helpdesk</span>
        </div>

        <!-- Mobile Close Button -->
        <button 
          @click="uiStore.closeSidebar()" 
          class="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          title="Tutup Menu"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <!-- Desktop Collapse Button -->
        <button 
          @click="uiStore.toggleSidebarCollapse()" 
          class="hidden lg:flex p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Sembunyikan Sidebar"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

      <!-- Quick Action Button for CPIG / Admin only -->
      <div v-if="['CPIG', 'ADMIN'].includes(authStore.currentUser.roleCode)">
        <router-link
          to="/tickets/create"
          @click="uiStore.closeSidebar()"
          class="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all transform active:scale-95"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Buat Tiket Baru</span>
        </router-link>
        <p class="text-[11px] text-slate-400 text-center mt-1 font-medium">Quick Presets & Smart Extraction</p>
      </div>

      <!-- Role Identifier Tag -->
      <div class="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
        <span class="text-slate-500 font-semibold text-[11px]">Akses Menu:</span>
        <span class="font-bold text-blue-700 font-mono text-[11px]">{{ authStore.currentUser.roleCode }}</span>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1 text-xs">
        <!-- 1. Dashboard (All Roles) -->
        <router-link
          to="/"
          @click="uiStore.closeSidebar()"
          class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
          :class="$route.path === '/' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-4 h-4 text-slate-400" :class="$route.path === '/' ? 'text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            <span>Dashboard Tiket</span>
          </div>
          <span class="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
            {{ ticketStore.totalTickets }}
          </span>
        </router-link>

        <!-- 2. Admin Menus: Users Management -->
        <router-link
          v-if="authStore.currentUser.roleCode === 'ADMIN'"
          to="/admin/users"
          @click="uiStore.closeSidebar()"
          class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
          :class="$route.path === '/admin/users' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-4 h-4 text-slate-400" :class="$route.path === '/admin/users' ? 'text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span>Kelola Staf (Users)</span>
          </div>
          <span class="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Admin</span>
        </router-link>

        <!-- 3. Admin Menus: Customers Management -->
        <router-link
          v-if="authStore.currentUser.roleCode === 'ADMIN'"
          to="/admin/customers"
          @click="uiStore.closeSidebar()"
          class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
          :class="$route.path === '/admin/customers' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-4 h-4 text-slate-400" :class="$route.path === '/admin/customers' ? 'text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span>Kelola Customer & PIC</span>
          </div>
          <span class="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Admin</span>
        </router-link>

        <!-- 4. Laporan Eksekutif (Admin only) -->
        <router-link
          v-if="authStore.currentUser.roleCode === 'ADMIN'"
          to="/reports"
          @click="uiStore.closeSidebar()"
          class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
          :class="$route.path === '/reports' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-4 h-4 text-slate-400" :class="$route.path === '/reports' ? 'text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span>Laporan Eksekutif</span>
          </div>
          <span class="bg-indigo-50 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded font-bold">PDF/XLS</span>
        </router-link>

        <!-- 5. Knowledge Base (Admin, CPIG, Engineer) -->
        <router-link
          v-if="['ADMIN', 'CPIG', 'ENGINEER'].includes(authStore.currentUser.roleCode)"
          to="/knowledge-base"
          @click="uiStore.closeSidebar()"
          class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
          :class="$route.path === '/knowledge-base' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-4 h-4 text-slate-400" :class="$route.path === '/knowledge-base' ? 'text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Knowledge Base</span>
          </div>
          <span class="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-semibold">
            {{ ticketStore.knowledgeBase.length }}
          </span>
        </router-link>

        <!-- 6. Audit Logs (Admin only) -->
        <router-link
          v-if="authStore.currentUser.roleCode === 'ADMIN'"
          to="/audit-logs"
          @click="uiStore.closeSidebar()"
          class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
          :class="$route.path === '/audit-logs' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'"
        >
          <div class="flex items-center space-x-2.5">
            <svg class="w-4 h-4 text-slate-400" :class="$route.path === '/audit-logs' ? 'text-blue-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Jejak Audit (Logs)</span>
          </div>
          <span class="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-semibold">Live</span>
        </router-link>
      </nav>

      <!-- SLA Status Widget -->
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Performa SLA 24/7</span>
          <span class="text-xs font-bold text-blue-600">{{ ticketStore.slaComplianceRate }}%</span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div 
            class="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
            :style="{ width: `${ticketStore.slaComplianceRate}%` }"
          ></div>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div class="bg-white p-2 rounded border border-slate-100">
            <span class="text-slate-400 block text-[10px]">Antrean</span>
            <span class="font-bold text-amber-600 text-xs">{{ ticketStore.openCount }}</span>
          </div>
          <div class="bg-white p-2 rounded border border-slate-100">
            <span class="text-slate-400 block text-[10px]">Selesai</span>
            <span class="font-bold text-emerald-600 text-xs">{{ ticketStore.resolvedCount + ticketStore.closedCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom: Company Info Card -->
    <div class="pt-3 border-t border-slate-200 text-xs text-slate-500 space-y-0.5" :class="{ 'lg:hidden': uiStore.isSidebarCollapsed }">
      <p class="font-semibold text-slate-700 text-[11px]">PT Global Transformasi Teknologi</p>
      <p class="text-[10px] text-slate-400">Kerja Praktik Sistem Helpdesk 2026</p>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useTicketStore } from '../stores/ticketStore';
import { useUiStore } from '../stores/uiStore';

const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();
</script>
