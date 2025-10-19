import { Logger } from "../utils/logger.js";
const log = new Logger({ name: 'utils:ri-api' });

import { ResearchInstitutionError } from '@/utils/errors.js'

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

  log.debug(`>>> ${method} ${endpoint}`)
  let response: Response

  try {
    response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        'api-key': process.env.RIS_RI_API_KEY,
      },
      // mode: 'no-cors',
      // mode: 'cors',
      body: method === 'GET' ? null : JSON.stringify(body),
    })
  } catch (error) {
    // if it's an ConnectTimeoutError, show warning
    if (error.cause.name === 'ConnectTimeoutError') {
      log.warn('ConnectTimeoutError', endpoint, error.cause.message)
      throw new ResearchInstitutionError('ConnectTimeoutError', method, endpoint, 500)
    } else {
      log.error(`Error calling RI-API [legacy callRIApi()]`, error)
      throw new ResearchInstitutionError(error.errors || error.title, method, endpoint, 500)
    }
  }

  const contentType: string = response.headers.get("content-type")
  log.debug(`<<< ${response.status} ${endpoint}`)

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
    throw new ResearchInstitutionError(error.detail || error.title, method, endpoint, response.status)
  }

  return {
    detail: `Unknown content-type: ${contentType}`
  } as CRISError
}
