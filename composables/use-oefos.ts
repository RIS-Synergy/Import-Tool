export const useOefos = () => {
  const getOefosID = (id) => {
    return $fetch(`/api/oefos/${id}`)
  }

  return { getOefosID }
}
