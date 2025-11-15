import prisma from '@/lib/prisma.js';
import { CRIS } from '../cris.model.js';
import { BadRequestError } from '@/utils/errors.js';
import SearchService from './cris.search.service.js';
import CRISReferenceService from './cris.reference.service.js';
import { CRISUploadService, UploadParams } from './cris.upload.service.js';
import { LikelyhoodService } from './cris.diff.service.js';
import { getDiff} from './cris.getDiff.service.js';
import CrisAPI from './cris.api.service.js';
import ClusterService from './cris.cluster.service.js';
import ExportSaveService from './execute-save.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:service' });

type CRISCreationParams = Omit<CRIS, 'id'>;

export class CRISService {
  public async findMany(limitByUserPermission = {}, select = {}): Promise<CRIS[]> {
    return prisma.cRIS.findMany({
      orderBy: { name: 'asc' },
      where: limitByUserPermission,
      select: {
        id: true,
        name: true,
        apiUrl: true, // insecure to show it
        researchInstitution: {
          select: { name: true }
        },
        ...select
      },
    });
  }

  public async findById(id: number): Promise<CRIS | null> {
    return prisma.cRIS.findUnique({
      where: { id },
    });
  }

  public async create(crisData: CRISCreationParams, domain: string): Promise<CRIS> {
    try {
      // Find the research institution by domain
      const researchInstitution = await prisma.researchInstitution.findFirst({
        where: { domain },
      });

      if (!researchInstitution) {
        throw new BadRequestError(`Research institution with domain ${domain} not found`);
      }

      // Check if a CRIS with the same name already exists for this research institution
      const existingCRIS = await prisma.cRIS.findFirst({
        where: {
          name: crisData.name,
          researchInstitutionId: researchInstitution.id,
        },
      });

      if (existingCRIS) {
        throw new BadRequestError(`CRIS with name "${crisData.name}" already exists for research institution "${researchInstitution.name}"`);
      }

      // Connect using the rorId which is unique
      return await prisma.cRIS.create({
        data: {
          ...crisData,
          researchInstitution: {
            connect: {
              rorId: researchInstitution.rorId,
            },
          },
        }
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to create CRIS: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  public async update(id: number, crisData: Partial<CRISCreationParams>): Promise<CRIS> {
    return prisma.cRIS.update({
      where: { id },
      data: crisData,
    });
  }

  public async delete(id: number): Promise<CRIS> {
    return prisma.cRIS.delete({
      where: { id },
    });
  }

  public search(query: string, apiUrl: string, apiKey: string, entryType: string[]): Promise<CRIS[]> {
    const crisAPI = new CrisAPI(apiUrl, apiKey);
    const searchService = new SearchService(crisAPI);
    return searchService.search(query, entryType);
  }

  public reference(apiUrl: string, apiKey: string, params: { systemName: string, uuid: string }): Promise<CRIS[]> {
    const crisAPI = new CrisAPI(apiUrl, apiKey);
    const referenceService = new CRISReferenceService(crisAPI);
    return referenceService.reference(params);
  }

  async assignCluster(
    apiUrl: string,
    apiKey: string,
    projectUUID: string,
    applicationUUID?: string,
    awardUUID?: string
  ) {
    const crisAPI = new CrisAPI(apiUrl, apiKey);
    const clusterService = new ClusterService(crisAPI)

    return clusterService.assignCluster(
      projectUUID,
      applicationUUID,
      awardUUID
    )
  }

  public async likelihood(risId: string, apiUrl: string, apiKey: string): Promise<any> {
    const crisAPI = new CrisAPI(apiUrl, apiKey);
    const likelihoodService = new LikelyhoodService(crisAPI);
    const results = await likelihoodService.calculate(risId);
    log.debug('🟤 Likelihood results:', results.length)
    return results;
  }

  public async upload(apiUrl: string, apiKey: string, params: UploadParams): Promise<any> {
    const crisAPI = new CrisAPI(apiUrl, apiKey);
    const uploadService = new CRISUploadService(crisAPI);
    const uploadedResult = await uploadService.upload(params);

    log.debug('👉 Uploaded result:', uploadedResult.toString().slice(0, 100))
    const exportSaveService = new ExportSaveService(crisAPI)
    const saved = await exportSaveService.executeAndSave(
      // @ts-ignore
      params.ris.id,
      params.crisId,
      // first letter uppercase
      params.entity.charAt(0).toUpperCase() + params.entity.slice(1),
      uploadedResult.uuid,
      params.templateId,
      params.settings,
    )

    return saved
  }

  /*
  public executeAndSave(
    risId: string,
    crisId: number,
    systemName: string,
    uuid: string,
    templateSelected: number,
    settings: object,
    apiUrl: string,
    apiKey: string): Promise<any> {
    log.info('Getting diffs', templateSelected);

    return executeAndSave(
      risId,
      crisId,
      systemName,
      uuid,
      templateSelected,
      settings,
      apiUrl,
      apiKey
    );
  }
  */

  public getDiffs(risId: string, crisId: number, systemName: string){
    return getDiff(risId, crisId, systemName)
  }

  public async refreshDiff(risId: string, crisId: number, systemName: string, uuid: string, templateId: number){
    const diff = await getDiff(risId, crisId, systemName, true, true)

    if(!diff){
      throw new BadRequestError('No diff found to refresh')
    }

    const crisAPI = new CrisAPI("", "");
    await crisAPI.setByCrisId(crisId)
    const exportSaveService = new ExportSaveService(crisAPI)
    var saved = await exportSaveService.executeAndSave(
      risId,
      crisId,
      systemName,
      uuid,
      templateId,
      diff.savedTemplate.settings,
    )

    log.info('saved', saved)

    return {
      diffList: saved.savedDiff.diffList,
      modifiedDate: saved.savedDiff.modifiedDate,
    }
  }
}
