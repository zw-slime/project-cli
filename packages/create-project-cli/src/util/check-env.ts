import chalk from 'chalk';
import packageJson from '../../package.json';
import envinfo from 'envinfo';
import https from 'https';
import { execSync } from 'child_process';
import semver from 'semver/preload';
import { Command } from 'commander';

export const checkEnv = async (args: Command) => {
  if (args.getOptionValue('info')) {
    // envinfo 提供浏览器版本，Node.js版本，操作系统，编程语言等相关信息
    console.log(chalk.bold('\n环境信息:'));
    console.log(`\n  CLI版本 ${packageJson.name}: ${packageJson.version}`);
    console.log(`  运行来源 ${__dirname}`);
    const envinfoData = await envinfo.run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'npm', 'Yarn'],
      },
      {
        duplicates: true,
        showNotFound: true,
      },
    );
    console.log(envinfoData);
  }

  // 检测CLI版本
  checkForLatestVersion()
    .catch(() => {
      try {
        return execSync(`npm view ${packageJson.name} version`).toString().trim();
      } catch (e) {
        return null;
      }
    })
    .then((latest) => {
      if (latest && semver.lt(packageJson.version, latest as string)) {
        console.log();
        console.error(
          chalk.yellow(
            `您目前运行的CLI版本 \`${packageJson.name}\` ${packageJson.version}, 落后于最新版本 (${latest}).
            请按照下面的提示，更新版本：
            1. 删除旧版本
            - npm uninstall -g ${packageJson.name}
            - yarn global remove ${packageJson.name}
            2. 安装新版本
             - npm install -g ${packageJson.name}
            - yarn global add ${packageJson.name}
            `,
          ),
        );
        process.exit(1);
      }
    });

  // 检查node 版本
  const unsupportedNodeVersion = !semver.satisfies(
    // Coerce strings with metadata (i.e. `15.0.0-nightly`).
    semver.coerce(process.version) || '',
    '>=14',
  );

  if (unsupportedNodeVersion) {
    console.log(
      chalk.yellow(`您正在使用 Node ${process.version}，请更新至 Node 14 或者更高的版本`),
    );
  }

  // 检测npm 或者 yarn 版本
  if (!args.getOptionValue('useYarn')) {
    const npmInfo = checkNpmVersion();
    if (!npmInfo.hasMinNpm) {
      if (npmInfo.npmVersion) {
        console.log(
          chalk.yellow(`您正在使用 npm ${process.version}，请更新至 npm 6 或者更高的版本`),
        );
      }
    }
  } else {
    const yarnInfo = checkYarnVersion();
    if (yarnInfo.yarnVersion) {
      if (!yarnInfo.hasMinYarnPnp) {
        console.log(
          chalk.yellow(`您正在使用 Yarn ${process.version}，请更新至 Yarn 1.12 或者更高的版本`),
        );
      }
    }
  }
};

function checkForLatestVersion() {
  return new Promise((resolve, reject) => {
    https
      .get(`https://registry.npmjs.org/-/package/${packageJson.name}/dist-tags`, (res) => {
        if (res.statusCode === 200) {
          let body = '';
          res.on('data', (data) => (body += data));
          res.on('end', () => {
            resolve(JSON.parse(body).latest);
          });
        } else {
          reject();
        }
      })
      .on('error', () => {
        reject();
      });
  });
}

function checkNpmVersion() {
  let hasMinNpm = false;
  let npmVersion = null;
  try {
    npmVersion = execSync('npm --version').toString().trim();
    hasMinNpm = semver.gte(npmVersion, '6.0.0');
  } catch (err) {
    // ignore
  }
  return {
    hasMinNpm: hasMinNpm,
    npmVersion: npmVersion,
  };
}

function checkYarnVersion() {
  const minYarnPnp = '1.12.0';
  const maxYarnPnp = '2.0.0';
  let hasMinYarnPnp = false;
  let hasMaxYarnPnp = false;
  let yarnVersion = null;
  try {
    yarnVersion = execSync('yarnpkg --version').toString().trim();
    if (semver.valid(yarnVersion)) {
      hasMinYarnPnp = semver.gte(yarnVersion, minYarnPnp);
      hasMaxYarnPnp = semver.lt(yarnVersion, maxYarnPnp);
    } else {
      // Handle non-semver compliant yarn version strings, which yarn currently
      // uses for nightly builds. The regex truncates anything after the first
      // dash. See #5362.
      const trimmedYarnVersionMatch = /^(.+?)[-+].+$/.exec(yarnVersion);
      if (trimmedYarnVersionMatch) {
        const trimmedYarnVersion = trimmedYarnVersionMatch.pop();
        hasMinYarnPnp = semver.gte(trimmedYarnVersion || '', minYarnPnp);
        hasMaxYarnPnp = semver.lt(trimmedYarnVersion || '', maxYarnPnp);
      }
    }
  } catch (err) {
    // ignore
  }
  return {
    hasMinYarnPnp: hasMinYarnPnp,
    hasMaxYarnPnp: hasMaxYarnPnp,
    yarnVersion: yarnVersion,
  };
}
