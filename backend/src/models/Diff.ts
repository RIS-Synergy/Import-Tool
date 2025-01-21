import _ from 'lodash';

import { Logger } from "tslog";
const log = new Logger({ name: 'Diff'});

import { Project } from './Project';
import { Template } from './Template';
import { Transform } from './Transform';
import { ResearchInstitution } from './ResearchInstitution';

export class Diff {
  risData = null
  // crisId = null
  crisData = null

  constructor(
    private risId: string,
    private systemName = 'projects'
  ) {}

  setProjectData = async (risData?: string) => {
    if (risData) {
      this.risData = risData
    } else {
      // log.info('risId', this.risId)
      this.risData = (await Project.getById(this.risId))
                       .risData
      // log.info('risData', this.risData)
    }
  }

  // setCrisId = async (crisId: string = null) => {
  //   this.crisId = crisId
  // }

  async fetchCrisData(uuid: string) {
    const ri = new ResearchInstitution()
    // XXX this.systemName
    this.crisData = await ri.getEntityData('projects', uuid)
  }

  async runPipeline (templateId: number) {
    const template = await Template.getById(templateId)
    // log.info('Template', template)

    log.warn('risData', this.risData)

    const transform = new Transform()
    const appliedTemplate = await transform.run(
      template.yamlTemplate,
      this.risData,
      {} // for now settings are not defined
    )
    // log.info('Applied Template', appliedTemplate.output)
    // log.info('CRIS Data', this.crisData)

    let diffSet = new Differ(this.crisData, appliedTemplate.output).diff()
    // log.info('Differences', result)

    // apply omit list
    diffSet = new Omits().apply(diffSet)
    // log.info('Omitted', diffSet)

    var diffList = []
    diffSet.forEach((item: string) => {
      const { a, b, path } = getValues(this.crisData, appliedTemplate.output, item)
      diffList.push({
        a,
        b,
        path
      })
    })

    return {
      diffSet,
      diffList
    }
  }
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
  log.debug('[DIFF]', `${path}: "${a}" -> "${b}"`)
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
  'applicationClusters',
  'awardClusters',
  'createdBy',
  'createdDate',
  'customDefinedFields',
  'descriptions.0.pureId',
  'descriptions.0.type.term',
  'effectivePeriod',
  'identifiers.0.pureId',
  'identifiers.0.type.term',
  'identifiers.1.pureId',
  'identifiers.1.type.term',
  'identifiers.2.pureId',
  'identifiers.2.type.term',
  'keywordGroups.0.classifications.0.term',
  'keywordGroups.0.classifications.1.term',
  'keywordGroups.0.classifications.2.term',
  'keywordGroups.0.classifications.3.term',
  'keywordGroups.0.name',
  'keywordGroups.0.pureId',
  'keywordGroups.1.keywords.0.pureId',
  'keywordGroups.1.name',
  'keywordGroups.1.pureId',
  'managingOrganization.uuid',
  'modifiedBy',
  'modifiedDate',
  'organizations.0.uuid',
  'participants.0.name',
  'participants.0.organizations.0.uuid',
  'participants.0.person.uuid',
  'participants.0.pureId',
  'participants.0.role.term',
  'portalUrl',
  'pureId',
  'type.term',
  'uuid',
  'version',
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
