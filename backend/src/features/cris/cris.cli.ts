import { Logger } from "@/utils/logger.js";
const log = new Logger({ name: 'cli:cris' });

import yargs from 'yargs';
import { getDiff } from './services/cris.getDiff.service.js';

await yargs(process.argv.slice(3))
  .command(
    'getDiff',
    'Get diff for a CRIS entry',
    (yargs) => {
      return yargs
        .option('cris-id', {
          type: 'number',
          description: 'CRIS ID',
          demandOption: true
        })
        .option('ris-id', {
          type: 'string',
          description: 'RIS ID',
          demandOption: true
        })
        .option('systemName', {
          type: 'string',
          description: 'System name (e.g., Project)',
          demandOption: true
        })
        .option('useCris', {
          type: 'boolean',
          description: 'Include CRIS data',
          default: false
        })
        .option('useSavedTemplate', {
          type: 'boolean',
          description: 'Include saved template data',
          default: false
        });
    },
    async (argv) => {
      try {
        const result = await getDiff(
          argv.risId,
          argv.crisId,
          argv.systemName,
          argv.useSavedTemplate,
          argv.useCris
        );
        log.debug(result)

        return result
      } catch (error) {
        console.error('Error:', error);
        process.exit(1);
      }
    }
  )
  .demandCommand(1, 'You need to specify a command')
  .strict()
  .parse();
