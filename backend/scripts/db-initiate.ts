import { promises as fs } from 'fs'
import { PrismaClient, TemplateType } from '@prisma/client'
import { hash } from '../src/utils/auth'
import { ResearchInstitutionService } from '../src/features/research-institution/services/research-institution.service.js';

const prisma = new PrismaClient()

// only allowed in development mode or ci mode
if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'ci') {
  console.error('This script is only allowed in development or ci mode. Exiting...')
  process.exit(1)
}

// ensure we only have 0 projects, otherwise exit
prisma.project.count().then((count) => {
  if (count > 0) {
    console.error('There are already projects in the database. Exiting...')
    process.exit(1)
  }
})

async function createResearchInstitutions() {
  const service = new ResearchInstitutionService()
  await service.importDomains()
}

async function createUsers() {
  // First, ensure 'Universität Wien' exists, create if it doesn't
  let uniWien = await prisma.researchInstitution.findFirst({
    where: {
      name: 'Universität Wien'
    }
  });

  if (!uniWien) {
    console.log('Universität Wien not found, creating...')

    // Create 'Universität Wien' if it doesn't exist
    uniWien = await prisma.researchInstitution.upsert({
      where: { rorId: '03prydq77' },
      create: {
        name: 'Universität Wien',
        domain: 'univie.ac.at',
        rorId: '03prydq77'
      },
      update: {
        name: 'Universität Wien',
        domain: 'univie.ac.at'
      }
    });
    console.log('Created Universität Wien research institution');
  }

  await prisma.user.upsert({
    where: { username: 'admin' },
    create: { username: 'admin', password: hash('admin'), permission: ['admin', 'edit'] },
    update: { password: hash('admin'), permission: ['admin', 'edit'] }
  });

  await prisma.user.upsert({
    where: { username: 'user' },
    create: {
      username: 'user',
      password: hash('user'),
      researchInstitution: {
        connect: { id: uniWien.id }
      }
    },
    update: {
      password: hash('user'),
      researchInstitution: {
        connect: { id: uniWien.id }
      }
    }
  });
}

async function importProjects() {
  // development
  const jsonFile = `./samples/projects/${process.env.RIS_TEST_DATA}`
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

async function createTemplates() {
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

function calculateCountOf(type: string) {
  prisma[type].count().then((count) => {
    console.log(`Count of ${type}s: ${count}`)
  })
}

async function main() {
  await createResearchInstitutions()
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
