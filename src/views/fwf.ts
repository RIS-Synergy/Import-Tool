import express, { Router, Request, Response } from "express"
// import { AuthenticationError } from '../utils/errors'
// import { login } from './validators'
import { unexpectedErrorHandler } from '../middleware/errorHandler'

import oauth2 from '../middleware/oauth2'
import { ofetch } from "ofetch";

const router: Router = express.Router()

const AUTH_SERVER = process.env.AUTH_SERVER
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const RIS_INFO_URL = process.env.RIS_INFO_URL

router.get('/info', /*oauth2(),*/ async (req: Request, res: Response) => {
  const response = await ofetch(AUTH_SERVER, {
    method: 'POST',
    headers: {
      // @ts-ignore
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    },
    // async onResponseError({ request, response, options }) {
    //   // Log error
    //   console.log(
    //     "[fetch response error]",
    //     request,
    //     response
    //   );
    // }
  });

  console.log(response)

  res.json({
    response,
    user: 'foo'
  })
})

router.get('/foo', (req: Request, res: Response) => {
  throw new Error('foo')
})

export default router
