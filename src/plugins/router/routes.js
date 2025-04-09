export const routes = [
    {
        path: '/home',
        redirect: { name: 'Home' }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/components/home.vue')
    },
    {
        path: '/rocketleague',
        name: 'Rocket League',
        component: () => import('@/components/rocket_league.vue')
    }
]