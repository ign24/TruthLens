<template>
    <!-- Container for article type and sentiment analysis details -->
    <div class="space-y-6">
        <!-- Article Type Analysis Section -->
        <div v-if="articleType" class="space-y-3">
            <div class="text-lg text-blue-300 font-semibold mb-1">Article Type Distribution</div>
            <div class="space-y-2">
                <div v-for="(value, type) in articleType" 
                     :key="type"
                     class="flex flex-col gap-1">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-300 capitalize">{{ type }}</span>
                        <span class="text-sm text-slate-400">{{ (value * 100).toFixed(0) }}%</span>
                    </div>
                    <!-- Progress bar for article type -->
                    <div class="h-2 w-full rounded-full bg-slate-800/20 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                             :class="getColor(type, 'gradient')"
                             :style="{ width: `${value * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sentiments Analysis Section -->
        <div v-if="sentiments" class="space-y-3">
            <div class="text-lg text-blue-300 font-semibold mb-1">Emotional Analysis</div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div v-for="(value, emotion) in sentiments" 
                     :key="emotion"
                     class="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-800/20 border border-white/5
                            hover:border-white/10 transition-all duration-300">
                    <span class="text-sm font-medium text-slate-200 capitalize">{{ emotion }}</span>
                    <!-- Progress bar for sentiment -->
                    <div class="w-full h-1.5 rounded-full bg-slate-800/20 overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500"
                             :class="getColor(emotion, 'gradient')"
                             :style="{ width: `${value * 100}%` }">
                        </div>
                    </div>
                    <span class="text-xs text-slate-400">{{ (value * 100).toFixed(0) }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    articleType?: {
        objective: number;
        subjective: number;
        speculative: number;
        emotive: number;
        clickbait: number;
    };
    sentiments?: {
        joy: number;
        trust: number;
        fear: number;
        surprise: number;
        sadness: number;
        disgust: number;
        anger: number;
        anticipation: number;
    };
}

defineProps<Props>();

const colorMap = {
    // Article Types
    objective: { gradient: 'bg-gradient-to-r from-green-400 to-green-600', bg: 'bg-green-400/10' },
    subjective: { gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600', bg: 'bg-yellow-400/10' },
    speculative: { gradient: 'bg-gradient-to-r from-orange-400 to-orange-600', bg: 'bg-orange-400/10' },
    emotive: { gradient: 'bg-gradient-to-r from-red-400 to-red-600', bg: 'bg-red-400/10' },
    clickbait: { gradient: 'bg-gradient-to-r from-purple-400 to-purple-600', bg: 'bg-purple-400/10' },
    // Emotions
    joy: { gradient: 'bg-gradient-to-r from-green-400 to-green-600', bg: 'bg-green-400/10' },
    trust: { gradient: 'bg-gradient-to-r from-blue-400 to-blue-600', bg: 'bg-blue-400/10' },
    fear: { gradient: 'bg-gradient-to-r from-purple-400 to-purple-600', bg: 'bg-purple-400/10' },
    surprise: { gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600', bg: 'bg-yellow-400/10' },
    sadness: { gradient: 'bg-gradient-to-r from-gray-400 to-gray-600', bg: 'bg-gray-400/10' },
    disgust: { gradient: 'bg-gradient-to-r from-red-400 to-red-600', bg: 'bg-red-400/10' },
    anger: { gradient: 'bg-gradient-to-r from-orange-400 to-orange-600', bg: 'bg-orange-400/10' },
    anticipation: { gradient: 'bg-gradient-to-r from-pink-400 to-pink-600', bg: 'bg-pink-400/10' }
} as const;

function getColor(key: string, type: 'gradient' | 'bg'): string {
    return colorMap[key as keyof typeof colorMap]?.[type] || 
           (type === 'gradient' ? 'bg-gradient-to-r from-slate-400 to-slate-600' : 'bg-slate-400/10');
}
</script> 