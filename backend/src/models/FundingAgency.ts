import { PrismaClient } from '@prisma/client'

import { Project } from './Project.js'
import { Differ } from './Diff.js'
import { getAuthEndpoint } from "../utils/oauth2.js";

const prisma = new PrismaClient()

import { Logger } from "../utils/logger.js";
const log = new Logger({ name: 'model:FundingAgency' });

import { parseTimeoutString } from "../utils/sync.js";

export class FundingAgency {
  pageSize = 1000;
  running = false;

  async copyProjectToDatabase() {
    const start = new Date().getTime();
    const countStats = { new: 0, existing: 0, updated: 0 };
    let page = 0;
    let response = [];
    let totalProjectsProcessed = 0;

    if (this.running) {
      log.info('Already running');
      return countStats;
    }

    this.running = true;

    try {
      do {
        response = await this.fetchPage(page);
        const safePageProjects = Array.isArray(response) ? response : [];
        if (safePageProjects.length === 0) {
          break;
        }

        await this.saveProjectsToDatabaseChunk(safePageProjects, countStats);
        totalProjectsProcessed += safePageProjects.length;
        page++;
      } while (response && response.length > 0);

      const end = new Date().getTime() - start;
      log.info(`Finished sync for ${totalProjectsProcessed} projects in ${end / 1000} seconds`);
    } catch (error) {
      log.error('Error during pagination sync', error);
    } finally {
      this.running = false;
    }

    log.info('Projects saved to database', countStats);
    log.info(`Database has ${await prisma.project.count()} projects`);

    return countStats;
  }

  private async saveProjectsToDatabaseChunk(
    faProjects: any[],
    countStats: { new: number; existing: number; updated: number }
  ): Promise<void> {
    const validProjects = faProjects.filter(project => project?.id);
    if (validProjects.length === 0) return;

    // Fetch existing projects for this chunk to avoid loading too many at once
    const projectIds = validProjects.map(project => project.id);
    const existingProjects = await prisma.project.findMany({
      where: { risId: { in: projectIds } },
      select: { risId: true, risData: true }
    });

    const existingProjectMap = new Map(
      existingProjects.map(project => [project.risId, project.risData])
    );

    // Process in batches of 100
    const batchSize = 100;
    for (let i = 0; i < validProjects.length; i += batchSize) {
      const batch = validProjects.slice(i, i + batchSize);
      await Promise.all(batch.map(async (project) => {
        const projectHasExistingRecord = existingProjectMap.has(project.id);

        if (!projectHasExistingRecord) {
          try {
            const newProject = await prisma.project.create({
              data: {
                risId: project.id,
                risData: project
              }
            });
            log.debug(`Project ${newProject.risId} created`);
            countStats.new++;
          } catch (error) {
            log.error('Error creating project', error);
          }
        } else {
          try {
            const updated = await this.upsertProject(project, existingProjectMap.get(project.id));
            if (updated) {
              countStats.updated++;
            } else {
              countStats.existing++;
            }
          } catch (error) {
            log.error('Error updating existing project', error);
            countStats.existing++;
          }
        }
      }));
    }
  }

  async upsertProject(newProject: any, oldProject: any): Promise<boolean> {
    const diffSet = new Differ(oldProject, newProject).diff()
    if (diffSet.size === 0) {
      return false
    }

    log.debug('Diff set', newProject.id, diffSet)

    try {
      const dbResult = await prisma.project.update({
        where: { risId: newProject.id },
        data: { risData: newProject }
      });
      log.debug('Project', dbResult.id, "updated");
      return true
    } catch (error) {
      log.error('Error updating project', error);
    }
  }

  async fetchAllPages() {
    let page = 0;
    let projects = [];
    let response = [];

    if (this.running) {
      log.info('Already running');
      return []
    }

    this.running = true;

    do {
      response = await this.fetchPage(page);
      projects = projects.concat(response);
      page++;
    } while (response && response.length > 0);

    log.info(`===> FA Received total: ${projects.length} Projects`);

    this.running = false;

    return projects;
  }

  private async fetchPage(page: number) {
    const url = `${Project.getUrl('PROJECTS')}?page[page]=${page * this.pageSize}&page[size]=${this.pageSize}`;
    log.info(`Fetching page ${page} from ${url}`);
    try {
      console.log('Response fetchPage', url)
      const response = await getAuthEndpoint(url);
      log.info(`Received ${response.length} Projects`);
      return response;
    } catch (error) {
      log.error('Error fetching page', url, error);
      return [];
    }
  }

  /* istanbul ignore next */
  start(timeoutString: string = process.env.FA_SYNC_TIME) {
    if (!timeoutString) {
      throw new Error('No timeout string "FA_SYNC_TIME" provided')
    }

    const timeout = parseTimeoutString(timeoutString)
    log.info(`Starting the FA -> DB sync process for ${timeoutString} (${timeout} seconds)`)

    setTimeout(() => {
      try {
        log.info('Timeout reached')
        this.copyProjectToDatabase()
        this.start(timeoutString)
      } catch (error) {
        log.error('Error in timeout', error)
      }
    }, timeout * 1000)
  }
}
