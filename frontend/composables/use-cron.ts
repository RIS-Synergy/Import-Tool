const refresh = async () => {
  const router = useRouter();
  const store = useUserSettingsStore();
  var result
  try {
    result = await $fetch(
      '/api/auth/refresh',
      {
        // method: "POST",
        headers: {
          Authorization: `Bearer ${store.token}`
        }
      });
  } catch (e: any) {
    console.error(e, result);
    if (e.status === 401) {
      console.error("Unauthorized")
      router.push({ name: "login" });
    }
  }
  store.token = result.token
  return result;
};

export default function() {
  console.log('refresh token')
  refresh()
}
