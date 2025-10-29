import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('fa2')
  return result
}

const startSync = async (id: string) => {
  const result = await apiCall(`fa2/${id}/sync`)
  return result
}

const deleteFa = async (id: string) => {
  const result = await apiCall(`fa2/${id}`, 'DELETE')
  return result
}

const updateFa = async (id: string, data: { clientId: string; clientSecret: string }) => {
  const result = await apiCall(`fa2/${id}`, "PUT", {
    body: data
  })
  return result
}

export default {
  listAll,
  startSync,
  deleteFa,
  updateFa
}
