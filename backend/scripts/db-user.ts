import { PrismaClient } from '@prisma/client'
import { hash } from '../src/utils/auth'
import prompts from 'prompts';
import { readFile } from 'fs/promises';
import { join } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const prisma = new PrismaClient()

interface CreateUserArgs {
  username?: string;
  password?: string;
  isAdmin?: boolean;
  domain?: string;
  help?: boolean;
}

async function createUsers(args: CreateUserArgs) {
  // Handle help
  if (args.help) {
    console.log(`
Usage: db-user.ts [options]

Options:
  --username <username>    Username for the new user
  --password <password>    Password for the new user
  --isAdmin                Whether the user should have admin permissions
  --domain <domain>        Domain of the research institution (e.g., univie.ac.at)
  --help                   Show this help message
        `);
    return;
  }

  // Read the research institutions from the JSON file
  const domainsPath = join('resources/ri-domains.json');
  const domainsData = await readFile(domainsPath, 'utf-8');
  const domains = JSON.parse(domainsData);

  // Filter out entries with empty domains
  const validDomains = domains.filter((domain: any) => domain.domain && domain.domain.trim() !== '');

  // Prepare choices for the prompt
  const institutionChoices = validDomains.map((domain: any) => ({
    title: `${domain.name} (${domain.domain})`,
    value: domain.domain,
    description: domain.domain
  }));

  // Get username
  let username = args.username;
  if (!username) {
    const response = await prompts({
      type: 'text',
      name: 'username',
      message: 'Enter username'
    });
    username = response.username;
  }

  // Get password
  let password = args.password;
  if (!password) {
    const response = await prompts({
      type: 'password',
      name: 'password',
      message: 'Enter password'
    });
    password = response.password;
  }

  // Get isAdmin
  let isAdmin = args.isAdmin;
  if (isAdmin === undefined) {
    const response = await prompts({
      type: 'confirm',
      name: 'isAdmin',
      message: 'Should this user have admin permissions?',
      initial: false
    });
    isAdmin = response.isAdmin;
  }

  // Get research institution domain
  let domain = args.domain;
  if (!domain) {
    const response = await prompts({
      type: 'select',
      name: 'domain',
      message: 'Select research institution',
      choices: institutionChoices,
      initial: institutionChoices.findIndex((choice: any) => choice.value === 'univie.ac.at')
    });
    domain = response.domain;
  }

  if (!username || !password) {
    console.error('Username and password are required')
    process.exit(1)
  }

  // Set permissions based on admin selection
  const permissions = isAdmin ? ['admin', 'edit'] : ['edit'];

  // Find the research institution ID using the domain
  let researchInstitutionId = null;
  if (domain) {
    const researchInstitution = await prisma.researchInstitution.findFirst({
      where: { domain }
    });

    if (researchInstitution) {
      researchInstitutionId = researchInstitution.id;
    } else {
      console.error('Selected research institution not found in database');
      process.exit(1);
    }
  }

  // create or update user
  await prisma.user.upsert({
    where: { username },
    update: {
      password: hash(password),
      permission: permissions,
      researchInstitutionId: researchInstitutionId
    },
    create: {
      username,
      password: hash(password),
      permission: permissions,
      researchInstitutionId: researchInstitutionId
    }
  });

  console.log(`User ${username} has been ${researchInstitutionId ? 'created/updated' : 'created/updated'} successfully`);
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('username', {
      type: 'string',
      description: 'Username for the new user'
    })
    .option('password', {
      type: 'string',
      description: 'Password for the new user'
    })
    .option('isAdmin', {
      type: 'boolean',
      description: 'Whether the user should have admin permissions'
    })
    .option('domain', {
      type: 'string',
      description: 'Domain of the research institution (e.g., univie.ac.at)'
    })
    .option('help', {
      type: 'boolean',
      description: 'Show help message',
      alias: 'h'
    })
    .parse();

  await createUsers(argv);
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
