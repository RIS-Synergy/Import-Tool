import { NextFunction, Request, Response } from 'express'
// import { Schema } from 'joi'
// import { BadRequestError } from '../utils/errors'

// let data = {}
// if (req.method === 'POST') data = req.body
// if (req.method === 'GET') data = {
//   ...req.params,
//   ...req.query
// }
// if (req.method === 'DELETE') data = {
//   ...req.params,
//   ...req.query
// }

// const result = schema.validate(data)
// const { value } = result

// const error: any = result.error
// if (error) {
//   const details = error.details.map((d: any) => ({
//     message: d.message
//   }))
//   throw new BadRequestError('Validation Error', details)
// } else {
//   if (req.method === 'POST') req.body = value
//   if (req.method === 'GET') req.params = value
//   next()
// }

export default () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    console.log('validator middleware')
    next()
  }
}
