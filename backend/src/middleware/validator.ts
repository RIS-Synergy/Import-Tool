import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'
import { BadRequestError } from '@/utils/errors.js'

// Legacy! (see function below)
export default (schema: Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    let data = {}
    if (req.method === 'POST') data = req.body
    if (req.method === 'GET') data = {
      ...req.params,
      ...req.query
    }
    if (req.method === 'DELETE') data = {
      ...req.params,
      ...req.query
    }

    const result = schema.validate(data)
    const { value } = result

    const error: any = result.error
    if (error) {
      const details = error.details.map((d: any) => ({
        message: d.message
      }))
      throw new BadRequestError('Validation Error', details)
    } else {
      if (req.method === 'POST') req.body = value
      if (req.method === 'GET') req.params = value
      next()
    }
  }
}

export const validate = (schema: Schema, property: 'body' | 'params') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req[property]);
    if (error) {
      res.status(400).json({
        message: `Validation failed: ${error.details[0].message}`,
      });
      return;
    }
    next();
  };
};
