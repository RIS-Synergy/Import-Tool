import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:functions' });

const router: Router = express.Router()

import { Function } from '../models/Function'

// list all functions
router.get('/', async (req: Request, res: Response) => {
  const all = await Function.all()
  res.json(all)
})

// get a function by name
router.get('/:name', async (req: Request, res: Response) => {
  const  {name} = req.params
  const fn = await Function.read(name)
  res.json(fn)
})

// update a function
router.put('/:name', async (req: Request, res: Response) => {
  const { name } = req.params
  const { code } = req.body
  const fn = await Function.createOrUpdate(name, code)
  log.info(`Updated function '${fn.name}'`)
  res.json(fn)
})

export default router
