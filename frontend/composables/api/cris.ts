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

const searchForPeople = async (searchString: string) => {
  const store = useUserSettingsStore();
  const result = await apiCall('cris/search', 'POST', {
    body: JSON.stringify({
      query: searchString,
      crisId: store.cris || null,
      entityTypes: ['persons', 'external-persons'],
    }),
  })
  return result
}

const referenceApi = async (systemName: string, uuid: string) => {
  const store = useUserSettingsStore();
  const result = await apiCall('cris/reference', 'POST', {
    body: JSON.stringify({
      crisId: store.cris,
      systemName,
      uuid
    }),
  })
  return result
}

export default {
  listAll,
  searchApi,
  searchForPeople,
  referenceApi
}
