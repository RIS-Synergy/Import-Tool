import { FunctionService } from '@/features/function/services/function.service.js';
import { FunctionVerifyService } from '@/features/function/services/functions.verify.service.js';
import { BadRequestError } from '@/utils/errors.js';

export class TransformFunctionService {
  private functionVerifyService: FunctionVerifyService;

  constructor(private functionService: FunctionService) {
    this.functionVerifyService = new FunctionVerifyService();
  }

  async loadFunctions() {
    return await this.functionService.findAll();
  }

  async count() {
    const functions = await this.loadFunctions();
    return functions.length;
  }

  async createOrUpdate(name: string, code: string, language = 'javascript') {
    try {
      // Try to update first
      return await this.functionService.update(name, { code, language });
    } catch (error) {
      // If function doesn't exist, create it
      if (error instanceof BadRequestError && error.message.includes('not found')) {
        return await this.functionService.create({ name, code, language, description: '' });
      }
      throw error;
    }
  }

  async read(name: string) {
    return await this.functionService.findByName(name);
  }

  async verify(name: string, code: string, input: object, settings: object) {
    return await this.functionVerifyService.verify(name, code, input, settings);
  }
}
