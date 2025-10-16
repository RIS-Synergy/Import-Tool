import { NextFunction, Request, Response } from 'express'
import { AuthenticationError } from '../utils/errors.js'

import { Logger } from '../utils/logger.js'
const log = new Logger({ name: 'middleware:permission' });

export const permission = (permissionKey: string) => (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AuthenticationError()

    const permissions = req.user.permission || [];

    log.debug(permissions, permissionKey)

    if (!permissions.includes(permissionKey)){
      throw new AuthenticationError(req.user, permissionKey)
    }

    next()
  } catch (e) {
    throw new AuthenticationError()
  }
}
