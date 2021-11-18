import inquirer from 'inquirer';
import { Command } from 'commander';

import { configService, infoService } from '../service';

export async function questions(args: Command): Promise<void> {
  const questions = [];
  const template = args.getOptionValue('template');
  const templates = configService.config.templates;
  if (!template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use ?',
      choices: Object.keys(templates),
      default: Object.keys(templates)[0],
    });
  } else {
    infoService.question('Please choose which project template to use', template);
  }

  const useYarn = args.getOptionValue('useYarn');
  if (useYarn === undefined) {
    questions.push({
      type: 'list',
      name: 'useYarn',
      message: 'Please choose npm or yarn ?',
      choices: ['npm', 'yarn'],
      default: 'yarn',
    });
  } else {
    infoService.question('Please choose npm or yarn', useYarn ? 'yarn' : 'npm');
  }

  const install = args.getOptionValue('install');
  if (!install) {
    questions.push({
      type: 'confirm',
      name: 'runInstall',
      message: 'npm/yarn install ?',
      default: false,
    });
  } else {
    infoService.question('npm/yarn install', install ? 'Y' : 'N');
  }

  const answers = await inquirer.prompt(questions);

  configService.config = {
    ...configService.config,
    option: {
      info: args.getOptionValue('info'),
      template: template || answers.template,
      targetDirectory: args.args[0],
      runInstall: install || answers.runInstall,
      templateDirectory: template,
      useYarn: useYarn || answers.useYarn,
      verbose: args.getOptionValue('verbose'),
    },
  };
  return;
}
