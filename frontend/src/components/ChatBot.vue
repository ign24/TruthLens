<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { getApiUrl, checkApiHealth, CHAT_CONFIG, convertBiasToFloat, convertEmotionalToneToFloat, checkMobile as checkMobileConfig } from '../config'

const props = defineProps({
  articleText: {
    type: String,
    required: true
  },
  analysisResult: {
    type: Object,
    required: false,
    default: null,
    validator: (value) => {
      if (!value) return true;
      return ['factual_accuracy', 'bias', 'emotional_tone', 'recommendation'].every(
        key => key in value
      );
    }
  },
  standalone: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// State
const isOpen = ref(false)
const messages = ref([])
const userInput = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const messagesContainer = ref(null)
const inputRef = ref(null)
const isMobile = ref(false)
const isApiHealthy = ref(true)
const retryCount = ref(0)

// Store original body overflow to restore it later
const originalBodyOverflow = ref('')

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = checkMobileConfig()
}

// Scroll lock management
const lockScroll = () => {
  if (isMobile.value && !props.standalone) {
    originalBodyOverflow.value = document.body.style.overflow || ''
    document.body.style.overflow = 'hidden'
  }
}

const unlockScroll = () => {
  if (isMobile.value && !props.standalone) {
    document.body.style.overflow = originalBodyOverflow.value
  }
}

// Lifecycle hooks
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Store original overflow value
  originalBodyOverflow.value = document.body.style.overflow || ''
  
  // Check API health
  isApiHealthy.value = await checkApiHealth()
  if (!isApiHealthy.value) {
    messages.value.push({
      role: 'assistant',
      content: 'We\'re having trouble connecting to our servers. Please try again in a moment.'
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  // Always restore scroll when component unmounts
  unlockScroll()
})

// Computed
const chatContainerClass = computed(() => ({
  'translate-y-0 opacity-100 scale-100 rotate-0': isOpen.value,
  'translate-y-full opacity-0 scale-95 rotate-1 pointer-events-none': !isOpen.value
}))

// Methods
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    lockScroll()
    nextTick(() => {
      handleInputFocus()
    })
  } else {
    unlockScroll()
    emit('close')
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    })
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  try {
    // Check API health before sending message
    if (!isApiHealthy.value) {
      isApiHealthy.value = await checkApiHealth()
      if (!isApiHealthy.value) {
        if (retryCount.value < CHAT_CONFIG.MAX_RETRIES) {
          retryCount.value++
          messages.value.push({
            role: 'assistant',
            content: `Warning: Retrying server connection (attempt ${retryCount.value}/${CHAT_CONFIG.MAX_RETRIES})...`
          })
          await new Promise(resolve => setTimeout(resolve, CHAT_CONFIG.RETRY_DELAY))
          return sendMessage()
        } else {
          retryCount.value = 0
          throw new Error('Unable to connect to the server after several attempts. Please verify that the server is running.')
        }
      }
      retryCount.value = 0
    }

    isLoading.value = true;
    isTyping.value = true;

    const newMessage = {
      role: 'user',
      content: userInput.value
    };

    messages.value.push(newMessage);
    const currentInput = userInput.value;
    userInput.value = '';
    scrollToBottom();

    console.log('Sending message to:', getApiUrl('CHAT'));
    console.log('Request payload:', {
      messages: messages.value,
      article_text: props.articleText || undefined,
      analysis_result: props.analysisResult || undefined
    });

    const response = await fetch(getApiUrl('CHAT'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.value,
        article_text: props.articleText || undefined,
        analysis_result: props.analysisResult || undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Server response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      if (response.status === 404) {
        throw new Error('Chat endpoint is not available. Please verify server configuration.');
      } else if (response.status === 503) {
        isApiHealthy.value = false;
        throw new Error('Server is temporarily unavailable. Please try again later.');
      } else {
        throw new Error(`Error communicating with server: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log('Server response:', data);

    messages.value.push({
      role: 'assistant',
      content: data.response || (data.message && data.message.content) || 'Error: No response from backend'
    });
    scrollToBottom();
    
    // Ensure input maintains focus after sending message
    nextTick(() => {
      handleInputFocus();
    });
  } catch (error) {
    console.error('Error details:', error);
    messages.value.push({
      role: 'assistant',
      content: `Sorry, there was an error processing your message: ${error.message}. Please try again.`
    });
    // Ensure input maintains focus even after an error
    nextTick(() => {
      handleInputFocus();
    });
  } finally {
    isLoading.value = false;
    isTyping.value = false;
  }
};

const sendMessageWithWebSearch = async () => {
  if (!userInput.value.trim()) return;

  try {
    isLoading.value = true;
    isTyping.value = true;

    const newMessage = {
      role: 'user',
      content: userInput.value
    };

    messages.value.push(newMessage);
    const currentInput = userInput.value;
    userInput.value = '';
    scrollToBottom();

    const response = await fetch(getApiUrl('CHAT'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value,
        article_text: props.articleText || undefined,
        analysis_result: props.analysisResult || undefined,
        use_web_search: true
      })
    });

    const data = await response.json();
    messages.value.push({
      role: 'assistant',
      content: data.response || (data.message && data.message.content) || 'Error: No response from backend'
    });
    scrollToBottom();
    nextTick(() => handleInputFocus());
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: `Sorry, there was an error processing your message: ${error.message}. Please try again.`
    });
    nextTick(() => handleInputFocus());
  } finally {
    isLoading.value = false;
    isTyping.value = false;
  }
};

function handleQuickPrompt(prompt) {
  userInput.value = prompt.value;
  nextTick(() => {
    handleInputFocus();
  });
}

// Watch for changes in articleText and analysisResult
watch(() => props.articleText, (newText) => {
  console.log('📄 Article updated:', newText ? 'Present' : 'Absent')
}, { immediate: true })

watch(() => props.analysisResult, (newResult) => {
  console.log('📊 Analysis updated:', newResult ? 'Present' : 'Absent')
}, { immediate: true })

// Watch for new messages to scroll
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// Watch for mobile state changes to handle scroll lock
watch(isMobile, (newIsMobile) => {
  if (!newIsMobile && isOpen.value) {
    // If switching from mobile to desktop while chat is open, unlock scroll
    unlockScroll()
  } else if (newIsMobile && isOpen.value) {
    // If switching from desktop to mobile while chat is open, lock scroll
    lockScroll()
  }
})

// Animation methods
const onEnter = (el) => {
  el.style.transform = 'translateY(20px) scale(0.98)'
  el.style.opacity = '0'
  el.style.filter = 'blur(4px)'
  
  requestAnimationFrame(() => {
    el.style.transition = 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform = 'translateY(0) scale(1)'
    el.style.opacity = '1'
    el.style.filter = 'blur(0px)'
  })
}

const onLeave = (el, done) => {
  el.style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)'
  el.style.transform = 'translateY(20px) scale(0.98)'
  el.style.opacity = '0'
  el.style.filter = 'blur(4px)'
  
  el.addEventListener('transitionend', done, { once: true })
}

function linkify(text) {
  // Detect URLs and convert them to clickable links
  return text.replace(
    /(https?:\/\/[^\s)]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="underline text-blue-300 hover:text-blue-400 break-all">$1</a>'
  );
}

// Add method to handle input focus
const handleInputFocus = () => {
  if (inputRef.value) {
    inputRef.value.focus()
    // Ensure cursor is at the end of the input
    const length = inputRef.value.value.length
    inputRef.value.setSelectionRange(length, length)
  }
}
</script>

<template>
  <div :class="[
    standalone ? 'w-full h-full' : (isOpen ? 'fixed bottom-4 z-30' : 'fixed bottom-4 right-4 z-5')
  ]">
    <!-- Toggle Button (only if not standalone) -->
    <button
      v-if="!standalone && !isOpen"
      @click="toggleChat"
      class="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full p-3 md:p-4 shadow-lg transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 chat-button touch-manipulation"
      :aria-label="'Open chat'"
      style="position: absolute; bottom: 0; right: 0; margin: 0 0 0 0;"
    >
      <div class="chat-button-glow"></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 md:h-7 md:w-7 chat-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>

    <!-- Chat Window -->
    <transition
      name="chat"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="standalone || isOpen"
        :class="[
          standalone
            ? 'w-full h-full bg-transparent border-none shadow-none rounded-none flex flex-col'
            : 'w-full h-full md:w-[450px] md:h-[600px] md:bottom-8 md:right-8 md:fixed bg-slate-900/80 backdrop-blur-md rounded-none md:rounded-2xl shadow-2xl border border-white/10 flex flex-col'
        ]"
        role="dialog"
        aria-modal="true"
        aria-label="Chat de TruthLens"
      >
        <!-- Header (solo si no es standalone) -->
        <div v-if="!standalone" class="flex-none w-full h-16 border-b border-white/10 bg-slate-800/95 flex items-center py-2 rounded-t-2xl shadow-md">
          <div class="flex items-center justify-between w-full px-6">
            <div class="flex items-center space-x-1">
              <h3 class="text-white text-base font-display font-semibold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent header-inset-title">TruthLens Assistant</h3>
            </div>
            <button
              @click="toggleChat"
              class="close-btn-inset text-blue-200/80 hover:text-white transition-colors p-2 rounded-lg touch-manipulation"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="close-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mensajes -->
        <div
          ref="messagesContainer"
          :class="[
            'flex-1 overflow-y-auto space-y-3 scroll-smooth',
            standalone ? 'min-h-[390px] md:min-h-[300px] bg-slate-900/95 rounded-2xl p-6 md:p-8' : 'px-6 py-6 bg-slate-900/95'
          ]"
          role="log"
          aria-live="polite"
        >
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="[
              'flex w-full',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="{
                'bg-gradient-to-b from-blue-600/10 to-blue-700/10 border border-blue-500/10 shadow-inner user-bubble': message.role === 'user',
                'bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-white/5 shadow-inner assistant-bubble': message.role === 'assistant',
                'bg-gradient-to-b from-red-900/20 to-red-800/20 border border-red-500/10 shadow-inner': message.role === 'assistant' && message.content.includes('Error')
              }"
              class="max-w-[85%] md:max-w-[80%] rounded-2xl p-4 text-white animate-fade-in text-sm leading-relaxed flex items-center"
              :role="message.role === 'user' ? 'status' : 'alert'"
            >
              <template v-if="message.role === 'assistant'">
                <span class="mr-2" aria-label="Asistente">
                  <svg xmlns="http://www.w3.org/2000/svg" class="msg-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="4" y="8" width="16" height="10" rx="4" stroke-width="2" stroke="currentColor" fill="none"/>
                    <circle cx="9" cy="13" r="1" fill="currentColor"/>
                    <circle cx="15" cy="13" r="1" fill="currentColor"/>
                    <path stroke-linecap="round" stroke-width="2" stroke="currentColor" d="M12 8V4m-6 4V6m12 2V6"/>
                  </svg>
                </span>
                <div
                  class="whitespace-pre-wrap"
                  v-html="linkify(
                    message.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n/g, '<br>')
                  )"
                ></div>
              </template>
              <template v-else>
                <div class="whitespace-pre-wrap" v-html="message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/\n/g, '<br>')"></div>
                <span class="ml-2" aria-label="Usuario">
                  <svg xmlns="http://www.w3.org/2000/svg" class="msg-svg-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/>
                  </svg>
                </span>
              </template>
            </div>
          </div>
          <div
            v-if="isTyping"
            class="flex justify-center items-center space-x-2 bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-white/5 rounded-2xl p-2 shadow-inner min-w-[3.5rem] max-w-[5rem] w-fit self-start">
            <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <slot />
        </div>

        <!-- Quick prompts below, outside the messages area, only in standalone mode -->
        <div v-if="standalone" class="w-full flex gap-2 justify-center items-center px-4 pb-2 mt-2">
          <button
            v-for="prompt in CHAT_CONFIG.QUICK_PROMPTS"
            :key="prompt.label"
            @click="handleQuickPrompt(prompt)"
            class="flex items-center gap-2 px-3 py-3 rounded-lg border border-cyan-400/20 bg-slate-800/80 text-sm font-medium text-white shadow hover:bg-slate-800/95 hover:border-cyan-400/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex-1 min-w-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-cyan-400 hidden sm:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span>{{ prompt.label }}</span>
          </button>
        </div>

        <!-- Input Area -->
        <div
          class="flex-none w-full px-4 py-3 bg-gradient-to-r from-slate-800/95 to-slate-700/95 border-t border-white/10 flex items-center rounded-b-none md:rounded-b-2xl shadow-lg"
        >
          <form @submit.prevent="sendMessage" class="flex flex-wrap sm:flex-nowrap w-full items-center gap-2">
            <input
              ref="inputRef"
              v-model="userInput"
              type="text"
              placeholder="Type your message or question here..."
              class="flex-1 bg-slate-800/80 text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-cyan-400/40 border border-cyan-400/15 placeholder-blue-200/60 transition-all duration-200 hover:border-cyan-400/25 h-12 shadow-sm chat-input"
              :disabled="isLoading"
              @focus="handleInputFocus"
              aria-label="Message"
              autocomplete="off"
            />
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                :disabled="isLoading || !userInput.trim()"
                class="btn-inset flex flex-col items-center justify-center w-full sm:w-auto"
                aria-label="Send message"
                title="Send"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
                </svg>
                <span class="text-xs mt-1 block md:hidden">Send</span>
              </button>
              <button
                type="button"
                @click="sendMessageWithWebSearch"
                :disabled="isLoading || !userInput.trim()"
                class="btn-inset flex flex-col items-center justify-center w-full sm:w-auto"
                aria-label="Verify with sources"
                title="Verify with sources from the web"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="text-xs mt-1 block md:hidden">Verify</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
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

.delay-100 {
  animation-delay: 150ms;
}

.delay-200 {
  animation-delay: 300ms;
}

/* Animaciones mejoradas para el chat */
.transform-gpu {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform, opacity;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-95 {
  transform: scale(0.95);
}

.scale-100 {
  transform: scale(1);
}

.rotate-0 {
  transform: rotate(0deg);
}

.rotate-1 {
  transform: rotate(1deg);
}

/* Chat transition styles */
.chat-enter-active,
.chat-leave-active {
  transition: all 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  filter: blur(4px);
}

.chat-enter-to,
.chat-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
}

/* Improved button animation */
button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

button:active {
  transform: scale(0.98);
}

/* Chat icon animation */
.chat-icon-button {
  animation: pulse-shadow 6s cubic-bezier(0.4, 0, 0.6, -0.56) infinite;
  position: relative;
  overflow: hidden;
}

.chat-icon-button::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(6, 182, 212, 0.15) 0%,
    rgba(59, 130, 246, 0.1) 25%,
    rgba(6, 182, 212, 0.05) 50%,
    transparent 70%
  );
  animation: rotate-gradient 8s linear infinite;
  z-index: -1;
}

.chat-icon {
  animation: icon-bounce 8s cubic-bezier(0.36, 0, 0.66, -0.56) infinite;
  transform-origin: center;
}

@keyframes icon-bounce {
  0%, 10% {
    transform: translateY(0) scale(1);
  }
  20% {
    transform: translateY(-3px) scale(1.02);
  }
  30%, 40% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(1px) scale(0.98);
  }
  60%, 70% {
    transform: translateY(0) scale(1);
  }
  80% {
    transform: translateY(-2px) scale(1.01);
  }
  90%, 100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes rotate-gradient {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse-shadow {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
  }
  50% {
    box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
  }
}

.chat-button {
  position: relative;
  overflow: visible;
  isolation: isolate;
  background: linear-gradient(
    135deg,
    #0ea5e9 0%,
    #3b82f6 50%,
    #0ea5e9 100%
  );
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.2);
}

.chat-button-glow {
  position: absolute;
  inset: -12px;
  background: radial-gradient(
    circle at center,
    rgba(14, 165, 233, 0.5) 0%,
    rgba(59, 130, 246, 0.4) 20%,
    rgba(99, 102, 241, 0.3) 40%,
    rgba(139, 92, 246, 0.2) 60%,
    rgba(99, 102, 241, 0.3) 80%,
    rgba(59, 130, 246, 0.4) 100%
  );
  z-index: -1;
  border-radius: inherit;
  filter: blur(12px);
  box-shadow: 
    0 0 30px rgba(14, 165, 233, 0.3),
    0 0 60px rgba(99, 102, 241, 0.2),
    0 0 90px rgba(139, 92, 246, 0.15);
  transform-origin: center;
}

/* Estilos para el texto formateado */
:deep(strong) {
  font-weight: 600;
  color: #93c5fd;
}

:deep(em) {
  font-style: italic;
  color: #f0f9ff;
}

:deep(br) {
  content: "";
  display: block;
  margin: 0.25em 0;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
  /* Chat window ocupa toda la pantalla */
  .w-full.h-full.md\:w-\[450px\].md\:h-\[600px\].md\:bottom-8.md\:right-8.md\:fixed {
    width: 100vw !important;
    max-width: 100vw !important;
    height: calc(100vh - 120px) !important;
    max-height: calc(100vh - 120px) !important;
    border-radius: 0 !important;
    left: 0 !important;
    right: 0 !important;
    top: 120px !important;
    bottom: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    margin-top: 0 !important;
    z-index: 1050 !important;
  }

  /* Contenedor principal ocupa toda la pantalla y z-index alto */
  .fixed.bottom-4.z-10,
  .fixed.bottom-4.right-4.z-30 {
    width: 100vw !important;
    height: calc(100vh - 120px) !important;
    left: 0 !important;
    right: 0 !important;
    top: 120px !important;
    bottom: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    z-index: 1050 !important;
  }

  /* Header sticky arriba con z-index aún mayor */
  .flex-none.w-full.h-16 {
    position: sticky;
    top: 0;
    z-index: 1100 !important;
    border-radius: 0 !important;
    background: linear-gradient(to right, #0f172a 90%, #1e293b 100%) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Contenedor standalone también ajustado */
  .w-full.h-full.bg-transparent.border-none.shadow-none.rounded-none.flex.flex-col {
    height: calc(100vh - 120px) !important;
    max-height: calc(100vh - 120px) !important;
    margin-top: 120px !important;
    z-index: 1050 !important;
  }

  /* Más espacio para el primer mensaje en mobile */
  .overflow-y-auto > div:first-child {
    margin-top: 2.2rem !important;
  }

  /* Igualar tamaño de fuente y padding en mensajes de usuario y asistente */
  .user-bubble,
  .assistant-bubble {
    font-size: 1.05rem !important;
    padding: 1rem 1.2rem !important;
    border-radius: 1.3rem !important;
    max-width: 90vw !important;
  }

  /* Mensajes más grandes y espaciados */
  .space-y-3 > * + * {
    margin-top: 1.1rem !important;
  }
  .ml-auto, .bg-gradient-to-b.from-slate-800\/80 {
    font-size: 1.05rem !important;
    padding: 1rem 1.2rem !important;
    border-radius: 1.3rem !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    max-width: 90vw !important;
  }

  /* Input fijo abajo */
  .flex-none.w-full.h-20 {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    background: linear-gradient(to right, #0f172a 90%, #1e293b 100%) !important;
    border-radius: 0 !important;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.12);
    padding: 0.5rem 1rem !important;
    height: 4.5rem !important;
    min-height: 4.5rem !important;
  }
  .flex.items-center.space-x-3.w-full {
    gap: 0.5rem !important;
  }
  input {
    font-size: 0.89rem !important;
    padding: 0.9rem 1rem !important;
    border-radius: 1.1rem !important;
  }
  button[type="submit"] {
    padding: 0.9rem 1.1rem !important;
    font-size: 1.2rem !important;
    border-radius: 1.1rem !important;
  }

  /* Mejorar scroll */
  .overflow-y-auto {
    scroll-behavior: smooth !important;
    padding-bottom: 6rem !important;
  }

  /* Transiciones más rápidas */
  .chat-enter-active,
  .chat-leave-active {
    transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
}

/* Safe area insets for modern mobile browsers */
@supports (padding: max(0px)) {
  .fixed {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
    padding-right: max(1rem, env(safe-area-inset-right));
  }
}

/* Fix for mobile header */
@media (max-width: 768px) {
  .fixed.inset-0 {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

/* Improved animations for mobile */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .chat-enter-active,
  .chat-leave-active,
  .chat-button,
  .chat-icon {
    animation: none !important;
    transition: none !important;
  }
}

/* 3D Chat Window Effect */
.chat-window-3d {
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 0 0 1px rgba(0, 0, 0, 0.1) inset;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chat-window-3d:hover {
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(10px);
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 25px 30px -5px rgba(0, 0, 0, 0.4),
    0 15px 15px -5px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    0 0 0 1px rgba(0, 0, 0, 0.1) inset;
}

/* Improved animations */
.chat-enter-active,
.chat-leave-active {
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
  filter: blur(2px);
}

.chat-enter-to,
.chat-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
}

/* Improved message animations */
.animate-fade-in {
  animation: fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Improved button styles */
.chat-button {
  position: relative;
  overflow: visible;
  isolation: isolate;
  background: linear-gradient(
    135deg,
    #0ea5e9 0%,
    #3b82f6 50%,
    #0ea5e9 100%
  );
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.2);
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

/* Improved text formatting */
:deep(strong) {
  font-weight: 600;
  color: #93c5fd;
}

:deep(em) {
  font-style: italic;
  color: #f0f9ff;
}

:deep(br) {
  content: "";
  display: block;
  margin: 0.25em 0;
}

/* Fix for header alignment */
.flex-none {
  width: 100%;
  max-width: 100%;
}

.flex-none > div {
  width: 100%;
  max-width: 100%;
}

/* Ensure header content extends fully */
.flex-none > div > div {
  width: auto;
  min-width: fit-content;
}

/* Chat window container styles */
.chat-window-3d {
  width: 100%;
  max-width: 100%;
  height: 100%;
  right: 0;
  left: auto;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .chat-window-3d {
    width: 450px;
    max-width: 450px;
    height: 600px;
    right: 1.5rem;
    bottom: 8rem;
    left: auto;
    box-sizing: border-box;
  }
}

/* Standardized header height */
.flex-none.h-14 {
  min-height: 3.5rem;
}

/* Standardized input area height */
.flex-none.h-16 {
  min-height: 4rem;
}

/* Improved message spacing */
.space-y-3 > * + * {
  margin-top: 0.75rem;
}

/* Standardized button sizes */
button {
  min-height: 2.5rem;
  min-width: 2.5rem;
}

/* Standardized input height */
input {
  min-height: 2.5rem;
}

/* Improved input styles */
input {
  min-height: 56px;
  padding: 1rem 1.25rem;
  font-size: 0.93rem;
  line-height: 1.5;
  -webkit-appearance: none;
  appearance: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  button {
    min-height: 56px;
    min-width: 56px;
  }

  input {
    min-height: 56px;
    font-size: 0.89rem;
  }

  .chat-button {
    padding: 1rem;
  }

  .chat-icon {
    width: 1.75rem;
    height: 1.75rem;
  }
}

/* Improved touch feedback */
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Improved button animations */
.chat-button {
  position: relative;
  overflow: visible;
  isolation: isolate;
  background: linear-gradient(
    135deg,
    #0ea5e9 0%,
    #3b82f6 50%,
    #0ea5e9 100%
  );
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.2);
}

.chat-button:active {
  transform: scale(0.95);
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Add inset shadow styles */
.shadow-inner {
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 -1px 2px rgba(255, 255, 255, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Message hover effect */
.max-w-\[85\%\]:hover {
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.15),
    inset 0 -1px 2px rgba(255, 255, 255, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.15);
}

/* User message specific styles */
.ml-auto {
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.99));
  box-shadow: 
    inset 0 4px 8px rgba(0, 0, 0, 0.4),
    inset 0 -2px 4px rgba(255, 255, 255, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transform: translateY(1px);
}

.ml-auto:hover {
  box-shadow: 
    inset 0 4px 8px rgba(0, 0, 0, 0.5),
    inset 0 -2px 4px rgba(255, 255, 255, 0.03),
    0 2px 4px rgba(0, 0, 0, 0.25);
  transform: translateY(1px);
}

/* Assistant message specific styles */
.bg-gradient-to-b.from-slate-800\/80 {
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 -1px 2px rgba(255, 255, 255, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.15);
}

/* Error message specific styles */
.bg-gradient-to-b.from-red-900\/20 {
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 -1px 2px rgba(255, 255, 255, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.15);
}

.header-inset-title {
  background: linear-gradient(135deg, #0f172a 80%, #1e293b 100%);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(255,255,255,0.04);
  border-radius: 0.9rem;
  padding: 0.35rem 1.1rem;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* Ajustes de burbujas para alineación */
.user-bubble {
  margin-left: auto;
}
.assistant-bubble {
  margin-right: auto;
}

/* Icono SVG profesional para mensajes */
.msg-svg-icon {
  width: 1.5em;
  height: 1.5em;
  opacity: 0.85;
  color: #60a5fa;
  vertical-align: middle;
  display: inline-block;
}

/* Icono SVG profesional y fino para cerrar */
.close-svg-icon {
  width: 1em;
  height: 1em;
  color: #a5b4fc;
  opacity: 0.82;
  vertical-align: middle;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  stroke-width: 1.5;
  transform-origin: center;
}
.close-svg-icon:hover {
  color: #fff;
  opacity: 1;
  transform: rotate(90deg) scale(1.1);
}

/* Botón de cerrar con efecto hundido (inset) */
.close-btn-inset {
  background: linear-gradient(135deg, #181f2e 80%, #232a3b 100%);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.32), inset 0 -1px 2px rgba(255,255,255,0.04);
  border-radius: 0.9rem;
  border: 1.5px solid rgba(80,100,160,0.13);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 0.35rem 0.35rem;
  transform-origin: center;
}
.close-btn-inset:hover {
  background: linear-gradient(135deg, #232a3b 90%, #181f2e 100%);
  box-shadow: inset 0 3px 12px rgba(0,0,0,0.38), 0 1px 4px rgba(80,100,160,0.10);
  transform: scale(1.1);
}

.btn-inset {
  background: linear-gradient(135deg, #181f2e 80%, #232a3b 100%);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.32), inset 0 -1px 2px rgba(255,255,255,0.04);
  border-radius: 0.9rem;
  border: 1.5px solid rgba(80,100,160,0.13);
  padding: 0.5rem 0.7rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  color: #a5b4fc;
  opacity: 0.92;
  font-size: 1.1rem;
  cursor: pointer;
}
.btn-inset:hover {
  background: linear-gradient(135deg, #232a3b 90%, #181f2e 100%);
  box-shadow: 0 1px 8px 0 #60a5fa33, 0 0px 0px 0 #fff, inset 0 3px 12px rgba(0,0,0,0.38);
  color: #fff;
  opacity: 1;
  transform: scale(1.08);
}
.btn-inset:active {
  background: linear-gradient(135deg, #232a3b 90%, #181f2e 100%);
  box-shadow: inset 0 3px 12px rgba(0,0,0,0.38), 0 1px 4px rgba(80,100,160,0.10);
  transform: scale(0.96);
  color: #fff;
  opacity: 1;
}
.btn-inset:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.max-w-\[85\%\], .max-w-\[80\%\], .assistant-bubble, .user-bubble {
  word-break: break-word;
  overflow-wrap: anywhere;
}
.sources-checked, .sources-list, .sources-urls {
  word-break: break-all;
  overflow-wrap: anywhere;
  font-size: 0.97em;
  color: #a5b4fc;
}

/* Refined chat input styles */
.chat-input {
  transition: all 0.2s ease;
  background: rgba(30, 41, 59, 0.95);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
}

.chat-input:focus {
  background: rgba(30, 41, 59, 0.98);
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.15),
    0 0 0 2px rgba(56, 189, 248, 0.15);
}

.chat-input:hover:not(:focus) {
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15);
}

/* Mobile optimizations for chat input */
@media (max-width: 768px) {
  .chat-input {
    font-size: 0.95rem;
    padding: 0.85rem 1rem;
    border-radius: 1rem;
  }
  
  .chat-input:focus {
    box-shadow: 
      inset 0 1px 2px rgba(0, 0, 0, 0.15),
      0 0 0 2px rgba(56, 189, 248, 0.12);
  }
}

/* Equalize font size and padding in user and assistant messages */
.user-bubble, .assistant-bubble {
  font-size: 0.875rem;
  padding: 1rem;
}

/* Larger and more spaced messages */
@media (min-width: 768px) {
  .user-bubble, .assistant-bubble {
    font-size: 1rem;
    padding: 1.25rem;
  }
}

/* Professional SVG icon for messages */
.chat-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
</style>