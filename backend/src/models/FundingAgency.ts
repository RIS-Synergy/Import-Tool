import { PrismaClient } from '@prisma/client'
import { Logger } from "tslog";

import { Project } from './Project'
import { getAuthEndpoint } from "../utils/oauth2";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:FundingAgency' });

export class FundingAgency {
  id = 'FWF';

  constructor() {}

  static async copyProjectToDatabase() {
    let projects = []

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

    let countStats = {
      new: 0,
      existing: 0
    }
    // Save all the projects to the database
    await Promise.all(projects.map(async (project) => {
      // if not exists
      const projectExists = await Project.ifExists(project.id)

      if (!projectExists) {
        const newProject = await prisma.project.create({
          data: {
            risId: project.id,
            risData: project
          }
        })
        // log.debug(`Project ${newProject.risId} created`)
        countStats.new++
      } else {
        // log.debug(`Project ${project.id} already exists`)
        countStats.existing++
      }
    }))

    log.info('Projects saved to database', countStats)
  }
}
