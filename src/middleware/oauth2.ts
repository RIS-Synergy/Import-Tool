import { NextFunction, Request, Response } from 'express'

export default () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log('validator middleware')
    next()
  }
}
