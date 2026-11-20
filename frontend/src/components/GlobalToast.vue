<template>
  <div
    class="fixed bottom-5 right-5 z-[9999] flex flex-col items-end space-y-2.5 pointer-events-none max-w-sm sm:max-w-md w-[calc(100%-2.5rem)]"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-3 opacity-0 scale-95"
    >
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        class="pointer-events-auto w-full bg-slate-900/95 backdrop-blur-md text-white border shadow-2xl rounded-2xl p-3.5 flex items-start space-x-3 text-xs"
        :class="getToastBorderClass(toast.type)"
      >
        <!-- Icon Indicator -->
        <div
          class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          :class="getToastIconClass(toast.type)"
        >
          <!-- Success Check -->
          <svg
            v-if="toast.type === 'success'"
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>

          <!-- Error Cross -->
          <svg
            v-else-if="toast.type === 'error'"
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>

          <!-- Warning Triangle -->
          <svg
            v-else-if="toast.type === 'warning'"
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>

          <!-- Info i -->
          <svg
            v-else
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>

        <!-- Toast Message Content -->
        <div class="flex-1 min-w-0 pr-1">
          <p class="font-medium text-slate-100 leading-snug whitespace-pre-line">
            {{ toast.message }}
          </p>
        </div>

        <!-- Dismiss Button -->
        <button
          type="button"
          @click="uiStore.removeToast(toast.id)"
          class="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer shrink-0"
          title="Tutup Notifikasi"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useUiStore } from '../stores/uiStore';

const uiStore = useUiStore();

function getToastBorderClass(type) {
  switch (type) {
    case 'success':
      return 'border-emerald-500/40 shadow-emerald-950/20';
    case 'error':
      return 'border-rose-500/40 shadow-rose-950/20';
    case 'warning':
      return 'border-amber-500/40 shadow-amber-950/20';
    case 'info':
    default:
      return 'border-blue-500/40 shadow-blue-950/20';
  }
}

function getToastIconClass(type) {
  switch (type) {
    case 'success':
      return 'bg-emerald-500/20 text-emerald-400';
    case 'error':
      return 'bg-rose-500/20 text-rose-400';
    case 'warning':
      return 'bg-amber-500/20 text-amber-400';
    case 'info':
    default:
      return 'bg-blue-500/20 text-blue-400';
  }
}
</script>
