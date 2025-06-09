<template>
  <!-- Main page wrapper for the Voice Assistant -->
  <div class="voice-assistant-page">
    <!-- Central container for the voice assistant UI -->
    <div class="voice-assistant-container">
      <!-- Title and subtitle with entrance animation -->
      <transition name="fade-slide-down" appear>
        <div class="voice-assistant-title">
          <h1 class="main-title">TruthLens Voice Agent</h1>
          <p class="subtitle">Chat with <span class="gradient-text">Clara</span>. Your real-time multilingual AI from TruthLens.</p>
        </div>
      </transition>
      <!-- Voice Assistant Main Button with animated disc background -->
      <transition name="scale-fade" appear>
        <div class="voice-button-wrapper" :class="{ 'active': isActive, 'listening': isListening, 'speaking': isSpeaking }">
          <!-- Animated Background Disc -->
          <div class="voice-disc">
            <div :class="['disc-gradient', (isListening || isSpeaking) ? 'disc-gradient-bright' : '']"></div>
            <div class="disc-shine"></div>
          </div>
          <!-- Main Button for voice interaction -->
          <button
            @click="toggleVoiceChat"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            :disabled="isConnecting"
            class="voice-button"
            :class="{
              'listening': isListening,
              'speaking': isSpeaking,
              'connecting': isConnecting,
              'error': hasError
            }"
            :aria-label="getButtonLabel()"
          >
            <span :class="['liquid-blob', (isListening || isSpeaking) ? 'liquid-blob-active' : '']"></span>
          </button>
        </div>
      </transition>
      <!-- State label for listening/speaking -->
      <transition name="state-fade-slide" mode="out-in">
        <div v-if="isListening || isSpeaking" class="voice-state-label" key="state-label">
          <span v-if="isListening">Listening</span>
          <span v-else-if="isSpeaking">Responding</span>
        </div>
      </transition>
    </div>
    <!-- ChatBot assistant at the bottom -->
    <ChatBot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import listenStartSound from '../assets/sounds/listen_start.wav';
import speakStartSound from '../assets/sounds/speak_start.mp3';
import speechDemoAudio from '../assets/sounds/speech.mp3';
import ChatBot from '../components/ChatBot.vue';

// State management
const isActive = ref(false);
const isListening = ref(false);
const isSpeaking = ref(false);
const isConnecting = ref(false);
const hasError = ref(false);
const statusMessage = ref('');
const connectionStatus = ref<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

// WebSocket and audio management
let websocket: WebSocket | null = null;
let mediaRecorder: MediaRecorder | null = null;
let audioStream: MediaStream | null = null;
let audioContext: AudioContext | null = null;

// Configuration
const WEBSOCKET_URL = `${import.meta.env.VITE_API_BASE_URL?.replace('http', 'ws') || 'ws://localhost:8000'}/ws/voice`;
const SAMPLE_RATE = 16000;

// Modo demo: si es true, no se conecta al backend ni gasta créditos
const isDemoMode = true;

// Computed properties
const getButtonLabel = () => {
  if (isConnecting.value) return 'Connecting to voice assistant';
  if (isListening.value) return 'Listening - Click to stop';
  if (isSpeaking.value) return 'AI is speaking';
  return 'Start voice conversation';
};

// WebSocket management
const connectWebSocket = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      connectionStatus.value = 'connecting';
      websocket = new WebSocket(WEBSOCKET_URL);
      
      websocket.onopen = () => {
        console.log('Voice WebSocket connected');
        connectionStatus.value = 'connected';
        hasError.value = false;
        statusMessage.value = '';
        resolve(true);
      };
      
      websocket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          
          if (data.type === 'audio_response') {
            console.log('Received audio response, playing...');
            if (!data.audio) {
              console.error('Audio response missing audio data');
              return;
            }
            await playAudioResponse(data.audio);
          } else if (data.type === 'error') {
            console.error('Received error:', data.message);
            handleError(data.message);
          } else if (data.type === 'status') {
            console.log('Status update:', data.message);
            statusMessage.value = data.message;
          } else if (data.type === 'ping') {
            // Ignorar mensajes de ping, son solo para mantener la conexión viva
            return;
          } else if (data.type === 'conversation_initiation_metadata') {
            // La conversación está lista para recibir audio
            console.log('Conversation initialized:', data.conversation_initiation_metadata_event);
            statusMessage.value = 'Ready to speak...';
          } else {
            console.log('Unhandled message type:', data.type, data);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
          handleError('Error processing voice response');
        }
      };
      
      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        connectionStatus.value = 'error';
        handleError('Connection error. Please try again.');
        resolve(false);
      };
      
      websocket.onclose = () => {
        console.log('Voice WebSocket disconnected');
        connectionStatus.value = 'disconnected';
        websocket = null;
      };
      
      // Timeout for connection
      setTimeout(() => {
        if (connectionStatus.value === 'connecting') {
          handleError('Connection timeout. Please try again.');
          resolve(false);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      connectionStatus.value = 'error';
      handleError('Failed to connect to voice service');
      resolve(false);
    }
  });
};

