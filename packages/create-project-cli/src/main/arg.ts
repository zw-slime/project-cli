import { Command } from 'commander';
import chalk from 'chalk';

import packageJson from '../../package.json';

export function arg() {
  const program = new Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')}[options]`)
    .option('--verbose', 'print additional logs')
    .option('--info', 'print environment debug info')
    .option('--use-yarn', 'is or not use yarn')
    .option('--template <path-to-template>', 'specify a template for the created project')
    .option('-i --install', 'is or not npm/yarn install')
    .allowUnknownOption()
    .on('--help', () => {
      console.log(`${chalk.green('<project-directory>')} is required`);
      console.log();
      console.log(`    template ${chalk.cyan('--template')} :`);
      console.log(`      - vite+react+ts+antd: ${chalk.green('vite-react-typescript')}`);
    })
    .parse(process.argv);

  return program;
}
