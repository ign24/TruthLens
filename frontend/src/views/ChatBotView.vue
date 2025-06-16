<template>
  <div class="min-h-screen flex flex-col text-white animate-fade-in-up">
    <div class="flex-1 flex items-center justify-center pt-24 pb-12">
      <div class="w-full max-w-4xl min-h-[700px] min-w-[420px] bg-slate-800/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-white/10">
        <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">TruthLens Chat Assistant</h1>
        <ChatBot :article-text="''" :standalone="true" />
      </div>
    </div>
    <div class="mt-12 max-w-2xl mx-auto">
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-xl border border-cyan-400/20 p-8 mb-8 flex flex-col items-start">
        <div class="flex items-center mb-4">
          <svg class="w-7 h-7 text-cyan-300 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v6m0 6v6m9-9h-6m-6 0H3m13.07-6.93l-4.24 4.24m0 0l-4.24-4.24m8.48 8.48l-4.24 4.24m0 0l-4.24-4.24" stroke-linecap="round"/></svg>
          <h2 class="text-2xl font-bold text-white">TruthLens Assistant</h2>
        </div>
        <p class="text-slate-200 mb-3">Use this interactive space to chat directly with Clara. You can ask:</p>
        <ul class="list-disc list-inside text-slate-300 mb-3">
          <li>"Is this article biased?"</li>
          <li>"Was this image manipulated?"</li>
          <li>"Can you verify the source of this post?"</li>
        </ul>
        <p class="text-slate-200">Clara will deliver immediate and structured analysis using cutting-edge AI — empowering you to think for yourself.</p>
        <ul class="list-disc list-inside text-slate-400 mt-4 text-sm">
          <li class="flex items-center gap-3 mb-2">
            <button class="btn-inset flex items-center justify-center w-10 h-10 bg-slate-800/80 border border-cyan-400/20 rounded-lg mr-2 opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
            <span><strong>Send:</strong> Submit your message for standard analysis.</span>
          </li>
          <li class="flex items-center gap-3">
            <button class="btn-inset flex items-center justify-center w-10 h-10 bg-slate-800/80 border border-cyan-400/20 rounded-lg mr-2 opacity-60">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <span><strong>Verify with sources:</strong> Fact-check using live web search (RAG).</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatBot from '../components/ChatBot.vue';
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 