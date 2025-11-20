import { apiCall } from '../use-api-utils'

const refreshDiff = async (
  risId: string,
  systemName: string,
  uuid: string,
) => {
  const store = useUserSettingsStore();
  if (!store.cris.id) {
    return
  }

  const { template, settings } = useProjectStore()
  const templateId = template[systemName.toLowerCase() + "Id"]

  const result = await apiCall(`cris/refreshDiff/${risId}`, "POST", {
    body: JSON.stringify({
      crisId: store.cris.id,
      systemName,
      uuid,
      templateId,
      settings
    }),
  });
  return result;
}

const diffSync = async (thisCrisId: number) => {
  const { cris } = useUserSettingsStore();

  const result = await apiCall('cris/diffSync', 'POST', {
    body: JSON.stringify({
      crisId: cris.id,
      thisCrisId,
    }),
  })
  return result;
}

export default {
  refreshDiff,
  diffSync
}
