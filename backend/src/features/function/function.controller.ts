import { Request, Response } from 'express';
import { FunctionService } from './services/function.service.js';
import { BadRequestError } from '@/utils/errors.js';

export class FunctionController {
  private readonly service = new FunctionService();

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const functions = await this.service.findAll();
      res.status(200).json(functions);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving functions' });
    }
  };

  public getByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      const fn = await this.service.findByName(name);

      if (fn) {
        res.status(200).json(fn);
      } else {
        res.status(404).json({ message: `Function '${name}' not found.` });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving function' });
    }
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const fn = await this.service.create({ name });
      res.status(201).json(fn);
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error creating function' });
      }
    }
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      const { code, language, description } = req.body;
      const fn = await this.service.update(name, { code, language, description });
      res.status(200).json(fn);
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error updating function' });
      }
    }
  };

  public verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      const { code, input, settings } = req.body;

      const result = await this.service.verify(name, code, input, settings);
      // Update the function with the verified code
      const fn = await this.service.update(name, {
        code,
        language: 'javascript'
      });

      res.status(200).json({ ...fn, ...result });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying function' });
    }
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      const deletedFunction = await this.service.delete(name);
      res.status(200).json(deletedFunction);
    } catch (error) {
      res.status(500).json({ message: 'Error deleting function' });
    }
  };
}
