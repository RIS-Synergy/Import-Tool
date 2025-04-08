import express, { Request, Response } from "express";
import { unexpectedErrorHandler } from './middleware/errorHandler'

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

// Differences
app.use('/diff', auth, require('./views/diff').default)

// Authentication
app.use('/auth', require('./views/auth').default)

// Institution
app.use('/institution', auth, require('./views/institution').default)

// error handler last
app.use(unexpectedErrorHandler)

export default app
