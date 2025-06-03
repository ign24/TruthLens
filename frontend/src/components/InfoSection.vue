<script setup lang="ts">
defineProps<{
  show: boolean
}>();
</script>

<template>
  <div v-if="show" class="w-full max-w-4xl mx-auto rounded-xl p-6">
    <h2 class="text-2xl font-bold text-blue-200 mb-4">How to Use TruthLens</h2>
    <p class="text-gray-300 mb-4">
      TruthLens is a tool designed to help you critically evaluate the credibility, tone, and bias of news articles using advanced AI analysis. Here's how to interpret the results and get the most out of the platform.
    </p>

    <div class="space-y-6">
      <section>
        <h3 class="text-xl font-semibold text-blue-200 mb-2">1. Input the Article Text</h3>
        <p class="text-gray-300">
          Paste the full text of a news article or opinion piece into the input field. Ensure the content is under 4,000 characters and represents a complete paragraph or excerpt.
        </p>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-blue-200 mb-2">2. Review the Key Metrics</h3>
        <p class="text-gray-300 mb-3">TruthLens will return a structured report including:</p>
        <ul class="space-y-3 text-gray-300">
          <li class="flex items-start">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2 mt-2"></span>
            <div>
              <strong>Fake News Percentage</strong>
              <p class="text-sm">An estimate of how much of the article relies on unverified or speculative claims. Higher values suggest the need for further verification.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2 mt-2"></span>
            <div>
              <strong>Political Bias</strong>
              <p class="text-sm">Identifies ideological framing (e.g., left, right, neutral) based on linguistic cues and topic framing.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2 mt-2"></span>
            <div>
              <strong>Emotional Tone</strong>
              <p class="text-sm">Detects if the language used is alarmist, neutral, or emotionally charged to influence perception.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2 mt-2"></span>
            <div>
              <strong>Reader Recommendation</strong>
              <p class="text-sm">Offers practical advice on how to approach the article (e.g., seek other sources, verify claims, etc.).</p>
            </div>
          </li>
        </ul>

        <div class="mt-4">
          <h4 class="text-lg font-semibold text-blue-200 mb-2">Narrative Style Classification</h4>
          <p class="text-gray-300 mb-2">Breaks down the article's composition:</p>
          <ul class="grid grid-cols-2 gap-2 text-gray-300">
            <li>• Objective: factual and neutral</li>
            <li>• Subjective: opinion-based</li>
            <li>• Speculative: forward-looking or uncertain</li>
            <li>• Emotive: designed to provoke emotion</li>
            <li>• Clickbait: exaggerated to attract attention</li>
          </ul>
        </div>

        <div class="mt-4">
          <h4 class="text-lg font-semibold text-blue-200 mb-2">Emotional Analysis</h4>
          <p class="text-gray-300">
            Evaluates the emotional undertones (e.g., fear, trust, anger) present in the article using psychological models.
          </p>
        </div>
      </section>

      <section>
        <h3 class="text-xl font-semibold text-blue-200 mb-2">3. Use the Interactive Chat</h3>
        <p class="text-gray-300 mb-2">After the analysis, you can ask the integrated AI chatbot questions like:</p>
        <ul class="space-y-2 text-gray-300">
          <li class="flex items-center">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
            "Why is the article considered speculative?"
          </li>
          <li class="flex items-center">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
            "What makes the tone alarmist?"
          </li>
          <li class="flex items-center">
            <span class="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
            "Can you give examples of political bias?"
          </li>
        </ul>
        <p class="text-gray-300 mt-2">
          The chatbot helps you interpret the results, offers context, and supports further research or comparison.
        </p>
      </section>

      <section class="bg-blue-900/30 p-4 rounded-lg">
        <h3 class="text-xl font-semibold text-blue-200 mb-2">Our Recommendation</h3>
        <p class="text-gray-300">
          TruthLens is an assistant, not an authority. Always compare multiple sources, check original references when possible, and apply critical thinking. Use the insights to inform—not replace—your judgment.
        </p>
      </section>
    </div>
  </div>
</template>