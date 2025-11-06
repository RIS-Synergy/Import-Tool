import { TransformExecutorService } from './transform.executor.service.js';
import { TemplateService } from '@/features/template/services/template.service.js';
import { Logger } from '@/utils/logger.js';
const log = new Logger({ name: 'feature:transform:service' });

export class TransformService {
  private executorService: TransformExecutorService;
  private templateService: TemplateService;

  constructor () {
    this.executorService = new TransformExecutorService();
    this.templateService = new TemplateService();
  }

  private async getTemplate(templateId: number) {
    const template = await this.templateService.findById(templateId);

    if (!template) {
      throw new Error(`Template with id ${templateId} not found`);
    }

    return template.yamlTemplate;
  }

  async transformById(templateId: number, data: object, settings: any) {
    try {
      const yamlTemplate = await this.getTemplate(templateId);
      log.info('Transforming using template ID:', templateId);
      return await this.transformByYaml(yamlTemplate, data, settings);
    } catch (error) {
      log.error('Transform by ID error:', error);
      throw error;
    }
  }

  async transformByYaml(yamlTemplate: string, data: object, settings: object) {
    try {
      log.debug('Transform YAML Template\n', yamlTemplate.substring(0, 100) + '...');
      log.debug('Transform Data\n', JSON.stringify(data).substring(0, 100) + '...');
      log.debug('Transform Settings\n', JSON.stringify(settings).substring(0, 100) + '...');

      const result = await this.executorService.execute(
        yamlTemplate,
        data,
        settings
      );

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
