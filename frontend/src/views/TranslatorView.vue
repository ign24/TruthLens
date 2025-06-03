<script setup lang="ts">
import { ref, computed } from 'vue';
import Header from '../components/Header.vue';

const sourceText = ref('');
const translatedText = ref('');
const sourceLanguage = ref('en');
const targetLanguage = ref('es');
const translationMode = ref('professional');
const isTranslating = ref(false);
const showCopied = ref(false);

const languages = [
  // Idiomas principales
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  
  // Idiomas adicionales
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  
  // Idiomas indígenas (experimentales)
  { code: 'gn', name: 'Guaraní', nativeName: 'Avañe\'ẽ', experimental: true },
  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi', experimental: true },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', experimental: true }
];

const translationModes = [
  { 
    id: 'literal', 
    name: 'Literal', 
    description: 'Word-for-word translation preserving the original structure and meaning',
    icon: 'M4 6h16M4 12h16m-7 6h7'
  },
  { 
    id: 'idiomatic', 
    name: 'Idiomatic', 
    description: 'Natural translation that adapts idioms and expressions to the target language',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
  },
  { 
    id: 'academic', 
    name: 'Academic', 
    description: 'Scholarly translation suitable for research papers and academic publications',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  { 
    id: 'legal', 
    name: 'Legal', 
    description: 'Precise translation for legal documents and contracts',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  { 
    id: 'technical', 
    name: 'Technical', 
    description: 'Specialized translation for technical documentation and manuals',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
  },
  { 
    id: 'plain_language', 
    name: 'Plain Language', 
    description: 'Clear and simple translation that is easy to understand',
    icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
  },
  { 
    id: 'journalistic', 
    name: 'Journalistic', 
    description: 'News-style translation for articles and reports',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    description: 'Artistic translation that preserves the creative essence',
    icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z'
  }
];

const canTranslate = computed(() => {
  return sourceText.value.trim().length > 0 && !isTranslating.value;
});

const swapLanguages = () => {
  const temp = sourceLanguage.value;
  sourceLanguage.value = targetLanguage.value;
  targetLanguage.value = temp;
  if (translatedText.value) {
    sourceText.value = translatedText.value;
    translatedText.value = '';
  }
};

const copyToClipboard = async () => {
  if (translatedText.value) {
    await navigator.clipboard.writeText(translatedText.value);
    showCopied.value = true;
    setTimeout(() => {
      showCopied.value = false;
    }, 2000);
  }
};

const clearText = () => {
  sourceText.value = '';
  translatedText.value = '';
};

const translate = async () => {
  if (!canTranslate.value) return;
  
  isTranslating.value = true;
  try {
    // TODO: Implement actual translation logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    translatedText.value = `[${translationMode.value}] Translation of: ${sourceText.value}`;
  } catch (error) {
    console.error('Translation error:', error);
    translatedText.value = 'Error during translation. Please try again.';
  } finally {
    isTranslating.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen">
    <Header />

    <div class="pt-24 pb-4 px-4 text-white relative mb-3">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="font-display text-6xl font-bold mb-6 relative">
            <span class="bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
              TruthLens Translator Pro
            </span>
          </h1>
          <p class="text-lg text-blue-200/80 font-display tracking-wide">
            Professional-grade translation with context awareness
          </p>
        </div>

        <!-- Translation Mode Selector -->
        <div class="translation-modes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div v-for="mode in translationModes" 
               :key="mode.id"
               tabindex="0"
               @keyup.enter="translationMode = mode.id"
               @click="translationMode = mode.id"
               class="translation-mode-card group touch-manipulation"
               :class="[
                 translationMode === mode.id 
                   ? 'selected-mode' 
                   : ''
               ]">
            <div class="flex flex-col items-center gap-2 justify-center h-full">
              <svg class="w-8 h-8 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mode.icon" />
              </svg>
              <h3 class="text-base sm:text-lg font-semibold text-blue-200 group-hover:text-white transition-colors text-center">{{ mode.name }}</h3>
            </div>
            <p class="text-xs sm:text-sm text-slate-300 group-hover:text-slate-200 transition-colors text-center mt-2">{{ mode.description }}</p>
          </div>
        </div>

        <!-- Translation Interface -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Source Text -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="language-select-container flex flex-col gap-2 w-full">
                <div class="relative w-full">
                  <select v-model="sourceLanguage"
                    class="custom-select w-full text-base sm:text-lg font-medium bg-slate-800 border border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none pr-10"
                    aria-label="Select source language">
                    <optgroup label="Main Languages">
                      <option v-for="lang in languages.filter(l => !l.experimental)" :key="lang.code" :value="lang.code">
                        {{ lang.name }} ({{ lang.nativeName }})
                      </option>
                    </optgroup>
                    <optgroup label="Experimental Languages">
                      <option v-for="lang in languages.filter(l => l.experimental)" :key="lang.code" :value="lang.code">
                        {{ lang.name }} ({{ lang.nativeName }})
                      </option>
                    </optgroup>
                  </select>
                  <span class="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
              </div>
              <button @click="clearText" 
                      class="group text-slate-400 transition-colors p-2 rounded-lg bg-transparent min-h-[44px] min-w-[44px] touch-manipulation shadow outline-none focus:ring-0"
                      title="Clear text" aria-label="Clear text">
                <svg class="w-5 h-5 transition-colors group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div class="relative w-full">
              <textarea
                v-model="sourceText"
                class="w-full h-32 sm:h-40 md:h-64 bg-slate-800 border border-blue-500 rounded-lg p-4 text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 text-base sm:text-lg shadow translation-input-area"
                placeholder="Enter text to translate..."
                aria-label="Source text"
              ></textarea>
              <button
                v-if="sourceText"
                @click="clearText"
                class="absolute top-1/2 right-4 -translate-y-1/2 group text-slate-400 transition-colors rounded-lg bg-[#232a3a] p-2 min-h-[36px] min-w-[36px] flex items-center justify-center shadow hover:bg-blue-900/40 hover:text-cyan-400 focus:outline-none"
                title="Clear text" aria-label="Clear text"
                tabindex="0"
              >
                <svg class="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Translated Text -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex flex-col gap-2 w-full">
                <div class="relative w-full">
                  <select v-model="targetLanguage"
                    class="custom-select w-full text-base sm:text-lg font-medium bg-slate-800 border border-blue-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none pr-10"
                    aria-label="Select target language">
                    <optgroup label="Main Languages">
                      <option v-for="lang in languages.filter(l => !l.experimental)" :key="lang.code" :value="lang.code">
                        {{ lang.name }} ({{ lang.nativeName }})
                      </option>
                    </optgroup>
                    <optgroup label="Experimental Languages">
                      <option v-for="lang in languages.filter(l => l.experimental)" :key="lang.code" :value="lang.code">
                        {{ lang.name }} ({{ lang.nativeName }})
                      </option>
                    </optgroup>
                  </select>
                  <span class="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
              </div>
              <button @click="copyToClipboard" 
                      class="group text-slate-400 transition-colors p-2 rounded-lg bg-transparent relative min-h-[44px] min-w-[44px] touch-manipulation shadow outline-none focus:ring-0"
                      title="Copy translation" aria-label="Copy translation">
                <svg class="w-5 h-5 transition-colors group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span v-if="showCopied" 
                      class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                  Copied!
                </span>
              </button>
            </div>
            <div class="relative w-full">
              <div 
                class="translation-result-area w-full h-32 sm:h-40 md:h-64 p-4 text-white overflow-y-auto text-base sm:text-lg"
                tabindex="0"
                aria-label="Translation result"
              >
                <div v-if="isTranslating" class="flex items-center justify-center h-full">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
                <div v-else>
                  {{ translatedText || 'Translation will appear here...' }}
                </div>
              </div>
              <button
                v-if="translatedText"
                @click="copyToClipboard"
                class="absolute top-1/2 right-4 -translate-y-1/2 group text-slate-400 transition-colors rounded-lg bg-[#232a3a] p-2 min-h-[36px] min-w-[36px] flex items-center justify-center shadow hover:bg-blue-900/40 hover:text-cyan-400 focus:outline-none"
                title="Copy translation" aria-label="Copy translation"
                tabindex="0"
              >
                <svg class="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span v-if="showCopied" class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Copied!</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex justify-center items-center gap-4">
          <button
            @click="swapLanguages"
            class="p-3 bg-slate-800/50 text-white rounded-lg hover:bg-slate-700/50 transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
            :disabled="!sourceText"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <button
            @click="translate"
            :disabled="!canTranslate"
            class="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg font-medium
                   transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                   disabled:hover:scale-100 disabled:active:scale-100 min-h-[44px] touch-manipulation"
          >
            <span v-if="isTranslating">Translating...</span>
            <span v-else>Translate</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-gradient {
  animation: gradient 8s linear infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
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

/* Efecto hundido solo en campos de texto y área de traducción */
textarea,
.translation-result-area {
  background: #181e2a !important;
  border-radius: 1rem !important;
  box-shadow: inset 2px 2px 8px 0 #10131a, inset -2px -2px 8px 0 #232a3a;
  border: 1.5px solid #232a3a !important;
}

.custom-select {
  min-width: 180px;
  max-width: 100%;
  background-image: none;
}
.custom-select option, .custom-select optgroup {
  color: #181e2a;
  background: #e0e7ef;
  font-size: 1rem;
}
.custom-select:focus {
  border-color: #22d3ee;
  box-shadow: 0 0 0 2px #22d3ee44;
}

.translation-mode-card {
  background: #181e2a;
  border-radius: 1rem;
  border: 1.5px solid #232a3a;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s, background 0.2s, transform 0.2s;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.translation-mode-card.selected-mode {
  border-color: #22d3ee;
  background: linear-gradient(135deg, #0ea5e9 10%, #1e293b 100%);
  box-shadow: 0 4px 16px 0 rgba(34,211,238,0.10);
  transform: scale(1.03);
}
.translation-modes-grid {
  width: 100%;
}

.language-select-container {
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .translation-modes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    max-width: 350px;
    margin: 0 auto;
    justify-items: center;
  }
  .translation-mode-card {
    aspect-ratio: 1 / 1;
    width: 110px;
    min-width: 110px;
    max-width: 110px;
    min-height: 110px;
    max-height: 110px;
    padding: 0.7rem 0.3rem;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .translation-mode-card h3 {
    font-size: 1.05rem;
  }
  .translation-mode-card p {
    font-size: 0.8rem;
    display: none;
  }
}

.translation-input-area {
  padding-right: 3rem !important;
}
.translation-result-area {
  padding-right: 3rem !important;
}
</style> 