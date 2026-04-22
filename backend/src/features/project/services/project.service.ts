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

type DiffFilter = "All" | "NULL" | "IDENTICAL" | "DIFFERENT" | "SYNCED" | "NOT_SYNCED";

type Filter = {
  status: Array<Status>;
  piDomain: { domain: string; ror: string };
  diffs: DiffFilter;
  orderBy: string;
  itemsPerPage: string;
  oefos?: string | string[];
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
  public async getStats(limitByUserPermission: any = {}, filters: any = {}): Promise<any> {
    try {
      const whereClause: any = {
        ...limitByUserPermission.where,
      };

      // Add status filter if provided
      if (filters.status && filters.status.length > 0) {
        whereClause.status = {
          in: filters.status
        };
      }

      // Add oefos filter if provided
      if (filters.oefos) {
        const codes = Array.isArray(filters.oefos) ? filters.oefos : (typeof filters.oefos === 'string' ? filters.oefos.split(',') : []);
        if (codes.length > 0) {
          const pathQuery = codes.map(c => `@ starts with "${c}"`).join(' || ');
          const matchingIds: any[] = await prisma.$queryRawUnsafe(
            `SELECT id FROM "Project" WHERE jsonb_path_exists("risData", '$.subjects[*].value ? (${pathQuery})')`
          );
          const ids = matchingIds.map(p => p.id);
          // If no projects match, we must ensure zero results
          whereClause.id = { in: ids.length > 0 ? ids : [-1] };
        }
      }

      // This one ignores the status filter
      const whereClauseAllRI: any = {
        ...limitByUserPermission.where,
        ...(whereClause.id ? { id: whereClause.id } : {})
      };

      const [total, notLinked, identical, different, synced, notSynced, totalRI] = await Promise.all([
        // All
        prisma.project.count({ where: whereClause }),
        // NULL (Project not linked to CRIS)
        prisma.project.count({
          where: {
            ...whereClause,
            externalEntities: { none: {} }
          }
        }),
        // IDENTICAL (Project in CRIS and has no differences)
        prisma.project.count({
          where: {
            ...whereClause,
            externalEntities: {
              some: {},
              none: {
                SavedTemplate: {
                  some: { changed: true }
                }
              }
            }
          }
        }),
        // DIFFERENT (Project in CRIS, but has differences - AT LEAST ONE RED)
        prisma.project.count({
          where: {
            ...whereClause,
            externalEntities: {
              some: {
                SavedTemplate: {
                  some: { changed: true }
                }
              }
            }
          }
        }),
        // SYNCED (Project in CRIS, fully synchronized - ONLY GREEN)
        // Must have at least one entity, ALL entities must have snapshots, and NONE must have differences.
        prisma.project.count({
          where: {
            ...whereClause,
            externalEntities: {
              some: {},
              every: {
                SavedTemplate: { some: {} }
              },
              none: {
                SavedTemplate: {
                  some: { changed: true }
                }
              }
            }
          }
        }),
        // NOT_SYNCED (Project in CRIS, NO RED, but MISSING SOME snapshots - SOME BLUE)
        // Must have no entities with differences, and at least one entity without a snapshot.
        prisma.project.count({
          where: {
            ...whereClause,
            externalEntities: {
              none: {
                SavedTemplate: {
                  some: { changed: true }
                }
              },
              some: {
                SavedTemplate: { none: {} }
              }
            }
          }
        }),
        // Total Projects in RI (ignores status filter)
        prisma.project.count({
          where: whereClauseAllRI,
        }),
      ]);

      return {
        total,
        notLinked,
        identical,
        different,
        synced,
        notSynced,
        totalRI,
      };
    } catch (error) {
      log.error('Error getting project stats:', error);
      throw error;
    }
  }

  public async findMany2(
    limitByUserPermission: any = {},
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

      // Add oefos filter if provided
      if (filters.oefos) {
        const codes = Array.isArray(filters.oefos) ? filters.oefos : (typeof filters.oefos === 'string' ? filters.oefos.split(',') : []);
        if (codes.length > 0) {
          const pathQuery = codes.map(c => `@ starts with "${c}"`).join(' || ');
          const matchingIds: any[] = await prisma.$queryRawUnsafe(
            `SELECT id FROM "Project" WHERE jsonb_path_exists("risData", '$.subjects[*].value ? (${pathQuery})')`
          );
          const ids = matchingIds.map(p => p.id);
          // If no projects match, we must ensure zero results
          whereClause.id = { in: ids.length > 0 ? ids : [-1] };
        }
      }

      // Add diffs filter using Prisma relation criteria
      if (filters.diffs && filters.diffs !== "All") {
        if (filters.diffs === "NULL") {
          // "Project not linked to CRIS" -> no externalEntities
          whereClause.externalEntities = {
            none: {}
          };
        } else if (filters.diffs === "IDENTICAL") {
          // "Project in CRIS and has no differences"
          // Must have at least one external entity AND none of them should have differences
          whereClause.externalEntities = {
            some: {},
            none: {
              SavedTemplate: {
                some: {
                  changed: true
                }
              }
            }
          };
        } else if (filters.diffs === "SYNCED") {
          // "Project in CRIS and fully synchronized (Only green checks)"
          // Must have at least one entity, ALL entities must have snapshots, and NONE must have differences.
          whereClause.externalEntities = {
            some: {},
            every: {
              SavedTemplate: { some: {} }
            },
            none: {
              SavedTemplate: {
                some: { changed: true }
              }
            }
          };
        } else if (filters.diffs === "DIFFERENT") {
          // "Project in CRIS, but has differences (At least one red check)"
          whereClause.externalEntities = {
            some: {
              SavedTemplate: {
                some: {
                  changed: true
                }
              }
            }
          };
        } else if (filters.diffs === "NOT_SYNCED") {
          // "Project in CRIS, NO differences (No red), but at least one entity is missing a comparison (Some blue)"
          whereClause.externalEntities = {
            none: {
              SavedTemplate: {
                some: { changed: true }
              }
            },
            some: {
              SavedTemplate: { none: {} }
            }
          };
        }
      }

      // Determine orderBy
      const orderBy: any = {};
      // Convert the order to Prisma's format
      const orderDirection = sortBy.order.toUpperCase() === 'DESC' ? 'desc' : 'asc';
      orderBy[sortBy.key] = orderDirection;

      let itemsPerPage = parseInt(filters.itemsPerPage, 10);
      if (isNaN(itemsPerPage) || itemsPerPage < 1) {
        itemsPerPage = 10;
      }

      let pageNumber = parseInt(page, 10);
      if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 1;
      }

      const skip = (pageNumber - 1) * itemsPerPage;

      log.info("Final Where Clause", whereClause, "Order By", orderBy);

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
                  orderBy: { modifiedDate: 'desc' },
                  take: 1,
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

      // Sort externalEntities: ordered PROJECT, APPLICATION, AWARD
      const typeOrder: any = { 'PROJECT': 1, 'APPLICATION': 2, 'AWARD': 3 };
      projects.forEach((project: any) => {
        project.externalEntities.sort((a: any, b: any) => {
          return (typeOrder[a.templateType] || 4) - (typeOrder[b.templateType] || 4);
        });
      });

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

  findByResearchInstitution(researchInstitutionId: number, {
    statuses = ["IN_PREPERATION", "ACTIVE"],
    count = false,
    select = null,
    orderBy = null
  }) {
    // count or findMany
    const key = count ? 'count' : 'findMany';

    const whereClause: any = {
      status: {
        in: statuses
      },
      researchInstitutions: {
        some: {
          id: researchInstitutionId
        }
      }
    };

    // if (withoutExternalEntities) {
    //   whereClause.externalEntities = {
    //     none: {}
    //   };
    // }

    const results = prisma.project[key]({
      where: whereClause, select,
      orderBy
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
      data: { ...updateData(projectData.risData) },
    });
  }

  public async delete(id: number): Promise<Project> {
    return prisma.project.delete({
      where: { id },
    });
  }

  public async search(q: string): Promise<any[]> {
    const searchTerm = `%${q}%`;
    const startMatch = `${q}%`;
    try {
      // Prioritize matches: 
      // 1. Starts with risId
      // 2. Starts with title
      // 3. Contains risId
      // 4. Contains in JSON
      const projects = await prisma.$queryRawUnsafe<any[]>(
        `
        SELECT id, "risId", "risData"
        FROM "Project"
        WHERE "risId" ILIKE $1
        OR CAST(id AS TEXT) ILIKE $1
        OR "risData"::text ILIKE $1
        ORDER BY 
          CASE 
            WHEN "risId" ILIKE $2 THEN 1
            WHEN "risId" ILIKE $1 THEN 2
            WHEN EXISTS (
              SELECT 1 FROM jsonb_array_elements("risData"->'title') t 
              WHERE t->>'text' ILIKE $2
            ) THEN 3
            ELSE 4
          END ASC,
          "risId" ASC
        LIMIT 15
        `,
        searchTerm,
        startMatch
      );

      return projects.map(p => {
        const risData = p.risData as any;
        // Extract title (English preferred, then German)
        let title = "";
        if (Array.isArray(risData.title)) {
          const enTitle = risData.title.find((t: any) => t.lang === 'en')?.text;
          const deTitle = risData.title.find((t: any) => t.lang === 'de')?.text;
          title = enTitle || deTitle || "";
        }

        // Extract PI Name
        let piName = "";
        if (Array.isArray(risData.team)) {
          const pi = risData.team.find((member: any) => member.type === 'PRINCIPAL_INVESTIGATOR');
          if (pi?.person?.personName) {
            piName = `${pi.person.personName.firstName} ${pi.person.personName.familyName}`;
          }
        }

        return {
          id: p.id,
          risId: p.risId,
          title,
          piName,
          startDate: risData.startDate || "",
          endDate: risData.endDate || "",
          subjects: risData.subjects || []
        };
      });
    } catch (error) {
      log.error('Error in ProjectService.search:', error);
      return [];
    }
  }
}
