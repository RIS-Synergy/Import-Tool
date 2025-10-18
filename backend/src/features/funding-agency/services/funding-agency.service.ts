import prisma from '@/lib/prisma.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: "feature:fa" });

import { FundingAgency } from '../funding-agency.model.js';
import { BadRequestError } from '@/utils/errors.js';
import { updateFromRegistry } from './fa-registry.service.js';
import { FundingAgencySync } from './fa-sync.service.js';

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

  public async startSync(id: string): Promise<FundingAgency> {
    log.info(`Starting sync for FundingAgency with id ${id}`);
    const fa = await this.findById(id)
    log.debug({
      ...fa,
      clientSecret: fa ? '****' : undefined,
      clientId: fa ? '****' : undefined
    })

    const faSync = new FundingAgencySync(
      fa.clientId, fa.clientSecret, fa.data.info)
    faSync.start()

    return fa
  }
}
