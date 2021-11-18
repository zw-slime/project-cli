import execa from 'execa';
import { deleteDirectory } from './delete-directory';
import { configService } from '../service';

export async function initGit() {
  const { targetDirectory } = configService.config.option;
  const result = await execa('git', ['init'], {
    cwd: targetDirectory,
  });
  if (result.failed) {
    console.log(result.stderr);
    deleteDirectory();
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}
