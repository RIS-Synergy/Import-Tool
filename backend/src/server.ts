import path from "path";
import dotenv from "dotenv";
import fs from "fs";

// const envFile = path.join(__dirname, process.env.DOTENV_CONFIG_PATH)
// dotenv.config({ path: envFile });
dotenv.config()

if (!process.env.DATABASE_URL) {
  // run it from /run/secrets/db_password and omit the \n
  var db_password = fs.readFileSync('/run/secrets/db_password', 'utf8').replace(/\n$/, '');

  // url-encode the password
  db_password = encodeURIComponent(db_password)

  // set the DATABASE_URL that will be used in prisma.schema
  process.env.DATABASE_URL = `postgresql://ris-user:${db_password}@ris-db:5432/ris_db?schema=public`
}

if (!process.env.AUTH_CLIENT_SECRET) {
  // same for AUTH_CLIENT_SECRET
  process.env.AUTH_CLIENT_SECRET = fs.readFileSync('/run/secrets/fa_api_client_secret', 'utf8').replace(/\n$/, '');
}

if (!process.env.PURE_API_KEY) {
  // same for PURE_API_KEY
  process.env.PURE_API_KEY = fs.readFileSync('/run/secrets/ri_api_key', 'utf8').replace(/\n$/, '');
}

import app from './app'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`RIS-Synergy API listening on port ${port}`)
})
