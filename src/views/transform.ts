import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
// import { callRIApi } from '../utils/ri-api'
import { projectETL2, replaceTags } from '../ris-pure-etl/index'
import { promises as fs } from 'fs'
import yaml from 'js-yaml'

const router: Router = express.Router()

router.post('/upload', async (req: Request, res: Response) => {
  const yamlBuffer = await fs.readFile('./tests/test.yaml')
  const yamlContent = yamlBuffer.toString()
  const result = await projectETL2(yamlContent, req.body.ris, req.body.settings)
  res.json({
    yamlTemplate: yamlContent,
    transformationResult: result
  })
})

export default router
