import { Logger } from "@/utils/logger.js";
import { Project } from '@/models/Project.js'
import similarity from '@/utils/similarity.js'
import { callCrisApi } from './cris.api.service.js';

const log = new Logger({ name: 'feature:cris:diff:service' });

export async function calculateLikelihood(id: string, apiUrl?: string, apiKey?: string) {
  const data = (await Project.getById(id)).risData as any;
  const texts = data.title.map((t: any) => t.text);

  // Search across all entity types
  const searchResults = await searchCategories(texts.join(' '), ['projects', 'applications', 'awards'], apiUrl, apiKey);
  const totalResults = calculateSimilarityResults(texts, searchResults, 0.8);
  const groupedResults = groupAndSortResults(totalResults);

  return sortByEntity(groupedResults);
}

async function searchCategories(searchString: string, entityTypes: string[], apiUrl?: string, apiKey?: string) {
  const results = [];

  // If no API URL and key are provided, we can't search
  if (!apiUrl || !apiKey) {
    log.warn('No API URL or key provided for search');
    return results;
  }

  const maxItemSize = 10;
  const promises = entityTypes.map(entityType => {
    const endpoint = `/${entityType}/search`;
    const method = 'POST';

    return callCrisApi(apiUrl, apiKey, endpoint, method, {
      size: maxItemSize,
      offset: 0,
      searchString
    }).then((result: any) => {
      if (result.items) {
        result.items.forEach((item: any) => {
          results.push({
            ...item,
            // Ensure we have the entity type
            entityType: entityType
          });
        });
      }
    }).catch(error => {
      log.error('Error searching', endpoint, error);
      // Continue processing other entity types even if one fails
    });
  });

  await Promise.all(promises);
  return results;
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
