import express, { Router, Request, Response } from "express"
import { Logger } from "tslog";
const log = new Logger({ name: 'view:templates'});
const fs = require('fs')
const router: Router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import yaml from 'js-yaml'

const typeMap = {
  project: 'PROJECT',
  application: 'APPLICATION',
  award: 'AWARD'
}

router.get('/:type', async (req: Request, res: Response) => {
  const templateType = typeMap[req.params.type]

  if(!templateType) {
    res.json({
      error: `Template type ${req.params.type} not found`
    })
    return
  }

  const result = await prisma.template.findMany({
    // set the type
    where: {
      templateType: typeMap[req.params.type]
    },
    orderBy: {
      modifiedDate: 'desc'
    }
  })

  log.info(`get ${result.length} template, ${req.params.type}`, `(${templateType})`)
  res.json(result)
})

router.get('/:type/:id', async (req: Request, res: Response) => {
  log.info('get template', req.params.id)
  const result = await prisma.template.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })

  // add yaml
  // result.jsonTemplate = yaml.load(result.yamlTemplate)

  res.json({
    ...result,
    jsonTemplate: yaml.load(result.yamlTemplate)
  })
})

export default router
