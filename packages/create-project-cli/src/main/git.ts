import execa from 'execa';
import { deleteDirectory } from './delete-directory';
import { optionService } from '../service';

export async function initGit() {
  const option = optionService.getOption();
  const result = await execa('git', ['init'], {
    cwd: option.targetDirectory,
  });
  if (result.failed) {
    deleteDirectory();
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}
