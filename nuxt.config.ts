import { defineNuxtConfig } from 'nuxt3'
import eslintPlugin from 'vite-plugin-eslint'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  vite: {
    plugins: [
      eslintPlugin()
    ]
  },

  css: ['vuetify/styles/main.sass'],

  build: {
    transpile: ['vuetify']
  },

  vuetify: {
    customVariables: ['@/assets/vuetify/variables.scss'],
    treeShake: true
  },

  runtimeConfig: {
    storageDir: ''
  }
})
