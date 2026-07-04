export default defineNitroPlugin((nitroApp) => {
  const redact = (val?: string) => val ? val.substring(0, 3) + '***' : val;

  // Keycloak
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET:', redact(process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET))
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI)
  // OIDC Secrets
  console.log('🔗 [Runtime] NUXT_OIDC_SESSION_SECRET:', redact(process.env.NUXT_OIDC_SESSION_SECRET))
  console.log('🔗 [Runtime] NUXT_OIDC_TOKEN_KEY:', redact(process.env.NUXT_OIDC_TOKEN_KEY))
  console.log('🔗 [Runtime] NUXT_OIDC_AUTH_SESSION_SECRET:', redact(process.env.NUXT_OIDC_AUTH_SESSION_SECRET))
})
