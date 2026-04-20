import { Request, Response } from 'express';
import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: "feature:project:controller" });
import { ProjectService } from './services/project.service.js';
import { researchInstitutionIdSchema } from '../research-institution/research-institution.validation.js';

function limitByUserPermission(reqUser: any, domain: string) {
  // XXX for now, do not limit by user permission

  // const permissions = reqUser.permission || [];

  // if (!permissions.includes('admin')) {
  //   return {
  //     researchInstitutionId: reqUser.ri
  //   };
  // }
  return {
    where: {
      // Limit to research institution by domain
      researchInstitutions: {
        some: { domain }
      }
    },
  };
}

export class ProjectController {
  private readonly service = new ProjectService();

  public getMany = async (req: Request, res: Response): Promise<void> => {
    log.info('ProjectController.getMany', req.body)

    try {
      const filters = req.body.filters || {
        status: [],
        piDomain: { domain: "", ror: "" },
        diffs: "All",
        orderBy: "startDate:desc", itemsPerPage: '10'
      };

      // XXX not secure limitation!
      const query = limitByUserPermission(req.user, filters.piDomain?.domain);
      // console.log('query', query)

      const page = req.body.page || "1";

      const projects = await this.service.findMany2(query, filters, page);
      res.status(200).json(projects);
    } catch (error) {
      log.error('Error retrieving projects:', error);
      res.status(500).json({ message: 'Error retrieving projects' });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const project = await this.service.findById(id);

      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: `Project with id ${id} not found.` });
      }
    } catch (error) {
      log.error('Error retrieving project:', error);
      res.status(500).json({ message: 'Error retrieving project' });
    }
  };

  public getByRisId = async (req: Request, res: Response): Promise<void> => {
    try {
      const risId = req.params.risId;
      const project = await this.service.findByRisId(risId);

      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: `Project with risId ${risId} not found.` });
      }
    } catch (error) {
      log.error('Error retrieving project:', error);
      res.status(500).json({ message: 'Error retrieving project' });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newProject = await this.service.create(req.body);
      res.status(201).json(newProject);
    } catch (error) {
      log.error('Error creating project:', error);
      res.status(500).json({ message: 'Error creating project' });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedProject = await this.service.update(id, req.body);
      res.status(200).json(updatedProject);
    } catch (error) {
      log.error('Error updating project:', error);
      res.status(500).json({ message: 'Error updating project' });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const deletedProject = await this.service.delete(id);
      res.status(200).json(deletedProject);
    } catch (error) {
      log.error('Error deleting project:', error);
      res.status(500).json({ message: 'Error deleting project' });
    }
  };

  public getStats = async (req: Request, res: Response): Promise<void> => {
    log.info('ProjectController.getStats', req.body);

    try {
      const filters = req.body.filters || {
        status: ['IN_PREPARATION', 'ACTIVE'],
        piDomain: { domain: "", ror: "" }
      };

      // Ensure default status if not provided in filters
      if (!filters.status || filters.status.length === 0) {
        filters.status = ['IN_PREPARATION', 'ACTIVE'];
      }

      const query = limitByUserPermission(req.user, filters.piDomain?.domain);
      const stats = await this.service.getStats(query, filters);
      res.status(200).json(stats);
    } catch (error) {
      log.error('Error retrieving project stats:', error);
      res.status(500).json({ message: 'Error retrieving project stats' });
    }
  };

  public search = async (req: Request, res: Response): Promise<void> => {
    log.info('ProjectController.search', req.query.q);
    const start = Date.now();
    const q = req.query.q as string;
    if (!q) {
      res.status(200).json([]);
      return;
    }

    try {
      const results = await this.service.search(q);
      const duration = Date.now() - start;
      log.info(`ProjectController.search took ${duration}ms for query: ${q}`);
      res.status(200).json(results);
    } catch (error) {
      log.error('Error searching projects:', error);
      res.status(500).json({ message: 'Error searching projects' });
    }
  };
}
