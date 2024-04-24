import express, { Router, Request, Response } from "express"
// import { AuthenticationError } from '../utils/errors'
// import { login } from './validators'

import { Logger } from "tslog";
const log = new Logger({ name: 'view:fwf:auth'});

import { unexpectedErrorHandler } from '../middleware/errorHandler'

import oauth2 from '../middleware/oauth2'
import { ofetch } from "ofetch";

const router: Router = express.Router()

async function getAuthEndpoint (url: string) {
  try {
    /* First we need to get the OAuth2 token */
    const response = await ofetch(process.env.AUTH_SERVER, {
      method: 'POST',
      headers: {
        // @ts-ignore
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AUTH_CLIENT_ID,
        client_secret: process.env.AUTH_CLIENT_SECRET
      })
    });

    log.info('Received the Auth Token')

    /* Now that we have the token, we can GET the `url` */
    const info = await ofetch(url, {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    log.info(`Received url: ${url}`)

    return info
  } catch (error) {
    console.error(error)
    throw new Error('info error')
  }
}

router.get('/info', async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_INFO_URL)
  res.json({
    result
  })
})

router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
