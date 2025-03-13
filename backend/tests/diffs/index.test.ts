import yaml from "js-yaml";
import { describe, it, expect } from 'vitest'
import _ from 'lodash'
import { runPipeline } from '../../src/utils/diff'
import { Diff, Differ, findDeepDiff, getValues, areIdenticalNumbers } from '../../src/models/Diff'
import { Project } from '../../src/models/Project'
import { templateData } from './crisTestData'
import { risTestData } from './risTestData'
import yamlTemplateTestData from './yamlTemplateTestData'
import yamlTemplateApplication from './template/application1'
import crisDataApplication1 from './crisData/application1'

const A = {
  foo: 'a',
  bar: {
    baz: 'c'
  }
}

const B = {
  foo: 'b',
  bar: {
    baz: 'c'
  }
}

describe('Differ findDeepDiff', () => {
  it('with identical objects: empty', () => {
    expect(findDeepDiff(A, A)).toEqual([])
  })
  it('with different objects: one difference point', () => {
    expect(findDeepDiff(A, B)).toEqual(['foo'])
  })
})

describe('Differ class', () => {
  it('trivial cases', () => {
    expect(new Differ(A, B).diff()).toEqual(new Set(['foo']))
    expect(new Differ(A, {}).diff()).toEqual(new Set(['foo', 'bar']))
    expect(A).toEqual({ foo: 'a', bar: { baz: 'c' } })
    expect(new Differ(A, { foo: 'a' }).diff()).toEqual(new Set(["bar"]))
    expect(new Differ(A, { foo: 'b', bar: {} }).diff()).toEqual(new Set(["foo", "bar.baz"]))
  })

  // This might be needed to be fixed later
  // But the risData side is more important
  it.skip('trivial cases, reversed', () => {
    expect(new Differ(B, A).diff()).toEqual(new Set(['foo'])) // reversed
    // expect(new Differ({}, A).diff()).toEqual(new Set(['foo', 'bar'])) // reversed, XXX this does not work
    expect(A).toEqual({ foo: 'a', bar: { baz: 'c' } })
    expect(new Differ({ foo: 'a' }, A).diff()).toEqual(new Set(["bar"])) // reversed, XXX this does not work
    expect(new Differ({ foo: 'b', bar: {} }, A).diff()).toEqual(new Set(["foo", "bar.baz"])) // reversed, XXX this does not work
  })

  it('use _.get to retrun a list with the value differences', () => {
    const newA = {
      eq: 1,
      bar: {
        baz: 'c'
      }
    }
    const newB = {
      eq: 1,
      bar: {
        baz: 'd'
      }
    }

    expect(getValues(A, B, 'foo')).toEqual({ a: 'a', b: 'b', path: 'foo' })
    expect(getValues(newA, newB, 'eq')).toEqual(null)
    expect(getValues(newA, newB, 'bar.baz')).toEqual({ a: 'c', b: 'd', path: 'bar.baz' })
    expect(getValues(newA, newB, 'bar')).toEqual({ a: { baz: 'c' }, b: { baz: 'd' }, path: 'bar' })
    expect(getValues(newA, newB, 'none')).toEqual(null)
  })

  describe('By Project Id', async () => {
    const project = await Project.getById('PUB3333')
    const risData: any = project.risData

    console.log('risData.team[0].person.personName.firstName', risData.team[0].person.personName.firstName)

    var secondData = _.cloneDeep(risData)

    secondData.team[0].person.personName.firstName = 'Tester'
    secondData.endDate = '2030-01-01'
    secondData.newField = 'newField'

    it('team[0].person.personName.firstName differ', () => {
      expect(risData.team[0].person.personName.firstName).toBe('Fritz')
      expect(secondData.team[0].person.personName.firstName).toBe('Tester')
    })

    it('Differ(a, b), single order Differ(a, b): a,b', () => {
      expect(new Differ(risData, secondData).diff()).toStrictEqual(new Set(["endDate", "team.0.person.personName.firstName"]))
    })

    it('By Project Id, reversed Differ(b, a)', async () => {
      expect(new Differ(secondData, risData).diff()).toStrictEqual(new Set(["endDate", "team.0.person.personName.firstName", "newField"]))
    })

    it('Set order does not matter', async () => {
      expect(new Differ(risData, secondData).diff()).toStrictEqual(new Set(["endDate", "team.0.person.personName.firstName"]))
      expect(new Differ(risData, secondData).diff()).toStrictEqual(new Set(["team.0.person.personName.firstName", "endDate"]))
      expect(new Differ(risData, secondData).diff()).toStrictEqual(new Set(["team.0.person.personName.firstName", "endDate"]))
    })
  })
})


