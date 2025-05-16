<script setup lang="ts">
import AnalysisForm from './components/AnalysisForm.vue';
import InfoSection from './components/InfoSection.vue';
import Header from './components/Header.vue';
import { useAnalysis } from './composables/useAnalysis';

const { result, analyzeContent } = useAnalysis();

async function handleAnalyze(text: string) {
  result.value = await analyzeContent(text);
}
</script>

<template>
  <div class="absolute top-0 left-0 w-full h-14 z-0 pointer-events-none">
    <div class="w-full h-full bg-[conic-gradient(at_top_left,_#22d3ee33,_#3b82f633,_#22d3ee33)] blur-2xl opacity-80 animate-glow-border"></div>
  </div>

  <Header />

  <div class="min-h-screen pt-24 pb-4 px-4 text-white relative mb-3">
    <div>
      <div class="text-center mb-6">
        <h1 class="font-display text-6xl font-bold mb-6 relative">
          <span class="bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent animate-gradient">TruthLens</span>
        </h1>
        <p class="text-lg text-blue-200/80 font-display tracking-wide">Analyze news articles for bias and credibility</p>
      </div>
      
      <AnalysisForm @analyze="handleAnalyze" />
      <AnalysisResult :result="result" />
      <InfoSection />
    </div>
  </div>
</template>
