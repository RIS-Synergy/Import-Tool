import express, { Express, Request, Response } from "express";
import { unexpectedErrorHandler } from './middleware/errorHandler'
import { getAuthEndpoint } from './utils/oauth2'

const app = express()

// middlewares
app.use(express.json())

// root url
app.get('/', (_req: Request, res: Response) => {
  res.json({
    info: 'RIS Synergy API'
  })
})

// fa: funding agency (Fördergeber)
app.use('/fa', require('./views/funding-agency').default)

// ri: research institution (Forschungsstätte)
app.use('/ri', require('./views/research-institution').default)

// transform: Transformations
app.use('/transform', require('./views/transform').default)

// error handler last
app.use(unexpectedErrorHandler)

export default app
