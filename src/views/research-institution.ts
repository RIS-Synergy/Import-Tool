import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { callRIApi } from '../utils/ri-api'
import { projectETL2 } from '../ris-pure-etl/index'

const router: Router = express.Router()

router.get('/search', async (req: Request, res: Response) => {
  const result = await callRIApi('/projects/search', 'POST', {
    size: 100,
    offset: 0,
    searchString: "10.55776/", // FWF id
  })
  res.json(result)
})

router.post('/upload', async (req: Request, res: Response) => {
  console.log('settings', req.body.settings)
  debugger
  // XXX we have not yet used the version 2 of the ETL
  const pure = projectETL2("", req.body.ris, req.body.settings)
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

router.post('/persons/search', async (req: Request, res: Response) => {
  const result = await callRIApi('/persons/search', 'POST', {
    size: 10,
    offset: 0,
    // systemName: "Person",
    searchString: req.body.searchString,
  })
  res.json({
    items: result.items,
    persons: result.items.map((item: any) => {
      return {
        pureId: item.pureId,
        uuid: item.uuid,
        name: item.name.firstName + ' ' + item.name.lastName,
        user: item.user && item.user.uuid,
        details: item,
      }
    })
  })
})

router.get('/projects/:uuid', async (req: Request, res: Response) => {
  const result = await callRIApi(`/projects/${req.params.uuid}`, 'GET')
  res.json(result)
})

// Update project
router.put('/projects/:uuid', async (req: Request, res: Response) => {
  const result = await callRIApi(`/projects/${req.params.uuid}`, 'PUT', req.body)
  res.json(result)
})

// Sample error route
router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
