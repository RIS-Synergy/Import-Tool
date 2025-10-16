import prisma from '../../../lib/prisma.js';

import { Logger } from "../../../utils/logger.js";
const log = new Logger({ name: "feature:fa" });

import { FundingAgency } from '../funding-agency.model.js';
import { BadRequestError } from '../../../utils/errors.js';
import { updateFromRegistry } from './fa-registry.service.js';

type FundingAgencyCreationParams = FundingAgency;

export class FundingAgencyService {
  public async findMany(select = {}): Promise<FundingAgency[]> {
    return prisma.fundingAgency.findMany({
      select: {
        id: true,
        clientSecret: false,
        clientId: false,
        data: true,
        ...select
      },
    });
  }

  public async findById(id: string): Promise<FundingAgency | null> {
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

  public async updateFromRegistry() {
    try {
      const members = updateFromRegistry()
      for (const member of members) {
        const result = await prisma.fundingAgency.upsert({
          where: { id: member.id },
          update: {
            data: member
          },
          create: {
            id: member.id,
            data: member
          }
        })
      }

    } catch (error) {
      log.error('Error updating from registry:', error);
    }
  }
}
