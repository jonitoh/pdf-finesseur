import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export default {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.resolve(__dirname, '..', '..', './dist/report.html'),
      openAnalyzer: false,
    }),
  ],
};
