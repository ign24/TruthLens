<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import AnalysisVisual from './AnalysisVisual.vue';
import { getApiUrl } from '../config/api';

// State management for form and analysis
const inputText = ref('');
const isLoading = ref(false);

// Analysis results state
const factualAccuracy = ref(0);
const bias = ref('');
const emotionalTone = ref('');
const recommendation = ref('');

// Detailed analysis explanation structure
const analysisExplanation = ref<{
  analysis_explanation: {
    factual_accuracy: {
      score: number;
      key_indicators: string;
      examples_from_text: string;
      weight_of_factors: string;
      comparison_with_similar_content: string;
    };
    bias: {
      classification: string;
      language_patterns: string;
      examples_of_bias: string;
      context_and_implications: string;
      effect_on_message: string;
    };
    emotional_tone: {
      classification: string;
      emotional_language_patterns: string;
      examples_of_emotional_language: string;
      impact_on_message: string;
      effect_on_credibility: string;
    };
    recommendation: {
      text: string;
      key_factors: string;
      specific_concerns: string;
      relation_to_other_classifications: string;
    };
  };
}>({
  analysis_explanation: {
    factual_accuracy: {
      score: 0,
      key_indicators: '',
      examples_from_text: '',
      weight_of_factors: '',
      comparison_with_similar_content: ''
    },
    bias: {
      classification: '',
      language_patterns: '',
      examples_of_bias: '',
      context_and_implications: '',
      effect_on_message: ''
    },
    emotional_tone: {
      classification: '',
      emotional_language_patterns: '',
      examples_of_emotional_language: '',
      impact_on_message: '',
      effect_on_credibility: ''
    },
    recommendation: {
      text: '',
      key_factors: '',
      specific_concerns: '',
      relation_to_other_classifications: ''
    }
  }
});

// Analysis blocks for visualization
const analysis = ref<{
  blocks?: any[];
}>({});

// Component events
const emit = defineEmits<{
  analyze: [text: string, results: {
    fake_news_percentage: number;
    bias: string;
    emotional_tone: string;
    recommendation: string;
    analysis_explanation: string;
  }]
}>();

/**
 * Handle the analysis of input text
 * Makes API request to analyze the text and updates the UI with results
 */
