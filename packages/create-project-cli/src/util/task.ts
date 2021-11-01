import Listr from 'listr';
import { DownloadTemplate } from './download-template';
import { Command } from 'commander';
import { initGit } from './git';
import { projectInstall } from 'pkg-install';

export const task = async (args: Command) => {
  const tasks = new Listr([
    {
      title: '下载模版文件',
      task: () => DownloadTemplate(args),
    },
    {
      title: '初始化 git',
      task: () => initGit(args.args[0]),
      enabled: () => args.getOptionValue('git'),
    },
    {
      title: '安装依赖',
      task: () => projectInstall({ cwd: args.args[0] }),
      enabled: () => args.getOptionValue('install'),
    },
  ]);
  await tasks.run();
};
