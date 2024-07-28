export const useApiUtils = () => {
  const getTemplates = async () => {
    return await $fetch(`/api/templates`)
  }

  const getTemplateId = async (id) => {
    return await $fetch(`/api/templates/${id}`)
  }

  return { getTemplates }
}
