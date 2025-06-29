import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Ensure router is used correctly
// Temporary type assertion to resolve TypeScript error
app.use(router as any)

app.mount('#app')