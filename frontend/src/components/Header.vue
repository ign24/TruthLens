<script setup lang="ts">
const links = [
  { name: 'Analyze', href: '#' },
  { name: 'Docs', href: '#' },
  { name: 'Help', href: '#' }
];
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
    <nav class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="my-4 px-4 h-8 rounded-full flex items-center justify-between shadow-sm">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
            <span class="font-display text-lg font-bold text-white">T</span>
          </div>
          <span class="font-display text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            TruthLens
          </span>
        </div>
        
        <div class="flex items-center space-x-6">
          <a 
            v-for="link in links" 
            :key="link.name"
            :href="link.href"
            class="text-sm text-blue-200/80 hover:text-white transition-colors duration-200"
          >
            {{ link.name }}
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>