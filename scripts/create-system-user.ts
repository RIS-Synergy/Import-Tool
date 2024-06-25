import prompts from 'prompts';
import dotenv from "dotenv";
dotenv.config();

import { callRIApi } from '../src/utils/ri-api'

if (process.argv.length !== 4) {
  console.log('Usage: yarn create-system-user <username> <email>')
  process.exit(1)
}

const username = process.argv[2];
const email = process.argv[3];

const json: any = {
  username,
  email,
  pureSystemUser: true,
}

async function main () {
  console.log(json);


  console.log('This scipt is needed to create one system user for creating a PURE API key.')

  var value = await prompts({
    message: `Create a new system user '${username}' with email '${email}'?`,
    type: 'confirm',
    name: 'value'
  });

  // process.exit(0); // remove this line TODO

  if (!value) {
    process.exit(0);
  }

  const result = await callRIApi('/users', 'PUT', json)
  console.log(result)
}
main()
