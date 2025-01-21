import { callRIApi } from '../utils/ri-api'
import { Logger } from "tslog";
const log = new Logger({ name: 'model:Project' });

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

  constructor () {
    this.system = new Pure()
  }

  getCategory = async (category: Category, id: risId) => {
    const result = await callRIApi(`/projects/${id}`, 'GET')
    return result
  }

  // move or move to 'getEntityData' below
  getProjectData = async (uuid: string) => {
    let result: any
    try {
      result = await callRIApi(`/projects/${uuid}`, 'GET')
    } catch (error) {
      log.error('Error getting project data', error)
      return null
    }
    return result
  }

  // we can replace this by project...
  getEntityData = async (entityFolder: string, uuid: string) => {
    let result: any
    try {
      result = await callRIApi(`/${entityFolder}/${uuid}`, 'GET')
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
      callRIApi(`/${entityType}/search`, 'POST', {
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

  async addNote(note: Note) {
    const result = await callRIApi(`/${note.entity}s/${note.uuid}/notes`, 'PUT', {
      text: note.text,
      date: new Date().toISOString(),
      username: note.username
    })
    log.debug('Note added', result)
  }

  callApi (endpoint: string, method: Method = 'POST', body = null) {
    return callRIApi(endpoint, method, body)
  }
}
