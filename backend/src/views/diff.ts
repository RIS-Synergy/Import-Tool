import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:transform' });
import { Project } from '../models/Project';
import similarity from '../utils/similarity'

const router: Router = express.Router()

import { runPipeline } from '../utils/diff'

import { ResearchInstitution } from '../models/ResearchInstitution'
const ri = new ResearchInstitution()

router.get('/:id', async (req: Request, res: Response) => {
  const project = new Project(req.params.id)
  const crisData = await project.fetchCrisData()
  // log.info('CrisData', crisData)
  if (!crisData) {
    res.json({})
    return
  }
  const result = await runPipeline(req.params.id, crisData)
  log.info(`req: ${req.path}`, 'DiffList', result.diffList)
  res.json(result.diffList.map((x: any) => {
    return {
      cris: x.a,
      ris: x.b,
      path: x.path
    }
  }))
})

router.get('/likelihood/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = (await Project.getById(id)).risData as any;
  const texts = data.title.map((t: any) => t.text);
  // log.info(texts);

  const searchResults = await ri.searchCategories(texts.join(' '), ['projects', 'applications', 'awards']);
  const totalResults = calculateSimilarityResults(texts, searchResults, 0.8);
  const groupedResults = groupAndSortResults(totalResults);

  // log.debug(groupedResults);
  res.json(groupedResults);
});

function calculateSimilarityResults(texts: string[], searchResults: any[], maxDiffQuota: number) {
  const results = [];
  for (const item of searchResults) {
    for (const text of texts) {
      for (const [lang, crisText] of Object.entries(item.title)) {
        log.info(item)

        const diff = similarity(text, crisText);
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
            entity: item.systemName.toLowerCase() + 's'
          });
        }
      }
    }
  }
  return results
}

function groupAndSortResults(results: any[]) {
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.pureId]) {
      acc[result.pureId] = [];
    }
    acc[result.pureId].push(result);
    return acc;
  }, {});

  const result = []
  for (const key in grouped) {
    const texts = []
    const value = grouped[key]
    // log.trace(value.map((x: any) => x.risText))
    for (const val in value) {
      const v = value[val]
      // log.trace(v)
      texts.push({
        lang: v.lang,
        diff: v.diff,
        crisText: v.crisText,
      })
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
      identifiers: value[0].identifiers
    });
    // console.log(key);
    // log.info(result)
  }

  // sort by results modifiedDate desc
  result.sort((a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime());

  return result
  // return grouped;
}

export default router
