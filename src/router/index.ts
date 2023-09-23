import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TermsView from '../views/Terms/TermsView.vue'
import PoliticsView from '../views/Terms/PoliticsView.vue'
import MapsView from '@/views/Maps/MapsView.vue'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView,
      meta: { requiresAuth: false }
    },
    {
      path: '/politics',
      name: 'politics',
      component: PoliticsView,
      meta: { requiresAuth: false }
    },
    {
      path: '/maps',
      name: 'maps',
      component: MapsView,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const tokenExpiration = authStore.tokenExpiration
  const isAuthenticated = !!authStore.token

  if (to.meta.requiresAuth) {
    if (isAuthenticated) {
      to.meta.token = authStore.token
      next()
    } else {
      next({ name: 'home' })
    }
  } else {
    next()
  }

  if (isAuthenticated && Date.now() >= tokenExpiration) {
    console.log('aqui')
    authStore.setToken('', 0)
    next({ name: 'login' })
  }
})

export default router
