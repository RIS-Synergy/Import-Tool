import prisma from '@/lib/prisma.js';
import { FundingAgency } from '../funding-agency.model.js';
import { BadRequestError } from '@/utils/errors.js';
import { CRUD } from '@/models/CRUD.js';

type FundingAgencyCreationParams = Partial<FundingAgency>;

export class FundingAgencyCRUD implements CRUD<FundingAgency> {
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
}
