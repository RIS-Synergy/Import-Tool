import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { getAuthEndpoint } from '../utils/oauth2'
import projects from '../../samples/projects.json'

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
  // ! RIS_URL_PROJECTS is not stable !
  // ! use the local project samples for now !
  // const result = await getAuthEndpoint(process.env.RIS_URL_PROJECTS + req.params.id)
  const result = projects.find((project) => project.id === req.params.id)
  res.json(result)
})

router.get('/projects', async (req: Request, res: Response) => {
  // ! RIS_URL_PROJECTS is not working !
  const result = await getAuthEndpoint(process.env.RIS_URL_PROJECTS)
  res.json(result)
})

router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
