import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('ri')
  return result
}

export default {
  listAll
}
