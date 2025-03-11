import { describe, it, expect, vi } from 'vitest'
import { DiffSync } from '../src/models/DiffSync'
import { parseTimeoutString } from '../src/utils/sync'
import { callRIApi } from "../src/utils/ri-api";

const crisData = [
  {}
]

vi.mock("../src/utils/ri-api", () => ({
  callRIApi: vi.fn()
}));

(callRIApi as ReturnType<typeof vi.fn>)
  .mockResolvedValue(crisData)

describe('utils', () => {
  it ('parseTimeoutString', async () => {
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
  process.env.CRIS_SYNC_TIME = '5s'

  const ds = new DiffSync()
  delete ds.start

  it ('empty so far', async () => {
    const result = ds
    expect(Object.keys(result)).toEqual(['save'])
  })

  it ('get all RIS data', async () => {
    // const result = await ds.process()
    // expect(result).toEqual(crisData)
  })
})
