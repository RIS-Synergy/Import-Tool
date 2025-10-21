import { PrismaClient } from '@prisma/client'

import { Differ } from '@/models/Diff.js'
import { getAuthEndpointV2 } from './fa-oauth2-api.service.js'
import { Registry } from './fa-registry.service.js'

const prisma = new PrismaClient()

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'fa:fa-sync' });

type ProjectCountStats = {
  new: { size: number, sampleIds?: string[] }
  existing: { size: number, sampleIds?: string[] }
  updated: { size: number, sampleIds?: string[] }
};

type RISRegistryData = {
  id: string,
  info: string,
  name: string,
  oauth2: string,
  acronym: string,
  contact: string
}

export class FundingAgencySync {
  // Best to keep it to 1000; setting it to 100 for test
  pageSize = 1000;
  isSyncRunning = false;
  showSample = 5
  registry: Registry;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private data: RISRegistryData
  ) {
    this.registry = new Registry(this.data.oauth2);
  }

  async start(): Promise<ProjectCountStats> {
    const startTime = Date.now();

    if (this.isSyncRunning) {
      log.info('Sync is already running');
      return {
        new: { size: 0, sampleIds: [] },
        existing: { size: 0, sampleIds: [] },
        updated: { size: 0, sampleIds: [] }
      };
    }

    const projects = await this.fetchAllProjectPages();
    const fetchDurationSeconds = (Date.now() - startTime) / 1000;

    log.info(`Received ${projects.length} Projects in ${fetchDurationSeconds} seconds`);

    const countStats = await this.saveProjectsToDatabase(projects);
    const totalProjectsInDatabase = await prisma.project.count();

    log.info('Projects saved to database', countStats);
    log.info(`Database has ${totalProjectsInDatabase} projects`);

    return countStats;
  }

  private async saveProjectsToDatabase(faProjects: any[]): Promise<ProjectCountStats> {
    const countStats: ProjectCountStats = {
      new: { size: 0, sampleIds: [] },
      existing: { size: 0, sampleIds: [] },
      updated: { size: 0, sampleIds: [] }
    };

    // Filter out invalid projects early
    const validProjects = faProjects.filter(project => project?.id);
    if (validProjects.length === 0) return countStats;

    // Get IDs of all projects to check which ones exist
    const projectIds = validProjects.map(project => project.id);
    const existingProjects = await prisma.project.findMany({
      where: { risId: { in: projectIds } },
      select: { risId: true, risData: true }
    });

    // Create a map for faster lookups
    const existingProjectMap = new Map(
      existingProjects.map(project => [project.risId, project.risData])
    );

    // Process each project
    await Promise.all(validProjects.map(async (project) => {
      const projectHasExistingRecord = existingProjectMap.has(project.id);

      if (!projectHasExistingRecord) {
        await this.createNewProject(project, countStats);
      } else {
        await this.updateExistingProject(project, existingProjectMap.get(project.id), countStats);
      }
    }));

    return countStats;
  }

  private async createNewProject(project: any, countStats: ProjectCountStats): Promise<void> {
    try {
      await prisma.project.create({
        data: {
          risId: project.id,
          risData: project
        }
      });
      log.debug(`Project ${project.id} created`);
      countStats.new.size++;
      // Add sample ID if we haven't reached the limit
      if (countStats.new.sampleIds!.length < this.showSample) {
        countStats.new.sampleIds!.push(project.id);
      }
    } catch (error) {
      log.error('Error creating project', error);
    }
  }

  private async updateExistingProject(
    newProjectData: any,
    oldProjectData: any,
    countStats: ProjectCountStats
  ): Promise<void> {
    const hasChanges = await this.doesProjectHaveChanges(oldProjectData, newProjectData);

    if (!hasChanges) {
      countStats.existing.size++;
      // Add sample ID if we haven't reached the limit
      if (countStats.existing.sampleIds!.length < this.showSample) {
        countStats.existing.sampleIds!.push(newProjectData.id);
      }
      return;
    }

    const wasUpdated = await this.updateProjectInDatabase(newProjectData);
    if (wasUpdated) {
      countStats.updated.size++;
      // Add sample ID if we haven't reached the limit
      if (countStats.updated.sampleIds!.length < this.showSample) {
        countStats.updated.sampleIds!.push(newProjectData.id);
      }
    } else {
      countStats.existing.size++;
      // Add sample ID if we haven't reached the limit
      if (countStats.existing.sampleIds!.length < this.showSample) {
        countStats.existing.sampleIds!.push(newProjectData.id);
      }
    }
  }

  private async doesProjectHaveChanges(oldData: any, newData: any): Promise<boolean> {
    const diffSet = new Differ(oldData, newData).diff();
    const hasChanges = diffSet.size > 0;

    if (hasChanges) {
      log.debug('Diff set found for project', newData.id, diffSet);
    }

    return hasChanges;
  }

  private async updateProjectInDatabase(projectData: any): Promise<boolean> {
    try {
      await prisma.project.update({
        where: { risId: projectData.id },
        data: { risData: projectData }
      });
      log.debug('Project', projectData.id, "updated");
      return true;
    } catch (error) {
      log.error('Error updating project', error);
      return false;
    }
  }

  private async fetchAllProjectPages(): Promise<any[]> {
    if (this.isSyncRunning) {
      log.info('Sync is already running');
      return [];
    }

    this.isSyncRunning = true;
    const allProjects: any[] = [];
    let currentPage = 0;
    let hasMorePages = true;

    try {
      while (hasMorePages) {
        const currentPageProjects = await this.fetchProjectsPage(currentPage);

        // Ensure we always have an array to work with
        const safePageProjects = Array.isArray(currentPageProjects) ? currentPageProjects : [];

        // If we get an empty array, stop pagination
        if (safePageProjects.length === 0) {
          hasMorePages = false;
        } else {
          allProjects.push(...safePageProjects);
          currentPage++;
        }
      }

      log.info(`===> FA Received total: ${allProjects.length} Projects`);
      return allProjects;
    } catch (error) {
      log.error('Error during pagination', error);
      return allProjects; // Return what we have so far
    } finally {
      this.isSyncRunning = false;
    }
  }

  private async getProjectsEndpointUrl(): Promise<string> {
    const areEndpointsCached = this.registry.endpoints.size > 0;

    if (!areEndpointsCached) {
      await this.registry.findEndpoints(this.data.info, this.clientId, this.clientSecret);
      log.debug('Fetched registry endpoints:', this.registry.endpoints.size);
    }

    return this.registry.getURL('project', 'PROJECTS');
  }

  private async fetchProjectsPage(page: number): Promise<any[]> {
    try {
      const baseUrl = await this.getProjectsEndpointUrl();
      const paginatedUrl = `${baseUrl}?page[page]=${page * this.pageSize}&page[size]=${this.pageSize}`;

      const response = await getAuthEndpointV2(
        paginatedUrl, this.data.oauth2, this.clientId, this.clientSecret);

      // Ensure response is always an array
      const safeResponse = Array.isArray(response) ? response : [];
      log.debug(`Received ${safeResponse.length} Projects for page ${page}`);

      return safeResponse;
    } catch (error) {
      log.error('Error fetching page', error);
      return []; // Always return an array
    }
  }
}
