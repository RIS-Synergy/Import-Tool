import { TransformService } from "@/features/transform/services/transform.service.js";
import { callCrisApi } from './cris.api.service.js';
import { Differ } from "./differ.service.js"
import { ProjectService } from "@/features/project/services/project.service.js";

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:getDiff' });

type DiffList = {
  diffSet: Set<string>,
  diffList: Array<{ path: string, a: any, b: any }>
}

export async function getDiff(
  risId: string,
  systemName: string,
  uuid: string,
  templateSelected: number,
  settings: object,
  apiUrl: string,
  apiKey: string,
): Promise<DiffList> {
  log.info(`Getting diff uuid ${uuid}, template ${templateSelected}, system ${systemName}`);

  // Fetch the RIS data
  const projectService = new ProjectService()
  const { risData } = await projectService.findByRisId(risId)

  // Fetch CRIS data
  const endpoint = `/${systemName.toLowerCase()}s/${uuid}`;
  var crisData: object
  try {
    crisData = await callCrisApi(apiUrl, apiKey, endpoint, "GET")
  } catch (error) {
    log.error('Error fetching CRIS data', error);
    throw error;
  }

  // Execute
  const transformservice = new TransformService()
  const { transformationResult } = await transformservice.transformById(
    templateSelected,
    risData as object,
    settings
  )
  // log.trace('RIS Data', risData)

  // Calculate diff
  // const differ = new Differ(transformationResult.output, crisData)
  const differ = new Differ(crisData, transformationResult.output)
  const setOfDiffKeys: Set<string> = differ.diff()
  // log.trace('Set of Diff Keys', setOfDiffKeys)
  const diffList: DiffList = differ.diffList(setOfDiffKeys)

  // log.trace('Diff List', diffList)

  return diffList
}
