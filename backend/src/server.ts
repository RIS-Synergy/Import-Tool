import dotenv from "dotenv";
import app from './app.js'
import { Logger } from "./utils/logger.js";
import { envLogs } from "./utils/env-logs.js";
import { FundingAgency } from "./models/FundingAgency.js";
import { DiffSync } from "./models/DiffSync.js";

const log = new Logger({ name: "server" });
const port = process.env.PORT || 3000

Error.stackTraceLimit = 32;

dotenv.config()

envLogs()

app.listen(port, () => {
  log.info(`RIS-Synergy API listening on port ${port}`)
})

const fundingAgency = new FundingAgency()
fundingAgency.start()

if (process.env.CRIS_SYNC_TIME && process.env.PURE_API_URL) {
  const diffSync = new DiffSync()
  diffSync.start(process.env.CRIS_SYNC_TIME)
} else {
  log.warn('No CRIS_SYNC_TIME or PURE_API_URL provided. DiffSync will not start.')
}
