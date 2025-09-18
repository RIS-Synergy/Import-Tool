import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('user')
  return result
}

export default {
  listAll
}
