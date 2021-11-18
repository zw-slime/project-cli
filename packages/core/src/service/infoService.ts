import chalk from 'chalk';
import { configService } from './configService';

class InfoService {
  start() {
    const { name, version } = configService.config.packageJson;
    console.log(`%s You are using ${name}@${version} now...`, chalk.yellowBright.bold('START'));
  }

  exit() {
    const { name, version } = configService.config.packageJson;
    console.log(`%s ${name}@${version} is exiting...`, chalk.blueBright.bold('EXIT'));
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
