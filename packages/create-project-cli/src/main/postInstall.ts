import path from 'path';
import { deleteDirectory } from './delete-directory';
import execa from 'execa';
import { optionService } from '../service';

export const postInstall = async () => {
  const option = optionService.getOption();
  const root = path.resolve(option.targetDirectory);
  const command = option.useYarn ? `yarn` : 'npm';

  const args = option.useYarn ? [`--cwd`, root] : ['install'];

  try {
    await execa(command, args);
    return;
  } catch (e) {
    deleteDirectory();
    process.exit(1);
    return Promise.reject(new Error(`Failed to exec ${command} ${args.join(' ')}`));
  }
};
