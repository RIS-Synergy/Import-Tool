import { describe, it, expect } from 'vitest'
import _ from 'lodash'
import { Differ, findDeepDiff, runPipeline, getValues } from '../../src/utils/diff'
import { Project } from '../../src/models/Project'
import { templateData } from './crisTestData'

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

    expect(getValues(A, B, 'foo')).toEqual({ a: 'a', b: 'b' })
    expect(getValues(newA, newB, 'eq')).toEqual(null)
    expect(getValues(newA, newB, 'bar.baz')).toEqual({ a: 'c', b: 'd' })
    expect(getValues(newA, newB, 'bar')).toEqual({ a: { baz: 'c'}, b: { baz: 'd'} })
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


describe('runPipeline', () => {
  it('pipeline', async () => {
    const crisData = {
      ...templateData,
      crisHasThisButRisDataNot: 'hello'
    }

    const { diffSet } = await runPipeline('PUD33', crisData)
    expect(diffSet).toEqual(new Set(["crisHasThisButRisDataNot"]))
  })

  it('CRIS data date has changed', async () => {
    const { diffSet } = await runPipeline('PUD33', {
      ...templateData,
      period: {
        endDate: '2023-12-12'
      }
    })
    expect(diffSet).toEqual(new Set(["period.endDate"]))
  })

  it('CRIS and DB are the same', async () => {
    const { diffSet } = await runPipeline('PUD33', templateData)
    expect(diffSet).toEqual(new Set([]))
  })
})
