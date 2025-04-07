import express, { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { getAuthEndpoint } from "../utils/oauth2";
import { Logger } from "tslog";
const log = new Logger({ name: "view:funding-agency" });
import { Registry } from "../models/Registry";

const router: Router = express.Router();

router.get("/info", async (req: Request, res: Response) => {
  const result = Registry.endpoints

  // Map to json
  const jsonResult = {}
  result.forEach((value, key) => {
    jsonResult[key] = value
  })

  res.json(jsonResult);
});

router.get("/fundings", async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_FUNDINGS);
  res.json(result);
});

router.get("/projects/:id", async (req: Request, res: Response) => {
  /* We no longer use the RIS FundingAgency API, because we always save the data in the database */
  const result = await prisma.project.findUnique({
    where: {
      risId: req.params.id,
    },
  });
  res.json(result);
});

type SortBy = {
  key: string;
  order: string;
};

type DiffFilter = null | "NULL" | "IDENTICAL" | "DIFFERENT";

type Filter = {
  status: Array<string>;
  piDomain: string;
  diffs: DiffFilter;
  orderBy: string;
  itemsPerPage: string;
}

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

router.get("/projects", async (req: Request, res: Response) => {
  try {
    const { page = 1 } = req.query;

    var sortBy: SortBy = { key: "startDate", order: "desc" };

    var filters: Filter;
    if (req.query.filters) {
      filters = JSON.parse(req.query.filters as string);
    } else {
      filters = {
        status: [],
        piDomain: "",
        diffs: null,
        orderBy: "startDate:desc", itemsPerPage: '10'
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

    const pageNumber = parseInt(page as string, 10);
    const items = parseInt(itemsPerPage as string, 10);

    const skip = (pageNumber - 1) * items;
    const take = items;

    const diffSQL = diffsSQL(filters.diffs);
    const rawSQL = `
SELECT p.*, d.length AS "diffLength", d.list AS "diffList" FROM "Project" p
LEFT JOIN "Diff" d ON p."risId" = d.id
WHERE p."risData" #>> '{team,0,person,electronicAddress}' LIKE '%@${filters.piDomain}'
AND (${whereFilters})
AND (${diffSQL})
ORDER BY p."risData"->>'${sortBy.key}' ${sortBy.order}
OFFSET ${skip} LIMIT ${take}
`
    log.debug("SQL", rawSQL);
    const projects: Array<any> = await prisma.$queryRawUnsafe(rawSQL);
    if (projects && projects.length > 0) {
      log.debug(projects[0].risData[sortBy.key]);
    }

    const totalProjects = await prisma.$queryRawUnsafe(`
SELECT COUNT(*) FROM "Project" p
LEFT JOIN "Diff" d ON p."risId" = d.id
WHERE p."risData" #>> '{team,0,person,electronicAddress}' LIKE '%@${filters.piDomain}'
AND (${whereFilters})
AND (${diffSQL})
`);

    res.json({
      items: projects,
      total: Number(totalProjects[0].count),
      page: pageNumber,
      itemsPerPage: items,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching projects" });
  }
});

export default router;
