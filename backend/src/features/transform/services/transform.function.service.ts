import { Function } from '@/models/Function.js';

export class TransformFunctionService {
  async loadFunctions() {
    return await Function.all();
  }
}
