import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Asegurarse de que el router se use correctamente
app.use(router as any) // Temporal type assertion para resolver el error de TypeScript

app.mount('#app')