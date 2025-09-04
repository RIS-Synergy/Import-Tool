import { PrismaClient } from '@prisma/client'
import { Logger } from "../utils/logger";
import { Registry } from "./Registry";

const prisma = new PrismaClient()
const log = new Logger({ name: 'model:Project' });

import { ResearchInstitution } from './ResearchInstitution'
// import { registry } from "../server";

type FundedItem = Record<string, any>; // Generic type for unknown nested structures

export const registry = new Registry()
registry.run()

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
    const crisData = await ri.getEntityData('Project', crisUUID)
    return crisData
  }

  static getUrl(url: 'PROJECTS' | 'PROJECT') {
    return registry.getURL('project', url)
  }

  /**
   * Recursively searches for the first ROR identifier and the associated organization name.
   * @param funded - The array containing nested funding data.
   * @returns An object containing the ROR identifier and organization name, or null if not found.
   */
  static findRORInfo(funded: FundedItem[]): { ror: string | null; name: string | null } {
    let ror: string | null = null;
    let name: string | null = null;

    function search(item: any) {
      if (Array.isArray(item)) {
        for (const subItem of item) {
          search(subItem);
          if (ror && name) return; // Stop if both values are found
        }
      } else if (typeof item === "object" && item !== null) {
        if (item.type === "ROR" && item.value) {
          ror = item.value;
        }
        if (Array.isArray(item.name)) {
          const nameObj = item.name.find((n: any) => n.lang === "de" && n.text);
          if (nameObj) {
            name = nameObj.text;
          }
        }
        for (const key in item) {
          search(item[key]);
          if (ror && name) return; // Stop if both values are found
        }
      }
    }

    search(funded);
    return { ror, name };
  }

  static hasROR(funded: FundedItem[], ror: string): boolean {
    function search(item: any): boolean {
      if (Array.isArray(item)) {
        return item.some(subItem => search(subItem));
      } else if (typeof item === "object" && item !== null) {
        if (item.type === "ROR" && item.value === ror) {
          return true;
        }
        return Object.values(item).some(value => search(value));
      }
      return false;
    }

    return search(funded);
  }

  /**
   * Checks if any email addresses in the project data match the specified domain.
   * @param project - The project data containing team information.
   * @param domain - The domain to match against email addresses.
   * @returns True if a matching email address is found, otherwise false.
   */
  static matchDomain(project: any, domain: string): boolean {
    if (!domain) return false;

    function search(item: any): boolean {
      if (Array.isArray(item)) {
        return item.some(subItem => search(subItem));
      } else if (typeof item === "object" && item !== null) {
        if (item.electronicAddress && item.electronicAddress.endsWith(`@${domain}`)) {
          return true;
        }
        return Object.values(item).some(value => search(value));
      }
      return false;
    }

    return search(project);
  }
}
