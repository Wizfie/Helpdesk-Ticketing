<template>
  <div 
    class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shrink-0 cursor-help" 
    :class="badgeClasses"
    :title="slaData.label"
  >
    <!-- Status Dot / Icon -->
    <span v-if="slaData.status === 'PAUSED'" class="text-[10px]">⏸</span>
    <span v-else-if="slaData.status === 'BREACHED'" class="inline-block w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
    <span v-else-if="slaData.status === 'WARNING'" class="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0"></span>
    <span v-else class="inline-block w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>

    <span class="text-[11px] opacity-80">{{ typeLabel }}:</span>
    <span class="font-mono text-[11px] font-bold">{{ compactLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { calculateSlaCountdown } from '../utils/dateFormatter';

const props = defineProps({
  deadlineUtc: {
    type: String,
    required: true
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  resolvedAtUtc: {
    type: String,
    default: null
  },
  typeLabel: {
    type: String,
    default: 'SLA'
  }
});

const slaData = computed(() => {
  return calculateSlaCountdown(props.deadlineUtc, props.isPaused, props.resolvedAtUtc);
});

const compactLabel = computed(() => {
  const d = slaData.value;
  if (!d) return '-';
  if (props.resolvedAtUtc) {
    return d.isBreached 
      ? `Lewat (-${d.hours}j ${d.minutes}m)` 
      : `Tuntas (+${d.hours}j ${d.minutes}m)`;
  }
  if (props.isPaused) {
    return `Ditahan (${d.hours}j ${d.minutes}m)`;
  }
  return d.isBreached 
    ? `Lewat (-${d.hours}j ${d.minutes}m)` 
    : `Sisa ${d.hours}j ${d.minutes}m`;
});

const badgeClasses = computed(() => {
  switch (slaData.value.status) {
    case 'BREACHED':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'PAUSED':
      return 'bg-amber-50 text-amber-800 border border-amber-300';
    case 'WARNING':
      return 'bg-amber-100 text-amber-900 border border-amber-300';
    default:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
});
</script>
