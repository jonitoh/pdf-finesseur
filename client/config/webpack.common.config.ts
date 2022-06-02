import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import { paths, EnvArgs, Configuration, CreateConfiguration, getAddons } from './utils';

function createCommonConfiguration(env: EnvArgs): Configuration {
  return {
    // Where webpack looks to start building the bundle
    entry: `${paths.src}/index.tsx`,

    // Where webpack outputs the assets and bundles
    output: {
      path: paths.build,
      filename: '[name].bundle.js',
      publicPath: '/',
      clean: true,
    },

    // Customize the webpack build process
    plugins: [
      // Removes/cleans build folders and unused assets when rebuilding
      new CleanWebpackPlugin(),

      // Copies files from target to destination folder
      new CopyWebpackPlugin({
        patterns: [
          // support for non-latin characters with pdfjs
          {
            from: 'node_modules/pdfjs-dist/cmaps/',
            to: 'cmaps/',
            noErrorOnMissing: false,
          },
          // the public folder should become the asset one
          {
            from: paths.assets,
            to: 'assets',
            noErrorOnMissing: true,
          },
          // manage the worker for pdfjs
          {
            from: `${paths.nodeModules}/pdfjs-dist/build/pdf.worker.js`,
            to: `assets/vendors/pdf.worker.js`,
            noErrorOnMissing: false,
          },
        ],
      }),

      // Generates an HTML file from a template
      // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
      new HtmlWebpackPlugin({
        title: 'pdf finesseur',
        // favicon: `${paths.src}/assets/favicon.png`,
        template: `${paths.src}/template.html`, // template file
        filename: `${paths.build}/index.html`, // output file
      }),

      // Load environment variables
      new Dotenv({
        path: `${env.config_path}`,
      }),
    ],

    // Determine how modules within the project are treated
    module: {
      rules: [
        // Typescript: Use TS Loader to transpile TypeScript files
        { test: /\.tsx?$/, exclude: /node_modules/, use: 'ts-loader' },

        // JavaScript: Use Babel to transpile JavaScript files
        { test: /\.jsx?$/, use: ['babel-loader'] },

        // Images: Copy image files to build folder
        { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

        // Fonts: Inline files
        { test: /\.(woff(2)?|eot|ttf|otf|)$/, type: 'asset/inline' },

        // SVGs: Use SVGR to load them
        {
          test: /\.svg$/i,
          type: 'asset',
          resourceQuery: /url/, // *.svg?url
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
          use: ['@svgr/webpack'],
        },
      ],
    },

    resolve: {
      modules: [paths.src, 'node_modules'],
      plugins: [new TsconfigPathsPlugin()],
      extensions: ['.tsx', '.ts', '.js', '.json'],
    },
  };
}

// export default createConfiguration;

export default function createMergedConfiguration(
  createConfiguration: CreateConfiguration
): CreateConfiguration {
  return function createUnifiedConfiguration(env: EnvArgs): Configuration {
    return merge(createCommonConfiguration(env), createConfiguration(env), ...getAddons(env.addon));
  };
}
