import { ofetch } from "ofetch";
import { getAuthEndpoint } from '../utils/oauth2'

import { Logger } from "../utils/logger";
const log = new Logger({ name: 'RIS Registry' });

const registryURL = 'https://forschungsdaten.at/registry/registry.json'

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
    console.error('Error fetching registry', error)
  }
}

export class Registry {
  static infoURL: string
  static endpoints = new Map<string, Endpoint[]>()

  static async getEndpoints(infoURL: string) {
    try {
      const response = await getAuthEndpoint(infoURL)
      // log.info('Received the Registry Info', response)
      return response.endpoints
    } catch (error) {
      console.error('Error fetching registry', error)
    }
  }

  static async saveProcessEnv(key: string, value: string) {
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

  static async run() {
    const memberId = process.env.RIS_MEMBER_ID
    if (!memberId) {
      log.error('RIS_MEMBER_ID is not defined')
      return
    }

    const members = await fetchRegistry()
    const member = members.find((member: Member) => member.id === memberId)

    Registry.saveProcessEnv('AUTH_SERVER', member.oauth2)
    const endpoints = await Registry.getEndpoints(member.info)
    Registry.endpoints.set('funding', endpoints.funding)
    Registry.endpoints.set('project', endpoints.project)
  }

  static getURL (topLevel: TopLevel, name: string) {
    const endpoints = Registry.endpoints.get(topLevel)
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
