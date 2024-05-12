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
  console.log(pure)

  const result = await callRIApi('/projects', 'PUT', pure)
  console.log(result)
  res.json(result)
})

router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
