<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-4">
      <!-- Background Effects -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

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

        <p class="text-lg md:text-xl text-blue-200/80 font-light mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Uncover hidden bias. Spot emotional language. Detect fake and AI-generated content.
        </p>

        <!-- Primary CTA -->
        <div class="mb-12 animate-fade-in-up delay-400">
          <button
            @click="scrollToDemo"
            class="group relative px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 min-w-[200px]"
          >
            <span class="relative z-10 flex items-center justify-center gap-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try the Demo
            </span>
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

    <!-- Interactive Demo Section -->
    <section ref="demoSection" class="py-20 px-4 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            See TruthLens in Action
          </h2>
          <p class="text-xl text-slate-300">
            Paste any news article and watch our AI analyze it in real-time
          </p>
        </div>

        <!-- Demo Interface -->
        <div class="bg-slate-800/50 rounded-2xl p-8 border border-white/10">
          <div class="mb-6">
            <textarea
              v-model="demoText"
              placeholder="Paste a news article here to see how TruthLens analyzes bias, credibility, and emotional tone..."
              class="w-full h-32 bg-slate-900/50 border border-blue-500/50 rounded-lg p-4 text-white placeholder-blue-200/50 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
            ></textarea>
          </div>

          <div class="flex justify-center mb-8">
            <button
              @click="runDemo"
              :disabled="!demoText.trim() || isDemoRunning"
              class="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isDemoRunning" class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </span>
              <span v-else>Analyze with TruthLens</span>
            </button>
          </div>

          <!-- Demo Results -->
          <div v-if="showDemoResults" class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div class="bg-slate-900/50 rounded-xl p-6 border border-cyan-400/20">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Bias Detection</h3>
                  <p class="text-2xl font-bold text-red-400">{{ demoResults.bias }}%</p>
                </div>
              </div>
              <p class="text-sm text-slate-300">Political bias detected in language patterns</p>
            </div>

            <div class="bg-slate-900/50 rounded-xl p-6 border border-cyan-400/20">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Credibility</h3>
                  <p class="text-2xl font-bold text-yellow-400">{{ demoResults.credibility }}%</p>
                </div>
              </div>
              <p class="text-sm text-slate-300">Factual accuracy and source reliability</p>
            </div>

            <div class="bg-slate-900/50 rounded-xl p-6 border border-cyan-400/20">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Emotional Tone</h3>
                  <p class="text-2xl font-bold text-purple-400">{{ demoResults.emotion }}</p>
                </div>
              </div>
              <p class="text-sm text-slate-300">Emotional manipulation detected</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4">
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
          <div class="group p-8 bg-slate-800/50 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Text Analyzer</h3>
            <p class="text-slate-300 leading-relaxed">
              Detect bias, fake news percentage, and emotional tone in any article. Get detailed breakdowns of credibility and political leanings.
            </p>
          </div>

          <!-- Multilingual Translator -->
          <div class="group p-8 bg-slate-800/50 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Multilingual Translator</h3>
            <p class="text-slate-300 leading-relaxed">
              Professional translation across 35+ languages with context awareness and cultural adaptation for accurate communication.
            </p>
          </div>

          <!-- Image Fake Detector -->
          <div class="group p-8 bg-slate-800/50 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">Image Fake Detector</h3>
            <p class="text-slate-300 leading-relaxed">
              Advanced AI detection of manipulated images, deepfakes, and AI-generated visuals to verify authentic content.
            </p>
          </div>

          <!-- AI Text Detector -->
          <div class="group p-8 bg-slate-800/50 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105">
            <div class="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white group-hover:text-cyan-300 transition-colors">AI Text Detector</h3>
            <p class="text-slate-300 leading-relaxed">
              Identify AI-generated content with high accuracy. Distinguish between human and machine-written text across various formats.
            </p>
          </div>

          <!-- Clara Voice Assistant -->
          <div class="group p-6 bg-slate-800/50 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105 md:col-span-2 lg:col-span-2">
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8 21l4-4H5a2 2 0 01-2-2V9a2 2 0 012-2h7l4-4v18z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition-colors">Clara – Your AI Voice Companion</h3>
                <p class="text-slate-300 text-sm mb-4">
                  Natural conversations about news analysis in 35+ languages. Get instant explanations and insights through voice interaction.
                </p>
                <RouterLink to="/voice-assistant" class="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-300">
                  Talk to Clara
                </RouterLink>
              </div>
            </div>
          </div>
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
            <p class="text-slate-300">
              <strong>Built with:</strong> Bolt, FastAPI, GPT-4, and ElevenLabs
            </p>
            <p class="text-slate-300">
              <strong>Solo project by:</strong> <span class="text-cyan-400 font-semibold">Ignacio Zúñiga</span>
            </p>
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full border border-cyan-400/20">
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

const demoSection = ref<HTMLElement | null>(null);
const demoText = ref('');
const isDemoRunning = ref(false);
const showDemoResults = ref(false);

const demoResults = ref({
  bias: 73,
  credibility: 45,
  emotion: 'Alarmist'
});

const scrollToDemo = () => {
  if (demoSection.value) {
    demoSection.value.scrollIntoView({ behavior: 'smooth' });
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
</style> 