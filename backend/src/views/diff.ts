import express, { Router, Request, Response } from "express"

import { Logger } from "tslog";
const log = new Logger({ name: 'view:transform'});

const router: Router = express.Router()

import { runPipeline} from '../utils/diff'

router.get('/:id', async (req: Request, res: Response) => {
  const result = await runPipeline(req.params.id)
  res.json(result)
})

export default router
