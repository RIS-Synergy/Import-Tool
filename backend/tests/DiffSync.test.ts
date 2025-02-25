import { describe, it, expect } from 'vitest'
import { DiffSync } from '../src/models/DiffSync'
import { parseTimeoutString } from '../src/utils/sync'

describe('utils: parseTimeoutString', () => {
  it ('...', async () => {
    var result = parseTimeoutString('1m')
    expect(result).toEqual(60)

    result = parseTimeoutString('1h')
    expect(result).toEqual(3600)

    result = parseTimeoutString('1s')
    expect(result).toEqual(1)

    // expect throw error
    expect(() => parseTimeoutString('1x'))
      .toThrowError('Invalid timeout string')
  })
})

describe('DiffSync', () => {
  const ds = new DiffSync()

  it ('...', async () => {
    const result = ds
    expect(result).toEqual({})
  })
})
