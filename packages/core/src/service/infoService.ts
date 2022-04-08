import chalk from 'chalk';
import { configService } from './configService';

class InfoService {
  start(name?: string, version?: string) {
    const { name: name1, version: version1 } = configService.config.packageJson;
    name = name ? name : name1;
    version ? version : version1;
    console.log(`%s You are using ${name}@${version} now...`, chalk.yellowBright.bold('START'));
  }

  exit(name?: string, version?: string) {
    const { name: name1, version: version1 } = configService.config.packageJson;
    name = name ? name : name1;
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
