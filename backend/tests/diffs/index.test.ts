import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { Differ, findDeepDiff } from '../../src/utils/diff'
import { Project } from '../../src/models/Project'
import _ from 'lodash'

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
  it('should return an empty array for equal objects', () => {
    expect(findDeepDiff(A, A)).toEqual([])
  })
  it('should return an empty array for equal objects', () => {
    expect(findDeepDiff(A, B)).toEqual(['foo'])
  })
})

describe('Diffs', () => {
  it('trivial cases', () => {
    expect(new Differ(A, B).diff()).toEqual(new Set(['foo']))
    expect(new Differ(A, {}).diff()).toEqual(new Set(['foo', 'bar']))
    expect(A).toEqual({ foo: 'a', bar: { baz: 'c' } })
    expect(new Differ(A, { foo: 'a' }).diff()).toEqual(new Set(["bar"]))
    expect(new Differ(A, { foo: 'b', bar: {} }).diff()).toEqual(new Set(["foo", "bar.baz"]))
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
