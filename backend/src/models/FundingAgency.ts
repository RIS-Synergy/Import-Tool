import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { Logger } from "tslog";

import { Project } from './Project'
import { getAuthEndpoint } from "../utils/oauth2";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:FundingAgency' });

export class FundingAgency {
  id = 'FWF';
  pageSize = 1000;

  constructor() {}

  async copyProjectToDatabase() {
    let projects = []

    const start = new Date().getTime()
    projects = await this.fetchAllPages()
    /*
    // Download all the projects from the RIS
    try {
      // measure time
      log.info('Starting to download all Projects')
      const start = new Date().getTime()
      projects = await getAuthEndpoint(process.env.RIS_URL_PROJECTS);
      const end = new Date().getTime() - start
      log.info(`Received ${projects.length} Projects in ${end / 1000} seconds`)
    } catch (error) {
      log.error('Error downloading Projects', error)
      return
    }
    */
    const end = new Date().getTime() - start
    log.info(`Received ${projects.length} Projects in ${end / 1000} seconds`)

    let countStats = {
      new: 0,
      existing: 0
    }
    // log.info(`Database has ${await prisma.project.count()} projects`)

    // Save all the projects to the database
    await Promise.all(projects.map(async (project) => {

      if(!project.id) { // bug from FWF
        log.error('Project has no id', project)
        return
      }

      // if not exists
      const projectExists = await Project.ifExists(project.id)

      if (!projectExists) {
        try {
          const newProject = await prisma.project.create({
            data: {
              risId: project.id,
              risData: project
            }
          })
          log.debug(`Project ${newProject.risId} created`)
          countStats.new++
        } catch (error) {
          log.error('Error creating project', error)
        }
      } else {
        // log.debug(`Project ${project.id} already exists`)
        countStats.existing++
      }
    }))

    log.info('Projects saved to database', countStats)
    log.info(`Database has ${await prisma.project.count()} projects`)
  }

  // fetch all pages of the API where the parameters include page[page] and page[size]
  async fetchAllPages() {
    let page = 0
    let projects = []
    let response = []

    do {
      // TODO FWF bug: page[page] should not need the `page * this.pageSize` multiplier.
      const url = `${process.env.RIS_URL_PROJECTS}?page[page]=${page * this.pageSize}&page[size]=${this.pageSize}`
      log.info(`Fetching page ${page} from ${url}`)
      response = await getAuthEndpoint(url)
      // fs.writeFileSync(`projects/project_${page}.json`, JSON.stringify(response, null, 2))

      projects = projects.concat(response)
      log.info(`Received ${response.length} (total: ${projects.length}) Projects`)
      page++
    } while (response.length >= 0)

    log.info(`====================`)
    log.info(`Received total: ${projects.length} Projects`)

    return projects;
  }
}
