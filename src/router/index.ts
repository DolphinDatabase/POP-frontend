import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TermsView from '../views/Terms/TermsView.vue'
import TermsOwnerView from '../views/Terms/TermsOwnerView.vue'
import PoliticsView from '../views/Terms/PoliticsView.vue'
import MapsView from '@/views/Maps/MapsView.vue'
import AdminView from '@/views/AdminView.vue'
import { useAuthStore } from '@/store/auth'
import api from '@/services/api'

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
      path: '/terms-owner',
      name: 'terms-owner',
      component: TermsOwnerView,
      meta: { requiresAuth: false }
    },
    {
      path: '/politics',
      name: 'politics',
      component: PoliticsView,
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true }
    },
    {
      path: '/maps',
      name: 'maps',
      component: MapsView,
      meta: {
        requiresAuth: false
      }
    },
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
      const now = Date.now()
      const expirationTime = new Date(tokenExpiration).getTime()
      const timeUntilExpiration = now - expirationTime
      const tokenAboutToExpire = timeUntilExpiration <= 5 * 60 * 1000
      if (tokenAboutToExpire) {
        const usersChoice = confirm('Sua sessão vai expirar! Deseja continuar conectado?')
        if (usersChoice) {
          try {
            api.put('auth', {
              headers: { Authorization: `Bearer ${authStore.token}` }
            })
          } catch (error) {
            console.error('Token refresh failed:', error)
            authStore.setToken('', 0)
            next({ name: 'home' })
            return
          }
        }
      }
    } else {
      next({ name: 'home' })
    }
  } else {
    next()
  }

  if (isAuthenticated && Date.now() >= tokenExpiration) {
    authStore.setToken('', 0)
    next({ name: 'home' })
  }
})

export default router
