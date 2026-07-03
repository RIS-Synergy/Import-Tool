import { apiCall } from './use-api-utils'

const refresh = async () => {
  const store = useUserSettingsStore();
  const ssoCookie = useCookie('sso_backend_data');
  
  if (ssoCookie.value) {
    console.log('ssoCookie present; skip refresh');
    return;
  }

  if (!store.token) {
    console.log('No token; skip refresh')
    return;
  }

  const router = useRouter();
  const result = await apiCall('auth/refresh', 'GET')
  if (result && result.token) {
    store.setToken(result.token)
  }
};

export default function() {
  refresh()
}
