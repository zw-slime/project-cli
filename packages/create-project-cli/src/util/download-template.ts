import path from 'path';
import { Command } from 'commander';
import fs from 'fs-extra';
import chalk from 'chalk';
const download = require('download-git-repo');

export const DownloadTemplate = async (args: Command) => {
  const root = path.resolve(args.args[0]);
  if (fs.existsSync(root)) {
    console.error(chalk.red(`${root} 文件夹已存在\n`));
    process.exit(1);
  } else {
    fs.ensureDirSync(root);

    await DownloadForGit(`github.com:zw-slime/vite-react-typescript#master`, root).catch((err) => {
      console.log(err);
      process.exit(1);
    });
  }
};

export const DownloadForGit = (url: string, target: string) => {
  return new Promise((resolve, reject) => {
    download(url, target, { clone: true }, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(target);
      }
    });
  });
};
