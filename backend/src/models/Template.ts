import { PrismaClient } from '@prisma/client'
import { Logger } from "tslog";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:Template' });

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

  // async createOrUpdateCrisLink(crisData: any) {
  //   const data = {
  //     crisId: crisData.pureId.toString(),
  //     crisUUID: crisData.uuid
  //   }
  //   log.info('Data', data)
  //   try {
  //     const project = await prisma.project.update({
  //       where: {
  //         risId: this.risId
  //       },
  //       data
  //     })
  //     return project
  //   } catch (error) {
  //     log.error('Error creating or updating project', error)
  //   }
  //   return null
  // }

  // get crisUUID() {
  //   return prisma.project.findUnique({
  //     where: {
  //       risId: this.risId
  //     }
  //   }).then((project) => {
  //     return project.crisUUID
  //   }).catch((error) => {
  //     log.error('Error getting crisUUID', error)
  //     return null
  //   })
  // }

  // async fetchCrisData() {
  //   const ri = new ResearchInstitution()
  //   const crisData = await ri.getProjectData(await this.crisUUID)
  //   return crisData
  // }
}
