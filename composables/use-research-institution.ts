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

  const uploadToPure = async () => {
    const { settings } = store.$state;

    // console.log("uploading to pure", item);
    // console.log("personUUID", personUUID);
    const x = await $fetch("/api/ri/upload", {
      method: "POST",
      body: JSON.stringify({
        input: data.value,
        ris: item,
        settings,
      }),
    });
    console.log(x);
  }

  return { getProjectUUID, uploadToPure }
}
