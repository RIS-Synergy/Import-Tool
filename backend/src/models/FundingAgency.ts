// import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { Logger } from "tslog";

import { Project } from './Project'
import { getAuthEndpoint } from "../utils/oauth2";

const prisma = new PrismaClient()
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

  private async saveProjectsToDatabase(projects: any[]) {
    let countStats = { new: 0, existing: 0 };

    await Promise.all(projects.map(async (project) => {
      if (!project || !project.id) return;

      const projectExists = await Project.ifExists(project.id);

      if (!projectExists) {
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
        countStats.existing++;
      }
    }));

    return countStats;
  }

  async fetchAllPages() {
    let page = 0;
    let projects = [];
    let response = [];

    if (this.running) {
      log.info('Already running');
      throw new Error('Already running');
    }

    this.running = true;

    do {
      console.log(response)

      response = await this.fetchPage(page);
      projects = projects.concat(response);
      page++;
    } while (response && response.length > 0);

    log.info(`====================`);
    log.info(`Received total: ${projects.length} Projects`);

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
  start (timeoutString: string = process.env.FA_SYNC_TIME) {
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
