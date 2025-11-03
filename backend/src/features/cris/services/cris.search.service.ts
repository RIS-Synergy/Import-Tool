import { CRIS } from '../cris.model.js';

import { callCrisApi } from './cris.api.service.js';

import { Logger } from "@/utils/logger.js";
import { ResearchInstitutionError } from '@/utils/errors.js';
const log = new Logger({ name: 'feature:cris:service' });

// this 'search' function is PURE-specific
export async function search(
  query: string, apiUrl: string, apiKey: string,
  entityTypes = ['projects', 'applications', 'awards', 'persons', 'external-persons']
): Promise<CRIS[]> {
  const maxItemSize = 10

  log.info("Searching for:", query);
  var results = []

  const promises = entityTypes.map(entityType => {
    const endpoint = `/${entityType}/search`

    const method = 'POST';
    return callCrisApi(apiUrl, apiKey, endpoint, method, {
      size: maxItemSize,
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
