import { promises as fs } from 'fs'
import { PrismaClient, TemplateType } from '@prisma/client'
import { hash } from '../src/utils/auth'

const prisma = new PrismaClient()

// only allowed in development mode
if (process.env.NODE_ENV !== 'development') {
  console.error('This script is only allowed in development mode')
  process.exit(1)
}

// ensure we only have 0 projects, otherwise exit
prisma.project.count().then((count) => {
  if (count > 0) {
    console.error('There are already projects in the database. Exiting...')
    process.exit(1)
  }
})

async function createUsers() {
  await prisma.user.create({
    data: { username: 'admin', password: hash('admin') }
  })
  await prisma.user.create({
    data: { username: 'user', password: hash('password') }
  })
}

async function importProjects () {
  // development
  const jsonFile =  `./samples/projects/${process.env.RIS_TEST_DATA}`
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
      description: 'Default project template',
      yamlTemplate: await fs.readFile('./resources/transformers/project1.yaml', 'utf8')
    },
    {
      id: 2,
      templateType: 'PROJECT',
      name: 'Project 2',
      description: 'Project template without `organization`',
      yamlTemplate: await fs.readFile('./resources/transformers/project2.yaml', 'utf8')
    },
    {
      id: 3,
      templateType: 'APPLICATION',
      name: 'Application 1',
      yamlTemplate: await fs.readFile('./resources/transformers/application.yaml', 'utf8')
    },
    {
      id: 4,
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
          description: template.description,
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
  await createUsers()
  await importProjects()
  await createTemplates()

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
