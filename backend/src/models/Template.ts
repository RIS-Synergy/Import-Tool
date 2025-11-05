import { PrismaClient } from '@prisma/client'
import { Logger } from "@/utils/logger.js";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:Template' });

import { TemplateType } from '@prisma/client';

export class Template {
  constructor () {}

  static getById = async (id: number) => {
    try {
      return await prisma.template.findUnique({
        where: {
          id
        }
      })
    } catch (error) {
      log.error(`Error getting Template by ID ${id}`, error)
    }
    return null
  }

  static async first (templateType: TemplateType) {
    const latestProjectTemplate = await prisma.template.findFirst({
      where: {
        templateType
      },
      orderBy: {
        modifiedDate: 'desc',
      },
    });
    return latestProjectTemplate;
  }
}
