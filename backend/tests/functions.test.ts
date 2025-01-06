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
import { Executer } from '../src/models/Executer'

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
    expect(fn.code.length).toBe(43)
  })

  it('can count functions', async () => {
    const count = await Function.count()
    expect(count).toBe(6)
  })

  it('can get all functions', async () => {
    const all = await Function.all()
    const one = all[0]
    expect(all).toHaveLength(6)
    expect(one.name).toBe('function1')
  })
})

describe('Executer', () => {
  it ('can execute the isolated VM', async () => {
    const code = `hello() {
return 'Hello, world!'
}`

    const yamlTemplate = `foo: "!<fn>hello:one:two"`
    const executer = new Executer(yamlTemplate, {i: 'a'}, {s: 'b'} )
    executer.addFunction(code)

    const result = await executer.execute()
    expect(result).toBe('Hello, world!')
  })


  it.skip ('can cause execution errors', async () => {
    const code = `functi hello() {
}`
    const executer = new Executer()
    executer.addFunction(code)

    const { error } = await executer.execute()
    expect(error).toContain('Unexpected identifier')
  })

  it.skip ('can cause execution errors', async () => {
      const executer = new Executer([`function hello() {
  while (true) {
    console.log("This loop will run forever!");
  }
}`])
    executer.addFunction(`function hello() {
while (true) {
console.log("This loop will run forever!");
}
}`)
    const result = await executer.execute()
    expect(result.error).toContain('Script execution timed out.')
  })
})
