import { createApp } from 'vue'
import { pinia, vuetify, router, i18n } from '@/plugins'

import App from '@/App.vue'
import '@/assets/main.css'

createApp(App)
    .use(pinia)
    .use(vuetify)
    .use(router)
    .use(i18n)

    .mount('#app')