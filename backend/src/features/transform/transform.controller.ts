import { Request, Response } from 'express';
import { TransformService } from './services/transform.service.js';
import { Logger } from '@/utils/logger.js';
const log = new Logger({ name: 'feature:transform:controller' });

export class TransformController {
  private service: TransformService;

  constructor() {
    this.service = new TransformService();
  }

  public upload = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.service.transformById(
        req.body.templateId,
        req.body.ris,
        req.body.settings
      );

      res.status(200).json(result);
    } catch (error) {
      log.error('Upload error:', error);
      res.status(500).json({
        message: 'Error during transformation',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
