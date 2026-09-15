import { defineStore } from 'pinia';

const STORAGE_KEY_SIDEBAR_COLLAPSED = 'gtt_ui_sidebar_collapsed';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: false, // Mobile drawer state (< lg)
    isSidebarCollapsed: typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem(STORAGE_KEY_SIDEBAR_COLLAPSED) === 'true'
      : false // Desktop sidebar collapsed/hidden (>= lg)
  }),
  actions: {
    toggleMobileSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeMobileSidebar() {
      this.isSidebarOpen = false;
    },
    openMobileSidebar() {
      this.isSidebarOpen = true;
    },
    toggleSidebarCollapse() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY_SIDEBAR_COLLAPSED, String(this.isSidebarCollapsed));
      }
    },
    toggleSidebar() {
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        this.toggleMobileSidebar();
      } else {
        this.toggleSidebarCollapse();
      }
    },
    closeSidebar() {
      this.closeMobileSidebar();
    }
  }
});

