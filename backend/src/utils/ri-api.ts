import { Logger } from "tslog";
const log = new Logger({ name: 'utils:ri-api' });

import { ResearchInstitutionError } from '../utils/errors'

type RISResult = {
  error?: any
  items?: any
  count?: number
}

type CRISError = {
  detail: string
}
export async function callRIApi(endpoint: string, method = 'POST', body = null): Promise<any> {
  const url = `${process.env.PURE_API_URL}${endpoint}`

  log.debug(`Fetching ${method} to ${url}`)

  let response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      'api-key': process.env.PURE_API_KEY,
    },
    // mode: 'no-cors',
    // mode: 'cors',
    body: method === 'GET' ? null : JSON.stringify(body),
  })

  const contentType: string = response.headers.get("content-type")
  log.debug(`Response ${method} to ${endpoint} with status ${response.status} with content-type: ${contentType}`)
  // console.log(response)

  if (response.status === 500) {
    log.warn('Body status 500 >>>>>>>>>>', body)
  }

  if (response.redirected) {
    const err: CRISError = {
      detail: `Redirected to ${response.url}`
    }
    log.error(`Redirected to ${response.url}`)
    return {
      error: err
    }
  }
  else if (contentType.startsWith('application/json')) {
    const data = await response.json().catch((error) => {
      log.error(`Error parsing response from RI-API`, error)
      return { error }
    })

    if (!response.ok) {
      return { error: data }
    }

    return data
  }
  else if (contentType.startsWith('application/problem+json')) {
    const error = await response.json()
    log.error(`Error from RI-API`, error)
    throw new ResearchInstitutionError(error.detail || error.title, method, endpoint, response.status)
  }

  return {
    detail: `Unknown content-type: ${contentType}`
  } as CRISError
}
