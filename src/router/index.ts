import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TermsView from '../views/Terms/TermsView.vue'
import PoliticsView from '../views/Terms/PoliticsView.vue'
import MapsView from '@/views/Maps/MapsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView
    },
    {
      path: '/politics',
      name: 'politics',
      component: PoliticsView
    },
    {
      path: '/maps',
      name: 'maps',
      component: MapsView
    },
  ]
})

export default router
