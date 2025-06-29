// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  define: {
    // Ensure environment variables are available at build time
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  },
  build: {
    // Ensure environment variables are included in the build
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})