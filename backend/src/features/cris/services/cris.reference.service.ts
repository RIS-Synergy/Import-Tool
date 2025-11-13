import { CRIS } from '../cris.model.js';
import CrisAPI from './cris.api.service.js';

export default class CRISReferenceService {
  systemNameMapping = {
    'Application': 'applications',
    'Award': 'awards',
    'ExternalPerson': 'external-persons',
    'Organization': 'organizations',
    'Person': 'persons',
    'Project': 'projects',
    'User': 'users',
  }

  constructor(private crisAPI: CrisAPI,) {}

  public async reference(params: { systemName: string, uuid: string }): Promise<CRIS[]> {
    const { systemName, uuid } = params

    const endpoint = `/${this.systemNameMapping[systemName]}/${uuid}`
    const results = await this.crisAPI.get(endpoint)

    return results
  }
}