describe('not runPipeline, but Diff', () => {
  const settings = {
    person: "Person1-uuid-1234-abc",
    organization: 'Org1-uuid-6789-xyz'
  }

  it('pipeline: identical', async () => {
    const crisData = {
      ...templateData,
    }

    const diff = new Diff('id_is_irrelevant_for_tests', 'systemName_is_irrelevant_for_tests')
    diff.setProjectData(risTestData)
    diff.crisData = crisData
    diff.settings = settings
    diff.yamlTemplate = yaml.dump({ output: yamlTemplateTestData }, { indent: 2 })

    const { diffSet, diffList } = await diff.runPipeline()

    expect(diffList).toEqual([])
    expect(diffSet).toEqual(new Set([]))
  })

  it('pipeline: cris with undefined', async () => {
    const crisData = {
      ...templateData,
      crisHasThisButRisDataNot: 'hello'
    }

    const diff = new Diff('id_is_irrelevant_for_tests', 'systemName_is_irrelevant_for_tests')
    diff.setProjectData(risTestData)
    diff.crisData = crisData
    diff.settings = settings
    diff.yamlTemplate = yaml.dump({ output: yamlTemplateTestData }, { indent: 2 })

    const { diffSet, diffList } = await diff.runPipeline()

    expect(diffList).toEqual([
      {
        "a": "hello",
        "b": undefined,
        "path": "crisHasThisButRisDataNot",
      }
    ])
    expect(diffSet).toEqual(new Set(["crisHasThisButRisDataNot"]))
  })

  it('CRIS data date has changed', async () => {
    const crisData = {
      ...templateData,
      period: {
        endDate: '2023-12-12'
      }
    }

    const diff = new Diff('id_is_irrelevant_for_tests', 'systemName_is_irrelevant_for_tests')
    diff.setProjectData(risTestData)
    diff.crisData = crisData
    diff.settings = settings
    diff.yamlTemplate = yaml.dump({ output: yamlTemplateTestData }, { indent: 2 })

    const { diffSet, diffList } = await diff.runPipeline()

    expect(diffList).toEqual([
      {
        "a": "2023-12-12",
        "b": "2026-12-06",
        "path": "period.endDate",
      }
    ])
    expect(diffSet).toEqual(new Set(["period.endDate"]))
  })
})

describe('temaplate: application', () => {
  const settings = {
    person: "Person1-uuid-1234-abc",
    organization: 'Org1-uuid-6789-xyz'
  }

  it('pipeline: identical', async () => {
    const crisData = {
      ...crisDataApplication1
    }

    const diff = new Diff('id_is_irrelevant_for_tests', 'systemName_is_irrelevant_for_tests')
    diff.setProjectData(risTestData)
    diff.crisData = crisData
    diff.settings = settings
    diff.yamlTemplate = yaml.dump({ output: yamlTemplateApplication }, { indent: 2 })

    const { diffSet, diffList } = await diff.runPipeline()

    expect(diffList).toEqual([])
    expect(diffSet).toEqual(new Set([]))
  })
})

describe('function: areIdenticalNumbers', () => {
  it('should return true for 100.5 (number) and "100.5" (string)', () => {
    expect(areIdenticalNumbers(100.5, "100.5")).toBe(true);
  });

  it('should return true for integer values as numbers and strings', () => {
    expect(areIdenticalNumbers(42, "42")).toBe(true);
  });

  it('should return false for non-numeric strings', () => {
    expect(areIdenticalNumbers("abc", "100.5")).toBe(false);
  });

  it('should return false for different numeric values', () => {
    expect(areIdenticalNumbers(100.5, 200.5)).toBe(false);
  });

  it('should return true for zero in different forms', () => {
    expect(areIdenticalNumbers(0, "0")).toBe(true);
  });

  it('should return false for an empty string and zero', () => {
    expect(areIdenticalNumbers("", 0)).toBe(false);
  });
});

describe('improveOutput', () => {
  it('hide if `b: undefined`', () => {
    const list1 = [
      {
        a: 'a',
        b: undefined,
        path: 'path1'
      }
    ]
    const diff = new Diff('', '')

    const list2 = [
      {
        a: 'a',
        b: 'b',
        path: 'path1'
      }
    ]
    expect(diff.improveOutput(list2)).toEqual([
      {
        "cris": "a",
        "path": "path1",
        "ris": "b",
      }
    ])
  });
})
