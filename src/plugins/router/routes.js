export const routes = [
    {
        path: '/home',
        redirect: { name: 'Home' }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('@/components/home.vue')
    }
]