import { defineStore } from 'pinia'

export const useUserSettingsStore = defineStore('user-settings', {
  state: () => ({
    dark: true,
    itemsPerPage: 10,
    sortBy: [ { key: 'startDate', order: 'asc' } ],
    projectFilters: []
  }),
  actions: {
    // toggleDark() {
    //   theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
    //   state.dark = theme.global.current.value.dark
    // }
  },
  persist: true
})
