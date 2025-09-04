// import prompts from 'prompts';
import { FundingAgency } from '../src/models/FundingAgency';
import { Registry } from '../src/models/Registry';

async function main () {
  // console.log(process.env.AUTH_SERVER, process.env.AUTH_CLIENT_ID)

  const registry = new Registry()
  await registry.run()

  const agency = new FundingAgency()
  // const projects = await agency.fetchAllPages()
  await agency.copyProjectToDatabase()

  /* tedious to call this every time
  const { value } = await prompts({
    message: 'Import Project from Funding Agency (FWF)?',
    type: 'confirm',
    name: 'value'
  });

  if (!value) {
    console.log('Aborted')
    process.exit(0);
  }
  */

}

main()
