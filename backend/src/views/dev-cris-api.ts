import express, { Router, Request, Response } from "express"
import { Logger } from "tslog";

const router: Router = express.Router()

const log = new Logger({ name: 'dev-cris-api'});

router.get('/', async (req: Request, res: Response) => {
  res.json({
    info: 'RIS Synergy Development CRIS Simulation API'
  })
})

router.put('/projects', async (req: Request, res: Response) => {
  // log.debug('dev PUT project', req.body)
  res.json({
    uuid: 'abcd'
  })
})

router.post('/projects/search', async (req: Request, res: Response) => {
  // log.debug('dev POST projects/search', req.body)
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
  // log.debug('dev PUT projects/:uuid', req.body)
  // res.json({
  //   pureId: '1234',
  //   applicationClusters: [],
  //   awardClusters: []
  // })
  res.json(req.body)
})

router.put('/applications', async (req: Request, res: Response) => {
  // log.debug('dev PUT applications', req.body)
  res.json({
    cluster: {
      uuid: 1234,
      systemName: "ApplicationCluster",
    }
  })
})

router.put('/awards', async (req: Request, res: Response) => {
  // log.debug('dev PUT awards', req.body)
  res.json({
    cluster: {
      uuid: 2345,
      systemName: "AwardCluster",
    }
  })
})

export default router
