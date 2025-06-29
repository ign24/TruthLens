<template>
  <!-- Tooltip container for displaying contextual information on hover or focus -->
  <div class="tooltip-container" ref="tooltipRef">
    <slot></slot>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <!-- Tooltip content shown when isVisible is true -->
      <div
        v-if="isVisible"
        class="tooltip-content"
        :class="[
          isMobile ? 'mobile-tooltip' : [
            position === 'top' ? 'bottom-full mb-4' : 'top-full mt-4',
            position === 'left' ? 'right-0 mr-4' : 'left-0 ml-4'
          ]
        ]"
        role="tooltip"
        :aria-hidden="!isVisible"
      >
        <!-- Arrow for desktop tooltips -->
        <div v-if="!isMobile" class="tooltip-arrow" :class="position"></div>
        <!-- Tooltip text -->
        <div class="tooltip-inner">
          {{ text }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceInteraction } from '../composables/useDeviceInteraction'

const { text, position = 'top' } = defineProps<{
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}>()

const tooltipRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const { handleInteraction, isMobile } = useDeviceInteraction()

onMounted(() => {
  if (tooltipRef.value) {
    handleInteraction(
      tooltipRef.value,
      () => (isVisible.value = true),
      () => (isVisible.value = false)
    )
  }
})

onUnmounted(() => {
  isVisible.value = false
})
</script>

<style scoped>
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: absolute;
  z-index: 9999;
  min-width: 200px;
  max-width: 300px;
  transform-origin: center;
}

.tooltip-inner {
  background-color: rgba(17, 24, 39, 0.95);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

.tooltip-arrow.top {
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: rgba(17, 24, 39, 0.95);
}

.tooltip-arrow.bottom {
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: rgba(17, 24, 39, 0.95);
}

.tooltip-arrow.left {
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: rgba(17, 24, 39, 0.95);
}

.tooltip-arrow.right {
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: rgba(17, 24, 39, 0.95);
}

/* Specific styles for mobile */
.mobile-tooltip {
  position: fixed;
  left: 50% !important;
  transform: translateX(-50%);
  bottom: 20px !important;
  top: auto !important;
  margin: 0 !important;
  width: 90%;
  max-width: 400px;
}

.mobile-tooltip .tooltip-inner {
  background-color: rgba(17, 24, 39, 0.98);
  font-size: 1rem;
  padding: 1rem 1.25rem;
  text-align: center;
}
</style> 