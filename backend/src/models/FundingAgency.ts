// import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { Logger } from "tslog";

import { Project } from './Project'
import { getAuthEndpoint } from "../utils/oauth2";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:FundingAgency' });

export class FundingAgency {
  pageSize = 1000;
  running = false;

  async copyProjectToDatabase() {
    let projects = []

    const start = new Date().getTime()
    projects = await this.fetchAllPages()
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

    if(this.running) {
      log.info('Already running')
      throw new Error('Already running')
    }

    this.running = true

    do {
      // TODO FWF bug: page[page] should not need the `page * this.pageSize` multiplier.
      // const url = `${process.env.RIS_URL_PROJECTS}?page[page]=${page * this.pageSize}&page[size]=${this.pageSize}`
      const url = `${Project.getUrl('PROJECTS')}?page[page]=${page * this.pageSize}&page[size]=${this.pageSize}`
      log.info(`Fetching page ${page} from ${url}`)
      try {
      response = await getAuthEndpoint(url)
      // fs.writeFileSync(`projects/project_${page}.json`, JSON.stringify(response, null, 2))

      projects = projects.concat(response)
      log.info(`Received ${response.length} (total: ${projects.length}) Projects`)
      } catch (error) {
        log.error('Error fetching page', url, error)
        // exit loop
      }
      page++
    } while (response && response.length >= 0)

    log.info(`====================`)
    log.info(`Received total: ${projects.length} Projects`)


    this.running = false

    return projects;
  }

  parseTimeoutString (timeoutString: string) {
    const match = timeoutString.match(/(\d+)([smh])/)
    if (!match) {
      throw new Error('Invalid timeout string')
    }

    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 's':
        return value
      case 'm':
        return value * 60
      case 'h':
        return value * 60 * 60
      default:
        throw new Error('Invalid timeout unit')
    }
  }

  start (timeoutString: string = process.env.FA_SYNC_TIME) {
    if (!timeoutString) {
      throw new Error('No timeout string "FA_SYNC_TIME" provided')
    }

    const timeout = this.parseTimeoutString(timeoutString)
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
