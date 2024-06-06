import { describe, it, expect } from 'vitest'
// import * as fs from 'fs';
// import * as yaml from 'yaml';

// import projects from './samples/fwf/projects'
import functions from '../src/functions'
import getPersonUUID from '../src/functions/getPersonUUID'

// const p = projects.find(p => p.id === 'P34707')

// const yamlContent = fs.readFileSync('./tests/test.yaml', 'utf8')

// const settings = {
//   personUUID: '1b8458ea-3853-4279-b45b-d055945269f3'
// }

describe('custom transform functions', () => {
  it('all the functions', () => {
    expect(Object.keys(functions)).toEqual([
      'getPersonUUID'
    ])
  })

  it('getPersopnUUID', () => {
    const input = {}
    const settings = {
      personUUID: '1b8458ea-3853-4279-b45b-d055945269f3'
    }
    const output = getPersonUUID(input, settings)
    expect(output).toEqual('1b8458ea-3853-4279-b45b-d055945269f3')
  })
})
