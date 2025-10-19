import localRegistry from '@/resources/ris-registry.json' with { type: "json" };

// For now we will just use these,
// because the `registry.json` also has research institutions,
// and we don't want to store them here.
const whiteListedIds = [
  "FWF", "FWF_Test"
]

function getLocalRegistryFile() {
  return localRegistry.member
}

export function updateFromRegistry() {
  var members = getLocalRegistryFile().filter(m => whiteListedIds.includes(m.id))
  return members
}

// === Registry v2 ===

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'RIS Registry v2' });

import { getAuthEndpointV2 } from './fa-oauth2-api.service.js'

type TopLevel = 'funding' | 'project'

type Endpoint = {
  majorVersion: number,
  minorVersion: number,
  name: string,
  url: string
}

export class Registry {
  infoURL: string
  endpoints = new Map<string, any[]>()

  constructor(
    public members?: Array<any>
  ) { }

  async getEndpoints(infoURL: string, clientId: string, clientSecret: string) {
    try {
      const response = await getAuthEndpointV2(infoURL, clientId, clientSecret)
      // log.info('Received the Registry Info', response)
      return response.endpoints
    } catch (error) {
      log.error('Error fetching authenticated Registry member', process.env.RIS_REGISTRY_URL)
    }
  }

  async findEndpoints(infoPage: string, clientId: string, clientSecret: string) {
    const endpoints = await this.getEndpoints(infoPage, clientId, clientSecret)

    if (endpoints && endpoints.funding) this.endpoints.set('funding', endpoints.funding)
    if (endpoints && endpoints.project) this.endpoints.set('project', endpoints.project)
  }

  async getURL(topLevel: TopLevel, name: string) {
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

    return endpoint.url
  }
}
