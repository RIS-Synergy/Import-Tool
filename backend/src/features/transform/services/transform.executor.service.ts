import { Executer } from '@/models/Executer.js';
import { TransformFunctionService } from './transform.function.service.js';

export class TransformExecutorService {
  private functionService: TransformFunctionService;

  constructor() {
    this.functionService = new TransformFunctionService();
  }

  async execute(yamlTemplate: string, input: any, settings: any) {
    const functions = await this.functionService.loadFunctions();
    const executer = new Executer(yamlTemplate, input, settings);

    functions.forEach((fn) => {
      executer.addFunction(fn.name, fn.code);
    });

    return await executer.execute();
  }
}
