import {
  arg,
  checkEnv,
  questions,
  task,
  infoService,
  configService,
} from '@zhangwei-smile/create-project-core';

import packageJson from '../package.json';
import { templates } from './config';

async function init() {
  configService.config = {
    ...configService.config,
    packageJson: { name: packageJson.name, version: packageJson.version },
    templates: templates,
  };
  infoService.start();
  const args = arg();
  await checkEnv(
    args.getOptionValue('info'),
    args.getOptionValue('useYarn'),
    args.getOptionValue('verbose'),
  );

  await questions(args);
  await task();

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
