import { arg, checkEnv, questions, task, infoService } from '@zhangwei-smile/create-project-core';
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';

import packageJson from '../package.json';
import { DocToHtml } from './doc-html';

async function init() {
  const { name, version } = packageJson;
  infoService.start();

  const program = new Command(name)
    .version(version)
    .arguments('<path>')
    .usage(`${chalk.green('<path>')}[options]`)
    .allowUnknownOption()
    .on('--help', () => {
      console.log(`${chalk.green('<path>')} is required`);
    })
    .parse(process.argv);

  const path = program.args[0];

  if (!fs.existsSync(path)) {
    infoService.error(`file ${path} is not existed`);
    process.exit(1);
  }

  const html = await DocToHtml(path);
  console.log(html);

  infoService.end();
  process.exit(1);
}

process.on('exit', function (code) {
  //进行一些清理工作
  infoService.exit();
});

process.on('uncaughtException', function (err) {
  //进行一些清理工作
  infoService.error(`err: ${err.message}`);
});

process.on('SIGINT', function () {
  //进行一些清理工作
  process.exit(1);
});

init();
