import path from "path";
import dotenv from "dotenv";
import app from './app'
import { TransformStreamDefaultController } from "stream/web";
import { Logger } from "tslog"
import { envLogs } from "./utils/env-logs";
import { FundingAgency } from "./models/FundingAgency";
import { Registry } from "./models/Registry";

const log = new Logger({ name: "server" });
const port = process.env.PORT || 3000

Error.stackTraceLimit = 32;

dotenv.config()

Registry.run()

envLogs()

app.listen(port, () => {
  log.info(`RIS-Synergy API listening on port ${port}`)
})

const fundingAgency = new FundingAgency()
fundingAgency.start()
