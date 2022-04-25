import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import createMergedConfiguration from './webpack.common.config';
import { paths, EnvArgs, Configuration } from './utils';

function createConfiguration(env: EnvArgs): Configuration {
  return {
    // no need to instantiate it with NODE_ENV
    mode: 'development',

    // devtools
    devtool: 'eval-source-map',

    // Where webpack looks to set the development server
    devServer: {
      // port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
      static: {
        directory: paths.public,
      },
      compress: true,
    },

    // Customize the webpack build process
    plugins: [
      // Check Typescript in runtime
      new ForkTsCheckerWebpackPlugin({
        async: false,
      }),

      // Check ESLint in runtime
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        emitError: true,
        emitWarning: false,
        failOnError: false,
        failOnWarning: false,
      }),
    ],

    // Determine how modules within the project are treated
    module: {
      rules: [
        // css module files
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  auto: true,
                  localIdentName: '[name]__[local]',
                  localIdentHashSalt: 'pdffinesseur',
                },
              },
            },
          ],
          include: /\.module\.css$/,
        },

        // regular css files
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          exclude: /\.module\.css$/,
        },
      ],
    },
  };
}

export default createMergedConfiguration(createConfiguration);
