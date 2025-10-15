import { PrismaClient } from '@prisma/client'
import prompts from 'prompts';
import yargs from 'yargs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { hideBin } from 'yargs/helpers';
import { CRISService } from '../src/features/cris/services/cris.service.js';

const prisma = new PrismaClient()

interface CreateCRISArgs {
  name?: string;
  apiUrl?: string;
  apiKey?: string;
  domain?: number;
  help?: boolean;
}

async function selectResearchInstitution (args, str) {
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

  // Get research institution domain
  let domain = args.domain;
  if (!domain) {
    const response = await prompts({
      type: 'select',
      name: str,
      message: 'Select the Research Institution',
      choices: institutionChoices,
      initial: institutionChoices.findIndex((choice: any) => choice.value === 'univie.ac.at')
    });
    domain = response.domain;
  }
  return domain
}

async function createCRIS(args: CreateCRISArgs) {
  // Handle help
  if (args.help) {
    console.log(`
Usage: create-cris.ts [options]

Options:
--name <name>          Name for the new CRIS
--apiUrl <apiUrl>      API URL for the CRIS
--apiKey <apiKey>      API Key for the CRIS (optional)
--domain <domain>      Research institution domain, default: univie.ac.at
--help                 Show this help message
`);
    return;
  }

  const domain = await selectResearchInstitution(args, "domain")

  // Get name
  let name = args.name;
  if (!name) {
    const response = await prompts({
      type: 'text',
      name: 'name',
      message: 'Enter CRIS name'
    });
    name = response.name;
  }

  // Get apiUrl
  let apiUrl = args.apiUrl;
  if (!apiUrl) {
    const response = await prompts({
      type: 'text',
      name: 'apiUrl',
      message: 'Enter CRIS API URL'
    });
    apiUrl = response.apiUrl;
  }

  // Get apiKey
  let apiKey = args.apiKey;
  if (apiKey === undefined) {
    const response = await prompts({
      type: 'text',
      name: 'apiKey',
      message: 'Enter CRIS API Key (optional)'
    });
    apiKey = response.apiKey;
  }

  if (!name || !apiUrl || domain === undefined) {
    console.error('Name, API URL, and Research Institution domain are required')
    process.exit(1)
  }

  // Create CRIS service instance
  const crisService = new CRISService();

  try {
    // Create CRIS
    const cris = await crisService.create({
      name,
      apiUrl,
      apiKey: apiKey || '',
    }, domain);

    console.log(`CRIS ${name} has been created successfully with ID: ${cris.id}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error creating CRIS:', error);
    }
    process.exit(1);
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('name', {
      type: 'string',
      description: 'Name for the new CRIS'
    })
    .option('domain', {
      type: 'string',
      description: 'Domain of the research institution (e.g., univie.ac.at)'
    })
    .option('apiUrl', {
      type: 'string',
      description: 'API URL for the CRIS'
    })
    .option('apiKey', {
      type: 'string',
      description: 'API Key for the CRIS (optional)'
    })
    .option('help', {
      type: 'boolean',
      description: 'Show help message',
      alias: 'h'
    })
    .parse();

  await createCRIS(argv);
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
