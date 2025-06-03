<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import AnalysisVisual from './AnalysisVisual.vue';

const inputText = ref('');
const isLoading = ref(false);
const showExplanation = ref(false);
const isLoadingExtended = ref(false);

// Constants
const API_BASE_URL = 'https://truthlens-backend-production.up.railway.app';


// Analysis results
const fakeNewsPercentage = ref(0);
const bias = ref('');
const emotionalTone = ref('');
const recommendation = ref('');
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
const analysis = ref<{
  blocks?: any[];
}>({});

const emit = defineEmits<{
  analyze: [text: string, results: {
    fake_news_percentage: number;
    bias: string;
    emotional_tone: string;
    recommendation: string;
    analysis_explanation: string;
  }]
}>();

async function handleAnalyze() {
  if (!inputText.value.trim()) return;
  if (inputText.value.length > 4000) {
    alert("The text is too long. Please limit it to 4000 characters.");
    return;
  }
  isLoading.value = true;
  showExplanation.value = false;
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
    console.log('Making API request to:', `${API_BASE_URL}/api/analyze`);
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        input_text: inputText.value.trim()
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
    if (!result.factual_accuracy || !result.bias || !result.emotional_tone || !result.recommendation) {
      console.error('Missing required fields in response:', result);
      throw new Error('Invalid response format: missing required fields');
    }

    // Update local state
    fakeNewsPercentage.value = result.factual_accuracy;
    bias.value = result.bias;
    emotionalTone.value = result.emotional_tone;
    recommendation.value = result.recommendation;
    
    // Generate blocks with the correct structure
    const blocks = [{
      text: inputText.value.trim(),
      bias: result.bias,
      highlights: [], // We'll need to get these from the backend
      style_distribution: {
        objective: result.factual_accuracy / 100,
        subjective: 1 - (result.factual_accuracy / 100),
        speculative: 0.2,
        emotive: result.emotional_tone === 'emotional' ? 0.8 : 0.2,
        clickbait: 0.1
      },
      article_type: {
        objective: result.factual_accuracy / 100,
        subjective: 1 - (result.factual_accuracy / 100),
        speculative: 0.2,
        emotive: result.emotional_tone === 'emotional' ? 0.8 : 0.2,
        clickbait: 0.1
      },
      sentiments: {
        joy: 0.1,
        trust: result.factual_accuracy / 100,
        fear: result.emotional_tone === 'alarmist' ? 0.8 : 0.2,
        surprise: 0.1,
        sadness: 0.1,
        disgust: 0.1,
        anger: result.emotional_tone === 'emotional' ? 0.6 : 0.1,
        anticipation: 0.1
      }
    }];

    // Log bias blocks data
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

async function handleExtendedAnalysis() {
  if (!inputText.value.trim()) return;
  
  if (showExplanation.value) {
    showExplanation.value = false;
    return;
  }

  showExplanation.value = true;
  isLoadingExtended.value = true;

  try {
    console.log('Starting extended analysis for text:', inputText.value.trim());
    console.log('Making API request to:', `${API_BASE_URL}/api/analyze`);
    
    const requestBody = {
      input_text: inputText.value.trim(),
      extended: true,
      prompt: `As a news analyst, provide a detailed explanation of the reasoning behind each assessment value assigned to the following text. Focus on specific evidence and clear justification for each classification.

TEXT TO ANALYZE:
${inputText.value}

EXISTING ASSESSMENT:
- Factual Accuracy: ${fakeNewsPercentage.value}%
- Political Bias: ${bias.value}
- Emotional Tone: ${emotionalTone.value}
- Recommendation: ${recommendation.value}

For each aspect, provide a structured analysis:

1. FACTUAL ACCURACY (${fakeNewsPercentage.value}%)
   - Key factors considered:
     * Source reliability and attribution
     * Verifiability of claims
     * Balance of perspectives
     * Use of evidence and data
   - Specific examples from text
   - Comparison with known facts
   - Confidence level in assessment

2. POLITICAL BIAS (${bias.value})
   - Evidence of bias:
     * Word choice and framing
     * Source selection
     * Quote usage
     * Context presentation
   - Political bias classification (select one):
     * Neutral
     * Center-left
     * Left-leaning
     * Center-right
     * Right-leaning
     * Anti-government
     * Pro-government
     * Other (specify)
   - Specific examples from text
   - Impact on message
   - Cultural/political context

3. EMOTIONAL TONE (${emotionalTone.value})
   - Language patterns:
     * Emotional triggers
     * Sensational elements
     * Rhetorical devices
   - Specific examples from text
   - Effect on reader perception
   - Credibility implications

4. RECOMMENDATION (${recommendation.value})
   - Primary factors:
     * Accuracy score
     * Bias assessment
     * Emotional tone
     * Source reliability
   - Specific concerns
   - Suggested verification steps
   - Risk assessment

⚠️ Important Notes:
- Use objective language
- Provide specific examples from the text
- Explain the relationship between different assessments
- Consider cultural and political context
- Be transparent about confidence levels
- Highlight any significant uncertainties

Format your response in a clear, structured manner that makes the reasoning behind each assessment easily understandable.`
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...requestBody,
        temperature: 0.4,
        max_tokens: 2000
      })
    });

    console.log('Extended analysis response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Extended analysis error response:', errorData);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a minute before trying again.');
      }
      
      throw new Error(errorData?.detail || errorData?.error || 'Extended analysis failed');
    }

    const result = await response.json();
    console.log('Raw API response:', JSON.stringify(result, null, 2));
    
    // Log specific fields we expect
    console.log('Expected fields check:', {
      has_factual_accuracy: 'factual_accuracy' in result,
      has_bias: 'bias' in result,
      has_emotional_tone: 'emotional_tone' in result,
      has_recommendation: 'recommendation' in result,
      has_article_type: 'article_type' in result,
      has_sentiments: 'sentiments' in result
    });

    // Validate response structure
    if (!result.factual_accuracy || !result.bias || !result.emotional_tone || !result.recommendation) {
      console.error('Missing required fields in response:', result);
      throw new Error('Invalid response format: missing required fields');
    }

    // Create the extended analysis structure with default values for missing fields
    const extendedAnalysis = {
      analysis_explanation: {
        factual_accuracy: {
          score: result.factual_accuracy,
          key_indicators: result.analysis_explanation?.factual_accuracy?.key_indicators || 
            `The factual accuracy score of ${result.factual_accuracy}% is based on the balance of verifiable and speculative claims in the text.`,
          examples_from_text: result.analysis_explanation?.factual_accuracy?.examples_from_text || 
            `The text contains a mix of verifiable claims and speculative elements.`,
          weight_of_factors: result.analysis_explanation?.factual_accuracy?.weight_of_factors || 
            `This score considers the balance between verifiable claims and unverified statements.`,
          comparison_with_similar_content: result.analysis_explanation?.factual_accuracy?.comparison_with_similar_content || 
            `The text's approach to presenting information shows characteristics of ${result.article_type?.objective > 0.5 ? 'objective' : 'subjective'} reporting.`
        },
        bias: {
          classification: result.bias,
          language_patterns: result.analysis_explanation?.bias?.language_patterns || 
            `The text shows ${result.bias} bias through its language patterns.`,
          examples_of_bias: result.analysis_explanation?.bias?.examples_of_bias || 
            `This bias is evident in how the text frames information.`,
          context_and_implications: result.analysis_explanation?.bias?.context_and_implications || 
            `The ${result.bias} bias influences how readers might interpret the information.`,
          effect_on_message: result.analysis_explanation?.bias?.effect_on_message || 
            `The message is affected by the ${result.bias} bias in its presentation.`
        },
        emotional_tone: {
          classification: result.emotional_tone,
          emotional_language_patterns: result.analysis_explanation?.emotional_tone?.emotional_language_patterns || 
            `The text uses ${result.emotional_tone} language throughout.`,
          examples_of_emotional_language: result.analysis_explanation?.emotional_tone?.examples_of_emotional_language || 
            `The emotional tone is particularly evident in the text's language.`,
          impact_on_message: result.analysis_explanation?.emotional_tone?.impact_on_message || 
            `The ${result.emotional_tone} tone affects how the message is received.`,
          effect_on_credibility: result.analysis_explanation?.emotional_tone?.effect_on_credibility || 
            `The emotional language may impact the article's credibility.`
        },
        recommendation: {
          text: result.recommendation,
          key_factors: result.analysis_explanation?.recommendation?.key_factors || 
            `Given the ${result.bias} bias and the ${result.emotional_tone} tone, readers should consider these factors.`,
          specific_concerns: result.analysis_explanation?.recommendation?.specific_concerns || 
            `The ${result.factual_accuracy}% factual accuracy score suggests some concerns.`,
          relation_to_other_classifications: result.analysis_explanation?.recommendation?.relation_to_other_classifications || 
            `This recommendation is based on the combination of ${result.bias} bias, ${result.emotional_tone} tone, and ${result.factual_accuracy}% factual accuracy.`
        }
      }
    };

    // Log the formatted analysis
    console.log('Formatted analysis structure:', JSON.stringify(extendedAnalysis, null, 2));

    // Set the analysis explanation
    console.log('Setting analysis explanation:', extendedAnalysis);
    analysisExplanation.value = extendedAnalysis;

  } catch (error) {
    console.error('Error getting extended analysis:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Show error message to user
    alert(error instanceof Error ? error.message : 'Error loading extended analysis. Please try again.');
    
    analysisExplanation.value = {
      analysis_explanation: {
        factual_accuracy: {
          score: 0,
          key_indicators: error instanceof Error ? error.message : 'Error loading extended analysis. Please try again.',
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
  } finally {
    isLoadingExtended.value = false;
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
        placeholder="Write or paste your text here (4000 characters max)..."
        class="w-full h-32 sm:h-40 p-3 sm:p-4 rounded-lg glass-input text-white placeholder-blue-200/50 relative z-10 bg-slate-900
               transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:shadow-lg
               text-sm sm:text-base"
      ></textarea>
    </div>
    <div
        class="mt-1 text-xs sm:text-sm text-right transition-colors duration-300"
        :class="inputText.length > 4000 ? 'text-red-400' : 'text-blue-200/70'"
      >
        {{ inputText.length }} / 4000
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
      v-if="fakeNewsPercentage !== 0 || bias || emotionalTone || recommendation"
      class="mt-6 p-4 sm:p-6 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-white/10 
             shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)]
             text-white space-y-3 sm:space-y-4 animate-slide-up relative"
    >
      <div class="animate-fade-in p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10 
                  shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]" 
           style="animation-delay: 100ms">
        <span class="font-semibold text-blue-300 text-sm sm:text-base">Fake News Percentage:</span>
        <span class="text-sm sm:text-base">{{ fakeNewsPercentage }}%</span>
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
      
      <!-- Extended Analysis Button -->
      <div class="animate-fade-in mt-3 sm:mt-4" style="animation-delay: 500ms">
        <button
          @click="handleExtendedAnalysis"
          :disabled="isLoadingExtended"
          class="w-full relative group overflow-hidden bg-slate-900/80
                 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg 
                 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/25
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none
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
            <span v-if="!isLoadingExtended">
              {{ showExplanation ? 'Hide' : 'Show' }} Extended Analysis
            </span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Analysis...
            </span>
            <svg 
              v-if="!isLoadingExtended"
              class="w-4 h-4 transition-transform duration-300"
              :class="{ 'rotate-180': showExplanation }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>

      <!-- Analysis Explanation -->
      <div 
        v-if="showExplanation"
        class="animate-fade-in mt-3 sm:mt-4 space-y-3 sm:space-y-4"
      >
        <div v-if="isLoadingExtended" class="p-3 sm:p-4 bg-slate-800/60 rounded-lg text-center text-slate-200
                    shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)] text-sm sm:text-base">
          Loading detailed analysis...
        </div>
        <template v-else>
          <!-- Fake News Percentage Explanation -->
          <div v-if="analysisExplanation.analysis_explanation.factual_accuracy" class="p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10
                      shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
            <div class="flex items-center gap-2 mb-2 sm:mb-3">
              <span class="font-semibold text-blue-300 text-sm sm:text-base">Fake News Score Analysis:</span>
              <span class="text-white text-sm sm:text-base">{{ analysisExplanation.analysis_explanation.factual_accuracy.score }}%</span>
            </div>
            <div class="space-y-3 text-xs sm:text-sm text-slate-200">
              <div>
                <span class="font-medium text-blue-200">Key Indicators:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.factual_accuracy.key_indicators }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Examples from Text:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.factual_accuracy.examples_from_text }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Weight of Factors:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.factual_accuracy.weight_of_factors }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Comparison with Similar Content:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.factual_accuracy.comparison_with_similar_content }}</p>
              </div>
            </div>
          </div>

          <!-- Bias Explanation -->
          <div v-if="analysisExplanation.analysis_explanation.bias" class="p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10
                      shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
            <div class="flex items-center gap-2 mb-3">
              <span class="font-semibold text-blue-300">Bias Analysis:</span>
              <span class="text-white">{{ analysisExplanation.analysis_explanation.bias.classification }}</span>
            </div>
            <div class="space-y-3 text-sm text-slate-200">
              <div>
                <span class="font-medium text-blue-200">Language Patterns:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.bias.language_patterns }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Examples of Bias:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.bias.examples_of_bias }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Context and Implications:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.bias.context_and_implications }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Effect on Message:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.bias.effect_on_message }}</p>
              </div>
            </div>
          </div>

          <!-- Emotional Tone Explanation -->
          <div v-if="analysisExplanation.analysis_explanation.emotional_tone" class="p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10
                      shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
            <div class="flex items-center gap-2 mb-3">
              <span class="font-semibold text-blue-300">Emotional Tone Analysis:</span>
              <span class="text-white">{{ analysisExplanation.analysis_explanation.emotional_tone.classification }}</span>
            </div>
            <div class="space-y-3 text-sm text-slate-200">
              <div>
                <span class="font-medium text-blue-200">Emotional Language Patterns:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.emotional_tone.emotional_language_patterns }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Examples of Emotional Language:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.emotional_tone.examples_of_emotional_language }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Impact on Message:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.emotional_tone.impact_on_message }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Effect on Credibility:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.emotional_tone.effect_on_credibility }}</p>
              </div>
            </div>
          </div>

          <!-- Recommendation Explanation -->
          <div v-if="analysisExplanation.analysis_explanation.recommendation" class="p-3 sm:p-4 bg-slate-800/60 rounded-lg border border-white/10
                      shadow-[inset_0_1px_2px_0_rgba(0,0,0,0.2)]">
            <div class="flex items-center gap-2 mb-3">
              <span class="font-semibold text-blue-300">Recommendation Analysis:</span>
            </div>
            <div class="space-y-3 text-sm text-slate-200">
              <div>
                <span class="font-medium text-blue-200">General Recommendation:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.recommendation.text }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Key Factors:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.recommendation.key_factors }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Specific Concerns:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.recommendation.specific_concerns }}</p>
              </div>
              <div>
                <span class="font-medium text-blue-200">Relation to Other Classifications:</span>
                <p class="mt-1">{{ analysisExplanation.analysis_explanation.recommendation.relation_to_other_classifications }}</p>
              </div>
            </div>
          </div>
        </template>
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