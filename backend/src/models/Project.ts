import { PrismaClient } from '@prisma/client'
import { Logger } from "tslog";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:Project' });

export class Project {
  constructor () {}

  static async ifExists(risId: string) {
    try {
      return await prisma.project.findUnique({
        where: {
          risId: risId
        }
      })
    } catch (error) {
      log.error('Error checking if project exists', error)
    }
    return null
  }
}
