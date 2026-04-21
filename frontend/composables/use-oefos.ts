import { useOefosStore } from '~/stores/oefos'

export const useOefos = () => {
  const store = useOefosStore()

  const getOefosID = async (id) => {
    return await $fetch(`/api/oefos/${id}`)
  }

  const loadAll = async () => {
    await store.fetchAll()
  }

  const getTree = (lang: 'de' | 'en' = 'de') => {
    return store.getTree(lang)
  }

  return { 
    getOefosID,
    loadAll,
    getTree,
    loading: computed(() => store.loading),
    loaded: computed(() => store.loaded)
  }
}
