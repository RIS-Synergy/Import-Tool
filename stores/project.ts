import { defineStore } from 'pinia'

type Pure = {
  pureId: number;
  uuid: string;
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    settings: {
      personUUID: null
    },
    pure: {
      item: null
    },
  }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    setPerson(uuid: string) {
      this.settings.personUUID = uuid;
    },
    setPure(pure: Pure) {
      this.pure = pure;
    }
  },
})
