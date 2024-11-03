import express, { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { unexpectedErrorHandler } from "../middleware/errorHandler";
import { getAuthEndpoint } from "../utils/oauth2";
import { promises as fs } from "fs";
import auth from '../middleware/auth'

import { Logger } from "tslog";
import { Sql } from "@prisma/client/runtime/library";
const log = new Logger({ name: "view:funding-agency" });

const router: Router = express.Router();

router.get("/info", async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_INFO);
  res.json(result.endpoints);
});

router.get("/fundings/:id", async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(
    process.env.RIS_URL_FUNDINGS + req.params.id,
  );
  res.json(result[0]);
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

type Filter = {
  status: Array<string>;
}

router.get("/projects", async (req: Request, res: Response) => {
  try {
    const { page = 1, itemsPerPage = 10 } = req.query;

    var sortBy: SortBy;
    if (req.query.sortBy) {
      sortBy = JSON.parse(req.query.sortBy as string);
    } else {
      sortBy = { key: "startDate", order: "asc" };
    }
    var filters: Filter;
    if (req.query.filters) {
      filters = JSON.parse(req.query.filters as string);
    } else {
      filters = { status: []};
    }

    var whereFilters: string
    if(filters.status.length === 0) {
      whereFilters = ''
    } else {
      whereFilters = 'WHERE ' + filters.status.map((status) => {
        return `p."risData"->>'status' = '${status}'`;
      }).join(" OR ");
    }

    const orderBy: any = {
      [sortBy.key]: sortBy.order === "asc" ? "asc" : "desc",
    };

    const pageNumber = parseInt(page as string, 10);
    const items = parseInt(itemsPerPage as string, 10);

    const skip = (pageNumber - 1) * items;
    const take = items;

    const projects: Array<any> = await prisma.$queryRawUnsafe(`
SELECT * FROM "Project" p
${whereFilters}
ORDER BY p."risData"->>'${sortBy.key}' ${sortBy.order}
OFFSET ${skip} LIMIT ${take}`);
    if (projects && projects.length > 0) {
      log.debug(projects[0].risData[sortBy.key]);
    }

    // const totalProjects = await prisma.project.count();
    const totalProjects = await prisma.$queryRawUnsafe(`
SELECT COUNT(*) FROM "Project" p
${whereFilters}
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

router.get("/orgunits", async (req: Request, res: Response) => {
  const result = await getAuthEndpoint(process.env.RIS_URL_ORGUNITS);
  res.json(result);
});

export default router;
