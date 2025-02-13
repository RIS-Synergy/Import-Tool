import { describe, it, expect, vi } from 'vitest'
import { ResearchInstitution } from '../src/models/ResearchInstitution'

// Mock all the CRIS api calls

const crisData = {
  hello: 'old world',
  pureId: 123
}

describe('RI', () => {
  const ri = new ResearchInstitution()

  const uploadData = {
    hello: 'new world'
  }

  vi.mock("../src/utils/ri-api", () => ({
    callRIApi: vi.fn(() => Promise.resolve(crisData))
  }))

  it('call mocking api endpoint', async () => {
    const result = await ri.callApi('Projects')
    expect(result).toEqual(crisData)
  })

  it('create a new "Project"', async () => {
    const result = await ri.createEntity("Project", uploadData)
    expect(result).toEqual(crisData)
  })

  it('upload: use an existing project', async () => {
    const uuid = 'abcd'
    const result = await ri.uploadEntity("Project", uploadData, uuid)
    expect(result).toEqual(crisData)
  })
})
