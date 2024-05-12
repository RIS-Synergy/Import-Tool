import dotenv from "dotenv";
dotenv.config();

import { callRIApi } from '../src/utils/ri-api'

const arg = process.argv[2];

const json: any = {
  uuid: arg
}

console.log(json);

async function main () {
  const result = await callRIApi(`/projects/${arg}`, 'DELETE')

  console.log(result);
}
main()