// Audio management
const initializeAudio = async (): Promise<boolean> => {
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: SAMPLE_RATE,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
    
    mediaRecorder = new MediaRecorder(audioStream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0) {
        // Solo convierte el blob a base64 y envíalo
        const arrayBuffer = await event.data.arrayBuffer();
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        await sendAudioToServer(base64Audio);
      }
    };
    
    mediaRecorder.onstop = () => {
      // Solo limpiamos el estado, ya no enviamos audio aquí
    };
    
    return true;
  } catch (error) {
    console.error('Error initializing audio:', error);
    handleError('Microphone access denied. Please allow microphone access and try again.');
    return false;
  }
};

const sendAudioToServer = async (audioData: string) => {
  if (isDemoMode) {
    try {
      // En modo demo, usamos el endpoint mock
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/voice/generate?text=test`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to get mock audio response');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Reproducir el audio mock
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;
      
      isSpeaking.value = true;
      statusMessage.value = 'AI is responding...';
      
      audio.onended = () => {
        isSpeaking.value = false;
        statusMessage.value = '';
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        isSpeaking.value = false;
        statusMessage.value = '';
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Error in mock audio playback:', error);
      handleError('Error playing mock audio response');
    }
    return;
  }
  
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    handleError('Not connected to voice service');
    return;
  }
  try {
    websocket.send(JSON.stringify({
      audio: audioData,
      audio_format: 'webm',
      type: 'user_audio_chunk'
    }));
    statusMessage.value = 'Analyzing your request...';
  } catch (error) {
    console.error('Error sending audio:', error);
    handleError('Failed to send audio. Please try again.');
  }
};

const playAudioResponse = async (base64Audio: string) => {
  try {
    console.log('Playing audio response...');
    isSpeaking.value = true;
    statusMessage.value = 'AI is responding...';
    
    // Convertir base64 a ArrayBuffer
    const audioData = atob(base64Audio);
    const audioArray = new Uint8Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      audioArray[i] = audioData.charCodeAt(i);
    }
    
    // Crear Blob y URL
    const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Crear y configurar Audio
    const audio = new Audio(audioUrl);
    
    // Eventos del audio
    audio.onended = () => {
      console.log('Audio playback ended');
      isSpeaking.value = false;
      statusMessage.value = '';
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.onerror = (error) => {
      console.error('Error playing audio:', error);
      isSpeaking.value = false;
      handleError('Error playing audio response');
      URL.revokeObjectURL(audioUrl);
    };
    
    // Reproducir audio
    console.log('Starting audio playback...');
    await audio.play();
    console.log('Audio playback started');
    
  } catch (error) {
    console.error('Error in playAudioResponse:', error);
    isSpeaking.value = false;
    handleError('Error playing voice response');
  }
};

// Main voice chat toggle
const toggleVoiceChat = async () => {
  if (isDemoMode) {
    // Si ya está escuchando o hablando, no hacer nada
    if (isListening.value || isSpeaking.value || isConnecting.value) return;

    // 1. Listening
    isListening.value = true;
    isActive.value = true;
    statusMessage.value = 'Listening... Click to stop';

    setTimeout(() => {
      // 2. Processing
      isListening.value = false;
      isActive.value = false;
      statusMessage.value = 'Processing your message...';

      setTimeout(() => {
        // 3. Speaking
        isSpeaking.value = true;
        statusMessage.value = 'AI is responding...';

        // Reproducir el audio demo y mantener speaking activo durante la reproducción
        const audio = new Audio(speechDemoAudio);
        audio.volume = 1.0;
        audio.onended = () => {
          isSpeaking.value = false;
          statusMessage.value = '';
        };
        audio.onerror = () => {
          isSpeaking.value = false;
          statusMessage.value = '';
        };
        audio.play();

      }, 1500); // processing
    }, 9000); // listening
    return;
  }
  if (isListening.value) {
    stopListening();
    return;
  }
  if (isSpeaking.value) {
    // Can't interrupt while speaking
    return;
  }
  await startVoiceChat();
};

const startVoiceChat = async () => {
  try {
    isConnecting.value = true;
    hasError.value = false;
    statusMessage.value = 'Initializing voice assistant...';
    
    // Connect WebSocket if not connected
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      const connected = await connectWebSocket();
      if (!connected) {
        isConnecting.value = false;
        return;
      }
    }
    
    // Initialize audio if not initialized
    if (!audioStream) {
      const audioInitialized = await initializeAudio();
      if (!audioInitialized) {
        isConnecting.value = false;
        return;
      }
    }
    
    isConnecting.value = false;
    startListening();
    
  } catch (error) {
    console.error('Error starting voice chat:', error);
    isConnecting.value = false;
    handleError('Failed to start voice chat. Please try again.');
  }
};

const startListening = () => {
  if (!mediaRecorder) return;
  
  try {
    isListening.value = true;
    isActive.value = true;
    statusMessage.value = 'Listening... Click to stop';
    
    mediaRecorder.start(100);
  } catch (error) {
    console.error('Error starting recording:', error);
    handleError('Failed to start recording');
  }
};

const stopListening = () => {
  if (!mediaRecorder || !isListening.value) return;
  
  try {
    isListening.value = false;
    isActive.value = false;
    statusMessage.value = 'Processing...';
    
    mediaRecorder.stop();
  } catch (error) {
    console.error('Error stopping recording:', error);
    handleError('Error stopping recording');
  }
};

// Error handling
const handleError = (message: string) => {
  hasError.value = true;
  statusMessage.value = message;
  isListening.value = false;
  isSpeaking.value = false;
  isConnecting.value = false;
  isActive.value = false;
  
  // Clear error after 5 seconds
  setTimeout(() => {
    if (hasError.value) {
      hasError.value = false;
      statusMessage.value = '';
    }
  }, 5000);
};

// Button interaction handlers
const handleMouseDown = () => {
  if (!isListening.value && !isSpeaking.value && !isConnecting.value) {
    // Add press effect
  }
};

const handleMouseUp = () => {
  // Remove press effect
};

// Cleanup
const cleanup = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  
  if (audioStream) {
    audioStream.getTracks().forEach(track => track.stop());
    audioStream = null;
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  if (websocket) {
    websocket.close();
    websocket = null;
  }
  
  mediaRecorder = null;
};

// Lifecycle
onMounted(() => {
  // Check for required APIs
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    handleError('Voice features not supported in this browser');
  }
});

onUnmounted(() => {
  cleanup();
});

// Función para reproducir sonidos
const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 0.7;
  audio.play();
};

// Watch para reproducir sonidos al cambiar de estado
watch(isListening, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    playSound(listenStartSound);
  }
});
watch(isSpeaking, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    playSound(speakStartSound);
  }
});
</script>

<style scoped>
.voice-assistant-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 13vh;
}

.voice-assistant-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  justify-content: center;
}

.voice-button-wrapper {
  position: relative;
  width: 340px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animated Background Disc */
.voice-disc {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.disc-gradient {
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from 0deg,
    #1e40af 0deg,
    #3b82f6 60deg,
    #06b6d4 120deg,
    #0ea5e9 180deg,
    #3b82f6 240deg,
    #1e40af 300deg,
    #1e40af 360deg
  );
  border-radius: 50%;
  animation: rotate 8s linear infinite;
  transition: animation-duration 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s, background 0.5s;
}

.disc-gradient-bright {
  filter: brightness(1.25) saturate(1.4) drop-shadow(0 0 32px #38bdf8cc);
  background: conic-gradient(
    from 0deg,
    #38bdf8 0deg,
    #3b82f6 60deg,
    #06b6d4 120deg,
    #0ea5e9 180deg,
    #3b82f6 240deg,
    #38bdf8 300deg,
    #38bdf8 360deg
  );
}

.disc-gradient-fast {
  animation-duration: 2s !important;
}

.disc-shine {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 30%,
    transparent 70%
  );
  border-radius: 50%;
}

/* Main Button */
.voice-button {
  position: relative;
  z-index: 10;
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.95);
  border: 4px solid rgba(59, 130, 246, 0.3);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 60px rgba(59, 130, 246, 0.2),
    inset 0 4px 8px rgba(255, 255, 255, 0.1);
  font-size: 2.2rem;
  overflow: visible;
}

.voice-button::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  background: #101624;
  border-radius: 50%;
  z-index: 11;
  box-shadow: 0 0 0 2px rgba(59,130,246,0.1);
}

.voice-button:hover {
  transform: scale(1.07);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 
    0 0 80px rgba(59, 130, 246, 0.3),
    inset 0 4px 8px rgba(255, 255, 255, 0.15);
}

.voice-button:active {
  transform: scale(0.98);
}

.voice-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

/* Button Content */
.button-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12;
}

.icon-mic,
.icon-speaker {
  width: 100%;
  height: 100%;
  stroke-width: 3.5;
}

.icon-waveform {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
}

.wave-bar {
  width: 6px;
  height: 40px;
  background: currentColor;
  border-radius: 3px;
  animation: waveform 1s ease-in-out infinite;
}

.icon-loading {
  display: none;
}

.loading-spinner {
  display: none;
}

.button-text {
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  z-index: 12;
}

/* Title Styles */
.voice-assistant-title {
  width: 100%;
  text-align: center;
  margin-bottom: 1.5rem;
}

.main-title {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(90deg, #38bdf8 0%, #3b82f6 50%, #60a5fa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.gradient-text {
  background: linear-gradient(90deg, #38bdf8 0%, #3b82f6 50%, #60a5fa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* Transitions */
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

.fade-scale-leave-from, .fade-scale-enter-to {
  opacity: 1;
  transform: scale(1);
}

.modern-fade {
  transition: opacity 0.3s, transform 0.3s;
}

/* Blob Animations */
.liquid-blob {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 120px;
  height: 120px;
  border-radius: 44% 56% 48% 52% / 55% 45% 55% 45%;
  opacity: 1;
  pointer-events: none;
  mix-blend-mode: screen;
  z-index: 12;
  filter: blur(2px) brightness(3);
  background: radial-gradient(circle at 60% 40%, #38bdf8 0%, #6366f1 60%, #0ea5e9 100%);
  animation: liquidMove 9s ease-in-out infinite alternate;
  transition: background 0.5s, opacity 0.3s, transform 0.3s;
}

.liquid-blob-active {
  animation: liquidBurst 0.32s cubic-bezier(0.4, 0, 0.2, 1) 1, liquidMove 3s 0.32s ease-in-out infinite alternate;
  opacity: 1;
  transform: scale(3);
}

@keyframes liquidBurst {
  0% {
    opacity: 0.95;
    transform: scale(1);
  }
  40% {
    opacity: 1;
    transform: scale(5);
  }
  100% {
    opacity: 1;
    transform: scale(2.7);
  }
}

@keyframes liquidMove {
  0% {
    border-radius: 44% 56% 48% 52% / 55% 45% 55% 45%;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    filter: blur(6px) brightness(1.2);
  }
  15% {
    border-radius: 60% 40% 55% 45% / 45% 60% 40% 55%;
    transform: translate(-52%, -48%) scale(1.08, 0.95) rotate(12deg);
    filter: blur(7px) brightness(1.22);
  }
  32% {
    border-radius: 50% 60% 40% 60% / 60% 40% 60% 40%;
    transform: translate(-48%, -52%) scale(1.13, 0.92) rotate(-7deg);
    filter: blur(8px) brightness(1.25);
  }
  47% {
    border-radius: 55% 45% 60% 40% / 40% 55% 45% 60%;
    transform: translate(-53%, -47%) scale(0.97, 1.18) rotate(18deg);
    filter: blur(7px) brightness(1.18);
  }
  63% {
    border-radius: 60% 40% 50% 50% / 50% 60% 40% 50%;
    transform: translate(-51%, -49%) scale(1.05, 1.07) rotate(-14deg);
    filter: blur(7px) brightness(1.21);
  }
  78% {
    border-radius: 45% 55% 60% 40% / 60% 40% 55% 45%;
    transform: translate(-49%, -51%) scale(1.11, 0.93) rotate(9deg);
    filter: blur(8px) brightness(1.23);
  }
  100% {
    border-radius: 44% 56% 48% 52% / 55% 45% 55% 45%;
    transform: translate(-50%, -50%) scale(1) rotate(0deg);
    filter: blur(6px) brightness(1.2);
  }
}

.voice-state-label {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px #0ea5e944, 0 1px 2px #000a;
}

/* State Label Animations */
.state-fade-slide-enter-active, .state-fade-slide-leave-active {
  transition: opacity 0.35s, transform 0.35s;
}

.state-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(18px);
}

.state-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}

.state-fade-slide-enter-to, .state-fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Active state animations */
.voice-button-wrapper.active .disc-gradient {
  animation-duration: 3s;
}

/* Entrance Animations */
.fade-slide-down-enter-active {
  animation: fade-slide-down 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fade-slide-down {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.scale-fade-enter-active {
  animation: scale-fade 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes scale-fade {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style> 