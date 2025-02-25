import { Logger } from "tslog"
const log = new Logger({ name: "DiffSync" });

import { parseTimeoutString } from "../utils/sync";

export class DiffSync {
  constructor() {
  }

  start (timeoutString: string = process.env.CRIS_SYNC_TIME) {
    if (!timeoutString) {
      throw new Error('No timeout string "CRIS_SYNC_TIME" provided')
    }

    const timeout = parseTimeoutString(timeoutString)
    log.info(`Starting the CRIS -> DB sync process for ${timeoutString} (${timeout} seconds)`)

    setTimeout(() => {
      try {
        log.info('Timeout reached')
        this.start(timeoutString)
      } catch (error) {
        log.error('Error in timeout', error)
      }
    }, timeout * 1000)
  }
}
