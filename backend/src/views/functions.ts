import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:functions' });

const router: Router = express.Router()

import { Function } from '../models/Function'

// list all functions
router.get('/', async (req: Request, res: Response) => {
  res.json(await Function.all())
})

// get a function by name
router.get('/:name', async (req: Request, res: Response) => {
  res.json(await Function.read(req.params.name))
})

// update a function
router.put('/:name', async (req: Request, res: Response) => {
  res.json(await Function.createOrUpdate(req.params.name, req.body.code))
})

export default router
