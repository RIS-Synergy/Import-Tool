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
  it('should handle entities without systemName gracefully', async () => {
    const entities = [
      { id: 1 },
      { systemName: 'Application', id: 2 },
      { systemName: 'Award', id: 3 }
    ];

    const sortedEntities = await ri.sortByEntity(entities);

    expect(sortedEntities).toEqual([
      { systemName: 'Application', id: 2 },
      { systemName: 'Award', id: 3 },
      { id: 1 }
    ]);
  });
});

describe('RI - entity to RIS ID', () => {
  const crisData = {
    "identifiers": [
      {
        "id": "ris:FWF:project:F68",
      }
    ],
  }
  it('entity to RIS ID', async () => {
    const ri = new ResearchInstitution()
    const result = ri.entityToRISId(crisData)
    expect(result).toEqual('F68')
  })
  it('entity to RIS ID, no `identifiers`', async () => {
    const ri = new ResearchInstitution()
    const result = ri.entityToRISId({ ...crisData, identifiers: [] })
    expect(result).toEqual(null)
  })
});

describe.only('RI - sortByEntity', () => {
  const ri = new ResearchInstitution();

  it('should sort entities by systemName in the order: Project, Application, Award', async () => {
    const entities = [
      { systemName: 'Award', id: 3 },
      { systemName: 'Project', id: 1 },
      { systemName: 'Application', id: 2 }
    ];

    const sortedEntities = await ri.sortByEntity(entities);

    expect(sortedEntities).toEqual([
      { systemName: 'Project', id: 1 },
      { systemName: 'Application', id: 2 },
      { systemName: 'Award', id: 3 }
    ]);
  });

  it('should handle entities without systemName gracefully', async () => {
    const entities = [
      { id: 1 },
      { systemName: 'Application', id: 2 },
      { systemName: 'Award', id: 3 }
    ];

    const sortedEntities = await ri.sortByEntity(entities);

    expect(sortedEntities).toEqual([
      { id: 1 },
      { systemName: 'Application', id: 2 },
      { systemName: 'Award', id: 3 },
    ]);
  });

  it('should handle many systemName object', async () => {
    const entities = [
      { systemName: 'Project', id: 4 },
      { systemName: 'Award', id: 3 },
      { systemName: 'Project', id: 1 },
      { systemName: 'Application', id: 2 }
    ];

    const sortedEntities = await ri.sortByEntity(entities);

    expect(sortedEntities).toEqual([
      { systemName: 'Project', id: 4 },
      { systemName: 'Project', id: 1 },
      { systemName: 'Application', id: 2 },
      { systemName: 'Award', id: 3 }
    ]);
  })
})
