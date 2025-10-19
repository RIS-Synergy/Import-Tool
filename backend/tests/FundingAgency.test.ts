import { describe, it, expect, vi } from 'vitest'
import { FundingAgency } from '@/models/FundingAgency'
import { Project } from '@/models/Project'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

vi.mock('../src/utils/oauth2', () => ({
  getAuthEndpoint: vi.fn()
    .mockResolvedValueOnce([]) // something to do with Registry (& FundingAgency)
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
        update: vi.fn().mockResolvedValue({ risId: 'project1' }),
        findUnique: vi.fn().mockResolvedValue({ risId: '' }),
        findMany: vi.fn().mockResolvedValue([
          { id: 'project1' },
          { id: 'project2' },
          { id: 'project3' }
        ]),
      },
      customFunction: {
        findMany: vi.fn().mockResolvedValue([]),
      }
    }
  })
}));

vi.spyOn(Project, 'getUrl').mockReturnValue('test/')
vi.spyOn(prisma.project, "update")

describe('FundingAgency', () => {
  it('fetchAllPages', async () => {
    const agency = new FundingAgency();
    agency.pageSize = 2;
    delete agency.start

    const projects = await agency.fetchAllPages();
    console.log(projects)
    expect(projects[0].id).toBe('project1');
    expect(projects[1].id).toBe('project2');
    expect(projects[2].id).toBe('project3');
    expect(projects[3].id).toBe('project4');
    expect(projects.length).toBe(4);
  });

  it('upsertProject', async () => {
    const agency = new FundingAgency();
    agency.pageSize = 2;
    delete agency.start

    const spy = vi.spyOn(prisma.project, "update")

    const hasDifference = await agency.upsertProject({ id: 0 }, { id: 1 });
    expect(hasDifference).toBe(true)
    const hasNoDifference = await agency.upsertProject({ id: 1 }, { id: 1 });
    expect(hasNoDifference).toBe(false)

    expect(spy).toHaveBeenCalledTimes(0)
  });

  it('copyProjectToDatabase', async () => {
    const agency = new FundingAgency();
    agency.pageSize = 2;
    delete agency.start

    const projects = await agency.copyProjectToDatabase();
    expect(projects[ 'new' ]).toBe(0);
    expect(projects[ 'existing' ]).toBe(0);
    expect(projects[ 'updated' ]).toBe(0);
    expect(projects).toStrictEqual({
      new: 0,
      existing: 0,
      updated: 0
    });
  });
})
