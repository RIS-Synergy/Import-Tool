import express, { Router, Request, Response } from "express"

import { unexpectedErrorHandler } from '../middleware/errorHandler'
import { callRIApi } from '../utils/ri-api'
import { projectETL2 } from '../ris-pure-etl/index'

import { promises as fs } from 'fs'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:ri'});


const router: Router = express.Router()

router.get('/project/:id', async (req: Request, res: Response) => {
  const result = await callRIApi('/projects/search', 'POST', {
    size: 10,
    offset: 0,
    searchString: req.params.id
  })

  if (!result.items || result.items.length === 0) {
    res.json({
      error: `Research Institution could not find ${req.params.id}`,
      uuid: null
    })
    return
  }

  const item = result.items[0]
  const { uuid } = item
  res.json({
    count: result.count,
    item,
    uuid
  })
})

router.get('/search', async (req: Request, res: Response) => {
  const result = await callRIApi('/projects/search', 'POST', {
    size: 100,
    offset: 0,
    searchString: "10.55776/", // FWF id
  })
  res.json(result)
})

router.post('/upload', async (req: Request, res: Response) => {
  const { ris, settings, uuid } = req.body

  const yamlBuffer = await fs.readFile('./tests/test.yaml')
  const yamlContent = yamlBuffer.toString()

  const pure = await projectETL2(yamlContent, ris, settings)

  if (uuid) {
    const result = await callRIApi(`/projects/${uuid}`, 'PUT', pure)
    log.info('Update project', result.uuid)
    return res.json(result)
  } else {
    const result = await callRIApi('/projects', 'PUT', pure)
    log.info('Created project', result.uuid)
    return res.json(result)
  }
})

router.get('/organizations/:id', async (req: Request, res: Response) => {
  const result = await callRIApi(`/organizations/${req.params.id}`, 'GET')
  res.json(result)
})

router.get('/persons/:id', async (req: Request, res: Response) => {
  const result = await callRIApi(`/persons/${req.params.id}`, 'GET')
  res.json(result)
})

router.get('/reference/:systemName/:uuid', async (req: Request, res: Response) => {
  const systemNameMapping = {
    'Organization': 'organizations',
    'User': 'users'
  }

  const result = await callRIApi(`/${systemNameMapping[req.params.systemName]}/${req.params.uuid}`, 'GET')
  log.debug('Reference', req.params.systemName, 'received')
  res.json(result)
})

router.post('/search', async (req: Request, res: Response) => {
  const entities = {
    persons: [
    {
      name: 'persons',
      // lookup: [ 'staffOrganizationAssociations', 'user' ]
    },
    {
      name: 'external-persons',
      lookup: 'externalOrganizations'
    }
    ],

    // we have not used these yet
    organizations: [
    {
      name: 'organizations'
      // lookup: 'organizations'
    },
    {
      name: 'external-organizations',
      // lookup: 'externalOrganizations'
    }],
  }

  var results = []

  for (const entity of entities[req.body.entity]) {
    console.log(entity, req.body)

    const result = await callRIApi(`/${entity.name}/search`, 'POST', {
      size: 10,
      offset: 0,
      searchString: req.body.searchString
    })

    // console.log(result)

    result.items.map((item: any) => {
      results.push({
          pureId: item.pureId,
          uuid: item.uuid,
          name: item.name.firstName + ' ' + item.name.lastName,
          user: item.user && item.user.uuid,
          details: item,
        entity,
        systemName: item.systemName,
      })
    })
  }

  res.json(results)
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
