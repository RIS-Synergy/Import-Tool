import { defineStore } from 'pinia'

type Alert = {
  title: string;
  details: any
}

export const useAlertStore = defineStore('alert', {
  state: () => ({
    info: null as Alert | null,
    error: null as Alert | null,
    color: null as string | null,
  }),
  getters: {
    details: (state) => {
      return state.info?.details || state.error?.details
    },
    title: (state) => {
      return state.info?.title || state.error?.title
    }
  },
  actions: {
    reset() {
      this.info = null
      this.error = null
      this.color = null
    },
    setInfo(title: string, details: any) {
      this.info = {
        title,
        details
      }
      this.error = null;
      this.color = 'info';
    },
    setError(title: string, error: any) {
      this.error = {
        title,
        details: error
      }
      this.info = null;
      this.color = 'error';
    },
  },
  persist: false
})
