import prisma from '@/lib/prisma.js';

import { CRIS } from "@/features/cris/cris.model.js";
import CrisAPI from './cris.api.service.js';
import { LikelyhoodService } from './cris.diff.service.js';

import { ProjectService } from '@/features/project/services/project.service.js';
import { jobManager } from '@/features/job/job.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:cris:discoverExternalService' });

/*
  🧐
 */
export default class DiscoverExternalService {
  // take = 5;
  statuses: string[] = ['IN_PREPERATION', 'ACTIVE'];
  orderBy = [{ startDate: 'desc' }, { createdDate: 'asc' }];

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

  private async loop(jobId: string, withoutExternalEntities = false) {
    log.info("Starting discovery loop", {
      crisId: this.cris.id,
      withoutExternalEntities,
      // take: this.take
    });

    const crisAPI = new CrisAPI(this.cris.apiUrl, this.cris.apiKey);
    const likelihoodService = new LikelyhoodService(crisAPI);

    const projectService = new ProjectService();
    try {
      const projects = await projectService.findByResearchInstitution(
        this.cris.researchInstitution.id,
        {
          statuses: this.statuses,
          count: false,
          select: {
            id: true,
            risId: true,
            startDate: true
          },
          orderBy: this.orderBy
        }
      )

      log.debug("--------------------------------");
      log.debug(`Found ${projects.length} projects to process`);
      log.debug("--------------------------------");

      log.info(this.cris, crisAPI)

      jobManager.updateJob(jobId, 0, projects.length, `Found ${projects.length} projects`);

      // sleep 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process each project with delay
      let processedCount = 0;
      for (const project of projects) {
        if (jobManager.isJobCancelled(jobId)) {
          log.info(`Discover job ${jobId} was cancelled by user`);
          break;
        }

        try {
          jobManager.updateJob(jobId, processedCount, projects.length, `Processing project ${project.risId}`);
          log.debug(`Processing project ${project.risId}, Start Date: ${project.startDate}`);
          await likelihoodService.calculateAndSave(project.risId, this.cris.id);

          log.debug(`Finished processing project ${project.risId}`)
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          log.error(`Error processing project ${project.risId}:`, error);
          // Continue with next project even if one fails
        }
        processedCount++;
      }

      if (!jobManager.isJobCancelled(jobId)) {
        log.info("Discovery loop completed", {
          processedCount: projects.length,
          crisId: this.cris.id
        });
        jobManager.completeJob(jobId, `Completed processing ${projects.length} projects`);
      }

    } catch (error) {
      log.error("Error in discovery loop:", error);
      jobManager.failJob(jobId, error.message || 'Unknown error');
      throw error;
    }
  }

  async discover(onlyWithoutExternalEntities = true) {
    log.info("Discovering external entities...", this.cris);

    const jobId = `cris-discover-${this.cris.id}`;
    const job = jobManager.startJob(jobId, 'discover', this.cris.id.toString(), 'Discovering external entities...');

    const researchInstitutionId = this.cris.researchInstitution.id

    const countProjects = await this.countProjects(researchInstitutionId, onlyWithoutExternalEntities)
    log.debug(`Found ${countProjects} projects for research institution ID ${researchInstitutionId}`);

    const countProjectsWithoutExternalEntities = await this.countProjects(researchInstitutionId, true);
    log.debug(`Found ${countProjectsWithoutExternalEntities} projects without external entities for research institution ID ${researchInstitutionId}`);

    this.loop(jobId, false).catch(e => {
        log.error("Unhandled error in discover loop", e);
        jobManager.failJob(jobId, e.message || 'Unknown error');
    });

    return job;
  }
}
