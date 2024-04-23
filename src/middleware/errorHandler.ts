import { Request, Response } from 'express'
// import { CustomError } from '../utils/errors'

export function unexpectedErrorHandler(err: Error, _req: Request, res: Response, next: Function) {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500)
  console.error(err)
  return res.json({
    error: {
      message: 'Unexpected Error'
    }
  })
}
