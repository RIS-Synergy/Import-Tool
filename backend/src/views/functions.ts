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

router.put('/', async (req: Request, res: Response) => {
  const { name } = req.body
  const fn = await Function.createOrUpdate(name, '')
  res.json({ ...fn })
})

// get a function by name
router.get('/:name', async (req: Request, res: Response) => {
  const { name } = req.params
  const fn = await Function.read(name)
  res.json(fn)
})

// update a function (incl. execution validation)
router.put('/:name', async (req: Request, res: Response) => {
  const { name } = req.params
  const { code, input, settings } = req.body
  // TODO include the input and settings from a specific entity (project or award or application)
  const { output, error } = await Function.verify(name, code, input, settings)
  const fn = await Function.createOrUpdate(name, code)
  log.info(`Updated function '${fn.name}'`, '\n>', output)
  res.json({ ...fn, error, output })
})

export default router
