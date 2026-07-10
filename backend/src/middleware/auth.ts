import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from '../utils/errors.js'

import { Logger } from '../utils/logger.js'
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

    // Prevent access if user has no permissions at all
    if (!req.user.permission || req.user.permission.length === 0) {
      log.error(`User ${req.user.username} has no permissions, denying access to ${req.path}`)
      return _res.status(403).json({ error: "Forbidden: No permissions" })
    }

    next()
  } catch (e) {
    log.error(`[auth] Error verifying JWT token:`, e.message)
    throw new AuthenticationError()
  }
}
