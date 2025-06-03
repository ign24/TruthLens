<script setup lang="ts">
import Header from './components/Header.vue';
</script>

<template>
  <div class="min-h-screen">
    <Header />
    <router-view></router-view>
  </div>
</template>