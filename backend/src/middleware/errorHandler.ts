import { Request, Response } from 'express'
import { CustomError, BadRequestError, ResearchInstitutionError } from '../utils/errors'

import { Logger } from "../utils/logger";
const log = new Logger({ name: 'error:unexpected'});

export function unexpectedErrorHandler(err: Error, _req: Request, res: Response, next: Function) {
  if (res.headersSent) {
    return next(err)
  }

  // @ts-ignore
  const status: any = err.status || 500
  res.status(status)

  if (err instanceof BadRequestError) {
    log.info('BadRequestError', _req.path, status, _req.body, err)
  } else if (err instanceof ResearchInstitutionError) {
    log.warn('ResearchInstitutionError', _req.path, status)
    return res.json(err)
  }
  else {
    log.error(err, 'Unexpected Error', _req.path, status, err)
    // log.error(err, 'Unexpected Error')

  }

  return res.json({
    error: {
      message: 'Unexpected Error'
    }
  })
}
