import express, { Request, Response } from "express";
import { unexpectedErrorHandler } from './middleware/errorHandler.js'

import auth from './middleware/auth.js'
import { Logger } from './utils/logger.js'
const log = new Logger({ name: 'app' });

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
app.use('/fa', auth, (await import('./views/funding-agency.js')).default)

// ri: research institution (Forschungsstätte)
app.use('/ri', auth, (await import('./views/research-institution.js')).default)

// transform: Transformations
app.use('/transform', auth, (await import('./views/transform.js')).default)

// functions
app.use('/functions', auth, (await import('./views/functions.js')).default)

// ÖFOS 2012
app.use('/oefos', (await import('./views/oefos.js')).default)

// Project
app.use('/project', auth, (await import('./views/project.js')).default)
// XXX using this for development for now.
// will migrate it over later
app.use('/project2', auth, (await import('./features/project/project.routes.js')).default)

// Templates
app.use('/templates', auth, (await import('./views/templates.js')).default)

// Differences
app.use('/diff', auth, (await import('./views/diff.js')).default)

// Authentication
app.use('/auth', (await import('./views/auth.js')).default)

// Institution
app.use('/institution', auth, (await import('./views/institution.js')).default)

// if in development mode or ci
if (process.env.NODE_ENV === 'development' || process.env.CI) {
  // Funding Agency API mock
  app.use('/test-fa-api', (await import('./utils/dev/fa-api.js')).default)

  // CRIS API mock
  app.use('/test-cris-api', (await import('./utils/dev/cris-api.js')).default)
}

// Users
app.use('/user', auth, (await import('./features/user/user.routes.js')).default)

// CRIS Systems
app.use('/cris', auth, (await import('./features/cris/cris.routes.js')).default)

// error handler last
app.use(unexpectedErrorHandler)

export default app
