<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Header from '../components/Header.vue';
import SimpleBar from 'simplebar-vue';
import Tooltip from '../components/Tooltip.vue';
import ChatBot from '../components/ChatBot.vue';
import { getApiUrl, API_BASE_URL } from '../config/api';
import { useAudioOptimization } from '../composables/useAudioOptimization';
import { useMobileDetection } from '../composables/useMobileDetection';

// Audio optimization
const { isMobile, resumeAudioContext } = useAudioOptimization();

// Mobile detection for ChatBot visibility
const { isMobile: isMobileDevice } = useMobileDetection();

const sourceText = ref('');
const translatedText = ref('');
const sourceLanguage = ref('en');
const targetLanguage = ref('es');
const translationMode = ref<string | null>(null);
const isTranslating = ref(false);
const showCopied = ref(false);
const audioUrl = ref<string | null>(null);
const isGeneratingVoice = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const languages = [
  // Main languages
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
  
  // Additional languages
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  
  // Additional ElevenLabs languages
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino' },
  
  // Indigenous languages (experimental)
  { code: 'gn', name: 'Guaraní', nativeName: 'Avañe\'ẽ', experimental: true },
  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi', experimental: true },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru', experimental: true }
];

const translationModes = [
  { 
    id: 'literal', 
    name: 'Literal', 
    description: 'Word-for-word translation preserving the original structure',
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
    description: 'Specialized translation for technical documentation',
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

// List of languages supported by ElevenLabs for voice
const elevenLabsVoiceLanguages = [
  'en', 'es', 'pt', 'fr', 'de', 'it', 'zh', 'ja', 'ko', 'ar', 'ru', 'hi',
  'uk', 'tr', 'nl', 'pl', 'id', 'sv', 'el', 'bg', 'ro', 'cs', 'fi', 'hr',
  'ms', 'sk', 'da', 'ta', 'fil'
];

const canTranslate = computed(() => {
  return sourceText.value.trim().length > 0 && !isTranslating.value && translationMode.value !== null;
});

const canSpeak = computed(() => elevenLabsVoiceLanguages.includes(targetLanguage.value));

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
  translatedText.value = '';
  try {
    const payload = {
      text: sourceText.value,
      source_language: sourceLanguage.value,
      target_language: targetLanguage.value,
      translation_mode: translationMode.value,
    };
    console.log('Payload sent to backend (translate):', payload);
    const response = await fetch(getApiUrl('TRANSLATE'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    translatedText.value = data.translated_text || 'No translation received.';
  } catch (error) {
    console.error('Translation error:', error);
    translatedText.value = 'Error during translation. Please try again.';
  } finally {
    isTranslating.value = false;
  }
};

const translateWithVoice = async () => {
  if (!canTranslate.value) return;

  isTranslating.value = true;
  isGeneratingVoice.value = true;
  translatedText.value = '';
  audioUrl.value = null;

  try {
    const payload = {
      text: sourceText.value,
      source_language: sourceLanguage.value,
      target_language: targetLanguage.value,
      translation_mode: translationMode.value || "literal",
    };
    console.log('Payload sent to backend (translateWithVoice):', payload);
    const response = await fetch(getApiUrl('TRANSLATE_VOICE'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();
    translatedText.value = data.translated_text || 'No translation received.';
    audioUrl.value = data.audio_url && data.audio_url.startsWith("/")
      ? API_BASE_URL + data.audio_url
      : data.audio_url;
  } catch (error) {
    console.error('Translation error:', error);
    translatedText.value = 'Error during translation. Please try again.';
  } finally {
    isTranslating.value = false;
    isGeneratingVoice.value = false;
  }
};

const togglePlay = async () => {
  if (!audioRef.value) return;
  
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    // Resume audio context for mobile
    await resumeAudioContext();
    
    // Optimize audio for mobile
    if (isMobile.value) {
      audioRef.value.volume = 1.0; // Full volume on mobile
    }
    audioRef.value.play().catch(e => console.warn('Audio play failed:', e));
  }
};

const onTimeUpdate = () => {
  if (audioRef.value) currentTime.value = audioRef.value.currentTime;
};
const onLoadedMetadata = () => {
  if (audioRef.value) duration.value = audioRef.value.duration;
};
const onPlay = () => { isPlaying.value = true; };
const onPause = () => { isPlaying.value = false; };

const seek = (e: MouseEvent) => {
  if (!audioRef.value || !duration.value) return;
  const bar = e.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioRef.value.currentTime = percent * duration.value;
};

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Lifecycle hooks
onMounted(async () => {
  // Resume audio context for mobile
  await resumeAudioContext();
});

onUnmounted(() => {
  // Cleanup code if needed
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Fixed header for navigation and branding -->
    <Header />

    <!-- Main content area: padding-top prevents overlap with fixed header -->
    <div class="px-2 text-white pt-20 sm:pt-28 md:pt-[100px]">
      <!-- Centered container for the translator UI -->
      <div class="w-full max-w-3xl mx-auto py-4">
        <!-- Title and subtitle section -->
        <div class="text-center mb-3">
          <h1 class="font-display text-4xl sm:text-5xl font-bold mb-2 relative animate-fade-in">
            <span class="bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
              TruthLens Translator Pro
            </span>
          </h1>
          <p class="text-base sm:text-lg text-blue-200/80 font-display tracking-wide animate-fade-in-delay mb-6">
            Professional-grade translation with context awareness
          </p>
        </div>
        <!-- Translation mode selector grid -->
        <div class="translation-modes-grid grid grid-cols-2 sm:grid-cols-4 gap-1 mb-2">
          <transition-group name="stagger-fade">
            <div v-for="(mode, index) in translationModes" 
                 :key="mode.id"
                 tabindex="0"
                 @keyup.enter="translationMode = mode.id"
                 @click="translationMode = mode.id"
                 class="translation-mode-card group touch-manipulation p-2 sm:text-sm"
                 :style="{ '--delay': `${index * 0.1}s` }"
                 :class="[
                   translationMode === mode.id 
                     ? 'selected-mode' 
                     : '',
                   'fixed-mode-card',
                 ]">
              <div class="flex flex-col items-center gap-1 justify-center h-full transition-all duration-300"
                   :class="{ 'with-desc': translationMode === mode.id }">
                <svg
                  class="w-6 h-6 sm:w-5 sm:h-5 transition-all duration-300"
                  :class="{'icon-glow': translationMode === mode.id, 'text-blue-400': true}"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="mode.icon" />
                </svg>
                <h3 class="text-sm sm:text-base font-semibold text-blue-200 group-hover:text-white transition-colors text-center">{{ mode.name }}</h3>
              </div>
              <transition name="fade-desc">
                <p v-if="translationMode === mode.id" class="text-xs text-slate-300 group-hover:text-slate-200 transition-colors text-center mt-1">
                  {{ mode.description }}
                </p>
              </transition>
            </div>
          </transition-group>
        </div>
        <!-- Translation interface: source and target text areas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          <!-- Source text input -->
          <transition name="slide-fade" appear>
            <div class="space-y-1.5 flex flex-col h-full justify-between">
              <div class="flex items-center gap-1.5">
                <div class="relative flex items-center w-full">
                  <select v-model="sourceLanguage"
                    class="custom-select w-full text-sm font-medium bg-slate-800 border border-blue-500 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none pr-8"
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
                  <span class="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
                <!-- Button to clear source text -->
                <button @click="clearText" 
                        class="group text-slate-400 transition-colors p-1.5 rounded-lg bg-transparent min-h-[32px] min-w-[32px] flex items-center justify-center touch-manipulation shadow outline-none focus:ring-0"
                        title="Clear text" aria-label="Clear text">
                  <svg class="w-4 h-4 transition-colors group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <!-- Source text area -->
              <div class="relative w-full h-full flex-1 flex flex-col">
                <textarea
                  v-model="sourceText"
                  class="w-full h-32 sm:h-40 md:h-48 bg-slate-800 border border-blue-500 rounded-lg p-2 text-white resize-none focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm shadow translation-input-area"
                  placeholder="Enter text to translate..."
                  aria-label="Source text"
                  style="min-height: 120px; max-height: 240px;"
                ></textarea>
              </div>
            </div>
          </transition>
          <!-- Target (translated) text output -->
          <transition name="slide-fade" appear>
            <div class="space-y-1.5 flex flex-col h-full justify-between">
              <div class="flex items-center gap-1.5">
                <div class="relative flex items-center w-full">
                  <select v-model="targetLanguage"
                    class="custom-select w-full text-sm font-medium bg-slate-800 border border-blue-500 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none pr-8"
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
                  <span class="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </div>
                <!-- Button to copy translated text -->
                <button @click="copyToClipboard" 
                        class="group text-slate-400 transition-colors p-1.5 rounded-lg bg-transparent min-h-[32px] min-w-[32px] flex items-center justify-center touch-manipulation shadow outline-none focus:ring-0"
                        title="Copy translation" aria-label="Copy translation">
                  <svg class="w-4 h-4 transition-colors group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span v-if="showCopied" 
                        class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    Copied!
                  </span>
                </button>
              </div>
              <!-- Translated text area -->
              <div class="relative w-full flex-1 flex flex-col">
                <SimpleBar
                  class="translation-result-area w-full h-32 sm:h-40 md:h-48 p-2 text-white text-sm"
                  tabindex="0"
                  aria-label="Translation result"
                  style="min-height: 120px; max-height: 240px;"
                >
                  <div v-if="isTranslating" class="flex items-center justify-center h-full">
                    <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                  <div v-else>
                    {{ translatedText || 'Translation will appear here...' }}
                  </div>
                </SimpleBar>
              </div>
            </div>
          </transition>
        </div>
        <!-- Action buttons: swap, translate, translate & speak -->
        <div class="flex flex-col sm:flex-row justify-center gap-2 mt-4">
          <!-- Swap languages button -->
          <button
            @click="swapLanguages"
            class="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            :disabled="isTranslating"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap Languages
          </button>
          <!-- Translate button -->
          <Tooltip v-if="translationMode === null" text="Select a translation mode first." position="top">
            <span class="w-full sm:w-auto">
              <button
                class="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/30 opacity-50 cursor-not-allowed"
                disabled
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                Translate
              </button>
            </span>
          </Tooltip>
          <button
            v-else
            @click="translate"
            class="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canTranslate"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Translate
          </button>
          <!-- Translate & Speak button (with tooltip if not available or no mode) -->
          <Tooltip v-if="translationMode === null" text="Select a translation mode first." position="top">
            <span class="w-full sm:w-auto">
              <button
                class="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/30 opacity-50 cursor-not-allowed"
                disabled
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                </svg>
                Translate & Speak
              </button>
            </span>
          </Tooltip>
          <Tooltip v-else-if="!canSpeak" text="Audio is not available for this language." position="top">
            <span class="w-full sm:w-auto">
              <button
                class="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/30 opacity-50 cursor-not-allowed"
                disabled
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                </svg>
                Translate & Speak
              </button>
            </span>
          </Tooltip>
          <button
            v-else
            @click="translateWithVoice"
            class="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!canTranslate || isGeneratingVoice"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
            </svg>
            {{ isGeneratingVoice ? 'Generating Voice...' : 'Translate & Speak' }}
          </button>
        </div>
        <!-- Audio player for generated voice (if available) -->
        <div v-if="audioUrl" class="mt-8 flex flex-col items-center">
          <div class="w-full max-w-lg rounded-2xl bg-gradient-to-br from-cyan-900/70 via-blue-900/60 to-cyan-800/70 border-2 border-cyan-400/60 shadow-xl px-6 py-5 flex flex-col items-center backdrop-blur-md">
            <div class="flex items-center gap-3 w-full">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700/30 border border-cyan-400/40 shadow-inner">
                <svg class="w-6 h-6 text-cyan-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-2v13"></path>
                  <circle cx="6" cy="18" r="3" fill="currentColor" />
                </svg>
              </div>
              <div class="flex-1 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <!-- Play/Pause button for audio -->
                  <button @click="togglePlay" class="w-8 h-8 flex items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 shadow-md transition focus:ring-2 focus:ring-cyan-400/50">
                    <svg v-if="!isPlaying" class="w-4 h-4 text-white drop-shadow-glow" fill="currentColor" viewBox="0 0 20 20"><polygon points="5,3 19,10 5,17"/></svg>
                    <svg v-else class="w-4 h-4 text-white drop-shadow-glow" fill="currentColor" viewBox="0 0 20 20"><rect x="6" y="4" width="3" height="12"/><rect x="11" y="4" width="3" height="12"/></svg>
                  </button>
                  <!-- Audio progress bar -->
                  <div class="flex-1 h-1.5 bg-cyan-900/60 rounded-full cursor-pointer relative mx-2 max-w-[260px]" @click="seek">
                    <div class="absolute top-0 left-0 h-1.5 bg-cyan-400 rounded-full transition-all duration-200" :style="{ width: (duration ? (currentTime/duration*100) : 0) + '%' }"></div>
                  </div>
                  <!-- Audio time display -->
                  <span class="text-xs text-cyan-100 w-auto text-right font-mono whitespace-nowrap">
                    {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                  </span>
                </div>
                <!-- Hidden audio element -->
                <audio
                  ref="audioRef"
                  :src="audioUrl"
                  @timeupdate="onTimeUpdate"
                  @loadedmetadata="onLoadedMetadata"
                  @play="onPlay"
                  @pause="onPause"
                  class="hidden"
                ></audio>
              </div>
            </div>
            <span class="text-xs text-cyan-200 mt-3 tracking-wide font-medium">Listen to the AI-generated pronunciation</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- ChatBot assistant at the bottom -->
    <ChatBot v-if="!isMobileDevice" />
    
    <!-- Tarjeta informativa del Translator -->
    <div class="mt-8 sm:mt-12 max-w-2xl mx-auto px-4 sm:px-0">
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-xl border border-cyan-400/20 p-6 sm:p-8 mb-8 flex flex-col items-start">
        <div class="flex items-center mb-4">
          <svg class="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <h2 class="text-xl sm:text-2xl font-bold text-white">TruthLens Translator Pro</h2>
        </div>
        <p class="text-slate-200 mb-3 text-base">Break language barriers and verify content worldwide. Translator Pro lets you:</p>
        <ul class="list-disc list-inside text-slate-300 mb-3 text-base">
          <li>Translate articles, quotes, and documents</li>
          <li>Preserve context, tone, and intended meaning</li>
          <li>Instantly switch between 30+ languages</li>
        </ul>
        <p class="text-slate-200 text-base">Empower your research and fact-checking with advanced, context-aware translation.</p>
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
  border-radius: 0.5rem;
  border: 1px solid #232a3a;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.10);
  padding: 0.75rem 0.5rem;
  cursor: pointer;
  transition: box-shadow 0.2s, border 0.2s, background 0.2s, transform 0.2s;
  margin-bottom: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-out var(--delay) forwards;
  opacity: 0;
  height: 140px;
  min-height: 140px;
  max-height: 140px;
}
.translation-mode-card.selected-mode {
  border-color: #22d3ee;
  background: linear-gradient(135deg, #0369a1 10%, #0f172a 100%);
  box-shadow: 0 2px 8px 0 rgba(34,211,238,0.10);
  transform: scale(1.02);
}
.translation-modes-grid {
  width: 100%;
}

.language-select-container {
  margin-top: 2rem;
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fade-in-delay {
  animation: fadeIn 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Vue Transitions */
.stagger-fade-enter-active,
.stagger-fade-leave-active {
  transition: all 0.5s ease;
}

.stagger-fade-enter-from,
.stagger-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.stagger-fade-move {
  transition: transform 0.5s ease;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-desc-enter-active, .fade-desc-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-desc-enter-from, .fade-desc-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-desc-enter-to, .fade-desc-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fixed-mode-card {
  min-height: 140px;
  max-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  position: relative;
}
.with-desc {
  margin-bottom: 0.25rem;
}
.icon-glow {
  color: #22d3ee !important;
  filter: drop-shadow(0 0 6px #22d3ee88);
  transform: scale(1.18);
  transition: color 0.3s, filter 0.8s cubic-bezier(0.4,0,0.2,1), transform 1.1s cubic-bezier(0.4,0,0.2,1);
}

/* Aplica transición suave al movimiento vertical del icono */
.translation-mode-card svg {
  transition: transform 0.8s cubic-bezier(0.4,0,0.2,1), color 0.3s, filter 0.8s cubic-bezier(0.4,0,0.2,1);
}

/* Mejoras visuales para el audio custom */
.drop-shadow-glow {
  filter: drop-shadow(0 0 6px #22d3ee88);
}
</style> 