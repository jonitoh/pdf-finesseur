import path from 'path';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

type Paths = {
  src: string;
  build: string;
  public: string;
  nodeModules: string;
  assets: string;
};

export const paths: Paths = {
  // Source files
  src: path.resolve(__dirname, '../src'),

  // Production build files
  build: path.resolve(__dirname, '../dist'),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, '../public'),

  // files pointing ti the node modules
  nodeModules: path.resolve(__dirname, '../node_modules'),

  // Static files that get copied to build folder
  assets: path.resolve(__dirname, '../public/assets'),
};

export type EnvArgs = {
  config_path?: string;
  addon?: string;
};

export interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

export function getAddons(addonsArgs: string | undefined | string[]) {
  const addons = Array.isArray(addonsArgs) ? addonsArgs : [addonsArgs];

  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  return addons.filter(Boolean).map((name) => require(`./addons/addon.${name}.ts`));
}

export type CreateConfiguration = (env: EnvArgs) => Configuration;
