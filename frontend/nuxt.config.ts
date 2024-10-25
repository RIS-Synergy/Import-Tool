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

  runtimeConfig: {
    public: {
      valueOrganization: process.env.RIS_DEV_VALUE_ORGANIZATION || null,
      valuePerson: process.env.RIS_DEV_VALUE_PERSON || null
    }
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
  nitro: {
    routeRules: {
      '/api/**': { proxy: 'http://backend:3000/**' },
    }
  },
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: '0.0.0.0',
      }
    },
    vue: {
      template: {
        transformAssetUrls
      }
    }
  }
})
