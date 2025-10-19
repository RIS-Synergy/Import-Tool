import { describe, it, expect, vi } from 'vitest'
import { DiffSync } from '@/models/DiffSync'
import { parseTimeoutString } from '@/utils/sync'
import mockTemplate from './fixtures/Template.fixture'

vi.mock('../src/models/Diff', () => ({
  Diff: vi.fn().mockImplementation(() => ({
    save: vi.fn(() => {}),
    setProjectData: vi.fn(() => {}),
    runPipeline: vi.fn(() => ({ diffList: [
      { cris: "foo", ris: "bar", path: '' }
    ] })),
    improveOutput: vi.fn(() => [
      { cris: "foo", ris: "bar", path: 'xyz' }
    ])
  }))
}));

vi.mock('../src/models/ResearchInstitution', () => ({
  ResearchInstitution: vi.fn().mockImplementation(() => ({
    getAllProjects: vi.fn().mockResolvedValue({ items: [{
      foo: 'bar'
    }] }),
    entityToRISId: vi.fn().mockReturnValue('test-ris-id')
  }))
}));

vi.mock('../src/models/Template', () => ({
  Template: {
    first: vi.fn(() => mockTemplate)
  }
}));

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
    expect(Object.keys(result)).toEqual(['foundDiffs'])
  })

  it('process function', async () => {
    expect(ds.foundDiffs).toEqual([]);
    await ds.process();
    expect(ds.foundDiffs).toEqual([ {
      diffs: [
        {
          cris: "foo",
          path: "xyz",
          ris: "bar",
        },
      ],
      risId: "test-ris-id",
      templateId: expect.any(Number)
    },]);
  });
})
