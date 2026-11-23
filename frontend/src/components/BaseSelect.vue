<template>
  <div class="relative w-full text-left" :class="[containerClass, isOpen ? 'z-[9999]' : '']" ref="dropdownRef">
    <!-- Optional Label -->
    <label v-if="label" class="block font-semibold text-slate-700 text-xs sm:text-sm mb-1">
      {{ label }}
      <span v-if="required" class="text-rose-500 font-bold ml-0.5">*</span>
      <span v-if="subLabel" class="text-slate-400 font-normal text-xs ml-1">{{ subLabel }}</span>
    </label>

    <!-- Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      :title="displayLabel || placeholder"
      :class="[
        'w-full flex items-center justify-between transition-all duration-200 border bg-white text-left cursor-pointer focus:outline-none',
        rounded,
        sizeClasses,
        isOpen 
          ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-xs' 
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs',
        disabled ? 'bg-slate-50 cursor-not-allowed opacity-60 text-slate-400' : 'text-slate-800',
        inputClass
      ]"
    >
      <!-- Left side: Icon and Text -->
      <div class="flex items-center space-x-2 truncate min-w-0 pr-1 flex-1">
        <slot name="leading" :selected="selectedOption"></slot>
        <span 
          v-if="displayLabel" 
          class="truncate font-medium text-slate-800"
          :class="size === 'sm' ? 'text-xs' : 'text-sm'"
        >
          {{ displayLabel }}
        </span>
        <span v-else class="text-slate-400 truncate" :class="size === 'sm' ? 'text-xs' : 'text-sm'">
          {{ placeholder }}
        </span>
      </div>

      <!-- Right side: Badge (only if showBadge is true), Clear, and Chevron -->
      <div class="flex items-center space-x-1.5 shrink-0 pl-1">
        <span v-if="showBadge && selectedOption?.badge" :class="selectedOption.badgeClass || 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200'">
          {{ selectedOption.badge }}
        </span>

        <button
          v-if="clearable && modelValue !== '' && modelValue !== null && !disabled"
          type="button"
          @click.stop="clearSelection"
          class="p-0.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          title="Hapus pilihan"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <svg
          class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0"
          :class="{ 'rotate-180 text-blue-600': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>

    <!-- Floating Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="transform opacity-0 scale-95 -translate-y-1"
      enter-to-class="transform opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="transform opacity-100 scale-100 translate-y-0"
      leave-to-class="transform opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-[9999] mt-1 bg-white rounded-xl shadow-xl shadow-slate-200/80 border border-slate-200 py-1.5 overflow-hidden focus:outline-none max-w-[calc(100vw-1.5rem)]"
        :class="[
          menuAlign === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
          menuWidthClass,
          dropdownClass
        ]"
      >
        <!-- Search bar if searchable -->
        <div v-if="searchable" class="px-2.5 pb-2 pt-1 border-b border-slate-100">
          <div class="relative">
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Cari opsi..."
              class="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              @keydown.stop
            />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Options List -->
        <ul class="max-h-64 overflow-y-auto divide-y divide-slate-100 focus:outline-none" role="listbox">
          <li
            v-for="(option, idx) in filteredOptions"
            :key="option.value ?? idx"
            @click="selectOption(option)"
            :class="[
              'px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors duration-150 group',
              isSelected(option)
                ? 'bg-blue-50/80 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
              option.disabled ? 'opacity-40 cursor-not-allowed bg-slate-50' : ''
            ]"
          >
            <div class="flex items-center space-x-2.5 min-w-0 flex-1">
              <!-- Custom slot or default -->
              <slot name="option" :option="option" :selected="isSelected(option)">
                <div class="flex flex-col flex-1 min-w-0 pr-3">
                  <span class="font-medium text-slate-800 group-hover:text-slate-900 leading-snug whitespace-normal" :class="size === 'sm' ? 'text-xs' : 'text-sm'">
                    {{ option.label }}
                  </span>
                  <span v-if="option.subtext" class="text-[11px] text-slate-400 group-hover:text-slate-500 font-normal leading-normal mt-0.5 whitespace-normal">
                    {{ option.subtext }}
                  </span>
                </div>
              </slot>
            </div>

            <!-- Right checkmark or badge (badge only if showBadge is true) -->
            <div class="flex items-center space-x-2 shrink-0 ml-2">
              <span v-if="showBadge && option.badge" :class="option.badgeClass || 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600'">
                {{ option.badge }}
              </span>
              <svg
                v-if="isSelected(option)"
                class="w-4 h-4 text-blue-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </li>

          <!-- Empty State -->
          <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-center text-xs text-slate-400">
            Tidak ada opsi yang sesuai
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Pilih opsi...'
  },
  label: {
    type: String,
    default: ''
  },
  subLabel: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  rounded: {
    type: String,
    default: 'rounded-lg'
  },
  showBadge: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  },
  inputClass: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  },
  dropdownClass: {
    type: String,
    default: ''
  },
  placement: {
    type: String,
    default: 'auto',
    validator: (v) => ['auto', 'left', 'right'].includes(v)
  },
  menuWidthClass: {
    type: String,
    default: 'w-full min-w-full'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isOpen = ref(false);
const menuAlign = ref('left');
const searchQuery = ref('');
const dropdownRef = ref(null);
const searchInputRef = ref(null);

// Normalize options to [{ value, label, subtext, badge, disabled }]
const normalizedOptions = computed(() => {
  return (props.options || []).map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt, label: String(opt) };
    }
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : (opt.id !== undefined ? opt.id : opt.name || opt.label),
        label: opt.label !== undefined ? opt.label : (opt.name !== undefined ? opt.name : String(opt.value)),
        subtext: opt.subtext || opt.description || opt.desc || '',
        badge: opt.badge || '',
        badgeClass: opt.badgeClass || '',
        disabled: Boolean(opt.disabled)
      };
    }
    return { value: opt, label: String(opt) };
  });
});

