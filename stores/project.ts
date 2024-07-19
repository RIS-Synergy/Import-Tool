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
    risData: {}
  }),
  getters: {
    noEmptySetings: (state) => {
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
    },
    sameNum: (state) => {
      return state.numberOfSettings === state.totalNumOfSettings
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
