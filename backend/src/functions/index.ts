// TODO this file and the directory
// might be deleted eventually. but this needs to be
// refactored at some later time.

// find the `*.ts` files under this directory
// and get them from an object

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

var functions = {};

const files = glob.sync(path.join(__dirname, '*.ts'));

files.forEach(file => {
  // ignore index.ts
  if (file.includes('index.ts')) return;

  var name = path.basename(file, '.ts');

  // ignore flycheck_ files (sometimes they happen when developing)
  if(name.startsWith('flycheck_')) name.replace('flycheck_', '');

  // console.log('Loading function:', name, file)

  // @ts-ignore
  functions[name] = import(file).then(m => m.default);
});

export default functions;
