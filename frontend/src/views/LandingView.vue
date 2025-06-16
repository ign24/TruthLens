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
          <h2 class="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Powerful AI Tools for Media Analysis
          </h2>
          <p class="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to navigate the complex world of modern media and information
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Text Analyzer -->
          <RouterLink to="/analyze" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Text Analyzer</h3>
            <p class="text-slate-300 leading-relaxed">
              Detect bias, fake news percentage, and emotional tone in any article. Get detailed breakdowns of credibility and political leanings.
            </p>
          </RouterLink>

          <!-- Multilingual Translator -->
          <RouterLink to="/translator" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Multilingual Translator</h3>
            <p class="text-slate-300 leading-relaxed">
              Professional translation across 35+ languages with context awareness and cultural adaptation for accurate communication.
            </p>
          </RouterLink>

          <!-- Image Fake Detector -->
          <RouterLink to="/image-analysis" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Image Fake Detector</h3>
            <p class="text-slate-300 leading-relaxed">
              Advanced AI detection of manipulated images, deepfakes, and AI-generated visuals to verify authentic content.
            </p>
          </RouterLink>

          <!-- TruthLens Assistant (antes AI Text Detector) -->
          <RouterLink to="/ai-detector" class="group p-8 sunken-card card-active rounded-2xl border border-cyan-400/50 shadow-lg scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" tabindex="0">
            <div class="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">TruthLens Assistant</h3>
            <p class="text-slate-300 leading-relaxed">
              A multilingual fact-checking chat.<br>
              Checks facts, uncovers bias, and decodes media narratives, fluent in every language you think in.
            </p>
          </RouterLink>

          <!-- Clara Voice Assistant -->
          <a href="http://localhost:5173/voice-chat" target="_blank" rel="noopener noreferrer" class="group p-6 sunken-card card-active rounded-2xl border-2 border-cyan-400/80 shadow-lg scale-105 md:col-span-2 lg:col-span-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center gap-8 transition-all duration-300" tabindex="0">
            <div class="w-20 h-20 rounded-full flex items-center justify-center clara-gradient-avatar" style="position:relative;">
              <!-- Clara avatar: conic-gradient animado -->
              <div class="w-16 h-16 rounded-full animate-clara-gradient-spin" style="background:conic-gradient(from 0deg,#1e40af 0deg,#3b82f6 60deg,#06b6d4 120deg,#0ea5e9 180deg,#3b82f6 240deg,#1e40af 300deg,#1e40af 360deg);"></div>
              <div class="clara-inner-circle"></div>
            </div>
            <div class="flex-1">
              <h3 class="text-2xl md:text-3xl font-bold mb-2 text-cyan-300 group-hover:text-cyan-200 transition-colors">AI Voice Assistant</h3>
              <p class="text-slate-300 text-lg mb-0">
                Meet Clara: your friendly, multilingual voice guide. Ask anything, get clear answers, and discover TruthLens in a whole new way—just by talking.
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
              <a href="https://truthlens-backend-production.up.railway.app/docs" target="_blank" class="block text-slate-300 hover:text-cyan-400 transition-colors">
                API Docs
              </a>
              <a href="https://github.com/ignaciozuniga/truthlens" target="_blank" class="block text-slate-300 hover:text-cyan-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>

          <!-- Connect Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-white">Connect</h3>
            <div class="space-y-3">
              <a 
                href="https://github.com/ignaciozuniga/truthlens" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
              >
                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>View on GitHub</span>
              </a>
              <a 
                href="https://bolt.new" 
                target="_blank" 
                rel="noopener noreferrer"
                class="flex items-center gap-3 text-slate-300 hover:text-cyan-400 transition-colors group"
              >
                <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Built with Bolt</span>
              </a>
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

const featuresSection = ref<HTMLElement | null>(null);
const demoText = ref('');
const isDemoRunning = ref(false);
const showDemoResults = ref(false);

const demoResults = ref({
  bias: 73,
  credibility: 45,
  emotion: 'Alarmist'
});

const scrollToDemo = () => {
  if (featuresSection.value) {
    featuresSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const runDemo = async () => {
  if (!demoText.value.trim()) return;
  
  isDemoRunning.value = true;
  
  // Simulate analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate random but realistic results
  demoResults.value = {
    bias: Math.floor(Math.random() * 40) + 60, // 60-100%
    credibility: Math.floor(Math.random() * 60) + 20, // 20-80%
    emotion: ['Alarmist', 'Emotional', 'Neutral', 'Sensational'][Math.floor(Math.random() * 4)]
  };
  
  isDemoRunning.value = false;
  showDemoResults.value = true;
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

/* Eliminar o comentar la clase landing-bg y su ::before para unificar el fondo */
/*
.landing-bg {
  position: relative;
  min-height: 100vh;
  background:
    linear-gradient(135deg, #070b12 0%, #101624 100%),
    linear-gradient(45deg, #070b12 0%, #101624 50%, #0a101a 100%);
}
.landing-bg::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 10% 20%, rgba(56, 191, 248, 0.158) 0%, transparent 80%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(94, 234, 212, 0.05) 0%, transparent 50%),
    linear-gradient(to right, 
      rgba(0, 0, 0, 0.8) 0%, 
      transparent 30%, 
      transparent 70%, 
      rgba(0, 0, 0, 0.8) 100%),
    repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03) 0px,
      rgba(255, 255, 255, 0.03) 1px,
      transparent 2px,
      transparent 6px
    );
  background-blend-mode: overlay;
  pointer-events: none;
  z-index: 0;
}
*/

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