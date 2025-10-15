import { CRIS } from '../cris.model.js';
import { callCrisApi } from './cris.api.service.js';

export async function reference(
  apiUrl: string, apiKey: string,
  params: { systemName: string, uuid: string }
): Promise<CRIS[]> {

  const systemNameMapping = {
    'Organization': 'organizations',
    'User': 'users'
  }

  const { systemName, uuid } = params

  const endpoint = `/${systemNameMapping[systemName]}/${uuid}`
  const results = await callCrisApi(apiUrl, apiKey, endpoint, 'GET')

  return results
}
