import { Router, Request, Response } from "express";
import { Logger } from "../../utils/logger.js";

const log = new Logger({ name: "simple-cris" });

import personsRouter from "./endpoints/persons.js";
import externalPersonsRouter from "./endpoints/external-persons.js";
import organizationsRouter from "./endpoints/organizations.js";
import usersRouter from "./endpoints/users.js";
import projectsRouter from "./endpoints/projects.js";
import applicationsRouter from "./endpoints/applications.js";
import awardsRouter from "./endpoints/awards.js";

const router = Router();

router.use((req: Request, res: Response, next) => {
  log.info(`📄 CRIS simulation received ${req.method} request at ${req.url}`);
  next();
});

router.use('/persons/search', personsRouter);
router.use('/external-persons/search', externalPersonsRouter);
router.use('/organizations', organizationsRouter);
router.use('/users', usersRouter);
router.use('/projects', projectsRouter);
router.use('/applications', applicationsRouter);
router.use('/awards', awardsRouter);

// Fallback for unexpected endpoints
router.use((req: Request, res: Response) => {
  res.json({
    items: [
      {
        method: req.method,
        url: req.url,
        body: req.body,
      }
    ]
  });
});

export default router;
