import { apiCall } from './use-api-utils'

const refresh = async () => {
  const store = useUserSettingsStore();
  if (!store.token) {
    console.log('No token; skip refresh')
    return;
  }

  const router = useRouter();
  const result = await apiCall('auth/refresh', 'GET')
  if (result && result.token) {
    store.setToken(result.token)
  } else {
    // redirect to /login
    console.log('Redirect to login')
    router.push({ name: "login" });
  }
};

export default function() {
  refresh()
}
