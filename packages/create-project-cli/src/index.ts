import { checkEnv } from './util/check-env';
import { arg } from './util/arg';
import { task } from './util/task';
import chalk from 'chalk';

async function init() {
  const args = arg();
  await checkEnv(args);
  await task(args);

  console.log('%s Projects ready', chalk.green.bold('DONE'));
  process.exit(1);
}

init();
