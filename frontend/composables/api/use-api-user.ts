const store = useUserSettingsStore()
const router = useRouter()

const logout = async (name: string) => {
  store.setToken(null);
  store.setUser(null);

  // redirect
  router.push({ name: "login" });
  console.log('Logged out')
}

export default {
  logout
}
