import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from '../utils/errors'

import { Logger } from '../utils/logger'
const log = new Logger({ name: 'middleware:auth' });

export default (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers && req.headers.authorization || 'Bearer None'
    if (header === 'Bearer None') {
      log.debug(header, req.path)
    }

    const token = header.split(' ')[1]

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    // @ts-ignore
    req.user = decodedToken.user
    next()
  } catch (e) {
    throw new AuthenticationError()
  }
}
