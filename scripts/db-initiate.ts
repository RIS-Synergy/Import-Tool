import { promises as fs } from 'fs'
import { PrismaClient, TemplateType } from '@prisma/client'

const prisma = new PrismaClient()

async function importProjects () {

  // development
  const jsonFile =  `./samples/projects/${process.env.RIS_USE_DEV}`
  const result = await fs.readFile(jsonFile).then((data) => JSON.parse(data.toString()))

  result.forEach(async (project) => {
    // if not exists
    const projectExists = await prisma.project.findUnique({
      where: {
        risId: project.id
      }
    })

    if (!projectExists) {
      const newProject = await prisma.project.create({
        data: {
          risId: project.id,
          risData: project
        }
      })
      // console.log(newProject)
    } else {
      // console.log(`Project ${project.id} already exists`)
    }
  })
}

async function createTemplates () {
  const templates = [
    {
      id: 1,
      templateType: 'PROJECT',
      name: 'Project 1',
      yamlTemplate: await fs.readFile('./resources/transformers/project.yaml', 'utf8')
    },
    {
      id: 2,
      templateType: 'APPLICATION',
      name: 'Application 1',
      yamlTemplate: await fs.readFile('./resources/transformers/application.yaml', 'utf8')
    },
    {
      id: 3,
      templateType: 'AWARD',
      name: 'Award 1',
      yamlTemplate: await fs.readFile('./resources/transformers/award.yaml', 'utf8')
    }
  ]

  templates.forEach(async (template) => {
    const templateExists = await prisma.template.findUnique({
      where: {
        id: template.id
      }
    })

    if (!templateExists) {
      const newTemplate = await prisma.template.create({
        data: {
          name: template.name,
          templateType: template.templateType as TemplateType,
          yamlTemplate: template.yamlTemplate
        }
      })
      // console.log(newTemplate)
    } else {
      console.log(`Template ${template.name} already exists`)
    }
  })
}

function calculateCountOf (type: string) {
  prisma[type].count().then((count) => {
    console.log(`Count of ${type}s: ${count}`)
  })
}

async function main() {
  importProjects()
  createTemplates()

  calculateCountOf('project')
  calculateCountOf('template')
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
