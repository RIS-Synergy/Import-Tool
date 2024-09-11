import { defineStore } from 'pinia'

export const useTemplateStore = defineStore('template', {
  state: () => ({
    templateType: null,
    templateId: null,
    templateTitle: 'my template'
  }),
  getters: {
    // noEmptySetings: (state) => {
    //   return Object.values(state.settings)
    //     .every((value) => value !== null)
    // },
    // numberOfSettings: (state) => {
    //   return Object.values(state.settings)
    //     .filter((value) => value !== null)
    //     .length
    // },
    // totalNumOfSettings: (state) => {
    //   return Object.keys(state.settings).length
    // },
    // sameNum: (state) => {
    //   return state.numberOfSettings === state.totalNumOfSettings
    // },
  },
  actions: {
    // setPerson(uuid: string) {
    //   this.settings.person = uuid;
    // },
    // setPure(pure: Pure) {
    //   this.pure = pure;
    // },
    reset () {
      this.templateId = null;
      this.templateType = null;
    },
    // setSettings(config: { person: string, organization: string }) {
    //   this.settings.person = config.valuePerson
    //   this.settings.organization = config.valueOrganization
    // }
  },
})
