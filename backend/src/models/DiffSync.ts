import { Logger } from "tslog"
import { ResearchInstitution } from "./ResearchInstitution"
import { Diff } from "./Diff";
const log = new Logger({ name: "DiffSync" });

import { parseTimeoutString } from "../utils/sync";

const ri = new ResearchInstitution()

export class DiffSync {
  constructor() {
  }

  async process () {
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
    result.items.map (async (item: any) => {
      const { systemName } = item
      const diff = new Diff(item.uuid, systemName)
      const risId = ri.entityToRISId(item)
      // log.info(systemName, Object.keys(item))
      log.info('RIS ID', risId)
    })
    // return result.items

  }

  start (timeoutString: string) {
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
}
