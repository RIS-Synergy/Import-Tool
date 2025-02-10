import { exec } from 'child_process';

const commands = [
  'getTemplates',
  'getTemplateId',
  'createOrUpdateTemplate',
  'updateTemplate',
  'verifyTemplate',
  'setProjectId',
  'getProjectsList',
  'loadTransformation',
  'getDiffs',
  'submitLogin',
  'updatePassword',
  'searchApi',
  'riReference',
  'getProjectUUID',
  'uploadToPure',
  'searchRIApi',
  'searchAny',
  'riEntityUUID',
  'faApi',
  'diffRILikelihood',
  'assignCluster',
  'getFunction',
  'setFunction',
  'createFunction',
];

const runAgCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    const command = `ag ${cmd} --ignore-case --vimgrep | grep -v "useApiUtils" | grep -v "^composables/" | awk -F: '{print $1}'`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${cmd}: ${error.message}`);
        return resolve();
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      const filteredOutput = stdout.split('\n')
        .filter(line => !line.includes('scripts/refactor-helper.js'))
        .map(line => line.replace('components/', ''))
        .map(line => line.replace('.vue', ''))
        .join('\t');
      console.log(filteredOutput);

      resolve();
    });
  });
};

const runCommandsSequentially = async () => {
  for (const cmd of commands) {
    await runAgCommand(cmd);
  }
};

runCommandsSequentially();
