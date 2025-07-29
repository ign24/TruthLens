<template>
  <div class="min-h-screen text-white overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-4">
      <div class="relative z-10 text-center max-w-6xl mx-auto">
        <!-- Logo -->
        <div class="mb-8">
          <img
            src="../assets/logo.png"
            alt="TruthLens Logo"
            class="h-20 w-auto mx-auto mb-6 animate-fade-in"
          />
        </div>

        <!-- Main Headlines -->
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
          <span class="bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
            TruthLens doesn't follow the headlines.
          </span>
          <br>
          <span class="text-white">It questions them.</span>
        </h1>

        <p class="text-lg md:text-xl text-blue-200/80 font-light mb-16 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Uncover hidden bias. Spot emotional language. Detect fake and AI-generated content.
        </p>

        <!-- Primary CTA -->
        <div class="mb-24 animate-fade-in-up delay-400 mt-12 flex justify-center">
          <button
            @click="scrollToDemo"
            class="group px-10 py-5 card-active rounded-2xl border border-cyan-400/50 shadow-lg text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-cyan-400 relative overflow-hidden"
          >
            <span class="relative z-10 flex items-center justify-center">
              Try the Demo
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <!-- Scroll Indicator -->
        <div class="animate-bounce">
          <svg class="w-6 h-6 text-cyan-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Critical Media Intelligence, Powered by AI
          </h2>
          <p class="text-sm md:text-base text-slate-300 max-w-3xl mx-auto mb-1">
            Analyze, translate, and verify content—across text, images, and narratives with advanced AI tools.
          </p>
          <div class="flex items-center justify-center gap-2 mt-1 text-xs font-medium">
            <span class="px-1 py-0.5 rounded bg-cyan-900/60 text-cyan-200 tracking-wide" style="letter-spacing:0.04em;">
              Multilingual support for every tool
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Text Analyzer -->
          <RouterLink to="/analyze" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Break Down the Narrative</h3>
            <p class="text-slate-300 leading-relaxed">
              Analyze headlines, articles, and statements. Spot bias, emotional tone, and credibility with visual breakdowns that expose the message beneath the surface.
            </p>
          </RouterLink>

          <!-- Multilingual Translator -->
          <RouterLink to="/translator" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Understand It in Your Language</h3>
            <p class="text-slate-300 leading-relaxed">
              Translate with cultural intelligence. 35+ languages, context-aware. Not just words, meanings that matter.
            </p>
          </RouterLink>

          <!-- Image Fake Detector -->
          <RouterLink to="/image-analysis" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Reveal What Images Hide</h3>
            <p class="text-slate-300 leading-relaxed">
              Detect AI-generated visuals, deepfakes, and digital manipulation. Because truth is also visual.
            </p>
          </RouterLink>

          <!-- TruthLens Assistant (formerly AI Text Detector) -->
          <RouterLink to="/ai-detector" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Ask the Truth Itself</h3>
            <p class="text-slate-300 leading-relaxed">
              TruthLens Assistant is more than a chatbot. It cross-checks facts, translates context, and questions everything. It doesn't echo the news, it questions it.
            </p>
          </RouterLink>

          <!-- Clara Voice Assistant -->
          <a :href="`${FRONTEND_URL}/voice-chat`" target="_blank" rel="noopener noreferrer" class="group p-6 sunken-card card-active rounded-2xl border-2 border-cyan-400/80 shadow-lg scale-105 md:col-span-2 lg:col-span-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center gap-8 transition-all duration-300" tabindex="0">
            <div class="w-20 h-20 rounded-full flex items-center justify-center clara-gradient-avatar" style="position:relative;">
              <!-- Clara avatar: animated conic-gradient -->
              <div class="w-16 h-16 rounded-full animate-clara-gradient-spin" style="background:conic-gradient(from 0deg,#1e40af 0deg,#3b82f6 60deg,#06b6d4 120deg,#0ea5e9 180deg,#3b82f6 240deg,#1e40af 300deg,#1e40af 360deg);"></div>
              <div class="clara-inner-circle"></div>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl md:text-3xl font-bold mb-2 text-cyan-300 group-hover:text-cyan-200 transition-colors">Meet Clara, Your Voice of Reason</h3>
              <p class="text-slate-300 text-lg mb-0">
                A multilingual voice guide that helps you navigate media with clarity. Clara listens, explains, and empowers your critical view, just by talking.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-16 px-4 border-t border-white/10 bg-slate-900/50">
      <div class="max-w-6xl mx-auto">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Brand Section -->
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <img
                src="../assets/logo.png"
                alt="TruthLens Logo"
                class="h-10 w-auto"
              />
              <span class="text-2xl font-bold text-white">TruthLens</span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              AI-powered media analysis platform helping you navigate the complex world of modern information.
            </p>
          </div>

          <!-- Quick Links -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Quick Links</h3>
            <div class="grid grid-cols-2 gap-2">
              <RouterLink to="/analyze" class="block text-slate-300 hover:text-cyan-400 transition-colors">
                Text Analyzer
              </RouterLink>
              <RouterLink to="/translator" class="block text-slate-300 hover:text-cyan-400 transition-colors">
                Translator Pro
              </RouterLink>
              <RouterLink to="/image-analysis" class="block text-slate-300 hover:text-cyan-400 transition-colors">
                Image Analysis
              </RouterLink>
              <RouterLink to="/voice-assistant" class="block text-slate-300 hover:text-cyan-400 transition-colors">
                Voice Assistant
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Credits Section -->
        <div class="border-t border-white/10 pt-8">
          <div class="text-center space-y-4">

            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-full border border-cyan-400/20 shadow-inner">
              <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span class="text-cyan-400 font-medium">Created for the World's Largest Hackathon by Bolt</span>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-8 pt-8 border-t border-white/10 text-center text-slate-400">
          <p>&copy; 2025 TruthLens. Empowering critical thinking through AI.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { FRONTEND_URL } from '../config/api';

