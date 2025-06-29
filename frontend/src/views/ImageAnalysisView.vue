<script setup lang="ts">
import { ref } from 'vue';
import Card from '../components/Card.vue';
import { getApiUrl } from '../config/api';
import ChatBot from '../components/ChatBot.vue';
import { useMobileDetection } from '../composables/useMobileDetection';

// Mobile detection for ChatBot visibility
const { isMobile } = useMobileDetection();

interface AnalysisResults {
  ai_probability: number;
  visual_clues: string[];
  spectral_clues: string[];
  metadata_clues: string[];
  verdict: string;
  justification: string;
  recommendation: string;
}

const analysisResults = ref<AnalysisResults | null>(null);
const isLoading = ref(false);
const errorMsg = ref('');
const isDragActive = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const uploadedImageUrl = ref<string | null>(null);

const handleFileUpload = async (event: Event) => {
  let file: File | null = null;
  if (event instanceof DragEvent && event.dataTransfer?.files?.length) {
    file = event.dataTransfer.files[0];
  } else if (event.target && (event.target as HTMLInputElement).files?.length) {
    file = (event.target as HTMLInputElement).files![0];
  }
  if (!file) return;
  uploadedImageUrl.value = URL.createObjectURL(file);
  const formData = new FormData();
  formData.append('image', file);
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const response = await fetch(getApiUrl('ANALYZE_IMAGE'), {
      method: 'POST',
      body: formData,
    });
    analysisResults.value = await response.json();
    console.log('Image analysis results:', analysisResults.value);
  } catch (error) {
    errorMsg.value = 'Error analyzing image. Please try again.';
    analysisResults.value = null;
  } finally {
    isLoading.value = false;
  }
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragActive.value = true;
};
const onDragLeave = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragActive.value = false;
};
const onDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragActive.value = false;
  handleFileUpload(e);
};
const onLabelClick = () => {
  fileInputRef.value?.click();
};

const getVerdictColorClass = (verdict: string) => {
  const v = verdict.toLowerCase();
  if (v.includes('authentic')) return 'text-green-400';
  if (v.includes('likely')) return 'text-yellow-400';
  return 'text-red-400';
};
</script>

