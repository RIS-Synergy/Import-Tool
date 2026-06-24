const logout = async (name: string) => {
  const store = useUserSettingsStore()
  const router = useRouter()

  store.setToken(null);
  store.setUser(null);

  try {
    const { logout: oidcLogout, loggedIn } = useOidcAuth()
    if (loggedIn.value) {
      await oidcLogout()
    }
  } catch (e) {
    console.warn('OIDC logout failed/ignored:', e)
  }

  // redirect
  router.push({ name: "login" });
  console.log('Logged out')
}

export default {
  logout
}
