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
      crisId: store.cris.id || null,
    }),
  })
  return result
}

const searchForPeople = async (searchString: string) => {
  const store = useUserSettingsStore();
  const result = await apiCall('cris/search', 'POST', {
    body: JSON.stringify({
      query: searchString,
      crisId: store.cris.id || null,
      entityTypes: ['persons', 'external-persons'],
    }),
  })
  return result
}

const referenceApi = async (systemName: string, uuid: string) => {
  const store = useUserSettingsStore();
  const result = await apiCall('cris/reference', 'POST', {
    body: JSON.stringify({
      crisId: store.cris.id,
      systemName,
      uuid
    }),
  })
  return result
}

const uploadApi = async (data: any) => {
  const store = useUserSettingsStore();
  const body = {
    ...data,
    crisId: store.cris.id,
  }
  const result = await apiCall('cris/upload', 'POST', {
    body: JSON.stringify(body),
  })
  return result
}

export default {
  listAll,
  searchApi,
  searchForPeople,
  referenceApi,
  uploadApi
}
