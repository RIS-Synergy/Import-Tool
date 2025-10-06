import { apiCall } from '../use-api-utils'

// This is an 'exception', other features have it as GET
// This is not good long-tern.
const listAll = async ({ page, itemsPerPage, sortBy, filters }) => {
  const result = await apiCall('project2', 'POST', {
    body: {
      page, itemsPerPage, sortBy, filters
    }
  })
  return result;
}

export default {
  listAll
}
