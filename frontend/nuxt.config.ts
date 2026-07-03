import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

let localGitCommit = 'unknown'
try {
  localGitCommit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
} catch (e) {
  try {
    let gitDir = path.resolve(process.cwd(), '.git')
    if (!fs.existsSync(gitDir)) {
      gitDir = path.resolve(process.cwd(), '../.git')
    }
    if (fs.existsSync(gitDir)) {
      const headContent = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf-8').trim()
      if (headContent.startsWith('ref:')) {
        const refPath = headContent.replace('ref:', '').trim()
        const fullRefPath = path.join(gitDir, refPath)
        if (fs.existsSync(fullRefPath)) {
          localGitCommit = fs.readFileSync(fullRefPath, 'utf-8').trim().substring(0, 7)
        }
      } else if (headContent.length >= 40) {
        localGitCommit = headContent.substring(0, 7)
      }
    }
  } catch (err) {
    // ignore
  }
}

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
      valueOrganization: process.env.RIS_DEV_VALUE_ORGANIZATION || undefined,
      valuePerson: process.env.RIS_DEV_VALUE_PERSON || undefined,

      // Some instances do not have a CRIS. Some UI Components will otherwise show errors
      // hasCRIS: !!process.env.PURE_API_URL || false,
      hasCRIS: true,
      gitCommit: process.env.GIT_COMMIT ? process.env.GIT_COMMIT.substring(0, 7) : localGitCommit
    }
  },

  plugins: [
    '~/plugins/event-bus.ts',
  ],

  hooks: {
    'prepare:types': (opts: any) => {
      opts.sharedReferences = opts.sharedReferences || []
      opts.nodeReferences = opts.nodeReferences || []
    },
    'nitro:prepare:types': (opts: any) => {
      if (!opts.references) opts.references = []
    }
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins = config.plugins || []
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-oidc-auth'
  ],
  oidc: {
    providers: {
      keycloak: {
        baseUrl: process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL || '',
        clientId: process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET || '',
        redirectUri: process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI || '',
        callbackRedirectUrl: '/auth/sso-success',
        audience: 'account',
        userNameClaim: 'preferred_username',
        exposeAccessToken: true,
        exposeIdToken: true,
        pkce: true
      }
    },
    middleware: {
      globalMiddlewareEnabled: false,
    }
  },
  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
  nitro: {
    routeRules: {
      '/api/**': { proxy: process.env.BACKEND_API_PROXY + '/**' }
    }
  },
  vite: {
    server: {
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.nuxt/**', '**/.output/**']
      },
      proxy: {
        '/api': {
          target: process.env.BACKEND_API_PROXY,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
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

const redact = (val?: string) => val ? val.substring(0, 3) + '***' : val;

// Keycloak
console.log('🔗 NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL)
console.log('🔗 NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID)
console.log('🔗 NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET:', redact(process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET))
console.log('🔗 NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI)
// OIDC Secrets
console.log('🔗 NUXT_OIDC_SESSION_SECRET:', redact(process.env.NUXT_OIDC_SESSION_SECRET))
console.log('🔗 NUXT_OIDC_TOKEN_KEY:', redact(process.env.NUXT_OIDC_TOKEN_KEY))
console.log('🔗 NUXT_OIDC_AUTH_SESSION_SECRET:', redact(process.env.NUXT_OIDC_AUTH_SESSION_SECRET))
