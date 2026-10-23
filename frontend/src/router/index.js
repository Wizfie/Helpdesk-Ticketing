import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import TicketListView from '../views/TicketListView.vue';
import CreateTicketView from '../views/CreateTicketView.vue';
import TicketDetailView from '../views/TicketDetailView.vue';
import KnowledgeBaseView from '../views/KnowledgeBaseView.vue';
import KnowledgeProposeView from '../views/KnowledgeProposeView.vue';
import AuditLogView from '../views/AuditLogView.vue';
import ReportsView from '../views/ReportsView.vue';
import UsersManagementView from '../views/UsersManagementView.vue';
import CustomersManagementView from '../views/CustomersManagementView.vue';
import CustomerTrackingView from '../views/CustomerTrackingView.vue';
import SlaConfigView from '../views/SlaConfigView.vue';
import ProfileView from '../views/ProfileView.vue';
import { useAuthStore } from '../stores/authStore';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { roles: ['ADMIN'] }
  },
  {
    path: '/tickets',
    name: 'TicketList',
    component: TicketListView,
    meta: { roles: ['ADMIN', 'ENGINEER'] }
  },
  {
    path: '/tickets/create',
    name: 'CreateTicket',
    component: CreateTicketView,
    meta: { roles: ['ADMIN'] } // Khusus Admin / CPIG Helpdesk
  },
  {
    path: '/tickets/:id',
    name: 'TicketDetail',
    component: TicketDetailView,
    meta: { roles: ['ADMIN', 'ENGINEER'] }
  },
  {
    path: '/knowledge-base',
    name: 'KnowledgeBase',
    component: KnowledgeBaseView,
    meta: { roles: ['ADMIN', 'ENGINEER'] }
  },
  {
    path: '/knowledge-base/propose',
    name: 'KnowledgePropose',
    component: KnowledgeProposeView,
    meta: { roles: ['ADMIN', 'ENGINEER'] }
  },
  {
    path: '/audit-logs',
    name: 'AuditLogs',
    component: AuditLogView,
    meta: { roles: ['ADMIN'] } // Khusus Admin / CPIG Lead
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
    meta: { roles: ['ADMIN'] } // Khusus Admin / CPIG
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
    path: '/admin/sla-configuration',
    name: 'SlaConfiguration',
    component: SlaConfigView,
    meta: { roles: ['ADMIN'] } // Khusus Admin
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { roles: ['ADMIN', 'ENGINEER'] }
  },
  {
    path: '/track/:ticketNumber',
    name: 'CustomerTracking',
    component: CustomerTrackingView,
    meta: { public: true } // Terbuka untuk customer dari link email/WA tanpa login
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Strict RBAC Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const currentRole = authStore.currentUser?.roleCode;

  // 1. Handle Public Routes (Login, Public Customer Tracker)
  if (to.meta && to.meta.public) {
    // If user is already authenticated and visits /login, redirect to their home
    if (to.path === '/login' && isAuthenticated) {
      return next(currentRole === 'ENGINEER' ? '/tickets' : '/');
    }
    return next();
  }

  // 2. Authentication Check
  if (!isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  // 3. Engineer landing page redirect: If Engineer accesses root '/', send directly to '/tickets' (Tiket Saya)
  if (to.path === '/' && currentRole === 'ENGINEER') {
    return next('/tickets');
  }

  // 4. Role Authorization Check
  if (to.meta && to.meta.roles) {
    if (to.meta.roles.includes(currentRole)) {
      next();
    } else {
      // Role unauthorized, redirect to appropriate role home
      next(currentRole === 'ENGINEER' ? '/tickets' : '/');
    }
  } else {
    next();
  }
});

export default router;
