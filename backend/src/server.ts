import path from "path";
import dotenv from "dotenv";
import fs from "fs";

const envFile = path.join(__dirname, process.env.DOTENV_CONFIG_PATH)
dotenv.config({ path: envFile });

// run it from /run/secrets/db_password and omit the \n
var db_password = fs.readFileSync('/run/secrets/db_password', 'utf8')
  .replace(/\n$/, '');

// url-encode the password
db_password = encodeURIComponent(db_password)

// set the DATABASE_URL that will be used in prisma.schema
process.env.DATABASE_URL = `postgresql://ris-user:${db_password}@ris-db:5432/ris_db?schema=public`

import app from './app'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`RIS-Synergy API listening on port ${port}`)
})
