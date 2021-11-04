import fs from 'fs-extra';
import path from 'path';
import { optionService } from '../service';

export const deleteDirectory = () => {
  const option = optionService.getOption();
  const root = path.resolve(option.targetDirectory);
  if (fs.existsSync(root)) {
    fs.removeSync(root);
    if (option.verbose) {
      console.log(`删除文件夹：${root}`);
    }
  }
};
