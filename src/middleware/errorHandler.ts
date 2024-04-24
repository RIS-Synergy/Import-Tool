import { Request, Response } from 'express'
// import { CustomError } from '../utils/errors'

import { Logger } from "tslog";
const log = new Logger({ name: 'error:unexpected'});

export function unexpectedErrorHandler(err: Error, _req: Request, res: Response, next: Function) {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500)

  log.error('Unexpected Error', err)

  return res.json({
    error: {
      message: 'Unexpected Error'
    }
  })
}
