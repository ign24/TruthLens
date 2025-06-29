// Environment Configuration
export const ENV_CONFIG = {
  // Environment - force production for deployed builds
  ENV: import.meta.env.VITE_ENV || (import.meta.env.PROD ? 'production' : 'development'),
  
  // URLs
  URLS: {
    PRODUCTION: {
      API: 'https://truthlens-backend-production-b9e0.up.railway.app',
      FRONTEND: 'https://truthlensai.netlify.app',
      DOCS: 'https://truthlens-backend-production-b9e0.up.railway.app/docs',
      GITHUB: 'https://github.com/ignacioai/truthlens',
      BOLT: 'https://bolt.new'
    },
    DEVELOPMENT: {
      API: 'http://localhost:8000',
      FRONTEND: 'http://localhost:5173',
      DOCS: 'http://localhost:8000/docs',
      GITHUB: 'https://github.com/ignaciozai/truthlens',
      BOLT: 'https://bolt.new'
    }
  },
  
  // Ports
  PORTS: {
    BACKEND: 8000,
    FRONTEND: 5173
  },
  
  // API Settings
  API: {
    TIMEOUT: 5000, // milliseconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  
  // Endpoints
  ENDPOINTS: {
    CHAT: '/api/v1/chat',
    ANALYZE: '/api/v1/analyze',
    HEALTH: '/api/v1/health',
    TRANSLATE: '/api/v1/translator/translate',
    TRANSLATE_VOICE: '/api/v1/translator/translate-voice',
    ANALYZE_IMAGE: '/api/analyze_image'
  } as const
} as const;

// Helper functions
export const getApiUrl = (): string => {
  // Check for explicit environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Use production URL if we're in a production build or explicitly set to production
  const isProduction = import.meta.env.PROD || ENV_CONFIG.ENV === 'production';
  
  return isProduction 
    ? ENV_CONFIG.URLS.PRODUCTION.API 
    : ENV_CONFIG.URLS.DEVELOPMENT.API;
};

export const getFrontendUrl = (): string => {
  const isProduction = import.meta.env.PROD || ENV_CONFIG.ENV === 'production';
  return isProduction
    ? ENV_CONFIG.URLS.PRODUCTION.FRONTEND
    : ENV_CONFIG.URLS.DEVELOPMENT.FRONTEND;
};

export const getDocsUrl = (): string => {
  const isProduction = import.meta.env.PROD || ENV_CONFIG.ENV === 'production';
  return isProduction
    ? ENV_CONFIG.URLS.PRODUCTION.DOCS
    : ENV_CONFIG.URLS.DEVELOPMENT.DOCS;
};

export const getGithubUrl = (): string => {
  return ENV_CONFIG.URLS.PRODUCTION.GITHUB;
};

export const getBoltUrl = (): string => {
  return ENV_CONFIG.URLS.PRODUCTION.BOLT;
};

export const isDevelopment = (): boolean => !import.meta.env.PROD && ENV_CONFIG.ENV === 'development';
export const isProduction = (): boolean => import.meta.env.PROD || ENV_CONFIG.ENV === 'production';