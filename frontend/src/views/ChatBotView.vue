<template>
  <div class="min-h-screen flex flex-col text-white animate-fade-in-up">
    <div class="flex-1 flex flex-col md:justify-center items-center pt-16 md:pt-20 pb-12 md:pb-12 px-2 md:px-4">
      <div class="w-full max-w-4xl h-[80vh] max-h-[700px] bg-slate-800/90 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/10 flex flex-col">
        <h1 class="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">TruthLens Chat Assistant</h1>
        
        <!-- Messages -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto space-y-3 scroll-smooth px-2 sm:px-6 py-6 bg-slate-900/95 rounded-2xl"
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
                <span class="mr-2" aria-label="Assistant">
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
                <span class="ml-2" aria-label="User">
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
        </div>

        <!-- Quick prompts -->
        <div class="w-full flex flex-col sm:flex-row gap-2 justify-center items-center px-0 sm:px-4 pb-2 mt-2">
          <button
            v-for="prompt in CHAT_CONFIG.QUICK_PROMPTS"
            :key="prompt.label"
            @click="handleQuickPrompt(prompt)"
            class="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-lg border border-cyan-400/20 bg-slate-800/80 text-sm font-medium text-white shadow hover:bg-slate-800/95 hover:border-cyan-400/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex-1 min-w-0"
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
          class="flex-none w-full px-2 sm:px-4 py-3 bg-gradient-to-r from-slate-800/95 to-slate-700/95 border-t border-white/10 flex items-center rounded-b-2xl shadow-lg"
        >
          <form @submit.prevent="sendMessage" class="flex flex-col sm:flex-row w-full items-center gap-2">
            <input
              ref="inputRef"
              v-model="userInput"
              type="text"
              placeholder="Type your message or question here..."
              class="w-full flex-1 bg-slate-800/80 text-white rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-cyan-400/40 border border-cyan-400/15 placeholder-blue-200/60 transition-all duration-200 hover:border-cyan-400/25 h-12 shadow-sm chat-input"
              :disabled="isLoading"
              @focus="handleInputFocus"
              aria-label="Message"
              autocomplete="off"
            />
            <div class="flex gap-2 w-full sm:w-auto">
              <button
                type="submit"
                :disabled="isLoading || !userInput.trim()"
                class="btn-inset flex flex-col items-center justify-center flex-1"
                aria-label="Send message"
                title="Send"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
                </svg>
                <span class="text-xs mt-1">Send</span>
              </button>
              <button
                type="button"
                @click="sendMessageWithWebSearch"
                :disabled="isLoading || !userInput.trim()"
                class="btn-inset flex flex-col items-center justify-center flex-1"
                aria-label="Verify with sources"
                title="Verify with sources from the web"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="text-xs mt-1">Verify</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="mt-8 sm:mt-12 max-w-2xl mx-auto w-full px-4 sm:px-0">
      <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 rounded-2xl shadow-xl border border-cyan-400/20 p-6 sm:p-8 mb-8 flex flex-col items-start">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-cyan-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 class="text-xl sm:text-2xl font-bold text-white">TruthLens Assistant</h2>
        </div>
        <p class="text-slate-200 mb-3">Use this interactive space to chat directly with Clara. You can ask:</p>
        <ul class="list-disc list-inside text-slate-300 mb-3">
          <li>"Is this article biased?"</li>
          <li>"Was this image manipulated?"</li>
          <li>"Can you verify the source of this post?"</li>
        </ul>
        <p class="text-slate-200">Clara will deliver immediate and structured analysis using cutting-edge AI — empowering you to think for yourself.</p>
        <ul class="list-disc list-inside text-slate-400 mt-4 text-sm bg-slate-800/80 rounded-xl p-4 shadow-lg border border-cyan-400/20">
          <li class="flex items-center gap-3 mb-2">
            <button class="btn-inset flex items-center justify-center w-10 h-10 bg-slate-800 border border-cyan-400/40 rounded-lg mr-2 opacity-90 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
            <span class="font-semibold text-white/90"><strong>Send:</strong></span> Submit your message for standard analysis.</li>
          <li class="flex items-center gap-3">
            <button class="btn-inset flex items-center justify-center w-10 h-10 bg-slate-800 border border-cyan-400/40 rounded-lg mr-2 opacity-90 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <span class="font-semibold text-white/90"><strong>Verify with sources:</strong></span> Fact-check using live web search (RAG).</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { getApiUrl, checkApiHealth, CHAT_CONFIG, checkMobile as checkMobileConfig } from '../config'
