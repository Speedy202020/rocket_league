import { watch } from "vue"
import { router } from '@/plugins'
import { setDocTitle } from '@/helpers'

import { de } from '@/plugins/I18n/de'
import { en } from '@/plugins/I18n/en'
import { fr } from '@/plugins/I18n/fr'

import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'EN', // set locale
    fallbackLocale: 'FR', // set fallback locale
    messages: {
        FR: fr,
        DE: de,
        EN: en
    }, // set locale messages
    legacy: false,
    missingWarn: false,
    fallbackWarn: false,
    silentTranslationWarn: true
})

const i18nGlobal = i18n.global

watch(i18nGlobal.locale, () => {
    setDocTitle(router.currentRoute.value)
})

export { i18n, i18nGlobal }
export default i18n