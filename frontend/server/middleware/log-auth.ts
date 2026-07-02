import { defineEventHandler, getRequestURL, sendRedirect, setCookie } from 'h3'
import { getUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.js'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const pathname = url.pathname

  // logs for the POST parameters

  // Intercept authentication-related endpoints
  if (pathname.startsWith('/auth/') || pathname.includes('/api/auth/')) {
    console.log(`\n🔑 [OIDC Dev Log] --- Incoming Auth Request ---`)
    console.log(`   Path:   ${pathname}`)
    console.log(`   Method: ${event.node.req.method}`)

    if (url.search) {
      console.log(`   Query:  ${url.search}`)
    }

    try {
      const session = await getUserSession(event)
      console.log(`   Session Retrieved:`, session ? 'Yes' : 'No')

      if (session && Object.keys(session).length > 0) {
        console.log(`   Session Details:`, JSON.stringify(session, null, 2))

        let backendData = null;
        try {
          const backendProxy = process.env.BACKEND_API_PROXY || 'http://localhost:3000'
          const backendUrl = backendProxy.replace(/\/$/, '') + '/auth/sso-login'

          const result = await fetch(backendUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              frontendData: session,
              // attempt to pass the token if it exists in the session object
              token: (session as any)?.accessToken || (session as any)?.tokens?.access_token || ''
            })
          })
          
          if (result.headers.get('content-type')?.includes('application/json')) {
            backendData = await result.json();
            console.log(`🔑---- Backend JSON:`, backendData)
          } else {
            console.log(`🔑---- Backend Response Status:`, result.status)
          }
        } catch (backendError: any) {
          console.log(`   Failed to send to backend:`, backendError?.message || backendError)
        }

        // Redirect browser requests to /dashboard with session data
        if (!pathname.startsWith('/api/')) {
          // Send only the backend data in the cookie to avoid exceeding the 4KB browser cookie limit.
          const payload = {
            backendData
          }
          const base64Session = Buffer.from(JSON.stringify(payload)).toString('base64')
          setCookie(event, 'sso_backend_data', base64Session, { path: '/', maxAge: 60 })
          
          let redirectUrl = '/dashboard';
          const permissions = backendData?.user?.permission || [];
          if (permissions.length === 0) {
            redirectUrl = '/new-user';
          }
          
          return sendRedirect(event, redirectUrl, 302)
        }
      } else {
        console.log(`   Session: None/Empty`)
      }
    } catch (error: any) {
      console.log(`   Session Check Error:`, error?.message || error)
    }
    console.log(`🔑 [OIDC Dev Log] -------------------------------\n`)
  }
})
