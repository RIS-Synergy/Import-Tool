import { PrismaClient } from '@prisma/client'

import { Differ } from '@/models/Diff.js'
import { getAuthEndpointV2 } from './fa-oauth2-api.service.js'
import { Registry } from './fa-registry.service.js'

const prisma = new PrismaClient()

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'fa:fa-sync' });

export class FundingAgencySync {
  pageSize = 100; // best to keep it to 1000; setting it to to 100 for test
  running = false;
  registry: Registry;

  constructor(private clientId: string,
              private clientSecret: string,
              private infoUrl: string
             ) {
    this.registry = new Registry();
  }

  async start() {
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

  private async upsertProject(newProject: any, oldProject: any): Promise<boolean> {
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
      log.debug('Project', dbResult.risId, "updated");
      return true
    } catch (error) {
      log.error('Error updating project', error);
    }
  }

  private async fetchAllPages() {
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

  private async getUrl(url: 'PROJECTS' | 'PROJECT') {
    if (!this.registry.endpoints.size) {
      await this.registry.findEndpoints(this.infoUrl, this.clientId, this.clientSecret)
      log.debug('Fetched registry (ℹ) endpoints:', this.registry.endpoints.size)
    } else {
      // log.debug('Fetched registry endpoints already exist:', this.registry.endpoints.size)
    }

    return this.registry.getURL('project', url)
  }

  private async fetchPage(page: number) {
    const url = await this.getUrl('PROJECTS') +
      `?page[page]=${page * this.pageSize}&page[size]=${this.pageSize}`;

    // log.info(`Fetching page ${page} from ${url}`);
    try {
      // log.debug('Response fetchPage', url)
      const response = await getAuthEndpointV2(url, this.clientId, this.clientSecret);
      log.debug(`Received ${response.length} Projects`);
      return response;
    } catch (error) {
      log.error('Error fetching page', url, error);
      return [];
    }
  }
}
