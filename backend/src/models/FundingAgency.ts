import { PrismaClient } from '@prisma/client'

import { Project } from './Project'
import { Differ } from './Diff'
import { getAuthEndpoint } from "../utils/oauth2";

const prisma = new PrismaClient()

import { Logger } from "../utils/logger";
const log = new Logger({ name: 'model:FundingAgency' });

import { parseTimeoutString } from "../utils/sync";

export class FundingAgency {
  pageSize = 1000;
  running = false;

  async copyProjectToDatabase() {
    const start = new Date().getTime();
    const projects = await this.fetchAllPages();
    const end = new Date().getTime() - start;
    log.info(`Received ${projects.length} Projects in ${end / 1000} seconds`);

    const countStats = await this.saveProjectsToDatabase(projects);

    log.info('Projects saved to database', countStats);
    log.info(`Database has ${await prisma.project.count()} projects`);

    return countStats
  }

  private async saveProjectsToDatabase(faProjects: any[]) {
    let countStats = { new: 0, existing: 0, updated: 0 };

    // Fetch all existing projects
    const projectIds = faProjects.map(p => p.id).filter(id => id);
    const existingProjects = await prisma.project.findMany({
      where: { risId: { in: projectIds } },
      select: { risId: true }
    });

    const existingProjectIds = new Set(existingProjects.map(p => p.risId));

    await Promise.all(faProjects.map(async (project) => {
      if (!project || !project.id) return;

      if (!existingProjectIds.has(project.id)) {
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
        const existingProject = await prisma.project.findUnique({
          where: { risId: project.id },
          select: { risData: true }
        });
        const updated = await this.upsertProject(project, existingProject.risData);
        if (updated) {
          countStats.updated++;
        } else {
          countStats.existing++;
        }
      }
    }));

    return countStats;
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
