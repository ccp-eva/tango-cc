// Webpack Plugins
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Node
// importing path is not needed anymore
const path = require('path');

const mode = process.env.NODE_ENV || 'development';

// Temporary workaround for 'browserslist' bug that is being patched in the near future
// see: https://github.com/webpack/webpack-dev-server/issues/2758
const target = process.env.NODE_ENV === 'production' ? 'browserslist' : 'web';

// Webpack Configuration
module.exports = {
  mode: mode, // default: production, other: development

  // Single entry point:
  entry: './src/tango.js',

  output: {
    filename: 'tango.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i, // regex: (starts with an s, then either a or c) OR css /i is case insensitive
        use: [
          // note that array’s order of execution is revered. The last one is the one that is executed first.
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ogg|mp3|wav)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.svg$/i,
        type: 'asset/source',
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public/', to: './' }],
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: 'TANGO-CC',
      filename: 'tango.html', // default: index.html
      template: './src/tango.html',
    }),
  ],

  // defaults to "web", so only required for webpack-dev-server bug
  target: target,

  devtool: mode === 'development' ? 'inline-source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, './'), // that should point where you index.html is
    },
    open: { target: ['tango.html'] },
    hot: true, // enable hot reload
    compress: true, // enable gzip compression
    historyApiFallback: true, // enable HTML5 history API
  },

  experiments: {
    topLevelAwait: true,
  },
};
