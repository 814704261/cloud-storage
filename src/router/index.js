import Vue from 'vue'
import VueRouter from 'vue-router'

let Home = () =>
    import ('views/main/home/home')
let Profile = () =>
    import ('views/main/profile/profile')
let Main = () =>
    import ('views/main/main')
let Login = () =>
    import ('views/login/login')
let Filedisplay = () =>
    import ('views/main/home/filedisplay')
let Loading = () =>
    import ('views/main/home/loading')
let Quest = () =>
    import ('views/quest/index')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: '',
        component: Main,
        children: [{
                path: '',
                name: '',
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
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/quest',
        name: 'Quest',
        component: Quest
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router