<template>
  <div class="pt-20 sm:pt-28 md:pt-32 pb-4 px-4 text-white min-h-screen">
    <div class="w-full max-w-3xl mx-auto py-4">
      <div class="text-center mb-6">
        <h1 class="font-display text-4xl sm:text-5xl font-bold mb-2 relative animate-fade-in">
          <span class="bg-gradient-to-r from-cyan-300 via-blue-500 to-cyan-300 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
            Image Analysis
          </span>
        </h1>
        <p class="text-base sm:text-lg text-blue-200/80 font-display tracking-wide mb-6 animate-fade-in">
          Upload an image to analyze its authenticity using advanced AI techniques.
        </p>
      </div>
      <div class="w-full mx-auto mb-8 animate-fadeInUp">
        <div
          class="flex flex-col items-center justify-center w-full h-48 sm:h-56 border-2 border-dashed rounded-xl cursor-pointer bg-slate-800/60 border-slate-600 hover:bg-slate-800/80 transition-colors duration-200 group select-none"
          :class="{ 'ring-2 ring-cyan-400/80 bg-slate-800/80': isDragActive }"
          tabindex="0"
          @click="onLabelClick"
          @keydown.enter.prevent="onLabelClick"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
          aria-label="Upload image by clicking or dragging and dropping"
        >
          <div v-if="uploadedImageUrl" class="flex flex-col items-center justify-center h-full w-full">
            <img :src="uploadedImageUrl" alt="Uploaded image preview" class="max-h-40 max-w-xs rounded-lg shadow-md object-contain border border-white/10 bg-slate-900/60" />
            <span class="mt-2 text-xs text-blue-200/80">Image loaded</span>
          </div>
          <div v-else class="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
            <svg class="w-12 h-12 mb-4 text-slate-400 group-hover:text-blue-300 transition-colors" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-base text-slate-400 group-hover:text-blue-200 transition-colors">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-slate-500">PNG, JPG or JPEG (MAX. 10MB)</p>
          </div>
          <input ref="fileInputRef" id="image-upload" type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
        </div>
      </div>
      <div v-if="isLoading" class="flex justify-center items-center py-8 animate-fadeInUp">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
      <div v-if="errorMsg" class="text-center text-red-400 mb-4 animate-fadeInUp">{{ errorMsg }}</div>
      <transition name="fade-scale" appear>
        <div v-if="analysisResults" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-2 animate-fadeInUp">
          <Card class="col-span-1 md:col-span-2 mb-2 animate-fade-in">
            <h3 class="text-lg sm:text-xl font-semibold text-blue-200 mb-2">AI Probability</h3>
            <div class="w-full bg-[#16243a] rounded-full h-4 flex items-center relative overflow-hidden">
              <div
                class="h-4 rounded-full transition-all duration-700 ease-in-out shadow-md bg-green-400"
                :style="{ width: `${analysisResults.ai_probability}%` }"
              ></div>
              <span
                class="absolute right-3 text-xs font-semibold text-white/80 drop-shadow-sm select-none"
                v-if="analysisResults.ai_probability >= 95"
              >!</span>
            </div>
            <p class="mt-2 text-sm text-slate-400">{{ (analysisResults.ai_probability).toFixed(1) }}% probability of being AI-generated</p>
          </Card>
          <Card class="animate-fade-in">
            <h3 class="text-base sm:text-lg font-semibold text-blue-200 mb-2">Visual Clues</h3>
            <ul class="space-y-2">
              <li v-for="(clue, index) in analysisResults.visual_clues" :key="index" class="flex items-start gap-2 text-slate-300 text-sm sm:text-base">
                <span class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 sm:mt-2"></span>
                <span>{{ clue }}</span>
              </li>
            </ul>
          </Card>
          <Card class="animate-fade-in">
            <h3 class="text-base sm:text-lg font-semibold text-blue-200 mb-2">Spectral Analysis</h3>
            <ul class="space-y-2">
              <li v-for="(clue, index) in analysisResults.spectral_clues" :key="index" class="flex items-start gap-2 text-slate-300 text-sm sm:text-base">
                <span class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 sm:mt-2"></span>
                <span>{{ clue }}</span>
              </li>
            </ul>
          </Card>
          <Card class="animate-fade-in">
            <h3 class="text-base sm:text-lg font-semibold text-blue-200 mb-2">Metadata Analysis</h3>
            <ul class="space-y-2">
              <li v-for="(clue, index) in analysisResults.metadata_clues" :key="index" class="flex items-start gap-2 text-slate-300 text-sm sm:text-base">
                <span class="w-2 h-2 rounded-full bg-blue-400 mt-1.5 sm:mt-2"></span>
                <span>{{ clue }}</span>
              </li>
            </ul>
          </Card>
          <Card class="flex flex-col justify-between animate-fade-in">
            <h3 class="text-base sm:text-lg font-semibold text-blue-200 mb-2">Final Verdict</h3>
            <p class="text-base font-medium mb-2" :class="getVerdictColorClass(analysisResults.verdict)">{{ analysisResults.verdict }}</p>
            <p class="text-slate-300 mb-2 text-sm sm:text-base">{{ analysisResults.justification }}</p>
            <p class="text-slate-300 text-sm sm:text-base">{{ analysisResults.recommendation }}</p>
          </Card>
        </div>
      </transition>
    </div>
    <div class="mt-12 max-w-2xl mx-auto px-4 sm:px-0">
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-xl border border-cyan-400/20 p-6 sm:p-8 mb-8 flex flex-col items-start">
        <div class="flex items-center mb-4">
          <svg class="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 class="text-xl sm:text-2xl font-bold text-white">Image Analysis</h2>
        </div>
        <p class="text-slate-200 mb-3 text-base">Verify if an image is real or artificially generated. Upload any photo or screenshot and TruthLens will evaluate:</p>
        <ul class="list-disc list-inside text-slate-300 mb-3 text-base">
          <li>AI-generated imagery and deepfake probability</li>
          <li>Digital tampering and manipulation clues</li>
          <li>Metadata integrity and visual anomalies</li>
        </ul>
        <p class="text-slate-200 text-base">The tool provides a confidence score and a transparent breakdown of authenticity risks.</p>
      </div>
    </div>
    
    <ChatBot v-if="!isMobile" />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
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
</style> 