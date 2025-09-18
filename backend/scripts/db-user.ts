import { promises as fs } from 'fs'
import { PrismaClient, TemplateType } from '@prisma/client'
import { hash } from '../src/utils/auth'
import prompts from 'prompts';

const prisma = new PrismaClient()

async function createUsers() {
  var { username } = await prompts({
    type: 'text',
    name: 'username',
    message: 'Enter username'
  });

  var { password } = await prompts({
    type: 'password',
    name: 'password',
    message: 'Enter password'
  });

  var { isAdmin } = await prompts({
    type: 'confirm',
    name: 'isAdmin',
    message: 'Should this user have admin permissions?',
    initial: false
  });

  if (!username || !password) {
    console.error('Username and password are required')
    process.exit(1)
  }

  // Set permissions based on admin selection
  const permissions = isAdmin ? ['admin', 'edit'] : ['edit'];

  // create or update user
  await prisma.user.upsert({
    where: { username },
    update: {
      password: hash(password),
      permission: permissions
    },
    create: {
      username,
      password: hash(password),
      permission: permissions
    }
  })
}

async function main() {
  await createUsers()
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
