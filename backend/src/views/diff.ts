import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:transform'});
import { Project } from '../models/Project';
import similarity from '../utils/similarity'

const router: Router = express.Router()

import { runPipeline} from '../utils/diff'

import { ResearchInstitution } from '../models/ResearchInstitution'
const ri = new ResearchInstitution()

router.get('/:id', async (req: Request, res: Response) => {
  const project = new Project(req.params.id)
  const crisData = await project.fetchCrisData()
  // log.info('CrisData', crisData)
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
  console.log('Likelihood', req.params.id)
  const id = req.params.id

  // get title: en_GB and de_DE from prisma
  const data = (await Project.getById(id)).risData as any
  const text = data.title[0].text // this is just one, but we have both english and german (2 texts)
  log.info(text)

  const searchResults = await ri.searchCategories(text, ['projects', 'applications', 'awards'])

  const maxDiffQuota = 0.8
  const totalResults = []

  for (const item of searchResults) {
    // for en, de, ...
    for (const [ lang, crisText ] of Object.entries(item.title)) {
      const diff = similarity(text, crisText)
      // console.log(lang, similarity(text, crisText))
      if (diff > maxDiffQuota) {
        totalResults.push({
          uuid: item.uuid,
          pureId: item.pureId,
          title: item.title,
          lang,
          diff,
          text: crisText,
          systemName: item.systemName
        })
      }
    }
  }

  res.json(totalResults)

  // console.log('TotalResults', totalResults.length, totalResults)

  // const likelihood = Math.random()

  // // sleep 1 - 2 seconds randomly
  // const sleep = Math.random() * 1000 + 1000
  // await new Promise(resolve => setTimeout(resolve, sleep))

  // res.json({ likelihood })
})

export default router
