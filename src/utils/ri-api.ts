import { Logger } from "tslog";
const log = new Logger({ name: 'utils:ri-api'});

export async function callRIApi (endpoint, method = 'POST', body = null) {
  const url = `${process.env.PURE_API_URL}${endpoint}`
  // log.info('url', url)

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      'api-key': process.env.PURE_API_KEY,
    },
    body: method === 'GET' ? null : JSON.stringify(body),
  })

  // log.debug(`Received Research Institution URL: ${url}`)

  if (!response.ok) {
    const error = await response.json()
    log.error(`Error calling Research Institution API`, error)
    return { error }
  }

  return response.json()
}
