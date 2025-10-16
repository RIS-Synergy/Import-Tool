import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('fa2')
  return result
}

const startSync = async (id: string) => {
  const result = await apiCall(`fa2/${id}/sync`)
  return result
}

export default {
  listAll,
  startSync
}
