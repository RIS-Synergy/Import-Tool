import { describe, it, expect } from 'vitest'
import functions from '../src/functions'
import getPersonUUID from '../src/functions/getPersonUUID'

describe('custom transform functions', () => {
  it('all the functions', () => {
    expect(Object.keys(functions)).toEqual([
      'oefos2012',
      'keywords',
      'grantAmount',
      'getPersonUUID',
      'getIdentifier'
    ])
  })
})

import { Function } from '../src/models/Function'

describe('model', () => {
  it('can create a function model', () => {
    const fn = new Function()
    expect(fn).toBeInstanceOf(Function)
  })

  it('can create a function', async () => {
    const code = `function hello() {
  return 'Hello, world!'
}`
    const fn = await Function.createOrUpdate('function1', code)
    expect(fn.name).toBe('function1')
    expect(fn.code).toBe(code)
  })

  it('can load a function', async () => {
    const fn = await Function.read('function1')
    expect(fn.name).toBe('function1')
    expect(fn.code.length).toBe(45)
    expect(fn.language).toBe('javascript')
  })

  it('can count functions', async () => {
    const count = await Function.count()
    expect(count).toBe(1)
  })
})
