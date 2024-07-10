import { promises as fs } from 'fs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function importAll () {

  // development
  const jsonFile =  `./samples/projects/${process.env.RIS_USE_DEV}`
  const result = await fs.readFile(jsonFile).then((data) => JSON.parse(data.toString()))

  result.forEach(async (project) => {
    // if not exists
    const projectExists = await prisma.project.findUnique({
      where: {
        risid: project.id
      }
    })

    if (!projectExists) {
      const newProject = await prisma.project.create({
        data: {
          risid: project.id,
          data: project
        }
      })
      console.log(newProject)
    } else {
      console.log(`Project ${project.id} already exists`)
    }
  })
}
async function main() {
  importAll()
  // ... you will write your Prisma Client queries here
  const allProjects = await prisma.project.findMany()
  console.log(allProjects)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
