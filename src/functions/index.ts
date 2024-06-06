// find the `*.ts` files under this directory
// and get them from an object

const fs = require('fs');
const path = require('path');
const glob = require('glob');

var functions = {};

const files = glob.sync(path.join(__dirname, '*.ts'));

files.forEach(file => {
  // ignore index.ts
  if (file.includes('index.ts')) return;

  // ignore flycheck_ files (sometimes they happen when developing)
  if (file.startsWith('flycheck_')) return;

  const name = path.basename(file, '.ts');
  functions[name] = import(file).then(m => m.default);
});

export default functions;
