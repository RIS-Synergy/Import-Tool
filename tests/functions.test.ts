import { describe, it, expect } from 'vitest'
import functions from '../src/functions'
import getPersonUUID from '../src/functions/getPersonUUID'

describe('custom transform functions', () => {
  it('all the functions', () => {
    expect(Object.keys(functions)).toEqual([
      'getPersonUUID'
    ])
  })
})
