export const useApiUtils = () => {
  const getTemplates = async (type) => {
    return await $fetch(`/api/templates/${type}`)
  }

  const getTemplateId = async (id) => {
    return await $fetch(`/api/templates/${id}`)
  }

  const setProjectId = async (store, route) => {
    const risId = store.risData && store.risData.id
    console.log(
      'id', route.params.id,
      'ris id', risId,
      'same', route.params.id === risId
    )

    if (route.params.id !== risId) {
      console.log('reset project store')
      store.resetSettings()
      store.risData = null
      store.crisId = null
      store.crisUUID = null
      store.crisData = null
    }

    const { id } = route.params
    if (!id) {
      // console.log('no id', route.params.id)
    } else {
      // console.log('id', id)
      const data = await $fetch(`/api/fa/projects/${id}`)
      store.risData = data.risData
      store.crisId = data.crisId
      store.crisUUID = data.crisUUID
    }
  }

  return { getTemplates, getTemplateId, setProjectId }
}
