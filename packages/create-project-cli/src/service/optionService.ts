import { Option } from '../interface';

class OptionService {
  private option: Option;
  constructor(option: Option) {
    this.option = option;
  }
  setOption(option: Option) {
    this.option = option;
  }
  getOption() {
    return this.option;
  }
}

export const optionService = new OptionService({
  info: false,
  template: '',
  runInstall: false,
  targetDirectory: '',
  templateDirectory: '',
  useYarn: false,
  verbose: false,
});
