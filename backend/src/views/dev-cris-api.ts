import express, { Router, Request, Response } from "express"
import { Logger } from "tslog";

const router: Router = express.Router()
const log = new Logger({ name: 'dev-cris-api' });

router.get('/', async (req: Request, res: Response) => {
  res.json({
    info: 'RIS Synergy Development CRIS Simulation API'
  })
})

router.put('/projects', async (req: Request, res: Response) => {
  res.json({
    uuid: 'abcd'
  })
})

router.post('/projects/search', async (req: Request, res: Response) => {
  res.json({
    count: 1,
    items: [
      {
        uuid: 'abcd',
      }
    ]
  })
})

router.put('/projects/:uuid', async (req: Request, res: Response) => {
  log.debug(`Dev PUT projects/${req.params.uuid}`, 'Body object size', Object.keys(req.body).length)
  res.json({
    ...req.body
  })
})

router.put('/applications', async (req: Request, res: Response) => {
  log.debug('Dev PUT applications', 'Body object size', Object.keys(req.body).length)
  res.json({
    cluster: {
      uuid: 1234,
      systemName: "ApplicationCluster",
    }
  })
})

router.put('/awards', async (req: Request, res: Response) => {
  log.debug('Dev PUT awards', 'Body object size', Object.keys(req.body).length)
  res.json({
    cluster: {
      uuid: 2345,
      systemName: "AwardCluster",
    }
  })
})

router.post('/persons/search', async (req: Request, res: Response) => {
  res.json({
    items: [
      {
        pureId: '1234',
        uuid: 'abcd',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        user: {
          uuid: 'efgh',
        },
        systemName: 'Person',
        entity: 'persons'
      }
    ]
  })
})

router.post('/external-persons/search', async (req: Request, res: Response) => {
  res.json({
    items: [
      {
        pureId: '1234',
        uuid: 'abcd',
        name: {
          firstName: 'John',
          lastName: 'Doe',
        },
        user: {
          uuid: 'efgh'
        },
        systemName: 'ExternalPerson',
        entity: 'external-persons'
      }
    ]
  })
})

router.get('/:entity/:id', async (req: Request, res: Response) => {
  res.json({
    uuid: 'abcd-uuid',
    email: 'john.doe@example.org'
  })
})

export default router
