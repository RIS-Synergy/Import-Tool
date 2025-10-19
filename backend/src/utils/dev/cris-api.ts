import express, { Router, Request, Response } from "express"

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'dev:cris' });

const router: any = express.Router()

const endpointMap = {
  "/persons/search": {
  },
  "/external-persons/search": {
  },
  "/applications/search": {
  },
  "/awards/search": {
  },
  "/projects/search": {
  },
}

// const defaultResponse = { noResults: true }
function defaultResponse (method, endpoint) {
  log.warn(
    `CRIS Test API '${process.env.PURE_API_URL}' [${method}] ${endpoint} sample data not found`,
  )

  return { noResults: true }
}

router.use(async (req, res) => {
  const info = {
    query: req.query,
    params: req.params,
    body: req.body
  };

  const endpoint = req.originalUrl.replace(/^\/test-cris-api/, '') // replace first /test-cris-api

  log.debug('CRIS API', req.method,
            endpoint,
            info)

  const result = endpointMap[endpoint] || defaultResponse(req.method, endpoint)
  return res.json(result)
})

export default router
