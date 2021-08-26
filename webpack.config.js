const path                 = require('path');
const webpack              = require('webpack');
const TerserPlugin         = require("terser-webpack-plugin");
const HtmlWebpackPlugin    = require('html-webpack-plugin');

module.exports = {
  context: `${__dirname}/demo`,

  node : {
    __filename : true,
    __dirname  : true,
  },

  entry: {
    index: 'index.js',
  },

  mode: 'production',

  output: {
    path       : `${__dirname}/docs`,
    publicPath : '/',
    filename   : '[name].js',
  },

  module: {
    rules : [{
      test    : /\.js$/,
      loader  : 'babel-loader',
      exclude : /node_modules/,
    }],
  },

  resolve: {
    modules: ['node_modules', 'src', 'demo'],
    extensions: ['*', '.js'],
  },


  plugins: [
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './index.html',
      inject: false,
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
        parallel: true,
      }),
    ],
  },

};
