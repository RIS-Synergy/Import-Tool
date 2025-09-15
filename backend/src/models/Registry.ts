import { ofetch } from "ofetch";
import { getAuthEndpoint } from '../utils/oauth2.js'

import { Logger } from "../utils/logger.js";
const log = new Logger({ name: 'RIS Registry' });

const registryURL = process.env.RIS_REGISTRY_URL

type Member = {
  id: string,
  acronym: string,
  name: string,
  contact: string,
  oauth2: string,
  info: string
}

type Endpoint = {
  majorVersion: number,
  minorVersion: number,
  name: string,
  url: string
}

type TopLevel = 'funding' | 'project'

async function fetchRegistry() {
  try {
    const response = await ofetch(registryURL)
    return response.member
  } catch (error) {
    console.error('Error fetching registry', registryURL)
    return null
  }
}

function getLocalRegistryFile() {
  const localRegistry = require('../../resources/ris-registry.json')
  return localRegistry.member
}

export class Registry {
  infoURL: string
  endpoints = new Map<string, Endpoint[]>()

  constructor(
    public members?: Array<Member>
  ) { }

  async getEndpoints(infoURL: string) {
    try {
      const response = await getAuthEndpoint(infoURL)
      // log.info('Received the Registry Info', response)
      return response.endpoints
    } catch (error) {
      log.error('Error fetching authenticated Registry member', process.env.RIS_REGISTRY_URL)
    }
  }

  async saveProcessEnv(key: string, value: string) {
    if (process.env[key]) {
      log.warn(`${key} already set to ${process.env[key]}`)
      return
    }
    try {
      process.env[key] = value
      log.debug(`${key}=${value}`)
    } catch (error) {
      log.error('Error saving to process.env', error)
    }
  }

  async run() {
    const memberId = process.env.RIS_MEMBER_ID
    if (!memberId) {
      log.error('RIS_MEMBER_ID is not defined')
      return
    }

    var members = getLocalRegistryFile()
    const remoteRegistry = await fetchRegistry()
    if (remoteRegistry) {
      members = remoteRegistry
    } else {
      log.warn('Using local registry file')
      // return
    }

    const member = members.find((member: Member) => member.id === memberId)

    this.saveProcessEnv('AUTH_SERVER', member.oauth2)
    const endpoints = await this.getEndpoints(member.info)
    // log.info(`Registry endpoints:`, endpoints)

    if (endpoints && endpoints.funding) this.endpoints.set('funding', endpoints.funding)
    if (endpoints && endpoints.project) this.endpoints.set('project', endpoints.project)
  }

  getURL(topLevel: TopLevel, name: string) {
    const endpoints = this.endpoints.get(topLevel)
    if (!endpoints) {
      log.error(`No endpoints for ${topLevel}`)
      return
    }

    const endpoint = endpoints.find((endpoint: Endpoint) => endpoint.name === name)
    if (!endpoint) {
      log.error(`No endpoint for ${name} under ${topLevel}`)
      return
    }

    log.warn('------', endpoint)

    return endpoint.url
  }
}
