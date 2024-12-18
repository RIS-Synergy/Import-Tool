import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:functions' });

const router: Router = express.Router()

import { Function } from '../models/Function'

// list all functions
router.get('/', async (req: Request, res: Response) => {
  res.json(await Function.all())
})

export default router
