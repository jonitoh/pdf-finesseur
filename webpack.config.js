const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
    },
    extensions: ['.jsx', '.js', '.css', '.json', 'ts', 'tsx', '...'],
  },
};
/*
const HtmlWebpackPlugin = require("html-webpack-plugin");

"webpack": "webpack",
"webpack-dev-server": "webpack-dev-server",
"dev": "npm run webpack-dev-server -- --env mode=development",
"prod": "npm run webpack -- --env mode=production"

module.exports = ({ mode } = { mode: "production" }) => {
    console.log(`mode is: ${mode}`);

    return {
            mode: mode,
            entry: "./src/index.js",
            output: {
                publicPath: "/",
                path: path.resolve(__dirname, "build"),
                filename: "bundled.js"
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: "./public/index.html"
                }),
            ]
        }
};
*/