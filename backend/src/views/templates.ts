import express, { Router, Request, Response } from "express"
import { Logger } from "tslog";
const log = new Logger({ name: 'view:templates'});
const fs = require('fs')
const router: Router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
      name: 'asc'
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
  res.json(result)
})

export default router
