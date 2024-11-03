import { apiCall } from './use-api-utils'

const refresh = async () => {
  const store = useUserSettingsStore();
  const result = await apiCall('auth/refresh', 'GET')
  if (result && result.token) {
    store.setToken(result.token)
  }
};

export default function() {
  refresh()
}
