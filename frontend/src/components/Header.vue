<script setup lang="ts">
import { ref } from 'vue';
import InfoSection from './InfoSection.vue';
import { RouterLink, useRoute } from 'vue-router';

// State management for help modal visibility and animation
const showHelp = ref(false);
const isClosing = ref(false);
const route = useRoute();
const openSidebar = ref(false);

// Store original body overflow to restore it later
const originalBodyOverflow = ref('');

// Define an interface for the link objects for strong typing
interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

// Navigation links configuration
const links: NavLink[] = [
  { name: 'Home', href: '/landing' },
  { name: 'Analyze', href: '/analyze' },
  { name: 'Image Analysis', href: '/image-analysis' },
  { name: 'Translator Pro', href: '/translator' },
  { name: 'ChatBot', href: '/chatbot' },
  { name: 'Voice Chat', href: '/voice-chat' }
];

// Scroll lock management
const lockScroll = () => {
  originalBodyOverflow.value = document.body.style.overflow || '';
  document.body.style.overflow = 'hidden';
}

const unlockScroll = () => {
  document.body.style.overflow = originalBodyOverflow.value;
}

/**
 * Toggle the help modal with smooth animation
 * Handles both opening and closing states with transition effects
 */
const toggleHelp = () => {
  if (showHelp.value) {
    isClosing.value = true;
    unlockScroll();
    setTimeout(() => {
      showHelp.value = false;
      isClosing.value = false;
    }, 300); // Match the transition duration
  } else {
    showHelp.value = true;
    lockScroll();
  }
};

/**
 * Toggle the mobile sidebar
 */
const toggleSidebar = (open: boolean) => {
  openSidebar.value = open;
  if (open) {
    lockScroll();
  } else {
    unlockScroll();
  }
};

/**
 * Close sidebar and optionally toggle help
 */
const closeSidebarAndToggleHelp = () => {
  toggleSidebar(false);
  setTimeout(() => {
    toggleHelp();
  }, 100); // Small delay to ensure sidebar closes first
};
</script>

<template>
  <!-- Fixed header with navigation, branding, and help modal -->
  <header class="fixed top-0 left-0 right-0 z-40">
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
        <!-- Desktop Navigation links and buttons -->
        <div class="hidden md:flex items-center space-x-6">
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
              class="text-sm text-blue-200/80 hover:text-white transition-colors duration-200 relative group"
              :class="{ 'text-white': route.path === link.href }"
            >
              {{ link.name }}
              <span 
                v-if="route.path === link.href"
                class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform scale-x-100 transition-transform duration-300"
              ></span>
              <span 
                v-else
                class="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              ></span>
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
        <!-- Mobile Hamburger -->
        <button @click="toggleSidebar(true)" class="md:hidden focus:outline-none">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
    <!-- Mobile Sidebar -->
    <transition name="fade">
      <aside v-if="openSidebar" class="fixed inset-0 z-50 flex">
        <div class="bg-gray-900 w-64 p-6 space-y-6 h-full shadow-2xl">
          <button @click="toggleSidebar(false)" class="mb-4 text-right w-full">
            <svg class="w-6 h-6 inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <template v-for="link in links" :key="link.name + '-mobile'">
            <a
              v-if="link.external"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="block py-2 text-blue-200/80 hover:text-white transition-colors duration-200"
              @click="toggleSidebar(false)"
            >
              {{ link.name }}
            </a>
            <RouterLink
              v-else
              :to="link.href"
              class="block py-2 text-blue-200/80 hover:text-white transition-colors duration-200"
              :class="{ 'text-white': route.path === link.href }"
              @click="toggleSidebar(false)"
            >
              {{ link.name }}
            </RouterLink>
          </template>
          <button
            @click="closeSidebarAndToggleHelp"
            class="block py-2 text-blue-200/80 hover:text-white transition-colors duration-200 w-full text-left"
          >
            Help
          </button>
          <a href="https://bolt.new" target="_blank" rel="noopener noreferrer"
            class="flex items-center space-x-1 px-3 py-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity w-full justify-center">
            <span>Made with Bolt</span>
          </a>
        </div>
        <div class="flex-1 bg-black bg-opacity-60" @click="toggleSidebar(false)"></div>
      </aside>
    </transition>
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>