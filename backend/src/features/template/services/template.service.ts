import prisma from '@/lib/prisma.js';
import { Template, TemplateCreationParams, TemplateUpdateParams } from '../template.model.js';
import { BadRequestError } from '@/utils/errors.js';
import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'feature:template:service' });

const typeMap = {
  project: 'PROJECT',
  application: 'APPLICATION',
  award: 'AWARD'
};

export class TemplateService {
  public async findMany(templateType?: string): Promise<Template[]> {
    const where = templateType ? { templateType: typeMap[templateType] } : {};
    return prisma.template.findMany({
      where,
      orderBy: {
        modifiedDate: 'desc'
      }
    });
  }

  public async findById(id: number): Promise<Template | null> {
    return prisma.template.findUnique({
      where: { id }
    });
  }

  public async create(templateData: TemplateCreationParams): Promise<Template> {
    try {
      // Validate templateType
      if (!typeMap[templateData.templateType]) {
        throw new BadRequestError(`Invalid template type: ${templateData.templateType}`);
      }

      return await prisma.template.create({
        data: {
          ...templateData,
          templateType: typeMap[templateData.templateType],
        }
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to create template: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  public async update(id: number, templateData: TemplateUpdateParams): Promise<Template> {
    try {
      const data: any = { ...templateData };
      if (templateData.templateType) {
        // Validate templateType
        if (!typeMap[templateData.templateType]) {
          throw new BadRequestError(`Invalid template type: ${templateData.templateType}`);
        }
        data.templateType = typeMap[templateData.templateType];
      }
      console.log('Updating template with data:', data)

      return await prisma.template.update({
        where: { id },
        data
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to update template: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  public async updateYamlTemplate(id: number, yamlTemplate: string): Promise<Template> {
    try {
      return await prisma.template.update({
        where: { id },
        data: {
          yamlTemplate: yamlTemplate.replace(/\n$/gm, '')
        }
      });
    } catch (error) {
      throw new BadRequestError('Failed to update template YAML: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  public async delete(id: number): Promise<Template> {
    try {
      return await prisma.template.delete({
        where: { id }
      });
    } catch (error) {
      throw new BadRequestError('Failed to delete template: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  public async findFirst(templateType: string): Promise<Template | null> {
    try {
      if (!typeMap[templateType]) {
        throw new BadRequestError(`Invalid template type: ${templateType}`);
      }
      return await prisma.template.findFirst({
        where: {
          templateType: typeMap[templateType]
        },
        orderBy: {
          modifiedDate: 'desc',
        },
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError('Failed to find template: ' + (error instanceof Error ? error.message : String(error)));
    }
  }
}
