import { Request, Response } from 'express'
// import { CustomError } from '../utils/errors'

import { Logger } from "tslog";
const log = new Logger({ name: 'error:unexpected'});

export function unexpectedErrorHandler(err: Error, _req: Request, res: Response, next: Function) {
  if (res.headersSent) {
    return next(err)
  }


  log.error('Unexpected Error', err)

  // @ts-ignore
  const status: any = err.status || 500
  res.status(status)

  return res.json({
    error: {
      message: 'Unexpected Error'
    }
  })
}
