const path = require(`path`);

// Aliases for a better readability in imports
const aliases = {
  '@assets': 'src/assets',
  '@components': 'src/components',
  '@common': 'src/components/common',
  '@pages': 'src/pages',
  '@services': 'src/services',
  '@store': 'src/store',
  '@utils': 'src/utils',
};

const resolvedAliases = Object.fromEntries(
  Object.entries(aliases).map(([key, value]) => [key, path.resolve(__dirname, value)]),
);

module.exports = {
  webpack: {
    alias: resolvedAliases,
  },
  plugins: [
    {
      plugin: require('craco-plugin-scoped-css'),
      options: {
        "include": "/\.scoped\.(sa|sc|c)ss$/",
        hashSeed: "pdffinesseur",
      }
    }
  ],
}