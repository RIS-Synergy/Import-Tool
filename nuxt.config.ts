import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },

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
    }
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
