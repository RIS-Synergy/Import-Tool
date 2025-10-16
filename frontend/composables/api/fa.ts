import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('fa2')
  return result
}

export default {
  listAll,
}
