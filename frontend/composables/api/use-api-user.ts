const logout = async (name: string) => {
  const store = useUserSettingsStore()
  const router = useRouter()

  store.setToken(null);
  store.setUser(null);

  // redirect
  router.push({ name: "login" });
  console.log('Logged out')
}

export default {
  logout
}
