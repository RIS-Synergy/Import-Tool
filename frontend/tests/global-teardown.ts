import { rmSync } from "fs";
import { join } from "path";

const env = process.env.NODE_ENV;
const authDir = join(process.cwd(), `tests/.auth-${env}/`);

async function globalTeardown() {
  try {
    rmSync(authDir, { recursive: true, force: true });
    console.log(`✅ Auth Dir '${authDir}' deleted after tests.`);
  } catch (err) {
    console.log(err)
  }
}

export default globalTeardown;
