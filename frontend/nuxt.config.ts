import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: false },

  css: ['~/assets/main.scss'],

  components: {
    global: true,
    dirs: ['~/components']
  },

  compatibilityDate: "2024-08-20",

  // as per vuetify docs:
  build: {
    transpile: ['vuetify']
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt'
  ],
  nitro: {
    routeRules: {
      '/api/**': { proxy: 'http://localhost:3001/**' },
    }
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    }
  }
})
