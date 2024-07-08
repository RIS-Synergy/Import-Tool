import dotenv from "dotenv";
dotenv.config();

import { callRIApi } from '../src/utils/ri-api'

// read the json file
const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, './create-sample/award.json');
const json = fs.readFileSync(jsonPath, 'utf-8');
console.log(json);

async function main () {
  const result = await callRIApi('/awards', 'PUT', JSON.parse(json))
  console.log(result);

  // save the result
  const resultPath = path.join(__dirname, 'result.json');
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Result saved to ${resultPath}`);
}
main()
