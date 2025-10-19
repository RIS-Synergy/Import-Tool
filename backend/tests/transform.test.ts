import { describe, it, expect, vi } from 'vitest'
import { Transform } from '@/models/Transform'
import mockFixtures from './fixtures/Function.fixture'

const input = {
  name: 'John Doe',
  age: 42
}

const settings = {
  person: 'John Doe'
}

vi.mock('../src/models/Function', () => ({
  Function: {
    all: vi.fn(() => mockFixtures.all),
  }
}));

describe('Transform', () => {
  it('constructor', async () => {
    const transform = new Transform()
    expect(transform).toBeInstanceOf(Transform)

    transform.functions = [
      { name: 'hello_fn', code: 'return "Hello, world!"', description: '', language: 'javascript' },
    ]
    expect(transform.functions.length).toBe(1)

    const result = await transform.run('output: "!<fn>hello_fn"', input, settings)
    expect(result.output).toBe('Hello, world!')
  })

  it('with an argument', async () => {
    const transform = new Transform()
    expect(transform).toBeInstanceOf(Transform)

    transform.functions = [
      { name: 'hello_fn', code: 'return `Hello, ${args[0]}!`', description: '', language: 'javascript' },
    ]
    expect(transform.functions.length).toBe(1)

    const result = await transform.run('output: "!<fn>hello_fn:world"', input, settings)
    expect(result.output).toBe('Hello, world!')
  })

  // XXX This ${input} does not pass the coverage for some reason
  it('with an ${input}', async () => {
    const transform = new Transform()
    expect(transform).toBeInstanceOf(Transform)

    const result = await transform.run(`output:
  hello: \$\{input.name}`, input, settings)
    expect(result.output).toEqual({
      hello: "John Doe",
    })
  })
})
