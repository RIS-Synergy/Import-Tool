import { join } from "path";

const env = process.env.NODE_ENV;

function getUser (username: string) {
  const storageState = join(process.cwd(), `tests/.auth-${env}/${username}.json`)
  console.log(`Using user '${username}':`, storageState)
  return storageState
}

export const user = { storageState: getUser('user') }
export const admin = { storageState: getUser('admin') }
