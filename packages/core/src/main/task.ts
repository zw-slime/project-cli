import Listr from 'listr';

import { downloadTemplate } from './download-template';
import { initGit } from './git';
import { postInstall } from './postInstall';
import { configService } from '../service';

export const task = async () => {
  const { template, runInstall } = configService.config.option;
  const tasks = new Listr([
    {
      title: 'Download Template',
      task: () => downloadTemplate(),
      enabled: () => !!template,
    },
    {
      title: 'Init Git',
      task: () => initGit(),
    },
    {
      title: 'Install DevDependence',
      task: () => postInstall(),
      enabled: () => runInstall,
    },
  ]);
  await tasks.run();
};
