import { TransformExecutorService } from './transform.executor.service.js';
import { TransformFunctionService } from './transform.function.service.js';
import { FunctionService } from '@/features/function/services/function.service.js';
import { TemplateService } from '@/features/template/services/template.service.js';
import { Logger } from '@/utils/logger.js';
const log = new Logger({ name: 'feature:transform:service' });

export class TransformService {
  private executorService: TransformExecutorService;
  private templateService: TemplateService;

  constructor() {
    const functionService = new FunctionService();
    const transformFunctionService = new TransformFunctionService(functionService);
    this.executorService = new TransformExecutorService(transformFunctionService);
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
      return this.transformByYaml(yamlTemplate, data, settings);
    } catch (error) {
      log.error('Transform by ID error:', error);
      throw error;
    }
  }

  async transformByYaml(yamlTemplate: string, data: object, settings: any) {
    try {
      log.debug('Transform YAML Template\n', yamlTemplate.substring(0, 100) + '...');

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
