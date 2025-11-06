import { TransformService } from "@/features/transform/services/transform.service.js";
import { callCrisApi } from './cris.api.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:getDiff' });

export async function getDiff(
  projectId: number,
  systemName: string,
  uuid: string,
  templateSelected: number,
  settings: object,
  apiUrl: string,
  apiKey: string,
) {
  log.info(`Getting diff for project ${projectId}, uuid ${uuid}, template ${templateSelected}, system ${systemName}`);

  // Fetch CRIS data
  const endpoint = `/${systemName.toLowerCase()}s/${uuid}`;
  var crisData: object
  try {
    crisData = await callCrisApi(apiUrl, apiKey, endpoint, "GET")
  } catch (error) {
    log.error('Error fetching CRIS data', error);
    throw error;
  }

  const transformservice = new TransformService()
  const result = transformservice.transformById(templateSelected, crisData, settings)

  return result
}
