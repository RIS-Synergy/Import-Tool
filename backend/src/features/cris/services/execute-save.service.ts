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
  risId: string
  crisId: number
  systemName: string
  uuid: string
  templateSelected: number
  settings: object

  saveTemplateId: number
  transformationResult: any
  crisData: CRISData

  constructor(private crisApi: CrisAPI) { }

  private async findExternal(projectId) {
    const result = await prisma.externalEntity.findUnique({
      where: {
        projectId_crisId_uuid_templateType: {
          projectId,
          crisId: this.crisId,
          uuid: this.uuid,
          templateType: this.systemName.toUpperCase(),
        }
      }
    })
    return result
  }

  private async saveTemplate(project: Project) {
    const templateService = new TemplateService()
    const template = await templateService.findById(this.templateSelected)

    if (project?.id === undefined) {
      throw new Error('Project ID is undefined');
    }

    let externalEntity = await this.findExternal(project.id)
    if (!externalEntity) {
      externalEntity = await prisma.externalEntity.create({
        data: {
          uuid: this.uuid,
          templateType: this.systemName.toUpperCase() as any,
          projectId: project.id,
          crisId: this.crisId,
        }
      })
    }

    const differ = new Differ(this.transformationResult.output, this.crisData)
    const setOfDiffKeys: Set<string> = differ.diff()
    const { diffList }: DiffList = differ.diffList(setOfDiffKeys)
    const changed = diffList.length > 0

    const result = await prisma.savedTemplate.upsert({
      where: {
        projectId_externalEntityId: {
          projectId: project.id,
          externalEntityId: externalEntity.id
        }
      },
      create: {
        project: {
          connect: { risId: project.risId }
        },
        risData: project.risData,
        settings: this.settings,
        template: {
          connect: { id: this.templateSelected }
        },
        diffList,
        changed,
        externalEntity: {
          connect: { id: externalEntity.id }
        }
      },
      update: {
        risData: project.risData,
        settings: this.settings,
        diffList,
        changed,
      },
    })

    log.info(`Saved template ${template.templateType} (id: ${this.templateSelected}) for project '${project.risId}'`);
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

    this.risId = risId
    this.crisId = crisId
    this.systemName = systemName
    this.uuid = uuid
    this.templateSelected = templateSelected
    this.settings = settings

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
    this.crisData = crisData as CRISData

    // # Execute
    const transformservice = new TransformService()
    const { transformationResult } = await transformservice.transformById(
      templateSelected,
      project.risData as object,
      settings
    )
    this.transformationResult = transformationResult

    // # Save template
    const savedTempl = await this.saveTemplate(project)

    return {
      diffList: savedTempl.diffList,
      modifiedDate: savedTempl.modifiedDate,
    }
  }
}
