import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    settings: {
      personUUID: null
    }
  }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    setPerson(uuid: string) {
      this.settings.personUUID = uuid;
    },
  },
})
