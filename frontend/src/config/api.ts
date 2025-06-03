// API Configuration
const ENV = import.meta.env.VITE_ENV || 'development';
const DEFAULT_API_URL = ENV === 'production' 
  ? 'https://truthlens-backend-production.up.railway.app'
  : 'http://localhost:8000'; // Backend runs on port 8000

// Get API URL from environment or use default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL;

// API Endpoints configuration
export const API_ENDPOINTS = {
  CHAT: '/api/v1/chat',
  ANALYZE: '/api/v1/analyze',
  HEALTH: '/api/v1/health'
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: keyof typeof API_ENDPOINTS) => {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`;
};

// Helper function to check API health with timeout
export const checkApiHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(getApiUrl('HEALTH'), {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('API Health check timed out');
    } else {
      console.error('API Health check failed:', error);
    }
    return false;
  }
};

// Log current API configuration
console.log('API Configuration:', {
  environment: ENV,
  baseUrl: API_BASE_URL,
  endpoints: API_ENDPOINTS,
  isLocal: ENV === 'development',
  frontendPort: 8000,
  backendPort: 5000
}); 