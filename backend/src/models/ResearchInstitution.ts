import { callRIApi } from '../utils/ri-api'
import { ResearchInstitutionError } from '../utils/errors'
import { Logger } from "../utils/logger";
const log = new Logger({ name: 'model:RI' });
import _ from 'lodash/fp';

type RISystemID = 'Pure' | 'Custom'
type Category = 'Project' | 'Application' | 'Award'
type risId = string

type Note = {
  entity: string
  uuid: string
  text: string
  username: string
}

type Method = 'GET' | 'POST' | 'PUT' // | 'DELETE'

class RISystem {
  systemId: RISystemID
  categoryRequestMap: Map<Category, string> = new Map()

  constructor() {
    this.categoryRequestMap.set('Project', '/projects/search')
    this.categoryRequestMap.set('Application', '/applications/search')
    this.categoryRequestMap.set('Award', '/awards/search')
  }
}

class Pure extends RISystem {
  systemId: RISystemID = 'Pure'
  constructor() {
    super()
  }
}

class CustomSystem extends RISystem {
  systemId: RISystemID = 'Custom'
  constructor() {
    super()
  }
}

export class ResearchInstitution {
  system: RISystem
  searchSizeMax = 100

  constructor() {
    this.system = new Pure()
  }

  getCategory = async (category: Category, id: risId) => {
    const result = await callRIApi(`/projects/${id}`, 'GET')
    return result
  }

  getEndpointFromEntity(entityTitle: string) {
    if (entityTitle === 'Project') {
      return 'projects'
    }
    if (entityTitle === 'Application') {
      return 'applications'
    }
    if (entityTitle === 'Award') {
      return 'awards'
    }
    log.error(`Entity ${entityTitle} not found. Useing 'projects' as default.`)
    return 'projects'
  }

  // move or move to 'getEntityData' below
  // getProjectData = async (uuid: string, entityTitle = 'Project') => {
  //   const endpoint = this.getEndpointFromEntity(entityTitle)
  //   let result: any
  //   try {
  //     result = await callRIApi(`/${endpoint}/${uuid}`, 'GET')
  //   } catch (error) {
  //     log.error('Error getting project data', error)
  //     return null
  //   }
  //   return result
  // }

  // we can replace this by project...
  getEntityData = async (entityFolder: string, uuid: string) => {
    const endpoint = this.getEndpointFromEntity(entityFolder)
    let result: any
    try {
      result = await callRIApi(`/${endpoint}/${uuid}`, 'GET')
    } catch (error) {
      log.error(`Error getting entity (${entityFolder}) data`, error)
      return null
    }
    return result
  }

  entityTypes = [
    'projects',
    'applications',
    'awards',
    'persons',
    'external-persons',
  ]

  async searchCategories(searchString: string, entityTypes: string[] = this.entityTypes) {
    var results = []

    const promises = entityTypes.map(entityType =>
      this.callApi(`/${entityType}/search`, 'POST', {
        size: 10,
        offset: 0,
        searchString
      }).then((result: any) => {
        // console.log('SearchResults', result)

        result.items.map((item: any) => {
          results.push({
            ...item,
            // pureId: item.pureId,
            // uuid: item.uuid,
            // name: item.name,
            // title: item.title,
            // entity: entityType,
            // modifiedDate: item.modifiedDate,
          });
        });
      })
    );
    await Promise.all(promises);
    return results
  }

  async addNote(entity: string, uuid: string, source: string = 'FWF') {
    const prefix = uuid ? 'Updated' : 'Created';
    var note: Note = {
      entity,
      uuid,
      username: 'RIS-Synergy API',
      text: prefix + ` on ${new Date().toISOString().split('T')[0]}.

Source: ${source}.`
    }

    const result = await callRIApi(`/${note.entity}s/${note.uuid}/notes`, 'PUT', {
      text: note.text,
      date: new Date().toISOString(),
      username: note.username
    })
    log.debug('Note added', result)
  }

  async callApi(endpoint: string, method: Method = 'POST', body = null) {
    log.debug(`>>> RI ${method} ${endpoint}`)
    let result: any
    try {
      result = await callRIApi(endpoint, method, body)
    } catch (error) {
      log.error(`Error calling RI-API`, error.status, error)
      throw new ResearchInstitutionError('Error calling RI-API', method, endpoint, error)
    }
    log.debug(`<<< RI ${method} ${endpoint}`, 'Items:', result.items.length)
    return result
  }

  async createEntity(entity: Category, data: any) {
    const result = await this.callApi(`/${entity}s/`, 'PUT', data)
    log.info(`${entity} created`, result.uuid)
    return result
  }

  async getEntity(entity: Category, uuid: string) {
    const result = await this.callApi(`/${entity}s/${uuid}`, 'GET')
    // log.debug('Entity data', result)
    return result
  }

  async uploadEntity(entity: Category, data: any, uuid: string) {
    // GET existing data
    const current = await this.getEntity(entity, uuid)
    // log.debug('Current entity data', current)

    // Merge new data with existing data
    const merged = _.merge(current, data)
    // log.debug('Merged entity data', merged)

    // PUT merged data
    // log.debug('Entity updated >>>', merged)
    const result = await this.callApi(`/${entity}s/${uuid}`, 'PUT', merged) // XXX not merge
    // log.debug('Entity updated <<<', result)

    return result
  }

  entityToRISId(data: any) {
    try {
      return data.identifiers.map((obj: any) => {
        // ris:FWF:project:F68 -> F68
        return obj.id.split(':')[3]
      })
        .filter((id: string) => id)[0] || null
    } catch (error) {
      log.error('Error getting RIS ID', error)
      return null
    }
  }

  async getAllProjects(category: Category) {
    const search = {
      size: this.searchSizeMax,
      offset: 0,
      searchString: `ris:FWF:${category.toLowerCase()}:*`
    };
    const startTime = Date.now();
    const result = await this.callApi('/projects/search', 'POST', search);
    const responseSizeBytes = JSON.stringify(result).length;
    const responseSizeKB = Number((responseSizeBytes / 1024).toFixed(2));
    const endTime = Date.now();
    const responseTime = (endTime - startTime) / 1000; // in seconds
    log.info('CRIS found', result.items.length, `${category}s. Response time:`, responseTime, 'seconds. Size:', responseSizeKB, 'KB')
    return result;
  }

  async sortByEntity(list: Array<object>) {
    const order = { 'project': 1, 'application': 2, 'award': 3 };
    return list.sort((a: any, b: any) => {
      const aName = a.systemName ? a.systemName.toLowerCase() : 'zzz';
      const bName = b.systemName ? b.systemName.toLowerCase() : 'zzz';
      return order[aName] - order[bName];
    });
  }
}
