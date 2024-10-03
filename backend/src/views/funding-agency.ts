import express, { Router, Request, Response } from "express"

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { getAuthEndpoint } from '../utils/oauth2'
import { promises as fs } from 'fs'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:funding-agency'});

const router: Router = express.Router()

router.get('/info', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_INFO)
  res.json(result.endpoints)
})

router.get('/fundings/:id', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_FUNDINGS + req.params.id)
  res.json(result[0])
})

router.get('/fundings', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_FUNDINGS)
  res.json(result)
})

router.get('/projects/:id', async (req: Request, res: Response) => {
  if(process.env.RIS_USE_DEV) {
    // development
    const result = await prisma.project.findUnique({
      where: {
        risId: req.params.id
      }
    })
    res.json(result)
  } else {
    // production
    const result = await getAuthEndpoint(process.env.RIS_URL_PROJECTS + req.params.id)
    res.json(result)
  }
})

router.get('/projects', async (req: Request, res: Response) => {
  // RIS_URL_PROJECTS is not working, use DEV if needed
  if(process.env.RIS_USE_DEV) {
    // development
    const result = await prisma.project.findMany({
      orderBy : {
        modifiedDate: 'desc'
      }
    })

    res.json({
      total: result.length,
      items: result
    })
  } else {
    // production
    const result = await getAuthEndpoint(process.env.RIS_URL_PROJECTS)
    res.json(result)
  }
})

router.get('/orgunits', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_ORGUNITS)
  res.json(result)
})

export default router
