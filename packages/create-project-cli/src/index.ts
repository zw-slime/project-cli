import { checkEnv, arg, task, questions } from './main';
import { infoService } from 'service';

async function init() {
  infoService.start();
  const args = arg();
  await checkEnv(
    args.getOptionValue('info'),
    args.getOptionValue('useYarn'),
    args.getOptionValue('verbose'),
  );

  await questions(args);
  await task();

  infoService.end();
  process.exit(1);
}

process.on('exit', function (code) {
  //进行一些清理工作
  infoService.exit();
});

process.on('uncaughtException', function (err) {
  //进行一些清理工作
  infoService.error(`err:${err.message}`);
});

process.on('SIGINT', function () {
  //进行一些清理工作
  process.exit(1);
});

init();
