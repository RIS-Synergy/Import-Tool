import path from "path";
import dotenv from "dotenv";

const envFile = path.join(__dirname, process.env.DOTENV_CONFIG_PATH)
dotenv.config({ path: envFile });

import app from './app'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`RIS-Synergy API listening on port ${port}`)
})
