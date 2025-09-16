import { Request, Response } from 'express';
import { ResearchInstitutionService } from './services/research-institution.service.js';

export class ResearchInstitutionController {
  private readonly researchInstitutionService = new ResearchInstitutionService();

  public getAllResearchInstitutions = async (req: Request, res: Response): Promise<void> => {
    try {
      const institutions = await this.researchInstitutionService.findAll();
      res.status(200).json(institutions);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving research institutions' });
    }
  };

  public getResearchInstitutionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const institution = await this.researchInstitutionService.findById(id);

      if (institution) {
        res.status(200).json(institution);
      } else {
        res.status(404).json({ message: `Research institution with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving research institution' });
    }
  };

  public createResearchInstitution = async (req: Request, res: Response): Promise<void> => {
    try {
      const newInstitution = await this.researchInstitutionService.create(req.body);
      res.status(201).json(newInstitution);
    } catch (error) {
      res.status(500).json({ message: 'Error creating research institution' });
    }
  };
}
