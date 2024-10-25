import { callRIApi } from '../utils/ri-api'
import { Logger } from "tslog";
const log = new Logger({ name: 'model:Project' });

type RISystemID = 'Pure' | 'Custom'
type Category = 'Project' | 'Application' | 'Award'
type risId = string

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

  getProjectData = async (uuid: string) => {
    const result = await callRIApi(`/projects/${uuid}`, 'GET')
    return result
  }
}
