import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import createMergedConfiguration from './webpack.common.config';
import { paths, EnvArgs, Configuration } from './utils';

function createConfiguration(env: EnvArgs): Configuration {
  return {
    // no need to instantiate it with NODE_ENV
    mode: 'production',

    // devtools
    devtool: 'source-map',

    // Where webpack looks to set the development server
    devServer: {
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
      static: paths.build,
    },

    // Customize the webpack build process
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
    ],

    // Determine how modules within the project are treated
    module: {
      rules: [
        // css module files
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  auto: true,
                  localIdentName: '[hash:base64]',
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
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
          exclude: /\.module\.css$/,
        },
      ],
    },
  };
}

export default createMergedConfiguration(createConfiguration);