import { useScrollLock } from '../composables/useScrollLock'

// Define message type
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// State
const messages = ref<ChatMessage[]>([])
const userInput = ref('')
const isLoading = ref(false)
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const isMobile = ref(false)
const isApiHealthy = ref(true)
const retryCount = ref(0)

// Scroll lock composable
const { cleanup } = useScrollLock()

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = checkMobileConfig()
}

// Lifecycle hooks
onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
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
  // Cleanup scroll lock when component unmounts
  cleanup()
})

const scrollToBottom = () => {
  if (messagesContainer.value) {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
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
          messages.value.push({
            role: 'assistant',
            content: "Error: We couldn't connect to our servers. Please try again later."
          })
          return
        }
      } else {
        retryCount.value = 0
      }
    }

    isLoading.value = true;
    isTyping.value = true;

    const newMessage: ChatMessage = {
      role: 'user',
      content: userInput.value
    };

    messages.value.push(newMessage);
    userInput.value = '';
    scrollToBottom();

    console.log('Sending message to:', getApiUrl('CHAT'));
    console.log('Request payload:', {
      messages: messages.value,
      article_text: '',
      analysis_result: null
    });

    const response = await fetch(getApiUrl('CHAT'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.value,
        article_text: '',
        analysis_result: null
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
    
    nextTick(() => {
      handleInputFocus();
    });
  } catch (error) {
    console.error('Error details:', error);
    messages.value.push({
      role: 'assistant',
      content: `Sorry, there was an error processing your message: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
    });
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

    const newMessage: ChatMessage = {
      role: 'user',
      content: userInput.value
    };

    messages.value.push(newMessage);
    userInput.value = '';
    scrollToBottom();

    console.log('Sending message to:', getApiUrl('CHAT'));
    console.log('Request payload:', {
      messages: messages.value,
      article_text: '',
      analysis_result: null
    });

    const response = await fetch(getApiUrl('CHAT'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.value,
        article_text: '',
        analysis_result: null,
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
      content: `Sorry, there was an error processing your message: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`
    });
    nextTick(() => handleInputFocus());
  } finally {
    isLoading.value = false;
    isTyping.value = false;
  }
};

function handleQuickPrompt(prompt: { value: string }) {
  userInput.value = prompt.value;
  nextTick(() => {
    handleInputFocus();
  });
}

// Watch for new messages to scroll
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

function linkify(text: string): string {
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

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

/* Header styles */
.header-inset-title {
  background: linear-gradient(135deg, #0f172a 80%, #1e293b 100%);
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(255,255,255,0.04);
  border-radius: 0.9rem;
  padding: 0.35rem 1.1rem;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* Message bubble styles */
.user-bubble {
  margin-left: auto;
}
.assistant-bubble {
  margin-right: auto;
}

/* Icon styles */
.msg-svg-icon {
  width: 1.5em;
  height: 1.5em;
  opacity: 0.85;
  color: #60a5fa;
  vertical-align: middle;
  display: inline-block;
}

/* Button styles */
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

/* Input styles */
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

/* Mobile optimizations */
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

  .user-bubble,
  .assistant-bubble {
    font-size: 1.05rem !important;
    padding: 1rem 1.2rem !important;
    border-radius: 1.3rem !important;
    max-width: 90vw !important;
  }

  .space-y-3 > * + * {
    margin-top: 1.1rem !important;
  }
}

/* Message word break */
.max-w-\[85\%\], .max-w-\[80\%\], .assistant-bubble, .user-bubble {
  word-break: break-word;
  overflow-wrap: anywhere;
}
</style>