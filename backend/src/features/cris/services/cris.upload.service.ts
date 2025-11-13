import CrisAPI from './cris.api.service.js';
import { TransformService } from '@/features/transform/services/transform.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:upload' });

type Entity = 'project' | 'application' | 'award'
export type UploadParams = {
  crisId: number;
  ris: object;
  settings: object;
  uuid: string | null;
  templateId: number;
  entity: 'project' | 'application' | 'award';
}

/* workaround. will create a new directory 'template' or 'transform' */
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()
// async function getTemplate(templateId: number, entity: Entity) {
//   const template = await prisma.template.findUnique({
//     // where: { id: templateId[`${entity}Id`] }
//     where: { id: templateId }
//   });
//   if (!template) {
//     log.error('Template not found', templateId, entity);
//   }
//   return template.yamlTemplate
// }

// import { TransformExecutorService } from '@/features/transform/services/transform.executor.service.js'

// async function transform(yamlTemplate: string, risData: any, settings: object) {
//   const executorService = new TransformExecutorService();
//   const result = await executorService.execute(yamlTemplate, risData, settings);

//   if (result.error) {
//     throw new Error(`Transformation error: ${result.error}`);
//   }

//   return result.output.output;
// }

// type Category = 'Project' | 'Application' | 'Award'
type PUREResult = {
  uuid: string
}

// this 'upload' function is PURE-specific
export class CRISUploadService {
  constructor(private crisAPI: CrisAPI) { }

  private async createEntity(entity: Entity, data: object) {
    log.trace('Creating entity', entity, data);

    const endpoint = `/${entity}s/`
    const result: PUREResult = await this.crisAPI.put(endpoint, data)
    log.debug('🔵 Create entity result', result);
    log.info(`${entity} created`, result.uuid)
    return result
  }

  private async updateEntity(entity: Entity, uuid: string, data: object) {
    const endpoint = `/${entity}s/${uuid}`
    const result: PUREResult = await this.crisAPI.put(endpoint, data)
    log.debug('🔵 Update entity result', result);
    log.info(`${entity} updated`, result.uuid)
    return result
  }

  async upload(params: UploadParams): Promise<PUREResult> {

    const { ris, settings, uuid, templateId, entity } = params
    log.info('Upload request', uuid, templateId, entity);

    // const templateYaml = await getTemplate(templateId, entity)
    // const transformedData = await transform(templateYaml, ris, settings)
    const transformService = new TransformService()
    const { transformationResult } = await transformService.transformById(
      templateId, ris, settings)

    var result: PUREResult
    if (uuid) {
      log.info('🟣 Updating existing entity', uuid)
      result = await this.updateEntity(entity, uuid, transformationResult.output)
      return result
    } else {
      log.info('🟣 Creating new entity')
      result = await this.createEntity(entity, transformationResult.output)
    }

    return result
  }
}
