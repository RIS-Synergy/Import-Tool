import { promises as fs } from 'fs'
import { PrismaClient, TemplateType } from '@prisma/client'
import { hash } from '../src/utils/auth'
import { ResearchInstitutionService } from '../src/features/research-institution/services/research-institution.service.js';
import { ProjectService } from '../src/features/project/services/project.service.js';

const prisma = new PrismaClient()
const projectService = new ProjectService()

// only allowed in development mode or ci mode
if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'ci') {
  console.error('This script is only allowed in development or ci mode. Exiting...')
  process.exit(1)
}

async function checkEmpty() {
  const count = await prisma.project.count();
  if (count > 0) {
    console.error('There are already projects in the database. Exiting...');
    process.exit(1);
  }
}

async function createResearchInstitutions() {
  const service = new ResearchInstitutionService()
  await service.importDomains()
}

async function createUsers() {
  // Clear existing users to ensure a clean state for tests
  await prisma.user.deleteMany();
  console.log('Cleared existing users');

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

  // Admin user - no Research Institution so that regular users don't see them
  // (unless the test specifically expects otherwise)
  await prisma.user.upsert({
    where: { username: 'admin' },
    create: {
      username: 'admin',
      password: hash('admin'),
      permission: ['superuser', 'admin', 'edit']
    },
    update: {
      password: hash('admin'),
      permission: ['superuser', 'admin', 'edit'],
      researchInstitutionId: null // Ensure no RI
    }
  });

  // Regular user - assigned to Universität Wien
  await prisma.user.upsert({
    where: { username: 'user' },
    create: {
      username: 'user',
      password: hash('user'),
      permission: ['edit'],
      researchInstitution: {
        connect: { id: uniWien.id }
      }
    },
    update: {
      password: hash('user'),
      permission: ['edit'],
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

  for (const project of result) {
    try {
      await projectService.create({
        risId: project.id,
        risData: project
      } as any)
    } catch (error: any) {
      // these are expected because the
      // sample data contains Univerität Wien multiple times with different ROR ids
      if (error.code !== 'P2002') {
        console.error('Error creating project:', project.id, error)
      }
    }
  }
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

  for (const template of templates) {
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
  }
}

async function calculateCountOf(type: string) {
  const count = await (prisma as any)[type].count();
  console.log(`Count of ${type}s: ${count}`)
}

async function main() {
  await checkEmpty()
  // await createResearchInstitutions()
  await createUsers()
  await importProjects()
  await createTemplates()

  await calculateCountOf('project')
  await calculateCountOf('template')
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
