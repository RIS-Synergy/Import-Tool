import { Logger } from "../utils/logger";
const log = new Logger({ name: 'model:Function' });

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import { Executer } from './Executer'

export class Function {
  name: string
  description: string
  code: string
  language: string

  constructor() {
  }

  // number of functions in the database
  static async count() {
    return await prisma.customFunction.count()
  }

  // create or update
  static async createOrUpdate(name: string, code: string, language = 'javascript') {
    const data: any = await prisma.customFunction.upsert({
      where: {
        name
      },
      update: {
        name,
        code,
        language
      },
      create: {
        name,
        code,
        language
      }
    })
    const result = new Function()

    result.name = data.name
    result.code = data.code
    result.language = data.language

    return result
  }

  // load from the database
  static async read(name: string) {
    return await prisma.customFunction.findUnique({
      where: {
        name
      }
    })
  }

  // get all, order by name
  static async all() {
    return await prisma.customFunction.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  }

  static async verify(name: string, code: string, input: object, settings: object) {
    // log.info('verify', name, code, input, settings)

    const executer = new Executer(`output: "!<fn>${name}"`, input, settings)
    executer.addFunction(name, code)
    try {
      return await executer.execute()
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
