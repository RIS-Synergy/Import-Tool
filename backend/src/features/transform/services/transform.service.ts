import { PrismaClient } from '@prisma/client';
import { TransformExecutorService } from './transform.executor.service.js';
import { Logger } from '@/utils/logger.js';
const log = new Logger({ name: 'feature:transform:service' });

const prisma = new PrismaClient();

export class TransformService {
  private executorService: TransformExecutorService;

  constructor() {
    this.executorService = new TransformExecutorService();
  }

  async getTemplate(templateId: number) {
    const template = await prisma.template.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    return template.yamlTemplate;
  }

  async transform(templateId: number, ris: any, settings: any) {
    try {
      const yamlTemplate = await this.getTemplate(templateId);
      log.debug('Template', templateId, yamlTemplate?.substring(0, 100) + '...');

      const result = await this.executorService.execute(yamlTemplate, ris, settings);

      return {
        yamlTemplate,
        transformationResult: result.output,
        error: result.error
      };
    } catch (error) {
      log.error('Transform error:', error);
      throw error;
    }
  }
}