const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value.trim()) {
    return normalizedOptions.value;
  }
  const q = searchQuery.value.toLowerCase().trim();
  return normalizedOptions.value.filter(
    (opt) =>
      opt.label.toLowerCase().includes(q) ||
      (opt.subtext && opt.subtext.toLowerCase().includes(q))
  );
});

const selectedOption = computed(() => {
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue) || null;
});

const displayLabel = computed(() => {
  if (selectedOption.value) return selectedOption.value.label;
  if (props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined) {
    return String(props.modelValue);
  }
  return '';
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2.5 py-1.5 text-xs min-h-[34px]';
    case 'lg':
      return 'px-3.5 py-3 text-base min-h-[48px]';
    default:
      return 'px-3 py-2.5 text-sm min-h-[42px] leading-normal';
  }
});

function isSelected(opt) {
  return opt.value === props.modelValue;
}

function updateMenuPlacement() {
  if (props.placement === 'left') {
    menuAlign.value = 'left';
    return;
  }
  if (props.placement === 'right') {
    menuAlign.value = 'right';
    return;
  }
  // Auto mode: check element position relative to viewport
  if (!dropdownRef.value) return;
  const rect = dropdownRef.value.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  
  // If explicitly wide or standard, determine if opening rightward will overflow
  const isCustomWide = props.menuWidthClass.includes('min-w-[') || props.menuWidthClass.includes('w-max') || props.menuWidthClass.includes('sm:min-w-[');
  const estimatedWidth = isCustomWide ? 360 : Math.max(rect.width, 180);

  // If opening from rect.left with estimatedWidth exceeds right boundary (viewport - 16px)
  // or if button is positioned in the far right 35% of the screen:
  if (rect.left + estimatedWidth > viewportWidth - 16 || rect.right > viewportWidth - 80) {
    menuAlign.value = 'right';
  } else {
    menuAlign.value = 'left';
  }
}

function toggleDropdown() {
  if (props.disabled) return;
  if (!isOpen.value) {
    updateMenuPlacement();
  }
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.searchable) {
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
}

function selectOption(opt) {
  if (opt.disabled) return;
  emit('update:modelValue', opt.value);
  emit('change', opt.value);
  isOpen.value = false;
  searchQuery.value = '';
}

function clearSelection() {
  emit('update:modelValue', '');
  emit('change', '');
  searchQuery.value = '';
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>
