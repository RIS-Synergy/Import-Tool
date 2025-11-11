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

  const result = await apiCall(`cris/refreshDiff/${risId}`, "POST", {
    body: JSON.stringify({
      crisId: store.cris.id,
      systemName,
      uuid,
    }),
  });
  return result;
}

export default {
  refreshDiff
}
