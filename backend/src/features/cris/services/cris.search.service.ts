import { CRIS } from '../cris.model.js';
import CrisAPI from './cris.api.service.js';
import { Logger } from "@/utils/logger.js";
import { ResearchInstitutionError } from '@/utils/errors.js';
const log = new Logger({ name: 'feature:cris:service' });

export default class CRISSearchService {
  entityTypes = ['projects', 'applications', 'awards', 'persons', 'external-persons']
  maxItemSize = 10

  constructor(
    private crisAPI: CrisAPI,
  ) { }

  // this 'search' function is PURE-specific
  public async search(query: string): Promise<CRIS[]> {

    log.info("Searching for:", query);
    var results = []

    const promises = this.entityTypes.map(entityType => {
      const endpoint = `/${entityType}/search`

      const method = 'POST';
      return this.crisAPI.post(endpoint, {
        size: this.maxItemSize,
        offset: 0,
        searchString: query
      }).then((result: any) => {
        log.debug('SearchResults', endpoint, result.items.length)

        result.items && result.items.map((item: any) => {
          results.push(item);
        });
      }).catch(error => {
        log.error('Error searching', endpoint, error)
        if (error instanceof ResearchInstitutionError) {
          log.debug('ResearchInstitutionError ignored for search:', endpoint)
          results.push({
            errorType: 'ResearchInstitutionError',
            endpoint,
            method,
            message: error.message,
            status: error.status
          });
        }
      })
    });

    await Promise.all(promises);
    return results
  }
}
