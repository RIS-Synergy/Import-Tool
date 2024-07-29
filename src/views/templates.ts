import express, { Router, Request, Response } from "express"
import { Logger } from "tslog";
const log = new Logger({ name: 'view:templates'});
const fs = require('fs')
const router: Router = express.Router()

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

router.get('/', async (req: Request, res: Response) => {
  const result = await prisma.template.findMany({
    // set the type
    where: {
      templateType: 'PROJECT'
    },
    orderBy: {
      name: 'asc'
    }
  })
  res.json(result)
})

router.get('/:id', async (req: Request, res: Response) => {
  log.info('get template', req.params.id)
  const result = await prisma.template.findUnique({
    where: {
      id: Number(req.params.id)
    }
  })
  res.json(result)
})

export default router
