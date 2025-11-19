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
  // take = 5;
  statuses: string[] = ['IN_PREPERATION', 'ACTIVE'];

  constructor(private cris: CRIS) { }

  private countProjects(researchInstitutionId: number, withoutExternalEntities: boolean): Promise<number> {
    const whereClause: any = {
      status: {
        in: this.statuses
      },
      researchInstitutions: {
        some: {
          id: researchInstitutionId
        }
      }
    };

    if (withoutExternalEntities) {
      whereClause.externalEntities = {
        none: {}
      };
    }

    return prisma.project.count({
      where: whereClause
    });
  }

  private async loop(withoutExternalEntities = false) {
    log.info("Starting discovery loop", {
      crisId: this.cris.id,
      withoutExternalEntities,
      // take: this.take
    });

    const crisAPI = new CrisAPI(this.cris.apiUrl, this.cris.apiKey);
    const likelihoodService = new LikelyhoodService(crisAPI);

    try {
      const whereClause: any = {
        status: {
          in: this.statuses
        },
        researchInstitutions: {
          some: {
            id: this.cris.researchInstitutionId
          }
        }
      };

      if (withoutExternalEntities) {
        whereClause.externalEntities = {
          none: {}
        };
      }

      // Fetch projects
      const projects = await prisma.project.findMany({
        where: whereClause,
        // take: this.take,
        select: {
          id: true,
          risId: true
        },
        orderBy: {
          startDate: 'desc'
        }
      });

      log.debug("--------------------------------");
      log.debug(`Found ${projects.length} projects to process`);
      log.debug("--------------------------------");
      // sleep 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process each project with delay
      for (const project of projects) {
        try {
          log.debug(`Processing project ${project.risId}`);
          await likelihoodService.calculateAndSave(project.risId, this.cris.id);

          log.debug(`Finished processing project ${project.risId}`)
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          log.error(`Error processing project ${project.risId}:`, error);
          // Continue with next project even if one fails
        }
      }

      log.info("Discovery loop completed", {
        processedCount: projects.length,
        crisId: this.cris.id
      });

    } catch (error) {
      log.error("Error in discovery loop:", error);
      throw error;
    }
  }

  async discover(onlyWithoutExternalEntities = true) {
    log.info("Discovering external entities...", this.cris);

    const researchInstitutionId = this.cris.researchInstitution.id

    const countProjects = await this.countProjects(researchInstitutionId, onlyWithoutExternalEntities)
    log.debug(`Found ${countProjects} projects for research institution ID ${researchInstitutionId}`);

    const countProjectsWithoutExternalEntities = await this.countProjects(researchInstitutionId, true);
    log.debug(`Found ${countProjectsWithoutExternalEntities} projects without external entities for research institution ID ${researchInstitutionId}`);

    this.loop(onlyWithoutExternalEntities);
  }
}
