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
let SelectPath = () =>
    import ('views/main/home/selectPath')
let Verify = () =>
    import ('views/main/home/verify')
let Preview = () =>
    import ('views/main/home/preview')

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
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/selectpath',
        name: 'SelectPath',
        component: SelectPath
    },
    {
        path: '/quest',
        name: 'Quest',
        component: Quest
    },
    {
        path: '/verify',
        name: 'Verify',
        component: Verify
    },
    {
        path: '/preview',
        name: 'Preview',
        component: Preview
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router