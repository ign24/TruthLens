<template>
    <!-- Main container for analysis visualization blocks -->
    <div class="space-y-4 text-white group">
        <div class="mt-6 p-6 rounded-xl bg-slate-900/95 backdrop-blur-sm border border-white/10 
                    shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.1)]
                    text-white space-y-3 relative group">
            <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-xl pointer-events-none"></div>
            
            <!-- Analysis blocks for each text segment -->
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
                        
                        <!-- DOCA Content & Framing Analysis Header (badge at end, tooltip on badge, no info icon) -->
                        <div class="mb-3 flex items-center gap-2">
                            <span class="text-lg text-blue-300 font-semibold">Content & Framing Analysis</span>
                            <span class="px-2 py-0.5 rounded-full bg-blue-800/80 text-blue-100 text-xs font-bold tracking-wide cursor-pointer" title="DOCA (Database of Variables for Content Analysis) identifies the main topic (what the article is about) and the narrative frames (how the topic is presented: e.g., as a crisis, conflict, or solution). Frames help reveal the perspectives or angles emphasized by the article. If no frames are detected, the article is presented in a neutral or unframed way.">DOCA</span>
                        </div>
                        <hr class="my-3 border-blue-900/40">
                        <!-- Topic Section -->
                        <div class="mb-2">
                            <div class="text-lg text-blue-300 font-semibold mb-1">Topic</div>
                            <div v-if="block.topic" class="flex items-center gap-2">
                                <span class="text-blue-200 text-sm font-medium">{{ block.topic }}</span>
                            </div>
                        </div>
                        <hr class="my-3 border-blue-900/20">
                        <!-- Frames Section -->
                        <div class="mb-2">
                            <div class="text-lg text-blue-300 font-semibold mb-1">Frames</div>
                            <div v-if="block.frames_detected && block.frames_detected.length && !(block.frames_detected.length === 1 && block.frames_detected[0] === 'none')" class="frames-chips">
                                <span v-for="frame in block.frames_detected" :key="frame" class="px-2 py-0.5 rounded-full bg-cyan-700/70 text-cyan-100 text-xs font-semibold capitalize cursor-pointer" :title="frameDescriptions[frame] || 'Detected narrative frame'">{{ frame.replace('_', ' ') }}</span>
                            </div>
                            <div v-else-if="block.frames_detected && block.frames_detected.length === 1 && block.frames_detected[0] === 'none'" class="text-xs text-blue-300/80 italic">
                                No prominent framing strategies were detected in this article.
                            </div>
                        </div>
                        <hr class="my-3 border-blue-900/20">

                        <!-- Bias Type Header -->
                        <div class="flex items-center gap-2 mb-2 group/bias">
                            <span class="text-lg font-semibold text-blue-300 transition-colors duration-300 group-hover/bias:text-blue-200">Predominant Style:</span>
                            <span class="text-white/90 transition-all duration-300 group-hover/bias:text-white group-hover/bias:translate-x-1">
                                {{ getDominantStyle(block.style_distribution) }}
                            </span>
                        </div>
                        
                        <hr class="my-3 border-blue-900/20">
                        <!-- Analysis details for article type and sentiments -->
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
    topic?: string
    frames_detected?: string[]
}

const props = defineProps<{
    blocks: Block[]
}>()

function getDominantStyle(distribution: StyleDistribution): string {
    return Object.entries(distribution).reduce((max, [style, value]) => 
        value > distribution[max as keyof StyleDistribution] ? style : max
    , Object.keys(distribution)[0])
}

const frameDescriptions: Record<string, string> = {
    crisis: 'Crisis: Presents the issue as urgent, alarming or escalating.',
    conflict: 'Conflict: Emphasizes disputes, confrontations, or disagreements.',
    human_interest: 'Human Interest: Highlights human impact or personal stories.',
    responsibility: 'Responsibility: Assigns responsibility or blame to specific actors.',
    morality: 'Morality: Appeals to ethical or moral values.',
    solution: 'Solution: Proposes or discusses solutions to the problem.',
    economic_consequences: 'Economic Consequences: Emphasizes financial impact.',
    security: 'Security: Focuses on risks or security threats.',
    none: 'No prominent framing strategies were detected.'
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

/* Frames chips responsive layout */
.frames-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
@media (max-width: 640px) {
  .frames-chips {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
  }
}
</style> 