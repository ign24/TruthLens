import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 