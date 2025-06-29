<script setup lang="ts">
import AnalysisForm from '../components/AnalysisForm.vue';
import ChatBot from '../components/ChatBot.vue';
import { useAnalysis } from '../composables/useAnalysis';
import { useMobileDetection } from '../composables/useMobileDetection';
import { ref } from 'vue';

const { result, analyzeContent } = useAnalysis();
const currentArticleText = ref('');

// Mobile detection for ChatBot visibility
const { isMobile } = useMobileDetection();

async function handleAnalyze(text: string) {
  currentArticleText.value = text;
  result.value = await analyzeContent(text);
}
</script>

<template>
  <div class="pt-20 sm:pt-28 md:pt-32 pb-4 px-4 text-white relative mb-3">
    <div>
      <div class="text-center mb-6">
        <h1 class="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 relative">
          <span class="bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">TruthLens</span>
        </h1>
        <p class="text-md sm:text-lg text-blue-200/80 font-display tracking-wide">Analyze news articles for bias and credibility</p>
      </div>
      
      <AnalysisForm class="animate-fadeInUp" @analyze="handleAnalyze" />
    </div>
  </div>

  <div class="mt-8 sm:mt-12 max-w-2xl mx-auto px-4 sm:px-0">
    <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-xl border border-cyan-400/20 p-6 sm:p-8 mb-8 flex flex-col items-start">
      <div class="flex items-center mb-4">
        <svg class="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-xl sm:text-2xl font-bold text-white">Text Analysis</h2>
      </div>
      <p class="text-slate-200 mb-3 text-base">Understand how media content shapes perception. Drop any news article or written statement and TruthLens will detect:</p>
      <ul class="list-disc list-inside text-slate-300 mb-3 text-base">
        <li>Emotional language and sentiment</li>
        <li>Ideological bias and manipulative framing</li>
        <li>Source credibility signals</li>
        <li>Factual consistency indicators</li>
      </ul>
      <p class="text-slate-200 text-base">Based on validated criteria from DOCA (Database of Variables for Content Analysis), your report includes a bias score, credibility assessment, and suggestions to verify or contrast the information.</p>
    </div>
  </div>

  <ChatBot 
    v-if="!isMobile"
    :article-text="currentArticleText"
    :analysis-result="result"
  />
</template> 