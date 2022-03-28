import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import firebase from 'firebase'

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: {
            layout: 'main',
            auth: true
        },
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            layout: 'empty'
        },
        component: () => import('../views/Login.vue')
    },
    {
        path: '/categories',
        name: 'Categories',
        meta: {
            layout: 'main',
            auth: true
        },
        component: () => import('../views/Categories.vue')
    },
    {
        path: '/details/:id',
        name: 'Details',
        meta: {
            layout: 'main',
            auth: true
        },
        component: () => import('../views/Details.vue')
    },
    {
        path: '/history',
        name: 'History',
        meta: {
            layout: 'main',
            auth: true
        },
        component: () => import('../views/History.vue')
    },
    {
        path: '/planning',
        name: 'Planning',
        meta: {
            layout: 'main',
            auth: true
        },
        component: () => import('../views/Planning.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        meta: {
            layout: 'main',
            auth: true
        },
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/record',
        name: 'Record',
        meta: {
            layout: 'main',
            auth: true
        },
        component: () => import('../views/Record.vue')
    },
    {
        path: '/register',
        name: 'Register',
        meta: {
            layout: 'empty'
        },
        component: () => import('../views/Register.vue')
    },
    {
        path: '/reset',
        name: 'ResetPassword',
        meta: {
            layout: 'empty'
        },
        component: () => import('../views/ResetPassword')
    },
    {
        path: '/chat',
        name: 'Chat',
        meta: {
            layout: 'main',
            auth: true
        },
        component: () => import('../views/Chat')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const currentUset = firebase.auth().currentUser
    // const requireAuth = to.matched.some(record => record.meta.auth)
    const requireAuth = to.meta.auth

    if (requireAuth && !currentUset) {
        next('/login?message=login')
    } else {
        next()
    }
})

export default router
