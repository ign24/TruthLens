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
  <div class="pt-24 pb-4 px-4 text-white relative mb-3">
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

  <ChatBot 
    :article-text="currentArticleText"
    :analysis-result="result"
  />
</template> 