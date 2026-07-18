import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  { 
    path: '/login',
    name: 'Login',
    component: LoginView, 
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

export default router
