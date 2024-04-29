import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { callRIApi } from '../utils/ri-api'

const router: Router = express.Router()

router.get('/search', async (req: Request, res: Response) => {
  const result = await callRIApi('/applications/search', 'POST', {
    size: 5,
    offset: 0,
    searchString: "RIS Synergy"
  })
  res.json(result)
})

router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
