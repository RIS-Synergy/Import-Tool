import prisma from '@/lib/prisma.js';
import { FundingAgency } from '../funding-agency.model.js';
import { BadRequestError } from '@/utils/errors.js';
import { CRUD } from '@/models/CRUD.js';

type FundingAgencyCreationParams = Partial<FundingAgency>;

export class FundingAgencyCRUD implements CRUD<FundingAgency> {
  public async findMany(select = {}): Promise<FundingAgency[]> {
    const fundingAgencies = await prisma.fundingAgency.findMany({
      select: {
        id: true,
        clientSecret: false,
        clientId: false,
        data: true,
        ...select
      },
    });

    // Sort alphabetically by acronym from the data field
    const sortedFundingAgencies = fundingAgencies.sort((a, b) => {
      const acronymA = a.data?.acronym || '';
      const acronymB = b.data?.acronym || '';
      return acronymA.localeCompare(acronymB);
    });

    return sortedFundingAgencies;
  }
  public async findById(id: string): Promise<FundingAgency | null> {
    console.log(`Finding FundingAgency by id: ${id}`)
    return prisma.fundingAgency.findUnique({
      where: { id },
    });
  }

  public async create(fundingAgencyData: FundingAgencyCreationParams): Promise<FundingAgency> {
    try {
      return await prisma.fundingAgency.create({
        data: fundingAgencyData
      });
    } catch (error) {
      throw new BadRequestError('Failed to create FundingAgency: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  public async update(id: string, fundingAgencyData: Partial<FundingAgencyCreationParams>): Promise<FundingAgency> {
    return prisma.fundingAgency.update({
      where: { id },
      data: fundingAgencyData,
    });
  }

  public async delete(id: string): Promise<void> {
    try {
      await prisma.fundingAgency.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestError('Failed to delete FundingAgency: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}
