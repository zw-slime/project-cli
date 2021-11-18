import { Config } from '../interface';

export class ConfigService {
  private _config: Config;

  constructor(config: Config) {
    this._config = config;
  }

  get config() {
    return this._config;
  }

  set config(config: Config) {
    this._config = config;
  }
}

export const configService = new ConfigService({
  option: {
    info: false,
    template: '',
    runInstall: false,
    targetDirectory: '',
    templateDirectory: '',
    useYarn: false,
    verbose: false,
  },
  packageJson: { name: '', version: '' },
  templates: {},
});
