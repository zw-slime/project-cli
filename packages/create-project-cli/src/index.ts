import { checkEnv, arg, task, questions } from './main';
import {infoService} from "service";

async function init() {
  infoService.start()
  const args = arg();
  await checkEnv(
    args.getOptionValue('info'),
    args.getOptionValue('useYarn'),
    args.getOptionValue('verbose'),
  );

  process.on("exit",function(code){
    //进行一些清理工作
    infoService.exit()
  });

  process.on("exit",function(code){
    //进行一些清理工作
    infoService.exit()
  });

  await questions(args);
  await task();

  infoService.end()
  process.exit(1);
}

init();
