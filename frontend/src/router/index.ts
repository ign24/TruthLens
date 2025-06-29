import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/landing'
  },
  {
    path: '/landing',
    name: 'landing',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/analyze',
    name: 'analyze',
    component: () => import('../views/TextAnalysisView.vue')
  },
  {
    path: '/chatbot',
    name: 'chatbot',
    component: () => import('../views/ChatBotView.vue')
  },
  {
    path: '/translator',
    name: 'translator',
    component: () => import('../views/TranslatorView.vue')
  },
  {
    path: '/voice-chat',
    name: 'voice-chat',
    component: () => import('../views/VoiceAssistant.vue')
  },
  {
    path: '/image-analysis',
    name: 'image-analysis',
    component: () => import('../views/ImageAnalysisView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
})

export default router 