export const useApiUtils = () => {
  const getTemplates = async () => {
    return await $fetch(`/api/templates`)
  }

  const getTemplateId = async (id) => {
    return await $fetch(`/api/templates/${id}`)
  }

  const setProjectId = async (store, route) => {
    const { id } = route.params
    if (!id) {
      console.log('no id', route.params.id)
    } else {
      console.log('id', id)
      const data = await $fetch(`/api/fa/projects/${id}`)
      store.risData = data.risData
    }

  }

  return { getTemplates, getTemplateId, setProjectId }
}
