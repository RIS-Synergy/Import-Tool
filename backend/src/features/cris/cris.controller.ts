import { Request, Response } from 'express';

import { CRISService } from './services/cris.service.js';

import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: "feature:cris:controller" });


// similar code is duplicated from features/user/user.controller.ts, move to a common file
function limitByUserPermission(reqUser: any) {
  const permissions = reqUser.permission || []

  // Regular user (not an admin). Only show items from the same RI
  if (!permissions.includes('admin')) {
    return {
      researchInstitutionId: reqUser.ri
    }
  }

  // All items, including 'admin'
  return {}
}

export class CRISController {
  private readonly service = new CRISService();

  public getMany = async (req: Request, res: Response): Promise<void> => {
    try {
      const where = limitByUserPermission(req.user)
      const crisList = await this.service.findMany(where);
      res.status(200).json(crisList);
    } catch (error) {
      console.log('Error retrieving CRIS:', error);
      res.status(500).json({ message: 'Error retrieving CRIS' });
    }
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const cris = await this.service.findById(id);

      if (cris) {
        res.status(200).json(cris);
      } else {
        res.status(404).json({ message: `CRIS with id ${id} not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving CRIS' });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newCRIS = await this.service.create(req.body);
      res.status(201).json(newCRIS);
    } catch (error) {
      res.status(500).json({ message: 'Error creating CRIS' });
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const updatedCRIS = await this.service.update(id, req.body);
      res.status(200).json(updatedCRIS);
    } catch (error) {
      res.status(500).json({ message: 'Error updating CRIS' });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const deletedCRIS = await this.service.delete(id);
      res.status(200).json(deletedCRIS);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting CRIS' });
    }
  };

  private async getCrisData(crisId: number, reqUser) {
    const where = limitByUserPermission(reqUser)
    const crisList = await this.service.findMany(where, {
      apiKey: true // show API key only in the backend, not in the frontend
    })

    // Find 1 CRIS of given ID
    const crisData = crisList.find(c => c.id === crisId)

    // if not found, return error
    if (!crisData) {
      throw new Error('CRIS not found or not accessible')
    }

    return crisData
  }

  public search = async (req: Request, res: Response): Promise<void> => {
    const crisData = await this.getCrisData(req.body.crisId, req.user)

    const searchResults = await this.service.search(
      req.body.query,
      crisData.apiUrl,
      crisData.apiKey,
    );

    res.json(searchResults);
  }

  public reference = async (req: Request, res: Response): Promise<void> => {
    const crisData = await this.getCrisData(req.body.crisId, req.user)
    const result = await this.service.reference(
      crisData.apiUrl,
      crisData.apiKey,
      {
        systemName: req.body.systemName,
        uuid: req.body.uuid,
      }
    )

    res.json(result);
  }

  public upload = async (req: Request, res: Response): Promise<void> => {
    const crisData = await this.getCrisData(req.body.crisId, req.user)

    try {
      const result = await this.service.upload(
        crisData.apiUrl,
        crisData.apiKey,
        req.body
      )

      res.json(result);
    } catch (error) {
      log.error('Error uploading to CRIS:', error);
      res.status(500).json({ message: 'Error uploading to CRIS' });
    }
  }

  public likelihood = async (req: Request, res: Response): Promise<void> => {
    try {
      const crisData = await this.getCrisData(req.body.crisId, req.user);
      const id = req.params.id;

      const result = await this.service.likelihood(id, crisData.apiUrl, crisData.apiKey);
      res.json(result);
    } catch (error) {
      log.error('Error in likelihood calculation:', error);
      if (error.message === 'CRIS not found or not accessible') {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error calculating likelihood' });
      }
    }
  }

  public getDiffs = async (req: Request, res: Response): Promise<void> => {
    log.info(`req: ${req.path}`, 'CRISController:getDiffs', req.body)

    const { refreshDiff } = req.body;
    if (refreshDiff) {
      this.service.refreshDiffs(req.params.id);
    }

    const result = await this.service.getDiffs(
      req.params.id,
      req.body.crisId,
      req.body.systemName,
    );

    res.json(result);
  }

  public refreshDiff = async (req: Request, res: Response): Promise<void> => {
    log.info(`req: ${req.path}`, 'CRISController:getDiffs', req.body)

    const result = this.service.refreshDiff(
      req.params.id,
      req.body.crisId,
      req.body.systemName,
      req.body.uuid,
    );

    res.json(result);
  }

  public executeAndSave = async (req: Request, res: Response): Promise<void> => {
    log.info(`req: ${req.path}`, 'CRISController:getDiffs', req.body)
    const crisData = await this.getCrisData(req.body.crisId, req.user);

    const result = await this.service.getDiffs(
      req.params.id,
      req.body.systemName,
      req.body.uuid,
      req.body.templateId,
      req.body.settings,
      crisData.apiUrl,
      crisData.apiKey
    );

    res.json(result);
  }

  public assignCluster = async (req: Request, res: Response): Promise<void> => {
    try {
      const crisData = await this.getCrisData(req.body.crisId, req.user);

      const result = await this.service.assignCluster(
        crisData.apiUrl,
        crisData.apiKey,
        req.body.projectUUID,
        req.body.applicationUUID,
        req.body.awardUUID
      );

      res.json(result);
    } catch (error) {
      log.error('Error assigning cluster:', error);
      res.status(500).json({ message: 'Error assigning cluster' });
    }
  }
}
