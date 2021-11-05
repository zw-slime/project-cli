import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
const download = require('download-git-repo');

import { templates } from '../config';
import { deleteDirectory } from './delete-directory';
import { optionService } from '../service';

export const downloadTemplate = async () => {
  const option = optionService.getOption();
  const root = path.resolve(option.targetDirectory);
  if (fs.existsSync(root)) {
    return Promise.reject(new Error(chalk.red(`${root} 文件夹已存在\n`)));
  } else {
    // 1. 创建文件夹
    fs.ensureDirSync(root);

    const url = templates[option.template];
    if (!url) {
      deleteDirectory();
      return Promise.reject(new Error(chalk.red(`template ${option.template} is not exit.`)));
    }

    // 2. 从git下载模版
    await downloadFromGit(url, root).catch((err) => {
      deleteDirectory();
      return Promise.reject(err);
    });

    // 3. 修改package.json
    await changeProjectName().catch((err) => {
      deleteDirectory();
      return Promise.reject(err);
    });

    return;
  }
};

export const downloadFromGit = (url: string, target: string) => {
  return new Promise((resolve, reject) => {
    download(url, target, { clone: true }, (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve('ok');
      }
    });
  });
};

export const changeProjectName = () => {
  const option = optionService.getOption();
  return new Promise((resolve, reject) => {
    const root = path.resolve(option.targetDirectory, 'package.json');
    if (!fs.existsSync(root)) {
      deleteDirectory();
      reject(`${chalk.red(root)}文件不存在`);
    }

    try {
      const packageObj = fs.readJSONSync(root);
      packageObj.name = option.targetDirectory;
      const content = JSON.stringify(packageObj, null, 2);
      fs.writeFileSync(root, content);
    } catch (e) {
      reject(e);
    }

    resolve('ok');
  });
};
