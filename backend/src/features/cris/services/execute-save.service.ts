import CrisAPI from './cris.api.service.js';
import { TransformService } from "@/features/transform/services/transform.service.js";
import prisma from '@/lib/prisma.js';

import { TemplateService } from "@/features/template/services/template.service.js";

import { Differ } from "./differ.service.js"
import { ProjectService } from "@/features/project/services/project.service.js";
import { Project } from "@/features/project/project.model.js";

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:execute-save' });

type DiffList = {
  diffSet: Set<string>,
  diffList: Array<{ path: string, a: any, b: any }>
}

type CRISData = {
  uuid: string,
}

export default class ExportSaveService {
  constructor(private crisApi: CrisAPI) { }

  // this is not part of ui
  private saveDiff(
    saveTemplateId: number,
    crisId: number,
    endpoint: string,
    method: string,
    transformationResult: any,
    crisData: CRISData
  ) {
    const differ = new Differ(transformationResult.output, crisData)
    const setOfDiffKeys: Set<string> = differ.diff()
    const diffList: DiffList = differ.diffList(setOfDiffKeys)

    const changed = diffList.diffList.length > 0

    return prisma.diff.create({
      data: {
        savedTemplateId: saveTemplateId,
        crisId,
        crisUUID: crisData.uuid,
        endpoint,
        method,
        diffList: diffList.diffList,
        changed
      }
    })
  }

  private async saveTemplate(
    project: Project,
    templateSelected: number,
    settings: object
  ) {
    const templateService = new TemplateService()
    const template = await templateService.findById(templateSelected)
    const yamlTemplate = template.yamlTemplate

    if (project?.id === undefined) {
      throw new Error('Project ID is undefined');
    }

    const result = await prisma.savedTemplate.create({
      data: {
        projectId: project.id,
        // @ts-ignore
        risData: project.risData,
        settings,
        yamlTemplate,
        templateType: template.templateType,
        templateId: templateSelected,
      }
    })

    log.info(`Saved template ${template.templateType} (id: ${templateSelected}) for project '${project.risId}'`);
    return result
  }

  async executeAndSave(
    risId: string,
    crisId: number,
    systemName: string,
    uuid: string,
    templateSelected: number,
    settings: object,
  ): Promise<any> {

    log.info(`Getting diff uuid ${uuid}, template ${templateSelected}, system ${systemName}`);

    // # Get the RIS data from the DB
    const projectService = new ProjectService()
    const project = await projectService.findByRisId(risId)

    // # Fetch CRIS data
    const endpoint = `/${systemName.toLowerCase()}s/${uuid}`;
    var crisData: object = null
    try {
      crisData = await this.crisApi.get(endpoint)
    } catch (error) {
      log.error('Error fetching CRIS data', error);
      throw error;
    }

    // # Execute
    const transformservice = new TransformService()
    const { transformationResult } = await transformservice.transformById(
      templateSelected,
      project.risData as object,
      settings
    )

    // # Save template
    const savedTempl = await this.saveTemplate(
      project,
      templateSelected,
      settings
    )

    // # Save diff
    const savedDiff = await this.saveDiff(
      savedTempl.id,
      crisId,
      endpoint,
      "GET",
      transformationResult,
      crisData
    )

    return {
      savedTemplate: savedTempl,
      savedDiff
    }
  }
}
