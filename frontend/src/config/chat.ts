// Chat Configuration
import { ENV_CONFIG } from './environment';

export const CHAT_CONFIG = {
  // API Settings
  MAX_RETRIES: ENV_CONFIG.API.RETRY_ATTEMPTS,
  RETRY_DELAY: ENV_CONFIG.API.RETRY_DELAY, // milliseconds
  
  // UI Settings
  MOBILE_BREAKPOINT: 768, // pixels
  TYPING_INDICATOR_DELAY: 150, // milliseconds for typing animation
  
  // Quick Prompts
  QUICK_PROMPTS: [
    {
      label: 'Analyze for bias',
      value: 'Analyze this news article for bias'
    },
    {
      label: 'Source credibility',
      value: 'Evaluate source credibility'
    },
    {
      label: 'Detect emotional manipulation',
      value: 'Detect emotional manipulation'
    }
  ] as const,
  
  // Bias conversion mapping
  BIAS_MAP: {
    'neutral': 0.5,
    'slightly biased': 0.3,
    'biased': 0.2,
    'heavily biased': 0.1,
    'unbiased': 0.8
  } as const,
  
  // Emotional tone conversion mapping
  TONE_MAP: {
    'balanced': 0.5,
    'emotional': 0.3,
    'very emotional': 0.2,
    'neutral': 0.7,
    'objective': 0.8
  } as const
} as const;

// Helper functions
export const convertBiasToFloat = (bias: string | null): number => {
  if (!bias) return 0.5;
  return CHAT_CONFIG.BIAS_MAP[bias.toLowerCase() as keyof typeof CHAT_CONFIG.BIAS_MAP] || 0.5;
};

export const convertEmotionalToneToFloat = (tone: string | null): number => {
  if (!tone) return 0.5;
  return CHAT_CONFIG.TONE_MAP[tone.toLowerCase() as keyof typeof CHAT_CONFIG.TONE_MAP] || 0.5;
};

export const checkMobile = (): boolean => {
  return window.innerWidth <= CHAT_CONFIG.MOBILE_BREAKPOINT;
}; 