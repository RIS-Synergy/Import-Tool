import express, { Router, Request, Response } from "express"

import { projectETL2 } from '../ris-pure-etl/index'
import { Transform } from '../models/Transform'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:transform'});

const router: Router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

router.post('/upload', async (req: Request, res: Response) => {
  const template = await prisma.template.findFirst({
    where: {
      id: req.body.templateId
    }
  })

  log.debug('Template', template.id, template.name)

  const transform = new Transform()
  // transform.functions = []
  const result = await transform.run(template.yamlTemplate, req.body.ris, req.body.settings)
  // log.info('Result', result)

  res.json({
    yamlTemplate: template.yamlTemplate,
    transformationResult: result
  })
})

export default router
