import chalk from 'chalk';

import { checkEnv, arg, task, questions } from './main';

async function init() {
  const args = arg();
  await checkEnv(args.getOptionValue('info'), args.getOptionValue('useYarn'));
  await questions(args);
  await task();

  console.log('%s Projects ready', chalk.green.bold('DONE'));
  process.exit(1);
}

init();
