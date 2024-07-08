import { defineStore } from 'pinia'

type Pure = {
  pureId: number;
  uuid: string;
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    settings: {
      person: null,
      organization: null
    },
    pure: {
      item: null
    },
  }),
  getters: {
    double: (state) => state.count * 2,
    noEmptySetings: (state) => {
      console.log('state.settings', state.settings)

      return Object.values(state.settings)
        .every((value) => value !== null)
    }
  },
  actions: {
    setPerson(uuid: string) {
      this.settings.person = uuid;
    },
    setPure(pure: Pure) {
      this.pure = pure;
    }
  },
})
