import prisma from '@/lib/prisma.js';
import { CRIS } from '../cris.model.js';
import { BadRequestError } from '@/utils/errors.js';
import { search as searchService } from './cris.search.service.js';
import { reference as referenceService } from './cris.reference.service.js';
import { upload as uploadService } from './cris.upload.service.js';
import { calculateLikelihood } from './cris.diff.service.js';

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

  public search(query: string, apiUrl: string, apiKey: string, entityTypes: string[]): Promise<CRIS[]> {
    return searchService(query, apiUrl, apiKey, entityTypes);
  }

  public reference(apiUrl: string, apiKey: string, params: { systemName: string, uuid: string }): Promise<CRIS[]> {
    return referenceService(apiUrl, apiKey, params);
  }

  public upload (apiUrl: string, apiKey: string, params: any): Promise<any> {
    return uploadService(apiUrl, apiKey, params);
  }

  public async likelihood(id: string): Promise<any> {
    return await calculateLikelihood(id);
  }
}
