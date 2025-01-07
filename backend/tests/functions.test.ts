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

const hostile = `
const storage = [];
const twoMegabytes = 1024 * 1024 * 2;
while (true) {
const array = new Uint8Array(twoMegabytes);
for (let ii = 0; ii < twoMegabytes; ii += 4096) {
array[ii] = 1; // we have to put something in the array to flush to real memory
}
storage.push(array);
console.log('I\\'ve wasted '+ (storage.length * 2)+ 'MB');
}
`

describe('Executer', () => {
  it ('can execute the isolated VM', async () => {
//     const code = `function hello() {
// return 'Hello, world!'
// }`

    const yamlTemplate = `
static: just a static string
hello_function: "!<fn>hello"
inputs_fn: "!<fn>fn_input"
settings_fn: "!<fn>fn_settings"
fn_custom_args: "!<fn>fn_with_args:one:two"
nested:
  value: "!<fn>hello"
`
    const executer = new Executer(yamlTemplate, {i: 'a'}, {s: 'b'} )
    executer.addFunction('fn_with_args', "return `arguments ${args[0]} and ${args[1]}`")
    executer.addFunction('hello', "return 'Hello, world!'")
    executer.addFunction('fn_input', "return JSON.parse(input)")
    executer.addFunction('fn_settings', "return JSON.parse(settings)")

    const result = await executer.execute()

    expect(result.static).toBe('just a static string')
    expect(result.hello_function).toBe('Hello, world!')
    expect(result.inputs_fn.i).toBe('a')
    expect(result.settings_fn).toEqual({s: 'b'})
    expect(result.fn_custom_args).toBe('arguments one and two')
    expect(result.nested.value).toBe('Hello, world!')
  })


  it ('can cause execution errors', async () => {
    const executer = new Executer('output: "!<fn>hello"')
    executer.addFunction('hello', "return 'Hello Worls'")

    const { output } = await executer.execute()
    expect(output).toBe('Hello Worls')
  })

  // XXX no!
  it.skip ('hostile memory use', async () => {
    const executer = new Executer('output: "!<fn>hello"')
    executer.addFunction('hello', hostile)

    const { error } = await executer.execute()
    expect(error).toBe('Invalid or unexpected token')
  })

  it.skip ('can cause execution errors', async () => {
    const executer = new Executer()
    executer.addFunction('hello', "return 'Hello Wor")

    const { error } = await executer.execute()
    expect(error).toBe('Invalid or unexpected token')
  })

  // Loop
  it .skip ('infinite loop', async () => {
    const executer = new Executer('output: "!<fn>hello"', null, null, 100)
    executer.addFunction('hello', `
while (true) {}
`)
    const result = await executer.execute()
    expect(result.error).toContain('Script execution timed out.')
  })
})
