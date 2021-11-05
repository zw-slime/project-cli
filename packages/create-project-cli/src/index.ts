import chalk from 'chalk';
import packageJson from '../package.json';

import { checkEnv, arg, task, questions } from './main';

async function init() {
  console.log(
    `%s You are using ${packageJson.name}@${packageJson.version} now.`,
    chalk.green.bold('START'),
  );
  const args = arg();
  await checkEnv(
    args.getOptionValue('info'),
    args.getOptionValue('useYarn'),
    args.getOptionValue('verbose'),
  );
  await questions(args);
  await task();

  console.log('%s Projects ready.', chalk.green.bold('DONE'));
  process.exit(1);
}

init();
