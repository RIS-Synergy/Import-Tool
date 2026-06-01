import { CRIS } from '../cris.model.js';
import CrisAPI from './cris.api.service.js';
import { Logger } from "@/utils/logger.js";
import { ResearchInstitutionError } from '@/utils/errors.js';
const log = new Logger({ name: 'feature:cris:service' });

const defaultEntityTypes = ['projects', 'applications', 'awards', 'persons', 'external-persons']

export default class CRISSearchService {
  maxItemSize = 10

  constructor(private crisAPI: CrisAPI) {}

  // this 'search' function is PURE-specific
  public async search(query: string, entityTypes: string[] = defaultEntityTypes): Promise<CRIS[]> {

    log.info("Searching for:", query);
    var results = []

    const promises = entityTypes.map(entityType => {
      const endpoint = `/${entityType}/search`

      const method = 'POST';
      const postParams = {
        size: this.maxItemSize,
        offset: 0,
        searchString: query
      }
      return this.crisAPI.post(endpoint, {
        ...postParams
        // size: this.maxItemSize,
        // offset: 0,
        // searchString: query
      }).then((result: any) => {
        log.debug('SearchResults', endpoint, result.items.length)

        // send
        log.debug('External API Search call send 👉', endpoint, postParams)
        // and receive
        log.debug('External API Search returns 👈', result)

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
