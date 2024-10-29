import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:transform'});
import { Project } from '../models/Project';

const router: Router = express.Router()

import { runPipeline} from '../utils/diff'

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

export default router
