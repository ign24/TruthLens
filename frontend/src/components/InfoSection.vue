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
            <img src="../assets/logo.png" alt="TruthLens Logo" class="w-8 h-8 inline-block align-middle" />
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
          TruthLens is an AI-powered investigative toolkit designed to help you critically evaluate the credibility of texts, images, and narratives. It combines advanced NLP, forensic image analysis, and multilingual translation to empower your reasoning in a world shaped by manipulated content.
        </p>
      </div>
    </div>

    <div class="space-y-12">
      <!-- Text Analysis Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <!-- Text Analysis icon -->
              <svg class="w-7 h-7 inline-block text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Text Analysis
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Critical Language Examination of Articles and Excerpts</h4>
              <p class="text-gray-300 mb-3">Paste any article or passage (up to 8,000 characters) and TruthLens will generate a structured analytical report powered by LLM reasoning, custom heuristics, and discourse-aware prompt engineering.</p>
              <p class="text-gray-300 mb-3">The report includes:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li><strong>Fake News Probability (%):</strong> Estimated based on speculative language patterns, hedging verbs, and factual density scoring.</li>
                <li><strong>Political Bias Detection:</strong> Analyzes ideological leaning using sentiment analysis toward political actors, linguistic framing, and alignment with known topics or agendas.</li>
                <li><strong>Emotional Tone Classification:</strong> Classifies the overall tone of the article as neutral, alarmist, or persuasive using hybrid lexicon-contextual models.</li>
                <li><strong>Reader Recommendation Engine:</strong> Suggests how to approach the article (e.g. verify, cross-check, or dismiss) based on a weighted aggregation of bias and tone metrics.</li>
                <li><strong>Narrative Style Classification:</strong> Segments the article using a zero-shot classifier into:<ul class="ml-6 mt-1 list-disc text-gray-400">
                  <li>Objective</li>
                  <li>Subjective</li>
                  <li>Speculative</li>
                  <li>Emotive</li>
                  <li>Clickbait</li>
                </ul></li>
                <li><strong>Psychological Emotion Mapping:</strong> Detects core emotions such as anger, fear, joy, sadness, disgust, trust, anticipation, and surprise. Based on Plutchik's emotion wheel and transformer-based tagging, this analysis reveals the emotional undertones driving the narrative.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <!-- Content & Framing Analysis Section -->
      <div class="relative">
        <div class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-2xl font-semibold mb-6">
            <span class="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
              <!-- Content Analysis icon -->
              <svg class="w-7 h-7 inline-block text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Content & Framing Analysis (DOCA-Based)
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <p class="text-gray-300 mb-3">TruthLens integrates a DOCA-inspired model—Discourse, Objectivity, Certainty, and Affect—to go beyond surface-level text classification.</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li><strong>Topic Detection:</strong> Identifies the main theme of the article (e.g., politics, economics, security).</li>
                <li><strong>Framing Analysis:</strong> Extracts the dominant discursive frames shaping the article, such as:<ul class="ml-6 mt-1 list-disc text-gray-400">
                  <li>Crisis</li>
                  <li>Economic Consequences</li>
                  <li>Security</li>
                </ul>These frames influence how readers interpret facts and assign meaning.</li>
                <li><strong>Style Breakdown:</strong> Analyzes how much of the article is:<ul class="ml-6 mt-1 list-disc text-gray-400">
                  <li>Objective</li>
                  <li>Subjective</li>
                  <li>Speculative</li>
                  <li>Emotive</li>
                  <li>Clickbait</li>
                </ul>This allows you to understand whether a piece is mainly informative, persuasive, or manipulative.</li>
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
              <!-- Image Analysis icon -->
              <svg class="w-7 h-7 inline-block text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image Analysis
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">AI-Generated Image Detection via Forensic Techniques</h4>
              <p class="text-gray-300 mb-3">Upload any image to evaluate whether it may have been generated or manipulated by AI.</p>
              <p class="text-gray-300 mb-3">The forensic analysis includes:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li><strong>Visual Artifact Detection:</strong> Identifies visual anomalies such as warped text, unnatural symmetry, inconsistent lighting, or skin texture irregularities.</li>
                <li><strong>Spectral Analysis (FFT):</strong> Applies Fast Fourier Transform to detect frequency-domain distortions typically found in synthetic media.</li>
                <li><strong>EXIF Metadata Inspection:</strong> Parses embedded metadata to detect missing fields, camera inconsistencies, or traces of AI rendering.</li>
              </ul>
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
              <!-- Translator Pro icon -->
              <svg class="w-7 h-7 inline-block text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              Translator Pro
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Multilingual, Style-Aware Translation Engine</h4>
              <p class="text-gray-300 mb-3">Translate any text across 35+ languages, including experimental support for Indigenous languages like Guaraní, Quechua, and Aymara.</p>
              <p class="text-gray-300 mb-3">Supported translation styles:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>Literal</li>
                <li>Idiomatic</li>
                <li>Academic</li>
                <li>Legal</li>
                <li>Technical</li>
                <li>Journalistic</li>
                <li>Plain Language</li>
                <li>Creative</li>
              </ul>
              <p class="text-gray-400 text-sm mt-2">Powered by LLMs fine-tuned for domain-specific tasks.</p>
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
              <!-- ChatBot icon -->
              <svg class="w-7 h-7 inline-block text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Chatbot
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Interactive Explanation & Fact Checking</h4>
              <p class="text-gray-300 mb-3">A multilingual assistant powered by LLM + RAG that can interpret both the original content and the generated report. Ask questions like:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>"Which part of the text is clickbait?"</li>
                <li>"Why is the tone labeled as alarmist?"</li>
                <li>"What does 'economic framing' mean in this context?"</li>
              </ul>
              <p class="text-gray-300">Get context-rich, transparent answers that link linguistic patterns to broader narrative strategies.</p>
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
              <!-- Clara avatar icon -->
              <span class="inline-block relative w-8 h-8 align-middle" style="vertical-align:middle;">
                <span style="width:32px;height:32px;display:block;position:relative;z-index:1;border-radius:50%;animation:rotate 6s linear infinite;background:conic-gradient(from 0deg,#1e40af 0deg,#3b82f6 60deg,#06b6d4 120deg,#0ea5e9 180deg,#3b82f6 240deg,#1e40af 300deg,#1e40af 360deg);"></span>
                <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:22px;height:22px;background:rgba(16,22,36,0.92);border-radius:50%;z-index:2;box-shadow:0 2px 8px 0 rgba(0,0,0,0.18);"></span>
              </span>
              Clara, Voice of TruthLens
            </span>
          </h3>
          <div class="space-y-8">
            <section class="p-5 bg-slate-800/40 rounded-lg border border-white/10 shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
              <h4 class="text-xl font-semibold text-blue-200 mb-3">Your Conversational AI Guide with Theoretical Grounding</h4>
              <p class="text-gray-300 mb-3">Clara is the human voice and intelligent companion of TruthLens, powered by ElevenLabs. But Clara is not just a voice assistant — she interprets the platform's outputs using a curated base of knowledge rooted in critical discourse theory and linguistics.</p>
              <p class="text-gray-300 mb-3">Her interpretations are informed by:</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>Michel Foucault</li>
                <li>Pierre Bourdieu</li>
                <li>Umberto Eco</li>
                <li>Ducrot & Kerbrat-Orecchioni</li>
                <li>J.L. Austin & J. Searle</li>
                <li>Julia Kristeva</li>
                <li>Noam Chomsky</li>
                <li>Paul Grice</li>
                <li>Wittgenstein</li>
              </ul>
              <p class="text-gray-400 text-sm mt-2">Clara bridges the gap between machine output and human understanding by offering semantically grounded, multilingual explanations—spoken naturally, whenever you need them.</p>
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
              <p class="text-gray-300 mb-3">TruthLens does not tell you what to believe.<br>It teaches you how to question more deeply.</p>
              <ul class="list-disc list-inside text-gray-300 mb-3">
                <li>Cross-check your sources</li>
                <li>Follow the underlying structure</li>
                <li>Stay aware of manipulation techniques</li>
              </ul>
              <p class="text-gray-400 text-sm">TruthLens is not a filter bubble.<br>It is your personal instrument of critical inquiry—in the age of AI.</p>
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

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>