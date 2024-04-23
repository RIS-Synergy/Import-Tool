// import express from 'express'
// import { Request, Response } from 'express'
// import { customErrorHandler, unexpectedErrorHandler } from './middleware/errorHandler'
import express, { Express, Request, Response } from "express";


const app = express()

// middlewares
app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.json({
    msg: 'hello world'
  })
})

// routes
// app.use('/auth', require('./views/auth').default)
// app.use('/database', require('./views/database').default)
// app.use('/table', require('./views/table').default)

// error handler last
// app.use(customErrorHandler)
// app.use(unexpectedErrorHandler)

export default app
