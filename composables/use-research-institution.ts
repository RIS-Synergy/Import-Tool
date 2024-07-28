export const useResearchInstitution = () => {
  const getProjectUUID = async (id) => {
    try {
      // try to find the ID as a search in the RI API
      const item = `ris:FWF:project:${id}`;
      const result = await $fetch(`/api/ri/project/${item}`);
      return result
    } catch(error) {
      // unknown error
      return { uuid: null }
    }
  }

  const uploadToPure = async (ris, settings, uuid, templateId) => {
    const result = await $fetch("/api/ri/upload", {
      method: "POST",
      body: JSON.stringify({
        ris,
        settings,
        uuid,
        templateId
      }),
    });
    return result
  }

  const loadProject = async (id, store) => {
    const { item, count } = await getProjectUUID(id)
    store.pure = item
  }

  return { getProjectUUID, uploadToPure, loadProject }
}
