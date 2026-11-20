<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="uiStore.dialog.isOpen"
      class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      @click.self="handleCancel"
    >
      <div
        class="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-start space-x-3.5">
          <!-- Icon Badge -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5"
            :class="dialogIconClasses.container"
          >
            <!-- Danger / Delete Icon -->
            <svg
              v-if="uiStore.dialog.type === 'danger'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>

            <!-- Warning Icon -->
            <svg
              v-else-if="uiStore.dialog.type === 'warning'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>

            <!-- Success Icon -->
            <svg
              v-else-if="uiStore.dialog.type === 'success'"
              class="w-5 h-5"
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

            <!-- Info Icon -->
            <svg
              v-else
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>

          <!-- Dialog Title & Message -->
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug">
              {{ uiStore.dialog.title }}
            </h3>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
              {{ uiStore.dialog.message }}
            </p>
          </div>
        </div>

        <!-- Dialog Action Buttons -->
        <div class="flex justify-end items-center space-x-2 pt-2 border-t border-slate-100">
          <button
            v-if="uiStore.dialog.showCancel"
            type="button"
            @click="handleCancel"
            class="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {{ uiStore.dialog.cancelText || 'Batal' }}
          </button>
          <button
            ref="confirmButtonRef"
            type="button"
            @click="handleConfirm"
            class="px-4 py-2 text-white font-bold text-xs rounded-xl transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5"
            :class="dialogIconClasses.confirmBtn"
          >
            {{ uiStore.dialog.confirmText || 'OK' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch, ref, nextTick, onMounted, onUnmounted } from 'vue';
import { useUiStore } from '../stores/uiStore';

const uiStore = useUiStore();
const confirmButtonRef = ref(null);

const dialogIconClasses = computed(() => {
  switch (uiStore.dialog.type) {
    case 'danger':
      return {
        container: 'bg-rose-100 text-rose-600 border border-rose-200',
        confirmBtn: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
      };
    case 'warning':
      return {
        container: 'bg-amber-100 text-amber-600 border border-amber-200',
        confirmBtn: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
      };
    case 'success':
      return {
        container: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
        confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
      };
    case 'info':
    default:
      return {
        container: 'bg-blue-100 text-blue-600 border border-blue-200',
        confirmBtn: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
      };
  }
});

function handleConfirm() {
  uiStore.resolveDialog(true);
}

function handleCancel() {
  uiStore.resolveDialog(false);
}

// Keyboard ESC & Enter handlers
function handleKeyDown(e) {
  if (!uiStore.dialog.isOpen) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    handleCancel();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    handleConfirm();
  }
}

watch(
  () => uiStore.dialog.isOpen,
  (open) => {
    if (open) {
      nextTick(() => {
        confirmButtonRef.value?.focus();
      });
    }
  }
);

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