const featuresSection = ref<HTMLElement | null>(null);

const scrollToDemo = () => {
  if (featuresSection.value) {
    featuresSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.animate-gradient {
  animation: gradient 8s linear infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-400 {
  animation-delay: 400ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.5);
}

/* Machine-like interface styles */
.shadow-inner {
  box-shadow: 
    inset 0 2px 4px 0 rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Improved button styles */
button {
  position: relative;
  overflow: visible;
  isolation: isolate;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(1px);
}

/* Improved card styles */
.group {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover {
  transform: translateY(-2px);
}

/* Improved text styles */
.text-cyan-400 {
  text-shadow: 0 0 20px rgba(34, 211, 238, 0.2);
}

/* Improved background effects */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Darker hover for feature cards */
.group.bg-slate-900\/80:hover,
.group.bg-slate-900\/90:hover {
  background-color: rgba(15, 23, 42, 0.95) !important;
}

.sunken-card {
  background: linear-gradient(145deg, #101c2c 60%, #1e293b 100%);
  box-shadow: inset 0 2px 8px 0 rgba(0,0,0,0.45), inset 0 1.5px 0 0 rgba(255,255,255,0.08), inset 0 -2.5px 8px 0 rgba(30,41,59,0.45);
  border-top: 1.5px solid rgba(255,255,255,0.10);
  border-bottom: 2.5px solid rgba(0,0,0,0.18);
}
.shadow-inner-sunken {
  box-shadow: inset 0 4px 16px 0 rgba(0,0,0,0.32), inset 0 1.5px 0 0 rgba(255,255,255,0.10), inset 0 -2.5px 8px 0 rgba(30,41,59,0.45);
}

/* Estado activo permanente para tarjetas */
.card-active {
  background-color: #18263a !important;
  border-color: #22d3ee80 !important;
  box-shadow: 0 8px 32px 0 rgba(34,211,238,0.10), 0 1.5px 8px 0 rgba(30,41,59,0.18), 0 0 0 1.5px #22d3ee40;
  transform: scale(1.015);
}

/* Clara avatar: gradiente cónico animado */
.clara-gradient-avatar {
  background: none;
  position: relative;
}
.animate-clara-gradient-spin {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: rotate 6s linear infinite;
}
@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.clara-inner-circle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  background: rgba(16,22,36,0.92);
  border-radius: 50%;
  z-index: 10;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.18);
}
</style>