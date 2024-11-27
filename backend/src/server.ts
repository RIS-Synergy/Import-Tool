import path from "path";
import dotenv from "dotenv";
import { importSecretsToProcess } from "./utils/secrets";
import app from './app'
import { TransformStreamDefaultController } from "stream/web";
import { Logger } from "tslog"
import { envLogs } from "./utils/env-logs";

const log = new Logger({ name: "server" });
const port = process.env.PORT || 3000

Error.stackTraceLimit = 32;

dotenv.config()
// importSecretsToProcess()

envLogs()

app.listen(port, () => {
  log.info(`RIS-Synergy API listening on port ${port}`)
})
