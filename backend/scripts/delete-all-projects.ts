import prompts from 'prompts';
import dotenv from "dotenv";
dotenv.config();

import { callRIApi } from '../src/utils/ri-api'

const arg = process.argv[2];

const json: any = {
  uuid: arg
}

console.log(json);

async function main () {
  const result = await callRIApi('/projects/search', 'POST', {
    size: 10,
    offset: 0,
    searchString: "10.55776/", // FWF id
  })

  const { count, items } = result;

  console.log('Number of projects to DELETE:', count);

  items.forEach(async (item: any) => {
    console.log(item.title, item.uuid, item.pureId);

    var value = await prompts({
      message: 'Delete this project?',
      type: 'confirm',
      name: 'value'
    });
    console.log(value);

    // if (value) {
    //   const result = await callRIApi(`/projects/${item.uuid}`, 'DELETE')
    //   console.log(result);
    // }

    // continue?
    value = await prompts({
      message: 'Continue?',
      type: 'confirm',
      name: 'value'
    });

    if (!value) {
      process.exit(0);
    }
  })

  // console.log(result);
}
main()
