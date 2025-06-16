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
          <span class="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            <svg class="w-7 h-7 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2C7.03 2 3 6.03 3 11c0 2.21 1.79 4 4 4h1v2c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2h1c2.21 0 4-1.79 4-4 0-4.97-4.03-9-9-9z"/></svg>
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
          TruthLens is an AI-powered investigative toolkit designed to help you evaluate the credibility of news, images, and narratives. It uses advanced NLP, forensic analysis, and multilingual translation to help you think critically in a world of manipulated content.
        </p>
      </div>
    </div>

    <div class="space-y-12">
      <!-- Analyze Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg class="w-6 h-6 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4M4 10h16"/></svg>
              Analyze
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Critical Language Analysis of Text</h4>
              <p class="text-gray-300 mb-3">Paste a full article or excerpt (max 4,000 characters) and TruthLens will return a structured report powered by LLM reasoning, prompt engineering, and custom heuristics. The output includes:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li><strong>Fake News Probability (%):</strong> Based on speculative language detection, hedging verbs, and factual density comparison.</li>
                <li><strong>Political Bias Detection:</strong> Uses linguistic framing, sentiment toward political entities, and topic alignment models to detect ideological leaning.</li>
                <li><strong>Emotional Tone Analysis:</strong> Classifies tone (neutral, alarmist, persuasive) using lexicon-based sentiment models and contextual emotion scoring.</li>
                <li><strong>Reader Recommendation Engine:</strong> Suggests how to approach the article (verify, cross-check, or dismiss) based on a weighted aggregation of bias and tone.</li>
                <li><strong>Narrative Style Classification:</strong> Uses a zero-shot classifier to segment the article into:<ul class="ml-6 mt-1 list-disc text-gray-400">
                  <li>Objective</li>
                  <li>Subjective</li>
                  <li>Speculative</li>
                  <li>Emotive</li>
                  <li>Clickbait</li>
                </ul></li>
                <li><strong>Psychological Emotion Mapping:</strong> Detects primary emotions (anger, fear, sadness, joy, disgust, trust) using Plutchik-inspired models and transformer-based emotion tagging.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <!-- Image Analysis Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg class="w-6 h-6 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.5"/></svg>
              Image Analysis
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">AI-Generated Image Detection via Forensic Techniques</h4>
              <p class="text-gray-300 mb-3">Upload an image to evaluate whether it may have been generated or manipulated by AI. The analysis includes:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li><strong>Visual Artifact Detection:</strong> Identifies inconsistencies typical of AI models—such as warped text, unnatural symmetry, or skin texture abnormalities.</li>
                <li><strong>Spectral Analysis (FFT):</strong> Applies Fast Fourier Transform (FFT) to highlight frequency-domain anomalies common in synthetic images.</li>
                <li><strong>EXIF Metadata Inspection:</strong> Extracts and parses embedded metadata for camera inconsistencies, missing fields, or signs of AI rendering pipelines.</li>
              </ul>
              <p class="text-gray-400 text-sm mt-2">This training-free forensic pipeline is inspired by academic work on DeepFake detection and does not rely on predefined model classifiers, reducing false positives from dataset bias.</p>
            </section>
          </div>
        </div>
      </div>

      <!-- Translator Pro Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg class="w-6 h-6 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
              Translator Pro
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Multilingual, Style-Aware Translation Engine</h4>
              <p class="text-gray-300 mb-3">Translate any text with precision across 35+ languages, including Indigenous languages (Guaraní, Quechua, Aymara – experimental). Beyond language, TruthLens allows control over intent and tone:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li><strong>Translation Styles Supported:</strong></li>
                <ul class="ml-6 mt-1 list-disc text-gray-400">
                  <li>Literal</li>
                  <li>Idiomatic</li>
                  <li>Academic</li>
                  <li>Legal</li>
                  <li>Technical</li>
                  <li>Journalistic</li>
                  <li>Plain Language</li>
                  <li>Creative</li>
                </ul>
              </ul>
              <p class="text-gray-400 text-sm mt-2">Powered by LLM-based translation pipelines, with prompt tuning for domain-specific adaptation.</p>
              <p class="text-yellow-300 text-xs mt-2">⚠️ Indigenous language support is experimental and may require cultural review.</p>
            </section>
          </div>
        </div>
      </div>

      <!-- ChatBot Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg class="w-6 h-6 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="4"/><path d="M8 7V3h8v4"/></svg>
              ChatBot
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">AI-Powered Fact Checking and Explanation</h4>
              <p class="text-gray-300 mb-3">An interactive multilingual assistant that helps you understand the outputs of the analysis in depth. It combines retrieval-augmented generation (RAG) and LLM reasoning to answer:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>"Which words indicate bias?"</li>
                <li>"Why is this called clickbait?"</li>
                <li>"Can you explain the emotional profile?"</li>
              </ul>
              <p class="text-gray-300">The chatbot can interpret both the results and the original text, offering transparent justifications.</p>
            </section>
          </div>
        </div>
      </div>

      <!-- Voice Chat Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg class="w-6 h-6 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="16" rx="3"/><path d="M5 10v2a7 7 0 0014 0v-2"/><path d="M8 21h8"/></svg>
              Voice Chat
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Natural Interaction with Realistic AI Voice</h4>
              <p class="text-gray-300 mb-3">Powered by ElevenLabs voice synthesis, this feature allows you to:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>Speak to TruthLens and receive lifelike responses.</li>
                <li>Ask questions about any report, in any language.</li>
                <li>Enable hands-free, accessible interaction for any user.</li>
              </ul>
              <p class="text-gray-300">It brings a humanized layer to your critical investigation experience.</p>
            </section>
          </div>
        </div>
      </div>

      <!-- Technology Summary Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg class="w-6 h-6 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M21 21l-6-6"/></svg>
              Technology Summary
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>GPT-4-based inference (OpenAI API)</li>
                <li>Custom prompt engineering</li>
                <li>FastAPI backend</li>
                <li>Vue + Tailwind frontend</li>
                <li>FFT-based image forensics</li>
                <li>EXIF metadata parsing (Python-Pillow, ExifTool)</li>
                <li>Emotion and bias analysis models tuned on real-world media</li>
                <li>Translation with prompt-tuned multilingual LLMs</li>
                <li>ElevenLabs for voice synthesis (chat + narration)</li>
                <li>Retrieval-augmented QA (in development)</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <!-- Lens Philosophy Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <svg class="w-6 h-6 inline-block text-cyan-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              A Lens, Not a Verdict
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <p class="text-gray-300 mb-3">TruthLens does not tell you what to believe. It shows you how to question more deeply.</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>Cross-check sources</li>
                <li>Follow the data</li>
                <li>Stay alert to manipulation</li>
              </ul>
              <p class="text-gray-400 text-sm">TruthLens is not a filter bubble. It's your critical lens in the age of AI.</p>
            </section>
          </div>
        </div>
      </div>
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