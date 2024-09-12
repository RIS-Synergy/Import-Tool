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
    jsonTemplate: yaml.load(result.yamlTemplate).output
  })
})

router.post('/verify', async (req: Request, res: Response) => {
  // log.info('verify template')
  const { text } = req.body
  log.debug('====== text ======\n', text, '\n====== text ended ======')
  var result

  try {
    result = yaml.load(text)
    log.info('yaml is OK')
  } catch (e) {
    log.error('yaml error', e)
    res.json({
      error: e
    })
    return
  }

  // log.debug('json', result)
  res.json(result)
})

export default router
