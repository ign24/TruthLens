<script setup lang="ts">
defineProps<{
  show: boolean
}>();

const emit = defineEmits<{
  close: []
}>();
</script>

<template>
  <div v-if="show" class="w-full max-w-4xl mx-auto rounded-xl p-4 pt-1 bg-slate-900/95 backdrop-blur-sm border border-white/10 
                    shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)]
                    text-white space-y-6 relative group"
       :class="show ? 'animate-info-section-enter' : 'animate-info-section-exit'">
    <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none"></div>
    
    <!-- Header Section -->
    <div class="relative">
      <div class="flex items-center justify-center mb-4 relative">
        <h2 class="text-3xl font-bold">
          <span class="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Understanding TruthLens
          </span>
        </h2>
        <button
          @click="emit('close')"
          class="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 absolute right-0"
          aria-label="Close info section"
        >
          <svg class="w-5 h-5 text-gray-400 hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="p-6 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
        <p class="text-gray-300 leading-relaxed text-lg">
          TruthLens is an AI-powered platform that helps you read the news more critically—by analyzing credibility, emotional tone, political bias, and more. It also offers a professional translator that adapts text not just across languages, but across intent, tone, and style.
        </p>
      </div>
    </div>

    <div class="space-y-12">
      <!-- TruthLens Analysis Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              TruthLens Analysis
            </span>
          </h3>
          
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">1. Input the Article Text</h4>
              <p class="text-gray-300">
                Paste the full text of a news article or opinion piece into the input field. Ensure the content is under 4,000 characters and represents a complete paragraph or excerpt.
              </p>
            </section>

            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">2. Review the Key Metrics</h4>
              <p class="text-gray-300 mb-4">TruthLens will return a structured report including:</p>
              <ul class="space-y-4 text-gray-300">
                <li class="flex items-start">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3 mt-2"></span>
                  <div>
                    <strong class="text-blue-200">Fake News Percentage</strong>
                    <p class="text-sm mt-1">An estimate of how much of the article relies on unverified or speculative claims. Higher values suggest the need for further verification.</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3 mt-2"></span>
                  <div>
                    <strong class="text-blue-200">Political Bias</strong>
                    <p class="text-sm mt-1">Identifies ideological framing (e.g., left, right, neutral) based on linguistic cues and topic framing.</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3 mt-2"></span>
                  <div>
                    <strong class="text-blue-200">Emotional Tone</strong>
                    <p class="text-sm mt-1">Detects if the language used is alarmist, neutral, or emotionally charged to influence perception.</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3 mt-2"></span>
                  <div>
                    <strong class="text-blue-200">Reader Recommendation</strong>
                    <p class="text-sm mt-1">Offers practical advice on how to approach the article (e.g., seek other sources, verify claims, etc.).</p>
                  </div>
                </li>
              </ul>

              <div class="mt-6 p-4 bg-slate-900/40 rounded-lg border border-white/5">
                <h5 class="text-base font-semibold text-blue-200 mb-2">Narrative Style Classification</h5>
                <p class="text-gray-300 mb-3">Breaks down the article's composition:</p>
                <ul class="grid grid-cols-2 gap-3 text-gray-300">
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-green-400"></span>
                    <span>Objective: factual and neutral</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span>Subjective: opinion-based</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span>Speculative: forward-looking</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-red-400"></span>
                    <span>Emotive: designed to provoke</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Clickbait: exaggerated</span>
                  </li>
                </ul>
              </div>

              <div class="mt-6">
                <h5 class="text-base font-semibold text-blue-200 mb-2">Emotional Analysis</h5>
                <p class="text-gray-300">
                  Evaluates the emotional undertones (e.g., fear, trust, anger) present in the article using psychological models.
                </p>
              </div>
            </section>

            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">3. Use the Interactive Chat</h4>
              <p class="text-gray-300 mb-4">After the analysis, you can ask the integrated AI chatbot questions like:</p>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3"></span>
                  "Why is the article considered speculative?"
                </li>
                <li class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3"></span>
                  "What makes the tone alarmist?"
                </li>
                <li class="flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3"></span>
                  "Can you give examples of political bias?"
                </li>
              </ul>
              <p class="text-gray-300 mt-4">
                The chatbot helps you interpret the results, offers context, and supports further research or comparison.
              </p>
            </section>
          </div>
        </div>
      </div>

      <!-- TruthLens Translator Pro Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              TruthLens Translator Pro
            </span>
          </h3>
          
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Professional Translation Features</h4>
              <p class="text-gray-300 mb-4">Access advanced translation capabilities:</p>
              <ul class="space-y-4 text-gray-300">
                <li class="flex items-start">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3 mt-2"></span>
                  <div>
                    <strong class="text-blue-200">Multilingual Support</strong>
                    <p class="text-sm mt-1">Translation between 23 languages, including indigenous languages (Guaraní, Quechua, Aymara)</p>
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="w-2 h-2 rounded-full bg-blue-400 mr-3 mt-2"></span>
                  <div>
                    <strong class="text-blue-200">Style Customization</strong>
                    <p class="text-sm mt-1">Choose from various translation styles: Literal, Idiomatic, Academic, Legal, Technical, Journalistic, Plain Language, or Creative</p>
                  </div>
                </li>
              </ul>
              <div class="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                <p class="text-yellow-200/90 text-sm">
                  <strong>Note:</strong> Translations for Guaraní, Quechua, and Aymara are provided in experimental mode. These translations may require human review for accuracy and cultural appropriateness.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <!-- Recommendation Section -->
      <section class="p-6 bg-gradient-to-b from-blue-900/30 to-slate-900/30 rounded-lg border border-white/10 
                    shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
        <h3 class="text-xl font-semibold text-blue-200 mb-3">Our Recommendation</h3>
        <p class="text-gray-300">
          TruthLens is an assistant, not an authority. Always compare multiple sources, check original references when possible, and apply critical thinking. Use the insights to inform—not replace—your judgment.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
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

.animate-info-section-enter {
  animation: infoSectionEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-info-section-exit {
  animation: infoSectionExit 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes infoSectionEnter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes infoSectionExit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
}
</style>