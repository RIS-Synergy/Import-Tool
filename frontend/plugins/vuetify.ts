// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  let initialTheme = 'light'

  if (import.meta.client) {
    try {
      const persisted = localStorage.getItem('user-settings')
      if (persisted) {
        const state = JSON.parse(persisted)
        if (state && typeof state.dark === 'boolean') {
          initialTheme = state.dark ? 'dark' : 'light'
        }
      }
    } catch (e) {
      console.warn('Failed to parse persisted theme', e)
    }
  }

  const vuetify = createVuetify({
    theme: {
      defaultTheme: initialTheme
    }
  })
  app.vueApp.use(vuetify)
})
