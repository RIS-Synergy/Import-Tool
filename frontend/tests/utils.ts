import { join } from "path";

const env = process.env.NODE_ENV;
const storageState = join(process.cwd(), `tests/.auth-${env}/user.json`)

console.log('Using auth file:', storageState)

export const user = { storageState }
