import { CRIS } from '../cris.model.js';

import { callCrisApi } from './cris.api.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:service' });

type Entity = 'project' | 'application' | 'award'
type UploadParams = {
  ris: string
  settings: object
  uuid: string
  templateId: number
  entity: Entity
}

/* workaround. will create a new directory 'template' or 'transform' */
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function getTemplate(templateId: number, entity: Entity) {
  const template = await prisma.template.findUnique({
    // where: { id: templateId[`${entity}Id`] }
    where: { id: templateId }
  });
  if (!template) {
    log.error('Template not found', templateId, entity);
  }
  return template.yamlTemplate
}

import { TransformExecutorService } from '@/features/transform/services/transform.executor.service.js'

async function transform(yamlTemplate: string, ris: any, settings: object) {
  const executorService = new TransformExecutorService();
  const result = await executorService.execute(yamlTemplate, ris, settings);

  if (result.error) {
    throw new Error(`Transformation error: ${result.error}`);
  }

  return result.output;
}

// type Category = 'Project' | 'Application' | 'Award'
type PUREResult = {
  uuid: string
  [key: string]: any
}
async function createEntity(apiUrl: string, apiKey: string, entity: Entity, data: object) {
  // const endpoint = `/${entity.toLowerCase()}s/` /// XXXX
  const endpoint = `/${entity}s/`
  const result: PUREResult = await callCrisApi(apiUrl, apiKey, endpoint, 'PUT', data)
  log.info(`${entity} created`, result.uuid)
  return result
}

/* end workaround */

// this 'upload' function is PURE-specific
export async function upload(
  apiUrl: string, apiKey: string, params: UploadParams
): Promise<PUREResult[]> {

  const { ris, settings, uuid, templateId, entity } = params
  log.info('Upload request', uuid, templateId, entity);


  const templateYaml = await getTemplate(templateId, entity)
  const transformedData = await transform(templateYaml, ris, settings)

  const result = await createEntity(apiUrl, apiKey, entity, transformedData)

  log.info(result)

  return result
}
