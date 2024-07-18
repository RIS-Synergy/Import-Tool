import { defineStore } from 'pinia'

type Pure = {
  pureId: number;
  uuid: string;
  risData: object;
}

const cleanSettings = {
  person: null,
  organization: null
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    settings: cleanSettings,
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
    },
    numberOfSettings: (state) => {
      return Object.values(state.settings)
        .filter((value) => value !== null)
        .length
    },
    totalNumOfSettings: (state) => {
      return Object.keys(state.settings).length
    }
  },
  actions: {
    setPerson(uuid: string) {
      this.settings.person = uuid;
    },
    setPure(pure: Pure) {
      this.pure = pure;
    },
    resetSettings() {
      this.settings = cleanSettings;
    }
  },
})
