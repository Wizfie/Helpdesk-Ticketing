import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: false // Mobile sidebar drawer state
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    openSidebar() {
      this.isSidebarOpen = true;
    }
  }
});
