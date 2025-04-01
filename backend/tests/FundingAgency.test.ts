import { describe, it, expect, vi } from 'vitest'
import { FundingAgency } from '../src/models/FundingAgency'
import { Project } from '../src/models/Project'

vi.mock('../src/utils/oauth2', () => ({
  getAuthEndpoint: vi.fn()
    .mockResolvedValueOnce(
      [
        { id: 'project1' },
        { id: 'project2' }
      ]
    )
    .mockResolvedValueOnce(
      [
        { id: 'project3' },
        { id: 'project4' }
      ]
    )
    .mockResolvedValueOnce(
      []
    )
    .mockResolvedValueOnce(
      []
    )
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => {
    return {
      project: {
        count: vi.fn().mockResolvedValue(3),
        create: vi.fn().mockResolvedValue({ risId: 'project1' }),
      }
    }
  })
}));

vi.spyOn(Project, 'getUrl').mockReturnValue('test/')

describe('FundingAgency', () => {
  it('fetchAllPages', async () => {
    const agency = new FundingAgency();
    agency.pageSize = 2;
    delete agency.start

    const projects = await agency.fetchAllPages();
    expect(projects[0].id).toBe('project1');
    expect(projects[1].id).toBe('project2');
    expect(projects[2].id).toBe('project3');
    expect(projects[3].id).toBe('project4');
    expect(projects.length).toBe(4);
  });

  it('copyProjectToDatabase', async () => {
    const agency = new FundingAgency();
    agency.pageSize = 2;
    delete agency.start

    const projects = await agency.copyProjectToDatabase();
    expect(projects[ 'new' ]).toBe(0);
    expect(projects[ 'existing' ]).toBe(0);
  });
})
