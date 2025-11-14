import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import '../src//features/cris/cris.cli';

async function main() {
  await yargs(hideBin(process.argv))
    .demandCommand(1, 'You need at least one command')
    .parse();
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
