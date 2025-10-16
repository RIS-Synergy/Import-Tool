import { Request, Response } from 'express';

import { Logger } from "../../utils/logger.js";
const log = new Logger({ name: "feature:funding-agency:controller" });

import { FundingAgencyService } from './services/funding-agency.service.js';

export class FundingAgencyController {
  private readonly service = new FundingAgencyService();

  public getMany = async (req: Request, res: Response): Promise<void> => {
    try {
      const fundingAgencyList = await this.service.findMany();
      res.status(200).json(fundingAgencyList);
    } catch (error) {
      console.log('Error retrieving FundingAgency:', error);
      res.status(500).json({ message: 'Error retrieving FundingAgency' });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const fundingAgency = await this.service.findById(id);

      if (fundingAgency) {
        res.status(200).json(fundingAgency);
      } else {
        res.status(404).json({ message: `FundingAgency with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving FundingAgency' });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newFundingAgency = await this.service.create(req.body);
      res.status(201).json(newFundingAgency);
    } catch (error) {
      res.status(500).json({ message: 'Error creating FundingAgency' });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const updatedFundingAgency = await this.service.update(id, req.body);
      res.status(200).json(updatedFundingAgency);
    } catch (error) {
      res.status(500).json({ message: 'Error updating FundingAgency' });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const deletedFundingAgency = await this.service.delete(id);
      res.status(200).json(deletedFundingAgency);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting FundingAgency' });
    }
  };
}
