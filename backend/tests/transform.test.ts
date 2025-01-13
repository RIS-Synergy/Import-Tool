import { describe, it, expect } from 'vitest'
import { Transform } from '../src/models/Transform'

const input = {
  name: 'John Doe',
  age: 42
}

const settings = {
  person: 'John Doe'
}

describe('Transform', () => {
  it('constructor', async () => {
    const transform = new Transform()
    expect(transform).toBeInstanceOf(Transform)

    transform.functions = [
      { name: 'hello_fn', code: 'return "Hello, world!"', description: '', language: 'javascript' },
    ]
    expect(transform.functions.length).toBe(1)

    const result = await transform.run('output: "!<fn>hello_fn"', input, settings)
    expect(result).toBe('Hello, world!')
  })
})
