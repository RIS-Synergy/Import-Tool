import { PrismaClient } from '@prisma/client'
import prompts from 'prompts';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { FundingAgencyService } from '../src/features/funding-agency/services/funding-agency.service.js';

const prisma = new PrismaClient()

interface CreateFAArgs {
  id?: string;
  clientSecret?: string;
  clientId?: string;
  update?: boolean;
  help?: boolean;
}

async function createFA(args: CreateFAArgs) {
  // Handle help
  if (args.help) {
    console.log(`
Usage: create-fa.ts [options]

Options:
--id <id>                ID for the Funding Agency
--clientSecret <secret>  Client Secret for the Funding Agency
--clientId <id>          Client ID for the Funding Agency
--update                 Update existing Funding Agency instead of creating new
--help                   Show this help message
`);
    return;
  }

  // Get id
  let id = args.id;
  if (!id) {
    const response = await prompts({
      type: 'text',
      name: 'id',
      message: 'Enter Funding Agency ID'
    });
    id = response.id;
  }

  // Get clientSecret
  let clientSecret = args.clientSecret;
  if (!clientSecret) {
    const response = await prompts({
      type: 'text',
      name: 'clientSecret',
      message: 'Enter Client Secret'
    });
    clientSecret = response.clientSecret;
  }

  // Get clientId
  let clientId = args.clientId;
  if (!clientId) {
    const response = await prompts({
      type: 'text',
      name: 'clientId',
      message: 'Enter Client ID'
    });
    clientId = response.clientId;
  }

  if (!id) {
    console.error('ID is required')
    process.exit(1)
  }

  // Create Funding Agency service instance
  const faService = new FundingAgencyService();

  try {
    if (args.update) {
      // Update existing Funding Agency
      const updateData: any = {};
      if (clientSecret !== undefined) updateData.clientSecret = clientSecret;
      if (clientId !== undefined) updateData.clientId = clientId;

      const fa = await faService.update(id, updateData);
      console.log(`Funding Agency ${id} has been updated successfully`);
    } else {
      // Create new Funding Agency
      if (!clientSecret || !clientId) {
        console.error('Client Secret and Client ID are required when creating a new Funding Agency')
        process.exit(1)
      }

      const fa = await faService.create({
        id,
        clientSecret,
        clientId,
      });
      console.log(`Funding Agency ${id} has been created successfully`);
    }
  } catch (error) {
    console.error('Error processing Funding Agency:', error);
    process.exit(1);
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('id', {
      type: 'string',
      description: 'ID for the Funding Agency'
    })
    .option('clientSecret', {
      type: 'string',
      description: 'Client Secret for the Funding Agency'
    })
    .option('clientId', {
      type: 'string',
      description: 'Client ID for the Funding Agency'
    })
    .option('update', {
      type: 'boolean',
      description: 'Update existing Funding Agency instead of creating new',
      alias: 'u'
    })
    .option('help', {
      type: 'boolean',
      description: 'Show help message',
      alias: 'h'
    })
    .parse();

  await createFA(argv);
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
