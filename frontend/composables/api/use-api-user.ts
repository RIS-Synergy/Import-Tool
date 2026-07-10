const logout = async (name: string) => {
  const store = useUserSettingsStore()
  const router = useRouter()

  const isSSO = !!store.user?.email || !!store.user?.displayName;

  store.setToken(null);
  store.setUser(null);

  // Force Vue to flush watchers (this ensures pinia-plugin-persistedstate writes to localStorage)
  await nextTick();

  // Clear cookies
  useCookie('token', { path: '/' }).value = null;
  useCookie('sso_backend_data', { path: '/' }).value = null;

  try {
    const { logout: oidcLogout, currentProvider } = useOidcAuth()
    if (isSSO) {
      console.log('User logged in via SSO, redirecting to SSO logout...');
      // Fallback to 'keycloak' if currentProvider is undefined on client side
      await oidcLogout(currentProvider.value || 'keycloak')
      return // Stop execution, let OIDC handle the redirect to SSO logout
    }
  } catch (e) {
    console.warn('OIDC logout failed/ignored:', e)
  }

  // redirect (only for non-SSO users)
  router.push({ path: "/" });
  console.log('Logged out')
}

export default {
  logout
}
