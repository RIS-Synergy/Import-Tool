import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
// import { callRIApi } from '../utils/ri-api'
import { projectETL2, replaceTags } from '../ris-pure-etl/index'
import { promises as fs } from 'fs'
import yaml from 'js-yaml'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:transform'});

const router: Router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

router.post('/upload', async (req: Request, res: Response) => {
  // console.log('upload', req.body)

  // const yamlBuffer = await fs.readFile('./resources/transformers/project.yaml')
  const template = await prisma.template.findFirst({
    where: {
      id: req.body.templateId
    }
  })
  // console.log('template', template)

  const yamlBuffer = template.yamlTemplate

  log.debug('Template', template.id, template.name)

  const result = await projectETL2(template.yamlTemplate, req.body.ris, req.body.settings)
  res.json({
    yamlTemplate: template.yamlTemplate,
    transformationResult: result
  })
})

export default router
