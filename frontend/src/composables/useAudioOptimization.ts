import { ref, onMounted, onUnmounted } from 'vue';

export function useAudioOptimization() {
  const isMobile = ref(false);
  const audioContext = ref<AudioContext | null>(null);

  // Mobile detection
  const detectMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone', 'mobile'];
    const isMobileByUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isMobileByScreen = window.innerWidth <= 768;
    isMobile.value = isMobileByUA || isMobileByScreen;
  };

  // Get optimized audio constraints for mobile
  const getMobileAudioConstraints = () => {
    return isMobile.value ? {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
        channelCount: 1,
        latency: 0.01
      }
    } : {
      audio: true
    };
  };

  // Play audio with mobile optimization
  const playAudio = (src: string, options?: { volume?: number; preload?: boolean }) => {
    const audio = new Audio(src);
    
    // Set volume based on device type
    const volume = options?.volume ?? (isMobile.value ? 0.9 : 0.7);
    audio.volume = volume;
    
    // Preload audio for better performance on mobile
    if (options?.preload !== false) {
      audio.preload = 'auto';
    }

    // Add mobile-specific optimizations
    if (isMobile.value) {
      // Ensure audio plays even if device is in silent mode (iOS)
      audio.muted = false;
      // Set audio context for better control
      if (!audioContext.value) {
        audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    }

    return audio.play().catch(e => {
      console.warn('Audio play failed:', e);
      // Fallback for mobile browsers that require user interaction
      if (isMobile.value) {
        console.log('Mobile audio fallback: user interaction may be required');
      }
    });
  };

  // Initialize audio context for mobile
  const initAudioContext = () => {
    if (isMobile.value && !audioContext.value) {
      try {
        audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)();
        // Resume context if suspended (required for iOS)
        if (audioContext.value.state === 'suspended') {
          audioContext.value.resume();
        }
      } catch (error) {
        console.warn('Failed to initialize audio context:', error);
      }
    }
  };

  // Resume audio context (useful for iOS)
  const resumeAudioContext = async () => {
    if (audioContext.value && audioContext.value.state === 'suspended') {
      try {
        await audioContext.value.resume();
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  };

  // Lifecycle
  onMounted(() => {
    detectMobile();
    window.addEventListener('resize', detectMobile);
    window.addEventListener('orientationchange', detectMobile);
    
    // Initialize audio context on user interaction (required for iOS)
    const initOnInteraction = () => {
      initAudioContext();
      document.removeEventListener('touchstart', initOnInteraction);
      document.removeEventListener('click', initOnInteraction);
    };
    
    document.addEventListener('touchstart', initOnInteraction);
    document.addEventListener('click', initOnInteraction);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', detectMobile);
    window.removeEventListener('orientationchange', detectMobile);
    
    // Clean up audio context
    if (audioContext.value) {
      audioContext.value.close();
      audioContext.value = null;
    }
  });

  return {
    isMobile,
    getMobileAudioConstraints,
    playAudio,
    initAudioContext,
    resumeAudioContext
  };
} 