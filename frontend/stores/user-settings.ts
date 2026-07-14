import { defineStore } from 'pinia'

type CRIS = {
  id: number | null,
  name: string | null
  apiUrl: string | null
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
  oefos: '',
}

export const useUserSettingsStore = defineStore('user-settings', {
  state: () => ({
    dark: false,
    languages: { de: true, en: false },
    sortBy: [{ key: 'startDate', order: 'desc' }],
    projectFilters,
    token: null,
    user: null,
    cris: <CRIS>{
      id: null,
      name: null,
      apiUrl: null
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
    setCRIS(id: number, name: string, apiUrl: string) {
      console.log('Saving CRIS info in store:', { id, name })
      console.log('Current CRIS info:', this.cris)
      this.cris = {
        id,
        name,
        apiUrl
      }
    }
  },
  persist: true
})
