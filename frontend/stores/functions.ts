import { defineStore } from 'pinia'

export const useFunctionStore = defineStore('function', {
  state: () => ({
    isEdit: true
  }),
  getters: {
  },
  actions: {
    reset () {
    },
    toggleEdit () {
      this.isEdit = !this.isEdit
    }
  },
  persist: false
})
