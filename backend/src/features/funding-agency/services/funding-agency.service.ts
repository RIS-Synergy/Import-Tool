import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: "feature:fa" });

import { FundingAgency } from '../funding-agency.model.js';
import { updateFromRegistry } from './fa-registry.service.js';
import { FundingAgencySync } from './fa-sync.service.js';
import { FundingAgencyCRUD } from './fa-crud.service.js';

export class FundingAgencyService extends FundingAgencyCRUD {
  constructor() {
    super();
  }

  public async updateFromRegistry() {
    try {
      const members = updateFromRegistry()
      for (const member of members) {
        // Since upsert isn't part of our CRUD interface, we'll need to handle it directly
        // For now, we'll find and update or create
        const existing = await this.findById(member.id);
        if (existing) {
          await this.update(member.id, { data: member });
        } else {
          await this.create({
            id: member.id,
            data: member
          });
        }
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
      fa.clientId, fa.clientSecret, fa.data)
    faSync.start()

    return fa
  }
}
