import { Logger } from "tslog";
const log = new Logger({ name: 'utils:ri-api' });

export async function callRIApi(endpoint: string, method = 'POST', body = null) {
  const url = `${process.env.PURE_API_URL}${endpoint}`

  let response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      'api-key': process.env.PURE_API_KEY,
    },
    body: method === 'GET' ? null : JSON.stringify(body),
  })

  log.debug(`Response ${method} to ${endpoint} with status ${response.status}`)

  const data = await response.json().catch((error) => {
    log.error(`Error parsing response from Research Institution API`, error)
  })

  if (!response.ok) {
    return { error: null }
  }

  return data
}
