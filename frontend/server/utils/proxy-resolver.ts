let resolvedProxy = ''

export async function resolveBackend() {
  if (resolvedProxy) return resolvedProxy
  if (process.env.BACKEND_API_PROXY) {
    resolvedProxy = process.env.BACKEND_API_PROXY
    return resolvedProxy
  }
  
  const targets = ['http://backend:3001', 'http://backend:3000', 'http://localhost:3031']
  for (const target of targets) {
    try {
      await fetch(target, { method: 'HEAD', signal: AbortSignal.timeout(1500) })
      resolvedProxy = target
      process.env.BACKEND_API_PROXY = target
      console.log(`✅ Dynamically resolved BACKEND_API_PROXY to ${target}`)
      return target
    } catch (e) {
      // ignore connection refused, timeout, etc
    }
  }
  
  resolvedProxy = targets[2]
  process.env.BACKEND_API_PROXY = targets[2]
  console.log(`⚠️ Fallback BACKEND_API_PROXY to ${targets[2]}`)
  return resolvedProxy
}
