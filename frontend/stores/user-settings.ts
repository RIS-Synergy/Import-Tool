import { defineStore } from 'pinia'

const projectFilters = {
  status: [],
  piDomain: {
    domain: 'univie.ac.at',
    ror: 'https://ror.org/03prydq77'
  },
  orderBy: 'startDate:desc',
  itemsPerPage: 10,
  diffs: "All",
}

export const useUserSettingsStore = defineStore('user-settings', {
  state: () => ({
    dark: true,
    sortBy: [{ key: 'startDate', order: 'desc' }],
    projectFilters,
    token: null,
    user: null
  }),
  actions: {
    setToken(token: any) {
      this.token = token
    },
    setUser(user: any) {
      this.user = user
    },
    clearFilters() {
      this.projectFilters = projectFilters
    }
  },
  persist: true
})
