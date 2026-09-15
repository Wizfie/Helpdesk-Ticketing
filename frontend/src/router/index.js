import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import CreateTicketView from '../views/CreateTicketView.vue';
import TicketDetailView from '../views/TicketDetailView.vue';
import KnowledgeBaseView from '../views/KnowledgeBaseView.vue';
import AuditLogView from '../views/AuditLogView.vue';
import ReportsView from '../views/ReportsView.vue';
import UsersManagementView from '../views/UsersManagementView.vue';
import CustomersManagementView from '../views/CustomersManagementView.vue';
import CustomerTrackingView from '../views/CustomerTrackingView.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { roles: ['ADMIN', 'CPIG', 'ENGINEER', 'MANAGEMENT'] }
  },
  {
    path: '/tickets/create',
    name: 'CreateTicket',
    component: CreateTicketView,
    meta: { roles: ['ADMIN', 'CPIG'] } // Hanya CPIG dan Admin yang membuat tiket laporan
  },
  {
    path: '/tickets/:id',
    name: 'TicketDetail',
    component: TicketDetailView,
    meta: { roles: ['ADMIN', 'CPIG', 'ENGINEER', 'MANAGEMENT'] }
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: KnowledgeBaseView,
    meta: { roles: ['ADMIN', 'CPIG', 'ENGINEER'] } // Khusus staf teknis dan operasional
  },
  {
    path: '/audit-logs',
    name: 'AuditLogs',
    component: AuditLogView,
    meta: { roles: ['ADMIN'] } // Khusus System Administrator saja
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { roles: ['ADMIN'] } // Khusus Admin untuk ekspor laporan berkala
  },
  {
    path: '/admin/users',
    name: 'UsersManagement',
    component: UsersManagementView,
    meta: { roles: ['ADMIN'] } // Khusus Admin
  },
  {
    path: '/admin/customers',
    name: 'CustomersManagement',
    component: CustomersManagementView,
    meta: { roles: ['ADMIN'] } // Khusus Admin
  },
  {
    path: '/track/:ticketNumber',
    name: 'CustomerTracking',
    component: CustomerTrackingView,
    meta: { public: true } // Terbuka untuk customer dari link email tanpa login
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Strict RBAC Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const currentRole = authStore.currentUser.roleCode;

  if (to.meta && to.meta.roles) {
    if (to.meta.roles.includes(currentRole)) {
      next();
    } else {
      // Role unauthorized, redirect to safe dashboard
      next('/');
    }
  } else {
    next();
  }
});

export default router;
