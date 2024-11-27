import { Logger } from "tslog"
const log = new Logger({ name: "env" });

const passKeys = [
  'RIS_FA_API_KEY',
  'RIS_RI_API_KEY',
  'JWT_SECRET',
  'DATABASE_PASSWORD',
]

export function envLogs() {
  log.silly('=====================')
  log.info('Env:', process.env.NODE_ENV)
  log.silly('=====================')
  Object.entries(process.env).sort().forEach(([key, value]) => {
    if (passKeys.includes(key)) {
      console.log(`${key}=*****`)
    } else if (key.startsWith('npm_')) {
      // ignore npm_*
    } else {
      console.log(key, value)
    }
  })
  log.info('=====================')
}
