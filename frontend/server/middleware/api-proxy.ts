import { defineEventHandler, proxyRequest } from 'h3'
import { resolveBackend } from '../utils/proxy-resolver'

export default defineEventHandler(async (event) => {
  const pathname = event.node.req.url || ''

  if (pathname.match(/^\/api(\/|\?|$)/)) {
    const proxyBase = await resolveBackend()
    // Strip the /api prefix
    const targetUrl = proxyBase + pathname.replace(/^\/api/, '')

    // without /api, add a few emojis based on port and show the method and statuscode
    console.log(
      `🔗 [Proxy] ${event.node.req.method} ${pathname} -> ${targetUrl}`)

    return proxyRequest(event, targetUrl)
  }
})
