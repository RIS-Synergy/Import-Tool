const fs = require('fs');
const path = require('path');

import { Logger } from "tslog";
const log = new Logger({ name: 'create-functions' });

import  { Function } from '../src/models/Function'

import dotenv from "dotenv";
dotenv.config();

const jsonPath = path.join(__dirname, '../resources/functions');

async function main () {
  const count = await Function.count();
  log.info('Number of functions:', count);

  // get all the files in the directory
  const files = fs.readdirSync(jsonPath);

  // load data from each
  for (const file of files) {
    const filePath = path.join(jsonPath, file);
    const code = fs.readFileSync(filePath, 'utf-8');

    const fileName = path.basename(file, '.ts');

    const fn = await Function.createOrUpdate(fileName, code, 'typescript')
    console.log(fn)
  }

}

main()
