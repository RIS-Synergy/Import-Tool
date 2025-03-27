import { Excel } from '../src/models/Excel'
import { readFileSync } from "fs";

import { resolve } from "path";
import { homedir } from "os";

const expandPath = (name: string) =>
  resolve(name.replace(/^~(?=$|\/)/, homedir()));

import prompts from 'prompts';

async function main() {
  var { name } = await prompts({
    message: `File name`,
    type: 'text',
    name: 'name'
  });

  if (!name) {
    process.exit(0);
  }

  // name to absolute, incl ~
  name = expandPath(name)

  // const readFile = `./resources/${name}.json`
  const readFile = name // `./resources/${name}.json`
  console.log('Read file:', readFile)

  var data = readFileSync(readFile, 'utf8')
  data = JSON.parse(data)

  // remove the extension .json at the end
  name = name.replace('.json', '')

  // Write the workbook to a file
  const fileName = `${name}.xlsx`
  const workbook = Excel.write(data as any)
  Excel.writeFile(workbook, fileName)

  console.log('Saved file:', fileName)
}

main()
