import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { callRIApi } from '../utils/ri-api'
import { projectETL } from '../ris-pure-etl/index'

const router: Router = express.Router()

router.get('/search', async (req: Request, res: Response) => {
  const result = await callRIApi('/projects/search', 'POST', {
    size: 10,
    offset: 0,
    searchString: "10.55776/", // FWF id
  })
  res.json(result)
})

router.post('/upload', async (req: Request, res: Response) => {
  const pure = projectETL(req.body)
  const result = await callRIApi('/projects', 'PUT', pure)
  res.json(result)
})

router.get('/organizations/:id', async (req: Request, res: Response) => {
  const result = await callRIApi(`/organizations/${req.params.id}`, 'GET')
  res.json(result)
})

router.get('/persons/:id', async (req: Request, res: Response) => {
  const result = await callRIApi(`/persons/${req.params.id}`, 'GET')
  res.json(result)
})

router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
