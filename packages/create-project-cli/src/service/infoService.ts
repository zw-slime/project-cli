import packageJson from '../../package.json';
import chalk from 'chalk';

class InfoService {
  start() {
    console.log(
      `%s You are using ${packageJson.name}@${packageJson.version} now...`,
      chalk.green.bold('START'),
    );
  }

  exit() {
    console.log(
      `%s ${packageJson.name}@${packageJson.version} is exiting...`,
      chalk.green.bold('EXIT'),
    );
  }

  error(message: string) {
    console.log(`%s ${message}`, chalk.red.bold('ERROR'));
  }

  end() {
    console.log('%s Projects ready.', chalk.green.bold('DONE'));
  }

  question(question: string, answer: string) {
    console.log(`${chalk.green('?')} ${question} ? ${chalk.cyan(answer)}`);
  }
}

export const infoService = new InfoService();
