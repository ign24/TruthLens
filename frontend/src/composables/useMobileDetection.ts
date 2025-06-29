import { ref, onMounted, onUnmounted } from 'vue';

export function useMobileDetection() {
  const isMobile = ref(false);

  // Mobile detection
  const detectMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone', 'mobile'];
    const isMobileByUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isMobileByScreen = window.innerWidth <= 768;
    const hasTouch = 'ontouchstart' in window;
    
    isMobile.value = isMobileByUA || isMobileByScreen || hasTouch;
  };

  // Lifecycle
  onMounted(() => {
    detectMobile();
    window.addEventListener('resize', detectMobile);
    window.addEventListener('orientationchange', detectMobile);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', detectMobile);
    window.removeEventListener('orientationchange', detectMobile);
  });

  return {
    isMobile
  };
} 