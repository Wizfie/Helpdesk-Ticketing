<template>
  <!-- Mobile Backdrop Overlay (< lg): positioned below navbar -->
  <div
    v-if="uiStore.isSidebarOpen"
    @click="uiStore.closeSidebar()"
    class="fixed inset-x-0 top-[57px] bottom-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden transition-opacity"
  ></div>

  <!-- Sidebar Container (Fixed Drawer on Mobile below navbar, Collapsible Static on Desktop) -->
  <aside
    class="bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out shrink-0"
    :class="[
      // Mobile positioning (Fixed drawer, strictly below navbar top-[57px])
      'fixed top-[57px] bottom-0 left-0 w-72 p-4 shadow-2xl z-40 lg:shadow-none',
      uiStore.isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      // Desktop positioning (Static collapsible sidebar under navbar)
      'lg:static lg:top-0 lg:z-10 lg:translate-x-0 lg:min-h-[calc(100vh-57px)]',
      uiStore.isSidebarCollapsed
        ? 'lg:w-0 lg:p-0 lg:border-r-0 lg:opacity-0 lg:pointer-events-none lg:overflow-hidden'
        : 'lg:w-64 lg:p-4 lg:opacity-100',
    ]"
  >
    <div class="space-y-4" :class="{ 'lg:hidden': uiStore.isSidebarCollapsed }">
      <!-- Mobile Close Bar (Only visible on mobile drawer < lg) -->
      <div
        class="flex items-center justify-between pb-2 border-b border-slate-100 lg:hidden"
      >
        <span class="font-bold text-slate-700 text-xs uppercase tracking-wider"
          >Navigasi Menu</span
        >

        <!-- Mobile Close Button -->
        <button
          @click="uiStore.closeSidebar()"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          title="Tutup Menu"
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
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Quick Action Button for CPIG / Admin only -->
      <div v-if="authStore.isAdmin">
        <router-link
          to="/tickets/create"
          @click="uiStore.closeSidebar()"
          class="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all transform active:scale-95"
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
          <span>Buat Tiket Baru</span>
        </router-link>
      </div>

      <!-- Role Identifier Tag -->
      <div
        class="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs"
      >
        <span class="text-slate-500 font-semibold text-[11px]"
          >Akses Menu:</span
        >
        <span class="font-bold text-blue-700 font-mono text-[11px]">
          {{
            authStore.currentUser?.roleCode === "ADMIN"
              ? "ADMIN / CPIG"
              : "ENGINEER"
          }}
        </span>
      </div>

      <!-- Navigation Links (Role-Adaptive) -->
      <nav class="space-y-1 text-xs">
        <!-- ADMIN NAVIGATION -->
        <template v-if="authStore.currentUser?.roleCode === 'ADMIN'">
          <!-- 1. Executive Dashboard (Mission Control) -->
          <router-link
            to="/"
            @click="uiStore.closeSidebar()"
            class="flex items-center px-3 py-2 rounded-lg font-medium transition-colors space-x-2.5"
            :class="
              $route.path === '/'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <svg
              class="w-4 h-4 text-slate-400"
              :class="$route.path === '/' ? 'text-blue-600' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
            <span>Ringkasan Eksekutif</span>
          </router-link>

          <!-- 2. Antrean Tiket Global (/tickets) -->
          <router-link
            to="/tickets"
            @click="uiStore.closeSidebar()"
            class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
            :class="
              $route.path === '/tickets'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <div class="flex items-center space-x-2.5">
              <svg
                class="w-4 h-4 text-slate-400"
                :class="$route.path === '/tickets' ? 'text-blue-600' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              <span>Antrean Tiket</span>
            </div>
            <span
              class="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold"
            >
              {{ ticketStore.totalTickets }}
            </span>
          </router-link>

          <!-- 3. Kelola Staf (Users) -->
          <router-link
            to="/admin/users"
            @click="uiStore.closeSidebar()"
            class="flex items-center px-3 py-2 rounded-lg font-medium transition-colors space-x-2.5"
            :class="
              $route.path === '/admin/users'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <svg
              class="w-4 h-4 text-slate-400"
              :class="$route.path === '/admin/users' ? 'text-blue-600' : ''"
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
            <span>Kelola Staf </span>
          </router-link>

          <!-- 4. Kelola Customer & PIC -->
          <router-link
            to="/admin/customers"
            @click="uiStore.closeSidebar()"
            class="flex items-center px-3 py-2 rounded-lg font-medium transition-colors space-x-2.5"
            :class="
              $route.path === '/admin/customers'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <svg
              class="w-4 h-4 text-slate-400"
              :class="$route.path === '/admin/customers' ? 'text-blue-600' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            <span>Customer</span>
          </router-link>

          <!-- 5. Konfigurasi SLA -->
          <router-link
            to="/admin/sla-configuration"
            @click="uiStore.closeSidebar()"
            class="flex items-center px-3 py-2 rounded-lg font-medium transition-colors space-x-2.5"
            :class="
              $route.path === '/admin/sla-configuration'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <svg
              class="w-4 h-4 text-slate-400"
              :class="
                $route.path === '/admin/sla-configuration'
                  ? 'text-blue-600'
                  : ''
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span>Konfigurasi SLA</span>
          </router-link>

          <!-- 6. Laporan Eksekutif -->
          <router-link
            to="/reports"
            @click="uiStore.closeSidebar()"
            class="flex items-center px-3 py-2 rounded-lg font-medium transition-colors space-x-2.5"
            :class="
              $route.path === '/reports'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <svg
              class="w-4 h-4 text-slate-400"
              :class="$route.path === '/reports' ? 'text-blue-600' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <span>Laporan & Analitik</span>
          </router-link>

          <!-- 7. Knowledge Base -->
          <router-link
            to="/knowledge-base"
            @click="uiStore.closeSidebar()"
            class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
            :class="
              $route.path.startsWith('/knowledge-base')
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <div class="flex items-center space-x-2.5">
              <svg
                class="w-4 h-4 text-slate-400"
                :class="
                  $route.path.startsWith('/knowledge-base')
                    ? 'text-blue-600'
                    : ''
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              <span>Knowledge Base </span>
            </div>
            <span
              class="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-semibold"
            >
              {{ ticketStore.knowledgeBase.length }}
            </span>
          </router-link>

          <!-- 8. Audit Logs -->
          <router-link
            to="/audit-logs"
            @click="uiStore.closeSidebar()"
            class="flex items-center px-3 py-2 rounded-lg font-medium transition-colors space-x-2.5"
            :class="
              $route.path === '/audit-logs'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <svg
              class="w-4 h-4 text-slate-400"
              :class="$route.path === '/audit-logs' ? 'text-blue-600' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <span>Jejak Audit Sistem</span>
          </router-link>
        </template>

        <!-- SUPPORT ENGINEER NAVIGATION (Simplified per MoM) -->
        <template v-else>
          <!-- 1. Tiket Saya (Assigned Queue) -->
          <router-link
            to="/tickets"
            @click="uiStore.closeSidebar()"
            class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
            :class="
              $route.path === '/tickets'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <div class="flex items-center space-x-2.5">
              <svg
                class="w-4 h-4 text-slate-400"
                :class="$route.path === '/tickets' ? 'text-blue-600' : ''"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              <span>Tiket Saya</span>
            </div>
            <span
              class="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold"
            >
              {{
                ticketStore.tickets.filter(
                  (t) =>
                    t.assignedToId === authStore.currentUser?.id &&
                    t.status !== "CLOSED",
                ).length
              }}
            </span>
          </router-link>

          <!-- 3. Knowledge Base & Runbooks -->
          <router-link
            to="/knowledge-base"
            @click="uiStore.closeSidebar()"
            class="flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors"
            :class="
              $route.path.startsWith('/knowledge-base')
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <div class="flex items-center space-x-2.5">
              <svg
                class="w-4 h-4 text-slate-400"
                :class="
                  $route.path.startsWith('/knowledge-base')
                    ? 'text-blue-600'
                    : ''
                "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              <span>Knowledge Base </span>
            </div>
            <span
              class="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-semibold"
            >
              {{ ticketStore.knowledgeBase.length }}
            </span>
          </router-link>
        </template>

        <!-- Profil & Keamanan Akun (Common for both Admin & Engineer) -->
        <div class="pt-2 mt-2 border-t border-slate-100">
          <router-link
            to="/profile"
            @click="uiStore.closeSidebar()"
            class="flex items-center px-3 py-2 rounded-lg font-medium transition-colors space-x-2.5"
            :class="
              $route.path === '/profile'
                ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            "
          >
            <svg
              class="w-4 h-4 text-slate-400"
              :class="$route.path === '/profile' ? 'text-blue-600' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span>Profil </span>
          </router-link>
        </div>
      </nav>
    </div>

    <!-- Bottom: Logout Action & Company Info -->
    <div
      class="pt-3 border-t border-slate-200 space-y-2.5"
      :class="{ 'lg:hidden': uiStore.isSidebarCollapsed }"
    >
      <!-- Logout Button -->
      <button
        @click="handleLogout"
        type="button"
        class="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-colors cursor-pointer group shadow-xs"
        title="Keluar dari akun (Logout)"
      >
        <svg
          class="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          ></path>
        </svg>
        <span>Keluar Sistem</span>
      </button>

      <div class="text-[11px] text-slate-400 text-center">
        <p class="font-semibold text-slate-600">
          PT Global Transformasi Teknologi
        </p>
        <p class="text-[10px] text-slate-400">Helpdesk Ticketing System</p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useTicketStore } from "../stores/ticketStore";
import { useUiStore } from "../stores/uiStore";

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();
const uiStore = useUiStore();

const handleLogout = () => {
  uiStore.closeSidebar();
  authStore.logout();
  router.push("/login");
};
</script>
