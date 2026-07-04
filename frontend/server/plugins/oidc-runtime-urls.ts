export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const keycloak = config.oidc?.providers?.keycloak
  
  if (keycloak && keycloak.baseUrl) {
    const base = keycloak.baseUrl.replace(/\/$/, '')
    
    const resolveUrl = (url: string | undefined, defaultPath: string) => {
      if (!url || url.startsWith('/')) {
        return base + (url || defaultPath)
      }
      return url
    }

    keycloak.authorizationUrl = resolveUrl(keycloak.authorizationUrl, '/protocol/openid-connect/auth')
    keycloak.tokenUrl = resolveUrl(keycloak.tokenUrl, '/protocol/openid-connect/token')
    keycloak.userInfoUrl = resolveUrl(keycloak.userInfoUrl, '/protocol/openid-connect/userinfo')
    keycloak.logoutUrl = resolveUrl(keycloak.logoutUrl, '/protocol/openid-connect/logout')
  }
})
