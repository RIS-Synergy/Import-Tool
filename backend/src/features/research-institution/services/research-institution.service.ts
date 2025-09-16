import prisma from '../../../lib/prisma.js';
import { ResearchInstitution } from '../research-institution.model.js';

type ResearchInstitutionCreationParams = Omit<ResearchInstitution, 'id'>;

export class ResearchInstitutionService {
  public async findAll(): Promise<ResearchInstitution[]> {
    return prisma.researchInstitution.findMany();
  }

  public async findById(id: number): Promise<ResearchInstitution | null> {
    return prisma.researchInstitution.findUnique({
      where: { id },
    });
  }

  public async create(institutionData: ResearchInstitutionCreationParams): Promise<ResearchInstitution> {
    return prisma.researchInstitution.create({
      data: institutionData,
    });
  }
}
