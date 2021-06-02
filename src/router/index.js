import Vue from 'vue'
import VueRouter from 'vue-router'

let Home = () =>
    import ('../views/home.vue')
let Profile = () =>
    import ('../views/profile.vue')
let Main = () =>
    import ('../views/main.vue')
let Register = () =>
    import ('../views/register.vue')
let Login = () =>
    import ('../views/login.vue')
let Filedisplay = () =>
    import ('../views/filedisplay.vue')
let Loading = () =>
    import ('../views/loading.vue')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Main',
        component: Main,
        children: [{
                path: '',
                name: 'Home',
                component: Home,
                children: [{
                        path: '',
                        name: 'Loading',
                        component: Loading
                    },
                    {
                        path: 'filedisplay',
                        name: 'Filedisplay',
                        component: Filedisplay
                    }
                ]
            },
            {
                path: 'profile',
                name: 'Profile',
                component: Profile
            }
        ]
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router