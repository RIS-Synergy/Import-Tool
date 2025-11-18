import prisma from '@/lib/prisma.js';

import { CRIS } from "@/features/cris/cris.model.js";
import CrisAPI from './cris.api.service.js';
import { LikelyhoodService } from './cris.diff.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:discoverExternalService' });

/*
  🧐
 */
export default class DiscoverExternalService {
  constructor(private cris: CRIS) { }

  private countByRI(researchInstitutionId: number): Promise<number> {
    return prisma.project.count({
      where: {
        researchInstitutions: {
          some: {
            id: researchInstitutionId
          }
        }
      }
    });
  }

  private countByRIwithoutExternalEntities(researchInstitutionId: number): Promise<number> {
    return prisma.project.count({
      where: {
        researchInstitutions: {
          some: {
            id: researchInstitutionId
          }
        },
        externalEntities: {
          none: {}
        }
      }
    });
  }

  private loop (withoutSavedTemplates = false, take = 10) {
    log.info("Looping...", this.cris);

    const crisAPI = new CrisAPI(this.cris.apiUrl, this.cris.apiKey);
    const likelihoodService = new LikelyhoodService(crisAPI);

    // TODO wait 1 second
    // take only 10 projects at a time
    // for each project,
    // take the risId
    // then do this in the loop:
    // likelihoodService.calculateAndSave(
    // risId, crisId);
  }

  private loopWithoutExternalEntities(take = 10) {
    this.loop(true, take);
  }

  private loopWithSavedTemplates(take = 10) {
    this.loop(false, take);
  }

  async discover() {
    log.info("Discovering external entities...", this.cris);

    const researchInstitutionId = this.cris.researchInstitution.id

    const countProjects = await this.countByRI(researchInstitutionId);
    log.debug(`Found ${countProjects} projects for research institution ID ${researchInstitutionId}`);

    const countProjectsWithoutExternalEntities = await this.countByRIwithoutExternalEntities(researchInstitutionId);
    log.debug(`Found ${countProjectsWithoutExternalEntities} projects without external entities for research institution ID ${researchInstitutionId}`);

    this.loopWithoutExternalEntities(10);
  }
}
