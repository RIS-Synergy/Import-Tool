import _ from 'lodash';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'differ.service' });

// identical numbers '100.5' and string "100.5"
export function areIdenticalNumbers(a: number | string, b: number | string): boolean {
  if (a === "" || b === "") return false;
  return Number(a) === Number(b);
}

export function findDeepDiff(obj1, obj2) {
  // Helper function for recursion
  function getDiff(obj1, obj2, path) {
    return _.transform(obj1, (result, value, key) => {
      const currentPath = path ? `${path}.${key}` : key;

      // If the values are objects, recursively check their properties
      if (_.isObject(value) && _.isObject(obj2[key])) {
        const deeperDiff = getDiff(value, obj2[key], currentPath);
        if (deeperDiff.length > 0) {
          result.push(...deeperDiff);
        }
      } else if (!_.isEqual(value, obj2[key])) {
        // If not equal, push the path to the result
        result.push(currentPath);
      }
    }, []);
  }

  // Start the comparison with the root level
  return getDiff(obj1, obj2, '');
}

// use _.get to retrun a list with the value differences
export function getValues(sourceA, sourceB, path) {
  var a, b
  try {
    a = _.get(sourceA, path)
  } catch (e) {
    log.error(`Can't get "${path}" from source "A"`, e)
    return
  }
  try {
    b = _.get(sourceB, path)
  } catch (e) {
    log.error(`Can't get "${path}" from source "B"`, e)
    return
  }
  if (a === b) {
    return null
  }
  // log.debug('[DIFF]', `${path}: "${a}" -> "${b}"`)
  return {
    a,
    b,
    path
  }
}

class Omits {
  constructor(public list = omitList) {
  }

  apply(data: Set<string>) {
    // return data parts that are part of this.list
    let result = new Set<string>()
    data.forEach((item: string) => {
      if (!this.list.has(item)) {
        result.add(item)
      }
    })
    return result
  }
}

function ensureValueOrdering(a: object, b: object, path: string): boolean {
  const keys = path.split('.')
  const lastKey = keys[keys.length - 2]
  const preLastKey = keys[keys.length - 1]
  if (lastKey && !isNaN(Number(lastKey))) {
    // if it's a number
    const lastListKey = keys.slice(0, -2).join('.')
    const lastListList = _.get(b, lastListKey)

    const bList = lastListList.map((item: any) => {
      return _.get(item, preLastKey)
    })

    const aValue = _.get(a, path)

    if (bList.includes(aValue)) {
      // if the value is in the list, return true
      return true
    } else {
      // if the value is not in the list, return false
      return false
    }
  } else {
    // if the latest key is not a number, this ordering issue is not relevant
    return false
  }
}

export class Differ {
  a: object
  b: object

  constructor(a: object, b: object) {
    this.a = a
    this.b = b
  }

  diff(): Set<string> {
    const result = new Set<string>()
    const list = findDeepDiff(this.a, this.b)

    list.forEach((item: string) => {
      if (!ensureValueOrdering(this.a, this.b, item)) {
        result.add(item)
      }
    })
    return result
  }

  diffList(diffSet) {
    var diffList = []
    diffSet.forEach((item: string) => {
      const { a, b, path } = getValues(this.a, this.b, item)
      if (!areIdenticalNumbers(a, b)) {
        diffList.push({
          a,
          b,
          path
        })
      } else {
        diffSet.delete(item)
      }
    })

    return {
      diffSet,
      diffList
    }
  }
}

const omitList = new Set([
])
