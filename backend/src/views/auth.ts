import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:auth'});

const router: Router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  log.info('req: /auth')
  return res.json({})
})

router.get('/session', async (req: Request, res: Response) => {
  log.info('req: /auth/session')
  return res.json({})
})

router.get('/providers', async (req: Request, res: Response) => {
  log.info('req: /auth/providers')
  return res.json({})
})

router.get('/signin', async (req: Request, res: Response) => {
  log.info('req: /auth/signin')
  return res.json({})
})

export default router
