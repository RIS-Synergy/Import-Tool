import { defineStore } from 'pinia'

const cleanSettings = {
  person: null,
  organization: null,
}

type Pure = {
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    settings: cleanSettings,

    template: {
      projectId: null,
      applicationId: null,
      awardId: null,
      data: null,
    },
    // templateId: null, // default template XXX
    // pure: { // TODO remove, we are not using 'store.pure' anywhere
    //   // item: null
    // },
    risData: null,
    crisId: null,
    crisUUID: null,
    crisData: null,

    error: null,
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
    },
  },
  actions: {
    setPerson(uuid: string) {
      this.settings.person = uuid;
    },
    setPure(pure: Pure) {
      this.crisUUID = pure.uuid;
      this.crisId = pure.pureId;
    },
    resetSettings() {
      this.settings = cleanSettings;
    },
    setSettings(config: { person: string, organization: string }) {
      this.settings.person = config.valuePerson || null
      this.settings.organization = config.valueOrganization || null
    },
    setError(error: any, area: string) {
      this.error = error;
      this.error.area = area;
    },
    resetError () {
      this.error = null
    }
  },
  persist: true
})
