import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/landing',
    name: 'landing',
    component: () => import('../views/LandingView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => HomeView
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
  routes
})

export default router 