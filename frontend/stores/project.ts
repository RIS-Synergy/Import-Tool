import { defineStore } from 'pinia'

const cleanSettings = {
  person: null,
  organization: null,
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
    crisData: null
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
      this.pure = pure;
    },
    resetSettings() {
      this.settings = cleanSettings;
    },
    setSettings(config: { person: string, organization: string }) {
      this.settings.person = config.valuePerson
      this.settings.organization = config.valueOrganization
    }
  },
})
