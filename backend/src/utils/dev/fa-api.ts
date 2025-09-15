import express, { Router, Request, Response } from "express"

import { Logger } from "../../utils/logger.js";
const log = new Logger({ name: 'dev:fa-api' });

const router: any = express.Router()

router.use("/registry.json", async (req, res) => {
  // We will not be using this, because when running tests,
  // we don't have the server running.
  return res.json({ success: false })
})

export default router
