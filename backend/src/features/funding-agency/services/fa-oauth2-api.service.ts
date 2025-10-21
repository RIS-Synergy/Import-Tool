import { ofetch } from "ofetch";

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'funding-agency:fa-oauth2-api.service'});

// V2 _must_ have the clientId and clientSecret arguments
export async function getAuthEndpointV2 (
  url: string,
  oauth2Server: string,
  clientId: string,
  clientSecret: string,
) {
  try {
    /* First we need to get the OAuth2 token */
    const response = await ofetch(oauth2Server, {
      method: 'POST',
      headers: {
        // @ts-ignore
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
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
