import prisma from '@/lib/prisma.js';
import { Function } from '../function.model.js';
import { Executer } from '@/models/Executer.js';
import { BadRequestError } from '@/utils/errors.js';

type FunctionCreationParams = Omit<Function, 'id' | 'createdDate' | 'modifiedDate'>;

export class FunctionService {
  public async findAll(): Promise<Function[]> {
    return prisma.customFunction.findMany({
      orderBy: { name: 'asc' },
    });
  }

  public async findByName(name: string): Promise<Function | null> {
    return prisma.customFunction.findUnique({
      where: { name },
    });
  }

  public async create(functionData: FunctionCreationParams): Promise<Function> {
    // Check if function already exists
    const existingFunction = await this.findByName(functionData.name);
    if (existingFunction) {
      throw new BadRequestError(`Function '${functionData.name}' already exists`);
    }

    return prisma.customFunction.create({
      data: {
        name: functionData.name,
        code: functionData.code || '',
        language: functionData.language || 'javascript',
        description: functionData.description || ''
      }
    });
  }

  public async update(name: string, functionData: Partial<FunctionCreationParams>): Promise<Function> {
    // Check if function exists
    const existingFunction = await this.findByName(name);
    if (!existingFunction) {
      throw new BadRequestError(`Function '${name}' not found`);
    }

    return prisma.customFunction.update({
      where: { name },
      data: {
        code: functionData.code,
        language: functionData.language,
        description: functionData.description
      }
    });
  }

  public async verify(name: string, code: string, input: object, settings: object): Promise<{ output: any, error: any }> {
    const executer = new Executer(`output: "!<fn>${name}"`, input, settings);
    executer.addFunction(name, code);
    try {
      return await executer.execute();
    } catch (error) {
      return {
        output: null,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  public async delete(name: string): Promise<Function> {
    return prisma.customFunction.delete({
      where: { name },
    });
  }
}
