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

  const { template } = useProjectStore()
  const templateId = template[systemName.toLowerCase() + "Id"]

  const result = await apiCall(`cris/refreshDiff/${risId}`, "POST", {
    body: JSON.stringify({
      crisId: store.cris.id,
      systemName,
      uuid,
      templateId
    }),
  });
  return result;
}

export default {
  refreshDiff
}
