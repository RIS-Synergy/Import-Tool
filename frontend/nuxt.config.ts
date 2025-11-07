import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: !!process.env.DEV_TOOLS },

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
      valuePerson: process.env.RIS_DEV_VALUE_PERSON || null,

      // Some instances do not have a CRIS. Some UI Components will otherwise show errors
      // hasCRIS: !!process.env.PURE_API_URL || false,
      hasCRIS: true
    }
  },

  plugins: [
    '~/plugins/event-bus.ts',
  ],

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
      '/api/**': { proxy: process.env.BACKEND_API_PROXY }
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
  },
})

console.log('🛠️ NODE_ENV:', process.env.NODE_ENV)
console.log('🔧 BACKEND_API_PROXY', process.env.BACKEND_API_PROXY)
console.log('🧪 DEV_TOOLS', process.env.DEV_TOOLS)
