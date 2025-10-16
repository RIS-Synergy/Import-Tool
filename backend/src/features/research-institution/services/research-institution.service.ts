import prisma from '@/lib/prisma.js';
import { ResearchInstitution } from '../research-institution.model.js';
import domains from 'resources/ri-domains.json' with { type: "json" };

import { importDomains } from './import-domains.js';

type ResearchInstitutionCreationParams = Omit<ResearchInstitution, 'id'>;

export class ResearchInstitutionService {
  public async findAll(): Promise<any[]> {
    return prisma.researchInstitution.findMany({
      orderBy: {
        projects: {
          _count: 'desc'
        }
      },
      where: {
        // domain is not containing 'placeholder' inside and ends with '.at'
        domain: {
          not: {
            contains: 'placeholder'
          },
          endsWith: '.at'
        }
      },
      select: {
        id: true,
        name: true,
        domain: true,
        rorId: true,
        _count: {
          select: {
            projects: true
          }
        }
      },
    });
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

  public async importDomains() {
    importDomains(domains);
  }
}
