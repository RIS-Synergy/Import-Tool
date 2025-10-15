import { apiCall } from '../use-api-utils'

const listAll = async () => {
  const result = await apiCall('cris')
  return result
}

const searchApi = async (searchString: string) => {
  const store = useUserSettingsStore();
  const result = await apiCall('cris/search', 'POST', {
    body: JSON.stringify({
      query: searchString,
      crisId: store.cris || null,
    }),
  })
  return result
}

export default {
  listAll,
  searchApi,
}
