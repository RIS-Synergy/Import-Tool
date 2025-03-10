import { Logger } from "tslog"
import { ResearchInstitution } from "./ResearchInstitution"
import { Diff } from "./Diff";
const log = new Logger({ name: "DiffSync" });
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { parseTimeoutString } from "../utils/sync";

const ri = new ResearchInstitution()

export class DiffSync {
  constructor() {
  }

  async process() {
    console.log('Processing DiffSync')
    // search for many entities with a "RIS ID"
    const search = {
      size: 10000, // might be too high
      offset: 0,
      searchString: 'ris:FWF:project:*'
    }
    const result = await ri.callApi('/projects/search', 'POST', search)
    log.info('Count', result.count, result.items.length)
    // next: loop the result.items
    result.items.map(async (item: any) => {
      const { systemName } = item
      const risId = ri.entityToRISId(item)
      const diff = new Diff(risId, systemName)
      await diff.setProjectData()
      diff.crisData = item
      // log.info(systemName, Object.keys(item))
      const templateSelected = 68 // Projects
      const result = await diff.runPipeline(templateSelected)
      log.info(risId, diff.improveOutput(result.diffList))
      this.save(risId, diff.improveOutput(result.diffList))
    })
  }

  start(timeoutString: string) {
    if (!timeoutString) {
      throw new Error('No timeout string "CRIS_SYNC_TIME" provided')
    }

    const timeout = parseTimeoutString(timeoutString)
    log.info(`Starting the CRIS -> DB sync process for ${timeoutString} (${timeout} seconds)`)

    setTimeout(() => {
      try {
        log.info('Timeout reached')
        this.process()
        this.start(timeoutString)
      } catch (error) {
        log.error('Error in timeout', error)
      }
    }, timeout * 1000)
  }

  // save to DB
  save = async (risId: string, data: any) => {
    // create or update
    await prisma.diff.upsert({
      where: { id: risId },
      update: {
        list: data,
        length: data.length
      },
      create: {
        list: data,
        template: {
          connect: { id: 68 }
        },
        length: data.length,
        project: {
          connect: { risId: risId }
        }
      }
    })
  }
}
