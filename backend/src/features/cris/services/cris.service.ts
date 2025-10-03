import prisma from '../../../lib/prisma.js';
import { CRIS } from '../cris.model.js';

type CRISCreationParams = Omit<CRIS, 'id'>;

export class CRISService {
  public async findAll(): Promise<CRIS[]> {
    return prisma.cRIS.findMany({
      orderBy: { name: 'asc' },
    });
  }

  public async findById(id: number): Promise<CRIS | null> {
    return prisma.cRIS.findUnique({
      where: { id },
    });
  }

  public async create(crisData: CRISCreationParams, domain: string): Promise<CRIS> {
    return prisma.cRIS.create({
      data: {
        ...crisData,
        researchInstitution: {
          connect: { domain },
        },
      }
    });
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
}
