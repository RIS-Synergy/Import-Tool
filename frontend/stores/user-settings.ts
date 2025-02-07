import { defineStore } from 'pinia'

export const useUserSettingsStore = defineStore('user-settings', {
  state: () => ({
    dark: true,
    itemsPerPage: 10,
    sortBy: [{ key: 'startDate', order: 'desc' }],
    projectFilters: {
      status: [],
      piDomain: ['univie.ac.at'],
      orderBy: 'startDate:desc',
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
