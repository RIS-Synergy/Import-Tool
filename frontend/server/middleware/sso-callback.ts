import { defineEventHandler, getRequestURL, sendRedirect, setCookie } from 'h3'
import { getUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.js'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  if (!pathname.startsWith('/auth/') && !pathname.includes('/api/auth/')) return
  if (pathname.startsWith('/api/')) return
  if (pathname.includes('/logout')) return

  const session = await getUserSession(event).catch(() => null)
  if (!session || Object.keys(session).length === 0) return

  const backendProxy = process.env.BACKEND_API_PROXY || ''
  const backendUrl = backendProxy.replace(/\/$/, '') + '/auth/sso-login'
  console.log(`🧑‍🦰---- Backend URL:`, backendUrl)
  // const backendUrl = "/auth/sso-login"

  try {
    const result = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        frontendData: session,
        token: (session as any)?.accessToken || (session as any)?.tokens?.access_token || ''
      })
    })

    if (!result.ok) {
      let errorText = await result.text()
      console.error(`❌ SSO Backend Sync failed (${result.status}):`)
      console.error(`   Response: ${errorText}`)
      return
    }

    if (!result.headers.get('content-type')?.includes('application/json')) return

    const backendData = await result.json()
    const base64Session = Buffer.from(JSON.stringify({ backendData })).toString('base64')

    setCookie(event, 'sso_backend_data', base64Session, { path: '/', maxAge: 60 })

    console.log(`🧑‍🦰---- Sending Session Data to Backend:`, JSON.stringify(session, null, 2))
    const permissions = backendData?.user?.permission || []
    return sendRedirect(event, permissions.length === 0 ? '/new-user' : '/dashboard', 302)
  } catch (error) {
    console.error('SSO Callback Error:', error)
  }
})
