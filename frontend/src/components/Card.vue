<template>
  <transition name="card-fade-slide">
    <div class="card">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Card',
}
</script>

<style scoped>
.card {
  background: #101c2c;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  margin: 0.5rem 0;
  border: 1.5px solid #22304a;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.18);
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 4px 18px 0 rgba(0,0,0,0.22);
}

/* Progress bar styles */
:deep(.progress-bar) {
  background: linear-gradient(90deg, #4CAF50, #2196F3);
  height: 8px;
  border-radius: 4px;
  transition: width 0.3s ease;
}

:deep(.progress-bar-container) {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  height: 8px;
  margin: 0.5rem 0;
}

:deep(.progress-label) {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  text-align: center;
}

.card-fade-slide-enter-active {
  transition: opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1);
}
.card-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}
.card-fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style> 