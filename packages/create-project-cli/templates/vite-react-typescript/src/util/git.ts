import { execSync } from 'child_process';

export function getGitTag() {
  try {
    const t = execSync('git describe --tags --exact-match');
    return t.toString().trim();
  } catch (e) {
    return '';
  }
}

export function getGitVersion() {
  try {
    const t = execSync('git rev-parse --short=7 HEAD');
    return t.toString().trim();
  } catch (e) {
    return '';
  }
}
