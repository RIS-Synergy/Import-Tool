export default defineNitroPlugin((nitroApp) => {
  const redact = (val?: string) => val ? val.substring(0, 3) + '***' : val;

  // Keycloak
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET:', redact(process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET))
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_AUTHORIZATION_URL:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_AUTHORIZATION_URL)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_TOKEN_URL:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_TOKEN_URL)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_USER_INFO_URL:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_USER_INFO_URL)
  console.log('🔗 [Runtime] NUXT_OIDC_PROVIDERS_KEYCLOAK_LOGOUT_URL:', process.env.NUXT_OIDC_PROVIDERS_KEYCLOAK_LOGOUT_URL)
  // OIDC Secrets
  console.log('🔗 [Runtime] NUXT_OIDC_SESSION_SECRET:', redact(process.env.NUXT_OIDC_SESSION_SECRET))
  console.log('🔗 [Runtime] NUXT_OIDC_TOKEN_KEY:', redact(process.env.NUXT_OIDC_TOKEN_KEY))
  console.log('🔗 [Runtime] NUXT_OIDC_AUTH_SESSION_SECRET:', redact(process.env.NUXT_OIDC_AUTH_SESSION_SECRET))

  const config = useRuntimeConfig();
  const oidcConfig = (config.oidc as any)?.providers?.keycloak || {};
  
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_BASE_URL:', oidcConfig.baseUrl)
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_ID:', oidcConfig.clientId)
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_CLIENT_SECRET:', redact(oidcConfig.clientSecret))
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_REDIRECT_URI:', oidcConfig.redirectUri)
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_AUTHORIZATION_URL:', oidcConfig.authorizationUrl)
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_TOKEN_URL:', oidcConfig.tokenUrl)
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_USER_INFO_URL:', oidcConfig.userInfoUrl)
  console.log('🔗 [Config] NUXT_OIDC_PROVIDERS_KEYCLOAK_LOGOUT_URL:', oidcConfig.logoutUrl)
})
