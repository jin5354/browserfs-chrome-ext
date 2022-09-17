const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, './src/index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './build')
  },
  module: {
    rules: [{
      test: /\.(css|scss|sass)$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'sass-loader',
        },
      ],
    },
    { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
    {
      test: /\.(js|jsx)$/,
      use: [
        {
          loader: 'babel-loader',
        },
      ],
      exclude: /node_modules/,
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  }
}
