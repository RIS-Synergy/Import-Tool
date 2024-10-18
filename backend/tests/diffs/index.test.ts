import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { Diff } from '../../src/utils/diff'

const A = {
  foo: 'a'
}

const B = {
  foo: 'b'
}

describe('Diffs', () => {
  it('trivial cases', () => {
    expect(Diff(1, 1)).toBe(true)
    expect(Diff(A, B)).toBe(false)
    expect(Diff(A, {})).toBe(false)
    expect(A).toEqual({ foo: 'a' })
    expect(Diff(A, {foo: 'a'})).toBe(true)  // XXX
    expect(Diff(A, {foo: 'b'})).toBe(false)
  })
})
