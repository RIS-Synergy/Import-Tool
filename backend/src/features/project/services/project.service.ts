import prisma from '@/lib/prisma.js';
import { Project } from '../project.model.js';
import { updateData } from './update-data.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: "feature:project:service" });

type SortBy = {
  key: string;
  order: string;
};

type Status = "IN_PREPERATION" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "REJECTED";

type DiffFilter = "All" | "NULL" | "IDENTICAL" | "DIFFERENT";

type Filter = {
  status: Array<Status>;
  piDomain: { domain: string; ror: string };
  diffs: DiffFilter;
  orderBy: string;
  itemsPerPage: string;
}

/*
function diffsSQL(diffs: DiffFilter) {
  switch (diffs) {
    case "NULL":
      return "d.length is NULL";
    case "IDENTICAL":
      return "d.length = 0";
    case "DIFFERENT":
      return "d.length >= 1"
    default:
      return "1=1"
  }
}
*/

type FindManyProjects = {
  items: any[]
  total: number
  page: number
  itemsPerPage: number
}

export class ProjectService {
  public async findMany2(
    limitByUserPermission = {},
    filters: Filter,
    page: string,
  ): Promise<FindManyProjects | undefined> {
    try {
      const sortBy: SortBy = { key: "startDate", order: "desc" };
      const [key, order] = filters.orderBy.split(":");
      sortBy.key = key;
      sortBy.order = order.toUpperCase();
      log.info("SortBy", sortBy);

      // Build the where clause
      const whereClause: any = {
        ...limitByUserPermission.where,
      };

      log.debug("❔ Where Clause", whereClause)

      // Add status filter if provided
      if (filters.status && filters.status.length > 0) {
        whereClause.status = {
          in: filters.status
        };
      }

      // Determine orderBy
      const orderBy: any = {};
      // Convert the order to Prisma's format
      const orderDirection = sortBy.order.toUpperCase() === 'DESC' ? 'desc' : 'asc';
      orderBy[sortBy.key] = orderDirection;

      const itemsPerPage = parseInt(filters.itemsPerPage, 10);
      const pageNumber = parseInt(page, 10);
      const skip = (pageNumber - 1) * itemsPerPage;

      const [projects, total] = await Promise.all([
        // TODO actually we need to limit this only the crisId
        // of the user.
        // Because for now we are using all the externalEntities, not only
        // of one CRIS system but all of them, include other ResearchInstututions.
        // this will be a problem when we use the Shared Service approach
        prisma.project.findMany({
          where: whereClause,
          orderBy: [orderBy, { createdDate: 'asc' }],
          take: itemsPerPage,
          skip,
          include: {
            externalEntities: {
              include: {
                SavedTemplate: {
                  select: {
                    diffList: true,
                    changed: true,
                    modifiedDate: true,
                  }
                }
              }
            }
          },
        }),
        prisma.project.count({
          where: whereClause,
        }),
      ]);

      const result = {
        items: projects,
        total,
        page: pageNumber,
        itemsPerPage,
      };

      return result;
    } catch (error) {
      log.error(error);
      return;
    }
  }

  findByResearchInstitution(researchInstitutionId: number) {
    // count!
    const results = prisma.project.count({
      where: {
        researchInstitutions: {
          some: {
            id: researchInstitutionId
          }
        }
      },
    });
    return results;
  }

  /*
  public async findMany(
    limitByUserPermission = {},
    filters: Filter,
    page: string,
  ) {
    console.log('limitByUserPermission', limitByUserPermission)

    try {
      // const { page = 1 } = req.body;

      var sortBy: SortBy = { key: "startDate", order: "desc" };

      if (!filters) {
        filters = {
          status: [],
          piDomain: { domain: "", ror: "" },
          diffs: "All",
          orderBy: "startDate:desc",
          itemsPerPage: '10'
        };
      }

      log.debug("Filter", filters);

      sortBy.key = filters.orderBy.split(":")[0];
      sortBy.order = filters.orderBy.split(":")[1];
      var itemsPerPage = filters.itemsPerPage;

      var whereFilters: string
      if (filters.status.length === 0) {
        whereFilters = '1=1'
      } else {
        whereFilters = '' + filters.status.map((status) => {
          return `p."risData"->>'status' = '${status}'`;
        }).join(" OR ");
      }

      // SQL for OrgUnit
      const orgUnitQuery = `
EXISTS (
  SELECT 1
  FROM jsonb_path_query(
  p."risData"::jsonb,
  '$.funded[*].as.recipients[*].orgUnit.identifiers[*] ? (@.value == "${filters.piDomain.ror}")'
  ) AS match
)
`
      // SQL for domains
      const domainQuery = `p."risData" #>> '{team,0,person,electronicAddress}' LIKE '%@${filters.piDomain.domain}'`

      const pageNumber = parseInt(page as string, 10);
      const items = parseInt(itemsPerPage as string, 10);

      const skip = (pageNumber - 1) * items;
      const take = items;

      const diffSQL = diffsSQL(filters.diffs);
      const projectsQuery = prisma.$queryRawUnsafe(
        `
SELECT p.*, d.length AS "diffLength", d.list AS "diffList" FROM "Project" p
LEFT JOIN "Diff" d ON p."risId" = d.id
WHERE (
${domainQuery} OR ${orgUnitQuery}
)
AND (${whereFilters})
AND (${diffSQL})
ORDER BY p."risData"->>'${sortBy.key}' ${sortBy.order}
OFFSET ${skip} LIMIT ${take}
`
      );

      const totalProjectsQuery = prisma.$queryRawUnsafe(`
SELECT COUNT(*) FROM "Project" p
LEFT JOIN "Diff" d ON p."risId" = d.id
WHERE (${domainQuery} OR ${orgUnitQuery})
AND (${whereFilters})
AND (${diffSQL})
`);

      var timeBefore = new Date();
      log.debug("SQL Queries initiated");

      const [projects, totalProjects] = await Promise.all([
        projectsQuery,
        totalProjectsQuery,
      ]);

      // @ts-ignore
      if (projects && projects.length > 0) {
        log.debug(projects[0].risData[sortBy.key]);
      }
      log.debug("SQL Time", new Date().getTime() - timeBefore.getTime());
      log.debug("Time incl. Count(*)", new Date().getTime() - timeBefore.getTime());

      return {
        items: projects,
        total: Number(totalProjects[0].count),
        page: pageNumber,
        itemsPerPage: items,
      }//);
    } catch (error) {
      console.error(error);
      return
    }
  }
  */

  public async findById(id: number): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
    });
  }

  public async findByRisId(risId: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { risId },
    });
  }

  public create(projectData: Omit<Project, 'id'>): Promise<Project> {
    return prisma.project.create({
      data: { ...projectData, ...updateData(projectData.risData) },
    });
  }

  public update(id: number, projectData: Partial<Project>): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data: { ...projectData, ...updateData(projectData.risData) },
    });
  }

  public async delete(id: number): Promise<Project> {
    return prisma.project.delete({
      where: { id },
    });
  }
}
