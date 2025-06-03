<script setup lang="ts">
import { ref } from 'vue';
import InfoSection from './InfoSection.vue';
import { RouterLink } from 'vue-router';

const showHelp = ref(false);

const links = [
  { name: 'Analyze', href: '/' },
  { name: 'Translator Pro', href: '/translator' },
  { name: 'Docs', href: 'https://truthlens-backend-production.up.railway.app/docs', external: true }
];

const toggleHelp = () => {
  showHelp.value = !showHelp.value;
};
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-10 backdrop-blur-2xl">
    <nav class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="my-4 px-4 h-8 rounded-full flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-3">
          <img
            src="../assets/logo.png"
            alt="TruthLens Logo"
            class="h-8 w-auto object-contain"
          />
        </div>

        <div class="flex items-center space-x-6">
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

          <button
            @click="toggleHelp"
            class="text-sm text-blue-200/80 hover:text-white transition-colors duration-200"
          >
            Help
          </button>

          <a href="https://bolt.new" target="_blank" rel="noopener noreferrer"
            class="flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <span>Made with Bolt</span>
          </a>
        </div>
      </div>
    </nav>
  </header>

  <!-- Help Modal -->
  <div v-if="showHelp" class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" @click="toggleHelp"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-gray-800 rounded-md text-gray-400 hover:text-gray-300 focus:outline-none"
            @click="toggleHelp"
          >
            <span class="sr-only">Close</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <InfoSection :show="showHelp" />
      </div>
    </div>
  </div>
</template>