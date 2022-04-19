import { createVuetify } from 'vuetify'
import components from 'vuetify/components'
import { defineNuxtPlugin } from '~~/.nuxt/imports'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components
  })
  nuxtApp.vueApp.use(vuetify)
})
