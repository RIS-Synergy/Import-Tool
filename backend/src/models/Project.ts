import { PrismaClient } from '@prisma/client'
import { Logger } from "tslog";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:Project' });

import { ResearchInstitution } from './ResearchInstitution'
import { Registry } from './Registry'

export class Project {
  constructor(public risId: string) { }

  // @deprecated, delete it later. us getById, and even new Project(risId), not static
  static async ifExists(risId: string) {
    try {
      return await prisma.project.findUnique({
        where: {
          risId: risId
        }
      })
    } catch (error) {
      log.error('Error checking if project exists', error.message)
    }
    return false
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

  async createOrUpdateCrisLink(crisData: any) {
    const data = {
      crisId: crisData.pureId.toString(),
      crisUUID: crisData.uuid
    }
    log.info('Data', data)
    try {
      const project = await prisma.project.update({
        where: {
          risId: this.risId
        },
        data
      })
      return project
    } catch (error) {
      log.error('Error creating or updating project', error)
    }
    return null
  }

  get crisUUID() {
    return prisma.project.findUnique({
      where: {
        risId: this.risId
      }
    }).then((project) => {
      return project.crisUUID
    }).catch((error) => {
      log.error('Error getting crisUUID', error)
      return null
    })
  }

  async fetchCrisData(crisUUID: string) {
    const ri = new ResearchInstitution()
    const crisData = await ri.getProjectData(crisUUID)
    return crisData
  }

  static getUrl(url: 'PROJECTS' | 'PROJECT') {
    return Registry.getURL('project', url)
  }
}
