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
  const snackbar = useSnackbar();

  const store = useUserSettingsStore();
  const body = {
    ...data,
    crisId: store.cris.id,
  }
  const result = await apiCall('cris/upload', 'POST', {
    body: JSON.stringify(body),
  })

  if (result && !result.error) {
    snackbar.info('Upload successful')
  }

  return result
}

const diffRILikelihood = async (risId: string) => {
  const store = useUserSettingsStore();
  if (!store.cris.id) {
    return [];
  }
  const result = await apiCall(`cris/likelihood/${risId}`, 'POST', {
    body: JSON.stringify({
      crisId: store.cris.id
    }),
  })
  return result;
}

const getDiffs = async (
  risId: string,
  systemName: string,
  uuid: string,
  templateId: number,
  externalEntityId?: number,
) => {

  const store = useUserSettingsStore();
  if (!store.cris.id) {
    return [];
  }

    // const projectStore = useProjectStore();

    if (!templateId) {
      return null;
    }

    // if (!hasCRIS()) return
    const result = await apiCall(`cris/getDiffs/${risId}`, "POST", {
      body: JSON.stringify({
        crisId: store.cris.id,
        systemName,
        uuid,
        templateId,
        externalEntityId
      }),
    });
    return result;
  }

type ClusterWrapper = {
  cluster: {
    systemName: string
    uuid: string
  };
};

const assignCluster = async (projectUUID: string, item: ClusterWrapper) => {
  const { cris } = useUserSettingsStore();

  const systemName = item.cluster.systemName
  const clusterUUID = item.cluster.uuid

  const snackbar = useSnackbar();
  const result = await apiCall('cris/assignCluster', 'POST', {
    body: JSON.stringify({
      crisId: cris.id,
      projectUUID,
      applicationUUID: systemName === 'ApplicationCluster' ? clusterUUID : null,
      awardUUID: systemName === 'AwardCluster' ? clusterUUID : null,
    }),
  })
  if (result && !result.error) {
    snackbar.info('Upload successful')
  } else {
    snackbar.error(result.error)
  }
  return result;
}

const discoverExternalEntities = async (thisCrisId: number) => {
  const { cris } = useUserSettingsStore();

  const result = await apiCall('cris/discoverExternalEntities', 'POST', {
    body: JSON.stringify({
      crisId: cris.id,
      thisCrisId,
    }),
  })
  return result;
}

const createApi = async (name: string, apiUrl: string) => {
  const result = await apiCall('cris', 'POST', {
    body: JSON.stringify({
      name,
      apiUrl
    }),
  })
  return result;
}

const deleteApi = async (id: number) => {
  const result = await apiCall(`cris/${id}`, 'DELETE')
  return result;
}

export default {
  listAll,
  searchApi,
  searchForPeople,
  referenceApi,
  uploadApi,
  diffRILikelihood,
  getDiffs,
  assignCluster,
  discoverExternalEntities,
  createApi,
  deleteApi,
}
