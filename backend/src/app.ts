import express, { Express, Request, Response } from "express";
import { unexpectedErrorHandler } from './middleware/errorHandler'
// import { getAuthEndpoint } from './utils/oauth2'

import auth from './middleware/auth'

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
app.use('/fa', auth, require('./views/funding-agency').default)

// ri: research institution (Forschungsstätte)
app.use('/ri', auth, require('./views/research-institution').default)

// transform: Transformations
app.use('/transform', auth, require('./views/transform').default)

// functions
app.use('/functions', auth, require('./views/functions').default)

// ÖFOS 2012
app.use('/oefos', require('./views/oefos').default)

// Project
app.use('/project', auth, require('./views/project').default)

// Templates
app.use('/templates', auth, require('./views/templates').default)

// if (process.env.NODE_ENV === 'development') {
app.use('/dev-cris-api', require('./views/dev-cris-api').default)
// }

// Differences
app.use('/diff', auth, require('./views/diff').default)

// Authentication
app.use('/auth', require('./views/auth').default)

// error handler last
app.use(unexpectedErrorHandler)

export default app
