import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/Home.vue'  // Import dengan nama baru

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage  // Gunakan nama baru
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/About.vue')  // Tetap import seperti biasa
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router