import { describe, it, expect, vi } from 'vitest'
import { ResearchInstitution } from '../src/models/ResearchInstitution'

import { callRIApi } from "../src/utils/ri-api";

const crisData = {
  hello: 'old world',
  pureId: 123
}

const uploadData = {
  hello: 'new world'
}

vi.mock("../src/utils/ri-api", () => ({
  callRIApi: vi.fn()
}));

(callRIApi as ReturnType<typeof vi.fn>)
  .mockResolvedValue(crisData)

describe('RI', () => {
  const ri = new ResearchInstitution()

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

  it('upload: use an existing project and _.merge', async () => {
    (callRIApi as ReturnType<typeof vi.fn>)
      .mockImplementationOnce(() => Promise.resolve(crisData))
      .mockImplementationOnce(() => Promise.resolve({
        ...crisData,
        ...uploadData
      }))

    const uuid = 'abcd'
    const result = await ri.uploadEntity("Project", uploadData, uuid)
    expect(result).toEqual({
      ...crisData,
      ...uploadData
    })
  })
})
