import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { getAuthEndpoint } from '../utils/oauth2'

const router: Router = express.Router()

router.get('/info', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_INFO)
  res.json(result.endpoints)
})

router.get('/fundings', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_FUNDINGS)
  res.json(result)
})

router.get('/projects', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_PROJECTS)
  res.json(result)
})

router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
