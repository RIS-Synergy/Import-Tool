import { Logger } from "@/utils/logger.js";
import { ProjectService } from '@/features/project/services/project.service.js'
import similarity from '@/utils/similarity.js'
import CrisAPI from './cris.api.service.js';

const log = new Logger({ name: 'feature:cris:diff:service' });

export class LikelyhoodService {
  constructor(private crisAPI: CrisAPI) { }

  async searchCategories(searchStrings: string[], entityTypes: string[]) {
    const results: any[] = [];
    const maxItemSize = 10;

    // Create all search promises for all entity types and search strings
    const promises = entityTypes.flatMap(entityType => {
      const endpoint = `/${entityType}/search`;

      return searchStrings.map(searchString =>
        this.crisAPI.post(endpoint, {
          size: maxItemSize,
          offset: 0,
          searchString,
        })
          .then((result: any) => {
            if (result.items) {
              result.items.forEach((item: any) => {
                results.push({
                  ...item,
                  entityType,
                  searchString,
                });
              });
            }
          })
          .catch(error => {
            log.error('Error searching', endpoint, { searchString, error });
          })
      );
    });

    await Promise.all(promises);
    return results;
  }

  public async calculate(id: string) {
    const projectService = new ProjectService();
    const data = (await projectService.findByRisId(id)).risData as any;
    const texts = data.title.map((t: any) => t.text);
    log.info('texts', texts);// TO-DO potentially do it with EN and with DE, not just "EN + DE"

    // Search across all entity types
    const searchResults = await this.searchCategories(texts, ['projects', 'applications', 'awards']);
    const totalResults = calculateSimilarityResults(texts, searchResults, 0.6);
    const groupedResults = groupAndSortResults(totalResults);

    log.info(`🧮 Calculated likelihood for project '${id}', found ${groupedResults.length} potential matches`);
    log.debug('Grouped Results', groupedResults.length)

    return sortByEntity(groupedResults);
  }
}

function calculateSimilarityResults(texts: string[], searchResults: any[], maxDiffQuota: number) {
  const results = [];
  for (const item of searchResults) {
    for (const text of texts) {
      // Handle title which could be an object with language keys
      if (item.title && typeof item.title === 'object') {
        for (const [lang, crisText] of Object.entries(item.title)) {
          const diff = similarity(text, crisText as string);
          if (diff > maxDiffQuota) {
            results.push({
              uuid: item.uuid,
              pureId: item.pureId,
              lang,
              diff,
              risText: text,
              crisText,
              systemName: item.systemName,
              modifiedDate: item.modifiedDate,
              createdDate: item.createdDate,
              identifiers: item.identifiers,
              entity: item.entityType,
              cluster: item.cluster || null,
              awardCluster: item.awardClusters && item.awardClusters[0] || null,
              applicationCluster: item.applicationClusters && item.applicationClusters[0] || null,
            });
          }
        }
      }
    }
  }
  return results;
}

function groupAndSortResults(results: any[]) {
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.pureId]) {
      acc[result.pureId] = [];
    }
    acc[result.pureId].push(result);
    return acc;
  }, {});

  const result = [];
  for (const key in grouped) {
    const texts = [];
    const value = grouped[key];
    for (const val in value) {
      const v = value[val];
      texts.push({
        lang: v.lang,
        diff: v.diff,
        crisText: v.crisText,
      });
    }
    result.push({
      pureId: key,
      uuid: value[0].uuid,
      risText: value[0].risText,
      texts,
      systemName: value[0].systemName,
      modifiedDate: value[0].modifiedDate,
      createdDate: value[0].createdDate,
      cluster: value[0].cluster,
      entity: value[0].entity,
      identifiers: value[0].identifiers,
      awardCluster: value[0].awardCluster,
      applicationCluster: value[0].applicationCluster,
    });
  }

  result.sort((a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime());
  return result;
}

function sortByEntity(list: Array<any>) {
  const order = { 'projects': 1, 'applications': 2, 'awards': 3 };
  return list.sort((a: any, b: any) => {
    const aName = a.entity ? a.entity.toLowerCase() : 'zzz';
    const bName = b.entity ? b.entity.toLowerCase() : 'zzz';
    return (order[aName] || 4) - (order[bName] || 4);
  });
}
