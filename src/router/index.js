import Vue from 'vue'
import VueRouter from 'vue-router'

let Home = () =>
    import ('../views/home.vue')
let Profile = () =>
    import ('../views/profile.vue')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router