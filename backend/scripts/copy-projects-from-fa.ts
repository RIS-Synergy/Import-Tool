import prompts from 'prompts';
import { FundingAgency } from '../src/models/FundingAgency';

// import { importSecretsToProcess } from "../src/utils/secrets";
// importSecretsToProcess()

async function main () {
  const { value } = await prompts({
    message: 'Import Project from Funding Agency (FWF)?',
    type: 'confirm',
    name: 'value'
  });

  if (!value) {
    console.log('Aborted')
    process.exit(0);
  }

  await FundingAgency.copyProjectToDatabase()
}

main()
