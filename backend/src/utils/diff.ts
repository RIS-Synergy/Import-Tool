var isEqual = require('lodash.isequal');
const { Logger } = require("tslog");
const log = new Logger({ name: 'utils:diff' });

class Differ {
  constructor(public a: object, public b: object) {
  }

  diff(): boolean {
    if (isEqual(this.a, this.b)) {
      return true
    }
    return false
  }
}

export function Diff(a, b) {
  const differ = new Differ(a, b)
  return differ.diff()
}
