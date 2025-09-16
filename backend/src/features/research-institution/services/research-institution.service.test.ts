import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ResearchInstitution } from '@prisma/client';
import { ResearchInstitutionService } from './research-institution.service.js';
import prisma from '@/lib/prisma.js';

vi.mock('@/lib/prisma', () => {
  const mockPrisma = {
    researchInstitution: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    }
  };

  return { default: mockPrisma };
});

describe('ResearchInstitutionService', () => {
  let researchInstitutionService: ResearchInstitutionService;

  beforeEach(() => {
    researchInstitutionService = new ResearchInstitutionService();
    vi.clearAllMocks();
  });

  it('should find all research institutions', async () => {
    const mockInstitutions: ResearchInstitution[] = [
      {
        id: 1,
        name: 'Test Institution',
        domain: 'test.edu',
        rorId: 'https://ror.org/12345'
      }
    ];

    (prisma.researchInstitution.findMany as Mock).mockResolvedValue(mockInstitutions);

    const institutions = await researchInstitutionService.findAll();

    expect(institutions).toEqual(mockInstitutions);
    expect(prisma.researchInstitution.findMany).toHaveBeenCalledTimes(1);
  });

  it('should find a research institution by id', async () => {
    const mockInstitution = {
      id: 1,
      name: 'Test Institution',
      domain: 'test.edu',
      rorId: 'https://ror.org/12345'
    };
    (prisma.researchInstitution.findUnique as Mock).mockResolvedValue(mockInstitution);

    const institution = await researchInstitutionService.findById(1);

    expect(institution).toEqual(mockInstitution);
    expect(prisma.researchInstitution.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.researchInstitution.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should create a new research institution', async () => {
    const newInstitutionInput = {
      name: 'New Institution',
      domain: 'new.edu',
      rorId: 'https://ror.org/67890'
    };

    const expectedCreatedInstitution = {
      id: 1,
      ...newInstitutionInput
    };

    (prisma.researchInstitution.create as Mock).mockResolvedValue(expectedCreatedInstitution);

    const institution = await researchInstitutionService.create(newInstitutionInput);

    expect(institution).toEqual(expectedCreatedInstitution);
    expect(prisma.researchInstitution.create).toHaveBeenCalledWith({
      data: newInstitutionInput,
    });
    expect(prisma.researchInstitution.create).toHaveBeenCalledTimes(1);
  });
});
