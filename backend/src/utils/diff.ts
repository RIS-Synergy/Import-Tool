import _ from 'lodash';
const { Logger } = require("tslog");
const log = new Logger({ name: 'utils:diff' });

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { Project } from '../models/Project';
import { ResearchInstitution } from '../models/ResearchInstitution';
import { projectETL2 } from '../ris-pure-etl/index'
import { RISImport, Settings } from '../types';

/*

1) Get Project ID data from the Database

2) Get Project ID data from the CRIS API

3) Get the values from the SavedTemplate table and apply the template

4) apply the template+settings to the Project.risData

5) apply the diffs

*/

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

export async function runPipeline(risId: string,
  // dbProject: any = {id: 0},
  crisData: any = null) {
  // 1) Get Project ID data from the Database
  const dbProject = await Project.getById(risId);
  if (!dbProject) {
    log.error(`Project ${risId} not found in the database`)
    return
  } else {
    // @ts-ignore
    log.info(`Project ${risId} found in the database`, `id: ${dbProject.id}`)
  }
  // }

  // 2) Get Project ID data from the CRIS API
  if (!crisData) {
    const CRIS = new ResearchInstitution();
    crisData = await CRIS.getCategory('Project', risId);
    log.info('CRIS Data from the Databaser')
  } else {
    log.info('CRIS Data runPipeline argument')
  }

  // 3) Get the values from the SavedTemplate table and apply the template
  // last saved template most latest, for the Project of ID
  const savedDataTemplate = await prisma.savedTemplate.findFirst({
    where: {
      projectId: dbProject.id
    },
    orderBy: {
      createdDate: 'desc'
    }
  });
  if (!savedDataTemplate) {
    log.error(`No saved template found for project "${risId}" (${dbProject.id})`)
    return
  }
  // log.debug('Saved Template', savedDataTemplate)

  // 4) apply the template+settings to the Project.risData
  const template = await prisma.template.findUnique({
    where: {
      // @ts-ignore
      id: savedDataTemplate.template.projectId
    }
  })
  // log.debug('Template', template.yamlTemplate)

  const appliedTemplate = await projectETL2(
    template.yamlTemplate,
    dbProject.risData as RISImport,
    savedDataTemplate.settings as Settings
  )
  // log.info('Applied Template', appliedTemplate)

  // 5) apply the diffs
  // XXX note: the order is unexpected
  // const result = new Differ(appliedTemplate, crisData).diff()
  const result = new Differ(crisData, appliedTemplate).diff()
  // log.info('Differences', result)
  return result
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
