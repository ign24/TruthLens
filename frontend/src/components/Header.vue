<script setup lang="ts">
import { ref } from 'vue';
import InfoSection from './InfoSection.vue';
import { RouterLink } from 'vue-router';

// State management for help modal visibility and animation
const showHelp = ref(false);
const isClosing = ref(false);

// Navigation links configuration
const links = [
  { name: 'Analyze', href: '/' },
  { name: 'Translator Pro', href: '/translator' },
  { name: 'Voice Chat', href: '/voice-chat' },
  { name: 'Docs', href: 'https://truthlens-backend-production.up.railway.app/docs', external: true }
];

/**
 * Toggle the help modal with smooth animation
 * Handles both opening and closing states with transition effects
 */
const toggleHelp = () => {
  if (showHelp.value) {
    isClosing.value = true;
    setTimeout(() => {
      showHelp.value = false;
      isClosing.value = false;
    }, 300); // Match the transition duration
  } else {
    showHelp.value = true;
  }
};
</script>

<template>
  <!-- Fixed header with navigation, branding, and help modal -->
  <header class="fixed top-0 left-0 right-0 z-10">
    <!-- Gradient background and blur effect -->
    <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-[#101624cc] via-[#1e293bcc] to-[#101624cc] backdrop-blur-2xl pointer-events-none"></div>
    <nav class="relative mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Navigation container with shadow and rounded corners -->
      <div class="my-4 px-4 h-8 rounded-full flex items-center justify-between shadow-sm">
        <!-- Logo section -->
        <div class="flex items-center space-x-3">
          <img
            src="../assets/logo.png"
            alt="TruthLens Logo"
            class="h-8 w-auto object-contain"
          />
        </div>
        <!-- Navigation links and buttons -->
        <div class="flex items-center space-x-6">
          <!-- Dynamic navigation links (external and internal) -->
          <template v-for="link in links" :key="link.name">
            <a
              v-if="link.external"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-blue-200/80 hover:text-white transition-colors duration-200"
            >
              {{ link.name }}
            </a>
            <RouterLink
              v-else
              :to="link.href"
              class="text-sm text-blue-200/80 hover:text-white transition-colors duration-200"
            >
              {{ link.name }}
            </RouterLink>
          </template>
          <!-- Help button to open modal -->
          <button
            @click="toggleHelp"
            class="text-sm text-blue-200/80 hover:text-white transition-colors duration-200"
          >
            Help
          </button>
          <!-- Bolt attribution link -->
          <a href="https://bolt.new" target="_blank" rel="noopener noreferrer"
            class="flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <span>Made with Bolt</span>
          </a>
        </div>
      </div>
    </nav>
  </header>
  <!-- Help Modal with overlay and animation -->
  <div v-if="showHelp || isClosing" class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Semi-transparent background overlay with click-to-close -->
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity duration-300 ease-out" 
           :class="showHelp && !isClosing ? 'opacity-100' : 'opacity-0'"
           aria-hidden="true" 
           @click="toggleHelp"></div>
      <!-- Modal content panel with animation -->
      <div class="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-300 ease-out sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
           :class="showHelp && !isClosing ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'">
        <InfoSection :show="showHelp && !isClosing" @close="toggleHelp" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>