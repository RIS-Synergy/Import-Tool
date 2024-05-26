import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    personUUID: null
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    setPerson(uuid: string) {
      this.personUUID = uuid;
    },
  },
})
