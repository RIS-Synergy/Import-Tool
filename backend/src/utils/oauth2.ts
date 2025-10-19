import { ofetch } from "ofetch";

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'utils:oauth2'});

import { envLogs } from "./env-logs.js";

export async function getAuthEndpoint (url: string) {
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
        client_id: process.env.RIS_FA_CLIENT_ID,
        // client_secret: process.env.AUTH_CLIENT_SECRET
        client_secret: process.env.RIS_FA_API_KEY
      })
    });

    // log.info('Received the Auth Token')

    /* Now that we have the token, we can GET the `url` */
    const info = await ofetch(url, {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    // log.info(`Received url: ${url}`)

    return info
  } catch (error) {
    log.error('AuthEndpoint Error', error)
  }
}
