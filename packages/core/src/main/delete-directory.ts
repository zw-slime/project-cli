import fs from 'fs-extra';
import path from 'path';
import { configService } from '../service';

export const deleteDirectory = (dir?: string) => {
  const { targetDirectory, verbose } = configService.config.option;
  const root = path.resolve(dir ? dir : targetDirectory);
  if (fs.existsSync(root)) {
    fs.removeSync(root);
    if (verbose) {
      console.log(`删除文件夹：${root}`);
    }
  }
};
