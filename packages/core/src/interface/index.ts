export interface Option {
  info: boolean;
  template: string;
  runInstall: boolean;
  targetDirectory: string;
  templateDirectory: string;
  useYarn: boolean;
  verbose: boolean;
}

export interface PackageJson {
  name: string;
  version: string;
}

export interface Config {
  option: Option;
  packageJson: PackageJson;
  templates: { [key in string]?: string };
}
