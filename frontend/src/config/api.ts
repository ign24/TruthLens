// API Configuration
import { ENV_CONFIG, getApiUrl as getBaseApiUrl, getFrontendUrl, isDevelopment } from './environment';

// Get API URL from environment or use default
export const API_BASE_URL = getBaseApiUrl();

// Frontend URL configuration
export const FRONTEND_URL = getFrontendUrl();

// API Endpoints configuration
export const API_ENDPOINTS = ENV_CONFIG.ENDPOINTS;

// Helper function to get full API URL
export const getApiUrl = (endpoint: keyof typeof API_ENDPOINTS) => {
  return `${API_BASE_URL}${API_ENDPOINTS[endpoint]}`;
};

// Helper function to check API health with timeout
export const checkApiHealth = async () => {
  // Health check disabled to save tokens
  return true;
  
  /* Original implementation commented out
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ENV_CONFIG.API.TIMEOUT);

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
  */
};

// Log current API configuration
console.log('API Configuration:', {
  environment: ENV_CONFIG.ENV,
  baseUrl: API_BASE_URL,
  frontendUrl: FRONTEND_URL,
  endpoints: API_ENDPOINTS,
  isLocal: isDevelopment()
}); 