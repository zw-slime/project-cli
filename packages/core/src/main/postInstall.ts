import path from 'path';
import { deleteDirectory } from './delete-directory';
import execa from 'execa';
import { configService } from '../service';

export const postInstall = async () => {
  const { targetDirectory, useYarn } = configService.config.option;
  const root = path.resolve(targetDirectory);
  const command = useYarn ? `yarn` : 'npm';

  const args = useYarn ? [`--cwd`, root] : ['install'];

  try {
    await execa(command, args);
    return;
  } catch (e) {
    console.log(e);
    deleteDirectory();
    return Promise.reject(new Error(`Failed to exec ${command} ${args.join(' ')}`));
  }
};
