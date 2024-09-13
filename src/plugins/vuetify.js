import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import LuxonAdapter from "@date-io/luxon"
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n } from 'vue-i18n'
import { i18n } from '@/plugins/I18n'

const vuetify = createVuetify({
    components,
    directives,
    // theme: {
    //     defaultTheme: 'dark'
    // },
    date: {
        adapter: LuxonAdapter,
    },
    locale: {
        adapter: createVueI18nAdapter({ i18n, useI18n })
    }
})

export default vuetify