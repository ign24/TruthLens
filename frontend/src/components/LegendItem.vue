<script setup lang="ts">
defineProps<{
    label: string
    style: 'objective' | 'subjective' | 'speculative' | 'emotive' | 'clickbait'
    active?: boolean
}>()

function styleColorClass(style: string): string {
    switch (style) {
        case 'objective': return 'bg-blue-400';
        case 'subjective': return 'bg-purple-400';
        case 'speculative': return 'bg-yellow-400';
        case 'emotive': return 'bg-pink-400';
        case 'clickbait': return 'bg-red-500';
        default: return 'bg-slate-500';
    }
}
</script>

<template>
  <!-- Legend item for style indication in analysis visualizations -->
  <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300"
      :class="[
          active ? 'bg-slate-800/50' : 'bg-slate-800/20',
          'border border-slate-700/50 hover:border-slate-600/50'
      ]">
    <!-- Colored dot representing the style -->
    <div class="w-2 h-2 rounded-full" :class="styleColorClass(style)"></div>
    <!-- Style label -->
    <span class="text-sm font-medium text-slate-200">{{ label }}</span>
  </div>
</template>