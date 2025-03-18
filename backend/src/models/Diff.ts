import _ from 'lodash';

import { Logger } from "tslog";
const log = new Logger({ name: 'Diff' });

import { Project } from './Project';
import { Template } from './Template';
import { Transform } from './Transform';
import { ResearchInstitution } from './ResearchInstitution';

export class Diff {
  risData = null
  crisData = null
  settings = {}
  yamlTemplate = null

  constructor(
    private risId: string,
    // private systemName = 'projects'
  ) { }

  setProjectData = async (risData?: any) => {
    if (risData) {
      this.risData = risData
    } else {
      try {
        const data = await Project.getById(this.risId)
        if (data) {
          // log.debug(`Project ${this.risId} Data`, data)
          this.risData = data.risData
        } else {
          log.warn('No data found for project', this.risId)
        }
      } catch (error) {
        log.error('Error getting project by ID', error)
      }
    }
  }

  async fetchCrisData(uuid: string, systemName: string) {
    const ri = new ResearchInstitution()
    // XXX this.systemName
    this.crisData = await ri.getEntityData(systemName, uuid)
  }

  async runPipeline(templateId?: number) {
    if (templateId) {
      const template = await Template.getById(templateId)
      this.yamlTemplate = template.yamlTemplate
    }

    const transform = new Transform()
    const appliedTemplate = await transform.run(
      this.yamlTemplate,
      this.risData,
      this.settings
    )
    // log.info('Applied Template', appliedTemplate.output)
    // log.info('CRIS Data', this.crisData)

    let diffSet = new Differ(this.crisData, appliedTemplate.output).diff()

    // apply omit list
    diffSet = new Omits().apply(diffSet)
    // log.info('Omitted', diffSet)

    var diffList = []
    diffSet.forEach((item: string) => {
      const { a, b, path } = getValues(this.crisData, appliedTemplate.output, item)
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

    // log.info('DiffList', diffList)

    return {
      diffSet,
      diffList
    }

  }

  improveOutput(diffList: any) {
    var output =
      diffList.map((x: any) => {
        return {
          cris: x.a,
          ris: x.b,
          path: x.path
        }
      })

    output = output.map((x: any) => {
      if (x.ris) {
        return x
      }
    })
      .filter((v) => v)

    // log.info('output', output)
    return output
  }
}

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

export class Differ {
  constructor(public a: object, public b: object) {
  }

  diff(): Set<string> {
    const result = new Set<string>()
    const list = findDeepDiff(this.a, this.b)
    list.forEach((item: string) => {
      result.add(item)
    })
    return result
  }
}

const omitList = new Set([
])

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
