// import express from 'express'
// import { Request, Response } from 'express'
import express, { Express, Request, Response } from "express";
import { unexpectedErrorHandler } from './middleware/errorHandler'

const app = express()

// middlewares
app.use(express.json())

// hello world
app.get('/', (_req: Request, res: Response) => {
  res.json({
    msg: 'hello world'
  })
})

// routes
app.use('/fwf', require('./views/fwf').default)

// error handler last
app.use(unexpectedErrorHandler)

export default app
