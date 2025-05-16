<script setup lang="ts">
import { ref } from 'vue';
import { useUrlValidation } from '../composables/useUrlValidation';

const inputText = ref('');
const isLoading = ref(false);
const { isValidUrl } = useUrlValidation();

// Analysis results
const factualAccuracy = ref(0);
const bias = ref('');
const emotionalTone = ref('');
const recommendation = ref('');

const emit = defineEmits<{
  analyze: [text: string, results: {
    factual_accuracy: number;
    bias: string;
    emotional_tone: string;
    recommendation: string;
  }]
}>();

async function handleAnalyze() {
  if (!inputText.value.trim()) return;

  isLoading.value = true;

  try {
    const response = await fetch('http://localhost:8000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input_text: inputText.value
      })
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    const result = await response.json();

    // Update local state
    factualAccuracy.value = result.factual_accuracy;
    bias.value = result.bias;
    emotionalTone.value = result.emotional_tone;
    recommendation.value = result.recommendation;

    // Emit results to parent
    emit('analyze', inputText.value, result);
  } catch (error) {
    console.error('Error analyzing text:', error);
    // TODO: Add user-facing error message
  } finally {
    isLoading.value = false;
  }
}

function loadExample() {
  inputText.value = `In a shocking turn of events, scientists discover that drinking water might actually be good for you. This groundbreaking research, funded by the International Water Association, suggests that humans should consume water daily. Critics argue this could be a ploy by the water industry.`;
  handleAnalyze();
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto rounded-xl p-6">
    <div class="relative rounded-lg">
      <div class="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-cyan-400 to-blue-400 z-0"></div>
      <textarea
        v-model="inputText"
        placeholder="Paste your article text or URL here..."
        class="w-full h-40 p-4 rounded-lg glass-input text-white placeholder-blue-200/50 relative z-10 bg-slate-900"
      ></textarea>
    </div>

    <div class="mt-4 flex gap-4">
      <button
        @click="handleAnalyze"
        :disabled="!inputText.trim() || isLoading"
        class="flex-1 bg-blue-600/80 glass-button text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isLoading">Analyze</span>
        <span v-else>Analyzing...</span>
      </button>

      <button
        @click="loadExample"
        class="px-6 py-3 glass-button border border-white/20 rounded-lg hover:bg-white/5"
      >
        See Example
      </button>
    </div>

    <!-- Results Display -->
    <div
      v-if="factualAccuracy !== 0 || bias || emotionalTone || recommendation"
      class="mt-6 p-4 rounded-xl border border-white/10 text-white space-y-3"
    >
      <div>
        <span class="font-semibold text-blue-300">Factual Accuracy:</span>
        {{ factualAccuracy }}%
      </div>
      <div>
        <span class="font-semibold text-blue-300">Political Bias:</span>
        {{ bias }}
      </div>
      <div>
        <span class="font-semibold text-blue-300">Emotional Language:</span>
        {{ emotionalTone }}
      </div>
      <div>
        <span class="font-semibold text-blue-300">Reader Recommendation:</span>
        {{ recommendation }}
      </div>
    </div>
  </div>
</template>