async function handleAnalyze() {
  if (!inputText.value.trim()) return;
  if (inputText.value.length > 8000) {
    alert("The text is too long. Please limit it to 8000 characters.");
    return;
  }
  isLoading.value = true;
  
  // Reset analysis explanation state
  analysisExplanation.value = {
    analysis_explanation: {
      factual_accuracy: {
        score: 0,
        key_indicators: '',
        examples_from_text: '',
        weight_of_factors: '',
        comparison_with_similar_content: ''
      },
      bias: {
        classification: '',
        language_patterns: '',
        examples_of_bias: '',
        context_and_implications: '',
        effect_on_message: ''
      },
      emotional_tone: {
        classification: '',
        emotional_language_patterns: '',
        examples_of_emotional_language: '',
        impact_on_message: '',
        effect_on_credibility: ''
      },
      recommendation: {
        text: '',
        key_factors: '',
        specific_concerns: '',
        relation_to_other_classifications: ''
      }
    }
  };

  try {
    // Make API request to analyze text
    console.log('Making API request to:', getApiUrl('ANALYZE'));
    const response = await fetch(getApiUrl('ANALYZE'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text: inputText.value.trim()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Analysis error response:', errorData);
      throw new Error(errorData?.detail || 'Analysis failed');
    }

    const result = await response.json();
    console.log('Basic analysis result:', result);

    // Validate response structure
    if (
      result.factual_accuracy === undefined ||
      result.bias === undefined ||
      result.emotional_tone === undefined ||
      result.recommendation === undefined ||
      result.article_type === undefined ||
      result.sentiments === undefined ||
      result.analysis_explanation === undefined
    ) {
      console.error('Missing required fields in response:', result);
      throw new Error('Invalid response format: missing required fields');
    }

    // Update local state with analysis results
    factualAccuracy.value = result.factual_accuracy;
    bias.value = result.bias;
    emotionalTone.value = result.emotional_tone;
    recommendation.value = result.recommendation;
    
    // Generate visualization blocks with analysis data
    const blocks = [{
      text: inputText.value.trim(),
      bias: result.bias,
      style_distribution: result.article_type || {
        objective: result.factual_accuracy / 100,
        subjective: 1 - (result.factual_accuracy / 100),
        speculative: 0,
        emotive: 0,
        clickbait: 0
      },
      article_type: result.article_type || {
        objective: result.factual_accuracy / 100,
        subjective: 1 - (result.factual_accuracy / 100),
        speculative: 0,
        emotive: 0,
        clickbait: 0
      },
      sentiments: result.sentiments || {
        joy: 0,
        trust: 0,
        fear: 0,
        surprise: 0,
        sadness: 0,
        disgust: 0,
        anger: 0,
        anticipation: 0
      },
      topic: result.topic || '',
      frames_detected: result.frames_detected || []
    }];

    // Log bias blocks data for debugging
    console.log('Generated blocks:', blocks);

    // Format the result for the parent component
    const formattedResult = {
      fake_news_percentage: result.factual_accuracy,
      bias: result.bias,
      emotional_tone: result.emotional_tone,
      recommendation: result.recommendation,
      analysis_explanation: JSON.stringify(result)
    };

    // Update analysis with generated blocks
    analysis.value = {
      blocks: blocks
    };

    emit('analyze', inputText.value, formattedResult);
  } catch (error) {
    console.error('Error analyzing text:', error);
    alert(error instanceof Error ? error.message : 'An error occurred while analyzing the text. Please try again.');
  } finally {
    isLoading.value = false;
  }
}

function loadExample() {
  inputText.value = `Amid rising tensions, government officials warn that the recent surge in immigration poses a "serious threat to national stability." Meanwhile, independent reports suggest the influx has had a neutral or even positive economic impact. A viral video showing a confrontation at the border has sparked outrage online, though fact-checkers later revealed it was taken out of context. Experts urge the public to avoid jumping to conclusions and await verified information.`;
  handleAnalyze();
}

// Add watcher for analysis blocks
watch(() => analysis.value, (newValue) => {
  console.log('Analysis blocks updated:', {
    has_blocks: 'blocks' in newValue,
    blocks_count: newValue.blocks?.length || 0,
    blocks_data: newValue.blocks
  });
}, { deep: true });

// Add watcher for BiasBlocks component
onMounted(() => {
  console.log('AnalysisForm mounted, current analysis state:', {
    has_blocks: 'blocks' in analysis.value,
    blocks_count: analysis.value.blocks?.length || 0,
    blocks_data: analysis.value.blocks
  });
});
</script>

<template>
  <div class="w-full max-w-2xl mx-auto rounded-xl p-4 sm:p-6 animate-fade-in">
    <div class="relative rounded-lg group">
      <div class="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 z-0 transition-all duration-300 group-hover:opacity-80"></div>
      <textarea
        v-model="inputText"
        placeholder="Write or paste your text here (8000 characters max)..."
        class="w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg glass-input text-white placeholder-blue-200/50 relative z-10 bg-slate-900
               transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:shadow-lg
               text-sm sm:text-base"
      ></textarea>
    </div>
    <div
        class="mt-1 text-xs sm:text-sm text-right transition-colors duration-300"
        :class="inputText.length > 8000 ? 'text-red-400' : 'text-blue-200/70'"
      >
        {{ inputText.length }} / 8000
    </div>

    <div class="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
      <button
        @click="handleAnalyze"
        :disabled="!inputText.trim() || isLoading"
        class="w-full sm:flex-1 relative group overflow-hidden bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 
               text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg 
               transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/25
               disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none
               text-sm sm:text-base font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)]"
      >
        <!-- Gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Shine effect -->
        <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000
                    bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <span class="relative z-10 flex items-center justify-center gap-2">
          <svg v-if="!isLoading" class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div v-else class="w-4 h-4 sm:w-5 sm:h-5 relative">
            <!-- Outer ring -->
            <div class="absolute inset-0 border-2 border-white/20 rounded-full"></div>
            <!-- Spinning ring -->
            <div class="absolute inset-0 border-2 border-t-white rounded-full animate-spin"></div>
            <!-- Inner dot -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          {{ isLoading ? 'Analyzing...' : 'Analyze Text' }}
        </span>
      </button>

      <button
        @click="loadExample"
        class="w-full sm:w-auto relative group overflow-hidden bg-slate-900/80
               text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg 
               transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/25
               text-sm sm:text-base font-medium border border-slate-700/50
               shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
      >
        <!-- Gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Shine effect -->
        <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000
                    bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <span class="relative z-10 flex items-center justify-center gap-2">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          See Example
        </span>
      </button>
    </div>

    <!-- Results Display -->
    <div
      v-if="factualAccuracy !== 0 || bias || emotionalTone || recommendation"
      class="mt-6 p-4 sm:p-6 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-white/10 
             shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)]
             text-white space-y-3 sm:space-y-4 animate-slide-up relative"
    >
      <div class="animate-fade-in p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10 
                  shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]" 
           style="animation-delay: 100ms">
        <span class="font-semibold text-blue-300 text-sm sm:text-base">Factual Accuracy:</span>
        <span class="text-sm sm:text-base">{{ factualAccuracy }}%</span>
      </div>
      <div class="animate-fade-in p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10 
                  shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]" 
           style="animation-delay: 200ms">
        <span class="font-semibold text-blue-300 text-sm sm:text-base">Political Bias:</span>
        <span class="text-sm sm:text-base">{{ bias }}</span>
      </div>
      <div class="animate-fade-in p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10 
                  shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]" 
           style="animation-delay: 300ms">
        <span class="font-semibold text-blue-300 text-sm sm:text-base">Emotional Language:</span>
        <span class="text-sm sm:text-base">{{ emotionalTone }}</span>
      </div>
      <div class="animate-fade-in p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10 
                  shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]" 
           style="animation-delay: 400ms">
        <span class="font-semibold text-blue-300 text-sm sm:text-base">Reader Recommendation:</span>
        <span class="text-sm sm:text-base">{{ recommendation }}</span>
      </div>
    </div>
    <!-- Debug info for BiasBlocks -->
    <!-- <div v-if="analysis?.blocks" class="mt-4 p-4 bg-slate-800/60 rounded-lg">
      <pre class="text-xs text-slate-300">{{ JSON.stringify(analysis.blocks, null, 2) }}</pre>
    </div> -->

    <!-- BiasBlocks -->
    <AnalysisVisual
      v-if="analysis?.blocks" 
      :blocks="analysis.blocks" 
      class="animate-slide-up"
    />

  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-button {
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.glass-button:hover {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}

/* Add gradient animation for filter buttons */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.filter-button {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
</style>