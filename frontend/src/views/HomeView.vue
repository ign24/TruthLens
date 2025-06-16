<script setup lang="ts">
import AnalysisForm from '../components/AnalysisForm.vue';
import ChatBot from '../components/ChatBot.vue';
import { useAnalysis } from '../composables/useAnalysis';
import { ref } from 'vue';

const { result, analyzeContent } = useAnalysis();
const currentArticleText = ref('');

async function handleAnalyze(text: string) {
  currentArticleText.value = text;
  result.value = await analyzeContent(text);
}
</script>

<template>
  <div class="pt-[140px] pb-4 px-4 text-white relative mb-3">
    <div>
      <div class="text-center mb-6">
        <h1 class="font-display text-6xl font-bold mb-6 relative">
          <span class="bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">TruthLens</span>
        </h1>
        <p class="text-lg text-blue-200/80 font-display tracking-wide">Analyze news articles for bias and credibility</p>
      </div>
      
      <AnalysisForm class="animate-fadeInUp" @analyze="handleAnalyze" />
    </div>
  </div>

  <div class="mt-12 max-w-2xl mx-auto">
    <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-xl border border-cyan-400/20 p-8 mb-8 flex flex-col items-start">
      <div class="flex items-center mb-4">
        <svg class="w-7 h-7 text-cyan-300 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3m13.07-6.93l-4.24 4.24m0 0l-4.24-4.24m8.48 8.48l-4.24 4.24m0 0l-4.24-4.24" stroke-linecap="round"/></svg>
        <h2 class="text-2xl font-bold text-white">Text Analysis</h2>
      </div>
      <p class="text-slate-200 mb-3">Understand how media content shapes perception. Drop any news article or written statement and TruthLens will detect:</p>
      <ul class="list-disc list-inside text-slate-300 mb-3">
        <li>Emotional language and sentiment</li>
        <li>Ideological bias and manipulative framing</li>
        <li>Source credibility signals</li>
        <li>Factual consistency indicators</li>
      </ul>
      <p class="text-slate-200">You'll receive a detailed bias score, credibility assessment, and suggestions to verify or contrast the information.</p>
    </div>
  </div>

  <ChatBot 
    :article-text="currentArticleText"
    :analysis-result="result"
  />
</template> 