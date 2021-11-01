import { Command } from 'commander';

import packageJson from '../../package.json';
import chalk from 'chalk';

export function arg() {
  const program = new Command(packageJson.name)
    .version(packageJson.version)
    .arguments('<project-directory>')
    .usage(`${chalk.green('<project-directory>')}[options]`)
    .option('--info', '是否打印环境信息')
    .option('--git', '是否初始化git', true)
    .option('--use-yarn', '是否使用yarn', true)
    .option('--template <path-to-template>', '选择具体的模版')
    .option('-i --install', '是否npm/yarn install', true)
    .allowUnknownOption()
    .on('--help', () => {
      console.log(`${chalk.green('<project-directory>')} 必填项目文件夹名 默认为项目名`);
      console.log();
      console.log(`    自定义模版 ${chalk.cyan('--template')} 包括:`);
      console.log(`      - vite+react+ts+antd: ${chalk.green('vite-react-typescript')}`);
    })
    .parse(process.argv);

  return program;
}
