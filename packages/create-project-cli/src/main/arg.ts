import { Command } from 'commander';
import chalk from 'chalk';

import packageJson from '../../package.json';
import fs from 'fs-extra';
import { infoService } from 'service';
import { templates } from 'config';

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

  const template = program.getOptionValue('template');
  const dir = program.args[0];

  if (fs.existsSync(dir)) {
    infoService.error(`Directory ${dir} is existed`);
    process.exit(1);
  }

  if (template && !templates[template]) {
    infoService.error(`Templates ${dir} is not existed`);
    process.exit(1);
  }

  return program;
}
