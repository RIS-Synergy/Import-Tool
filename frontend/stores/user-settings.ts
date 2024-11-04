import { defineStore } from 'pinia'

export const useUserSettingsStore = defineStore('user-settings', {
  state: () => ({
    dark: true,
    itemsPerPage: 10,
    sortBy: [{ key: 'startDate', order: 'asc' }],
    projectFilters: {
      status: [],
    },
    token: null,
    user: null
  }),
  actions: {
    setToken(token: any) {
      this.token = token
    },
    setUser(user: any) {
      this.user = user
    }
  },
  persist: true
})
