import execa from 'execa';

export async function initGit(targetDirectory: string) {
  const result = await execa('git', ['init'], {
    cwd: targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
  return;
}
