import { defineStore } from 'pinia'

type CRIS = {
  id: string | null,
  name: string | null
}

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
    user: null,
    cris: {
      id: null,
      name: null
    }
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
    },
    setCRIS(id: string, name: string) {
      this.cris.id = id
      this.cris.name = name
    }
  },
  persist: true
})
