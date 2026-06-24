<template>
  <NuxtLayout>
    <!-- This should be fine. (changed at 2025-02-09) -->
    <!-- <ClientOnly> -->
      <NuxtPage />
      <!-- </ClientOnly> -->
    <Snackbar />
  </NuxtLayout>
</template>

<script setup>
const { loggedIn, user } = useOidcAuth()
const store = useUserSettingsStore()
const { apiCall } = useApiUtils()

if (import.meta.client) {
  watchEffect(async () => {
    if (loggedIn.value && user.value && user.value.accessToken && !store.token) {
      console.log("🟢 SSO Login session detected. Provider data:", user.value)
      console.log("Exchanging token with backend...")
      try {
        const result = await apiCall("auth/sso-login", "POST", {
          body: JSON.stringify({ token: user.value.accessToken })
        })
        if (result && result.token) {
          store.setToken(result.token)
          store.setUser(result.user)
          console.log("SSO login sync completed successfully.")
          console.log("Everything from SSO Provider:", user.value)
          // await navigateTo({ name: "dashboard" }, { replace: true })
        }
      } catch (e) {
        console.error("SSO token exchange failed:", e)
      }
    }
  })
}
</script>
