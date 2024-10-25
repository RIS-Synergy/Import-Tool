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

  static getById = async (risId: string) => {
    try {
      return await prisma.project.findUnique({
        where: {
          risId
        }
      })
    } catch (error) {
      log.error('Error getting project by ID', error)
    }
    return null
  }

  static async createOrUpdateCrisLink(risId: string, crisData: any) {

    const data = {
      crisId: crisData.pureId.toString(),
      crisUUID: crisData.uuid
    }
    log.info('Data', data)
    try {
      const project = await prisma.project.update({
        where: {
          risId
        },
        data
      })
      return project
    } catch (error) {
      log.error('Error creating or updating project', error)
    }
    return null
  }
}
