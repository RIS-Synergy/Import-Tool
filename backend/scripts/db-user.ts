import { promises as fs } from 'fs'
import { PrismaClient, TemplateType } from '@prisma/client'
import { hash } from '../src/utils/auth'
import prompts from 'prompts';

const prisma = new PrismaClient()

// ensure we have extra arguments and if not, show info and quit
// if (process.argv.length <= 2) {
//   // console.error('Usage: node db-user.js <username> <password>')
//   console.error('Usage: node db-user.js')
//   process.exit(1)
// }

// script argument username
// const newUsername = process.argv[2]
// const newPassword = process.argv[3]

// var username
// var password


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

  // console.log(username, password)
  // process.exit(1)

  if (!username || !password) {
    console.error('Username and password are required')
    process.exit(1)
  }

  // create or update user
  await prisma.user.upsert({
    where: { username },
    update: { password: hash(password) },
    create: { username, password: hash(password) }
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
