# Configuration Structure

This directory contains all centralized configuration for the TruthLens frontend application.

## 📁 File Structure

```
config/
├── index.ts          # Main export file
├── environment.ts    # Environment and URL configuration
├── api.ts           # API endpoints and settings
├── chat.ts          # Chat-specific configuration
└── README.md        # This file
```

## 🔧 Configuration Files

### `environment.ts`
- **Environment detection** (development/production)
- **URLs** for API and frontend
- **Ports** configuration
- **API settings** (timeout, retry attempts, etc.)
- **Endpoints** definitions

### `api.ts`
- **API base URL** resolution
- **Endpoint helpers** (`getApiUrl`)
- **Health check** functionality
- **Configuration logging**

### `chat.ts`
- **Chat UI settings** (mobile breakpoint, typing delays)
- **Quick prompts** for user interaction
- **Bias and tone conversion** mappings
- **Helper functions** for data transformation

### `index.ts`
- **Main export file** for easy importing
- **Re-exports** commonly used configurations
- **Single import point** for all configs

## 🚀 Usage

### Import from main config:
```typescript
import { 
  ENV_CONFIG, 
  API_BASE_URL, 
  CHAT_CONFIG, 
  getApiUrl, 
  checkApiHealth 
} from '../config';
```

### Import specific config:
```typescript
import { ENV_CONFIG } from '../config/environment';
import { CHAT_CONFIG } from '../config/chat';
```

## 🔄 Migration from Hardcoded Values

### Before (Hardcoded):
```typescript
const API_BASE_URL = 'https://truthlens-backend-production.up.railway.app';
const MAX_RETRIES = 3;
const quickPrompts = [...];
```

### After (Centralized):
```typescript
import { ENV_CONFIG, CHAT_CONFIG } from '../config';

const apiUrl = ENV_CONFIG.URLS.PRODUCTION.API;
const maxRetries = CHAT_CONFIG.MAX_RETRIES;
const prompts = CHAT_CONFIG.QUICK_PROMPTS;
```

## 🎯 Benefits

1. **🔧 Maintainability**: All configs in one place
2. **🔄 Reusability**: Shared across components
3. **⚙️ Configurability**: Easy to modify values
4. **🧪 Testability**: Isolated configuration logic
5. **🌍 Environment-aware**: Automatic environment detection
6. **📱 Responsive**: Centralized breakpoints
7. **🔒 Type Safety**: TypeScript const assertions

## 🔍 Environment Variables

The configuration respects these environment variables:
- `VITE_ENV`: Environment (development/production)
- `VITE_API_BASE_URL`: Override API base URL 