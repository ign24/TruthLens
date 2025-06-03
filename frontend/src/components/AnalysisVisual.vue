<template>
    <div class="space-y-4 text-white group">
        <div class="mt-6 p-6 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-white/10 
                    shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)]
                    text-white space-y-3 relative group">
            <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none"></div>
            
            <!-- Analysis blocks -->
            <div class="space-y-4">
                <TransitionGroup 
                    name="block"
                    tag="div"
                    class="space-y-4"
                >
                    <div v-for="(block, index) in props.blocks" :key="index" 
                        :class="[
                            'p-4 rounded-lg border border-white/5 backdrop-blur-sm transition-all duration-300 ease-in-out',
                            'hover:scale-[1.01] hover:border-white/10 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.15)]',
                            'group/block relative',
                            'bg-slate-900/95 text-white'
                        ]" 
                        :style="{ animationDelay: `${index * 100}ms` }">
                        
                        <!-- Bias Type Header -->
                        <div class="flex items-center gap-2 mb-2 group/bias">
                            <span class="font-semibold text-blue-300 transition-colors duration-300 group-hover/bias:text-blue-200">Predominant Style:</span>
                            <span class="text-white/90 transition-all duration-300 group-hover/bias:text-white group-hover/bias:translate-x-1">
                                {{ getDominantStyle(block.style_distribution) }}
                            </span>
                        </div>

                        <!-- Heatmap de estilo narrativo -->
                        <div class="flex flex-col gap-2 mb-4">
                            <div class="flex h-4 w-full rounded-full overflow-hidden bg-slate-900/20 backdrop-blur-sm border border-white/5
                                      group/heatmap hover:border-white/10 transition-all duration-300">
                                <div
                                    v-for="(value, style, index) in block.style_distribution"
                                    :key="style"
                                    :style="{ 
                                        width: (value * 100) + '%',
                                        marginLeft: index === 0 ? '0' : '-1px'
                                    }"
                                    :class="[
                                        styleColorClass(style),
                                        'transition-all duration-500 ease-in-out relative group/segment'
                                    ]"
                                    class="h-full">
                                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                                              opacity-0 group-hover/segment:opacity-100 transition-opacity duration-300"></div>
                                    <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                                </div>
                            </div>
                            <!-- Debug info -->
                            <div class="flex justify-between text-xs text-slate-400/80">
                                <div v-for="(value, style) in block.style_distribution" 
                                    :key="style"
                                    class="flex items-center gap-1.5 group/indicator"
                                >
                                    <div class="w-2 h-2 rounded-full transition-all duration-300 
                                              group-hover/indicator:scale-125 group-hover/indicator:ring-2"
                                        :class="[styleColorClass(style), 'ring-1 ring-white/10']"
                                    />
                                    <span class="transition-all duration-300 group-hover/indicator:text-white/90 
                                               group-hover/indicator:translate-x-0.5">
                                        {{ style }}: {{ (value * 100).toFixed(0) }}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Analysis Details -->
                        <AnalysisDetails 
                            :article-type="block.article_type"
                            :sentiments="block.sentiments"
                        />
                    </div>
                </TransitionGroup>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AnalysisDetails from './AnalysisDetails.vue'

interface StyleDistribution {
    objective: number
    subjective: number
    speculative: number
    emotive: number
    clickbait: number
}

interface Block {
    style_distribution: StyleDistribution
    article_type?: {
        objective: number
        subjective: number
        speculative: number
        emotive: number
        clickbait: number
    }
    sentiments?: {
        joy: number
        trust: number
        fear: number
        surprise: number
        sadness: number
        disgust: number
        anger: number
        anticipation: number
    }
}

const props = defineProps<{
    blocks: Block[]
}>()

function getDominantStyle(distribution: StyleDistribution): string {
    return Object.entries(distribution).reduce((max, [style, value]) => 
        value > distribution[max as keyof StyleDistribution] ? style : max
    , Object.keys(distribution)[0])
}

function styleColorClass(style: string): string {
    return `bg-gradient-to-r ${style === 'objective' ? 'from-green-400 to-green-600' :
                                style === 'subjective' ? 'from-yellow-400 to-yellow-600' :
                                style === 'speculative' ? 'from-orange-400 to-orange-600' :
                                style === 'emotive' ? 'from-red-400 to-red-600' :
                                style === 'clickbait' ? 'from-purple-400 to-purple-600' : 'from-slate-400 to-slate-600'}`
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-highlight {
  animation: highlightPulse 2s ease-in-out infinite;
}

@keyframes highlightPulse {
  0%, 100% { background-color: rgba(129, 140, 248, 0.6); }
  50% { background-color: rgba(129, 140, 248, 0.8); }
}

.block-enter-active,
.block-leave-active {
  transition: all 0.5s ease;
}

.block-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.block-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.block-move {
  transition: transform 0.5s ease;
}

.group:hover .group\/block {
  transform: translateY(-2px);
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 