import express, { Router, Request, Response } from "express"

import { Logger } from "../utils/logger.js";
const log = new Logger({ name: 'view:project' });

const router: any = express.Router()

import { Institution } from '@/models/Institution.js'

router.get('/list', async (req, res) => {
  const results = Institution.list()
  log.info('Institution list', results.length, 'items')
  return res.json(results)
})

export default router
