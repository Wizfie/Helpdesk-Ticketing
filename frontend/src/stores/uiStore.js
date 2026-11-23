
import { defineStore } from 'pinia';

// Helper to determine initial dark mode state
const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem('gtt_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    return false;
  }
};

// Immediately apply theme class to prevent FOUC (Flash of Unstyled Content)
if (typeof document !== 'undefined') {
  try {
    if (getInitialDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    isDarkMode: getInitialDarkMode(),
    isSidebarOpen: false, // Mobile drawer state (< 1024px)
    isSidebarCollapsed: false, // Desktop sidebar collapse state (>= 1024px)
    toasts: [],
    dialog: {
      isOpen: false,
      title: '',
      message: '',
      type: 'info', // 'danger' | 'warning' | 'info' | 'success'
      confirmText: 'Lanjutkan',
      cancelText: 'Batal',
      showCancel: false,
      resolve: null
    }
  }),

  actions: {
    // ------------------------------------------------------------------------
    // Theme Mode Management (Light / Dark)
    // ------------------------------------------------------------------------
    initTheme() {
      this.isDarkMode = getInitialDarkMode();
      this.applyTheme();
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      try {
        localStorage.setItem('gtt_theme', this.isDarkMode ? 'dark' : 'light');
      } catch (e) {}
      this.applyTheme();
    },

    applyTheme() {
      if (typeof document === 'undefined') return;
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    // ------------------------------------------------------------------------
    // 0. Sidebar & Drawer Navigation State
    // ------------------------------------------------------------------------
    toggleSidebar() {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        this.isSidebarOpen = !this.isSidebarOpen;
      } else {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      }
    },
    openSidebar() {
      this.isSidebarOpen = true;
      this.isSidebarCollapsed = false;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },

    // ------------------------------------------------------------------------
    // 1. Toast Notification Management
    // ------------------------------------------------------------------------
    showToast({ message, type = 'info', duration = 4000 }) {
      const id = Date.now() + Math.random().toString(36).substring(2, 7);
      const toastItem = { id, message, type, duration };
      this.toasts.push(toastItem);

      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, duration);
      }
      return id;
    },

    removeToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },

    // Shorthand helpers for direct calls
    toastSuccess(message, duration = 4000) {
      return this.showToast({ message, type: 'success', duration });
    },

    toastError(message, duration = 5000) {
      return this.showToast({ message, type: 'error', duration });
    },

    toastWarning(message, duration = 4500) {
      return this.showToast({ message, type: 'warning', duration });
    },

    toastInfo(message, duration = 4000) {
      return this.showToast({ message, type: 'info', duration });
    },

    // ------------------------------------------------------------------------
    // 2. Promise-Based Confirmation & Alert Dialogs
    // ------------------------------------------------------------------------
    confirm({
      title = 'Konfirmasi Tindakan',
      message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
      type = 'danger', // 'danger' | 'warning' | 'info'
      confirmText = 'Lanjutkan',
      cancelText = 'Batal'
    }) {
      return new Promise((resolve) => {
        this.dialog = {
          isOpen: true,
          title,
          message,
          type,
          confirmText,
          cancelText,
          showCancel: true,
          resolve
        };
      });
    },

    alert({
      title = 'Pemberitahuan',
      message = '',
      type = 'info', // 'info' | 'warning' | 'error' | 'success'
      confirmText = 'Mengerti'
    }) {
      return new Promise((resolve) => {
        this.dialog = {
          isOpen: true,
          title,
          message,
          type,
          confirmText,
          cancelText: '',
          showCancel: false,
          resolve
        };
      });
    },

    resolveDialog(result) {
      if (this.dialog.resolve) {
        this.dialog.resolve(result);
      }
      this.dialog.isOpen = false;
      this.dialog.resolve = null;
    }
  }
});
