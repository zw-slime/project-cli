import chalk from 'chalk';
import envinfo from 'envinfo';
import https from 'https';
import semver from 'semver/preload';
import execa from 'execa';
import { configService } from '../service';

export const checkEnv = async (info: boolean, useYarn: boolean, verbose: boolean) => {
  const { name, version } = configService.config.packageJson;
  if (info) {
    // envinfo 提供浏览器版本，Node.js版本，操作系统，编程语言等相关信息
    console.log(chalk.bold('\nEnvironment Info:'));
    console.log(`\n  current version of ${name}: ${version}`);
    console.log(`  running from ${__dirname}`);
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
  const latest = await checkForLatestVersion().catch(async () => {
    try {
      const result = await execa.commandSync(`npm view ${name} version`);
      return result.stdout.toString().trim();
    } catch (e) {
      return null;
    }
  });

  if (verbose) {
    console.log('latest:', latest);
    console.log('cureent version:', version);
  }

  if (latest && semver.lt(version, latest as string)) {
    console.log();
    console.error(
      chalk.yellow(
        `You are running  \`${name}\` ${version}, which is behind the latest release (${latest}).
            Please remove any global installs with one of the following commands：
            - npm uninstall -g ${name}
            - yarn global remove ${name}
            And install again with one of the following commands：
            - npm install -g ${name}
            - yarn global add ${name}
            `,
      ),
    );
    process.exit(1);
  }

  // 检查node 版本
  const unsupportedNodeVersion = !semver.satisfies(
    // Coerce strings with metadata (i.e. `15.0.0-nightly`).
    semver.coerce(process.version) || '',
    '>=14',
  );

  if (unsupportedNodeVersion) {
    console.log(
      chalk.yellow(
        `You are using Node ${process.version}，Please update to Node 14 or higher for a better.`,
      ),
    );
  }

  // 检测npm 或者 yarn 版本
  if (!useYarn) {
    const npmInfo = checkNpmVersion();
    if (!npmInfo.hasMinNpm) {
      if (npmInfo.npmVersion) {
        console.log(
          chalk.yellow(
            `You are using npm ${process.version}，Please update to npm 6 or higher for a better.`,
          ),
        );
      }
    }
  } else {
    const yarnInfo = checkYarnVersion();
    if (yarnInfo.yarnVersion) {
      if (!yarnInfo.hasMinYarnPnp) {
        console.log(
          chalk.yellow(
            `You are using Yarn ${process.version}，Please update to Yarn 1.12 or higher for a better.`,
          ),
        );
      }
    }
  }
};

function checkForLatestVersion() {
  return new Promise((resolve, reject) => {
    https
      .get(`https://registry.npmjs.org/-/package/${name}/dist-tags`, (res) => {
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
    npmVersion = execa.commandSync('npm --version').stdout.toString().trim();
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
    yarnVersion = execa.commandSync('yarnpkg --version').stdout.toString().trim();
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
