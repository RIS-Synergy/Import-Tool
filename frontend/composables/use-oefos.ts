export const useOefos = () => {
  const getOefosID = async (id) => {
    return await $fetch(`/api/oefos/${id}`)
  }

  return { getOefosID }
}
