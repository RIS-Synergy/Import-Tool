import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('cris')
  return result
}

export default {
  listAll
}
