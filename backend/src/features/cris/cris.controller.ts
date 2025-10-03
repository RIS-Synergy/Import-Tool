import { Request, Response } from 'express';
import { CRISService } from './services/cris.service.js';

export class CRISController {
  private readonly crisService = new CRISService();

  public getAllCRIS = async (req: Request, res: Response): Promise<void> => {
    try {
      const crisList = await this.crisService.findAll();
      res.status(200).json(crisList);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving CRIS' });
    }
  };

  public getCRISById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const cris = await this.crisService.findById(id);

      if (cris) {
        res.status(200).json(cris);
      } else {
        res.status(404).json({ message: `CRIS with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving CRIS' });
    }
  };

  public createCRIS = async (req: Request, res: Response): Promise<void> => {
    try {
      const newCRIS = await this.crisService.create(req.body);
      res.status(201).json(newCRIS);
    } catch (error) {
      res.status(500).json({ message: 'Error creating CRIS' });
    }
  };

  public updateCRIS = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedCRIS = await this.crisService.update(id, req.body);
      res.status(200).json(updatedCRIS);
    } catch (error) {
      res.status(500).json({ message: 'Error updating CRIS' });
    }
  };

  public deleteCRIS = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const deletedCRIS = await this.crisService.delete(id);
      res.status(200).json(deletedCRIS);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting CRIS' });
    }
  };
}
